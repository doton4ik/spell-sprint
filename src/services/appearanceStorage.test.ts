import { beforeEach, describe, expect, it } from 'vitest'
import { applyFontScale, screenFactor, setFontScale } from './appearanceStorage'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.style.removeProperty('--fs')
})

describe('the text size follows the screen width', () => {
  it('leaves phones and laptops as they are and makes a wide screen a little larger', () => {
    expect(screenFactor(375)).toBe(1)
    expect(screenFactor(1366)).toBe(1)
    expect(screenFactor(1400)).toBe(1.05)
    expect(screenFactor(1915)).toBe(1.1)
    expect(screenFactor(2560)).toBe(1.2)
  })

  it('puts the learner’s own choice on top of it', () => {
    const width = window.innerWidth
    applyFontScale('default')
    expect(Number(document.documentElement.style.getPropertyValue('--fs'))).toBeCloseTo(screenFactor(width), 3)
    setFontScale('large')
    expect(Number(document.documentElement.style.getPropertyValue('--fs'))).toBeCloseTo(1.15 * screenFactor(width), 3)
  })
})
