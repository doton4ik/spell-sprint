import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../icons/Icon'
import { AnswerDiff } from '../practice/AnswerDiff'
import { loadErrorCatalog, type ErrorCatalog } from '../../services/errorPatternService'
import { setPendingPracticeSelection } from '../../services/libraryPractice'
import { getMistakePatterns, isHabit, type MistakePattern } from '../../services/mistakePatterns'
import { getVisibleRules, setPendingRuleFocus } from '../../services/rulesService'
import type { Rule } from '../../types/rules'

function daysAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
}

function Trend({ pattern }: { pattern: MistakePattern }) {
  if (!pattern.previous30) return <span className="pattern-trend">{pattern.last30} in 30 days</span>
  const change = pattern.last30 - pattern.previous30
  return <span className={`pattern-trend pattern-trend--${change < 0 ? 'better' : change > 0 ? 'worse' : 'flat'}`}>{pattern.last30} in 30 days · {change < 0 ? `▼ ${-change} fewer` : change > 0 ? `▲ ${change} more` : 'same as before'}</span>
}

// Mistakes grouped by the reason behind them, with the rule that teaches each one.
export function MistakePatternsView({ revision }: { revision: number }) {
  const [catalog, setCatalog] = useState<ErrorCatalog | null>(null)
  const [rules, setRules] = useState<Rule[]>([])
  useEffect(() => {
    let cancelled = false
    Promise.all([loadErrorCatalog(), getVisibleRules()]).then(([loadedCatalog, loadedRules]) => { if (!cancelled) { setCatalog(loadedCatalog); setRules(loadedRules) } }).catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  const { patterns, unclassified } = useMemo(() => getMistakePatterns(catalog?.confusableSets ?? []), [revision, catalog])
  const rulesById = useMemo(() => new Map(rules.map((rule) => [rule.id, rule])), [rules])

  if (!patterns.length) return <p className="patterns-empty">No spelling patterns yet. Patterns appear once you make spelling mistakes in practice.{unclassified ? ` ${unclassified} mistake${unclassified === 1 ? '' : 's'} did not match a known pattern.` : ''}</p>

  return (
    <section className="patterns-list" aria-label="Mistake patterns">
      <p className="patterns-intro">Grouped by the reason behind each mistake. A pattern in <strong>two or more different words</strong> is a habit worth a rule; a single word is usually just a slip.</p>
      {patterns.map((pattern) => {
        const linked = (catalog?.ruleIdsByPattern.get(pattern.slug) ?? []).map((id) => rulesById.get(id)).filter((rule): rule is Rule => Boolean(rule))
        return (
          <article className={`pattern-card${isHabit(pattern) ? ' pattern-card--habit' : ''}`} key={pattern.slug}>
            <div className="pattern-card__head">
              <div>
                <h3>{pattern.label}</h3>
                <p>{pattern.hint}</p>
              </div>
              <span className={isHabit(pattern) ? 'pattern-badge pattern-badge--habit' : 'pattern-badge'}>{isHabit(pattern) ? 'Habit' : 'One word'}</span>
            </div>
            <dl className="pattern-card__stats">
              <div><dt>Mistakes</dt><dd>{pattern.errors}</dd></div>
              <div><dt>Words</dt><dd>{pattern.words.length}</dd></div>
              <div><dt>Now correct</dt><dd>{pattern.recovered}/{pattern.words.length}</dd></div>
              <div><dt>Last seen</dt><dd>{daysAgo(pattern.lastSeen)}</dd></div>
            </dl>
            <Trend pattern={pattern} />
            <ul className="pattern-card__examples">{pattern.examples.map((example) => <li key={example.expected}><AnswerDiff expected={example.expected} submitted={example.submitted} /></li>)}</ul>
            <div className="pattern-card__actions">
              {linked.map((rule) => <button type="button" className="mistake-rule-link" onClick={() => { setPendingRuleFocus(rule.id); window.location.hash = 'rules' }} key={rule.id}><Icon name="rules" size={15} /> {rule.title}</button>)}
              {pattern.wordIds.length ? <button type="button" className="quiet-button" onClick={() => { setPendingPracticeSelection({ wordIds: pattern.wordIds, label: `Pattern: ${pattern.label}`, mode: 'write-en' }); window.location.hash = 'practice' }}><Icon name="practice" size={15} /> Practise these words</button> : null}
            </div>
          </article>
        )
      })}
      {unclassified ? <p className="patterns-empty">{unclassified} more mistake{unclassified === 1 ? '' : 's'} did not match a known pattern — you can link them to a rule on the Rules page.</p> : null}
    </section>
  )
}
