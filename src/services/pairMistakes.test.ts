import { beforeEach, describe, expect, it } from 'vitest'
import { pairDrills } from '../data/pairDrills'
import { getMistakeEntries } from './learningData'

// Characterisation: what My Mistakes shows for a failed look-alike pair must not change when the pair data
// is split into a light index and the full sentences (pairs.ts / pairIndex.ts).
const failedAttempt = (pairId: string, sentence: string, chosen: string, extra: Record<string, unknown> = {}) => ({
  id: `a-${pairId}-${chosen}`,
  pairId,
  sentence,
  chosen,
  correct: false,
  createdAt: new Date().toISOString(),
  ...extra,
})
const store = (attempts: unknown[]) => window.localStorage.setItem('spell-sprint.pair-attempts', JSON.stringify(attempts))

describe('My Mistakes entries for pairs', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows the right answer, the filled sentence and the topic for each pair, old attempts without a stored answer', () => {
    let checked = 0
    for (const pair of pairDrills) {
      // every sentence of a pair of three or more words (the answer comes from the index), a sample of the others (the other word)
      const sentences = pair.words.length >= 3 ? pair.sentences : pair.sentences.slice(0, 4)
      for (const sentence of sentences) {
        const wrong = pair.words.find((word) => word !== sentence.answer)!
        store([failedAttempt(pair.id, sentence.text, wrong)])
        const entry = getMistakeEntries().find((item) => item.pairId === pair.id)!
        expect(entry, `${pair.id}: ${sentence.text}`).toBeTruthy()
        expect(entry.correctAnswer).toBe(sentence.answer)
        expect(entry.translation).toBe(sentence.text.replace('___', sentence.answer))
        expect(entry.topic).toBe(pair.words.join(' / '))
        expect(entry.lastUserVersion).toBe(wrong)
        checked += 1
      }
    }
    expect(checked).toBeGreaterThan(400)
  })

  it('also covers a third word in a three-word pair as the wrong choice', () => {
    const pair = pairDrills.find((item) => item.words.length >= 3)!
    const sentence = pair.sentences[0]
    const wrong = pair.words.filter((word) => word !== sentence.answer).at(-1)!
    store([failedAttempt(pair.id, sentence.text, wrong)])
    expect(getMistakeEntries().find((item) => item.pairId === pair.id)!.correctAnswer).toBe(sentence.answer)
  })

  it('uses the stored answer of a new attempt, even for a sentence that is no longer in the data', () => {
    const pair = pairDrills.find((item) => item.words.length >= 3)!
    store([failedAttempt(pair.id, 'A sentence that was removed ___ later.', pair.words[0], { answer: pair.words[2] })])
    const entry = getMistakeEntries().find((item) => item.pairId === pair.id)!
    expect(entry.correctAnswer).toBe(pair.words[2])
    expect(entry.translation).toBe(`A sentence that was removed ${pair.words[2]} later.`)
  })
})
