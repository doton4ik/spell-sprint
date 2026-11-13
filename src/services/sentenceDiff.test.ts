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

describe('diffWords with contractions', () => {
  it('"It\'s" and "It is" are the same words', () => {
    const result = diffWords('It is very cold in the morning.', "It's very cold in the morning")
    expect(marked(result.given)).toEqual([])
    expect(marked(result.expected)).toEqual([])
  })
  it('marks only what differs when a contraction is used', () => {
    const result = diffWords('It is very cold in the morning.', "It's very cold at night")
    expect(marked(result.given)).toEqual(['at', 'night'])
    expect(marked(result.expected)).toEqual(['in', 'the', 'morning.'])
  })
  it('marks "don\'t" when the other side has something else', () => {
    const result = diffWords('I do not know.', "I won't know")
    expect(marked(result.given)).toEqual(["won't"])
  })
})

describe('diffWords with numbers', () => {
  it('a number is the same in digits and in words, however many words it takes', () => {
    const result = diffWords(
      'Users stuck with a task for 40 seconds, down from 75.',
      'users stuck with a task for forty seconds down from seventy five',
    )
    expect(marked(result.given)).toEqual([])
    expect(marked(result.expected)).toEqual([])
  })
  it('marks every written word of a wrong number, and nothing else', () => {
    const result = diffWords('It costs 75 pounds.', 'It costs seventy four pounds')
    expect(marked(result.given)).toEqual(['seventy', 'four'])
    expect(marked(result.expected)).toEqual(['75'])
  })
  it('a hyphenated number is one word', () => {
    const result = diffWords('twenty-one days', '21 days')
    expect(marked(result.given)).toEqual([])
  })
})

describe('diffWords with one more reading of a word', () => {
  it('two spellings the caller calls equal are not marked', () => {
    const canon = (word: string) => (word === 'programme' ? 'program' : word)
    const result = diffWords('in this programme, as usual', 'in this program as usal', canon)
    expect(marked(result.given)).toEqual(['usal'])
    expect(marked(result.expected)).toEqual(['usual'])
  })
})

describe('after review', () => {
  it('a year typed as digits and said in two halves is not marked', () => {
    const result = diffWords('It happened in 2016, I think.', 'it happened in twenty sixteen i thnk')
    expect(marked(result.given)).toEqual(['thnk'])
    expect(marked(result.expected)).toEqual(['think.'])
  })
  it('a wrong half of a year marks the whole year', () => {
    const result = diffWords('in 2016', 'in twenty seventeen')
    expect(marked(result.expected)).toEqual(['2016'])
    expect(marked(result.given)).toEqual(['seventeen'])
  })
  it('does not break on words that are property names of every object', () => {
    const result = diffWords('The constructor is here.', 'the constructor is there')
    expect(marked(result.given)).toEqual(['there'])
  })
})
