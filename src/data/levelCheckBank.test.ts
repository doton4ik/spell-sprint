import { describe, expect, it } from 'vitest'
import { buildLevelBank, levelPassages, type LevelItem } from './levelCheckBank'
import { createCheck, scoreCheck, isCorrectAnswer, nextItem, QUESTIONS_PER_SKILL, type CheckAnswer } from '../services/levelCheck'

const bank = buildLevelBank([])
const deep = bank.filter((item) => item.id.startsWith('lcd-'))
const choices = deep.filter((item) => item.kind === 'choice')
const levels = [1, 2, 3, 4] as const

describe('the deeper questions', () => {
  it('have fixed, unique ids across the whole bank', () => {
    const ids = bank.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every choice has four different options, and exactly one of them is the answer', () => {
    for (const item of choices) {
      const options = item.choices ?? []
      expect(options, item.id).toHaveLength(4)
      expect(new Set(options.map((option) => option.toLocaleLowerCase())).size, item.id).toBe(4)
      expect(
        options.filter((option) => option === item.answer),
        item.id,
      ).toHaveLength(1)
    }
  })

  it('every question that can be missed has a short explanation', () => {
    for (const item of deep) {
      expect(item.explain, item.id).toBeTruthy()
      expect(item.explain!.split(/\s+/).length, item.id).toBeLessThanOrEqual(14)
    }
  })

  it('gap-fills have a gap, and "find the mistake" options are parts of the sentence', () => {
    for (const item of choices.filter((entry) => entry.skill === 'grammar')) {
      if (item.instruction?.startsWith('Choose the best option')) expect(item.prompt, item.id).toContain('___')
      else for (const option of item.choices ?? []) expect(item.prompt, `${item.id} / ${option}`).toContain(option)
    }
  })

  it('word-formation items show a gap and the base word, and stay out of My Mistakes', () => {
    for (const item of deep.filter((entry) => entry.id.startsWith('lcd-wf-'))) {
      expect(item.prompt, item.id).toContain('___')
      expect(item.prompt, item.id).toMatch(/\([A-Z]+\)/)
      expect(item.log).toBe(false)
    }
  })

  it('article gap-fills are marked to be logged as Grammar · Articles when missed', () => {
    const articles = choices.filter((item) => item.logAs)
    expect(articles.length).toBeGreaterThanOrEqual(4)
    for (const item of articles) {
      expect(item.logAs).toBe('Grammar · Articles')
      expect(item.choices).toEqual(expect.arrayContaining(['a', 'an', 'the', 'no article']))
    }
  })

  it('dictation sentences are complete sentences that a voice can read', () => {
    for (const item of deep.filter((entry) => entry.kind === 'dictation')) {
      expect(item.answer, item.id).toBe(item.prompt)
      expect(item.answer, item.id).toMatch(/[.?]$/)
      expect(item.answer.split(/\s+/).length, item.id).toBeGreaterThanOrEqual(5)
    }
  })

  it('have enough items at every level, so the staircase never has to jump a level', () => {
    for (const level of levels) {
      const at = (predicate: (item: LevelItem) => boolean) => deep.filter((item) => item.level === level && predicate(item)).length
      expect(
        at((item) => item.skill === 'grammar' && item.kind === 'choice'),
        `grammar choice L${level}`,
      ).toBeGreaterThanOrEqual(4)
      expect(
        at((item) => item.skill === 'vocabulary' && item.kind === 'choice'),
        `vocabulary choice L${level}`,
      ).toBeGreaterThanOrEqual(3)
      expect(
        at((item) => item.kind === 'dictation'),
        `dictation L${level}`,
      ).toBeGreaterThanOrEqual(4)
      expect(levelPassages.filter((passage) => passage.level === level).length, `passages L${level}`).toBeGreaterThanOrEqual(2)
    }
  })

  it('every reading text has exactly three questions, at the level of the text', () => {
    for (const passage of levelPassages) {
      const own = deep.filter((item) => item.passage === passage.id)
      expect(own, passage.id).toHaveLength(3)
      for (const item of own) expect(item.level, item.id).toBe(passage.level)
      expect(passage.text.split(/\s+/).length, passage.id).toBeGreaterThanOrEqual(60)
    }
    for (const item of deep.filter((entry) => entry.skill === 'reading')) {
      expect(
        levelPassages.some((passage) => passage.id === item.passage),
        item.id,
      ).toBe(true)
    }
  })
})

// A whole check against the real questions: someone who knows everything and someone who knows nothing.
function simulate(knows: boolean) {
  const { bank: fullBank, plan } = createCheck({ bank })
  const answers: CheckAnswer[] = []
  const asked: LevelItem[] = []
  for (const skill of plan) {
    const item = nextItem(fullBank, skill, answers)
    expect(item, `question ${answers.length + 1} (${skill})`).not.toBeNull()
    asked.push(item!)
    const given = knows ? item!.answer.split('|')[0] : 'zzz'
    answers.push({
      itemId: item!.id,
      skill: item!.skill,
      level: item!.level,
      correct: isCorrectAnswer(item!, given),
      answer: given,
      expected: item!.answer,
      prompt: item!.prompt,
    })
  }
  return { asked, answers }
}

describe('a whole check on the real questions', () => {
  it('asks 25 different questions, with every kind in it', () => {
    const { asked } = simulate(true)
    expect(asked).toHaveLength(Object.values(QUESTIONS_PER_SKILL).reduce((a, b) => a + b, 0))
    expect(new Set(asked.map((item) => item.id)).size).toBe(asked.length)
    const kinds = new Set(asked.map((item) => item.kind ?? 'type'))
    expect([...kinds].sort()).toEqual(['choice', 'dictation', 'type'])
  })

  it('asks each reading text as one block of three', () => {
    const { asked } = simulate(false)
    const reading = asked.filter((item) => item.skill === 'reading')
    expect(reading).toHaveLength(6)
    expect(new Set(reading.slice(0, 3).map((item) => item.passage)).size).toBe(1)
    expect(new Set(reading.slice(3).map((item) => item.passage)).size).toBe(1)
    expect(reading[0].passage).not.toBe(reading[3].passage)
  })

  it('puts someone who knows everything high, and someone who knows nothing low', () => {
    const top = scoreCheck(simulate(true).answers)
    const bottom = scoreCheck(simulate(false).answers)
    expect(top.overall.ability).toBeGreaterThan(3.2)
    expect(bottom.overall.ability).toBeLessThan(1.5)
    for (const skill of ['spelling', 'vocabulary', 'grammar', 'reading', 'listening'] as const) {
      expect(top.skills[skill], skill).toBeDefined()
      expect(top.skills[skill]!.ability, skill).toBeGreaterThan(bottom.skills[skill]!.ability)
    }
  })
})
