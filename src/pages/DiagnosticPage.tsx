import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { AnswerDiff } from '../components/practice/AnswerDiff'
import { CheckRunner } from '../components/level/CheckRunner'
import { getAllWords } from '../services/libraryStorage'
import { LevelPicture } from '../components/level/LevelPicture'
import { buildLevelBank, skillLabels } from '../data/levelCheckBank'
import {
  buildPlan,
  clearRun,
  getLevelChecks,
  levelLabel,
  loadRun,
  nextCheckDue,
  skillOrder,
  TOTAL_QUESTIONS,
  type LevelCheckResult,
  type PlanStep,
  type SavedRun,
} from '../services/levelCheck'
import { subscribeToLearningData } from '../services/learningData'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import './level-check.css'

const skills = skillOrder
const levelNames = ['A2', 'B1', 'B2', 'C1']
const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))

function daysAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
}

type View = { kind: 'home' } | { kind: 'running'; resume: SavedRun | null } | { kind: 'result'; id: string }

export function DiagnosticPage() {
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  const checks = useMemo(getLevelChecks, [revision])
  const [view, setView] = useState<View>({ kind: 'home' })

  if (view.kind === 'running')
    return (
      <CheckRunner
        resume={view.resume}
        onQuit={() => setView({ kind: 'home' })}
        onFinish={(result) => {
          setRevision((value) => value + 1)
          setView({ kind: 'result', id: result.id })
        }}
      />
    )
  if (view.kind === 'result') {
    const index = checks.findIndex((check) => check.id === view.id)
    if (index >= 0)
      return (
        <ResultView
          result={checks[index]}
          previous={checks[index + 1]}
          checks={checks}
          onBack={() => setView({ kind: 'home' })}
          onRetake={() => setView({ kind: 'running', resume: null })}
        />
      )
  }
  const saved = loadRun()
  return (
    <HomeView
      checks={checks}
      saved={saved}
      onStart={() => {
        clearRun()
        setView({ kind: 'running', resume: null })
      }}
      onResume={() => setView({ kind: 'running', resume: saved })}
      onOpen={(id) => setView({ kind: 'result', id })}
    />
  )
}

// ---- Start screen and history ----------------------------------------------------------------
function HomeView({
  checks,
  saved,
  onStart,
  onResume,
  onOpen,
}: {
  checks: LevelCheckResult[]
  saved: SavedRun | null
  onStart: () => void
  onResume: () => void
  onOpen: (id: string) => void
}) {
  const last = checks[0]
  const { due, date } = nextCheckDue(checks)
  return (
    <div className="level-page" id="level-check">
      <section className="level-hero">
        <div>
          <h1>Where is your English now?</h1>
          <div className="level-hero__meta">
            <span>
              <Icon name="check" size={15} /> {TOTAL_QUESTIONS} questions
            </span>
            <span>
              <Icon name="calendar" size={15} /> about {Math.round((TOTAL_QUESTIONS * 0.65) / 5) * 5} minutes
            </span>
            <span>
              <Icon name="rules" size={15} /> reading · listening · grammar · vocabulary · spelling
            </span>
          </div>
          {saved ? (
            <div className="level-hero__resume">
              <button className="check-button level-hero__start" type="button" onClick={onResume}>
                <Icon name="practice" size={17} /> Continue · {saved.answers.length} of {saved.plan.length}
              </button>
              <button className="quiet-button" type="button" onClick={onStart}>
                Start over
              </button>
            </div>
          ) : (
            <button className="check-button level-hero__start" type="button" onClick={onStart}>
              <Icon name="practice" size={17} /> {last ? 'Start a new check' : 'Start the check'}
            </button>
          )}
          {last ? (
            <p className="level-hero__next">
              {due ? 'It has been a month — a good time to measure your progress.' : `Next check recommended around ${formatDate(date!)}.`}
            </p>
          ) : null}
        </div>
        {last ? (
          <button className="level-hero__last" type="button" onClick={() => onOpen(last.id)}>
            <span>Your last result · {daysAgo(last.completedAt)}</span>
            <strong>{last.overall.level}</strong>
            <div>
              {skills
                .filter((skill) => last.skills[skill])
                .map((skill) => (
                  <small key={skill}>
                    {skillLabels[skill]} <b>{last.skills[skill]?.level}</b>
                  </small>
                ))}
            </div>
            <em>
              See details <Icon name="arrow" size={14} />
            </em>
          </button>
        ) : null}
      </section>

      <LevelPicture />

      {checks.length ? <History checks={checks} onOpen={onOpen} /> : null}
    </div>
  )
}

