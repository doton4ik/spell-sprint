import { describe, expect, it } from 'vitest'
import { gapSentence } from './libraryPractice'

describe('Fill the gap', () => {
  it('takes the word out of its example', () => {
    expect(gapSentence('I borrowed a book from the library.', 'library')).toBe('I borrowed a book from the _____.')
    expect(gapSentence('Weather changes fast here.', 'weather')).toBe('_____ changes fast here.')
    expect(gapSentence('We met at the bus stop.', 'bus stop')).toBe('We met at the _____.')
  })
  it('skips an example with another form of the word', () => {
    expect(gapSentence('She borrowed my pen.', 'borrow')).toBeNull()
    expect(gapSentence('Our neighbours are friendly.', 'neighbour')).toBeNull()
    expect(gapSentence(undefined, 'word')).toBeNull()
  })
})
