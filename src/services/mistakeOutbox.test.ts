import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PracticeAttempt } from '../types/practice'

const net = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(() => false),
  getActiveCloudSession: vi.fn(async (): Promise<unknown> => null),
  sendMistake: vi.fn(async (..._args: unknown[]) => {}),
}))
vi.mock('./supabase', () => ({ isSupabaseConfigured: net.isSupabaseConfigured, getActiveCloudSession: net.getActiveCloudSession }))
vi.mock('./mistakeService', () => ({ sendMistake: net.sendMistake }))

import { enqueueMistake, flushMistakeOutbox, getOutboxSize, shouldClassify, subscribeToOutbox } from './mistakeOutbox'
import { STORAGE_FAILED_EVENT } from './safeStorage'

const KEY = 'spell-sprint.mistake-outbox'
let counter = 0
const wrong = (over: Partial<PracticeAttempt> = {}): PracticeAttempt =>
  ({
    id: `m${++counter}`,
    taskId: 't',
    taskType: 'correct-spelling',
    topic: 'Food',
    userAnswer: 'recieve',
    correctAnswer: 'receive',
    isCorrect: false,
    errorCategory: 'General spelling',
    createdAt: '2026-11-12T10:00:00.000Z',
    ...over,
  }) as PracticeAttempt
const stored = () => JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as PracticeAttempt[]
const online = () => {
  net.isSupabaseConfigured.mockReturnValue(true)
  net.getActiveCloudSession.mockResolvedValue({ user: { id: 'u1' } })
}

