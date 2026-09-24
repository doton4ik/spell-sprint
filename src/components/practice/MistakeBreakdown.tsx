import { useEffect, useMemo, useState } from 'react'
import { errorPatternLabel } from '../../data/errorPatternLabels'
import { loadErrorCatalog, ruleIdsFromClassification } from '../../services/errorPatternService'
import { classifyMistake, type Classification } from '../../services/mistakeClassifier'
import { getRuleIdsForWord, getVisibleRules, setPendingRuleFocus } from '../../services/rulesService'
import type { EditOp } from '../../services/spellDiff'
import type { Rule } from '../../types/rules'
import { Icon } from '../icons/Icon'

type Segment = { char: string; kind: 'same' | 'bad' | 'fix' | 'swap' | 'gap' }

// Turns the edit operations into two coloured letter rows: what the learner wrote, and the correct word.
function buildSegments(expected: string, submitted: string, ops: EditOp[]) {
  const expectedKinds = new Map<number, Segment['kind']>()
  const submittedKinds = new Map<number, Segment['kind']>()
  const gapsBefore = new Map<number, number>()
  for (const op of ops) {
    if (op.type === 'delete') { expectedKinds.set(op.expectedIndex, 'fix'); gapsBefore.set(op.submittedIndex, (gapsBefore.get(op.submittedIndex) ?? 0) + 1) }
    if (op.type === 'insert') submittedKinds.set(op.submittedIndex, 'bad')
    if (op.type === 'substitute') { expectedKinds.set(op.expectedIndex, 'fix'); submittedKinds.set(op.submittedIndex, 'bad') }
    if (op.type === 'transpose') {
      for (const offset of [0, 1]) { expectedKinds.set(op.expectedIndex + offset, 'swap'); submittedKinds.set(op.submittedIndex + offset, 'swap') }
    }
  }
  const expectedChars = Array.from(expected).map((char, index): Segment => ({ char, kind: expectedKinds.get(index) ?? 'same' }))
  const submittedChars: Segment[] = []
  Array.from(submitted).forEach((char, index) => {
    for (let gap = 0; gap < (gapsBefore.get(index) ?? 0); gap += 1) submittedChars.push({ char: '_', kind: 'gap' })
    submittedChars.push({ char, kind: submittedKinds.get(index) ?? 'same' })
  })
  for (let gap = 0; gap < (gapsBefore.get(Array.from(submitted).length) ?? 0); gap += 1) submittedChars.push({ char: '_', kind: 'gap' })
  return { expectedChars, submittedChars }
}

function Letters({ segments }: { segments: Segment[] }) {
  return <span className="diff-word">{segments.map((segment, index) => <span className={`diff-char diff-char--${segment.kind}`} key={index}>{segment.char === ' ' ? ' ' : segment.char}</span>)}</span>
}

type MistakeBreakdownProps = { expected: string; submitted: string; taskType: string; wordId?: string; showRules: boolean }

export function MistakeBreakdown({ expected, submitted, taskType, wordId, showRules }: MistakeBreakdownProps) {
  const local = useMemo(() => classifyMistake(expected, submitted, { taskType }), [expected, submitted, taskType])
  const [classification, setClassification] = useState<Classification>(local)
  const [rules, setRules] = useState<Rule[]>([])

  // Upgrade the local result with the confusable-word rules and find the rules that teach this mistake.
  useEffect(() => {
    let cancelled = false
    setClassification(local)
    void (async () => {
      const catalog = await loadErrorCatalog()
      const full = classifyMistake(expected, submitted, { taskType, confusableSets: catalog.confusableSets })
      const ids = new Set([...ruleIdsFromClassification(full, catalog), ...await getRuleIdsForWord(wordId ?? '')])
      const visible = ids.size && showRules ? (await getVisibleRules()).filter((rule) => ids.has(rule.id)) : []
      if (!cancelled) { setClassification(full); setRules(visible) }
    })()
    return () => { cancelled = true }
  }, [local, expected, submitted, taskType, wordId, showRules])

  const technicalOnly = classification.technical.some((tag) => tag.slug === 'blank_answer' || tag.slug === 'wrong_word')
  const { expectedChars, submittedChars } = useMemo(() => buildSegments(expected.trim().toLocaleLowerCase(), submitted.trim().toLocaleLowerCase(), classification.ops), [expected, submitted, classification.ops])
  const patterns = classification.learning.filter((tag) => tag.slug !== 'unclassified')
  const shown = patterns.length ? patterns : classification.technical

  if (technicalOnly && !rules.length) return null
  return (
    <div className="mistake-breakdown">
      {!technicalOnly && classification.ops.length ? (
        <div className="mistake-breakdown__diff">
          <div><span className="diff-label">You wrote</span><Letters segments={submittedChars} /></div>
          <div><span className="diff-label">Correct</span><Letters segments={expectedChars} /></div>
        </div>
      ) : null}
      {shown.length ? <div className="mistake-breakdown__tags">{shown.map((tag) => <span className="mistake-tag" title={errorPatternLabel(tag.slug).hint} key={tag.slug}>{errorPatternLabel(tag.slug).label}</span>)}</div> : null}
      {rules.length ? (
        <div className="mistake-breakdown__rules">
          {rules.map((rule) => <button type="button" className="mistake-rule-link" onClick={() => { setPendingRuleFocus(rule.id); window.location.hash = 'rules' }} key={rule.id}><Icon name="rules" size={15} /> Rule: {rule.title} <Icon name="arrow" size={14} /></button>)}
        </div>
      ) : null}
    </div>
  )
}
