import { mixedPracticeTasks } from '../data/practice'
import type { LibraryWord } from '../types/library'
import type { PracticeMode, PracticeTask } from '../types/practice'
import { russianAnswers } from './answerMatch'
import { getAllWords, getEveryWord, getLibraries } from './libraryStorage'
import { getMistakeEntries, getReviewEntries } from './learningData'
import { getPracticeAttempts } from './practiceStorage'
import { spellingDistractors } from './spellingDistractors'
import { isRealOrRude } from './proofreadingEngine'

// Real words from the libraries and their examples: a wrong option must never be a real word.
let knownCache: Set<string> | null = null
function knownWords() {
  knownCache ??= new Set(getEveryWord().flatMap((word) => `${word.word} ${word.example ?? ''}`.toLocaleLowerCase().match(/[a-z']+/g) ?? []))
  return knownCache
}

export type PracticeScope = 'all' | 'library' | 'topic' | 'subtopic' | 'mistakes' | 'review'
export type PracticeSelection = { scope: PracticeScope; library: string; topic: string; subtopic: string }

function levelFor(difficulty: LibraryWord['difficulty']): PracticeTask['level'] { return difficulty === 'easy' ? 'B1' : difficulty === 'medium' ? 'B1+' : 'B2' }
function taskBase(word: LibraryWord) { return { topic: word.topic, topicId: word.topicId, subtopic: word.subtopic, wordId: word.wordId || word.id, library: word.library, level: levelFor(word.difficulty), hint: word.definition || word.example || `Focus on ${word.partOfSpeech || 'this word'}.`, example: word.example, extraExample: word.extraExample, extraExampleSource: word.extraExampleSource, rule: word.rule || `Review ${word.word} in the ${word.topic} topic.`, errorCategory: 'Inactive vocabulary' } }

function tasksForWord(word: LibraryWord): PracticeTask[] {
  const base = taskBase(word); const id = word.wordId || word.id
  // The order is shuffled when the task is shown (TaskCard), so the right answer is not always first.
  const spellingChoices = [word.word, ...spellingDistractors(word.word, (value) => knownWords().has(value) || isRealOrRude(value))]
  return [
    { ...base, id: `library-${id}-write-en`, type: 'translate-ru-en', mode: 'write-en', prompt: word.translation, answer: word.word, acceptedAnswers: word.alternatives?.length ? word.alternatives : undefined },
    { ...base, id: `library-${id}-listen`, type: 'translate-ru-en', mode: 'listen-write', prompt: word.translation, answer: word.word },
    { ...base, id: `library-${id}-translate-ru`, type: 'translate-en-ru', mode: 'translate-ru', prompt: word.word, answer: word.translation, acceptedAnswers: russianAnswers(word.translation) },
    // No believable wrong spelling (go on, queue up): no choice task for this word.
    ...(spellingChoices.length > 1 ? [{ ...base, id: `library-${id}-spelling`, type: 'correct-spelling' as const, mode: 'choose-spelling' as const, prompt: word.translation, answer: word.word, choices: spellingChoices, errorCategory: 'Spelling' }] : []),
  ]
}

export function getPracticeOptions() {
  const libraries = getLibraries(); const words = libraries.flatMap((library) => library.words)
  return { libraries: libraries.map((library) => library.name).sort(), topics: [...new Set(words.map((word) => word.topic))].sort(), subtopics: [...new Set(words.map((word) => word.subtopic).filter(Boolean))].sort() }
}


// A word that sits in two libraries (environment: General English and Spelling Traps) comes once per session.
function oncePerWord(tasks: PracticeTask[]) { const seen = new Set<string>(); return tasks.filter((task) => { const key = `${task.mode}:${(task.mode === 'translate-ru' ? task.prompt : task.answer).toLocaleLowerCase()}`; if (seen.has(key)) return false; seen.add(key); return true }) }

export function getTasksForSelection(selection: PracticeSelection, mode: PracticeMode = 'write-en'): PracticeTask[] {
  const words = getAllWords(); let selected = words
  if (selection.scope === 'library') selected = getLibraries().find((library) => library.name === selection.library)?.words ?? []
  if (selection.scope === 'topic') selected = words.filter((word) => word.topic === selection.topic)
  if (selection.scope === 'subtopic') selected = words.filter((word) => word.subtopic === selection.subtopic)
  if (selection.scope === 'mistakes' || selection.scope === 'review') {
    // Only the learner's own words, never the whole library: the exact tasks they missed, plus the same
    // words in the chosen mode (a word missed in dictation can be practised in "Write in English").
    // Mastered words are left out. Nothing to repeat → an empty list, and the page says so.
    const entries = selection.scope === 'review' ? getReviewEntries() : getMistakeEntries().filter((entry) => entry.status !== 'mastered')
    const taskIds = new Set(entries.map((entry) => entry.taskId))
    const wordIds = new Set(entries.map((entry) => entry.wordId).filter(Boolean))
    return oncePerWord(words.flatMap(tasksForWord).filter((task) => task.mode === mode && (taskIds.has(task.id) || (task.wordId !== undefined && wordIds.has(task.wordId)))))
  }
  // The eight early demo tasks (data/practice.ts) are no longer practised: they had no word behind them,
  // and a corrected sentence does not fit any of the four modes. They stay only for old history.
  return oncePerWord(selected.flatMap(tasksForWord).filter((task) => task.mode === mode))
}

export function getTaskById(taskId: string) { return [...mixedPracticeTasks, ...getEveryWord().flatMap(tasksForWord)].find((task) => task.id === taskId) }

const PENDING_SELECTION_KEY = 'spell-sprint.pending-practice-selection'
export type PendingPracticeSelection = { wordIds: string[]; label: string; mode?: PracticeMode }
export function setPendingPracticeSelection(selection: PendingPracticeSelection) { window.sessionStorage.setItem(PENDING_SELECTION_KEY, JSON.stringify(selection)) }
export function consumePendingPracticeSelection(): PendingPracticeSelection | null {
  try { const value = window.sessionStorage.getItem(PENDING_SELECTION_KEY); return value ? JSON.parse(value) as PendingPracticeSelection : null } catch { return null }
}
export function clearPendingPracticeSelection() {
  try { window.sessionStorage.removeItem(PENDING_SELECTION_KEY) } catch { /* nothing stored */ }
}
export function getTasksForWordIds(wordIds: string[], mode: PracticeMode = 'write-en') {
  const wanted = new Set(wordIds)
  return getAllWords().filter((word) => wanted.has(word.wordId)).flatMap(tasksForWord).filter((task) => task.mode === mode)
}

// "среда" → environment: the answer is a real library word that also fits the Russian prompt (a
// different meaning of the same Russian word). That is not a spelling mistake, so practice shows a
// hint and lets the learner try again instead of recording an error.
const meanings = (russian: string) => russian.toLocaleLowerCase().split(/[,;]/).map((part) => part.replace(/\(.*?\)/g, '').trim()).filter(Boolean)
export function findOtherMeaning(answer: string, task: PracticeTask): { word: string; translation: string } | null {
  // Only when the Russian word is on screen (not in dictation, where the learner hears the English word).
  if (task.type !== 'translate-ru-en' || task.mode === 'listen-write' || !answer.trim()) return null
  const typed = answer.trim().toLocaleLowerCase()
  const promptMeanings = meanings(task.prompt)
  const match = getAllWords().find((word) => word.word.toLocaleLowerCase() === typed && word.wordId !== task.wordId && word.word.toLocaleLowerCase() !== task.answer.toLocaleLowerCase()
    && meanings(word.translation).some((meaning) => promptMeanings.some((prompt) => meaning === prompt || meaning.split(/\s+/).includes(prompt) || prompt.split(/\s+/).includes(meaning))))
  return match ? { word: match.word, translation: match.translation } : null
}
