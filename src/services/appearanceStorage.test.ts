import { beforeEach, describe, expect, it } from 'vitest'
import { applyFontScale, clampFontScale, getFontScale, screenFactor, setFontScale } from './appearanceStorage'

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
    applyFontScale(100)
    expect(Number(document.documentElement.style.getPropertyValue('--fs'))).toBeCloseTo(screenFactor(width), 3)
    setFontScale(115)
    expect(Number(document.documentElement.style.getPropertyValue('--fs'))).toBeCloseTo(1.15 * screenFactor(width), 3)
  })

  it('is a slider from 85% to 200% and still reads the old named sizes', () => {
    expect(clampFontScale(10)).toBe(85)
    expect(clampFontScale(500)).toBe(200)
    expect(clampFontScale(152)).toBe(150)
    window.localStorage.setItem('spell-sprint.font-scale', 'xlarge')
    expect(getFontScale()).toBe(130)
    setFontScale(200)
    expect(getFontScale()).toBe(200)
  })
})
