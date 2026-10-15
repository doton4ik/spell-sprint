import { buildLevelBank, skillLabels, type ItemKind, type LevelItem, type Skill } from '../data/levelCheckBank'
import type { LibraryWord } from '../types/library'
import type { PracticeAttempt, PracticeMode } from '../types/practice'
import { getAllWords } from './libraryStorage'
import { savePracticeAttempt } from './practiceStorage'
import { scheduleAfterAnswer } from './reviewSchedule'
import { plain, sameText } from './contractions'
import { pickPracticeWords } from './topicStats'

// ---- The adaptive check ----------------------------------------------------------------------
// 30 questions across five skills (the pace of the online placement tests: many short tasks, about 40 seconds each). Each skill runs its own staircase: start at B1,
// one level up after a right answer, one down after a wrong one, so every skill quickly settles
// around the learner's real level instead of spending questions on things far too easy or hard.
export const QUESTIONS_PER_SKILL: Record<Skill, number> = { spelling: 4, vocabulary: 5, grammar: 8, reading: 9, listening: 4 }
// Reading is not one long text with all the questions: as in the Oxford and Cambridge tests it mixes short tasks (a notice or a
// message, two lines of conversation) with a text and a gapped text, three questions each. Where they stand in the check:
const READING_GROUPS: Array<[position: number, size: number]> = [
  [0.12, 2],
  [0.38, 3],
  [0.62, 1],
  [0.85, 3],
]
// A group of three is a text (its questions are asked together); smaller groups are single short tasks.
const READING_SHAPE: Array<'single' | 'block'> = READING_GROUPS.flatMap(([, size]) =>
  Array<'single' | 'block'>(size).fill(size >= 3 ? 'block' : 'single'),
)
const SINGLE_FORMATS = ['notice', 'meaning', 'meaning'] // the kind of short task, in order
const BLOCK_FORMATS = ['text', 'cloze'] // the kind of text, in order
export const TOTAL_QUESTIONS = Object.values(QUESTIONS_PER_SKILL).reduce((sum, value) => sum + value, 0)
const START_LEVEL = 2
export const RECHECK_AFTER_DAYS = 30

export type CheckAnswer = {
  itemId: string
  skill: Skill
  level: number
  correct: boolean
  answer: string
  expected: string
  prompt: string
  wordId?: string
  kind?: ItemKind // how it was asked: a multiple-choice answer can be a guess, a typed one hardly ever is
  options?: number // for a choice: how many options there were
}
// range: set when the answers do not settle the level (e.g. "B1–B2"); level is then the best single guess.
export type SkillResult = { ability: number; level: string; percent: number; correct: number; total: number; range?: string; sd?: number }
export type LevelCheckResult = {
  id: string
  completedAt: string
  // Older checks have only spelling, vocabulary and grammar; a skill that was not measured is missing.
  skills: Partial<Record<Skill, SkillResult>>
  overall: { ability: number; level: string; range?: string }
  answers: CheckAnswer[]
  scoring?: number // which way of scoring made the levels; a check without it is from the first, more generous one
}

export const skillOrder: Skill[] = ['spelling', 'vocabulary', 'grammar', 'reading', 'listening']

// What kind of question each skill asks, in order, so a check is not 25 of the same thing.
const KIND_PLAN: Record<Skill, ItemKind[]> = {
  spelling: ['type', 'type', 'type', 'type'],
  vocabulary: ['choice', 'choice', 'choice', 'choice', 'choice'], // word use: choose the word, no translating
  grammar: ['choice', 'choice', 'type', 'choice', 'choice', 'type', 'choice', 'choice'],
  reading: [],
  listening: ['dictation', 'dictation', 'dictation', 'dictation'],
}
const kindOf = (item: LevelItem): ItemKind => item.kind ?? 'type'
export const cefrFor = (ability: number) => (ability < 1.5 ? 'A2' : ability < 2.5 ? 'B1' : ability < 3.5 ? 'B2' : 'C1')
const percentFor = (ability: number) => Math.round(Math.min(100, Math.max(0, ((ability - 0.5) / 4) * 100)))

export const normaliseAnswer = plain

