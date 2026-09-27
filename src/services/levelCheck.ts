import { buildLevelBank, skillLabels, type LevelItem, type Skill } from '../data/levelCheckBank'
import type { LibraryWord } from '../types/library'
import type { PracticeAttempt } from '../types/practice'
import { getAllWords } from './libraryStorage'
import { savePracticeAttempt } from './practiceStorage'
import { scheduleAfterAnswer } from './reviewSchedule'
import { pickPracticeWords } from './topicStats'

// ---- The adaptive check ----------------------------------------------------------------------
// 20 questions, interleaved across three skills. Each skill runs its own staircase: start at B1,
// one level up after a right answer, one down after a wrong one, so every skill quickly settles
// around the learner's real level instead of spending questions on things far too easy or hard.
export const QUESTIONS_PER_SKILL: Record<Skill, number> = { spelling: 7, vocabulary: 7, grammar: 6 }
export const TOTAL_QUESTIONS = Object.values(QUESTIONS_PER_SKILL).reduce((sum, value) => sum + value, 0)
const START_LEVEL = 2
export const RECHECK_AFTER_DAYS = 30

export type CheckAnswer = { itemId: string; skill: Skill; level: number; correct: boolean; answer: string; expected: string; prompt: string; wordId?: string }
export type SkillResult = { ability: number; level: string; percent: number; correct: number; total: number }
export type LevelCheckResult = { id: string; completedAt: string; skills: Record<Skill, SkillResult>; overall: { ability: number; level: string }; answers: CheckAnswer[] }

const skillOrder: Skill[] = ['spelling', 'vocabulary', 'grammar']
export const cefrFor = (ability: number) => ability < 1.5 ? 'A2' : ability < 2.5 ? 'B1' : ability < 3.5 ? 'B2' : 'C1'
const percentFor = (ability: number) => Math.round(Math.min(100, Math.max(0, ((ability - 0.5) / 4) * 100)))

export function normaliseAnswer(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?,]+/g, '').replace(/\s+/g, ' ')
}

export function createCheck() {
  const bank = buildLevelBank(getAllWords())
  // Skill of every question, spread evenly: S V G S V G … until each skill has its quota.
  const plan: Skill[] = []
  const left = { ...QUESTIONS_PER_SKILL }
  while (plan.length < TOTAL_QUESTIONS) for (const skill of skillOrder) if (left[skill] > 0) { plan.push(skill); left[skill] -= 1 }
  return { bank, plan }
}

function targetLevel(answers: CheckAnswer[], skill: Skill) {
  const last = answers.filter((answer) => answer.skill === skill).at(-1)
  if (!last) return START_LEVEL
  return Math.min(4, Math.max(1, last.level + (last.correct ? 1 : -1)))
}

// Next question: the target level for its skill, or the nearest level that still has unused items.
export function nextItem(bank: LevelItem[], skill: Skill, answers: CheckAnswer[]): LevelItem | null {
  const used = new Set(answers.map((answer) => answer.itemId))
  const pool = bank.filter((item) => item.skill === skill && !used.has(item.id))
  const target = targetLevel(answers, skill)
  for (const distance of [0, 1, -1, 2, -2, 3, -3]) {
    const candidates = pool.filter((item) => item.level === target + distance)
    if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)]
  }
  return null
}

export function isCorrectAnswer(item: LevelItem, answer: string) {
  return normaliseAnswer(answer) === normaliseAnswer(item.answer)
}

// Ability: each answer is evidence that the level is a bit above (right) or below (wrong) that item.
function scoreSkill(answers: CheckAnswer[]): SkillResult {
  const ability = answers.length ? Math.min(4.5, Math.max(0.5, answers.reduce((sum, answer) => sum + answer.level + (answer.correct ? 0.5 : -0.5), 0) / answers.length)) : START_LEVEL
  return { ability: Math.round(ability * 10) / 10, level: cefrFor(ability), percent: percentFor(ability), correct: answers.filter((answer) => answer.correct).length, total: answers.length }
}

export function finishCheck(answers: CheckAnswer[]): LevelCheckResult {
  const skills = Object.fromEntries(skillOrder.map((skill) => [skill, scoreSkill(answers.filter((answer) => answer.skill === skill))])) as Record<Skill, SkillResult>
  const ability = Math.round((skillOrder.reduce((sum, skill) => sum + skills[skill].ability, 0) / skillOrder.length) * 10) / 10
  const result = { id: crypto.randomUUID(), completedAt: new Date().toISOString(), skills, overall: { ability, level: cefrFor(ability) }, answers }
  saveLevelCheck(result)
  return result
}