beforeEach(() => {
  window.localStorage.clear()
  net.isSupabaseConfigured.mockReset().mockReturnValue(false)
  net.getActiveCloudSession.mockReset().mockResolvedValue(null)
  net.sendMistake.mockReset().mockResolvedValue(undefined)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('shouldClassify: which wrong answers go to the spelling classifier', () => {
  it('a wrong typed spelling does', () => expect(shouldClassify(wrong())).toBe(true))
  it('a right answer does not', () => expect(shouldClassify(wrong({ isCorrect: true }))).toBe(false))
  it('a blank or whitespace answer does not', () => {
    expect(shouldClassify(wrong({ userAnswer: '' }))).toBe(false)
    expect(shouldClassify(wrong({ userAnswer: '   ' }))).toBe(false)
  })
  it('sentences, Russian translations and attention slips do not', () => {
    expect(shouldClassify(wrong({ taskType: 'correct-sentence' }))).toBe(false)
    expect(shouldClassify(wrong({ taskType: 'translate-en-ru' }))).toBe(false)
    expect(shouldClassify(wrong({ errorCategory: 'Attention slip' }))).toBe(false)
  })
  it('translating into English is still classified (it is a spelling of a word)', () => {
    expect(shouldClassify(wrong({ taskType: 'translate-ru-en' }))).toBe(true)
  })
})

describe('the outbox queue', () => {
  it('empty storage is an empty queue; broken JSON or a non-list too', () => {
    expect(getOutboxSize()).toBe(0)
    window.localStorage.setItem(KEY, '{broken')
    expect(getOutboxSize()).toBe(0)
    window.localStorage.setItem(KEY, '{"a":1}')
    expect(getOutboxSize()).toBe(0)
  })
  it('a wrong spelling is kept for later; the same attempt is not queued twice', () => {
    const item = wrong()
    enqueueMistake(item)
    enqueueMistake(item)
    expect(getOutboxSize()).toBe(1)
    expect(stored()[0].id).toBe(item.id)
  })
  it('answers that are not classified are not queued', () => {
    enqueueMistake(wrong({ isCorrect: true }))
    enqueueMistake(wrong({ taskType: 'correct-sentence' }))
    expect(getOutboxSize()).toBe(0)
  })
  it('keeps only the newest 300 waiting mistakes', () => {
    for (let index = 0; index < 305; index += 1) enqueueMistake(wrong({ id: `x${index}` }))
    expect(getOutboxSize()).toBe(300)
    expect(stored()[0].id).toBe('x5')
    expect(stored().at(-1)!.id).toBe('x304')
  })
  it('tells listeners when the queue changes, until they unsubscribe', () => {
    const listener = vi.fn()
    const stop = subscribeToOutbox(listener)
    enqueueMistake(wrong())
    expect(listener).toHaveBeenCalledTimes(1)
    stop()
    enqueueMistake(wrong())
    expect(listener).toHaveBeenCalledTimes(1)
  })
  it('a full storage raises the "could not save" notice and does not crash', () => {
    const failed = vi.fn()
    window.addEventListener(STORAGE_FAILED_EVENT, failed)
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    try {
      expect(() => enqueueMistake(wrong())).not.toThrow()
    } finally {
      window.removeEventListener(STORAGE_FAILED_EVENT, failed)
      setItem.mockRestore()
    }
    expect(failed).toHaveBeenCalled()
  })
})

describe('flushMistakeOutbox', () => {
  it('does nothing without Supabase, without a signed-in session, or with an empty queue; the queue stays', async () => {
    window.localStorage.setItem(KEY, JSON.stringify([wrong()]))
    expect(await flushMistakeOutbox()).toBe(0)
    net.isSupabaseConfigured.mockReturnValue(true) // configured, but nobody signed in
    expect(await flushMistakeOutbox()).toBe(0)
    expect(getOutboxSize()).toBe(1)
    expect(net.sendMistake).not.toHaveBeenCalled()
    window.localStorage.clear()
    online()
    expect(await flushMistakeOutbox()).toBe(0)
    expect(net.getActiveCloudSession).toHaveBeenCalledTimes(1) // the empty queue never even asked for a session
  })
  it('sends everything oldest first and empties the queue', async () => {
    online()
    window.localStorage.setItem(KEY, JSON.stringify([wrong({ id: 'first' }), wrong({ id: 'second' })]))
    expect(await flushMistakeOutbox()).toBe(2)
    expect(net.sendMistake.mock.calls.map(([sent]) => (sent as PracticeAttempt).id)).toEqual(['first', 'second'])
    expect(getOutboxSize()).toBe(0)
  })
  it('no network: stops at the first failure and keeps that mistake and the rest', async () => {
    online()
    window.localStorage.setItem(KEY, JSON.stringify([wrong({ id: 'a' }), wrong({ id: 'b' }), wrong({ id: 'c' })]))
    net.sendMistake.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    expect(await flushMistakeOutbox()).toBe(1)
    expect(stored().map((item) => item.id)).toEqual(['b', 'c'])
    expect(net.sendMistake).toHaveBeenCalledTimes(2)
  })
  it('a server error (500) also keeps the queue for the next try', async () => {
    online()
    window.localStorage.setItem(KEY, JSON.stringify([wrong({ id: 'a' })]))
    net.sendMistake.mockRejectedValueOnce(Object.assign(new Error('boom'), { status: 500 }))
    expect(await flushMistakeOutbox()).toBe(0)
    expect(getOutboxSize()).toBe(1)
  })
  it('a mistake the server rejects as bad data (400, 409, 422) is dropped and the queue goes on', async () => {
    online()
    window.localStorage.setItem(
      KEY,
      JSON.stringify([wrong({ id: 'bad' }), wrong({ id: 'dup' }), wrong({ id: 'weird' }), wrong({ id: 'ok' })]),
    )
    net.sendMistake
      .mockRejectedValueOnce(Object.assign(new Error('x'), { status: 400 }))
      .mockRejectedValueOnce(Object.assign(new Error('x'), { status: 409 }))
      .mockRejectedValueOnce(Object.assign(new Error('x'), { status: 422 }))
    await flushMistakeOutbox()
    expect(getOutboxSize()).toBe(0)
    expect(net.sendMistake).toHaveBeenCalledTimes(4)
  })
  it('two flushes at once send each mistake only once', async () => {
    online()
    window.localStorage.setItem(KEY, JSON.stringify([wrong({ id: 'a' })]))
    await Promise.all([flushMistakeOutbox(), flushMistakeOutbox()])
    expect(net.sendMistake).toHaveBeenCalledTimes(1)
  })
  it('after the network comes back, a later flush sends what was kept', async () => {
    online()
    enqueueMistake(wrong({ id: 'kept' }))
    net.sendMistake.mockRejectedValueOnce(new TypeError('offline'))
    await flushMistakeOutbox()
    expect(getOutboxSize()).toBe(1)
    expect(await flushMistakeOutbox()).toBe(1)
    expect(getOutboxSize()).toBe(0)
  })
})
