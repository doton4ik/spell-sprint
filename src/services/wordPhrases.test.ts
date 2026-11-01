import { describe, expect, it } from 'vitest'
import { makeWordLines, wordAt, type TimedWord } from './wordPhrases'

// words of one second each, `gap` seconds apart
function speak(text: string, from = 10, gap = 0.1): TimedWord[] {
  let t = from
  return text.split(' ').map((w) => {
    const word = { w, s: t, e: t + 0.4 }
    t += 0.4 + gap
    return word
  })
}

describe('makeWordLines', () => {
  it('cuts at the end of a sentence and keeps every word in order', () => {
    const lines = makeWordLines(speak('Hello and welcome to the show. I am Pippa and I like tea.'))
    expect(lines.map((line) => line.text)).toEqual(['Hello and welcome to the show.', 'I am Pippa and I like tea.'])
    expect(lines[0].wordStarts).toHaveLength(6)
  })
  it('starts a little before the first word and ends a little after the last', () => {
    const [line] = makeWordLines(speak('One two three four five six.'))
    expect(line.start).toBeLessThan(10)
    expect(line.end).toBeGreaterThan(10 + 6 * 0.5 - 0.1)
  })
  it('cuts a long run of words at its biggest pause', () => {
    const words = [...speak('a b c d e f g h i j', 0, 0.05), ...speak('k l m n o p q r s t', 6, 0.05)]
    words[6].s += 0.6 // a pause before "g"
    words[6].e += 0.6
    const lines = makeWordLines(words, { maxWords: 12 })
    expect(lines.every((line) => line.text.split(' ').length <= 12)).toBe(true)
    expect(lines.map((line) => line.text).join(' ')).toBe(words.map((word) => word.w).join(' '))
  })
  it('keeps only the words inside from..to and drops promo lines', () => {
    const words = [...speak('Please subscribe to our channel today friends.', 0), ...speak('We went to the market this morning.', 20)]
    const lines = makeWordLines(words)
    expect(lines.map((line) => line.text)).toEqual(['We went to the market this morning.'])
    expect(makeWordLines(words, { from: 100 })).toEqual([])
  })
  it('does not leave a one-word line at the end', () => {
    const lines = makeWordLines(speak('We went to the market this morning, yes.'), { minWords: 5, maxWords: 8 })
    expect(lines.every((line) => line.text.split(' ').length >= 5)).toBe(true)
  })
})

describe('wordAt', () => {
  it('finds the word being said', () => {
    const starts = [1, 1.5, 2.2]
    expect(wordAt(starts, 0.5)).toBe(-1)
    expect(wordAt(starts, 1.6)).toBe(1)
    expect(wordAt(starts, 9)).toBe(2)
  })
})
