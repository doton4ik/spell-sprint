import type { LibraryDifficulty, LibraryWord } from '../types/library'
import { normalisePartOfSpeech } from '../types/library'
import type { ErrorType, PracticeAttempt, PracticeMode, PracticeTaskType } from '../types/practice'

// Data that comes from outside this device (a cloud backup, an imported CSV) is checked before it is
// stored: right types, sensible lengths. A broken record is dropped instead of breaking a screen later.
const text = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : undefined)
const flag = (value: unknown) => value === true
const isDate = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && !Number.isNaN(Date.parse(value))
const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => (allowed.includes(value as T) ? value as T : fallback)

const modes = ['write-en', 'listen-write', 'translate-ru', 'choose-spelling'] as const satisfies readonly PracticeMode[]
const taskTypes = ['correct-spelling', 'translate-ru-en', 'translate-en-ru', 'correct-sentence'] as const satisfies readonly PracticeTaskType[]

export function sanitizeAttempt(raw: unknown): PracticeAttempt | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const id = text(item.id, 80); const taskId = text(item.taskId, 300)
  if (!id || !taskId || !isDate(item.createdAt)) return null
  const confidence = typeof item.confidence === 'number' && Number.isFinite(item.confidence) ? Math.min(Math.max(Math.round(item.confidence), 0), 10) : 0
  return {
    id, taskId, createdAt: item.createdAt,
    taskType: oneOf(item.taskType, taskTypes, 'translate-ru-en'),
    attemptMode: oneOf(item.attemptMode, modes, 'write-en'),
    topic: text(item.topic, 120) ?? '', topicId: text(item.topicId, 120), subtopic: text(item.subtopic, 120),
    wordId: text(item.wordId, 200), library: text(item.library, 120),
    userAnswer: text(item.userAnswer, 500) ?? '', correctAnswer: text(item.correctAnswer, 500) ?? '',
    isCorrect: flag(item.isCorrect), wasSkipped: flag(item.wasSkipped), wasAnswerRevealed: flag(item.wasAnswerRevealed), hintUsed: flag(item.hintUsed),
    wasMarkedForReview: item.wasMarkedForReview === undefined ? undefined : flag(item.wasMarkedForReview),
    errorType: (text(item.errorType, 60) ?? 'unknown') as ErrorType, errorCategory: text(item.errorCategory, 200) ?? '',
    confidence, nextReviewAt: isDate(item.nextReviewAt) ? item.nextReviewAt : undefined, needsReview: flag(item.needsReview),
  }
}

const difficulties = ['easy', 'medium', 'hard'] as const satisfies readonly LibraryDifficulty[]
export const wordLimits = { word: 100, translation: 300, text: 500 }

export function sanitizeWord(raw: unknown): LibraryWord | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const word = text(item.word, wordLimits.word)?.trim(); const translation = text(item.translation, wordLimits.translation)?.trim()
  const wordId = text(item.wordId, 200) ?? text(item.id, 200)
  if (!word || !translation || !wordId) return null
  const risk = typeof item.risk === 'number' && Number.isFinite(item.risk) ? Math.min(Math.max(Math.round(item.risk), 1), 5) : 3
  return {
    id: text(item.id, 200) ?? wordId, wordId, word, translation,
    topicId: text(item.topicId, 120) ?? 'my-words', topic: text(item.topic, 120) ?? 'My words', subtopic: text(item.subtopic, 120) ?? 'General',
    difficulty: oneOf(item.difficulty, difficulties, 'medium'), risk,
    rule: text(item.rule, wordLimits.text), example: text(item.example, wordLimits.text), definition: text(item.definition, wordLimits.text),
    extraExample: text(item.extraExample, wordLimits.text), extraExampleSource: text(item.extraExampleSource, 60),
    alternatives: Array.isArray(item.alternatives) ? item.alternatives.map((value) => text(value, wordLimits.word)).filter((value): value is string => Boolean(value)).slice(0, 10) : undefined,
    partOfSpeech: normalisePartOfSpeech(text(item.partOfSpeech, 40)), library: text(item.library, 120) ?? '', source: text(item.source, 40) ?? 'imported',
  }
}
