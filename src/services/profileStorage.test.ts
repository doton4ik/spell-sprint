import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProfile, nearestMinutes, saveProfile, subscribeToProfile } from './profileStorage'

const KEY = 'spell-sprint.profile'

describe('profile', () => {
  beforeEach(() => window.localStorage.clear())

  it('has defaults when nothing is stored, without a change time', () => {
    expect(getProfile()).toEqual({
      name: '',
      dailyMinutes: 10,
      dailyGoal: 20,
      activities: { dictation: true, proofreading: true, pairs: true, sprint: true },
    })
  })
  it('falls back to the defaults when the stored value is broken', () => {
    window.localStorage.setItem(KEY, '{not json')
    expect(getProfile().dailyMinutes).toBe(10)
    window.localStorage.setItem(KEY, JSON.stringify({ name: 7, dailyMinutes: 12, activities: { sprint: 'no' }, updatedAt: 5 }))
    expect(getProfile()).toMatchObject({ name: '', dailyMinutes: 10, activities: { sprint: true } })
    expect(getProfile().updatedAt).toBeUndefined()
  })
  it('reads an old profile that has only a goal in tasks', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ name: 'Max', dailyGoal: 30 }))
    expect(getProfile()).toMatchObject({ name: 'Max', dailyMinutes: 15, dailyGoal: 30 })
  })
  it('saves a change, keeps the other fields and cuts a long name', () => {
    saveProfile({ name: 'Max', dailyMinutes: 30 })
    saveProfile({ activities: { sprint: false } })
    expect(getProfile()).toMatchObject({ name: 'Max', dailyMinutes: 30, dailyGoal: 60, activities: { sprint: false, pairs: true } })
    expect(saveProfile({ name: 'x'.repeat(60) }).name).toHaveLength(40)
  })
  it('ignores minutes that are not one of the options', () => {
    saveProfile({ dailyMinutes: 30 })
    saveProfile({ dailyMinutes: 7 })
    expect(getProfile().dailyMinutes).toBe(30)
    expect(nearestMinutes(12)).toBe(10)
    expect(nearestMinutes(40)).toBe(30)
  })
  it('stamps a change with the current time, and tells the listeners', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-12T08:00:00.000Z'))
    const heard = vi.fn()
    const stop = subscribeToProfile(heard)
    saveProfile({ name: 'Max' })
    stop()
    saveProfile({ name: 'Maxim' })
    vi.useRealTimers()
    expect(heard).toHaveBeenCalledTimes(1)
    expect(getProfile().updatedAt).toBe('2026-11-12T08:00:00.000Z')
  })
  it('keeps the time it is given (a profile copied from another device), and none for an empty time', () => {
    saveProfile({ name: 'Max' }, '2026-11-01T10:00:00.000Z')
    expect(getProfile().updatedAt).toBe('2026-11-01T10:00:00.000Z')
    saveProfile({ name: 'Max' }, '')
    expect(getProfile().updatedAt).toBeUndefined()
  })
})
