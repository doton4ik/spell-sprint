import { useEffect, useMemo, useState } from 'react'
import { defaultPracticeSettings } from '../data/practice'
import { loadPracticeSettings, savePracticeAttempt, savePracticeSettings } from '../services/practiceStorage'
import type { CheckResult, PracticeAttempt, PracticeSettings, PracticeTask } from '../types/practice'

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[’']/g, "'").replace(/[.,!?]+$/g, '').replace(/\s+/g, ' ')
}

function isAnswerCorrect(answer: string, task: PracticeTask) {
  const candidates = [task.answer, ...(task.acceptedAnswers ?? [])].map(normalize)
  return candidates.includes(normalize(answer))
}

export function usePracticeSession(tasks: PracticeTask[]) {
  const [taskIndex, setTaskIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<CheckResult>('idle')
  const [attemptsOnTask, setAttemptsOnTask] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [settings, setSettings] = useState<PracticeSettings>(() => loadPracticeSettings(defaultPracticeSettings))

  const currentTask = tasks[taskIndex]
  const progress = useMemo(() => Math.round((taskIndex / tasks.length) * 100), [taskIndex, tasks.length])

  useEffect(() => { savePracticeSettings(settings) }, [settings])

  useEffect(() => {
    if (result !== 'correct' || !settings.writeUntilCorrect) return
    const timeout = window.setTimeout(() => advance(), 850)
    return () => window.clearTimeout(timeout)
  }, [result, settings.writeUntilCorrect])

  function recordAttempt(overrides: Pick<PracticeAttempt, 'isCorrect' | 'wasSkipped' | 'wasAnswerRevealed'>) {
    savePracticeAttempt({
      id: crypto.randomUUID(), taskId: currentTask.id, taskType: currentTask.type, topic: currentTask.topic,
      userAnswer: answer, correctAnswer: currentTask.answer, errorCategory: currentTask.errorCategory,
      needsReview: overrides.isCorrect ? false : settings.repeatDifficultItemLater, createdAt: new Date().toISOString(), ...overrides,
    })
  }

  function checkAnswer() {
    if (!answer.trim() || result === 'correct') return
    const correct = isAnswerCorrect(answer, currentTask)
    setAttemptsOnTask((value) => value + 1)
    setResult(correct ? 'correct' : 'incorrect')
    recordAttempt({ isCorrect: correct, wasSkipped: false, wasAnswerRevealed: answerRevealed })
  }

  function revealAnswer() {
    if (!answerRevealed) {
      recordAttempt({ isCorrect: false, wasSkipped: false, wasAnswerRevealed: true })
      setAnswerRevealed(true)
    }
  }

  function advance() {
    if (taskIndex >= tasks.length - 1) { setCompleted(true); return }
    setTaskIndex((value) => value + 1)
    setAnswer(''); setResult('idle'); setAttemptsOnTask(0); setAnswerRevealed(false)
  }

  function skip() { recordAttempt({ isCorrect: false, wasSkipped: true, wasAnswerRevealed: answerRevealed }); advance() }
  function restart() { setTaskIndex(0); setAnswer(''); setResult('idle'); setAttemptsOnTask(0); setAnswerRevealed(false); setCompleted(false) }

  return { currentTask, taskIndex, progress, answer, setAnswer, result, attemptsOnTask, answerRevealed, completed, settings, setSettings, checkAnswer, revealAnswer, advance, skip, restart, totalTasks: tasks.length }
}
