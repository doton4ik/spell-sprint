import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Icon } from '../components/icons/Icon'
import type { ProofreadingLevel, ProofreadingText } from '../data/proofreadingTexts'
import { getLevelChecks } from '../services/levelCheck'
import { buildExercise, checkExercise, proofreadingTexts, proofreadingTypes, recordProofreading, typeWeights, type Exercise, type ProofreadingResult, type Token } from '../services/proofreading'
import './proofreading.css'

const levels: ProofreadingLevel[] = ['A2', 'B1', 'B2', 'C1']
const SHOW_COUNT_KEY = 'spell-sprint.proofreading-show-count'
const readShowCount = () => { try { return window.localStorage.getItem(SHOW_COUNT_KEY) !== 'false' } catch { return true } }
const formatLabels: Record<string, string> = { email: 'Email', message: 'Message', story: 'Story', notice: 'Notice', article: 'Article', dialogue: 'Dialogue', review: 'Review', diary: 'Diary', instructions: 'Instructions', report: 'Report' }

// The level of the last Level Check, so the first text is pitched right.
function defaultLevel(): ProofreadingLevel {
  const level = getLevelChecks()[0]?.overall.level
  return level === 'A2' || level === 'B1' || level === 'B2' || level === 'C1' ? level : 'B1'
}

type Phase = { kind: 'setup' } | { kind: 'reading'; text: ProofreadingText; exercise: Exercise } | { kind: 'result'; text: ProofreadingText; exercise: Exercise; edits: Map<number, string>; result: ProofreadingResult }

export function ProofreadingPage() {
  const [level, setLevel] = useState<ProofreadingLevel>(defaultLevel)
  const [showCount, setShowCount] = useState(readShowCount)
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' })

  function toggleShowCount() {
    const next = !showCount
    setShowCount(next)
    try { window.localStorage.setItem(SHOW_COUNT_KEY, String(next)) } catch { /* a convenience only */ }
  }
  function start(text: ProofreadingText) { setPhase({ kind: 'reading', text, exercise: buildExercise(text, Date.now(), typeWeights()) }); window.scrollTo({ top: 0 }) }
  function randomText(except?: string) {
    const pool = proofreadingTexts.filter((text) => text.level === level && text.id !== except)
    const list = pool.length ? pool : proofreadingTexts.filter((text) => text.level === level)
    if (list.length) start(list[Math.floor(Math.random() * list.length)])
  }

  if (phase.kind === 'reading') {
    return <Reader text={phase.text} exercise={phase.exercise} showCount={showCount} onBack={() => setPhase({ kind: 'setup' })} onCheck={(edits) => {
      const result = checkExercise(phase.exercise, edits)
      recordProofreading(phase.text, result)
      setPhase({ kind: 'result', text: phase.text, exercise: phase.exercise, edits, result }); window.scrollTo({ top: 0 })
    }} />
  }
  if (phase.kind === 'result') {
    return <ResultView {...phase} onAgain={() => start(phase.text)} onNext={() => randomText(phase.text.id)} onBack={() => setPhase({ kind: 'setup' })} />
  }

  const texts = proofreadingTexts.filter((text) => text.level === level)
  return (
    <div className="proof-page" id="proofreading">
      <header className="proof-header">
        <p className="eyebrow">Proofreading</p>
        <h1>Find the mistakes</h1>
        <p>Read a short text, tap every word that looks wrong and write the correction. Each time you open a text it gets a new set of mistakes — grammar and spelling — with more of the kinds you tend to miss.</p>
      </header>

      <div className="proof-controls">
        <nav className="proof-levels" aria-label="Level">{levels.map((item) => <button type="button" className={item === level ? 'proof-levels__active' : ''} onClick={() => setLevel(item)} key={item}>{item}<small>{proofreadingTexts.filter((text) => text.level === item).length}</small></button>)}</nav>
        <label className="proof-toggle"><input type="checkbox" checked={showCount} onChange={toggleShowCount} /> Tell me how many mistakes there are</label>
      </div>

      {texts.length ? (
        <>
          <button className="check-button proof-random" type="button" onClick={() => randomText()}><Icon name="shuffle" size={16} /> Random {level} text</button>
          <section className="proof-list">
            {texts.map((text) => (
              <button className="proof-card" type="button" onClick={() => start(text)} key={text.id}>
                <span className="proof-card__meta">{formatLabels[text.format] ?? text.format} · {text.topic}</span>
                <strong>{text.title}</strong>
                <span className="proof-card__go">Start <Icon name="arrow" size={14} /></span>
              </button>
            ))}
          </section>
        </>
      ) : <p className="proof-empty">No {level} texts yet — more are on the way.</p>}
    </div>
  )
}

