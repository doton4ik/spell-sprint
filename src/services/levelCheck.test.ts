import { describe, expect, it } from 'vitest'
import type { LevelItem } from '../data/levelCheckBank'
import {
  buildPlan,
  createCheck,
  fillGap,
  isCorrectAnswer,
  nextItem,
  normaliseAnswer,
  QUESTIONS_PER_SKILL,
  rangeFor,
  scoreCheck,
  TOTAL_QUESTIONS,
  type CheckAnswer,
  type LevelCheckResult,
} from './levelCheck'

const item = (id: string, skill: LevelItem['skill'], level: LevelItem['level'], extra: Partial<LevelItem> = {}): LevelItem => ({
  id,
  skill,
  level,
  prompt: id,
  answer: 'x',
  ...extra,
})
const answer = (it: LevelItem, correct: boolean): CheckAnswer => ({
  itemId: it.id,
  skill: it.skill,
  level: it.level,
  correct,
  answer: correct ? it.answer : 'wrong',
  expected: it.answer,
  prompt: it.prompt,
})

describe('answers', () => {
  it('ignores punctuation, case and hyphens when comparing', () => {
    expect(normaliseAnswer('  A one-way, “ticket”!  ')).toBe('a one way ticket')
    expect(isCorrectAnswer(item('d', 'listening', 1, { answer: 'A one-way ticket.' }), 'a ONE WAY ticket')).toBe(true)
  })
  it('accepts every alternative written with |', () => {
    const it = item('c', 'listening', 2, { answer: 'I do not know|I don’t know' })
    expect(isCorrectAnswer(it, "i don't know")).toBe(true)
    expect(isCorrectAnswer(it, 'I do not know')).toBe(true)
    expect(isCorrectAnswer(it, 'I know')).toBe(false)
  })
  it('fills the gap of a prompt with an option', () => {
    expect(fillGap('He is ___ honest man.', 'an')).toBe('He is an honest man.')
    expect(fillGap('no gap here', 'an')).toBe('an')
  })
})

describe('the range of a level', () => {
  it('is a single level when the estimate is far from a boundary', () => {
    expect(rangeFor(2.0, 6)).toBeUndefined()
    expect(rangeFor(3.0, 6)).toBeUndefined()
  })
  it('is two levels when the estimate sits on a boundary', () => {
    expect(rangeFor(2.5, 6)).toBe('B1–B2')
    expect(rangeFor(1.5, 4)).toBe('A2–B1')
  })
  it('narrows with more answers', () => {
    expect(rangeFor(2.7, 4)).toBe('B1–B2')
    expect(rangeFor(2.7, 25)).toBeUndefined()
  })
})

describe('the order of the questions', () => {
  // one question of every skill is enough to take part in the plan
  const fullBank = (['spelling', 'vocabulary', 'grammar', 'reading', 'listening'] as const).map((skill) => item(`any-${skill}`, skill, 2))
  it('has 25 questions with the quota of every skill', () => {
    const { plan } = createCheck({ bank: fullBank })
    expect(plan).toHaveLength(TOTAL_QUESTIONS)
    for (const [skill, count] of Object.entries(QUESTIONS_PER_SKILL)) expect(plan.filter((s) => s === skill)).toHaveLength(count)
  })
  it('keeps the reading questions in two blocks of three', () => {
    const { plan } = createCheck({ bank: fullBank })
    const runs = plan.join(',').match(/(?:reading,){2}reading/g)
    expect(runs).toHaveLength(2)
  })
  it('has no listening part when the browser cannot speak', () => {
    const { plan } = createCheck({ listening: false, bank: fullBank })
    expect(plan).toHaveLength(TOTAL_QUESTIONS - QUESTIONS_PER_SKILL.listening)
    expect(plan).not.toContain('listening')
  })
})

describe('a bank without some skills', () => {
  it('leaves those skills out of the plan', () => {
    const bank = [item('s', 'spelling', 2), item('v', 'vocabulary', 2), item('g', 'grammar', 2)]
    const { plan } = createCheck({ bank })
    expect(plan).toHaveLength(QUESTIONS_PER_SKILL.spelling + QUESTIONS_PER_SKILL.vocabulary + QUESTIONS_PER_SKILL.grammar)
    expect(plan).not.toContain('reading')
    expect(plan).not.toContain('listening')
  })
})