// The order of the questions: the skills interleaved, with the reading questions in two blocks of three
// (a text is read once and asked together). Without speech in the browser there is no listening part.
export function createCheck(options: { listening?: boolean; bank?: LevelItem[] } = {}) {
  const bank = options.bank ?? buildLevelBank(getAllWords())
  const left = { ...QUESTIONS_PER_SKILL }
  if (options.listening === false) left.listening = 0
  // a skill the bank has no questions for is left out instead of ending the check early
  for (const skill of skillOrder) if (!bank.some((item) => item.skill === skill && !item.retired)) left[skill] = 0
  const others: Skill[] = []
  const rest = skillOrder.filter((skill) => skill !== 'reading')
  while (rest.some((skill) => left[skill] > 0))
    for (const skill of rest)
      if (left[skill] > 0) {
        others.push(skill)
        left[skill] -= 1
      }
  // The reading groups go in at fixed places among the other questions.
  const insertAt = new Map<number, number>()
  if (left.reading > 0)
    for (const [position, size] of READING_GROUPS) {
      const index = Math.round(others.length * position)
      insertAt.set(index, (insertAt.get(index) ?? 0) + size)
    }
  const plan: Skill[] = []
  others.forEach((skill, index) => {
    plan.push(...Array<Skill>(insertAt.get(index) ?? 0).fill('reading'))
    plan.push(skill)
  })
  return { bank, plan }
}

function targetLevel(answers: CheckAnswer[], skill: Skill) {
  const last = answers.filter((answer) => answer.skill === skill).at(-1)
  if (!last) return START_LEVEL
  return Math.min(4, Math.max(1, last.level + (last.correct ? 1 : -1)))
}

// Next question: the target level for its skill, or the nearest level that still has unused items.
const DISTANCES = [0, 1, -1, 2, -2, 3, -3]
const pickOne = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

// Reading: a text that was started is finished first. Otherwise the shape says whether a short task or a text comes next, and the
// level follows the answers: after a short task the last answer decides (right goes up, wrong goes down); after a text 2 or 3 of 3
// right goes up, 0 or 1 goes down.
function nextReadingItem(bank: LevelItem[], answers: CheckAnswer[], pool: LevelItem[]): LevelItem | null {
  const passageOf = (id: string) => bank.find((item) => item.id === id)?.passage
  const mine = answers.filter((answer) => answer.skill === 'reading')
  const last = mine.at(-1)
  const lastPassage = last ? passageOf(last.itemId) : undefined
  if (lastPassage) {
    const same = pool.filter((item) => item.passage === lastPassage)
    if (same.length) return same[0]
  }
  let target = START_LEVEL
  if (last) {
    if (lastPassage) {
      const block = mine.filter((answer) => passageOf(answer.itemId) === lastPassage)
      const right = block.filter((answer) => answer.correct).length
      target = Math.min(4, Math.max(1, last.level + (right * 2 >= block.length + 1 ? 1 : -1)))
    } else target = Math.min(4, Math.max(1, last.level + (last.correct ? 1 : -1)))
  }
  const singles = pool.filter((item) => !item.passage)
  const texts = pool.filter((item) => item.passage)
  const singlesDone = mine.filter((answer) => !passageOf(answer.itemId)).length
  const textsDone = new Set(mine.map((answer) => passageOf(answer.itemId)).filter(Boolean)).size
  const wantsSingle = (READING_SHAPE[mine.length] ?? 'block') === 'single'

  const pickSingle = () => {
    for (const wanted of [SINGLE_FORMATS[singlesDone] ?? 'meaning', undefined])
      for (const distance of DISTANCES) {
        const candidates = singles.filter((item) => item.level === target + distance && (!wanted || item.format === wanted))
        if (candidates.length) return pickOne(candidates)
      }
    return null
  }
  const pickText = () => {
    for (const wanted of [BLOCK_FORMATS[textsDone] ?? 'text', undefined])
      for (const distance of DISTANCES) {
        const firsts = texts.filter((item) => item.level === target + distance && (!wanted || (item.format ?? 'text') === wanted))
        // the first question of a text that has not been started, one entry per text, not always the same text on a retake
        const unstarted = firsts.filter((item) => !answers.some((answer) => passageOf(answer.itemId) === item.passage))
        const firstOfEach = unstarted.filter((item, index) => unstarted.findIndex((other) => other.passage === item.passage) === index)
        if (firstOfEach.length) return pickOne(firstOfEach)
      }
    return null
  }
  return (wantsSingle ? (pickSingle() ?? pickText()) : (pickText() ?? pickSingle())) ?? null
}

