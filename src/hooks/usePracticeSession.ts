import { useEffect, useMemo, useState } from 'react'
import { defaultPracticeSettings } from '../data/practice'
import {
  getPracticeAttempts,
  loadPracticeSettings,
  markAttemptClaimedCorrect,
  savePracticeAttempt,
  savePracticeSettings,
} from '../services/practiceStorage'
import { reportWord } from '../services/wordReports'
import { scheduleAfterAnswer } from '../services/reviewSchedule'
import { findOtherMeaning } from '../services/libraryPractice'
import type { CheckResult, ErrorType, PracticeAttempt, PracticeSettings, PracticeTask } from '../types/practice'
import { closestAnswer, isAcceptedAnswer } from '../services/answerMatch'

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,!?]+$/g, '')
    .replace(/\s+/g, ' ')
}

const isAnswerCorrect = isAcceptedAnswer

function comparison(value: string) {
  return normalize(value).replaceAll(/[-\s]/g, '')
}
function errorType(answer: string, correct: string): ErrorType {
  const value = comparison(answer)
  const target = comparison(correct)
  if (!value || value === target) return 'unknown'
  if (normalize(answer).replaceAll('-', ' ') === normalize(correct).replaceAll('-', ' ') && normalize(answer) !== normalize(correct))
    return 'phrase_spacing'
  if (value.length < target.length) {
    if ([...target].some((letter, index) => /[aeiou]/i.test(letter) && `${target.slice(0, index)}${target.slice(index + 1)}` === value))
      return 'missing_vowel'
    return /([bcdfghjklmnpqrstvwxyz])\1/i.test(target) && !/([bcdfghjklmnpqrstvwxyz])\1/i.test(value)
      ? 'double_consonant'
      : 'missing_letter'
  }
  if (value.length > target.length) return 'extra_letter'
  if ([...value].sort().join('') === [...target].sort().join('')) return 'letter_order'
  if (value.replace(/[aeiou]/gi, '') === target.replace(/[aeiou]/gi, '')) return 'vowel_confusion'
  return 'unknown'
}
function categoryForError(type: ErrorType) {
  const labels: Record<ErrorType, string> = {
    missing_letter: 'Missing letters',
    missing_vowel: 'Missing vowel',
    extra_letter: 'Extra letters',
    letter_order: 'Letter order',
    vowel_confusion: 'Vowel confusion',
    double_consonant: 'Missing letters',
    phrase_spacing: 'Letter order',
    unknown: 'General spelling',
  }
  return labels[type]
}
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export type TaskOutcome = 'correct' | 'incorrect' | 'skipped' | 'met'

