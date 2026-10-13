import { describe, expect, it } from 'vitest'
import type { RuleExample, RuleExercise } from '../types/rules'
import { exercisesWithoutOverlap, pickShownExamples, ruleKeywords } from './ruleOverlap'

const example = (id: string, exampleType: RuleExample['exampleType'], text: string, correction?: string): RuleExample => ({
  id,
  ruleId: 'r',
  exampleType,
  text,
  correction,
})
const exercise = (id: string, prompt: string, answer: string): RuleExercise => ({
  id,
  ruleId: 'r',
  exerciseType: 'fill_gap',
  prompt,
  answer,
  metadata: {},
})

describe('examples and exercises of one rule', () => {
  const keywords = ruleKeywords({ title: 'Double consonants', mnemonic: 'Tomorrow has a double r', shortExplanation: '' })
  const examples = [
    example('1', 'correct', 'We stayed in cheap accommodation near the station.'),
    example('2', 'incorrect', 'She was embarassed by the question.', 'She was embarrassed by the question.'),
    example('3', 'correct', 'It is necessary to book a table early.'),
    example('4', 'correct', 'The committee made its decision on Friday.'),
    example('5', 'correct', 'I will call you tomorrow.'),
    example('6', 'incorrect', 'The comittee meets every month.', 'The committee meets every month.'),
    example('7', 'correct', 'My sister walks to school every morning.'),
    example('8', 'incorrect', 'He is runing to the bus stop.', 'He is running to the bus stop.'),
  ]
  const exercises = [
    exercise('a', 'We need some cheap ___ for the trip.', 'accommodation'),
    exercise('b', 'It is ___ to wear a helmet.', 'necessary'),
    exercise('c', 'Please write your home ___ below.', 'address'),
    exercise('d', 'The ___ meets on Monday.', 'committee'),
    exercise('e', 'See you ___ morning.', 'tomorrow'),
  ]

  it('shows no example that contains the answer of an exercise', () => {
    const shown = pickShownExamples(examples, exercises, keywords)
    const text = shown.map((item) => `${item.text} ${item.correction ?? ''}`.toLowerCase()).join(' ')
    for (const word of ['accommodation', 'necessary', 'committee']) expect(text).not.toContain(word)
    expect(shown.length).toBeGreaterThan(0)
  })

  it('counts the rule’s own words as not giving anything away', () => {
    // "tomorrow" is the rule's memory word: it is in the mnemonic, so an example with it is fine
    const shown = pickShownExamples(examples, exercises, keywords)
    expect(shown.map((item) => item.id)).toContain('5')
  })

  it('leaves out an exercise whose answer or sentence is still on show', () => {
    const shown = [example('x', 'correct', 'It is necessary to book a table early.')]
    const rest = exercisesWithoutOverlap(exercises, shown, keywords).map((item) => item.id)
    expect(rest).not.toContain('b')
    expect(rest).toEqual(expect.arrayContaining(['a', 'c', 'd', 'e']))
  })

  it('does not count the rule’s own pair words (accept / except)', () => {
    const own = ruleKeywords({ title: 'Accept or except', mnemonic: '', shortExplanation: '' })
    const shown = [example('x', 'correct', 'I accept your apology.')]
    const tasks = [exercise('a', 'I cannot ___ his excuse.', 'accept'), exercise('b', 'We all came ___ Tom.', 'except')]
    expect(exercisesWithoutOverlap(tasks, shown, own).map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('an identical sentence in an example and an exercise is an overlap', () => {
    const shown = [example('x', 'correct', 'She read the whole book in one night.')]
    const tasks = [exercise('z', 'She read the ___ book in one night.', 'whole'), ...exercises]
    expect(exercisesWithoutOverlap(tasks, shown, keywords).map((item) => item.id)).not.toContain('z')
  })

  it('never leaves the learner without exercises', () => {
    const shown = examples
    expect(exercisesWithoutOverlap([exercises[0]], shown, keywords)).toHaveLength(1)
  })
})
