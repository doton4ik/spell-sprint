import { describe, expect, it } from 'vitest'
import { sanitizeAttempt, sanitizeWord } from './validate'

const goodAttempt = {
  id: 'a1',
  taskId: 'library-x-write-en',
  createdAt: '2026-10-07T10:00:00.000Z',
  userAnswer: 'enviroment',
  correctAnswer: 'environment',
  isCorrect: false,
  attemptMode: 'write-en',
  confidence: 2,
}

describe('sanitizeAttempt', () => {
  it('keeps a good attempt', () => {
    expect(sanitizeAttempt(goodAttempt)).toMatchObject({
      id: 'a1',
      userAnswer: 'enviroment',
      isCorrect: false,
      confidence: 2,
      attemptMode: 'write-en',
    })
  })
  it('drops records without id, task or a real date', () => {
    expect(sanitizeAttempt({ ...goodAttempt, id: 5 })).toBeNull()
    expect(sanitizeAttempt({ ...goodAttempt, taskId: undefined })).toBeNull()
    expect(sanitizeAttempt({ ...goodAttempt, createdAt: 'yesterday-ish' })).toBeNull()
    expect(sanitizeAttempt(null)).toBeNull()
    expect(sanitizeAttempt('text')).toBeNull()
  })
  it('repairs wrong types instead of passing them on', () => {
    const fixed = sanitizeAttempt({
      ...goodAttempt,
      userAnswer: 42,
      isCorrect: 'yes',
      attemptMode: 'hack',
      confidence: 1e9,
      nextReviewAt: 'soon',
    })!
    expect(fixed.userAnswer).toBe('')
    expect(fixed.isCorrect).toBe(false)
    expect(fixed.attemptMode).toBe('write-en')
    expect(fixed.confidence).toBe(10)
    expect(fixed.nextReviewAt).toBeUndefined()
  })
  it('cuts very long text', () => {
    expect(sanitizeAttempt({ ...goodAttempt, userAnswer: 'x'.repeat(10_000) })!.userAnswer).toHaveLength(500)
  })
})

describe('sanitizeWord', () => {
  const goodWord = { wordId: 'w1', word: ' bridge ', translation: 'мост', difficulty: 'easy', risk: 2, alternatives: ['span', 7] }
  it('keeps a good word and trims it', () => {
    expect(sanitizeWord(goodWord)).toMatchObject({
      wordId: 'w1',
      id: 'w1',
      word: 'bridge',
      translation: 'мост',
      difficulty: 'easy',
      risk: 2,
      alternatives: ['span'],
    })
  })
  it('drops a word without text or id', () => {
    expect(sanitizeWord({ ...goodWord, word: '' })).toBeNull()
    expect(sanitizeWord({ ...goodWord, translation: null })).toBeNull()
    expect(sanitizeWord({ word: 'x', translation: 'y' })).toBeNull()
  })
  it('repairs a wrong difficulty and risk', () => {
    expect(sanitizeWord({ ...goodWord, difficulty: 'impossible', risk: 99 })).toMatchObject({ difficulty: 'medium', risk: 5 })
  })
})
