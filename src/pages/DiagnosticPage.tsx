import { useMemo, useState } from 'react'
import { diagnosticBlocks, diagnosticTasks } from '../data/diagnostic'
import { loadDiagnosticResult, saveDiagnosticResult } from '../services/diagnosticStorage'
import type { DiagnosticAnswer, DiagnosticResult } from '../types/diagnostic'
import { Icon } from '../components/icons/Icon'
import './diagnostic.css'

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[.!?]/g, '').replace(/\s+/g, ' ')
}

function scoreForBlock(result: DiagnosticResult, blockId: string) {
  const answers = result.answers.filter((answer) => answer.blockId === blockId)
  return answers.length ? Math.round((answers.filter((answer) => answer.isCorrect).length / answers.length) * 100) : 0
}

export function DiagnosticPage() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [checked, setChecked] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(() => loadDiagnosticResult())
  const task = diagnosticTasks[index]
  const block = diagnosticBlocks.find((item) => item.id === task.blockId)!
  const completedCount = answers.length
  const currentBlockIndex = diagnosticBlocks.findIndex((item) => item.id === task.blockId)
  const blockCompleted = answers.filter((item) => item.blockId === task.blockId).length
  const canFinish = index === diagnosticTasks.length - 1

  const summary = useMemo(() => result ? diagnosticBlocks.map((block) => ({ ...block, score: scoreForBlock(result, block.id) })) : [], [result])

  function advance(isCorrect: boolean, skipped = false) {
    const nextAnswers = [...answers, { taskId: task.id, blockId: task.blockId, isCorrect, skipped, answer }]
    if (canFinish) {
      const finalResult = { completedAt: new Date().toISOString(), answers: nextAnswers, incomplete: nextAnswers.some((item) => item.blockId === 'production' && item.skipped) }
      setAnswers(nextAnswers)
      setResult(finalResult)
      saveDiagnosticResult(finalResult)
      return
    }
    setAnswers(nextAnswers)
    setIndex((value) => value + 1)
    setAnswer('')
    setChecked(null)
    setShowAnswer(false)
  }

  function check() {
    const accepted = [task.answer, ...(task.acceptedAnswers ?? [])].map(normalize)
    setChecked(accepted.includes(normalize(answer)))
  }

  function restart() {
    setIndex(0); setAnswer(''); setAnswers([]); setChecked(null); setShowAnswer(false); setResult(null)
  }

  if (result) {
    const overall = Math.round((result.answers.filter((item) => item.isCorrect).length / result.answers.length) * 100)
    return <div className="diagnostic-page" id="test-analysis">
      <header className="diagnostic-header"><div><p className="eyebrow">Diagnostic test · Results</p><h1>Your language snapshot</h1><p>Use these results as a starting point. New practice will update the profile over time.</p></div><button className="diagnostic-outline" onClick={restart}><Icon name="refresh" size={16} /> Take again</button></header>
      <section className="diagnostic-result-hero"><div><span>Overall accuracy</span><strong>{overall}%</strong><p>{result.incomplete ? 'Completed with Block F skipped or partially skipped.' : 'All six diagnostic blocks completed.'}</p></div><div className="diagnostic-recommendation"><span>Recommended next step</span><strong>Practice your two lowest blocks</strong><a href="#practice">Start mixed practice <Icon name="arrow" size={15} /></a></div></section>
      <section className="diagnostic-results-grid">{summary.map((item) => <article className="diagnostic-result-card" key={item.id}><span>{item.label}</span><strong>{item.score}%</strong><div><i style={{ width: `${item.score}%` }} /></div><p>{item.score >= 80 ? 'Strong foundation' : item.score >= 60 ? 'Developing' : item.score >= 40 ? 'Needs focus' : 'Priority area'}</p></article>)}</section>
      <section className="diagnostic-insight"><div><Icon name="lightbulb" size={19} /><div><span>How to read this</span><p>Diagnostic questions deliberately use different words across blocks, so the result measures more than your saved mistakes.</p></div></div><a href="#my-mistakes">View saved mistakes <Icon name="arrow" size={15} /></a></section>
    </div>
  }

  return <div className="diagnostic-page" id="test-analysis">
    <header className="diagnostic-header"><div><p className="eyebrow">Diagnostic test · 100 questions</p><h1>Map your English, honestly.</h1><p>One focused assessment across spelling, grammar, active vocabulary, business, and logistics English.</p></div><div className="diagnostic-counter"><strong>{completedCount + 1}</strong><span>/ 100 questions</span></div></header>
    <section className="diagnostic-blocks" aria-label="Diagnostic blocks">{diagnosticBlocks.map((item, itemIndex) => <div className={itemIndex === currentBlockIndex ? 'diagnostic-block diagnostic-block--active' : itemIndex < currentBlockIndex ? 'diagnostic-block diagnostic-block--done' : 'diagnostic-block'} key={item.id}><span>{item.label.slice(0, 1)}</span><div><strong>{item.label.slice(4)}</strong><small>{item.total} questions</small></div></div>)}</section>
    <section className="diagnostic-workspace"><div className="diagnostic-workspace__top"><div><span>Block {currentBlockIndex + 1} of 6</span><h2>{block.label.slice(4)}</h2></div><strong>{blockCompleted + 1} <small>/ {block.total}</small></strong></div><div className="diagnostic-track"><i style={{ width: `${((index + 1) / diagnosticTasks.length) * 100}%` }} /></div>
      <div className="diagnostic-question"><span className="diagnostic-question__type">{task.type === 'correct-spelling' ? 'Correct the spelling' : task.type === 'correct-sentence' ? 'Write the corrected sentence' : task.type === 'translate-ru-en' ? 'Write in English' : 'Translate to Russian'}</span><h3>{task.prompt}</h3><p>{task.topic}</p><textarea value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(null) }} placeholder="Write your answer…" rows={task.type === 'correct-sentence' ? 3 : 1} autoFocus />
        {checked !== null ? <div className={`diagnostic-feedback diagnostic-feedback--${checked ? 'correct' : 'incorrect'}`}>{checked ? <><Icon name="check" size={17} /> Correct — recorded in your diagnostic.</> : <><Icon name="mistakes" size={17} /> Not quite. Record it and continue, or check the model answer.</>}</div> : null}
        {showAnswer ? <div className="diagnostic-model-answer"><span>Model answer</span><strong>{task.answer}</strong></div> : null}
        <div className="diagnostic-actions"><button className="diagnostic-outline" onClick={() => setShowAnswer(true)}><Icon name="eye" size={16} /> Show answer</button><div><button className="diagnostic-skip" onClick={() => advance(false, true)}>Skip</button>{checked === null ? <button className="check-button" disabled={!answer.trim()} onClick={check}>Check answer</button> : <button className="check-button" onClick={() => advance(checked)}> {canFinish ? 'Finish test' : 'Next question'} <Icon name="arrow" size={16} /></button>}</div></div>
      </div>
    </section>
  </div>
}
