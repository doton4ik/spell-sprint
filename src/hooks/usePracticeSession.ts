import { useEffect, useMemo, useState } from 'react'
import { defaultPracticeSettings } from '../data/practice'
import { getPracticeAttempts, loadPracticeSettings, savePracticeAttempt, savePracticeSettings } from '../services/practiceStorage'
import type { CheckResult, ErrorType, PracticeAttempt, PracticeSettings, PracticeTask } from '../types/practice'

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[’']/g, "'").replace(/[.,!?]+$/g, '').replace(/\s+/g, ' ')
}

function isAnswerCorrect(answer: string, task: PracticeTask) {
  const candidates = [task.answer, ...(task.acceptedAnswers ?? [])].map(comparison)
  return candidates.includes(comparison(answer))
}

function comparison(value: string) { return normalize(value).replaceAll(/[-\s]/g, '') }
function errorType(answer: string, correct: string): ErrorType {
  const value = comparison(answer); const target = comparison(correct)
  if (!value || value === target) return 'unknown'
  if (normalize(answer).replaceAll('-', ' ') === normalize(correct).replaceAll('-', ' ') && normalize(answer) !== normalize(correct)) return 'phrase_spacing'
  if (value.length < target.length) {
    if ([...target].some((letter, index) => /[aeiou]/i.test(letter) && `${target.slice(0, index)}${target.slice(index + 1)}` === value)) return 'missing_vowel'
    return /([bcdfghjklmnpqrstvwxyz])\1/i.test(target) && !/([bcdfghjklmnpqrstvwxyz])\1/i.test(value) ? 'double_consonant' : 'missing_letter'
  }
  if (value.length > target.length) return 'extra_letter'
  if ([...value].sort().join('') === [...target].sort().join('')) return 'letter_order'
  if (value.replace(/[aeiou]/gi, '') === target.replace(/[aeiou]/gi, '')) return 'vowel_confusion'
  return 'unknown'
}
function categoryForError(type: ErrorType) {
  const labels: Record<ErrorType, string> = { missing_letter: 'Missing letters', missing_vowel: 'Missing vowel', extra_letter: 'Extra letters', letter_order: 'Letter order', vowel_confusion: 'Vowel confusion', double_consonant: 'Missing letters', phrase_spacing: 'Letter order', unknown: 'General spelling' }
  return labels[type]
}
function dateAfter(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString() }
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export type TaskOutcome = 'correct' | 'incorrect' | 'skipped'

