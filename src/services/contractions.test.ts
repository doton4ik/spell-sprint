import { describe, expect, it } from 'vitest'
import { sameText, variants } from './contractions'

describe('contractions', () => {
  it('a contraction is the same as its long form', () => {
    for (const [short, long] of [
      ["It's very cold.", 'It is very cold.'],
      ["I don't know", 'I do not know'],
      ["She isn't here", 'She is not here'],
      ["I'm ready", 'I am ready'],
      ["They're late", 'They are late'],
      ["We've finished", 'We have finished'],
      ["I'll call you", 'I will call you'],
      ["Let's go", 'Let us go'],
      ["I can't swim", 'I cannot swim'],
      ["I can't swim", 'I can not swim'],
      ["He won't come", 'He will not come'],
    ])
      expect(sameText(short, long), `${short} / ${long}`).toBe(true)
  })
  it('works in both directions, with any case, punctuation and kind of apostrophe', () => {
    expect(sameText('It is very cold in the morning.', 'it’s VERY cold in the morning')).toBe(true)
    expect(sameText('it’s very cold in the morning', 'It is very cold in the morning.')).toBe(true)
  })
  it("keeps both readings of an ambiguous 's and 'd", () => {
    expect(sameText("He's gone", 'He has gone')).toBe(true)
    expect(sameText("He's tired", 'He is tired')).toBe(true)
    expect(sameText("I'd like tea", 'I would like tea')).toBe(true)
    expect(sameText("I'd finished", 'I had finished')).toBe(true)
  })
  it('does not mix up words that only look alike', () => {
    expect(sameText('Its tail is long', "It's tail is long")).toBe(false)
    expect(sameText('Its tail', 'It is tail')).toBe(false)
    expect(sameText('I cant swim', "I can't swim")).toBe(false)
    expect(sameText('We were late', "We're late")).toBe(false)
  })
  it('leaves o’clock and possessives alone', () => {
    expect(variants("at the o'clock")).toEqual(["at the o'clock"])
    expect(sameText("Tom's bike", "Tom's bike")).toBe(true)
  })
  it('a different sentence is still different', () => {
    expect(sameText("It's very cold", "It's very warm")).toBe(false)
  })
})

describe('numbers', () => {
  it('a small number is the same in digits and in words', () => {
    expect(sameText('She has 2 cats', 'She has two cats')).toBe(true)
    expect(sameText('about 10 years', 'about ten years')).toBe(true)
    expect(sameText('at half past 3', 'at half past three')).toBe(true)
    expect(sameText("It's 9 o'clock", "It is nine o'clock")).toBe(true)
  })
  it('a different number is a different sentence', () => {
    expect(sameText('She has 3 cats', 'She has two cats')).toBe(false)
    expect(sameText('about 12 years', 'about ten years')).toBe(false)
  })
})
