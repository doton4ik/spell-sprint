import { beforeEach, describe, expect, it } from 'vitest'
import { addYellowCard, dismissYellowCard, getAllYellowCards, getYellowCards, mergeYellowCards } from './yellowCards'

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
      { id: 'other', word: 'quiet', shown: 'queit', source: 'sprint', where: 'Sprint', at: '2026-10-08T10:00:00.000Z' },
      { broken: true },
    ])
    expect(added).toBe(1)
    expect(getYellowCards().map((item) => item.word)).toEqual(['quiet'])
  })
})
