import { mixedPracticeTasks } from '../data/practice'
import type { LibraryWord } from '../types/library'
import type { PracticeMode, PracticeTask } from '../types/practice'
import { getAllWords } from './libraryStorage'
import { getReviewEntries } from './learningData'
import { getPracticeAttempts } from './practiceStorage'

export type PracticeScope = 'all' | 'library' | 'topic' | 'subtopic' | 'mistakes' | 'review'
export type PracticeSelection = { scope: PracticeScope; library: string; topic: string; subtopic: string }

function levelFor(difficulty: LibraryWord['difficulty']): PracticeTask['level'] { return difficulty === 'easy' ? 'B1' : difficulty === 'medium' ? 'B1+' : 'B2' }
function taskBase(word: LibraryWord) { return { topic: word.topic, topicId: word.topicId, subtopic: word.subtopic, wordId: word.wordId || word.id, library: word.library, level: levelFor(word.difficulty), hint: word.definition || word.example || `Focus on ${word.partOfSpeech || 'this word'}.`, example: word.example, rule: word.rule || `Review ${word.word} in the ${word.topic} topic.`, errorCategory: 'Inactive vocabulary' } }
function tasksForWord(word: LibraryWord): PracticeTask[] {
  const base = taskBase(word); const id = word.wordId || word.id
  const spellingChoices = [word.word, `${word.word[0]}${word.word[0]}${word.word.slice(1)}`, word.word.length > 3 ? word.word.slice(0, -1) : `${word.word}e`, word.word.replace(/[aeiou]/i, 'e'), `${word.word}e`]
    .filter((choice, index, values) => choice !== word.word || index === 0).filter((choice, index, values) => values.indexOf(choice) === index).slice(0, 4)
  return [
    { ...base, id: `library-${id}-write-en`, type: 'translate-ru-en', mode: 'write-en', prompt: word.translation, answer: word.word },
    { ...base, id: `library-${id}-listen`, type: 'translate-ru-en', mode: 'listen-write', prompt: word.translation, answer: word.word },
    { ...base, id: `library-${id}-translate-ru`, type: 'translate-en-ru', mode: 'translate-ru', prompt: word.word, answer: word.translation },
    { ...base, id: `library-${id}-spelling`, type: 'correct-spelling', mode: 'choose-spelling', prompt: word.translation, answer: word.word, choices: spellingChoices, errorCategory: 'Spelling' },
  ]
}

export function getPracticeOptions() {
  const words = getAllWords()
  return { libraries: [...new Set(words.map((word) => word.library))].sort(), topics: [...new Set(words.map((word) => word.topic))].sort(), subtopics: [...new Set(words.map((word) => word.subtopic).filter(Boolean))].sort() }
}

function modeForLegacyTask(task: PracticeTask): PracticeMode { return task.type === 'translate-ru-en' ? 'write-en' : task.type === 'translate-en-ru' ? 'translate-ru' : 'choose-spelling' }

export function getTasksForSelection(selection: PracticeSelection, mode: PracticeMode = 'write-en'): PracticeTask[] {
  const words = getAllWords(); let selected = words
  if (selection.scope === 'library') selected = words.filter((word) => word.library === selection.library)
  if (selection.scope === 'topic') selected = words.filter((word) => word.topic === selection.topic)
  if (selection.scope === 'subtopic') selected = words.filter((word) => word.subtopic === selection.subtopic)
  if (selection.scope === 'mistakes' || selection.scope === 'review') {
    const wanted = new Set((selection.scope === 'review' ? getReviewEntries() : getPracticeAttempts().filter((attempt) => !attempt.isCorrect)).map((entry) => entry.taskId))
    const saved = [...mixedPracticeTasks, ...words.flatMap(tasksForWord)].filter((task) => wanted.has(task.id) && (task.mode ?? modeForLegacyTask(task)) === mode)
    return saved.length ? saved : [...mixedPracticeTasks, ...words.flatMap(tasksForWord)].filter((task) => (task.mode ?? modeForLegacyTask(task)) === mode)
  }
  const generated = selected.flatMap(tasksForWord).filter((task) => task.mode === mode)
  const legacy = mixedPracticeTasks.filter((task) => mode !== 'choose-spelling' && modeForLegacyTask(task) === mode)
  return selection.scope === 'all' ? [...legacy, ...generated].slice(0, 24) : generated.slice(0, 24)
}

export function getTaskById(taskId: string) { return [...mixedPracticeTasks, ...getAllWords().flatMap(tasksForWord)].find((task) => task.id === taskId) }
