import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  englishMeanings,
  englishSection,
  hasCyrillic,
  lookupWord,
  parseRussianCandidates,
  parseRussianWiktionary,
  parseTranslations,
} from './wordLookup'

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

describe('Russian input', () => {
  it('detects Cyrillic letters', () => {
    expect(hasCyrillic('удача')).toBe(true)
    expect(hasCyrillic('ёж')).toBe(true)
    expect(hasCyrillic('fortune')).toBe(false)
  })

  it('takes English words from the definitions of a Russian entry and skips inflected forms', () => {
    const page = [
      '==Russian==',
      '===Noun===',
      '# {{lb|ru|colloquial}} [[luck]], [[good fortune]]',
      '# [[success]]',
      '==Ukrainian==',
      '# [[other]]',
    ].join('\n')
    expect(parseRussianCandidates(page).map((item) => item.english)).toEqual(['luck', 'good fortune', 'success'])
    expect(parseRussianCandidates('==Russian==\n===Noun===\n# {{inflection of|ru|удача||gen|s}} [[luck]]')).toEqual([])
  })
})

describe('the Russian Wiktionary as a second source', () => {
  const giveUp = [
    '= {{-en-}} =',
    '',
    '=== Тип и синтаксические свойства сочетания ===',
    '{{phrase',
    '|тип=фг',
    '|слово1={{по-слогам|give}}',
    '}}',
    '',
    '=== Семантические свойства ===',
    '',
    '==== Значение ====',
    '# [[сдаваться]], [[поступаться]] ([[поступиться]]) {{пример||перевод=}}',
    '# {{помета|разг.}} [[бросать]] ([[бросить]]), [[отбрасывать]] {{пример|Nicky is thinking of giving up her job.',
    '|перевод=Никки подумывает бросить свою работу.}}',
    '# [[признавать безнадежным|призна́ть безнадёжным]] {{пример||перевод=}}',
    '#: a note line, not a meaning',
    '# {{пример||перевод=}}',
    '',
    '==== Синонимы ====',
    '# [[surrender]]',
    '',
    '= {{-fr-}} =',
    '==== Значение ====',
    '# [[другое]]',
  ].join('\n')

  it('reads the meanings of an English entry: the linked Russian words, without labels, with the example', () => {
    expect(parseRussianWiktionary(giveUp)).toEqual([
      { partOfSpeech: 'phrase', translations: ['сдаваться', 'поступаться', 'поступиться'], example: '' },
      { partOfSpeech: 'phrase', translations: ['бросать', 'бросить', 'отбрасывать'], example: 'Nicky is thinking of giving up her job.' },
      { partOfSpeech: 'phrase', translations: ['признать безнадёжным'], example: '' },
    ])
  })
  it('gives nothing for a page without an English entry or without meanings', () => {
    expect(parseRussianWiktionary('= {{-ru-}} =\n==== Значение ====\n# [[слово]]')).toEqual([])
    expect(parseRussianWiktionary('= {{-en-}} =\n=== Произношение ===\n')).toEqual([])
    expect(parseRussianWiktionary('')).toEqual([])
  })
})

describe('meanings in English when there is no translation', () => {
  it('takes the definitions in order, without forms of other words and old meanings', () => {
    const rest = {
      en: [
        {
          partOfSpeech: 'Verb',
          definitions: [
            { definition: '<i>To <a href="/wiki/hook">hook</a> something together.</i>' },
            { definition: '(obsolete) To steal.' },
            { definition: 'simple past tense of hook up' },
            { definition: 'To associate with someone.', examples: ['We <b>hooked up</b> with some friends after the game.'] },
          ],
        },
      ],
    }
    expect(englishMeanings(rest)).toEqual([
      { partOfSpeech: 'verb', definition: 'To hook something together.', example: '' },
      { partOfSpeech: 'verb', definition: 'To associate with someone.', example: 'We hooked up with some friends after the game.' },
    ])
    expect(englishMeanings(null)).toEqual([])
  })
})

describe('lookupWord: which dictionary answers', () => {
  // the pages the dictionaries hold in this test, by "<host> <page>"
  const pages: Record<string, unknown> = {}
  const answer = (body: unknown, ok = true, status = 200) => ({ ok, status, json: async () => body }) as Response
  beforeEach(() => {
    for (const key of Object.keys(pages)) delete pages[key]
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string) => {
        const url = new URL(input)
        const page = url.searchParams.get('page') ?? decodeURIComponent(url.pathname.split('/').pop() ?? '')
        const body = pages[`${url.hostname} ${page}`]
        if (body === undefined) return answer({ error: { code: 'missingtitle' } }, url.pathname.includes('rest_v1') ? false : true, 404)
        return answer(url.pathname.includes('rest_v1') ? body : { parse: { wikitext: { '*': body } } })
      }),
    )
  })
  afterEach(() => vi.unstubAllGlobals())
  const english = (rows: string[]) => ['==English==', '===Verb===', ...rows].join('\n')

  it('uses the translations of the English Wiktionary when it has them', async () => {
    pages['en.wiktionary.org fortune'] = english(['{{trans-top|good luck}}', '* Russian: {{t+|ru|уда́ча|f}}', '{{trans-bottom}}'])
    const result = await lookupWord('  Fortune ')
    expect(result).toMatchObject({ status: 'found', senses: [{ gloss: 'good luck', translations: ['удача'] }] })
  })
  it('asks the Russian Wiktionary when the English one has no Russian (a phrase is one page)', async () => {
    pages['en.wiktionary.org give up'] = english(['{{trans-top|to stop}}', '* French: {{t+|fr|abandonner}}', '{{trans-bottom}}'])
    pages['ru.wiktionary.org give up'] = '= {{-en-}} =\n{{phrase}}\n==== Значение ====\n# [[сдаваться]], [[бросать]] {{пример||перевод=}}'
    const result = await lookupWord('give   up')
    expect(result).toMatchObject({
      status: 'found',
      senses: [{ partOfSpeech: 'phrase', gloss: '', translations: ['сдаваться', 'бросать'] }],
    })
  })
  it('shows the meaning in English when no dictionary has a translation ("hook up")', async () => {
    pages['en.wiktionary.org hook up'] = english(['{{trans-top|to connect to something}}', '{{trans-bottom}}'])
    pages['en.wiktionary.org hook_up'] = { en: [{ partOfSpeech: 'Verb', definitions: [{ definition: 'To connect to something.' }] }] }
    const result = await lookupWord('hook up')
    expect(result).toEqual({
      status: 'no-translation',
      meanings: [{ partOfSpeech: 'verb', definition: 'To connect to something.', example: '' }],
    })
  })
  it('says not found when no dictionary knows the word, and unavailable when the network fails', async () => {
    expect(await lookupWord('qwertyzz')).toEqual({ status: 'not-found' })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    expect(await lookupWord('fortune')).toMatchObject({ status: 'unavailable' })
  })
})
