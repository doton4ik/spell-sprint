import { describe, expect, it } from 'vitest'
import { shuffled, spellingDistractors } from './spellingDistractors'

const noRealWords = () => false

describe('spellingDistractors', () => {
  it('gives three wrong spellings, none equal to the answer', () => {
    const options = spellingDistractors('accommodation', noRealWords)
    expect(options).toHaveLength(3)
    expect(options.map((option) => option.toLowerCase())).not.toContain('accommodation')
    expect(new Set(options).size).toBe(3)
  })
  it('never offers a real word', () => {
    const real = new Set(['batter', 'bettery'])
    for (const option of spellingDistractors('battery', (word) => real.has(word), 10)) expect(real.has(option)).toBe(false)
  })
  it('gives short phrasal verbs at least two options', () => {
    for (const phrase of ['give up', 'turn on', 'take off', 'go on'])
      expect(spellingDistractors(phrase, noRealWords).length).toBeGreaterThanOrEqual(2)
  })
  it('keeps the other words of a phrase', () => {
    for (const option of spellingDistractors('look forward to', noRealWords)) expect(option.split(' ').length).toBeGreaterThanOrEqual(2)
  })
})

describe('shuffled', () => {
  it('returns the same items in a new array', () => {
    const items = [1, 2, 3, 4, 5]
    const result = shuffled(items)
    expect(result).not.toBe(items)
    expect([...result].sort()).toEqual(items)
  })
})