// Next question: the target level for its skill, or the nearest level that still has unused items; the
// kind of question follows KIND_PLAN, and falls back to any kind when none is left.
export function nextItem(bank: LevelItem[], skill: Skill, answers: CheckAnswer[]): LevelItem | null {
  const used = new Set(answers.map((answer) => answer.itemId))
  const pool = bank.filter((item) => item.skill === skill && !used.has(item.id) && !item.retired)
  if (skill === 'reading') return nextReadingItem(bank, answers, pool)
  const target = targetLevel(answers, skill)
  const wanted = KIND_PLAN[skill][answers.filter((answer) => answer.skill === skill).length]
  for (const kind of [wanted, undefined])
    for (const distance of DISTANCES) {
      const candidates = pool.filter((item) => item.level === target + distance && (!kind || kindOf(item) === kind))
      if (candidates.length) return pickOne(candidates)
    }
  return null
}

// Several accepted answers can be written as "I do not know|I don't know".
// Contractions count as the same sentence: "It's" is "It is", "don't" is "do not".
export function isCorrectAnswer(item: LevelItem, answer: string) {
  if (item.kind === 'choice') return normaliseAnswer(answer) === normaliseAnswer(item.answer)
  return item.answer.split('|').some((option) => sameText(option, answer))
}

// "He is ___ honest man." + "an" -> "He is an honest man." (for the log of a wrong gap-fill)
export const fillGap = (prompt: string, option: string) => (prompt.includes('___') ? prompt.replace('___', option) : option)

// What to show for a level: the range when the answers do not settle it, and an honest edge at the ends of the
// scale (the questions only go from A2 to C1, so "A2" can mean lower and "C1" can mean higher).
export function levelLabel(result: { level: string; ability: number; range?: string }) {
  if (result.range) return result.range
  if (result.level === 'A2' && result.ability <= 1.2) return 'A2 or below'
  if (result.level === 'C1' && result.ability >= 4.2) return 'C1 or above'
  return result.level
}

// How much better (or worse) the learner is than in the previous check, over the skills both checks measured.
// An older check has three skills, a new one five: comparing the two averages would compare different things.
export function abilityChange(current: LevelCheckResult, previous: LevelCheckResult) {
  const shared = skillOrder.filter((skill) => current.skills[skill] && previous.skills[skill])
  if (!shared.length) return 0
  const mean = (result: LevelCheckResult) => shared.reduce((sum, skill) => sum + (result.skills[skill]?.ability ?? 0), 0) / shared.length
  return Math.round((mean(current) - mean(previous)) * 10) / 10
}

// How far the estimate can be trusted: with few answers it can sit on either side of a level boundary.
// Then the level is shown as a range (e.g. B1–B2). `sd` is the spread of the estimate when it is known.
export function rangeFor(ability: number, answers: number, sd?: number): string | undefined {
  const spread = sd === undefined ? 0.6 / Math.sqrt(Math.max(1, answers)) : sd * 0.6
  const low = cefrFor(Math.max(0.5, ability - spread))
  const high = cefrFor(Math.min(4.5, ability + spread))
  return low === high ? undefined : `${low}–${high}`
}

// ---- Scoring ---------------------------------------------------------------------------------
// The way of scoring that made a result. 1 (no marker): a right answer meant "a little above this question",
// averaged over a handful of answers: two lucky answers put someone at B2 and a B1 learner got B2 two times in three.
// 2: each answer is weighed by how likely a learner of each level would give it, and the estimate starts from a
// modest guess (between A2 and B1) that only real evidence moves. The rules it follows:
//  - A level needs a real share of its own questions right, on top of the ones a level below: for B2 about half of the B2
//    questions when typed (about 3 of 4 when they are multiple choice), for C1 about 7 of 8. Not one lucky answer.
//  - A right multiple-choice answer (four options) says little: a quarter of them are guessed.
//  - Questions answered right at a level below do not make up for questions missed at the level itself.
export const SCORING_VERSION = 2
const GRID = Array.from({ length: 81 }, (_, index) => 0.5 + index * 0.05) // abilities from 0.5 to 4.5
const SLOPE = 2 // how sharply a question separates learners below its level from those above it
const EDGE = 0.5 // a question of level L is a coin toss for someone at the bottom edge of L (L - 0.5)
const SLIP = 0.03 // even a strong learner mistypes now and then
const PRIOR_MEAN = 1.7
const PRIOR_SD = 1.4

const chanceOf = (answer: CheckAnswer) => (answer.kind === 'choice' ? 1 / Math.max(2, answer.options ?? 4) : 0)
function probabilityRight(ability: number, answer: CheckAnswer) {
  const guess = chanceOf(answer)
  return guess + (1 - guess - SLIP) / (1 + Math.exp(-SLOPE * (ability - (answer.level - EDGE))))
}

