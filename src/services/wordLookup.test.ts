import { describe, expect, it } from 'vitest'
import { englishSection, parseTranslations } from './wordLookup'

describe('parseTranslations', () => {
  it('reads a plain translation table and removes stress marks', () => {
    const section = ['===Noun===', '{{trans-top|good luck}}', '* Russian: {{t+|ru|уда́ча|f}}, {{t+|ru|везе́ние|n}}', '{{trans-bottom}}'].join(
      '\n',
    )
    expect(parseTranslations(section)).toEqual([{ partOfSpeech: 'noun', gloss: 'good luck', translations: ['удача', 'везение'] }])
  })

  it('reads {{trans-top-see}} tables: the gloss is the first part, not the entry it points to (fate)', () => {
    const section = [
      '===Noun===',
      '{{trans-top-see|that which predetermines events|destiny}}',
      '* Russian: {{t+|ru|судьба́|f}}, {{t+|ru|до́ля|f}}',
      '{{trans-bottom}}',
    ].join('\n')
    expect(parseTranslations(section)).toEqual([
      { partOfSpeech: 'noun', gloss: 'that which predetermines events', translations: ['судьба', 'доля'] },
    ])
  })

  it('shows copied tables with the same translations only once', () => {
    const table = (gloss: string) => `{{trans-top-see|${gloss}|destiny}}\n* Russian: {{t+|ru|судьба́|f}}, {{t+|ru|до́ля|f}}\n{{trans-bottom}}`
    const section = ['===Noun===', table('inevitable events'), table('destiny')].join('\n')
    expect(parseTranslations(section)).toHaveLength(1)
  })

  it('keeps the same translations when the part of speech differs', () => {
    const table = '{{trans-top|a thing}}\n* Russian: {{t+|ru|план|m}}\n{{trans-bottom}}'
    expect(parseTranslations(['===Noun===', table, '===Verb===', table].join('\n'))).toHaveLength(2)
  })

  it('skips unchecked tables and entries without Russian', () => {
    const section = [
      '===Noun===',
      '{{checktrans-top|odd}}',
      '* Russian: {{t+|ru|что-то}}',
      '{{trans-top|ok}}',
      '* German: {{t+|de|Ding}}',
      '{{trans-bottom}}',
    ].join('\n')
    expect(parseTranslations(section)).toEqual([])
  })
})

describe('englishSection', () => {
  it('cuts the English part out of an entry', () => {
    expect(englishSection('==French==\nx\n==English==\nenglish text\n==German==\ny')).toContain('english text')
    expect(englishSection('==French==\nx')).toBe('')
  })
})