describe('choosing the next question', () => {
  const bank = [
    item('v1', 'vocabulary', 2),
    item('v2', 'vocabulary', 2, { kind: 'choice', choices: ['x', 'y'] }),
    item('v3', 'vocabulary', 2, { kind: 'choice', choices: ['x', 'y'] }),
    item('v4', 'vocabulary', 3, { kind: 'choice', choices: ['x', 'y'] }),
  ]
  it('follows the kind plan of the skill', () => {
    const first = nextItem(bank, 'vocabulary', [])
    expect(first?.kind ?? 'type').toBe('type')
    const second = nextItem(bank, 'vocabulary', [answer(bank[0], true)])
    expect(second?.kind).toBe('choice')
  })
  it('falls back to another kind when the wanted kind is used up', () => {
    const only = [item('v1', 'vocabulary', 2), item('v9', 'vocabulary', 2)]
    const next = nextItem(only, 'vocabulary', [answer(only[0], true)])
    expect(next?.id).toBe('v9')
  })

  const passages = [
    item('rA1', 'reading', 2, { passage: 'A', kind: 'choice', choices: ['x', 'y'] }),
    item('rA2', 'reading', 2, { passage: 'A', kind: 'choice', choices: ['x', 'y'] }),
    item('rA3', 'reading', 2, { passage: 'A', kind: 'choice', choices: ['x', 'y'] }),
    item('rB1', 'reading', 3, { passage: 'B', kind: 'choice', choices: ['x', 'y'] }),
    item('rB2', 'reading', 3, { passage: 'B', kind: 'choice', choices: ['x', 'y'] }),
    item('rB3', 'reading', 3, { passage: 'B', kind: 'choice', choices: ['x', 'y'] }),
    item('rC1', 'reading', 1, { passage: 'C', kind: 'choice', choices: ['x', 'y'] }),
    item('rC2', 'reading', 1, { passage: 'C', kind: 'choice', choices: ['x', 'y'] }),
    item('rC3', 'reading', 1, { passage: 'C', kind: 'choice', choices: ['x', 'y'] }),
  ]
  it('starts reading at B1 and keeps asking about the same text', () => {
    const first = nextItem(passages, 'reading', [])
    expect(first?.passage).toBe('A')
    const second = nextItem(passages, 'reading', [answer(passages[0], true)])
    expect(second?.id).toBe('rA2')
    const third = nextItem(passages, 'reading', [answer(passages[0], true), answer(passages[1], false)])
    expect(third?.id).toBe('rA3')
  })
  it('moves to a harder text after 2 of 3 right, and an easier one after 1 of 3', () => {
    const upBlock = [answer(passages[0], true), answer(passages[1], true), answer(passages[2], false)]
    expect(nextItem(passages, 'reading', upBlock)?.passage).toBe('B')
    const downBlock = [answer(passages[0], false), answer(passages[1], true), answer(passages[2], false)]
    expect(nextItem(passages, 'reading', downBlock)?.passage).toBe('C')
  })
})

describe('older results with three skills', () => {
  const old = (() => {
    const answers: CheckAnswer[] = [
      answer(item('s1', 'spelling', 2), true),
      answer(item('v1', 'vocabulary', 2), false),
      answer(item('g1', 'grammar', 2), true),
    ]
    return { id: 'old', completedAt: '2026-08-31T10:00:00.000Z', answers, ...scoreCheck(answers) } as LevelCheckResult
  })()

  it('are scored over the skills that were asked about only', () => {
    expect(Object.keys(old.skills).sort()).toEqual(['grammar', 'spelling', 'vocabulary'])
    expect(old.skills.reading).toBeUndefined()
  })
  it('still produce a plan', () => {
    expect(() => buildPlan(old)).not.toThrow()
    expect(buildPlan(old).length).toBeGreaterThan(0)
  })
  it('a result with reading and listening plans a step for the weakest of them', () => {
    const answers = [
      answer(item('r1', 'reading', 1), false),
      answer(item('l1', 'listening', 1), false),
      answer(item('s1', 'spelling', 4), true),
      answer(item('v1', 'vocabulary', 4), true),
      answer(item('g1', 'grammar', 4), true),
    ]
    const result = { id: 'new', completedAt: '2026-10-10T10:00:00.000Z', answers, ...scoreCheck(answers) } as LevelCheckResult
    const titles = buildPlan(result).map((step) => step.title)
    expect(titles.some((title) => /Read more|dictation/i.test(title))).toBe(true)
  })
})

