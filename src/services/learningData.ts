import { familyFor } from '../data/errorFamilies'
import type { LearningStatus, MistakeEntry, ReviewState } from '../types/learning'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts, subscribeToPracticeAttempts } from './practiceStorage'
import { getTaskById } from './libraryPractice'
import { getEveryWord } from './libraryStorage'
import { MASTERED_DAYS } from './reviewSchedule'
import { getRemovedKeys, setRemoved } from './libraryPrefs'
import { relevanceCheck } from './mistakeRelevance'
import { safeSetItem } from './safeStorage'
import { pairDrills } from '../data/pairDrills'
import { getPairAttempts, pairStatuses } from './pairs'
import { getAllYellowCards } from './yellowCards'

const REVIEW_STATES_KEY = 'spell-sprint.review-states'
const RULE_REVIEW_KEY = 'spell-sprint.rule-review'
const LEARNING_UPDATED_EVENT = 'spell-sprint:learning-updated'

function addDays(from: Date, amount: number) {
  const result = new Date(from)
  result.setDate(result.getDate() + amount)
  return result.toISOString()
}

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function getReviewStates() {
  return read<Record<string, ReviewState>>(REVIEW_STATES_KEY, {})
}

const ARCHIVE_AFTER_MS = 30 * 86400000

/** Due today (or overdue), not mastered and not archived: what the badge counts. */
export function isDueToday(entry: MistakeEntry) {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return entry.status !== 'mastered' && !entry.archived && new Date(entry.nextReviewAt) <= end
}

