import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../icons/Icon'
import { AnswerDiff } from '../practice/AnswerDiff'
import { guideFor } from '../../data/mistakeGuides'
import { loadErrorCatalog, type ErrorCatalog } from '../../services/errorPatternService'
import { setPendingPracticeSelection } from '../../services/libraryPractice'
import { getMistakePatterns, isHabit, type MistakePattern } from '../../services/mistakePatterns'
import { getVisibleRules, setPendingRuleFocus } from '../../services/rulesService'
import type { Rule } from '../../types/rules'

function daysAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
}
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
const cardId = (slug: string) => `problem-${slug.replace(/[^a-z0-9]+/gi, '-')}`

function Trend({ pattern }: { pattern: MistakePattern }) {
  if (!pattern.previous30) return <span className="pattern-trend">{pattern.last30} in 30 days</span>
  const change = pattern.last30 - pattern.previous30
  return (
    <span className={`pattern-trend pattern-trend--${change < 0 ? 'better' : change > 0 ? 'worse' : 'flat'}`}>
      {pattern.last30} in 30 days · {change < 0 ? `▼ ${-change} fewer` : change > 0 ? `▲ ${change} more` : 'same as before'}
    </span>
  )
}

// "3 mistakes in 2 words · most often: rr→r ×2"
function Summary({ pattern }: { pattern: MistakePattern }) {
  return (
    <p className="problem-summary">
      {plural(pattern.errors, 'mistake')} in {plural(pattern.words.length, 'word')}
      {pattern.focus.length ? (
        <>
          {' '}
          · {pattern.errors > 1 ? 'most often:' : ''}{' '}
          {pattern.focus.map((item) => (
            <b key={item.detail}>
              {item.detail}
              {item.count > 1 ? ` ×${item.count}` : ''}
            </b>
          ))}
        </>
      ) : null}
    </p>
  )
}

