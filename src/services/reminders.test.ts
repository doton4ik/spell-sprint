import { describe, expect, it } from 'vitest'
import { defaultReminder, getReminder, isValidTime, reminderMoments, saveReminder } from './reminders'

const at = (y: number, m: number, d: number, h: number, min = 0) => new Date(y, m - 1, d, h, min)

describe('reminderMoments', () => {
  it('starts today when the time has not come yet', () => {
    const moments = reminderMoments(at(2026, 11, 8, 10), '19:00', false, 3)
    expect(moments).toEqual([at(2026, 11, 8, 19), at(2026, 11, 9, 19), at(2026, 11, 10, 19)])
  })

  it("starts tomorrow when today's time is already past", () => {
    const moments = reminderMoments(at(2026, 11, 8, 20), '19:00', false, 3)
    expect(moments).toEqual([at(2026, 11, 9, 19), at(2026, 11, 10, 19)])
  })

  it("skips today when the day's plan is done", () => {
    const moments = reminderMoments(at(2026, 11, 8, 10), '19:00', true, 3)
    expect(moments).toEqual([at(2026, 11, 9, 19), at(2026, 11, 10, 19)])
  })

  it('does not schedule a moment that is only seconds away', () => {
    expect(reminderMoments(at(2026, 11, 8, 19, 0), '19:00', false, 1)).toEqual([])
  })

  it('moves across a month end', () => {
    const moments = reminderMoments(at(2026, 11, 30, 21), '08:30', false, 3)
    expect(moments).toEqual([at(2026, 12, 1, 8, 30), at(2026, 12, 2, 8, 30)])
  })
})

describe('reminder settings', () => {
  it('accepts only HH:MM in 24 hours', () => {
    expect(isValidTime('07:05')).toBe(true)
    expect(isValidTime('24:00')).toBe(false)
    expect(isValidTime('7:05')).toBe(false)
    expect(isValidTime(null)).toBe(false)
  })

  it('is off by default and keeps what was saved', () => {
    window.localStorage.removeItem('spell-sprint.reminders')
    expect(getReminder()).toEqual(defaultReminder)
    saveReminder({ enabled: true, time: '08:15' })
    expect(getReminder()).toEqual({ enabled: true, time: '08:15' })
    window.localStorage.setItem('spell-sprint.reminders', JSON.stringify({ enabled: true, time: 'soon' }))
    expect(getReminder()).toEqual({ enabled: true, time: defaultReminder.time })
  })
})