// Look-alike pairs (their / there) keep their own log (pairs.ts); a pair with a mistake is shown in
// My Mistakes too, with a link back to the pair.
function pairMistakeEntries(): MistakeEntry[] {
  const attempts = getPairAttempts()
  return pairStatuses(attempts)
    .filter((status) => status.errors > 0)
    .map((status) => {
      const history = attempts.filter((attempt) => attempt.pairId === status.pair.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      const lastFailure = [...history].reverse().find((attempt) => !attempt.correct)!
      const latest = history.at(-1)!
      const sentence = status.pair.sentences.find((item) => item.text === lastFailure.sentence)
      const answer = sentence?.answer ?? status.pair.words.find((word) => word !== lastFailure.chosen) ?? status.pair.words[0]
      const result: MistakeEntry = {
        taskId: `pair:${status.pair.id}`,
        pairId: status.pair.id,
        correctAnswer: answer,
        lastUserVersion: lastFailure.chosen,
        errorCategory: 'Confusing words',
        family: 'Spelling',
        topic: status.pair.words.join(' / '),
        translation: lastFailure.sentence.replace('___', answer),
        numberOfAttempts: history.length,
        numberOfErrors: status.errors,
        numberOfCorrectAnswers: history.length - status.errors,
        firstSeen: history[0].createdAt,
        lastSeen: latest.createdAt,
        lastMistakeAt: lastFailure.createdAt,
        nextReviewAt: status.nextReviewAt,
        status:
          status.state === 'mastered'
            ? 'mastered'
            : !latest.correct
              ? status.errors >= 3
                ? 'difficult'
                : 'new'
              : status.goodDays >= 3
                ? 'review'
                : 'learning',
        goodDays: status.goodDays,
        origin: 'Pairs',
      }
      result.archived =
        result.status !== 'mastered' && latest.correct && Date.now() - new Date(lastFailure.createdAt).getTime() > ARCHIVE_AFTER_MS
      return result
    })
    .filter((entry) => pairDrills.some((pair) => pair.id === entry.pairId))
}

export function getMistakeEntries(): MistakeEntry[] {
  const states = getReviewStates()
  const translations = new Map(getEveryWord().map((word) => [word.wordId, word.translation]))
  const groups = new Map<string, PracticeAttempt[]>()
  const relevant = relevanceCheck()

  for (const attempt of getPracticeAttempts().filter(relevant)) {
    const key = attempt.wordId ?? attempt.taskId
    const items = groups.get(key) ?? []
    items.push(attempt)
    groups.set(key, items)
  }

  const practiceEntries = [...groups.entries()]
    .map(([entryId, attempts]): MistakeEntry | null => {
      const failed = attempts.filter((attempt) => !attempt.isCorrect)
      if (failed.length === 0) return null
      const chronological = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      const lastFailure = [...failed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      const state = states[entryId]
      // Successful review days since the last mistake, as stored on the newest answer (see reviewSchedule.ts).
      const latest = chronological.at(-1)!
      const confidence = latest.isCorrect ? (latest.confidence ?? 0) : 0
      // The level follows the latest answers: one right answer lifts the word out of "new"/"difficult",
      // and each successful day moves it further. "Difficult" is only for a word that is wrong right now.
      const status: LearningStatus =
        confidence >= MASTERED_DAYS || (state?.completedReviews ?? 0) >= 3
          ? 'mastered'
          : !latest.isCorrect
            ? failed.length >= 3
              ? 'difficult'
              : 'new'
            : confidence >= 3
              ? 'review'
              : 'learning'

      return {
        taskId: entryId,
        correctAnswer: lastFailure.correctAnswer,
        lastUserVersion: lastFailure.userAnswer || 'Skipped',
        errorCategory: lastFailure.errorCategory,
        family: familyFor(lastFailure.errorCategory),
        topic: lastFailure.topic,
        topicId: lastFailure.topicId,
        subtopic: lastFailure.subtopic,
        wordId: lastFailure.wordId,
        translation: lastFailure.wordId ? translations.get(lastFailure.wordId) : undefined,
        library: lastFailure.library,
        errorType: lastFailure.errorType,
        numberOfAttempts: attempts.length,
        numberOfErrors: failed.length,
        numberOfCorrectAnswers: attempts.filter((attempt) => attempt.isCorrect).length,
        origin: ['Proofreading', 'Level check', 'Sprint'].includes(lastFailure.library ?? '') ? lastFailure.library : 'Practice',
        // Quiet archive: no mistake for 30 days and the latest answer was right.
        archived: status !== 'mastered' && latest.isCorrect && Date.now() - new Date(lastFailure.createdAt).getTime() > ARCHIVE_AFTER_MS,
        lastMistakeAt: lastFailure.createdAt,
        firstSeen: chronological[0].createdAt,
        lastSeen: chronological.at(-1)!.createdAt,
        // The latest answer sets the next review; "Mark reviewed" counts only if it is newer.
        nextReviewAt:
          state?.nextReviewAt && state.nextReviewAt > (latest.nextReviewAt ?? '') && (state.lastReviewedAt ?? '') > latest.createdAt
            ? state.nextReviewAt
            : (latest.nextReviewAt ?? addDays(new Date(latest.createdAt), 1)),
        status,
        goodDays: Math.min(confidence, MASTERED_DAYS),
      } as MistakeEntry
    })
    .filter((entry): entry is MistakeEntry => entry !== null)

  return [...practiceEntries, ...pairMistakeEntries()].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
}

/** The word is already an open mistake (not mastered): a yellow card for it would only repeat it. */
export function hasOpenMistake(word: string) {
  const lower = word.toLocaleLowerCase()
  return getMistakeEntries().some((entry) => entry.status !== 'mastered' && entry.correctAnswer.toLocaleLowerCase() === lower)
}

// Everything that happened with one word (or pair), newest first: answers in every part of the app
// and yellow cards. Shown under "History" in My Mistakes.
export type HistoryItem = { at: string; where: string; typed: string; correct: boolean; yellow?: boolean }
const modeNames: Record<string, string> = {
  'write-en': 'Write in English',
  'listen-write': 'Listen and write',
  'translate-ru': 'Translate to Russian',
  'choose-spelling': 'Choose the spelling',
  'fill-gap': 'Fill the gap',
}
export function getEntryHistory(entry: MistakeEntry): HistoryItem[] {
  if (entry.pairId)
    return getPairAttempts()
      .filter((attempt) => attempt.pairId === entry.pairId)
      .map((attempt) => ({ at: attempt.createdAt, where: 'Pairs', typed: attempt.chosen, correct: attempt.correct }))
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 30)
  const answers = getPracticeAttempts()
    .filter((attempt) => (attempt.wordId ?? attempt.taskId) === entry.taskId)
    .map((attempt) => ({
      at: attempt.createdAt,
      where: ['Proofreading', 'Level check', 'Sprint'].includes(attempt.library ?? '')
        ? attempt.library!
        : `Practice · ${modeNames[attempt.attemptMode] ?? attempt.attemptMode}`,
      typed: attempt.wasSkipped && !attempt.userAnswer ? 'Skipped' : attempt.userAnswer,
      correct: attempt.isCorrect,
    }))
  const lower = entry.correctAnswer.toLocaleLowerCase()
  const cards = getAllYellowCards()
    .filter((card) => card.word.toLocaleLowerCase() === lower)
    .map((card) => ({
      at: card.at,
      where: card.source === 'sprint' ? 'Sprint' : `Proofreading · “${card.where}”`,
      typed: card.shown,
      correct: false,
      yellow: true,
    }))
  return [...answers, ...cards].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 30)
}

