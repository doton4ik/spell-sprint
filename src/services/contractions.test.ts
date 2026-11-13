import { describe, expect, it } from 'vitest'
import { numbersAsDigits, sameText, variants } from './contractions'

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
  // every list is one number written in all the ways a learner may write it
  const same: Array<[string, string[]]> = [
    ['for 40 seconds', ['for forty seconds', 'for 40 seconds.']],
    ['down from 75 seconds', ['down from seventy-five seconds', 'down from seventy five seconds']],
    ['up to 20 hours a day', ['up to twenty hours a day']],
    ['about 100 people', ['about a hundred people', 'about one hundred people']],
    ['350 pages', ['three hundred and fifty pages', 'three hundred fifty pages']],
    ['between 2,000 and 3,000 words', ['between 2000 and 3000 words', 'between two thousand and three thousand words']],
    ['20,000 words', ['20000 words', 'twenty thousand words', '20 thousand words']],
    ['in 2016', ['in twenty sixteen', 'in two thousand and sixteen', 'in two thousand sixteen']],
    ['in 1999', ['in nineteen ninety-nine', 'in nineteen ninety nine']],
    ['in 2025', ['in twenty twenty-five']],
    ['5,000,000 people', ['five million people', '5 million people']],
    ['1,250,000', ['one million two hundred and fifty thousand']],
    ['2,345', ['two thousand three hundred and forty-five']],
    ['21 days', ['twenty-one days', 'twenty one days']],
  ]
  it.each(same)('"%s" is the same in digits and in words', (digits, written) => {
    for (const text of written) {
      expect(sameText(digits, text), text).toBe(true)
      expect(sameText(text, digits), text).toBe(true)
    }
  })
  it('numbers that only sound alike or are next to each other stay different', () => {
    expect(sameText('for 40 seconds', 'for fourteen seconds')).toBe(false)
    expect(sameText('for forty seconds', 'for fifty seconds')).toBe(false)
    expect(sameText('2,000 words', 'two thousand and one words')).toBe(false)
    expect(sameText('a hundred people', 'hundred people')).toBe(false)
    expect(sameText('from ten to five', 'from 105')).toBe(false)
    expect(sameText('one two three', '123')).toBe(false)
    expect(sameText('I have a book', 'I have one book')).toBe(false)
  })
  it('words around a number are left alone', () => {
    expect(numbersAsDigits('i counted to a hundred and you left'.split(' '))).toEqual(['i', 'counted', 'to', '100', 'and', 'you', 'left'])
    expect(numbersAsDigits('hundreds of people came'.split(' '))).toEqual(['hundreds', 'of', 'people', 'came'])
    expect(numbersAsDigits('the one constructor'.split(' '))).toEqual(['the', '1', 'constructor'])
    expect(numbersAsDigits('no one knows'.split(' '))).toEqual(['no', '1', 'knows'])
  })
})

describe('dashes', () => {
  it('a long dash separates words like a hyphen or a space', () => {
    expect(sameText('The researchers — oh, a new photo!', 'the researchers oh a new photo')).toBe(true)
    expect(sameText('They measured—what was that?', 'They measured what was that')).toBe(true)
    expect(sameText('pages 10–12', 'pages 10 12')).toBe(true)
  })
})

describe('after review: years, times and odd words', () => {
  it('a year or a time is two halves, however it is written', () => {
    const same: Array<[string, string]> = [
      ['at 10:15', 'at ten fifteen'],
      ['at 3:30', 'at three thirty'],
      ['at 5:10', 'at five ten'],
      ['at 9:15', 'at nine fifteen'],
      ['in 2016', 'in twenty sixteen'],
      ['in two thousand and sixteen', 'in twenty sixteen'],
      ['in 2020', 'in twenty twenty'],
      ['in 1999', 'in nineteen ninety-nine'],
      ['in 1500', 'in fifteen hundred'],
      ['in 2005', 'in two thousand and five'],
    ]
    for (const [a, b] of same) {
      expect(sameText(a, b), `${a} | ${b}`).toBe(true)
      expect(sameText(b, a), `${b} | ${a}`).toBe(true)
    }
  })
  it('two numbers next to each other are still two numbers', () => {
    expect(sameText('I was thirteen, fourteen', 'I was 13, 14')).toBe(true)
    expect(sameText('ten twenty-dollar bills', '10 twenty dollar bills')).toBe(true)
    expect(numbersAsDigits('i was thirteen fourteen'.split(' '))).toEqual(['i', 'was', '13', '14'])
    expect(sameText('in 2016', 'in 2061')).toBe(false)
    expect(sameText('at 10:15', 'at 10:50')).toBe(false)
    expect(sameText('at 3:30', 'at 330 metres')).toBe(false)
  })
  it('words that are also property names of every object are ordinary words', () => {
    for (const word of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf']) {
      expect(sameText(`The ${word} is here.`, `the ${word} is here`), word).toBe(true)
      expect(sameText(`The ${word} is here.`, 'the other is here'), word).toBe(false)
    }
    expect(sameText('one constructor, two thousand constructor', '1 constructor 2000 constructor')).toBe(true)
  })
  it('a very long text is compared as it is, without parsing numbers, and does not hang', () => {
    const long = Array.from({ length: 1000 }, () => 'two thousand').join(' ')
    expect(sameText(long, long)).toBe(true)
  })
})
