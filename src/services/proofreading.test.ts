import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hiddenProofreadingTextIds } from '../data/proofreadingHidden'
import { proofreadingTexts as everyText, type ProofreadingText } from '../data/proofreadingTexts'
import { getProofreadingDone } from './proofreadingDone'
import { getPracticeAttempts } from './practiceStorage'
import { getAllWords, getEveryWord } from './libraryStorage'
import { getAllYellowCards, getYellowCards } from './yellowCards'
import { huntOptions, proofreadingTexts, recordProofreading, textsForLevel, typeWeights, type ProofreadingResult } from './proofreading'

const NOW = new Date(2026, 10, 12, 12, 0, 0)
const text = (over: Partial<ProofreadingText> = {}): ProofreadingText => ({
  id: 'test-text',
  title: 'A test text',
  level: 'B1',
  format: 'message',
  topic: 'Travel',
  text: 'x',
  ...over,
})
const slot = (type: string, correct: string, shown = 'shown', id = 1) => ({ id, type, correct: [correct], shown, tokenIds: [id] })
const result = (...slots: Array<[ReturnType<typeof slot>, 'fixed' | 'wrong-fix' | 'missed', string?]>): ProofreadingResult => ({
  slots: slots.map(([s, status, learnerText]) => ({ slot: s, status, learnerText: learnerText ?? s.correct[0] })),
  falseAlarms: [],
  found: 0,
  fixed: 0,
})
// A real library word that is not in anybody's history yet.
const libraryWord = () => getEveryWord().find((item) => /^[a-z]{6,}$/.test(item.word))!