// The average ability that fits the answers, and how far it can be trusted (a grid over every ability from A2 to C1).
export function estimateAbility(answers: CheckAnswer[]): { ability: number; sd: number } {
  if (!answers.length) return { ability: START_LEVEL, sd: PRIOR_SD }
  const logs = GRID.map((ability) => {
    let log = -((ability - PRIOR_MEAN) ** 2) / (2 * PRIOR_SD ** 2)
    for (const answer of answers) {
      const p = probabilityRight(ability, answer)
      log += Math.log(answer.correct ? p : 1 - p)
    }
    return log
  })
  const top = Math.max(...logs)
  const weights = logs.map((log) => Math.exp(log - top))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const mean = GRID.reduce((sum, ability, index) => sum + ability * weights[index], 0) / total
  const variance = GRID.reduce((sum, ability, index) => sum + (ability - mean) ** 2 * weights[index], 0) / total
  return { ability: mean, sd: Math.sqrt(variance) }
}

function scoreSkill(answers: CheckAnswer[]): SkillResult {
  const { ability, sd } = estimateAbility(answers)
  return {
    ability: Math.round(ability * 10) / 10,
    level: cefrFor(ability),
    percent: percentFor(ability),
    correct: answers.filter((answer) => answer.correct).length,
    total: answers.length,
    range: rangeFor(ability, answers.length, sd),
    sd: Math.round(sd * 100) / 100,
  }
}

// The result of a set of answers, without saving it. Only skills that were asked about are in it. The overall level is the
// average of the skills, so it can never run ahead of every single skill.
export function scoreCheck(answers: CheckAnswer[]): Pick<LevelCheckResult, 'skills' | 'overall'> {
  const skills: Partial<Record<Skill, SkillResult>> = {}
  const exact: Array<{ ability: number; sd: number }> = []
  for (const skill of skillOrder) {
    const own = answers.filter((answer) => answer.skill === skill)
    if (!own.length) continue
    skills[skill] = scoreSkill(own)
    exact.push(estimateAbility(own))
  }
  const ability = exact.length ? exact.reduce((sum, value) => sum + value.ability, 0) / exact.length : START_LEVEL
  const sd = exact.length ? Math.sqrt(exact.reduce((sum, value) => sum + value.sd ** 2, 0)) / exact.length : PRIOR_SD
  return {
    skills,
    overall: { ability: Math.round(ability * 10) / 10, level: cefrFor(ability), range: rangeFor(ability, answers.length, sd) },
  }
}

export function finishCheck(answers: CheckAnswer[]): LevelCheckResult {
  const result = {
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
    ...scoreCheck(answers),
    answers,
    scoring: SCORING_VERSION,
  }
  saveLevelCheck(result)
  return result
}

// Typed words and sentences are also normal practice attempts: mistakes land in My Mistakes and the review
// queue, spelling mistakes get classified and linked to rules, and library words update their progress.
// Choices, reading and dictation stay out of the log (an "a / an" pick is not a spelling mistake), with one
// exception: a wrong pick on an item marked logAs (an article gap-fill) is logged as that grammar mistake
// with the whole corrected phrase, so it shows up under Articles and links to the article rules.
export function recordCheckAnswer(item: LevelItem, answer: string, correct: boolean) {
  const kind = item.kind ?? 'type'
  if (kind === 'dictation' || (kind === 'type' && item.log === false)) return
  if (kind === 'choice') {
    if (correct || !item.logAs) return
    const now = new Date().toISOString()
    const taskId = item.id
    const { confidence, nextReviewAt } = scheduleAfterAnswer({ taskId }, false, false, 'write-en')
    savePracticeAttempt({
      id: crypto.randomUUID(),
      taskId,
      taskType: 'correct-sentence',
      topic: 'Grammar',
      library: 'Level check',
      userAnswer: fillGap(item.prompt, answer),
      correctAnswer: fillGap(item.prompt, item.answer),
      isCorrect: false,
      wasSkipped: !answer.trim(),
      wasAnswerRevealed: false,
      hintUsed: false,
      attemptMode: 'write-en',
      errorType: 'unknown',
      confidence,
      nextReviewAt,
      errorCategory: item.logAs,
      needsReview: true,
      createdAt: now,
    })
    return
  }
  const taskId = item.wordId ? `library-${item.wordId}-write-en` : item.id
  const { confidence, nextReviewAt } = scheduleAfterAnswer({ wordId: item.wordId, taskId }, correct, false, 'write-en')
  const attempt: PracticeAttempt = {
    id: crypto.randomUUID(),
    taskId,
    taskType: item.skill === 'grammar' ? 'correct-sentence' : item.skill === 'spelling' ? 'correct-spelling' : 'translate-ru-en',
    topic: item.skill === 'vocabulary' ? 'General English' : skillLabels[item.skill],
    wordId: item.wordId,
    library: 'Level check',
    userAnswer: answer,
    correctAnswer: item.answer,
    isCorrect: correct,
    wasSkipped: !answer.trim(),
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    confidence,
    nextReviewAt,
    errorCategory: correct ? 'Level check' : item.skill === 'grammar' ? 'Grammar' : 'General spelling',
    needsReview: !correct,
    createdAt: new Date().toISOString(),
  }
  savePracticeAttempt(attempt)
}

