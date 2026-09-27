import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../components/icons/Icon'
import { AnswerDiff } from '../components/practice/AnswerDiff'
import { skillInstructions, skillLabels, type LevelItem, type Skill } from '../data/levelCheckBank'
import { buildPlan, createCheck, finishCheck, getLevelChecks, isCorrectAnswer, nextCheckDue, nextItem, recordCheckAnswer, TOTAL_QUESTIONS, type CheckAnswer, type LevelCheckResult, type PlanStep } from '../services/levelCheck'
import { subscribeToLearningData } from '../services/learningData'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import './level-check.css'

const skills: Skill[] = ['spelling', 'vocabulary', 'grammar']
const levelNames = ['A2', 'B1', 'B2', 'C1']
const formatDate = (value: string | Date) => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))

function daysAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
}

type View = { kind: 'home' } | { kind: 'running' } | { kind: 'result'; id: string }

export function DiagnosticPage() {
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  const checks = useMemo(getLevelChecks, [revision])
  const [view, setView] = useState<View>({ kind: 'home' })

  if (view.kind === 'running') return <CheckRunner onQuit={() => setView({ kind: 'home' })} onFinish={(result) => { setRevision((value) => value + 1); setView({ kind: 'result', id: result.id }) }} />
  if (view.kind === 'result') {
    const index = checks.findIndex((check) => check.id === view.id)
    if (index >= 0) return <ResultView result={checks[index]} previous={checks[index + 1]} checks={checks} onBack={() => setView({ kind: 'home' })} onRetake={() => setView({ kind: 'running' })} />
  }
  return <HomeView checks={checks} onStart={() => setView({ kind: 'running' })} onOpen={(id) => setView({ kind: 'result', id })} />
}

// ---- Start screen and history ----------------------------------------------------------------
function HomeView({ checks, onStart, onOpen }: { checks: LevelCheckResult[]; onStart: () => void; onOpen: (id: string) => void }) {
  const last = checks[0]
  const { due, date } = nextCheckDue(checks)
  return (
    <div className="level-page" id="level-check">
      <section className="level-hero">
        <div>
          <p className="eyebrow">Level check</p>
          <h1>Where is your English now?</h1>
          <p>A short adaptive check: questions get harder when you are right and easier when you are not, so {TOTAL_QUESTIONS} questions are enough to find your level in each skill.</p>
          <div className="level-hero__meta"><span><Icon name="check" size={15} /> {TOTAL_QUESTIONS} questions</span><span><Icon name="calendar" size={15} /> about 6 minutes</span><span><Icon name="rules" size={15} /> spelling · vocabulary · grammar</span></div>
          <button className="check-button level-hero__start" type="button" onClick={onStart}><Icon name="practice" size={17} /> {last ? 'Start a new check' : 'Start the check'}</button>
          {last ? <p className="level-hero__next">{due ? 'It has been a month — a good time to measure your progress.' : `Next check recommended around ${formatDate(date!)}.`}</p> : null}
        </div>
        {last ? (
          <button className="level-hero__last" type="button" onClick={() => onOpen(last.id)}>
            <span>Your last result · {daysAgo(last.completedAt)}</span>
            <strong>{last.overall.level}</strong>
            <div>{skills.map((skill) => <small key={skill}>{skillLabels[skill]} <b>{last.skills[skill].level}</b></small>)}</div>
            <em>See details <Icon name="arrow" size={14} /></em>
          </button>
        ) : null}
      </section>

      {checks.length ? <History checks={checks} onOpen={onOpen} /> : (
        <section className="level-how">
          <div><strong>1 · Answer</strong><p>Write each word or sentence. “I don’t know” is fine — it helps the check find your level faster.</p></div>
          <div><strong>2 · See your level</strong><p>A2 to C1 for each skill, and how it compares with your previous check.</p></div>
          <div><strong>3 · Follow the plan</strong><p>Mistakes go into your review queue, and you get three next steps picked from the result.</p></div>
        </section>
      )}
    </div>
  )
}

