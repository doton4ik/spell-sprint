import { describe, expect, it } from 'vitest'
import { diffWords, isSentence } from './sentenceDiff'

const marked = (words: Array<{ text: string; same: boolean }>) => words.filter((word) => !word.same).map((word) => word.text)

describe('diffWords', () => {
  it('marks only the words that really differ', () => {
    const result = diffWords('The shop opens at nine o’clock.', "The shope open's at nine o'clock")
    expect(marked(result.given)).toEqual(['shope', "open's"])
    expect(marked(result.expected)).toEqual(['shop', 'opens'])
  })
  it('does not mind case, punctuation or the kind of apostrophe', () => {
    const result = diffWords('It’s nine o’clock.', "it's NINE o'clock")
    expect(marked(result.given)).toEqual([])
    expect(marked(result.expected)).toEqual([])
  })
  it('shows a missing word on the right side only', () => {
    const result = diffWords('She has two cats and a small dog.', 'She has two cats and small dog')
    expect(marked(result.given)).toEqual([])
    expect(marked(result.expected)).toEqual(['a'])
  })
  it('shows an extra word on the written side only', () => {
    const result = diffWords('We are going to the station now.', 'We are going to the big station now')
    expect(marked(result.given)).toEqual(['big'])
    expect(marked(result.expected)).toEqual([])
  })
  it('an empty answer marks every word as missing', () => {
    const result = diffWords('Can you help me?', '')
    expect(result.given).toEqual([])
    expect(marked(result.expected)).toEqual(['Can', 'you', 'help', 'me?'])
  })
  it('tells a sentence from a single word', () => {
    expect(isSentence('Can you help me?')).toBe(true)
    expect(isSentence('accommodation')).toBe(false)
  })
})
