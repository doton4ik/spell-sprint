import { describe, expect, it } from 'vitest'
import type { ProofreadingText } from '../data/proofreadingTexts'
import { buildExercise, checkExercise, cleanText, isRealOrRude, mistakeCountFor, parseProofreadingText } from './proofreadingEngine'

const text: ProofreadingText = {
  id: 'test',
  title: 'Test',
  level: 'A2',
  format: 'message',
  topic: 'Test',
  text: 'Yesterday I {went|past-irregular|goed} to {the shop|article|a shop} and {bought|past-irregular|buyed} some {bread|plural-uncountable|breads}. My sister {was|agreement|were} there too, and we {had|past-irregular|haved} a coffee {together|word-form|togetherly}. It {was|agreement|were} a nice morning.',
}

describe('parseProofreadingText', () => {
  it('reads every marked place', () => {
    const { segments, problems } = parseProofreadingText(text.text)
    expect(problems).toEqual([])
    expect(segments.filter((segment) => segment.kind === 'place')).toHaveLength(8)
  })
  it('reports an unknown mistake type', () => {
    expect(parseProofreadingText('A {cat|no-such-type|cot}.').problems.length).toBeGreaterThan(0)
  })
  it('cleanText gives the correct text', () => {
    expect(cleanText(text)).toContain('Yesterday I went to the shop and bought some bread.')
  })
})

describe('buildExercise and checkExercise', () => {
  it('the same seed gives the same exercise', () => {
    expect(buildExercise(text, 42).slots.map((slot) => slot.id)).toEqual(buildExercise(text, 42).slots.map((slot) => slot.id))
  })
  it('has the number of mistakes for the level', () => {
    expect(buildExercise(text, 7).slots).toHaveLength(mistakeCountFor(text))
  })
  it('perfect fixes are all accepted, with no false alarms', () => {
    const exercise = buildExercise(text, 3)
    const edits = new Map<number, string>()
    for (const slot of exercise.slots) slot.tokenIds.forEach((id, index) => edits.set(id, index === 0 ? slot.correct[0] : ''))
    const result = checkExercise(exercise, edits)
    expect(result.fixed).toBe(exercise.slots.length)
    expect(result.falseAlarms).toEqual([])
  })
  it('no edits means every mistake is missed', () => {
    const exercise = buildExercise(text, 5)
    const result = checkExercise(exercise, new Map())
    expect(result.found).toBe(0)
    expect(result.slots.every((slot) => slot.status === 'missed')).toBe(true)
  })
  it('changing a correct word is a false alarm', () => {
    const exercise = buildExercise(text, 9)
    const inSlots = new Set(exercise.slots.flatMap((slot) => slot.tokenIds))
    const innocent = exercise.tokens.find((token) => token.isWord && !inSlots.has(token.id))!
    expect(checkExercise(exercise, new Map([[innocent.id, 'banana']])).falseAlarms).toHaveLength(1)
  })
})

describe('isRealOrRude', () => {
  it('blocks real words that slips produce and rude words', () => {
    expect(isRealOrRude('torn')).toBe(true)
    expect(isRealOrRude('git')).toBe(true)
    expect(isRealOrRude('enviroment')).toBe(false)
  })
})
