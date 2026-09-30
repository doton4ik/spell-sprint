import { proofreadingTexts, type ProofreadingLevel, type ProofreadingText } from '../data/proofreadingTexts'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts, savePracticeAttempt } from './practiceStorage'
import { getAllWords, getEveryWord } from './libraryStorage'
import { normalise, proofreadingTypes, type ProofreadingResult } from './proofreadingEngine'
import { scheduleAfterAnswer } from './reviewSchedule'

export * from './proofreadingEngine'

// How much each mistake type should come up: types the learner keeps missing count up to 4×.
export function typeWeights(): Record<string, number> {
  const weights: Record<string, number> = {}
  for (const attempt of getPracticeAttempts()) {
    const type = /^Grammar · (.+)$/.exec(attempt.errorCategory)?.[1]
    if (!type || attempt.isCorrect || attempt.library !== 'Proofreading') continue
    const slug = Object.entries(proofreadingTypes).find(([, info]) => info.label === type)?.[0]
    if (slug) weights[slug] = Math.min(4, (weights[slug] ?? 1) + 0.5)
  }
  return weights
}

// Every mistake in the text becomes a normal practice attempt, so it shows up in My Mistakes,
// Patterns and the review schedule. Spelling slips go through the spelling classifier and rules.
export function recordProofreading(text: ProofreadingText, result: ProofreadingResult) {
  for (const { slot, status, learnerText } of result.slots) {
    const spelling = slot.type === 'spelling' || slot.type === 'typo'
    const taskId = `proof-${text.id}-${slot.type}-${normalise(slot.correct[0]).replace(/\s+/g, '-')}`
    const correct = status === 'fixed'
    const { confidence, nextReviewAt } = scheduleAfterAnswer({ taskId }, correct, false)
    const attempt: PracticeAttempt = {
      id: crypto.randomUUID(), taskId, taskType: spelling ? 'correct-spelling' : 'correct-sentence', topic: text.topic, library: 'Proofreading',
      userAnswer: status === 'missed' ? slot.shown : learnerText, correctAnswer: slot.correct[0], isCorrect: correct, wasSkipped: false, wasAnswerRevealed: false, hintUsed: false,
      attemptMode: 'write-en', errorType: 'unknown', confidence, nextReviewAt, needsReview: !correct,
      errorCategory: slot.type === 'typo' ? 'Attention slip' : spelling ? 'General spelling' : `Grammar · ${proofreadingTypes[slot.type]?.label ?? slot.type}`, createdAt: new Date().toISOString(),
    }
    savePracticeAttempt(attempt)
  }
}

// Spelling hunt: slips go first into words the learner studies or has got wrong; library words
// also tell the engine which letter strings are real words, so a slip never makes another real word.
export function huntOptions() {
  const preferred = new Set([
    ...getAllWords().map((word) => word.word.toLocaleLowerCase()),
    ...getPracticeAttempts().filter((attempt) => !attempt.isCorrect).map((attempt) => attempt.correctAnswer.toLocaleLowerCase()),
  ])
  const known = new Set(getEveryWord().map((word) => word.word.toLocaleLowerCase()))
  return { preferred, known }
}

export function textsForLevel(level: ProofreadingLevel) { return proofreadingTexts.filter((text) => text.level === level) }
export { proofreadingTexts }
