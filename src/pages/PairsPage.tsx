import { useEffect, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { buildPairSession, pairQuestions, pairStatuses, recordPairAnswer, type PairQuestion, type PairStatus } from '../services/pairs'
import './pairs.css'

type Phase = { kind: 'list' } | { kind: 'session'; questions: PairQuestion[]; label: string } | { kind: 'done'; results: Array<{ question: PairQuestion; chosen: string }>; label: string }
const stateLabels: Record<PairStatus['state'], string> = { new: 'New', learning: 'Learning', mastered: 'Mastered' }

export function PairsPage() {
  const [phase, setPhase] = useState<Phase>({ kind: 'list' })
  if (phase.kind === 'session') return <PairSession questions={phase.questions} onFinish={(results) => setPhase({ kind: 'done', results, label: phase.label })} onQuit={() => setPhase({ kind: 'list' })} />
  if (phase.kind === 'done') return <PairResult results={phase.results} label={phase.label} onAgain={() => setPhase({ kind: 'session', questions: buildPairSession(), label: 'Mixed pairs' })} onList={() => setPhase({ kind: 'list' })} />

  const statuses = pairStatuses()
  const due = statuses.filter((status) => status.due && status.state !== 'new').length
  const mastered = statuses.filter((status) => status.state === 'mastered').length
  const tricky = statuses.filter((status) => status.errors > 0).sort((a, b) => b.errors - a.errors).slice(0, 6)
  return <div className="pairs-page" id="pairs">
    <header className="pairs-header"><p className="eyebrow">Pairs</p><h1>Words that sound or look alike</h1><p>their or there, lose or loose, affect or effect: a spell checker cannot catch these, because both words exist. Choose the one that fits the sentence.</p></header>
    <section className="pairs-start">
      <div className="pairs-stats"><strong>{statuses.length}<small>pairs</small></strong><strong>{due}<small>to review today</small></strong><strong>{mastered}<small>mastered</small></strong></div>
      <button className="check-button" type="button" onClick={() => setPhase({ kind: 'session', questions: buildPairSession(), label: 'Mixed pairs' })}><Icon name="shuffle" size={16} /> Practise 10 sentences</button>
      <p className="pairs-note">Pairs you got wrong come back first, then new ones from the easiest level.</p>
    </section>
    {tricky.length ? <section className="pairs-group"><h2>Your trickiest pairs</h2><div className="pairs-grid">{tricky.map((status) => <PairChip status={status} onOpen={() => setPhase({ kind: 'session', questions: pairQuestions(status.pair.id), label: status.pair.words.join(' / ') })} key={status.pair.id} />)}</div></section> : null}
    {(['A2', 'B1', 'B2'] as const).map((level) => <section className="pairs-group" key={level}><h2>{level}</h2><div className="pairs-grid">{statuses.filter((status) => status.pair.level === level).map((status) => <PairChip status={status} onOpen={() => setPhase({ kind: 'session', questions: pairQuestions(status.pair.id), label: status.pair.words.join(' / ') })} key={status.pair.id} />)}</div></section>)}
  </div>
}

function PairChip({ status, onOpen }: { status: PairStatus; onOpen: () => void }) {
  return <button type="button" className={`pair-chip pair-chip--${status.state}`} onClick={onOpen}>
    <strong>{status.pair.words.join(' / ')}</strong>
    <small>{stateLabels[status.state]}{status.errors ? ` · ${status.errors} mistake${status.errors === 1 ? '' : 's'}` : ''}{status.due && status.state !== 'new' ? ' · review today' : ''}</small>
  </button>
}

const capitalise = (word: string) => word.charAt(0).toLocaleUpperCase() + word.slice(1)
// A blank at the start of the sentence shows the choices with a capital letter.
const shown = (word: string, atStart: boolean) => (atStart ? capitalise(word) : word)

function PairSession({ questions, onFinish, onQuit }: { questions: PairQuestion[]; onFinish: (results: Array<{ question: PairQuestion; chosen: string }>) => void; onQuit: () => void }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [results, setResults] = useState<Array<{ question: PairQuestion; chosen: string }>>([])
  const question = questions[index]
  const atStart = question?.sentence.text.startsWith('___') ?? false

  const choose = (word: string) => {
    if (chosen || !question) return
    setChosen(word)
    recordPairAnswer(question.pair, question.sentence, word)
    setResults((current) => [...current, { question, chosen: word }])
  }
  const next = () => {
    if (index + 1 >= questions.length) { onFinish(results); return }
    setIndex(index + 1); setChosen(null)
  }
  // Keys 1–3 choose, Enter goes on.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!question) return
      if (chosen && event.key === 'Enter') { event.preventDefault(); next(); return }
      const number = Number(event.key)
      if (!chosen && number >= 1 && number <= question.pair.words.length) choose(question.pair.words[number - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!question) return null
  const [before, after] = question.sentence.text.split('___')
  const right = chosen === question.sentence.answer
  return <div className="pairs-page" id="pairs">
    <div className="pairs-bar"><span>{index + 1} / {questions.length}</span><button className="quiet-button" type="button" onClick={onQuit}>Stop</button></div>
    <section className="pair-card">
      <p className="pair-sentence">{before}<span className={chosen ? (right ? 'pair-gap pair-gap--right' : 'pair-gap pair-gap--wrong') : 'pair-gap'}>{chosen ? shown(question.sentence.answer, atStart) : '      '}</span>{after}</p>
      <div className="pair-choices">{question.pair.words.map((word, number) => <button type="button" key={word} disabled={Boolean(chosen)} className={chosen ? (word === question.sentence.answer ? 'pair-choice pair-choice--answer' : word === chosen ? 'pair-choice pair-choice--wrong' : 'pair-choice') : 'pair-choice'} onClick={() => choose(word)}><small>{number + 1}</small>{shown(word, atStart)}</button>)}</div>
      {chosen ? <div className={right ? 'pair-feedback pair-feedback--right' : 'pair-feedback pair-feedback--wrong'} role="status">
        <strong>{right ? 'Correct!' : `Not “${chosen}” — it is “${question.sentence.answer}”.`}</strong>
        <p>{question.pair.hint}</p>
        <ul>{question.pair.words.map((word) => <li key={word}><b>{word}</b> — {question.pair.meanings[word]}</li>)}</ul>
        <button className="check-button" type="button" onClick={next}>{index + 1 >= questions.length ? 'See results' : 'Next'} <Icon name="arrow" size={15} /></button>
      </div> : null}
    </section>
  </div>
}

function PairResult({ results, label, onAgain, onList }: { results: Array<{ question: PairQuestion; chosen: string }>; label: string; onAgain: () => void; onList: () => void }) {
  const wrong = results.filter((result) => result.chosen !== result.question.sentence.answer)
  return <div className="pairs-page" id="pairs">
    <header className="pairs-header"><p className="eyebrow">{label}</p><h1>{results.length - wrong.length} of {results.length} correct</h1><p>{wrong.length ? 'Pairs you missed come back first next time.' : 'No mistakes — these pairs move to a later review.'}</p></header>
    {wrong.length ? <section className="pairs-start"><h2 className="pairs-subtitle">Mistakes</h2>{wrong.map((result, index) => <p className="pair-miss" key={index}>{result.question.sentence.text.replace('___', `[${result.question.sentence.answer}]`)} <small>you chose “{result.chosen}”</small></p>)}</section> : null}
    <div className="pairs-actions"><button className="check-button" type="button" onClick={onAgain}><Icon name="refresh" size={16} /> Another 10</button><button className="quiet-button" type="button" onClick={onList}>All pairs</button></div>
  </div>
}