// Every answer is also a normal practice attempt: mistakes land in My Mistakes and the review queue,
// spelling mistakes get classified and linked to rules, and library words update their progress.
export function recordCheckAnswer(item: LevelItem, answer: string, correct: boolean) {
  const taskId = item.wordId ? `library-${item.wordId}-write-en` : item.id
  const { confidence, nextReviewAt } = scheduleAfterAnswer({ wordId: item.wordId, taskId }, correct, false)
  const attempt: PracticeAttempt = {
    id: crypto.randomUUID(), taskId,
    taskType: item.skill === 'grammar' ? 'correct-sentence' : item.skill === 'spelling' ? 'correct-spelling' : 'translate-ru-en',
    topic: item.skill === 'vocabulary' ? 'General English' : skillLabels[item.skill], wordId: item.wordId, library: 'Level check',
    userAnswer: answer, correctAnswer: item.answer, isCorrect: correct, wasSkipped: !answer.trim(), wasAnswerRevealed: false, hintUsed: false,
    attemptMode: 'write-en', errorType: 'unknown', confidence, nextReviewAt,
    errorCategory: correct ? 'Level check' : item.skill === 'grammar' ? 'Grammar' : 'General spelling', needsReview: !correct, createdAt: new Date().toISOString(),
  }
  savePracticeAttempt(attempt)
}


// ---- History ---------------------------------------------------------------------------------
const HISTORY_KEY = 'spell-sprint.level-checks'
const MAX_HISTORY = 36

export function getLevelChecks(): LevelCheckResult[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]') as LevelCheckResult[]
    return Array.isArray(stored) ? stored.filter((item) => item && typeof item.id === 'string' && item.skills).sort((a, b) => b.completedAt.localeCompare(a.completedAt)) : []
  } catch {
    return []
  }
}

function writeChecks(checks: LevelCheckResult[]) {
  try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(checks.sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, MAX_HISTORY))) } catch { /* storage full or blocked */ }
  window.dispatchEvent(new Event('spell-sprint:learning-updated'))
}

function saveLevelCheck(result: LevelCheckResult) { writeChecks([result, ...getLevelChecks()]) }

// Cloud restore: add checks this device has not seen (by id); never removes any.
export function mergeLevelChecks(incoming: unknown) {
  if (!Array.isArray(incoming)) return 0
  const current = getLevelChecks()
  const known = new Set(current.map((item) => item.id))
  const fresh = incoming.filter((item): item is LevelCheckResult => Boolean(item) && typeof item.id === 'string' && typeof item.completedAt === 'string' && Boolean(item.skills) && !known.has(item.id))
  if (fresh.length) writeChecks([...current, ...fresh])
  return fresh.length
}

export function nextCheckDue(checks = getLevelChecks()) {
  const last = checks[0]
  if (!last) return { due: true, date: null as Date | null }
  const date = new Date(last.completedAt); date.setDate(date.getDate() + RECHECK_AFTER_DAYS)
  return { due: date <= new Date(), date }
}

// ---- Plan after a check ----------------------------------------------------------------------
export type PlanStep = { title: string; text: string; action: { label: string; href?: string; words?: LibraryWord[]; practiceLabel?: string } }

const levelDifficulty = (level: string) => level === 'A2' ? ['easy'] : level === 'B1' ? ['easy', 'medium'] : ['medium', 'hard']

export function buildPlan(result: LevelCheckResult): PlanStep[] {
  const words = getAllWords()
  const everyday = words.filter((word) => !['Logistics', 'Warehouse Operations', 'Transport and Trade', 'Supply Chain'].includes(word.topic))
  const bySkill = [...skillOrder].sort((a, b) => result.skills[a].ability - result.skills[b].ability)
  const steps: PlanStep[] = []

  const wrongWordIds = new Set(result.answers.filter((answer) => !answer.correct && answer.wordId).map((answer) => answer.wordId!))
  const wrongCount = result.answers.filter((answer) => !answer.correct).length
  if (wrongWordIds.size) {
    steps.push({ title: `Review the ${wrongWordIds.size} word${wrongWordIds.size === 1 ? '' : 's'} you missed`, text: 'They are already in your review queue. A quick round now fixes them while they are fresh.', action: { label: 'Review now', words: words.filter((word) => wrongWordIds.has(word.wordId)), practiceLabel: 'Level check mistakes' } })
  } else if (wrongCount) {
    steps.push({ title: `Look through your ${wrongCount} mistake${wrongCount === 1 ? '' : 's'}`, text: 'Each one is saved in My Mistakes with what went wrong.', action: { label: 'Open My Mistakes', href: '#my-mistakes' } })
  }

  for (const skill of bySkill.slice(0, 2)) {
    const level = result.skills[skill].level
    if (skill === 'vocabulary') {
      const pool = everyday.filter((word) => levelDifficulty(level).includes(word.difficulty))
      steps.push({ title: `Grow your vocabulary at ${level}`, text: `Words picked for your level, starting with ones you have not practised yet.`, action: { label: 'Practise 10 words', words: pickPracticeWords(pool), practiceLabel: `Vocabulary · ${level}` } })
    } else if (skill === 'spelling') {
      const traps = everyday.filter((word) => word.library === 'Spelling Traps Core')
      steps.push({ title: 'Work on spelling patterns', text: 'Your spelling mistakes are linked to rules (sign in to track them). Practise the classic traps next.', action: { label: 'Practise spelling traps', words: pickPracticeWords(traps.length ? traps : everyday), practiceLabel: 'Spelling traps' } })
    } else {
      steps.push({ title: 'Strengthen grammar', text: 'Grammar rules come with short exercises that repeat what you get wrong.', action: { label: 'Open grammar rules', href: '#rules' } })
    }
  }
  return steps.slice(0, 3)
}