describe('what to show for a level', () => {
  it('is the single level, the range, or an honest edge', async () => {
    const { levelLabel } = await import('./levelCheck')
    expect(levelLabel({ level: 'B1', ability: 2.1 })).toBe('B1')
    expect(levelLabel({ level: 'B1', ability: 2.5, range: 'B1–B2' })).toBe('B1–B2')
    expect(levelLabel({ level: 'A2', ability: 0.9 })).toBe('A2 or below')
    expect(levelLabel({ level: 'A2', ability: 1.4 })).toBe('A2')
    expect(levelLabel({ level: 'C1', ability: 4.4 })).toBe('C1 or above')
  })
})

describe('comparing two checks', () => {
  const asked = (skill: 'spelling' | 'vocabulary' | 'grammar' | 'reading', level: 1 | 2 | 3 | 4, correct: boolean) =>
    answer(item(`${skill}${level}${correct}`, skill, level), correct)
  const make = (answers: CheckAnswer[], id: string) =>
    ({ id, completedAt: '2026-10-01T10:00:00.000Z', answers, ...scoreCheck(answers) }) as LevelCheckResult

  it('only counts the skills both checks measured', async () => {
    const { abilityChange } = await import('./levelCheck')
    const old = make([asked('spelling', 2, true), asked('vocabulary', 2, true), asked('grammar', 2, true)], 'old')
    // the new check also has reading, which the old one never measured, and it is much lower there
    const now = make(
      [asked('spelling', 2, true), asked('vocabulary', 2, true), asked('grammar', 2, true), asked('reading', 1, false)],
      'new',
    )
    expect(abilityChange(now, old)).toBe(0)
  })
  it('shows a rise when the shared skills went up', async () => {
    const { abilityChange } = await import('./levelCheck')
    const before = make([asked('spelling', 2, false), asked('vocabulary', 2, false)], 'before')
    const after = make([asked('spelling', 3, true), asked('vocabulary', 3, true), asked('reading', 1, false)], 'after')
    expect(abilityChange(after, before)).toBeGreaterThan(1)
  })
})

describe('a retake', () => {
  it('does not always start the reading with the same text', () => {
    const texts = ['A', 'B', 'C'].flatMap((passage) =>
      [1, 2, 3].map((n) => item(`${passage}${n}`, 'reading', 2, { passage, kind: 'choice', choices: ['x', 'y'] })),
    )
    const firsts = new Set(Array.from({ length: 60 }, () => nextItem(texts, 'reading', [])?.passage))
    expect(firsts.size).toBeGreaterThan(1)
  })
})

describe('the plan for listening', () => {
  it('opens dictation (listen-write), not ordinary practice', () => {
    const answers = [
      answer(item('l1', 'listening', 1), false),
      answer(item('s1', 'spelling', 4), true),
      answer(item('v1', 'vocabulary', 4), true),
      answer(item('g1', 'grammar', 4), true),
      answer(item('r1', 'reading', 4), true),
    ]
    const result = { id: 'x', completedAt: '2026-10-10T10:00:00.000Z', answers, ...scoreCheck(answers) } as LevelCheckResult
    const step = buildPlan(result).find((entry) => /dictation/i.test(entry.title))
    expect(step?.action.mode).toBe('listen-write')
  })
})

describe('dictation and contractions', () => {
  const sentence = item('d1', 'listening', 1, { kind: 'dictation', answer: 'It is very cold in the morning.' })
  it('accepts the contraction a learner may well write', () => {
    expect(isCorrectAnswer(sentence, "It's very cold in the morning")).toBe(true)
    expect(isCorrectAnswer(sentence, 'it’s very cold in the morning.')).toBe(true)
  })
  it('still rejects a different word', () => {
    expect(isCorrectAnswer(sentence, "It's very cold in the evening")).toBe(false)
    expect(isCorrectAnswer(sentence, 'Its very cold in the morning')).toBe(false)
  })
  it('accepts the long form when the sentence is written with a contraction', () => {
    const contracted = item('d2', 'listening', 1, { kind: 'dictation', answer: "I don't know." })
    expect(isCorrectAnswer(contracted, 'I do not know')).toBe(true)
  })
})

