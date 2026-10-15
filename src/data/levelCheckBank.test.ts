import { describe, expect, it } from 'vitest'
import { buildLevelBank, levelPassages, type LevelItem } from './levelCheckBank'
import { meaningItems } from './levelCheckReading'
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

  it('every choice has three or four different options, and exactly one of them is the answer', () => {
    for (const item of choices) {
      const options = item.choices ?? []
      // the short tasks (a notice, a conversation) have three options, as in the Oxford and Cambridge tests; the rest have four
      expect([3, 4], item.id).toContain(options.length)
      if (!item.stimulus) expect(options, item.id).toHaveLength(4)
      expect(new Set(options.map((option) => option.toLocaleLowerCase())).size, item.id).toBe(options.length)
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
      // the blank can open the sentence, then the choices are capitalised
      expect(item.choices?.map((choice) => choice.toLowerCase())).toEqual(expect.arrayContaining(['a', 'an', 'the', 'no article']))
    }
  })

  it('dictation sentences are complete sentences that a voice can read', () => {
    for (const item of deep.filter((entry) => entry.kind === 'dictation')) {
      expect(item.answer.split('|')[0], item.id).toBe(item.prompt)
      expect(item.prompt, item.id).toMatch(/[.?]$/)
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
      expect(
        levelPassages.filter((passage) => passage.level === level && !passage.retired).length,
        `active passages L${level}`,
      ).toBeGreaterThanOrEqual(2)
    }
  })

  it('every reading text has exactly three questions, at the level of the text', () => {
    for (const passage of levelPassages) {
      const own = deep.filter((item) => item.passage === passage.id)
      expect(own, passage.id).toHaveLength(3)
      for (const item of own) expect(item.level, item.id).toBe(passage.level)
      expect(passage.text.split(/\s+/).length, passage.id).toBeGreaterThanOrEqual(60)
    }
    // every reading question belongs to a text, or is a short task that carries its own text
    for (const item of deep.filter((entry) => entry.skill === 'reading')) {
      if (item.stimulus) expect(item.passage, item.id).toBeUndefined()
      else
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

  it('mixes short reading tasks with one text and one gapped text of three questions each', () => {
    for (const knows of [true, false]) {
      const { asked } = simulate(knows)
      const reading = asked.filter((item) => item.skill === 'reading')
      expect(reading).toHaveLength(9)
      const singles = reading.filter((item) => !item.passage)
      const blocks = reading.filter((item) => item.passage)
      expect(singles).toHaveLength(3)
      expect(
        singles.every((item) => item.stimulus),
        'a short task shows its text or conversation',
      ).toBe(true)
      expect(new Set(blocks.map((item) => item.passage)).size).toBe(2)
      // a text is asked together, and the first is a text, the second a gapped text
      const order = blocks.map((item) => item.passage)
      expect(order.slice(0, 3).every((id) => id === order[0])).toBe(true)
      expect(order.slice(3).every((id) => id === order[3])).toBe(true)
      expect(blocks[0].format ?? 'text').toBe('text')
      expect(blocks[3].format).toBe('cloze')
    }
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

describe('dictation', () => {
  it('accepts a number written in digits, and o’clock without the apostrophe', () => {
    const byId = (id: string) => bank.find((item) => item.id === id)!
    expect(isCorrectAnswer(byId('lcd-ls-1-02'), 'The shop opens at 9 oclock')).toBe(true)
    expect(isCorrectAnswer(byId('lcd-ls-1-02'), "the shop opens at nine o'clock.")).toBe(true)
    expect(isCorrectAnswer(byId('lcd-ls-1-05'), 'She has 2 cats and a small dog.')).toBe(true)
    expect(isCorrectAnswer(byId('lcd-ls-2-01'), 'I have lived in this city for about 10 years')).toBe(true)
    expect(isCorrectAnswer(byId('lcd-ls-2-02'), 'He said that the meeting would start at half past 3.')).toBe(true)
    expect(isCorrectAnswer(byId('lcd-ls-1-02'), 'The shop opens at ten o’clock.')).toBe(false)
  })
  it('does not accept a digit that was not said', () => {
    const item = bank.find((entry) => entry.id === 'lcd-ls-1-02')!
    expect(isCorrectAnswer(item, 'The shop opens at 10 oclock.')).toBe(false)
  })
})

describe('what a check no longer asks', () => {
  it('never asks a translation question or a question about a retired text', () => {
    for (const knows of [true, false]) {
      const { asked } = simulate(knows)
      expect(asked.filter((item) => item.retired).map((item) => item.id)).toEqual([])
      expect(asked.filter((item) => item.skill === 'vocabulary').every((item) => item.kind === 'choice')).toBe(true)
      expect(asked.filter((item) => item.skill === 'vocabulary')).toHaveLength(5)
    }
  })

  it('keeps the retired questions in the bank, because old results are scored again by looking them up', () => {
    expect(bank.filter((item) => item.retired).length).toBeGreaterThan(60)
    expect(levelPassages.filter((passage) => passage.retired).length).toBeGreaterThanOrEqual(9)
  })

  it('has new word-use, grammar and word-form questions to choose from at every level', () => {
    for (const level of levels) {
      expect(
        bank.filter((item) => item.id.startsWith('lcd-vc-n15') && item.level === level).length,
        `word use L${level}`,
      ).toBeGreaterThanOrEqual(6)
      expect(
        bank.filter((item) => item.id.startsWith('lcd-gr-n15') && item.level === level).length,
        `grammar L${level}`,
      ).toBeGreaterThanOrEqual(2)
      expect(
        bank.filter((item) => item.id.startsWith('lcd-wf-n15') && item.level === level).length,
        `word forms L${level}`,
      ).toBeGreaterThanOrEqual(1)
    }
  })
})

// The second reading set must not be answerable by finding a phrase in the text, and the right option must not give itself away.
describe('the second reading set', () => {
  const passageOf = (item: LevelItem) => levelPassages.find((passage) => passage.id === item.passage)!
  const harder = meaningItems.filter((item) => item.level >= 2)
  const norm = (text: string) =>
    text
      .toLocaleLowerCase()
      .replace(/[“”"’']/g, '')
      .replace(/s+/g, ' ')

  it('has a right answer that is a paraphrase, not a sentence copied from the text', () => {
    for (const item of harder) expect(norm(passageOf(item).text), item.id).not.toContain(norm(item.answer))
  })

  it('does not make the right option the longest one by a wide margin', () => {
    let longest = 0
    for (const item of harder) {
      const others = (item.choices ?? []).filter((option) => option !== item.answer)
      if (item.answer.length > Math.max(...others.map((option) => option.length)) * 1.35) longest += 1
    }
    expect(longest, 'questions where the right option is clearly the longest').toBeLessThanOrEqual(Math.floor(harder.length * 0.2))
  })

  it('has a spread of right options over the four places, after the options are shuffled by the page nothing is learnt from the order', () => {
    expect(new Set(meaningItems.map((item) => item.choices?.[0])).size).toBeGreaterThan(30) // answers differ: no repeated stock answer
  })

  it('has at least one question per text that asks for meaning, not for a detail', () => {
    const meaningWords = /mean|imply|suggest|feel|attitude|why|purpose|sum up|NOT true|react|view/i
    const texts = levelPassages.filter(
      (entry) => !entry.retired && entry.level >= 2 && meaningItems.some((item) => item.passage === entry.id),
    )
    expect(texts.length).toBeGreaterThanOrEqual(8)
    for (const passage of texts) {
      const own = meaningItems.filter((item) => item.passage === passage.id)
      expect(
        own.some((item) => meaningWords.test(item.prompt)),
        passage.id,
      ).toBe(true)
    }
  })
})

// A gap in a conversation must not be answered by the other speaker's line (A asks "...good at sport?", B says "good ___ football").
describe('conversations with a gap', () => {
  const words = (text: string) => text.toLocaleLowerCase().match(/[a-z’']+/g) ?? []
  const dialogues = bank.filter((item) => item.kind === 'choice' && !item.stimulus && /^A: .*\nB: /s.test(item.prompt))

  it('are there (the Oxford style: a short conversation, one gap)', () => {
    expect(dialogues.length).toBeGreaterThanOrEqual(20)
  })

  it('do not print the answer in the first speaker’s line', () => {
    for (const item of dialogues) {
      const first = new Set(words(item.prompt.split('\n')[0]))
      const answer = words(item.answer).filter((word) => word.length > 1)
      expect(
        answer.filter((word) => first.has(word)),
        item.id,
      ).toEqual([])
    }
  })

  it('have the gap in the second speaker’s line', () => {
    for (const item of dialogues) expect(item.prompt.split('\n')[1], item.id).toContain('___')
  })
})