function History({ checks, onOpen }: { checks: LevelCheckResult[]; onOpen: (id: string) => void }) {
  return (
    <section className="level-history">
      <div className="level-section-head">
        <h2>Your progress</h2>
        <span>
          {checks.length} check{checks.length === 1 ? '' : 's'}
        </span>
      </div>
      {checks.length > 1 ? (
        <ProgressChart checks={checks} />
      ) : (
        <p className="level-muted">Take another check later to see how each skill moves.</p>
      )}
      <div className="level-history__list">
        {checks.map((check, index) => {
          const previous = checks[index + 1]
          const delta = previous ? Math.round((check.overall.ability - previous.overall.ability) * 10) / 10 : null
          return (
            <button className="level-history__row" type="button" onClick={() => onOpen(check.id)} key={check.id}>
              <span className="level-history__date">{formatDate(check.completedAt)}</span>
              <strong className="level-badge">{check.overall.level}</strong>
              <span className="level-history__skills">
                {skills
                  .filter((skill) => check.skills[skill])
                  .map((skill) => (
                    <small key={skill}>
                      {skillLabels[skill].slice(0, 5)}. {check.skills[skill]?.level}
                    </small>
                  ))}
              </span>
              {delta !== null ? <Delta value={delta} /> : <span />}
              <Icon name="chevron" size={16} />
            </button>
          )
        })}
      </div>
    </section>
  )
}

function Delta({ value }: { value: number }) {
  if (Math.abs(value) < 0.1) return <span className="level-delta level-delta--flat">no change</span>
  return <span className={`level-delta level-delta--${value > 0 ? 'up' : 'down'}`}>{value > 0 ? '▲ higher' : '▼ lower'}</span>
}

// Ability over time, one line per skill, oldest on the left. Up to the last 8 checks.
function ProgressChart({ checks }: { checks: LevelCheckResult[] }) {
  const points = [...checks].slice(0, 8).reverse()
  const width = 560,
    height = 170,
    left = 34,
    right = 12,
    top = 12,
    bottom = 26
  const x = (index: number) => left + (points.length === 1 ? 0 : (index / (points.length - 1)) * (width - left - right))
  const y = (ability: number) => top + (1 - (ability - 0.5) / 4) * (height - top - bottom)
  return (
    <figure className="level-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Level per skill over your checks">
        {levelNames.map((name, index) => (
          <g key={name}>
            <line x1={left} x2={width - right} y1={y(index + 1)} y2={y(index + 1)} className="level-chart__grid" />
            <text x={4} y={y(index + 1) + 4} className="level-chart__axis">
              {name}
            </text>
          </g>
        ))}
        {points.map((check, index) => (
          <text key={check.id} x={x(index)} y={height - 6} textAnchor="middle" className="level-chart__axis">
            {new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(check.completedAt))}
          </text>
        ))}
        {skills.map((skill) => {
          const own = points.flatMap((check, index) =>
            check.skills[skill] ? [{ check, index, ability: check.skills[skill].ability }] : [],
          )
          if (!own.length) return null
          return (
            <g key={skill} className={`level-chart__line level-chart__line--${skill}`}>
              <polyline points={own.map(({ index, ability }) => `${x(index)},${y(ability)}`).join(' ')} fill="none" />
              {own.map(({ check, index, ability }) => (
                <circle key={check.id} cx={x(index)} cy={y(ability)} r={3.5} />
              ))}
            </g>
          )
        })}
      </svg>
      <figcaption>
        {skills
          .filter((skill) => points.some((check) => check.skills[skill]))
          .map((skill) => (
            <span className={`level-legend level-legend--${skill}`} key={skill}>
              {skillLabels[skill]}
            </span>
          ))}
      </figcaption>
    </figure>
  )
}

// ---- Result -----------------------------------------------------------------------------------
function startPractice(step: PlanStep) {
  if (step.action.href) {
    window.location.hash = step.action.href.slice(1)
    return
  }
  if (!step.action.words?.length) return
  setPendingPracticeSelection({
    wordIds: step.action.words.map((word) => word.wordId),
    label: step.action.practiceLabel ?? step.title,
    mode: 'write-en',
  })
  window.location.hash = 'practice'
}

