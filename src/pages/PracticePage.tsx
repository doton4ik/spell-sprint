import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { PracticeSettings } from '../components/practice/PracticeSettings'
import { SessionSidebar } from '../components/practice/SessionSidebar'
import { TaskCard } from '../components/practice/TaskCard'
import { usePracticeSession } from '../hooks/usePracticeSession'
import { consumePendingPracticeSelection, getPracticeOptions, getTasksForSelection, getTasksForWordIds, type PracticeScope } from '../services/libraryPractice'
import { speakEnglish } from '../services/speech'
import { getWordProgress, reasonForWord } from '../services/dailyPlan'
import type { PracticeMode } from '../types/practice'
import './practice.css'

const scopeLabels: Record<PracticeScope, string> = { all: 'All libraries', library: 'Specific library', topic: 'Specific topic', subtopic: 'Specific subtopic', mistakes: 'My mistakes', review: 'Review Later' }
const modeLabels: Record<PracticeMode, string> = { 'write-en': 'Write in English', 'listen-write': 'Listen and write', 'translate-ru': 'Translate to Russian', 'choose-spelling': 'Choose correct spelling' }

export function PracticePage() {
  const options = useMemo(getPracticeOptions, [])
  const [pendingSelection, setPendingSelection] = useState(consumePendingPracticeSelection)
  const [scope, setScope] = useState<PracticeScope>('all'); const [mode, setMode] = useState<PracticeMode>(pendingSelection?.mode ?? 'write-en'); const [library, setLibrary] = useState(options.libraries[0] ?? ''); const [topic, setTopic] = useState(options.topics[0] ?? ''); const [subtopic, setSubtopic] = useState(options.subtopics[0] ?? ''); const [audioMessage, setAudioMessage] = useState('')
  const [sessionSize, setSessionSize] = useState<number | 'all'>(pendingSelection?.mode ? 'all' : 10)
  const tasks = useMemo(() => pendingSelection ? getTasksForWordIds(pendingSelection.wordIds, mode) : getTasksForSelection({ scope, library, topic, subtopic }, mode), [pendingSelection, scope, library, topic, subtopic, mode])
  const session = usePracticeSession(tasks, sessionSize)
  const select = (label: string, value: string, onChange: (value: string) => void, values: string[], hidden: boolean) => hidden ? null : <label className="practice-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
  function playAudio() { const playback = speakEnglish(session.currentTask.answer, session.settings.speechLocale); setAudioMessage(!playback.ok ? 'Speech is not available in this browser. You can continue practising without audio.' : playback.fallback ? 'Your selected accent is unavailable, so an available English voice is being used.' : '') }
  // The reason each word is in this session (due, missed, new …), fixed when the session starts.
  const reasons = useMemo(() => { const progress = getWordProgress(); return new Map(session.sessionTasks.map((task) => [task.id, reasonForWord(task.wordId ? progress.get(task.wordId) : undefined)])) }, [session.sessionTasks])
  // Dictation: each new word is read out by itself, so the learner only has to listen and type.
  const currentId = session.currentTask?.id
  useEffect(() => {
    if (mode !== 'listen-write' || !currentId || session.completed) return
    const timer = window.setTimeout(playAudio, 350)
    return () => window.clearTimeout(timer)
  }, [mode, currentId, session.completed])
  if (session.completed) return <div className="practice-page practice-page--complete" id="practice"><div className="completion-card"><span className="completion-card__icon"><Icon name="check" size={29} strokeWidth={2.3} /></span><p className="eyebrow">Practice complete</p><h1>Nice focused work.</h1><p>You completed {session.totalTasks} tasks in {(pendingSelection?.label ?? scopeLabels[scope]).toLocaleLowerCase()}.</p><button className="check-button" type="button" onClick={session.restart}><Icon name="refresh" size={18} /> Start another round</button></div></div>
  return <div className="practice-page" id="practice">
    <header className="practice-header"><div><p className="eyebrow">Practice</p><h1>Build accuracy, one answer at a time.</h1><p>{pendingSelection ? `Practising: ${pendingSelection.label}` : 'Choose the library or theme you want to practise.'}</p></div><PracticeSettings settings={session.settings} onChange={session.setSettings} /></header>
    <div className="practice-filters"><label className="practice-select"><span>Practice set</span><select value={scope} onChange={(event) => { setPendingSelection(null); setScope(event.target.value as PracticeScope) }}>{(Object.keys(scopeLabels) as PracticeScope[]).map((item) => <option value={item} key={item}>{scopeLabels[item]}</option>)}</select></label><label className="practice-select"><span>Mode</span><select value={mode} onChange={(event) => setMode(event.target.value as PracticeMode)}>{(Object.keys(modeLabels) as PracticeMode[]).map((item) => <option value={item} key={item}>{modeLabels[item]}</option>)}</select></label><label className="practice-select"><span>Words in session</span><select value={sessionSize} onChange={(event) => setSessionSize(event.target.value === 'all' ? 'all' : Number(event.target.value))}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={30}>30</option><option value="all">All available</option></select></label>{select('Library', library, setLibrary, options.libraries, scope !== 'library')}{select('Topic', topic, setTopic, options.topics, scope !== 'topic')}{select('Subtopic', subtopic, setSubtopic, options.subtopics, scope !== 'subtopic')}</div>
    <section className="practice-workspace" aria-label="Practice session"><SessionSidebar modeLabel={modeLabels[mode]} scopeLabel={pendingSelection?.label ?? scopeLabels[scope]} mode={mode} taskIndex={session.taskIndex} progress={session.progress} tasks={session.sessionTasks} outcomes={session.outcomes} /><TaskCard otherMeaning={session.otherMeaning} reason={session.currentTask?.wordId ? reasons.get(session.currentTask.id) : undefined} task={session.currentTask} answer={session.answer} result={session.result} attemptsOnTask={session.attemptsOnTask} answerRevealed={session.answerRevealed} hintStep={session.hintStep} allowSkip={session.settings.allowSkip} showRuleAfterMistake={session.settings.showRuleAfterMistake} onAnswerChange={session.setAnswer} onCheck={session.checkAnswer} onShowAnswer={session.revealAnswer} onHint={session.useHint} onPlayAudio={playAudio} onSkip={session.skip} onNext={session.advance} onRepeatLater={session.markForReview} audioMessage={audioMessage} /></section>
  </div>
}