function History({ checks, onOpen }: { checks: LevelCheckResult[]; onOpen: (id: string) => void }) {
  return (
    <section className="level-history">
      <div className="level-section-head"><h2>Your progress</h2><span>{checks.length} check{checks.length === 1 ? '' : 's'}</span></div>
      {checks.length > 1 ? <ProgressChart checks={checks} /> : <p className="level-muted">Take another check later to see how each skill moves.</p>}
      <div className="level-history__list">
        {checks.map((check, index) => {
          const previous = checks[index + 1]
          const delta = previous ? Math.round((check.overall.ability - previous.overall.ability) * 10) / 10 : null
          return (
            <button className="level-history__row" type="button" onClick={() => onOpen(check.id)} key={check.id}>
              <span className="level-history__date">{formatDate(check.completedAt)}</span>
              <strong className="level-badge">{check.overall.level}</strong>
              <span className="level-history__skills">{skills.map((skill) => <small key={skill}>{skillLabels[skill].slice(0, 5)}. {check.skills[skill].level}</small>)}</span>
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
  return <span className={`level-delta level-delta--${value > 0 ? 'up' : 'down'}`}>{value > 0 ? '▲' : '▼'} {Math.abs(value).toFixed(1)}</span>
}

// Ability over time, one line per skill, oldest on the left. Up to the last 8 checks.
function ProgressChart({ checks }: { checks: LevelCheckResult[] }) {
  const points = [...checks].slice(0, 8).reverse()
  const width = 560, height = 170, left = 34, right = 12, top = 12, bottom = 26
  const x = (index: number) => left + (points.length === 1 ? 0 : (index / (points.length - 1)) * (width - left - right))
  const y = (ability: number) => top + (1 - (ability - 0.5) / 4) * (height - top - bottom)
  return (
    <figure className="level-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Level per skill over your checks">
        {levelNames.map((name, index) => <g key={name}><line x1={left} x2={width - right} y1={y(index + 1)} y2={y(index + 1)} className="level-chart__grid" /><text x={4} y={y(index + 1) + 4} className="level-chart__axis">{name}</text></g>)}
        {points.map((check, index) => <text key={check.id} x={x(index)} y={height - 6} textAnchor="middle" className="level-chart__axis">{new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(check.completedAt))}</text>)}
        {skills.map((skill) => (
          <g key={skill} className={`level-chart__line level-chart__line--${skill}`}>
            <polyline points={points.map((check, index) => `${x(index)},${y(check.skills[skill].ability)}`).join(' ')} fill="none" />
            {points.map((check, index) => <circle key={check.id} cx={x(index)} cy={y(check.skills[skill].ability)} r={3.5} />)}
          </g>
        ))}
      </svg>
      <figcaption>{skills.map((skill) => <span className={`level-legend level-legend--${skill}`} key={skill}>{skillLabels[skill]}</span>)}</figcaption>
    </figure>
  )
}

// ---- Running the check -----------------------------------------------------------------------
function CheckRunner({ onQuit, onFinish }: { onQuit: () => void; onFinish: (result: LevelCheckResult) => void }) {
  const [{ bank, plan }] = useState(createCheck)
  const [answers, setAnswers] = useState<CheckAnswer[]>([])
  const [item, setItem] = useState<LevelItem | null>(() => nextItem(bank, plan[0], []))
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const step = answers.length + (feedback ? 0 : 1)

  useEffect(() => { if (feedback) nextRef.current?.focus() }, [feedback])

  function submit(event?: FormEvent, giveUp = false) {
    event?.preventDefault()
    if (!item || feedback || (!giveUp && !input.trim())) return
    const answer = giveUp ? '' : input
    const correct = !giveUp && isCorrectAnswer(item, answer)
    recordCheckAnswer(item, answer, correct)
    setAnswers((current) => [...current, { itemId: item.id, skill: item.skill, level: item.level, correct, answer, expected: item.answer, prompt: item.prompt, wordId: item.wordId }])
    setFeedback({ correct, answer })
  }

  function next() {
    const done = answers.length >= plan.length
    const upcoming = done ? null : nextItem(bank, plan[answers.length], answers)
    if (!upcoming) { onFinish(finishCheck(answers)); return }
    setItem(upcoming); setInput(''); setFeedback(null)
  }

  if (!item) return null
  return (
    <div className="level-page level-page--running" id="level-check">
      <div className="level-run__top">
        <span>Question {Math.min(step, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}</span>
        <button className="quiet-action" type="button" onClick={() => { if (window.confirm('Stop the check? Answers so far stay in your practice history, but no level is saved.')) onQuit() }}>Stop</button>
      </div>
      <div className="level-run__track"><i style={{ width: `${(answers.length / TOTAL_QUESTIONS) * 100}%` }} /></div>

      <section className="level-question">
        <span className="level-question__skill">{skillLabels[item.skill]}</span>
        <p className="level-question__hint">{skillInstructions[item.skill]}</p>
        <h2 className={item.skill === 'grammar' ? 'level-question__prompt level-question__prompt--sentence' : 'level-question__prompt'}>{item.prompt}</h2>

        <form onSubmit={submit}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={item.skill === 'grammar' ? 'Write the correct sentence…' : 'Type your answer…'} autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={Boolean(feedback)} autoFocus key={item.id} />
          {feedback ? (
            <div className={`level-feedback level-feedback--${feedback.correct ? 'correct' : 'incorrect'}`} role="status">
              <div>
                <strong>{feedback.correct ? 'Correct' : feedback.answer ? 'Not quite' : 'Here is the answer'}</strong>
                {!feedback.correct ? <div className="level-feedback__diff">{feedback.answer ? <AnswerDiff expected={item.answer} submitted={feedback.answer} /> : <b>{item.answer}</b>}</div> : null}
              </div>
              <button className="check-button" type="button" onClick={next} ref={nextRef}>{answers.length >= TOTAL_QUESTIONS ? 'See my level' : 'Next'} <Icon name="arrow" size={16} /></button>
            </div>
          ) : (
            <div className="level-actions">
              <button className="quiet-button" type="button" onClick={() => submit(undefined, true)}>I don’t know</button>
              <button className="check-button" type="submit" disabled={!input.trim()}><Icon name="check" size={16} /> Check</button>
            </div>
          )}
        </form>
      </section>
    </div>
  )
}

// ---- Result -----------------------------------------------------------------------------------
function startPractice(step: PlanStep) {
  if (step.action.href) { window.location.hash = step.action.href.slice(1); return }
  if (!step.action.words?.length) return
  setPendingPracticeSelection({ wordIds: step.action.words.map((word) => word.wordId), label: step.action.practiceLabel ?? step.title, mode: 'write-en' })
  window.location.hash = 'practice'
}

function ResultView({ result, previous, checks, onBack, onRetake }: { result: LevelCheckResult; previous?: LevelCheckResult; checks: LevelCheckResult[]; onBack: () => void; onRetake: () => void }) {
  const plan = useMemo(() => buildPlan(result), [result])
  const mistakes = result.answers.filter((answer) => !answer.correct)
  const isLatest = checks[0]?.id === result.id
  return (
    <div className="level-page" id="level-check">
      <button className="level-back" type="button" onClick={onBack}><Icon name="chevron" size={15} /> All checks</button>
      <section className="level-result-hero">
        <div>
          <p className="eyebrow">Level check · {formatDate(result.completedAt)}</p>
          <h1>Your level: {result.overall.level}</h1>
          <p>{previous ? <>Compared with {formatDate(previous.completedAt)}: <Delta value={Math.round((result.overall.ability - previous.overall.ability) * 10) / 10} /></> : 'This is your starting point. Take another check in about a month to see how it moves.'}</p>
        </div>
        <strong className="level-result-hero__badge">{result.overall.level}</strong>
      </section>

      <section className="level-skills">
        {skills.map((skill) => {
          const value = result.skills[skill]
          const before = previous?.skills[skill]
          return (
            <article className="level-skill" key={skill}>
              <div className="level-skill__head"><span>{skillLabels[skill]}</span>{before ? <Delta value={Math.round((value.ability - before.ability) * 10) / 10} /> : null}</div>
              <strong>{value.level}</strong>
              <div className="level-skill__scale" aria-label={`${skillLabels[skill]}: ${value.level}`}>
                {levelNames.map((name) => <span className={name === value.level ? 'level-skill__step level-skill__step--on' : 'level-skill__step'} key={name}>{name}</span>)}
              </div>
              <small>{value.correct} of {value.total} right{before ? ` · was ${before.level}` : ''}</small>
            </article>
          )
        })}
      </section>

      {isLatest && plan.length ? (
        <section className="level-plan">
          <div className="level-section-head"><h2>Your next steps</h2><span>picked from this result</span></div>
          <ol>
            {plan.map((step, index) => (
              <li key={step.title}>
                <span className="level-plan__number">{index + 1}</span>
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
                <button className={index === 0 ? 'check-button' : 'quiet-button'} type="button" onClick={() => startPractice(step)}>{step.action.label} <Icon name="arrow" size={15} /></button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {mistakes.length ? (
        <section className="level-mistakes">
          <div className="level-section-head"><h2>What went wrong</h2><span>{mistakes.length} of {result.answers.length}</span></div>
          <ul>
            {mistakes.map((answer) => (
              <li key={answer.itemId}>
                <span className="level-mistakes__skill">{skillLabels[answer.skill]}</span>
                <span className="level-mistakes__prompt">{answer.prompt}</span>
                <span className="level-mistakes__diff">{answer.answer ? <AnswerDiff expected={answer.expected} submitted={answer.answer} /> : <><em>no answer</em> → <strong>{answer.expected}</strong></>}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : <p className="level-muted">No mistakes in this check — impressive.</p>}

      <div className="level-result-actions"><button className="quiet-button" type="button" onClick={onRetake}><Icon name="refresh" size={16} /> Take a new check</button></div>
    </div>
  )
}
