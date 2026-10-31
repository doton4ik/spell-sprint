import { beforeEach, describe, expect, it } from 'vitest'
import {
  addYellowCard,
  dismissAllYellowCards,
  dismissYellowCard,
  getAllYellowCards,
  getYellowCards,
  isRealSlip,
  mergeYellowCards,
} from './yellowCards'

const card = (word: string, shown = `${word}x`) => ({ word, shown, source: 'proofreading' as const, where: 'A text' })

describe('yellow cards', () => {
  beforeEach(() => window.localStorage.clear())

  it('the first unnoticed slip is a yellow card', () => {
    expect(addYellowCard(card('because'))).toBe('yellow')
    expect(getYellowCards().map((item) => item.word)).toEqual(['because'])
  })
  it('the same word a second time is a red card, and both yellow cards close', () => {
    addYellowCard(card('because'))
    expect(addYellowCard(card('Because', 'becuse'))).toBe('red')
    expect(getYellowCards()).toEqual([])
  })
  it('different words stay separate yellow cards', () => {
    addYellowCard(card('because'))
    expect(addYellowCard(card('friendly'))).toBe('yellow')
    expect(getYellowCards()).toHaveLength(2)
  })
  it('a dismissed card is gone, and the next slip starts again with yellow', () => {
    addYellowCard(card('because'))
    dismissYellowCard(getYellowCards()[0].id)
    expect(getYellowCards()).toEqual([])
    expect(addYellowCard(card('because'))).toBe('yellow')
  })
  it('merging from another device adds new cards and keeps a closed card closed', () => {
    addYellowCard(card('because'))
    const [local] = getAllYellowCards()
    const added = mergeYellowCards([
      { ...local, escalated: true },
      { id: 'other', word: 'quiet', shown: 'queit', source: 'sprint', where: 'Sprint', at: new Date().toISOString() },
      { broken: true },
    ])
    expect(added).toBe(1)
    expect(getYellowCards().map((item) => item.word)).toEqual(['quiet'])
  })
  it('a slip needs real typing: not empty, not one letter, not a word cut off by the clock', () => {
    expect(isRealSlip('traceability', 'e')).toBe(false)
    expect(isRealSlip('traceability', '')).toBe(false)
    expect(isRealSlip('traceability', '—')).toBe(false)
    expect(isRealSlip('traceability', 'trace')).toBe(false)
    expect(isRealSlip('traceability', 'tracability')).toBe(true)
    expect(isRealSlip('behind', 'behend')).toBe(true)
  })
  it('old sprint junk stays hidden, and cards older than two weeks disappear', () => {
    const old = new Date(Date.now() - 15 * 86_400_000).toISOString()
    mergeYellowCards([
      { id: 'junk', word: 'traceability', shown: 'e', source: 'sprint', where: 'Sprint', at: new Date().toISOString() },
      { id: 'old', word: 'quiet', shown: 'queit', source: 'proofreading', where: 'A text', at: old },
      { id: 'fresh', word: 'behind', shown: 'behend', source: 'proofreading', where: 'A text', at: new Date().toISOString() },
    ])
    expect(getYellowCards().map((item) => item.id)).toEqual(['fresh'])
    expect(addYellowCard(card('quiet', 'queit'))).toBe('yellow') // the expired card does not make a red one
  })
  it('clear all closes every open card', () => {
    addYellowCard(card('because'))
    addYellowCard(card('friendly'))
    dismissAllYellowCards()
    expect(getYellowCards()).toEqual([])
  })
})
