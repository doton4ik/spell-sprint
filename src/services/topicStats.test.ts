import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import type { LibraryWord } from '../types/library'
import { getTopicStats, pickPracticeWords, topicStatusLabels, type TopicStats } from './topicStats'

const NOW = new Date(2026, 10, 12, 12, 0, 0) // 12 Nov 2026, local noon
const at = (daysAgo: number, hour = 10) => new Date(2026, 10, 12 - daysAgo, hour, 0, 0).toISOString()
const FUTURE = new Date(2026, 10, 20, 0, 0, 0).toISOString()

let counter = 0
function attempt(word: LibraryWord, over: Partial<PracticeAttempt> = {}): PracticeAttempt {
  counter += 1
  return {
    id: `a${counter}`,
    taskId: `t${counter}`,
    taskType: 'correct-spelling',
    topic: word.topic,
    wordId: word.wordId,
    userAnswer: 'x',
    correctAnswer: word.word,
    isCorrect: true,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    confidence: 1,
    nextReviewAt: FUTURE,
    errorCategory: '',
    needsReview: false,
    createdAt: at(1),
    ...over,
  } as PracticeAttempt
}
function store(attempts: PracticeAttempt[]) {
  const sorted = [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  window.localStorage.setItem('spell-sprint.practice-attempts', JSON.stringify(sorted))
}

// A topic with plenty of words, found with no history so that the tests do not depend on a topic's name.
function bigTopic() {
  window.localStorage.clear()
  const topic = getTopicStats().find((item) => item.words.length >= 20)!
  return { name: topic.topic, words: topic.words }
}
const statsOf = (name: string): TopicStats => getTopicStats().find((item) => item.topic === name)!

beforeEach(() => {
  window.localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => vi.useRealTimers())

describe('getTopicStats', () => {
  it('with no history every topic is "not-started" and has no accuracy', () => {
    const all = getTopicStats()
    expect(all.length).toBeGreaterThan(10)
    for (const item of all) {
      expect(item).toMatchObject({ status: 'not-started', accuracy: null, practised: 0, answers: 0, due: 0, known: 0, lastPractised: null })
      expect(item.words.length).toBeGreaterThan(0)
    }
  })
  it('broken JSON in storage is the same as no history', () => {
    window.localStorage.setItem('spell-sprint.practice-attempts', 'nope{')
    expect(getTopicStats().every((item) => item.status === 'not-started')).toBe(true)
  })
  it('every status has a label for the page', () => {
    for (const status of ['not-started', 'preliminary', 'needs-focus', 'developing', 'strong'] as const)
      expect(topicStatusLabels[status]).toBeTruthy()
  })

  it('7 right answers is still "preliminary" (too little data), the 8th makes it count', () => {
    const { name, words } = bigTopic()
    store(words.slice(0, 7).map((word) => attempt(word)))
    expect(statsOf(name)).toMatchObject({ status: 'preliminary', accuracy: 100, answers: 7 })
    store(words.slice(0, 8).map((word) => attempt(word)))
    expect(statsOf(name)).toMatchObject({ status: 'developing', answers: 8 }) // 8 of 20+ words: less than half practised
  })
  it('accuracy and answers count every answer, not only the latest one of a word', () => {
    const { name, words } = bigTopic()
    store([attempt(words[0], { isCorrect: false, createdAt: at(3) }), attempt(words[0], { createdAt: at(2) }), attempt(words[1])])
    expect(statsOf(name)).toMatchObject({ answers: 3, practised: 2, accuracy: 67 })
  })
  it('"strong" needs 85% right and at least half of the words practised', () => {
    const { name, words } = bigTopic()
    const half = Math.ceil(words.length / 2)
    store(words.slice(0, half).map((word) => attempt(word)))
    expect(statsOf(name).status).toBe('strong')
    store(words.slice(0, half - 1).map((word) => attempt(word)))
    expect(statsOf(name).status).toBe('developing')
  })
  it('80% right is "developing" however many words are practised, 85% is "strong"', () => {
    const { name, words } = bigTopic()
    const half = Math.ceil(words.length / 2)
    const wrongEvery = (every: number) => words.slice(0, half).map((word, index) => attempt(word, { isCorrect: index % every !== 0 }))
    store(wrongEvery(5)) // one wrong in five: about 80%
    expect(statsOf(name)).toMatchObject({ status: 'developing' })
    expect(statsOf(name).accuracy).toBeLessThan(85)
    store(wrongEvery(1000)) // one wrong in the whole list: over 85%
    expect(statsOf(name).status).toBe('strong')
  })
  it('below 60% right is "needs-focus" once there are 8 answers', () => {
    const { name, words } = bigTopic()
    store(words.slice(0, 8).map((word, index) => attempt(word, { isCorrect: index < 4 }))) // 50%
    expect(statsOf(name)).toMatchObject({ status: 'needs-focus', accuracy: 50 })
  })
  it('5 words waiting for review make a topic "needs-focus" even with few answers', () => {
    const { name, words } = bigTopic()
    store(words.slice(0, 4).map((word) => attempt(word, { nextReviewAt: at(1) })))
    expect(statsOf(name)).toMatchObject({ due: 4, status: 'preliminary' })
    store(words.slice(0, 5).map((word) => attempt(word, { nextReviewAt: at(1) })))
    expect(statsOf(name)).toMatchObject({ due: 5, status: 'needs-focus' })
  })
  it('a review date today at 23:00 is due, tomorrow at 00:00 is not', () => {
    const { name, words } = bigTopic()
    store([
      attempt(words[0], { nextReviewAt: new Date(2026, 10, 12, 23, 0, 0).toISOString() }),
      attempt(words[1], { nextReviewAt: new Date(2026, 10, 13, 0, 0, 0).toISOString() }),
    ])
    expect(statsOf(name).due).toBe(1)
  })
  it('"known" is a word whose latest answer is right and that was right at least twice', () => {
    const { name, words } = bigTopic()
    store([
      attempt(words[0], { createdAt: at(3) }),
      attempt(words[0], { createdAt: at(2) }), // known
      attempt(words[1]), // right once only
      attempt(words[2], { createdAt: at(3) }),
      attempt(words[2], { createdAt: at(2) }),
      attempt(words[2], { createdAt: at(1), isCorrect: false }), // latest is wrong
    ])
    expect(statsOf(name).known).toBe(1)
  })
  it('lastPractised is the newest answer of the topic; subtopic counts add up', () => {
    const { name, words } = bigTopic()
    store([attempt(words[0], { createdAt: at(5) }), attempt(words[1], { createdAt: at(2) })])
    const stats = statsOf(name)
    expect(stats.lastPractised).toBe(at(2))
    expect(stats.subtopics.reduce((sum, item) => sum + item.words, 0)).toBe(words.length)
    expect(stats.subtopics.reduce((sum, item) => sum + item.practised, 0)).toBe(2)
  })
  it('answers about words of another topic are not counted here', () => {
    const { name, words } = bigTopic()
    const other = getTopicStats().find((item) => item.topic !== name)!
    store(other.words.slice(0, 3).map((word) => attempt(word)))
    expect(statsOf(name).answers).toBe(0)
    expect(statsOf(other.topic).answers).toBe(3)
    expect(words.length).toBeGreaterThan(0)
  })
})

describe('pickPracticeWords', () => {
  it('due words first, then words that keep going wrong, then never-seen, then the rest', () => {
    const { words } = bigTopic()
    const [due, wrong, unseen, fine, unseen2] = words
    store([
      attempt(due, { nextReviewAt: at(1) }),
      attempt(wrong, { isCorrect: false, createdAt: at(2) }),
      attempt(wrong, { isCorrect: false, createdAt: at(1), nextReviewAt: FUTURE }),
      attempt(fine, { createdAt: at(1) }),
    ])
    const picked = pickPracticeWords([fine, unseen2, wrong, unseen, due], 5).map((word) => word.wordId)
    expect(picked.slice(0, 2)).toEqual([due.wordId, wrong.wordId])
    expect(picked.slice(2, 4).sort()).toEqual([unseen.wordId, unseen2.wordId].sort())
    expect(picked[4]).toBe(fine.wordId)
  })
  it('respects the limit and does not change the list it was given', () => {
    const { words } = bigTopic()
    const input = words.slice(0, 12)
    const copy = [...input]
    expect(pickPracticeWords(input, 4)).toHaveLength(4)
    expect(pickPracticeWords(input)).toHaveLength(10)
    expect(input).toEqual(copy)
  })
})
