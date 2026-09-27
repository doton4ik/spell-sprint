import { grammar, spelling, vocabulary } from './diagnostic'
import type { LibraryWord } from '../types/library'
import { extraLevelItems } from './levelCheckExtra'

// Question bank for the adaptive level check. Levels: 1 = A2, 2 = B1, 3 = B2, 4 = C1.
export type Skill = 'spelling' | 'vocabulary' | 'grammar'
export type LevelItem = {
  id: string
  skill: Skill
  level: 1 | 2 | 3 | 4
  prompt: string
  answer: string
  wordId?: string // set when the item is a library word, so the result feeds that word's progress
  translation?: string
}

export const skillLabels: Record<Skill, string> = { spelling: 'Spelling', vocabulary: 'Vocabulary', grammar: 'Grammar' }
export const skillInstructions: Record<Skill, string> = {
  spelling: 'Write the word correctly. Some are already right — then just copy them.',
  vocabulary: 'Write the English word.',
  grammar: 'Rewrite the sentence correctly. If it is already right, copy it.',
}

// Levels for the original diagnostic items, by how often B1–B2 learners get them wrong.
const spellingLevels: Record<string, LevelItem['level']> = {
  knowledge: 1, separate: 2, definitely: 2, government: 2, successful: 2, achieve: 2, beginning: 2, available: 2,
  accommodation: 3, development: 3, immediately: 3, embarrass: 3, argument: 3, independent: 3, necessary: 3, colleague: 3,
  occurrence: 4, maintenance: 4, privilege: 4, committed: 4,
}
const extraSpelling: Array<[string, string, LevelItem['level']]> = [
  ['freind', 'friend', 1], ['becuase', 'because', 1], ['wich', 'which', 1], ['beautifull', 'beautiful', 1], ['tommorow', 'tomorrow', 2],
]
const vocabularyLevels: Record<string, LevelItem['level']> = {
  agree: 1, explain: 1, compare: 2, improve: 2, solution: 2, develop: 2, suggest: 2, research: 2,
  achievement: 3, influence: 3, environment: 3, opportunity: 3, advantage: 3, responsibility: 3, variety: 3, society: 3, available: 3, communication: 3,
  behaviour: 4, assume: 4,
}
const grammarLevels: LevelItem['level'][] = [1, 2, 1, 3, 3, 1, 2, 3, 3, 2, 2, 3, 1, 2, 3, 1, 4, 4, 2, 4]

const professionalTopics = new Set(['Logistics', 'Warehouse Operations', 'Transport and Trade', 'Supply Chain'])
const difficultyLevel = { easy: 1, medium: 2, hard: 3 } as const

export function buildLevelBank(words: LibraryWord[]): LevelItem[] {
  const spellingItems: LevelItem[] = [
    ...spelling.map(([prompt, answer]) => ({ id: `lc-spelling-${answer}`, skill: 'spelling' as const, level: spellingLevels[answer] ?? 3, prompt, answer })),
    ...extraSpelling.map(([prompt, answer, level]) => ({ id: `lc-spelling-${answer}`, skill: 'spelling' as const, level, prompt, answer })),
  ]
  const vocabularyItems: LevelItem[] = vocabulary.map(([prompt, answer]) => ({ id: `lc-vocabulary-${answer}`, skill: 'vocabulary' as const, level: vocabularyLevels[answer] ?? 3, prompt, answer }))
  // Everyday library words widen the vocabulary pool, and a correct/incorrect answer updates that word.
  const seen = new Set(vocabularyItems.map((item) => item.answer))
  for (const word of words) {
    if (professionalTopics.has(word.topic) || seen.has(word.word.toLocaleLowerCase()) || !word.translation) continue
    seen.add(word.word.toLocaleLowerCase())
    vocabularyItems.push({ id: `lc-word-${word.wordId}`, skill: 'vocabulary', level: difficultyLevel[word.difficulty] ?? 2, prompt: word.translation, answer: word.word, wordId: word.wordId, translation: word.translation })
  }
  const grammarItems: LevelItem[] = grammar.map(([prompt, answer], index) => ({ id: `lc-grammar-${index + 1}`, skill: 'grammar' as const, level: grammarLevels[index] ?? 2, prompt, answer }))
  // Extra questions from levelCheckExtra.ts; an id clash with the built-in bank keeps the built-in item.
  const known = new Set([...spellingItems, ...vocabularyItems, ...grammarItems].map((item) => item.id))
  const extra = extraLevelItems
    .map(([skill, level, prompt, answer], index): LevelItem => ({ id: `lc-extra-${skill}-${answer.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${index}`, skill, level, prompt, answer }))
    .filter((item) => item.prompt.trim() && item.answer.trim() && !known.has(item.id))
  return [...spellingItems, ...vocabularyItems, ...grammarItems, ...extra]
}
