import { describe, expect, it } from 'vitest'
import { listeningClips } from '../data/listeningClips'
import { checkLine, clipScore } from './listening'

describe('checkLine', () => {
  it('accepts the line with other case, punctuation and apostrophe', () => {
    expect(checkLine("Thanks, I'll go and buy a ticket now.", 'thanks i’ll go and buy a ticket now').correct).toBe(true)
  })
  it('accepts a contraction for the long form and the other way round', () => {
    expect(checkLine('That is a pity.', "That's a pity").correct).toBe(true)
    expect(checkLine("It's six hundred a month.", 'It is six hundred a month').correct).toBe(true)
  })
  it('accepts a number written as a word or as digits', () => {
    expect(checkLine('It leaves in five minutes.', 'It leaves in 5 minutes').correct).toBe(true)
  })
  it('does not accept its for it’s', () => {
    expect(checkLine("It's late.", 'Its late').correct).toBe(false)
  })
  it('marks the words that differ', () => {
    const result = checkLine('The water is included.', 'The watter is include')
    expect(result.correct).toBe(false)
    expect(result.given.filter((word) => !word.same).map((word) => word.text)).toEqual(['watter', 'include'])
  })
  it('counts an empty answer as a miss', () => {
    const result = checkLine('Hello there.', '  ')
    expect(result.correct).toBe(false)
    expect(result.expected.every((word) => !word.same)).toBe(true)
  })
})

describe('clipScore', () => {
  it('is the share of right lines', () => {
    expect(clipScore([true, true, false, true])).toBe(75)
    expect(clipScore([])).toBe(0)
  })
})

describe('listening clips', () => {
  it('have fixed unique ids and complete, readable lines', () => {
    expect(new Set(listeningClips.map((clip) => clip.id)).size).toBe(listeningClips.length)
    for (const clip of listeningClips)
      for (const line of clip.lines) {
        expect(line.text.trim()).toBe(line.text)
        // a hand-written line is a whole sentence; a phrase cut from a video may stop at a comma
        if (clip.source.kind === 'voice') expect(line.text).toMatch(/[.?!]$/)
        expect(line.text.split(/\s+/).length).toBeGreaterThanOrEqual(5)
        expect(line.text.split(/\s+/).length).toBeLessThanOrEqual(14)
      }
  })
  it('video lines have a start before their end', () => {
    for (const clip of listeningClips.filter((entry) => entry.source.kind === 'youtube'))
      for (const line of clip.lines) {
        expect(line.start).toBeDefined()
        expect(line.end).toBeGreaterThan(line.start ?? Infinity)
      }
  })
})
