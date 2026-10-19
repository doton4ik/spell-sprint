import { describe, expect, it } from 'vitest'
import { pairDrills } from './pairDrills'
import { pairIndex, threeWordAnswers } from './pairIndex'
import { sentenceKey } from './sentenceKey'

// pairIndex.ts is generated from pairDrills.ts (node scripts/build-pair-index.mjs). The first screen reads only the index.
describe('the light pair index', () => {
  it('lists every pair with the same id, words and level (run node scripts/build-pair-index.mjs if this fails)', () => {
    expect(pairIndex).toEqual(pairDrills.map((pair) => ({ id: pair.id, words: pair.words, level: pair.level })))
  })

  it('names the right word of a sentence only when the sentence still exists with that answer', () => {
    for (const [pairId, byKey] of Object.entries(threeWordAnswers)) {
      const pair = pairDrills.find((item) => item.id === pairId)!
      expect(pair, pairId).toBeTruthy()
      expect(pair.words.length).toBeGreaterThanOrEqual(3)
      const answers = new Map(pair.sentences.map((sentence) => [sentenceKey(sentence.text), pair.words.indexOf(sentence.answer)]))
      for (const [key, position] of Object.entries(byKey)) {
        if (answers.has(key)) expect(answers.get(key), `${pairId} ${key}`).toBe(position)
      }
    }
  })

  it('stays small: it is read on the first screen', () => {
    expect(JSON.stringify([pairIndex, threeWordAnswers]).length).toBeLessThan(20000)
  })
})