// What a set of answers earns. These pin the meaning of the levels, whatever the maths behind them:
//  - A level needs a real share of its own questions right, on top of the ones a level below: for B2 about half of the B2
//    questions when typed (about 3 of 4 when they are multiple choice), for C1 about 7 of 8. Not one lucky answer.
//  - A right answer to a multiple-choice question (four options) says little: a quarter of them are guessed.
//  - Questions answered right at a level below do not make up for questions missed at the level itself.
describe('the level a set of answers earns', () => {
  type Spec = [level: 1 | 2 | 3 | 4, correct: boolean, kind?: 'type' | 'choice']
  const skills = ['spelling', 'vocabulary', 'grammar', 'reading', 'listening'] as const
  const answersFor = (specs: Spec[]): CheckAnswer[] =>
    specs.map(([level, correct, kind = 'type'], index) => ({
      itemId: `t${index}`,
      skill: skills[index % skills.length],
      level,
      correct,
      answer: '',
      expected: '',
      prompt: '',
      kind,
      options: kind === 'choice' ? 4 : undefined,
    }))
  const repeat = (spec: Spec, times: number): Spec[] => Array.from({ length: times }, () => spec)
  const levelOf = (specs: Spec[]) => scoreCheck(answersFor(specs)).overall.level

  it('is not B2 when every B1 question is right and every B2 question is wrong', () => {
    expect(levelOf([...repeat([2, true], 10), ...repeat([3, false], 10)])).toBe('B1')
  })

  it('is no higher than B1 after two right answers and everything else wrong, overall and in each skill', () => {
    const specs: Spec[] = [
      [2, true],
      [3, true],
      [4, false],
      [3, false],
      [2, false],
      [1, false],
    ]
    const all: Spec[] = [...specs, ...specs, ...specs, ...specs, ...specs]
    const result = scoreCheck(answersFor(all))
    expect(['A2', 'B1']).toContain(result.overall.level)
    for (const skill of skills) expect(['A2', 'B1'], skill).toContain(result.skills[skill]!.level)
    expect(['A2', 'B1']).toContain(scoreCheck(answersFor(specs.slice(0, 4))).skills.spelling!.level)
  })

  it('is A2 for typed answers all wrong and multiple-choice answers guessed (one in four right)', () => {
    const guessed: Spec[] = []
    for (let index = 0; index < 25; index += 1) guessed.push(index % 2 ? [index % 8 === 1 ? 3 : 2, index % 4 === 1, 'choice'] : [1, false])
    expect(levelOf(guessed)).toBe('A2')
  })

  it('is C1 when everything is right, and A2 or below when everything is wrong', () => {
    const right: Spec[] = [[2, true], [3, true], ...repeat([4, true] as Spec, 23)]
    const wrong: Spec[] = [[2, false], ...repeat([1, false] as Spec, 24)]
    expect(levelOf(right)).toBe('C1')
    expect(levelOf(wrong)).toBe('A2')
    expect(scoreCheck(answersFor(wrong)).overall.ability).toBeLessThan(1.3)
  })

  it('is B2 when most B2 questions are right (5 of 7), and B1 when fewer than half are (3 of 7)', () => {
    const base: Spec[] = [...repeat([1, true], 5), ...repeat([2, true], 6), [2, false]]
    const strong: Spec[] = [...base, ...repeat([3, true], 5), ...repeat([3, false], 2), ...repeat([4, true], 2), ...repeat([4, false], 4)]
    const weak: Spec[] = [...base, ...repeat([3, true], 3), ...repeat([3, false], 4), ...repeat([4, false], 6)]
    expect(levelOf(strong)).toBe('B2')
    expect(levelOf(weak)).toBe('B1')
  })

  it('counts a multiple-choice answer for less than a typed one', () => {
    const pattern = (kind: 'type' | 'choice'): Spec[] => [
      ...repeat([2, true, kind] as Spec, 8),
      ...repeat([3, true, kind] as Spec, 8),
      ...repeat([4, false, kind] as Spec, 4),
    ]
    expect(scoreCheck(answersFor(pattern('choice'))).overall.ability).toBeLessThan(scoreCheck(answersFor(pattern('type'))).overall.ability)
  })

  it('does not let the overall level run ahead of every single skill', () => {
    const strong: Spec[] = [...repeat([2, true], 5), ...repeat([3, true], 10), ...repeat([4, true], 4), ...repeat([4, false], 6)]
    const result = scoreCheck(answersFor(strong))
    const best = Math.max(...skills.map((skill) => result.skills[skill]!.ability))
    expect(result.overall.ability).toBeLessThanOrEqual(best + 0.01)
  })
})