// ---- A check in progress ---------------------------------------------------------------------
const RUN_KEY = 'spell-sprint.level-check-run'
const RUN_MAX_AGE_MS = 24 * 3600 * 1000
export type SavedRun = { plan: Skill[]; answers: CheckAnswer[]; savedAt: string }

export function saveRun(plan: Skill[], answers: CheckAnswer[]) {
  try {
    window.localStorage.setItem(RUN_KEY, JSON.stringify({ plan, answers, savedAt: new Date().toISOString() }))
  } catch {
    /* the check goes on without being saved */
  }
}
export function clearRun() {
  try {
    window.localStorage.removeItem(RUN_KEY)
  } catch {
    /* nothing to clear */
  }
}
// A saved run that is not finished and not older than a day.
export function loadRun(now = Date.now()): SavedRun | null {
  try {
    const run = JSON.parse(window.localStorage.getItem(RUN_KEY) ?? 'null') as SavedRun | null
    if (!run || !Array.isArray(run.plan) || !Array.isArray(run.answers) || typeof run.savedAt !== 'string') return null
    if (!run.answers.length || run.answers.length >= run.plan.length) return null
    if (now - new Date(run.savedAt).getTime() > RUN_MAX_AGE_MS) return null
    return run
  } catch {
    return null
  }
}

// ---- History ---------------------------------------------------------------------------------
const HISTORY_KEY = 'spell-sprint.level-checks'
const MAX_HISTORY = 36

// What is stored, exactly as it was saved (this is what is synced to the cloud and what a new result is added to).
export function getStoredLevelChecks(): LevelCheckResult[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]') as LevelCheckResult[]
    return Array.isArray(stored)
      ? stored
          .filter((item) => item && typeof item.id === 'string' && item.skills)
          .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      : []
  } catch {
    return []
  }
}

// A check saved before the stricter scoring is scored again from its answers when it is read (nothing is rewritten), so a
// retake is compared with an older check on the same scale, and the history does not show levels from two different rulers.
// The kind of each question comes from the bank (the ids are stable); a question the bank no longer has counts as typed.
let kindsById: Map<string, { kind: ItemKind; options?: number }> | null = null
const kindsOfBank = () =>
  (kindsById ??= new Map(buildLevelBank([]).map((item) => [item.id, { kind: item.kind ?? 'type', options: item.choices?.length }])))
function rescored(check: LevelCheckResult): LevelCheckResult {
  if (check.scoring === SCORING_VERSION || !Array.isArray(check.answers)) return check
  const answers = check.answers.map((answer) => (answer.kind ? answer : { ...answer, ...kindsOfBank().get(answer.itemId) }))
  return { ...check, answers, ...scoreCheck(answers), scoring: SCORING_VERSION }
}
export const getLevelChecks = (): LevelCheckResult[] => getStoredLevelChecks().map(rescored)

function writeChecks(checks: LevelCheckResult[]) {
  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(checks.sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, MAX_HISTORY)),
    )
  } catch {
    /* storage full or blocked */
  }
  window.dispatchEvent(new Event('spell-sprint:learning-updated'))
}

function saveLevelCheck(result: LevelCheckResult) {
  writeChecks([result, ...getStoredLevelChecks()])
}

