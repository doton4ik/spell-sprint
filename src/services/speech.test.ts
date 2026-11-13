import { beforeEach, describe, expect, it } from 'vitest'
import { saveProfile, speechSpeedOptions } from './profileStorage'
import { slowSpeechRate, speechRate, speechRates } from './speech'

describe('reading speed', () => {
  beforeEach(() => window.localStorage.clear())

  it('maps the three speeds to the same rates everywhere', () => {
    expect(speechRates).toEqual({ slow: 0.75, normal: 1, fast: 1.15 })
    expect(speechRate({ speechSpeed: 'slow' })).toBe(0.75)
    expect(speechRate({ speechSpeed: 'normal' })).toBe(1)
    expect(speechRate({ speechSpeed: 'fast' })).toBe(1.15)
  })
  it('is normal for a device that never chose a speed', () => {
    expect(speechRate()).toBe(1)
    window.localStorage.setItem('spell-sprint.profile', JSON.stringify({ name: 'Max' }))
    expect(speechRate()).toBe(1)
  })
  it('follows the saved choice', () => {
    saveProfile({ speechSpeed: 'fast' })
    expect(speechRate()).toBe(1.15)
    saveProfile({ speechSpeed: 'slow' })
    expect(speechRate()).toBe(0.75)
  })
  it('a slower replay is slower than the chosen speed for every choice, and never below the floor', () => {
    for (const speechSpeed of speechSpeedOptions) {
      const profile = { speechSpeed }
      expect(slowSpeechRate(profile)).toBeLessThan(speechRate(profile))
      expect(slowSpeechRate(profile)).toBeGreaterThanOrEqual(0.5)
    }
  })
})