function ResultView({
  result,
  previous,
  checks,
  onBack,
  onRetake,
}: {
  result: LevelCheckResult
  previous?: LevelCheckResult
  checks: LevelCheckResult[]
  onBack: () => void
  onRetake: () => void
}) {
  const plan = useMemo(() => buildPlan(result), [result])
  const mistakes = result.answers.filter((answer) => !answer.correct)
  const itemById = useMemo(() => new Map(buildLevelBank(getAllWords()).map((entry) => [entry.id, entry])), [])
  const isLatest = checks[0]?.id === result.id
  return (
    <div className="level-page" id="level-check">
      <button className="level-back" type="button" onClick={onBack}>
        <Icon name="chevron" size={15} /> All checks
      </button>
      <section className="level-result-hero">
        <div>
          <p className="eyebrow">Level check · {formatDate(result.completedAt)}</p>
          <h1>Your level: {levelLabel(result.overall)}</h1>
          <p>
            {previous ? (
              <>
                Compared with {formatDate(previous.completedAt)}:{' '}
                <Delta value={Math.round((result.overall.ability - previous.overall.ability) * 10) / 10} />
              </>
            ) : (
              'This is your starting point. Take another check in about a month to see how it moves.'
            )}
          </p>
        </div>
      </section>

      <section className="level-skills">
        {skills.map((skill) => {
          const value = result.skills[skill]
          if (!value) return null
          const before = previous?.skills[skill]
          const [low, high] = (value.range ?? `${value.level}–${value.level}`).split('–')
          const shown = (name: string) =>
            levelNames.indexOf(name) >= levelNames.indexOf(low) && levelNames.indexOf(name) <= levelNames.indexOf(high)
          return (
            <article className="level-skill" key={skill}>
              <div className="level-skill__head">
                <span>{skillLabels[skill]}</span>
                {before ? <Delta value={Math.round((value.ability - before.ability) * 10) / 10} /> : null}
              </div>
              <strong>{levelLabel(value)}</strong>
              <div className="level-skill__scale" aria-label={`${skillLabels[skill]}: ${levelLabel(value)}`}>
                {levelNames.map((name) => (
                  <span className={shown(name) ? 'level-skill__step level-skill__step--on' : 'level-skill__step'} key={name}>
                    {name}
                  </span>
                ))}
              </div>
              <small>
                {value.correct} of {value.total} right{before ? ` · was ${before.level}` : ''}
              </small>
            </article>
          )
        })}
      </section>

      {isLatest && plan.length ? (
        <section className="level-plan">
          <div className="level-section-head">
            <h2>Your next steps</h2>
            <span>picked from this result</span>
          </div>
          <ol>
            {plan.map((step, index) => (
              <li key={step.title}>
                <span className="level-plan__number">{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
                <button className={index === 0 ? 'check-button' : 'quiet-button'} type="button" onClick={() => startPractice(step)}>
                  {step.action.label} <Icon name="arrow" size={15} />
                </button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {mistakes.length ? (
        <section className="level-mistakes">
          <div className="level-section-head">
            <h2>What went wrong</h2>
            <span>
              {mistakes.length} of {result.answers.length}
            </span>
          </div>
          <ul>
            {mistakes.map((answer) => (
              <li key={answer.itemId}>
                <span className="level-mistakes__skill">{skillLabels[answer.skill]}</span>
                {itemById.get(answer.itemId)?.kind === 'dictation' ? null : <span className="level-mistakes__prompt">{answer.prompt}</span>}
                <span className="level-mistakes__diff">
                  {itemById.get(answer.itemId)?.kind === 'choice' ? (
                    <>
                      {answer.answer ? <s>{answer.answer}</s> : <em>no answer</em>} → <strong>{answer.expected}</strong>
                    </>
                  ) : answer.answer ? (
                    <AnswerDiff expected={answer.expected} submitted={answer.answer} />
                  ) : (
                    <>
                      <em>no answer</em> → <strong>{answer.expected}</strong>
                    </>
                  )}
                </span>
                {itemById.get(answer.itemId)?.explain ? (
                  <small className="level-mistakes__explain">{itemById.get(answer.itemId)?.explain}</small>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="level-muted">No mistakes in this check — impressive.</p>
      )}

      <div className="level-result-actions">
        <button className="quiet-button" type="button" onClick={onRetake}>
          <Icon name="refresh" size={16} /> Take a new check
        </button>
      </div>
    </div>
  )
}
