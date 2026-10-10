import { describe, expect, it } from 'vitest'
import { resolveLinkedWords } from './rulesService'

const library = [
  { wordId: 'w-appointment', word: 'appointment', translation: 'встреча (по записи), запись (к врачу), приём' },
  { wordId: 'w-install', word: 'install', translation: 'установить' },
  { wordId: 'w-dessert', word: 'dessert', translation: 'десерт' },
]
const link = (word_id: string, relation = 'related') => ({ word_id, relation })

describe('resolveLinkedWords', () => {
  it('leaves out a link whose word is not in the library instead of showing a bare id', () => {
    const result = resolveLinkedWords([link('general-english-active-vocabulary-recommended'), link('w-install')], library)
    expect(result.map((item) => item.word)).toEqual(['install'])
  })
  it('shows a word once even if it is linked twice (or under two ids)', () => {
    const result = resolveLinkedWords([link('w-appointment'), link('w-install'), link('w-appointment')], library)
    expect(result.map((item) => item.word)).toEqual(['appointment', 'install'])
  })
  it('puts the main links before the related ones, keeping the order inside each group', () => {
    const result = resolveLinkedWords([link('w-install'), link('w-dessert', 'primary'), link('w-appointment')], library)
    expect(result.map((item) => item.word)).toEqual(['dessert', 'install', 'appointment'])
  })
  it('carries the translation along', () => {
    expect(resolveLinkedWords([link('w-dessert')], library)[0]).toMatchObject({ word: 'dessert', translation: 'десерт' })
  })
  it('no links, no words', () => {
    expect(resolveLinkedWords([], library)).toEqual([])
  })
})