// Cloud restore: add checks this device has not seen (by id); never removes any.
export function mergeLevelChecks(incoming: unknown) {
  if (!Array.isArray(incoming)) return 0
  const current = getStoredLevelChecks()
  const known = new Set(current.map((item) => item.id))
  const fresh = incoming.filter(
    (item): item is LevelCheckResult =>
      Boolean(item) && typeof item.id === 'string' && typeof item.completedAt === 'string' && Boolean(item.skills) && !known.has(item.id),
  )
  if (fresh.length) writeChecks([...current, ...fresh])
  return fresh.length
}

export function nextCheckDue(checks = getLevelChecks()) {
  const last = checks[0]
  if (!last) return { due: true, date: null as Date | null }
  const date = new Date(last.completedAt)
  date.setDate(date.getDate() + RECHECK_AFTER_DAYS)
  return { due: date <= new Date(), date }
}

// ---- Plan after a check ----------------------------------------------------------------------
export type PlanStep = {
  title: string
  text: string
  action: { label: string; href?: string; words?: LibraryWord[]; practiceLabel?: string; mode?: PracticeMode }
}

const levelDifficulty = (level: string) => (level === 'A2' ? ['easy'] : level === 'B1' ? ['easy', 'medium'] : ['medium', 'hard'])

export function buildPlan(result: LevelCheckResult): PlanStep[] {
  const words = getAllWords()
  const everyday = words.filter(
    (word) => !['Logistics', 'Warehouse Operations', 'Transport and Trade', 'Supply Chain'].includes(word.topic),
  )
  // Older checks have three skills only; sort just the ones this result measured.
  const bySkill = skillOrder
    .filter((skill) => result.skills[skill])
    .sort((a, b) => (result.skills[a]?.ability ?? START_LEVEL) - (result.skills[b]?.ability ?? START_LEVEL))
  const steps: PlanStep[] = []

  const wrongWordIds = new Set(result.answers.filter((answer) => !answer.correct && answer.wordId).map((answer) => answer.wordId!))
  const wrongCount = result.answers.filter((answer) => !answer.correct).length
  if (wrongWordIds.size) {
    steps.push({
      title: `Review the ${wrongWordIds.size} word${wrongWordIds.size === 1 ? '' : 's'} you missed`,
      text: 'They are already in your review queue. A quick round now fixes them while they are fresh.',
      action: { label: 'Review now', words: words.filter((word) => wrongWordIds.has(word.wordId)), practiceLabel: 'Level check mistakes' },
    })
  } else if (wrongCount) {
    steps.push({
      title: `Look through your ${wrongCount} mistake${wrongCount === 1 ? '' : 's'}`,
      text: 'Each one is saved in My Mistakes with what went wrong.',
      action: { label: 'Open My Mistakes', href: '#my-mistakes' },
    })
  }

  for (const skill of bySkill.slice(0, 2)) {
    const level = result.skills[skill]?.level ?? 'B1'
    if (skill === 'vocabulary') {
      const pool = everyday.filter((word) => levelDifficulty(level).includes(word.difficulty))
      steps.push({
        title: `Grow your vocabulary at ${level}`,
        text: `Words picked for your level, starting with ones you have not practised yet.`,
        action: { label: 'Practise 10 words', words: pickPracticeWords(pool), practiceLabel: `Vocabulary · ${level}` },
      })
    } else if (skill === 'spelling') {
      const traps = everyday.filter((word) => word.library === 'Spelling Traps Core')
      steps.push({
        title: 'Work on spelling patterns',
        text: 'Your spelling mistakes are linked to rules (sign in to track them). Practise the classic traps next.',
        action: {
          label: 'Practise spelling traps',
          words: pickPracticeWords(traps.length ? traps : everyday),
          practiceLabel: 'Spelling traps',
        },
      })
    } else if (skill === 'reading') {
      steps.push({
        title: 'Read more at your level',
        text: 'Proofreading texts are short readings; finding the mistakes makes you read closely.',
        action: { label: 'Open proofreading', href: '#proofreading' },
      })
    } else if (skill === 'listening') {
      const pool = everyday.filter((word) => levelDifficulty(result.skills.listening?.level ?? 'B1').includes(word.difficulty))
      steps.push({
        title: 'Train your ear with dictation',
        text: 'Hear a word, then type it: it trains listening and spelling at once.',
        action: { label: 'Practise 10 words', words: pickPracticeWords(pool), practiceLabel: 'Dictation', mode: 'listen-write' },
      })
    } else {
      steps.push({
        title: 'Strengthen grammar',
        text: 'Grammar rules come with short exercises that repeat what you get wrong.',
        action: { label: 'Open grammar rules', href: '#rules' },
      })
    }
  }
  return steps.slice(0, 3)
}
