import { SprintRail } from '../components/ui/PageRails'
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { noAutocorrect } from '../components/noAutocorrect'
import { ReportWordButton } from '../components/ReportWordButton'
import { Icon } from '../components/icons/Icon'
import { InfoTip } from '../components/ui/InfoTip'
import { openPracticeWith } from '../services/libraryPractice'
import { recordSprintMiss } from '../services/sprint'
import {
  bestSprint,
  getSprintRounds,
  MIN_SPRINT_WORDS,
  saveSprintRound,
  slowWords,
  SPRINT_SECONDS,
  sprintCorrect,
  sprintPool,
  type SprintAnswer,
  type SprintRound,
} from '../services/sprint'
import type { LibraryWord } from '../types/library'
import './sprint.css'

type Phase = { kind: 'intro' } | { kind: 'running' } | { kind: 'done'; round: SprintRound; previousBest: number }
const MISS_SHOWN_MS = 1000

export function SprintPage() {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' })
  const [pool, setPool] = useState(sprintPool)
  if (phase.kind === 'running')
    return (
      <SprintRun
        words={pool.words}
        onFinish={(round) => {
          const previousBest = bestSprint()
          saveSprintRound(round)
          setPhase({ kind: 'done', round, previousBest })
        }}
      />
    )
  if (phase.kind === 'done')
    return (
      <SprintResult
        round={phase.round}
        previousBest={phase.previousBest}
        onAgain={() => {
          setPool(sprintPool())
          setPhase({ kind: 'running' })
        }}
      />
    )

  const best = bestSprint()
  const allRounds = getSprintRounds()
  const recent = allRounds.slice(0, 8).reverse()
  const top = Math.max(1, ...recent.map((round) => round.correct))
  const poolIsSmall = pool.fromHistory < MIN_SPRINT_WORDS
  // The month is written once, under the first bar and where it changes: eight full dates do not fit on a phone.
  const dates = recent.map((round) => new Date(round.date))
  const dateLabel = (index: number) => {
    const date = dates[index]
    const before = dates[index - 1]
    const sameMonth = before && before.getMonth() === date.getMonth() && before.getFullYear() === date.getFullYear()
    return date.toLocaleDateString('en', sameMonth ? { day: 'numeric' } : { day: 'numeric', month: 'short' })
  }
  return (
    <div className="sprint-page" id="sprint">
      <SprintRail />
      <header className="sprint-header">
        <h1>60 seconds, as many words as you can</h1>
        <p>Type the English word. No hints, no second tries.</p>
      </header>
      {/* One card: the record and the button, and beside them the last sprints (or, before the first one, how it goes). */}
      <section className="sprint-hero">
        <div className="sprint-hero__main">
          <p className="sprint-record">
            <small>Your record</small>
            {best ? (
              <>
                <strong>{best}</strong>
                <span>{`word${best === 1 ? '' : 's'} in a minute`}</span>
              </>
            ) : (
              <strong className="sprint-record__none">Not set yet</strong>
            )}
          </p>
          <p className="sprint-facts">
            {allRounds.length ? <span>{`${allRounds.length} sprint${allRounds.length === 1 ? '' : 's'} so far`}</span> : null}
            {poolIsSmall ? (
              <span>
                Easy starter words for now
                <InfoTip label="About the words">
                  Until you have typed more words correctly, the sprint adds easy words from the base library.
                </InfoTip>
              </span>
            ) : (
              <span>{pool.fromHistory} of your words in play</span>
            )}
          </p>
          <button className="check-button sprint-start" type="button" onClick={() => setPhase({ kind: 'running' })}>
            <Icon name="bolt" size={17} /> Start the sprint
          </button>
        </div>
        {recent.length ? (
          <div className="sprint-history" role="group" aria-label="Your last sprints">
            <h2>Last sprints</h2>
            <ol>
              {recent.map((round, index) => (
                <li key={round.date} className={round.correct === best && best > 0 ? 'sprint-history__best' : undefined}>
                  <span className="sprint-history__track">
                    <strong>{round.correct}</strong>
                    <span className="sprint-history__bar" style={{ '--share': round.correct / top } as CSSProperties} />
                  </span>
                  <small>{dateLabel(index)}</small>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="sprint-how">
            <h2>How a sprint goes</h2>
            <ol>
              <li>A Russian word appears.</li>
              <li>Type it in English and press Enter.</li>
              <li>A miss shows the right spelling for a second. The clock keeps running.</li>
            </ol>
          </div>
        )}
      </section>
    </div>
  )
}

function SprintRun({ words, onFinish }: { words: LibraryWord[]; onFinish: (round: SprintRound) => void }) {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [miss, setMiss] = useState<string | null>(null)
  const [left, setLeft] = useState(SPRINT_SECONDS * 1000)
  const [paused, setPaused] = useState(false)
  const answers = useRef<SprintAnswer[]>([])
  const [score, setScore] = useState(0)
  const spent = useRef(0) // ms of running time before the current stretch
  const since = useRef<number | null>(performance.now())
  const shownAt = useRef(performance.now())
  const firstKeyAt = useRef(0)
  const input = useRef<HTMLInputElement>(null)
  const finished = useRef(false)
  const word = words[index]

  const finish = () => {
    if (finished.current) return
    finished.current = true
    const list = answers.current
    onFinish({
      date: new Date().toISOString(),
      correct: list.filter((answer) => answer.correct).length,
      misses: list.filter((answer) => !answer.correct).length,
      answers: list,
    })
  }
  const elapsed = () => spent.current + (since.current === null ? 0 : performance.now() - since.current)

  // The clock: stops while paused or while the app is in the background (phone locked, tab switched).
  useEffect(() => {
    const tick = window.setInterval(() => {
      const rest = SPRINT_SECONDS * 1000 - elapsed()
      setLeft(rest)
      if (rest <= 0) finish()
    }, 100)
    return () => window.clearInterval(tick)
  }, [])
  const pause = (value: boolean) => {
    if (value && since.current !== null) {
      spent.current += performance.now() - since.current
      since.current = null
    }
    if (!value && since.current === null) {
      since.current = performance.now()
      shownAt.current = performance.now()
      firstKeyAt.current = 0
      window.setTimeout(() => input.current?.focus(), 0)
    }
    setPaused(value)
  }
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pause(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const next = () => {
    setMiss(null)
    setTyped('')
    firstKeyAt.current = 0
    shownAt.current = performance.now()
    if (index + 1 >= words.length) {
      finish()
      return
    }
    setIndex(index + 1)
    window.setTimeout(() => input.current?.focus(), 0)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!typed.trim() || miss || paused || !word) return
    const now = performance.now()
    const started = firstKeyAt.current || now
    const correct = sprintCorrect(typed, word)
    if (!correct) recordSprintMiss(word, typed)
    answers.current.push({
      wordId: word.wordId,
      word: word.word,
      typed: typed.trim(),
      correct,
      recallMs: Math.round(started - shownAt.current),
      typeMs: Math.round(now - started),
    })
    if (correct) setScore((value) => value + 1)
    if (correct) {
      next()
      return
    }
    setMiss(word.word)
    window.setTimeout(next, MISS_SHOWN_MS)
  }

  const seconds = Math.max(0, Math.ceil(left / 1000))
  if (!word) return null
  return (
    <div className="sprint-page sprint-run" id="sprint">
      <div className="sprint-bar">
        <span className={`sprint-clock${seconds <= 10 ? ' sprint-clock--low' : ''}`}>{seconds}s</span>
        <span className="sprint-score">
          <Icon name="check" size={15} /> {score}
        </span>
        <button className="quiet-button" type="button" onClick={() => pause(!paused)}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="quiet-button" type="button" onClick={finish}>
          Finish
        </button>
      </div>
      <div className="sprint-progress">
        <span style={{ width: `${(left / (SPRINT_SECONDS * 1000)) * 100}%` }} />
      </div>
      {paused ? (
        <section className="sprint-card">
          <p className="sprint-paused">Paused. The clock is stopped.</p>
          <button className="check-button" type="button" onClick={() => pause(false)}>
            Resume
          </button>
        </section>
      ) : (
        <form className="sprint-card" onSubmit={submit}>
          <span className="sprint-pos">{word.partOfSpeech}</span>
          <h2>{word.translation}</h2>
          <input
            {...noAutocorrect}
            ref={input}
            autoFocus
            value={typed}
            disabled={Boolean(miss)}
            onChange={(event) => {
              if (!firstKeyAt.current && event.target.value) firstKeyAt.current = performance.now()
              setTyped(event.target.value)
            }}
            placeholder="Type the English word"
            aria-label="English word"
          />
          {miss ? (
            <p className="sprint-miss" role="status">
              <span aria-hidden="true">✗</span> <span className="sr-only">Missed: </span>
              <strong>{miss}</strong>
            </p>
          ) : (
            <button className="check-button" type="submit" disabled={!typed.trim()}>
              Enter <Icon name="arrow" size={15} />
            </button>
          )}
        </form>
      )}
    </div>
  )
}

function SprintResult({ round, previousBest, onAgain }: { round: SprintRound; previousBest: number; onAgain: () => void }) {
  const misses = round.answers.filter((answer) => !answer.correct)
  const slow = slowWords(round.answers)
  const record = round.correct > previousBest && round.correct > 0
  const practise = () => {
    openPracticeWith({
      wordIds: [...new Set([...misses, ...slow].map((answer) => answer.wordId))],
      label: 'Sprint: words to practise',
      mode: 'write-en',
    })
  }
  const perWord = round.correct
    ? Math.round(
        round.answers.filter((answer) => answer.correct).reduce((sum, answer) => sum + answer.recallMs + answer.typeMs, 0) /
          round.correct /
          100,
      ) / 10
    : 0
  return (
    <div className="sprint-page" id="sprint">
      <header className="sprint-header">
        <p className="eyebrow">Sprint result</p>
        <h1>{record ? 'New record!' : `${round.correct} word${round.correct === 1 ? '' : 's'}`}</h1>
        <p>
          {record
            ? previousBest
              ? `${round.correct} correct — your previous best was ${previousBest}.`
              : `${round.correct} correct in your first sprint.`
            : `Your record is ${Math.max(previousBest, round.correct)}.`}
          {perWord ? ` About ${perWord} s per correct word.` : ''}
        </p>
      </header>
      <section className="sprint-summary">
        <div className="sprint-stats">
          <div className="sprint-stat--good">
            <strong>{round.correct}</strong>
            <small>correct</small>
          </div>
          <div className={round.misses ? 'sprint-stat--wrong' : undefined}>
            <strong>{round.misses}</strong>
            <small>wrong</small>
          </div>
          <div>
            <strong>{slow.length}</strong>
            <small>slow to type</small>
          </div>
        </div>
        {misses.length ? (
          <div className="sprint-list">
            <h2>Wrong</h2>
            {misses.map((answer, index) => (
              <p key={index}>
                <s>{answer.typed}</s> → <strong>{answer.word}</strong>{' '}
                <ReportWordButton word={{ wordId: answer.wordId, word: answer.word }} />
              </p>
            ))}
          </div>
        ) : null}
        {slow.length ? (
          <div className="sprint-list">
            <h2>Right, but slow to type</h2>
            <p className="sprint-hint">Typed much slower than your usual pace in this sprint — the spelling is not automatic yet.</p>
            <div className="sprint-chips">
              {slow.map((answer) => (
                <span key={answer.wordId}>
                  {answer.word}{' '}
                  <ReportWordButton word={{ wordId: answer.wordId, word: answer.word }} className="sprint-chip-report" size={12} />
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="sprint-actions">
          <button className="check-button" type="button" onClick={onAgain}>
            <Icon name="refresh" size={16} /> Another sprint
          </button>
          {misses.length || slow.length ? (
            <button className="outline-action sprint-text-button" type="button" onClick={practise}>
              <Icon name="practice" size={16} /> Practise these words
            </button>
          ) : null}
        </div>
      </section>
    </div>
  )
}