export function getReviewEntries() {
  const mistakes = getMistakeEntries()
  const hintOnly = new Map<string, MistakeEntry>()
  const relevant = relevanceCheck()
  for (const attempt of getPracticeAttempts().filter((item) => item.hintUsed && item.isCorrect && !item.introduced && relevant(item))) {
    if (mistakes.some((entry) => entry.taskId === attempt.taskId)) continue
    const current = hintOnly.get(attempt.taskId)
    if (current && current.lastSeen >= attempt.createdAt) continue
    hintOnly.set(attempt.taskId, {
      taskId: attempt.taskId,
      correctAnswer: attempt.correctAnswer,
      lastUserVersion: attempt.userAnswer || 'Hint used',
      errorCategory: 'Hint used',
      family: 'Vocabulary',
      topic: attempt.topic,
      topicId: attempt.topicId,
      subtopic: attempt.subtopic,
      wordId: attempt.wordId,
      library: attempt.library,
      numberOfAttempts: 1,
      numberOfErrors: 0,
      numberOfCorrectAnswers: 1,
      firstSeen: attempt.createdAt,
      lastSeen: attempt.createdAt,
      nextReviewAt: attempt.nextReviewAt ?? addDays(new Date(attempt.createdAt), 1),
      status: 'review',
      source: 'practice',
    })
  }
  return [...mistakes, ...hintOnly.values()]
    .filter((entry) => entry.status !== 'mastered')
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
}

// Keeps the more advanced review state per task and unions saved rules; never removes local data.
export function mergeReviewData(states: Record<string, ReviewState>, ruleIds: string[]) {
  const merged = { ...getReviewStates() }
  for (const [taskId, state] of Object.entries(states)) {
    if (
      state &&
      typeof state.completedReviews === 'number' &&
      (!merged[taskId] || state.completedReviews > merged[taskId].completedReviews)
    )
      merged[taskId] = state
  }
  window.localStorage.setItem(REVIEW_STATES_KEY, JSON.stringify(merged))
  // A rule unsaved on any device stays unsaved (the mark is synced with the library preferences).
  const removed = getRemovedKeys()
  window.localStorage.setItem(
    RULE_REVIEW_KEY,
    JSON.stringify([...new Set([...getRuleReviewIds(), ...ruleIds])].filter((id) => !removed.has(`rule:${id}`))),
  )
  window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT))
}

export function getTaskForReview(taskId: string) {
  return getTaskById(taskId)
}

export function getRuleReviewIds() {
  return read<string[]>(RULE_REVIEW_KEY, [])
}

export function toggleRuleReview(ruleId: string) {
  const existing = getRuleReviewIds()
  const removing = existing.includes(ruleId)
  const next = removing ? existing.filter((id) => id !== ruleId) : [...existing, ruleId]
  setRemoved([`rule:${ruleId}`], removing)
  safeSetItem(RULE_REVIEW_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT))
  return next
}

export function subscribeToLearningData(onChange: () => void) {
  const unsubscribe = subscribeToPracticeAttempts(onChange)
  window.addEventListener(LEARNING_UPDATED_EVENT, onChange)
  return () => {
    unsubscribe()
    window.removeEventListener(LEARNING_UPDATED_EVENT, onChange)
  }
}