// ---- Reading and marking --------------------------------------------------------------------------
function Reader({ text, exercise, showCount, onBack, onCheck }: { text: ProofreadingText; exercise: Exercise; showCount: boolean; onBack: () => void; onCheck: (edits: Map<number, string>) => void }) {
  const [edits, setEdits] = useState<Map<number, string>>(new Map())
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing !== null) inputRef.current?.focus() }, [editing])

  function open(token: Token) { setEditing(token.id); setDraft(edits.get(token.id) ?? token.text) }
  function save(value: string) {
    if (editing === null) return
    const next = new Map(edits)
    if (value.trim() === exercise.tokens[editing].text) next.delete(editing); else next.set(editing, value.trim())
    setEdits(next); setEditing(null)
  }
  function undo(id: number) { const next = new Map(edits); next.delete(id); setEdits(next); setEditing(null) }
  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') { event.preventDefault(); save(draft) }
    if (event.key === 'Escape') setEditing(null)
  }

  return (
    <div className="proof-page" id="proofreading">
      <button className="proof-back" type="button" onClick={onBack}><Icon name="chevron" size={15} /> All texts</button>
      <header className="proof-reading-head">
        <div><span className="proof-card__meta">{text.level} · {formatLabels[text.format] ?? text.format} · {text.topic}</span><h1>{text.title}</h1></div>
        <div className="proof-counter"><strong>{edits.size}</strong><span>{showCount ? `of ${exercise.slots.length} mistakes marked` : 'words changed'}</span></div>
      </header>
      <p className="proof-instructions">{showCount ? `There are ${exercise.slots.length} mistakes.` : 'Find all the mistakes.'} Tap a word to correct it. To add a missing word, tap the word next to the gap and type both (car → a car). To remove a word, delete it.</p>

      <article className="proof-text">
        {exercise.tokens.map((token) => {
          if (!token.isWord) return <span key={token.id}>{token.text}</span>
          const edit = edits.get(token.id)
          if (editing === token.id) {
            return (
              <span className="proof-editor" key={token.id}>
                <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKey} aria-label={`Correction for ${token.text}`} spellCheck={false} autoCapitalize="off" autoComplete="off" />
                <span className="proof-editor__actions">
                  <button type="button" onClick={() => save(draft)}>Save</button>
                  <button type="button" onClick={() => save('')}>Delete word</button>
                  {edits.has(token.id) ? <button type="button" onClick={() => undo(token.id)}>Undo</button> : null}
                  <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                </span>
              </span>
            )
          }
          return (
            <button type="button" className={edit !== undefined ? 'proof-word proof-word--edited' : 'proof-word'} onClick={() => open(token)} key={token.id}>
              {edit !== undefined ? <><s>{token.text}</s>{edit ? <ins>{edit}</ins> : <ins className="proof-word__deleted">deleted</ins>}</> : token.text}
            </button>
          )
        })}
      </article>

      <div className="proof-actions">
        <button className="check-button" type="button" onClick={() => onCheck(edits)}><Icon name="check" size={16} /> Check</button>
        <span>{edits.size ? `${edits.size} change${edits.size === 1 ? '' : 's'}` : 'No changes yet'}</span>
      </div>
    </div>
  )
}