export function usePracticeSession(tasks: PracticeTask[], taskLimit: number | 'all' = 'all') {
  const buildSession = () => shuffle(uniqueTasks(tasks)).slice(0, taskLimit === 'all' ? undefined : taskLimit)
  const [shuffledTasks, setShuffledTasks] = useState<PracticeTask[]>(buildSession)
  const [taskIndex, setTaskIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<CheckResult>('idle')
  const [attemptsOnTask, setAttemptsOnTask] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [hintStep, setHintStep] = useState(0)
  const [audioUsed, setAudioUsed] = useState(false) // the word was listened to before answering: that is help too
  const [completed, setCompleted] = useState(false)
  // First result per task in this session (a later retry does not overwrite it), for the live stats panel.
  const [outcomes, setOutcomes] = useState<Record<string, TaskOutcome>>({})
  const [otherMeaning, setOtherMeaning] = useState<{ word: string; translation: string } | null>(null)
  const [settings, setSettings] = useState<PracticeSettings>(() => loadPracticeSettings(defaultPracticeSettings))
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null)

  const currentTask = shuffledTasks[taskIndex]
  const progress = useMemo(() => Math.round((taskIndex / shuffledTasks.length) * 100), [taskIndex, shuffledTasks.length])

  useEffect(() => {
    savePracticeSettings(settings)
  }, [settings])
  useEffect(() => {
    setShuffledTasks(buildSession())
    setTaskIndex(0)
    setAnswer('')
    setOtherMeaning(null)
    setResult('idle')
    setAttemptsOnTask(0)
    setAnswerRevealed(false)
    setHintStep(0)
    setAudioUsed(false)
    setCompleted(false)
    setOutcomes({})
  }, [tasks, taskLimit])

  useEffect(() => {
    if (result !== 'correct' || !settings.writeUntilCorrect) return
    const timeout = window.setTimeout(() => advance(), 850)
    return () => window.clearTimeout(timeout)
  }, [result, settings.writeUntilCorrect])

  function markOutcome(outcome: TaskOutcome) {
    setOutcomes((previous) => (previous[currentTask.id] ? previous : { ...previous, [currentTask.id]: outcome }))
  }

  function recordAttempt(
    overrides: Pick<PracticeAttempt, 'isCorrect' | 'wasSkipped' | 'wasAnswerRevealed'> & { wasMarkedForReview?: boolean },
  ) {
    const correct = overrides.isCorrect
    // With several right answers, a mistake is measured against the one the learner was aiming at.
    const target = answer.trim() ? closestAnswer(answer, currentTask) : currentTask.answer
    const attemptMode =
      currentTask.mode ??
      (currentTask.type === 'translate-en-ru' ? 'translate-ru' : currentTask.type === 'translate-ru-en' ? 'write-en' : 'choose-spelling')
    const helped = Boolean(hintStep) || audioUsed
    const { confidence, nextReviewAt } = scheduleAfterAnswer(
      { wordId: currentTask.wordId, taskId: currentTask.id },
      correct,
      helped,
      attemptMode,
    )
    const needsReview = Boolean(overrides.wasMarkedForReview) || !correct || helped
    const id = crypto.randomUUID()
    setLastAttemptId(id)
    savePracticeAttempt({
      id,
      taskId: currentTask.id,
      taskType: currentTask.type,
      topic: currentTask.topic,
      topicId: currentTask.topicId,
      subtopic: currentTask.subtopic,
      wordId: currentTask.wordId,
      library: currentTask.library,
      userAnswer: answer,
      correctAnswer: target,
      errorCategory: correct ? currentTask.errorCategory : categoryForError(errorType(answer, target)),
      hintUsed: helped,
      attemptMode,
      errorType: correct ? 'unknown' : errorType(answer, target),
      confidence,
      nextReviewAt,
      needsReview: needsReview && settings.repeatDifficultItemLater,
      createdAt: new Date().toISOString(),
      ...overrides,
    })
  }

  function checkAnswer() {
    if (!answer.trim() || result === 'correct') return
    const correct = isAnswerCorrect(answer, currentTask)
    // A real word for another meaning of the same Russian prompt is not a mistake: hint, then try again.
    const other = correct ? null : findOtherMeaning(answer, currentTask)
    if (other) {
      setOtherMeaning(other)
      return
    }
    setOtherMeaning(null)
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
    if (taskIndex >= shuffledTasks.length - 1) {
      setCompleted(true)
      return
    }
    setTaskIndex((value) => value + 1)
    setAnswer('')
    setOtherMeaning(null)
    setResult('idle')
    setAttemptsOnTask(0)
    setAnswerRevealed(false)
    setHintStep(0)
    setAudioUsed(false)
  }

  function skip() {
    markOutcome('skipped')
    const seenBefore = getPracticeAttempts().some((attempt) =>
      currentTask.wordId ? attempt.wordId === currentTask.wordId : attempt.taskId === currentTask.id,
    )
    if (seenBefore || attemptsOnTask > 0 || answerRevealed)
      recordAttempt({ isCorrect: false, wasSkipped: true, wasAnswerRevealed: answerRevealed })
    advance()
  }
  // "My translation is right too" (Translate to Russian): a meaning the list does not have yet. The answer
  // counts as right, and the word is reported so the translation list can be checked and extended.
  function claimCorrect() {
    if (!lastAttemptId || result !== 'incorrect' || currentTask.mode !== 'translate-ru') return
    const schedule = scheduleAfterAnswer({ wordId: currentTask.wordId, taskId: currentTask.id }, true, false, 'translate-ru')
    markAttemptClaimedCorrect(lastAttemptId, schedule)
    void reportWord({
      wordId: currentTask.wordId ?? `task:${currentTask.id}`,
      word: currentTask.prompt,
      translation: currentTask.answer,
      library: currentTask.library,
      reason: 'wrong-translation',
      comment: `Should also accept: ${answer.trim().slice(0, 200)}`,
    })
    setOutcomes((previous) => ({ ...previous, [currentTask.id]: 'correct' }))
    setResult('correct')
  }

  // "Meet the word": a new word is shown first and copied once. That is saved as a helped answer
  // (like a hint): no mistake and no good day, and the word comes back tomorrow for the real test.
  function meetWord(typed: string) {
    const attemptMode = currentTask.mode ?? 'write-en'
    const { confidence, nextReviewAt } = scheduleAfterAnswer(
      { wordId: currentTask.wordId, taskId: currentTask.id },
      true,
      true,
      attemptMode,
    )
    markOutcome('met')
    savePracticeAttempt({
      id: crypto.randomUUID(),
      taskId: currentTask.id,
      taskType: currentTask.type,
      topic: currentTask.topic,
      topicId: currentTask.topicId,
      subtopic: currentTask.subtopic,
      wordId: currentTask.wordId,
      library: currentTask.library,
      userAnswer: typed.trim().slice(0, 500),
      correctAnswer: currentTask.answer,
      errorCategory: currentTask.errorCategory,
      hintUsed: true,
      introduced: true,
      attemptMode,
      errorType: 'unknown',
      confidence,
      nextReviewAt,
      needsReview: false,
      isCorrect: true,
      wasSkipped: false,
      wasAnswerRevealed: false,
      createdAt: new Date().toISOString(),
    })
    advance()
  }
  function useHint() {
    setHintStep((step) => Math.min(step + 1, 5))
  }
  // Listening to the word before answering gives its spelling away in the modes where the learner writes it.
  function markAudioUsed() {
    if (result === 'idle' && currentTask?.mode !== 'listen-write') setAudioUsed(true)
  }
  function markForReview() {
    recordAttempt({ isCorrect: result === 'correct', wasSkipped: false, wasAnswerRevealed: answerRevealed, wasMarkedForReview: true })
  }
  function restart() {
    setShuffledTasks(buildSession())
    setTaskIndex(0)
    setAnswer('')
    setOtherMeaning(null)
    setResult('idle')
    setAttemptsOnTask(0)
    setAnswerRevealed(false)
    setHintStep(0)
    setAudioUsed(false)
    setCompleted(false)
    setOutcomes({})
  }

  return {
    otherMeaning,
    sessionTasks: shuffledTasks,
    outcomes,
    currentTask,
    taskIndex,
    progress,
    answer,
    setAnswer,
    result,
    attemptsOnTask,
    answerRevealed,
    hintStep,
    audioUsed,
    markAudioUsed,
    completed,
    settings,
    setSettings,
    checkAnswer,
    claimCorrect,
    meetWord,
    revealAnswer,
    useHint,
    markForReview,
    advance,
    skip,
    restart,
    totalTasks: shuffledTasks.length,
  }
}

function uniqueTasks(tasks: PracticeTask[]) {
  const seen = new Set<string>()
  return tasks.filter((task) => {
    const key = task.wordId ?? task.id
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
