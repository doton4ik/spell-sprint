import { proofreadingTexts as allProofreadingTexts, type ProofreadingLevel, type ProofreadingText } from '../data/proofreadingTexts'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts, savePracticeAttempt } from './practiceStorage'
import { getAllWords, getEveryWord } from './libraryStorage'
import { cleanText, normalise, proofreadingTypes, type ProofreadingResult } from './proofreadingEngine'
import { scheduleAfterAnswer } from './reviewSchedule'

export * from './proofreadingEngine'

// How much each mistake type should come up: types the learner keeps missing count up to 4×.
// How often each type should come up before the learner's own history counts. Based on learner-corpus
// research on Russian speakers (Rozovskaya & Roth 2010, ICLE: articles 19% and prepositions 18% of all
// corrections, an extra "the" is the most common article error) against the number of marked places
// in the texts: the rare-but-frequent types are boosted, the over-represented ones damped.
const baseTypeWeights: Record<string, number> = {
  'article-extra': 4, article: 2, 'plural-uncountable': 2, preposition: 1.6, 'reported-speech': 1.5, 'since-for': 1.3,
  'article-missing': 0.45, agreement: 0.7, tense: 0.8, 'past-irregular': 0.5, 'gerund-infinitive': 0.5, 'word-form': 0.6,
  'present-perfect': 1.6, 'time-clause': 1.6, 'dummy-it': 1.6, 'be-missing': 1.6, 'adverb-position': 1.6, 'double-negative': 1.6, 'there-is': 1.6,
  'word-order': 0.7, passive: 0.5, quantifier: 0.6, conditional: 0.6, comparative: 0.5, modal: 0.8,
}

// The base weights, raised for the types this learner keeps missing (up to ×4).
export function typeWeights(): Record<string, number> {
  const weights: Record<string, number> = {}
  for (const attempt of getPracticeAttempts()) {
    const type = /^Grammar · (.+)$/.exec(attempt.errorCategory)?.[1]
    if (!type || attempt.isCorrect || attempt.library !== 'Proofreading') continue
    const slug = Object.entries(proofreadingTypes).find(([, info]) => info.label === type)?.[0]
    if (slug) weights[slug] = Math.min(4, (weights[slug] ?? 1) + 0.5)
  }
  for (const type of new Set([...Object.keys(baseTypeWeights), ...Object.keys(weights)])) weights[type] = (baseTypeWeights[type] ?? 1) * (weights[type] ?? 1)
  return weights
}

// Every mistake in the text becomes a normal practice attempt, so it shows up in My Mistakes,
// Patterns and the review schedule. Spelling slips go through the spelling classifier and rules.
export function recordProofreading(text: ProofreadingText, result: ProofreadingResult) {
  for (const { slot, status, learnerText } of result.slots) {
    const spelling = slot.type === 'spelling' || slot.type === 'typo'
    const taskId = `proof-${text.id}-${slot.type}-${normalise(slot.correct[0]).replace(/\s+/g, '-')}`
    const correct = status === 'fixed'
    const { confidence, nextReviewAt } = scheduleAfterAnswer({ taskId }, correct, false, 'write-en')
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
// Every word the app knows to be real: library words, their examples and definitions, and every
// proofreading text. A slip that lands on one of these ("cheap" → "chap") is not used.
let knownCache: Set<string> | null = null
function knownWords() {
  if (knownCache) return knownCache
  const words = (value: string | undefined) => (value ?? '').toLocaleLowerCase().match(/[a-z]+/g) ?? []
  knownCache = new Set([
    ...getEveryWord().flatMap((word) => [...words(word.word), ...words(word.example), ...words(word.definition)]),
    ...allProofreadingTexts.flatMap((text) => words(cleanText(text))),
  ])
  return knownCache
}

export function huntOptions() {
  const preferred = new Set([
    ...getAllWords().map((word) => word.word.toLocaleLowerCase()),
    ...getPracticeAttempts().filter((attempt) => !attempt.isCorrect).map((attempt) => attempt.correctAnswer.toLocaleLowerCase()),
  ])
  return { preferred, known: knownWords() }
}

// Texts marked hidden (weaker, template-like ones) stay in the data but are not offered.
export const proofreadingTexts = allProofreadingTexts.filter((text) => !text.hidden)
export function textsForLevel(level: ProofreadingLevel) { return proofreadingTexts.filter((text) => text.level === level) }