export function usePracticeSession(tasks: PracticeTask[], taskLimit: number | 'all' = 'all') {
  const buildSession = () => shuffle(uniqueTasks(tasks)).slice(0, taskLimit === 'all' ? undefined : taskLimit)
  const [shuffledTasks, setShuffledTasks] = useState<PracticeTask[]>(buildSession)
  const [taskIndex, setTaskIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<CheckResult>('idle')
  const [attemptsOnTask, setAttemptsOnTask] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [hintStep, setHintStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  // First result per task in this session (a later retry does not overwrite it), for the live stats panel.
  const [outcomes, setOutcomes] = useState<Record<string, TaskOutcome>>({})
  const [settings, setSettings] = useState<PracticeSettings>(() => loadPracticeSettings(defaultPracticeSettings))

  const currentTask = shuffledTasks[taskIndex]
  const progress = useMemo(() => Math.round((taskIndex / shuffledTasks.length) * 100), [taskIndex, shuffledTasks.length])

  useEffect(() => { savePracticeSettings(settings) }, [settings])
  useEffect(() => {
    setShuffledTasks(buildSession()); setTaskIndex(0); setAnswer(''); setResult('idle'); setAttemptsOnTask(0); setAnswerRevealed(false); setHintStep(0); setCompleted(false); setOutcomes({})
  }, [tasks, taskLimit])

  useEffect(() => {
    if (result !== 'correct' || !settings.writeUntilCorrect) return
    const timeout = window.setTimeout(() => advance(), 850)
    return () => window.clearTimeout(timeout)
  }, [result, settings.writeUntilCorrect])

  function markOutcome(outcome: TaskOutcome) {
    setOutcomes((previous) => previous[currentTask.id] ? previous : { ...previous, [currentTask.id]: outcome })
  }

  function recordAttempt(overrides: Pick<PracticeAttempt, 'isCorrect' | 'wasSkipped' | 'wasAnswerRevealed'> & { wasMarkedForReview?: boolean }) {
    const correct = overrides.isCorrect
    const previousConfidence = getPracticeAttempts().filter((attempt) => attempt.taskId === currentTask.id && attempt.isCorrect && !attempt.hintUsed).reduce((highest, attempt) => Math.max(highest, attempt.confidence ?? 0), 0)
    const confidence = correct && !hintStep ? Math.min(previousConfidence + 1, 3) : 0
    const needsReview = Boolean(overrides.wasMarkedForReview) || !correct || Boolean(hintStep)
    const nextReviewAt = !correct ? dateAfter(0) : hintStep ? dateAfter(1) : dateAfter(confidence === 1 ? 2 : confidence === 2 ? 7 : 21)
    savePracticeAttempt({
      id: crypto.randomUUID(), taskId: currentTask.id, taskType: currentTask.type, topic: currentTask.topic, topicId: currentTask.topicId, subtopic: currentTask.subtopic, wordId: currentTask.wordId, library: currentTask.library,
      userAnswer: answer, correctAnswer: currentTask.answer, errorCategory: correct ? currentTask.errorCategory : categoryForError(errorType(answer, currentTask.answer)),
      hintUsed: Boolean(hintStep), attemptMode: currentTask.mode ?? (currentTask.type === 'translate-en-ru' ? 'translate-ru' : currentTask.type === 'translate-ru-en' ? 'write-en' : 'choose-spelling'), errorType: correct ? 'unknown' : errorType(answer, currentTask.answer), confidence, nextReviewAt, needsReview: needsReview && settings.repeatDifficultItemLater, createdAt: new Date().toISOString(), ...overrides,
    })
  }

  function checkAnswer() {
    if (!answer.trim() || result === 'correct') return
    const correct = isAnswerCorrect(answer, currentTask)
    setAttemptsOnTask((value) => value + 1)
    setResult(correct ? 'correct' : 'incorrect')
    markOutcome(correct ? 'correct' : 'incorrect')
    recordAttempt({ isCorrect: correct, wasSkipped: false, wasAnswerRevealed: answerRevealed })
  }

  function revealAnswer() {
    if (!answerRevealed) {
      markOutcome('incorrect')
      recordAttempt({ isCorrect: false, wasSkipped: false, wasAnswerRevealed: true })
      setAnswerRevealed(true)
    }
  }

  function advance() {
    if (taskIndex >= shuffledTasks.length - 1) { setCompleted(true); return }
    setTaskIndex((value) => value + 1)
    setAnswer(''); setResult('idle'); setAttemptsOnTask(0); setAnswerRevealed(false); setHintStep(0)
  }

  function skip() { markOutcome('skipped'); recordAttempt({ isCorrect: false, wasSkipped: true, wasAnswerRevealed: answerRevealed }); advance() }
  function useHint() { setHintStep((step) => Math.min(step + 1, 5)) }
  function markForReview() { recordAttempt({ isCorrect: result === 'correct', wasSkipped: false, wasAnswerRevealed: answerRevealed, wasMarkedForReview: true }) }
  function restart() { setShuffledTasks(buildSession()); setTaskIndex(0); setAnswer(''); setResult('idle'); setAttemptsOnTask(0); setAnswerRevealed(false); setHintStep(0); setCompleted(false); setOutcomes({}) }

  return { sessionTasks: shuffledTasks, outcomes, currentTask, taskIndex, progress, answer, setAnswer, result, attemptsOnTask, answerRevealed, hintStep, completed, settings, setSettings, checkAnswer, revealAnswer, useHint, markForReview, advance, skip, restart, totalTasks: shuffledTasks.length }
}

function uniqueTasks(tasks: PracticeTask[]) {
  const seen = new Set<string>()
  return tasks.filter((task) => { const key = task.wordId ?? task.id; if (seen.has(key)) return false; seen.add(key); return true })
}