// ---- Result ------------------------------------------------------------------------------------------
function ResultView({ text, exercise, edits, result, onAgain, onNext, onBack }: { text: ProofreadingText; exercise: Exercise; edits: Map<number, string>; result: ProofreadingResult; onAgain: () => void; onNext: () => void; onBack: () => void }) {
  const statusBySlot = useMemo(() => new Map(result.slots.map((item) => [item.slot.id, item])), [result])
  const falseAlarmIds = new Set(result.falseAlarms.map((alarm) => alarm.tokenId))
  const total = exercise.slots.length
  const shownSlots = new Set<number>()

  return (
    <div className="proof-page" id="proofreading">
      <button className="proof-back" type="button" onClick={onBack}><Icon name="chevron" size={15} /> All texts</button>
      <header className="proof-reading-head"><div><span className="proof-card__meta">{text.level} · {text.title}</span><h1>{result.fixed === total && !result.falseAlarms.length ? 'Perfect proofreading!' : 'Your result'}</h1></div></header>

      <section className="proof-score">
        <div><span>Found</span><strong>{result.found}<small>/{total}</small></strong></div>
        <div><span>Fixed correctly</span><strong>{result.fixed}<small>/{total}</small></strong></div>
        <div><span>False alarms</span><strong>{result.falseAlarms.length}</strong></div>
      </section>

      <article className="proof-text proof-text--result">
        {exercise.tokens.map((token) => {
          if (!token.isWord) return <span key={token.id}>{token.text}</span>
          if (token.slotId !== undefined) {
            if (shownSlots.has(token.slotId)) return null // the whole mistake is shown once, at its first word
            shownSlots.add(token.slotId)
            const item = statusBySlot.get(token.slotId)!
            return <span className={`proof-mark proof-mark--${item.status}`} title={proofreadingTypes[item.slot.type]?.label} key={token.id}><s>{item.slot.shown}</s> <b>{item.slot.correct[0]}</b></span>
          }
          if (falseAlarmIds.has(token.id)) return <span className="proof-mark proof-mark--alarm" title="This word was already correct" key={token.id}>{token.text}<small>{edits.get(token.id) || 'deleted'}</small></span>
          return <span key={token.id}>{token.text}</span>
        })}
      </article>
      <p className="proof-legend"><span className="proof-legend__fixed">fixed</span><span className="proof-legend__wrong-fix">found, wrong fix</span><span className="proof-legend__missed">missed</span><span className="proof-legend__alarm">was already correct</span></p>

      <section className="proof-explain">
        <h2>The mistakes</h2>
        <ul>
          {result.slots.map(({ slot, status, learnerText }) => (
            <li className={`proof-explain__item proof-explain__item--${status}`} key={slot.id}>
              <span className="proof-explain__status">{status === 'fixed' ? '✓' : status === 'wrong-fix' ? '~' : '✗'}</span>
              <div>
                <p><s>{slot.shown}</s> → <b>{slot.correct.join(' / ')}</b>{status === 'wrong-fix' ? <em> (you wrote “{learnerText || 'deleted'}”)</em> : null}</p>
                <small><strong>{proofreadingTypes[slot.type]?.label}.</strong> {proofreadingTypes[slot.type]?.hint}</small>
              </div>
            </li>
          ))}
        </ul>
        {result.falseAlarms.length ? <p className="proof-explain__alarms">Changed but already correct: {result.falseAlarms.map((alarm) => `“${alarm.original}”`).join(', ')}.</p> : null}
        <p className="proof-explain__note">Missed and wrongly fixed mistakes are saved to My Mistakes, so they come back in your reviews.</p>
      </section>

      <div className="proof-actions">
        <button className="check-button" type="button" onClick={onAgain}><Icon name="refresh" size={16} /> Same text, new mistakes</button>
        <button className="quiet-button" type="button" onClick={onNext}>Another text <Icon name="arrow" size={15} /></button>
      </div>
    </div>
  )
}
