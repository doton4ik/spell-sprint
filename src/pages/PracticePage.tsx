import { useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { PracticeSettings } from '../components/practice/PracticeSettings'
import { TaskCard } from '../components/practice/TaskCard'
import { usePracticeSession } from '../hooks/usePracticeSession'
import { getPracticeOptions, getTasksForSelection, type PracticeScope } from '../services/libraryPractice'
import { speakEnglish } from '../services/speech'
import type { PracticeMode } from '../types/practice'
import './practice.css'

const scopeLabels: Record<PracticeScope, string> = { all: 'All libraries', library: 'Specific library', topic: 'Specific topic', subtopic: 'Specific subtopic', mistakes: 'My mistakes', review: 'Review Later' }
const modeLabels: Record<PracticeMode, string> = { 'write-en': 'Write in English', 'listen-write': 'Listen and write', 'translate-ru': 'Translate to Russian', 'choose-spelling': 'Choose correct spelling' }

export function PracticePage() {
  const options = useMemo(getPracticeOptions, [])
  const [scope, setScope] = useState<PracticeScope>('all'); const [mode, setMode] = useState<PracticeMode>('write-en'); const [library, setLibrary] = useState(options.libraries[0] ?? ''); const [topic, setTopic] = useState(options.topics[0] ?? ''); const [subtopic, setSubtopic] = useState(options.subtopics[0] ?? ''); const [audioMessage, setAudioMessage] = useState('')
  const tasks = useMemo(() => getTasksForSelection({ scope, library, topic, subtopic }, mode), [scope, library, topic, subtopic, mode])
  const session = usePracticeSession(tasks)
  const select = (label: string, value: string, onChange: (value: string) => void, values: string[], hidden: boolean) => hidden ? null : <label className="practice-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
  function playAudio() { const playback = speakEnglish(session.currentTask.answer, session.settings.speechLocale); setAudioMessage(!playback.ok ? 'Speech is not available in this browser. You can continue practising without audio.' : playback.fallback ? 'Your selected accent is unavailable, so an available English voice is being used.' : '') }
  if (session.completed) return <div className="practice-page practice-page--complete" id="practice"><div className="completion-card"><span className="completion-card__icon"><Icon name="check" size={29} strokeWidth={2.3} /></span><p className="eyebrow">Practice complete</p><h1>Nice focused work.</h1><p>You completed {session.totalTasks} tasks in {scopeLabels[scope].toLocaleLowerCase()}.</p><button className="check-button" type="button" onClick={session.restart}><Icon name="refresh" size={18} /> Start another round</button></div></div>
  return <div className="practice-page" id="practice">
    <header className="practice-header"><div><p className="eyebrow">Practice</p><h1>Build accuracy, one answer at a time.</h1><p>Choose the library or theme you want to practise.</p></div><PracticeSettings settings={session.settings} onChange={session.setSettings} /></header>
    <div className="practice-filters"><label className="practice-select"><span>Practice set</span><select value={scope} onChange={(event) => setScope(event.target.value as PracticeScope)}>{(Object.keys(scopeLabels) as PracticeScope[]).map((item) => <option value={item} key={item}>{scopeLabels[item]}</option>)}</select></label><label className="practice-select"><span>Mode</span><select value={mode} onChange={(event) => setMode(event.target.value as PracticeMode)}>{(Object.keys(modeLabels) as PracticeMode[]).map((item) => <option value={item} key={item}>{modeLabels[item]}</option>)}</select></label>{select('Library', library, setLibrary, options.libraries, scope !== 'library')}{select('Topic', topic, setTopic, options.topics, scope !== 'topic')}{select('Subtopic', subtopic, setSubtopic, options.subtopics, scope !== 'subtopic')}</div>
    <section className="practice-workspace" aria-label="Practice session"><aside className="session-sidebar"><div className="session-mode"><span><Icon name="shuffle" size={17} /> {modeLabels[mode]}</span><small>{scopeLabels[scope]}</small></div><div className="session-progress"><div><span>Session progress</span><strong>{session.taskIndex + 1} <small>/ {session.totalTasks}</small></strong></div><div className="session-progress__track"><div style={{ width: `${session.progress}%` }} /></div></div><div className="session-note"><Icon name="lightbulb" size={17} /><p><strong>The English answer stays hidden.</strong> Use staged hints or listen when needed.</p></div></aside><TaskCard task={session.currentTask} answer={session.answer} result={session.result} attemptsOnTask={session.attemptsOnTask} answerRevealed={session.answerRevealed} hintStep={session.hintStep} allowSkip={session.settings.allowSkip} onAnswerChange={session.setAnswer} onCheck={session.checkAnswer} onShowAnswer={session.revealAnswer} onHint={session.useHint} onPlayAudio={playAudio} onSkip={session.skip} onNext={session.advance} onRepeatLater={session.markForReview} audioMessage={audioMessage} /></section>
  </div>
}
