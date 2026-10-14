import { beforeEach, describe, expect, it, vi } from 'vitest'

const insertRows = vi.fn()
const session = { user: { id: 'user-1' } }
let activeSession: unknown = null
vi.mock('./supabase', () => ({
  isSupabaseConfigured: () => true,
  getActiveCloudSession: async () => activeSession,
  insertRows: (...args: unknown[]) => insertRows(...args),
}))

import { cleanMessage, feedbackWaiting, flushFeedback, isMessageLongEnough, submitFeedback } from './feedback'

describe('feedback outbox', () => {
  beforeEach(() => {
    window.localStorage.clear()
    insertRows.mockReset()
    activeSession = null
    window.location.hash = '#rules'
  })

  it('cleans spaces and checks the minimum length the table also checks', () => {
    expect(cleanMessage('  a \n  b   c ')).toBe('a b c')
    expect(isMessageLongEnough('abcd')).toBe(false)
    expect(isMessageLongEnough('  abcde  ')).toBe(true)
  })

  it('keeps a message on the device while nobody is signed in', async () => {
    expect(await submitFeedback('bug', 'The button does nothing')).toBe('saved')
    expect(feedbackWaiting()).toBe(1)
    expect(insertRows).not.toHaveBeenCalled()
  })

  it('sends waiting messages once signed in, with the table fields and the same id on a retry', async () => {
    await submitFeedback('idea', 'Please add a night mode')
    activeSession = session
    insertRows.mockResolvedValue([])
    await flushFeedback()
    expect(insertRows).toHaveBeenCalledTimes(1)
    const [, table, row, options] = insertRows.mock.calls[0]
    expect(table).toBe('feedback')
    expect(row).toMatchObject({ user_id: 'user-1', kind: 'idea', message: 'Please add a night mode', page: 'rules' })
    expect(options).toEqual({ onConflict: 'id', ignoreDuplicates: true })
    expect(feedbackWaiting()).toBe(0)
  })

  it('reports "sent" when the message goes out at once', async () => {
    activeSession = session
    insertRows.mockResolvedValue([])
    expect(await submitFeedback('content', 'The example for "their" is wrong')).toBe('sent')
  })

  it('keeps the message when the table does not exist yet (404) or there is no network', async () => {
    activeSession = session
    insertRows.mockRejectedValue(Object.assign(new Error('no table'), { status: 404 }))
    expect(await submitFeedback('bug', 'Something is broken here')).toBe('saved')
    expect(feedbackWaiting()).toBe(1)
  })

  it('drops a message the server refuses as bad data (400) instead of retrying for ever', async () => {
    activeSession = session
    insertRows.mockRejectedValue(Object.assign(new Error('bad'), { status: 400 }))
    await submitFeedback('bug', 'Something is broken here')
    expect(feedbackWaiting()).toBe(0)
  })

  it('refuses a too short message and more than five a day', async () => {
    expect(await submitFeedback('bug', 'hi')).toBe('too-short')
    for (let index = 0; index < 5; index += 1) expect(await submitFeedback('other', `Message number ${index} here`)).toBe('saved')
    expect(await submitFeedback('other', 'One message too many')).toBe('limit')
  })

  it('cuts a very long message to the table limit of 1000 characters', async () => {
    activeSession = session
    insertRows.mockResolvedValue([])
    await submitFeedback('other', 'x'.repeat(1500))
    expect((insertRows.mock.calls[0][2] as { message: string }).message).toHaveLength(1000)
  })
})
