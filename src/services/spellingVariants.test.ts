import { describe, expect, it } from 'vitest'
import { americanSpelling, inOneSpelling } from './spellingVariants'

describe('British and American spellings', () => {
  // [British, American]
  const pairs: Array<[string, string]> = [
    ['colour', 'color'],
    ['colourful', 'colorful'],
    ['favourite', 'favorite'],
    ['neighbourhood', 'neighborhood'],
    ['behaviour', 'behavior'],
    ['programme', 'program'],
    ['programmes', 'programs'],
    ['litre', 'liter'],
    ['litres', 'liters'],
    ['centre', 'center'],
    ['theatre', 'theater'],
    ['kilometres', 'kilometers'],
    ['organise', 'organize'],
    ['organised', 'organized'],
    ['organisation', 'organization'],
    ['realise', 'realize'],
    ['recognising', 'recognizing'],
    ['prioritised', 'prioritized'],
    ['analyse', 'analyze'],
    ['travelled', 'traveled'],
    ['travelling', 'traveling'],
    ['cancelled', 'canceled'],
    ['practise', 'practice'],
    ['practising', 'practicing'],
    ['defence', 'defense'],
    ['licence', 'license'],
    ['grey', 'gray'],
    ['yoghurt', 'yogurt'],
    ['learnt', 'learned'],
    ['towards', 'toward'],
    ['maths', 'math'],
    ['ok', 'okay'],
    ["neighbour's", "neighbor's"],
    ["programme's", "program's"],
  ]
  it.each(pairs)('%s and %s are one word', (british, american) => {
    expect(americanSpelling(british)).toBe(american)
    expect(americanSpelling(american)).toBe(american)
  })
  it('leaves other words alone, also the ones that only look like a pattern', () => {
    for (const word of [
      'four',
      'our',
      'hour',
      'your',
      'course',
      'surprise',
      'surprize',
      'exercise',
      'promise',
      'wise',
      'rise',
      'prize',
      'analysis',
      'emphasis',
      'humorous',
      'metro',
      'check',
      'story',
      'colr',
    ])
      expect(americanSpelling(word), word).toBe(word)
  })
  it('turns a sentence into one spelling and keeps its punctuation', () => {
    expect(inOneSpelling("That's what we'll be discussing in this programme, as usual.")).toBe(
      "That's what we'll be discussing in this program, as usual.",
    )
    expect(inOneSpelling('Maybe about a litre?')).toBe('Maybe about a liter?')
    expect(inOneSpelling('Nothing to change here.')).toBe('Nothing to change here.')
  })
})