describe('checks saved before the stricter scoring', () => {
  const oldCheck = (): LevelCheckResult => {
    // answers as the first version saved them: no kind, and the lenient numbers (every B1 right, every B2 wrong = "B2")
    const answers = Array.from({ length: 20 }, (_, index) => ({
      itemId: `old-${index}`,
      skill: (['spelling', 'vocabulary', 'grammar', 'reading', 'listening'] as const)[index % 5],
      level: index < 10 ? 2 : 3,
      correct: index < 10,
      answer: '',
      expected: '',
      prompt: '',
    })) as CheckAnswer[]
    return {
      id: 'old',
      completedAt: '2026-09-01T10:00:00.000Z',
      answers,
      skills: {},
      overall: { ability: 2.5, level: 'B2' },
    } as LevelCheckResult
  }

  it('are scored again when read, without rewriting what is stored', async () => {
    window.localStorage.clear()
    window.localStorage.setItem('spell-sprint.level-checks', JSON.stringify([oldCheck()]))
    const { getLevelChecks, getStoredLevelChecks, SCORING_VERSION } = await import('./levelCheck')
    expect(getStoredLevelChecks()[0].overall.level).toBe('B2') // as saved
    expect(getStoredLevelChecks()[0].scoring).toBeUndefined()
    const shown = getLevelChecks()[0]
    expect(shown.overall.level).toBe('B1') // the same answers, scored the same way as a new check
    expect(shown.scoring).toBe(SCORING_VERSION)
    expect(JSON.parse(window.localStorage.getItem('spell-sprint.level-checks')!)[0].overall.level).toBe('B2') // still untouched
  })

  it('do not make a retake look like a drop', async () => {
    const { abilityChange } = await import('./levelCheck')
    const old = oldCheck()
    window.localStorage.clear()
    window.localStorage.setItem('spell-sprint.level-checks', JSON.stringify([old]))
    const { getLevelChecks } = await import('./levelCheck')
    const sameAnswersNow = {
      ...old,
      id: 'new',
      completedAt: '2026-10-14T10:00:00.000Z',
      ...scoreCheck(old.answers),
      scoring: 2,
    } as LevelCheckResult
    expect(abilityChange(sameAnswersNow, getLevelChecks()[0])).toBe(0)
  })

  it('count a stored choice answer as a choice, using the bank, so the guess discount applies', async () => {
    window.localStorage.clear()
    const { buildLevelBank } = await import('../data/levelCheckBank')
    const choiceItem = buildLevelBank([]).find((bankItem) => bankItem.kind === 'choice')!
    const answers = Array.from({ length: 10 }, (_, index) => ({
      itemId: index === 0 ? choiceItem.id : `gone-${index}`,
      skill: 'grammar',
      level: 3,
      correct: true,
      answer: '',
      expected: '',
      prompt: '',
    })) as CheckAnswer[]
    window.localStorage.setItem(
      'spell-sprint.level-checks',
      JSON.stringify([{ id: 'c', completedAt: '2026-09-01T10:00:00.000Z', answers, skills: {}, overall: { ability: 3.5, level: 'C1' } }]),
    )
    const { getLevelChecks } = await import('./levelCheck')
    expect(getLevelChecks()[0].answers[0].kind).toBe('choice')
    expect(getLevelChecks()[0].answers[1].kind).toBeUndefined() // not in the bank any more: counted as typed
  })
})
