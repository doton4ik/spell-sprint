import { useEffect, useMemo, useState } from 'react'
import { errorPatternLabel } from '../../data/errorPatternLabels'
import { loadErrorCatalog, ruleIdsFromClassification } from '../../services/errorPatternService'
import { classifyMistake, type Classification } from '../../services/mistakeClassifier'
import { getRuleIdsForWord, getVisibleRules, setPendingRuleFocus } from '../../services/rulesService'
import type { Rule } from '../../types/rules'
import { Icon } from '../icons/Icon'
import { buildSegments, Letters } from './AnswerDiff'

type MistakeBreakdownProps = { expected: string; submitted: string; taskType: string; wordId?: string; showRules: boolean; onChallenge?: (rules: Rule[]) => void }

export function MistakeBreakdown({ expected, submitted, taskType, wordId, showRules, onChallenge }: MistakeBreakdownProps) {
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
        <>
        {/* Mistake Lab: the rule itself, right where the mistake is, before any click. */}
        <div className="mistake-breakdown__explain">
          <strong>{rules[0].title}</strong>
          <p>{rules[0].shortExplanation}</p>
          {rules[0].mnemonic ? <p className="mistake-breakdown__cue"><Icon name="lightbulb" size={15} /> {rules[0].mnemonic}</p> : null}
        </div>
        <div className="mistake-breakdown__rules">
          {rules.map((rule) => <button type="button" className="mistake-rule-link" onClick={() => { setPendingRuleFocus(rule.id); window.location.hash = 'rules' }} key={rule.id}><Icon name="rules" size={15} /> Rule: {rule.title} <Icon name="arrow" size={14} /></button>)}
          {onChallenge ? <button type="button" className="mistake-rule-link mistake-rule-link--challenge" onClick={() => onChallenge(rules)}><Icon name="bolt" size={15} /> Try the rule on a new word</button> : null}
        </div>
        </>
      ) : null}
    </div>
  )
}
