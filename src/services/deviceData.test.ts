import { beforeEach, describe, expect, it } from 'vitest'
import { claimDeviceData, clearPersonalData } from './deviceData'

// Everything that says something about one learner. A new personal key must be added here and in deviceData.ts.
const personal = [
  'practice-attempts',
  'review-states',
  'rule-review',
  'level-checks',
  'level-check-run',
  'custom-libraries',
  'library-prefs',
  'word-reports',
  'sync-state',
  'sprint-rounds',
  'pair-attempts',
  'mistake-outbox',
  'mistake-served',
  'error-outbox',
  'yellow-cards',
  'diagnostic-result',
  'profile',
  'listening-progress',
  'proofreading-done',
  'proof-sentences-seen',
  'feedback',
]
// Settings of the device, not of the learner
const device = ['font-scale', 'theme', 'menu-hidden', 'practice-settings', 'reminders']
const fill = () => {
  for (const name of [...personal, ...device]) window.localStorage.setItem(`spell-sprint.${name}`, '"x"')
}
const stored = (names: string[]) => names.filter((name) => window.localStorage.getItem(`spell-sprint.${name}`) !== null)

describe('personal data on a shared device', () => {
  beforeEach(() => window.localStorage.clear())

  it('clearing removes every personal key and keeps the device settings', () => {
    fill()
    clearPersonalData()
    expect(stored(personal)).toEqual([])
    expect(stored(device)).toEqual(device)
    expect(window.localStorage.getItem('spell-sprint.data-owner')).toBeNull()
  })
  it('a guest keeps the data when signing in, and so does the same account signing in again', () => {
    fill()
    claimDeviceData('user-1')
    claimDeviceData('user-1')
    expect(stored(personal)).toEqual(personal)
    expect(window.localStorage.getItem('spell-sprint.data-owner')).toBe('user-1')
  })
  it('another account starts clean: nothing of the previous learner is left', () => {
    claimDeviceData('user-1')
    fill()
    claimDeviceData('user-2')
    expect(stored(personal)).toEqual([])
    expect(window.localStorage.getItem('spell-sprint.data-owner')).toBe('user-2')
  })
})