beforeEach(() => {
  window.localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => vi.useRealTimers())

describe('texts offered to the learner', () => {
  it('hidden texts are not offered, the others are', () => {
    expect(proofreadingTexts.length).toBe(everyText.filter((item) => !hiddenProofreadingTextIds.has(item.id)).length)
    expect(proofreadingTexts.length).toBeLessThan(everyText.length)
    expect(proofreadingTexts.some((item) => hiddenProofreadingTextIds.has(item.id))).toBe(false)
  })
  it('a level gives only texts of that level', () => {
    const b1 = textsForLevel('B1')
    expect(b1.length).toBeGreaterThan(0)
    expect(b1.every((item) => item.level === 'B1')).toBe(true)
    expect(textsForLevel('A2').length + b1.length).toBeLessThan(proofreadingTexts.length + 1)
  })
})

describe('typeWeights: which mistake types come up more often', () => {
  it('a new learner gets the base weights: extra "the" is boosted, a missing article damped', () => {
    const weights = typeWeights()
    expect(weights['article-extra']).toBe(4)
    expect(weights['article-missing']).toBe(0.45)
    expect(weights['no-such-type']).toBeUndefined()
  })
  it('each missed Proofreading mistake of a type raises it by half, up to four times', () => {
    const wrongExtra = (library = 'Proofreading', isCorrect = false) => ({
      id: `a${Math.random()}`,
      library,
      isCorrect,
      errorCategory: 'Grammar · Extra article',
      createdAt: NOW.toISOString(),
    })
    window.localStorage.setItem('spell-sprint.practice-attempts', JSON.stringify([wrongExtra(), wrongExtra()]))
    expect(typeWeights()['article-extra']).toBe(4 * 2)
    window.localStorage.setItem('spell-sprint.practice-attempts', JSON.stringify(Array.from({ length: 20 }, () => wrongExtra())))
    expect(typeWeights()['article-extra']).toBe(4 * 4)
  })
  it('right answers, other libraries and other categories change nothing', () => {
    const base = typeWeights()
    window.localStorage.setItem(
      'spell-sprint.practice-attempts',
      JSON.stringify([
        { id: '1', library: 'Proofreading', isCorrect: true, errorCategory: 'Grammar · Extra article', createdAt: 'x' },
        { id: '2', library: 'Food', isCorrect: false, errorCategory: 'Grammar · Extra article', createdAt: 'x' },
        { id: '3', library: 'Proofreading', isCorrect: false, errorCategory: 'General spelling', createdAt: 'x' },
        { id: '4', library: 'Proofreading', isCorrect: false, errorCategory: 'Grammar · Not a real label', createdAt: 'x' },
      ]),
    )
    expect(typeWeights()).toEqual(base)
  })
  it('damaged storage gives the base weights', () => {
    window.localStorage.setItem('spell-sprint.practice-attempts', 'oops')
    expect(typeWeights()['article-extra']).toBe(4)
  })
})

describe('recordProofreading', () => {
  it('marks the text as done even when nothing is saved for its slips', () => {
    recordProofreading(text(), result())
    expect(getProofreadingDone().map((item) => item.textId)).toEqual(['test-text'])
    expect(getPracticeAttempts()).toHaveLength(0)
  })
  it('a fixed grammar slip is a right answer, a wrong fix is a mistake, both under the text topic', () => {
    recordProofreading(
      text(),
      result([slot('article-extra', 'the', 'the', 1), 'fixed', 'a'], [slot('preposition', 'in', 'on', 2), 'wrong-fix', 'at']),
    )
    const saved = [...getPracticeAttempts()].sort((a, b) => a.correctAnswer.localeCompare(b.correctAnswer))
    expect(saved).toHaveLength(2)
    expect(saved[0]).toMatchObject({
      correctAnswer: 'in',
      isCorrect: false,
      userAnswer: 'at',
      errorCategory: 'Grammar · Prepositions',
      needsReview: true,
      library: 'Proofreading',
      topic: 'Travel',
      taskType: 'correct-sentence',
    })
    expect(saved[1]).toMatchObject({ correctAnswer: 'the', isCorrect: true, errorCategory: 'Grammar · Extra article', needsReview: false })
  })
  it('a grammar slip that was not noticed is a mistake and shows the learner the text as it was', () => {
    recordProofreading(text(), result([slot('tense', 'went', 'goed'), 'missed']))
    expect(getPracticeAttempts()[0]).toMatchObject({ isCorrect: false, userAnswer: 'goed', correctAnswer: 'went' })
  })
  it('an unknown slip type still gets a readable category', () => {
    recordProofreading(text(), result([slot('brand-new-type', 'x'), 'fixed']))
    expect(getPracticeAttempts()[0].errorCategory).toBe('Grammar · brand-new-type')
  })
  it('a spelling slip that was not noticed is only a yellow card the first time, not a mistake', () => {
    const word = libraryWord().word
    recordProofreading(text(), result([slot('spelling', word, 'wrongly'), 'missed']))
    expect(getPracticeAttempts()).toHaveLength(0)
    expect(getYellowCards()).toHaveLength(1)
    expect(getYellowCards()[0]).toMatchObject({ word, shown: 'wrongly', source: 'proofreading', where: 'A test text' })
  })
  it('missing the same word a second time turns into a real mistake of the library word', () => {
    const entry = libraryWord()
    recordProofreading(text(), result([slot('spelling', entry.word, 'wrongly'), 'missed']))
    recordProofreading(text({ id: 'second' }), result([slot('spelling', entry.word, 'wrongly'), 'missed']))
    expect(getAllYellowCards().map((card) => card.escalated)).toEqual([true, true]) // both cards are used up: the second made it red
    expect(getYellowCards()).toHaveLength(0)
    expect(getPracticeAttempts()).toHaveLength(1)
    expect(getPracticeAttempts()[0]).toMatchObject({
      wordId: entry.wordId,
      isCorrect: false,
      errorCategory: 'General spelling',
      taskType: 'correct-spelling',
      attemptMode: 'choose-spelling',
    })
  })
  it('a fixed spelling slip of a library word is a right answer and counts for that word', () => {
    const entry = libraryWord()
    recordProofreading(text(), result([slot('spelling', entry.word.toUpperCase()), 'fixed']))
    expect(getPracticeAttempts()[0]).toMatchObject({ wordId: entry.wordId, isCorrect: true })
  })
  it('a spelling slip of a word that is not in the library has no word id and is written, not chosen', () => {
    recordProofreading(text(), result([slot('spelling', 'zzqxword'), 'fixed']))
    expect(getPracticeAttempts()[0].wordId).toBeUndefined()
    expect(getPracticeAttempts()[0]).toMatchObject({ attemptMode: 'write-en', isCorrect: true })
  })
  it('a typo is an attention slip, not a spelling-rule mistake', () => {
    recordProofreading(text(), result([slot('typo', 'zzqxword', 'zzqxwrod'), 'wrong-fix', 'zzqxwrdo']))
    expect(getPracticeAttempts()[0]).toMatchObject({ errorCategory: 'Attention slip', isCorrect: false })
  })
  it('a word already in My Mistakes does not get a yellow card or a second mistake when it is missed again', () => {
    const entry = libraryWord()
    recordProofreading(text(), result([slot('spelling', entry.word, 'x'), 'wrong-fix', 'wrongly'])) // a real mistake
    expect(getPracticeAttempts()).toHaveLength(1)
    recordProofreading(text({ id: 'again' }), result([slot('spelling', entry.word, 'x'), 'missed']))
    expect(getPracticeAttempts()).toHaveLength(1)
    expect(getYellowCards()).toHaveLength(0)
  })
})

describe('huntOptions (the spelling hunt)', () => {
  it('prefers the learner’s library words, in lower case, and knows real words from the library and the texts', () => {
    const { preferred, known } = huntOptions()
    const entry = getAllWords()[0]
    expect(preferred.has(entry.word.toLocaleLowerCase())).toBe(true)
    expect(known.has(entry.word.toLocaleLowerCase())).toBe(true)
    expect(known.has('zzqxword')).toBe(false)
    expect([...preferred].every((word) => word === word.toLocaleLowerCase())).toBe(true)
  })
  it('words the learner got wrong become preferred even when they are not in a library', () => {
    window.localStorage.setItem(
      'spell-sprint.practice-attempts',
      JSON.stringify([{ id: '1', isCorrect: false, correctAnswer: 'Zzqxword', createdAt: 'x' }]),
    )
    expect(huntOptions().preferred.has('zzqxword')).toBe(true)
  })
})