// My Mistakes → "Problems & rules": the learner's own mistakes, grouped by the reason behind them.
// Top: a short sheet of personal rules (one per habit). Below: each problem explained in detail.
export function MistakePatternsView({ revision }: { revision: number }) {
  const [catalog, setCatalog] = useState<ErrorCatalog | null>(null)
  const [rules, setRules] = useState<Rule[]>([])
  useEffect(() => {
    let cancelled = false
    Promise.all([loadErrorCatalog(), getVisibleRules()])
      .then(([loadedCatalog, loadedRules]) => {
        if (!cancelled) {
          setCatalog(loadedCatalog)
          setRules(loadedRules)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const { patterns, unclassified } = useMemo(() => getMistakePatterns(catalog?.confusableSets ?? []), [revision, catalog])
  const rulesById = useMemo(() => new Map(rules.map((rule) => [rule.id, rule])), [rules])

  if (!patterns.length)
    return (
      <p className="patterns-empty">
        Nothing to analyse yet. Your problems and personal rules appear here once you make a few spelling or grammar mistakes in practice or
        Proofreading.{unclassified ? ` ${plural(unclassified, 'mistake')} did not match a known pattern.` : ''}
      </p>
    )

  const habits = patterns.filter(isHabit)
  const slips = patterns.filter((pattern) => !isHabit(pattern))
  const sheet = (habits.length ? habits : patterns).slice(0, 6)
  const linkedRules = (pattern: MistakePattern) =>
    (catalog?.ruleIdsByPattern.get(pattern.slug) ?? []).map((id) => rulesById.get(id)).filter((rule): rule is Rule => Boolean(rule))
  const show = (slug: string) => {
    const card = document.getElementById(cardId(slug))
    if (!card) return
    if (card.closest('details')) (card.closest('details') as HTMLDetailsElement).open = true
    card.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="report">
      <section className="report-sheet" aria-labelledby="report-sheet-title">
        <span className="report-step">Step 1</span>
        <h2 id="report-sheet-title">Your rules</h2>
        <p>
          {habits.length
            ? `Made from your own mistakes. Each rule covers a habit — a mistake you repeat in different words. Learn these ${plural(sheet.length, 'rule')} first.`
            : 'No habits yet: each of these mistakes happened in one word only. The rules below are worth a look anyway.'}
        </p>
        <ol>
          {sheet.map((pattern) => (
            <li key={pattern.slug}>
              <strong>{guideFor(pattern.slug)?.rule ?? pattern.hint}</strong>
              <span>
                {pattern.label} · {plural(pattern.errors, 'mistake')}: {pattern.words.slice(0, 4).join(', ')}
                {pattern.words.length > 4 ? '…' : ''}
              </span>
              <button type="button" className="report-sheet__more" onClick={() => show(pattern.slug)}>
                Explain <Icon name="chevron" size={13} />
              </button>
            </li>
          ))}
        </ol>
      </section>

      <header className="report-head">
        <span className="report-step">Step 2</span>
        <h2>Your problems in detail</h2>
        <p>What goes wrong, why it happens and how to check yourself. Habits come first; single-word slips are at the bottom.</p>
      </header>
      <section className="patterns-list" aria-label="Problems">
        {habits.map((pattern) => (
          <ProblemCard pattern={pattern} rules={linkedRules(pattern)} key={pattern.slug} />
        ))}
      </section>

      {slips.length ? (
        <details className="report-slips" open={!habits.length}>
          <summary>
            One-off slips · {plural(slips.length, 'pattern')} <small>a mistake in one word only — probably not a habit yet</small>
          </summary>
          <section className="patterns-list">
            {slips.map((pattern) => (
              <ProblemCard pattern={pattern} rules={linkedRules(pattern)} key={pattern.slug} />
            ))}
          </section>
        </details>
      ) : null}
      {unclassified ? (
        <p className="patterns-empty">
          {plural(unclassified, 'more mistake')} did not match a known pattern — you can link them to a rule on the Rules page.
        </p>
      ) : null}
    </div>
  )
}

function ProblemCard({ pattern, rules }: { pattern: MistakePattern; rules: Rule[] }) {
  const guide = guideFor(pattern.slug)
  const habit = isHabit(pattern)
  return (
    <article className={`pattern-card${habit ? ' pattern-card--habit' : ''}`} id={cardId(pattern.slug)}>
      <div className="pattern-card__head">
        <div>
          <h3>{pattern.label}</h3>
          <Summary pattern={pattern} />
        </div>
        <span className={habit ? 'pattern-badge pattern-badge--habit' : 'pattern-badge'}>{habit ? 'Habit' : 'One word'}</span>
      </div>

      <div className="problem-rule">
        <span>Your rule</span>
        <p>{guide?.rule ?? pattern.hint}</p>
      </div>

      <div className="problem-words">
        <span>Your mistakes</span>
        <ul className="pattern-card__examples">
          {pattern.examples.map((example) => (
            <li key={example.expected}>
              <AnswerDiff expected={example.expected} submitted={example.submitted} />
            </li>
          ))}
        </ul>
      </div>

      {guide ? (
        <details className="problem-explain">
          <summary>Why it happens and how to check</summary>
          <dl>
            <div>
              <dt>What goes wrong</dt>
              <dd>{guide.what}</dd>
            </div>
            <div>
              <dt>Why</dt>
              <dd>{guide.why}</dd>
            </div>
            <div>
              <dt>Check yourself</dt>
              <dd>{guide.check}</dd>
            </div>
            {guide.examples.length ? (
              <div>
                <dt>Remember</dt>
                <dd className="problem-explain__examples">
                  {guide.examples.map((example) => (
                    <span key={example}>{example}</span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </details>
      ) : null}

      <dl className="pattern-card__stats">
        <div>
          <dt>Mistakes</dt>
          <dd>{pattern.errors}</dd>
        </div>
        <div>
          <dt>Words</dt>
          <dd>{pattern.words.length}</dd>
        </div>
        <div>
          <dt>Now correct</dt>
          <dd>
            {pattern.recovered}/{pattern.words.length}
          </dd>
        </div>
        <div>
          <dt>Last seen</dt>
          <dd>{daysAgo(pattern.lastSeen)}</dd>
        </div>
      </dl>
      <Trend pattern={pattern} />

      <div className="pattern-card__actions">
        {pattern.wordIds.length ? (
          <button
            type="button"
            className="quiet-button"
            onClick={() => {
              setPendingPracticeSelection({ wordIds: pattern.wordIds, label: `Problem: ${pattern.label}`, mode: 'write-en' })
              window.location.hash = 'practice'
            }}
          >
            <Icon name="practice" size={15} /> Practise these words
          </button>
        ) : null}
        {rules.map((rule) => (
          <button
            type="button"
            className="mistake-rule-link"
            onClick={() => {
              setPendingRuleFocus(rule.id)
              window.location.hash = 'rules'
            }}
            key={rule.id}
          >
            <Icon name="rules" size={15} /> Exercises: {rule.title}
          </button>
        ))}
      </div>
    </article>
  )
}
