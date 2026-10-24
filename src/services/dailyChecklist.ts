import type { PracticeAttempt } from '../types/practice'
import { localDayKey } from './dateKeys'
import { getPairAttempts } from './pairs'
import { getPracticeAttempts } from './practiceStorage'
import { getProfile, type DailyActivities, type Profile } from './profileStorage'
import { getProofreadingDone } from './proofreadingDone'
import { getSprintRounds } from './sprint'

// The plan for one day, from the minutes the learner chose and the kinds of practice they switched on.
// The targets are FIXED by those settings (they do not move while the learner answers), and "done" is counted from
// what was really answered today, so the checklist can honestly say what was done and what is left.

export type StepId = 'words' | 'dictation' | 'proofreading' | 'pairs' | 'sprint'
export type PlanStep = { id: StepId; target: number; minutes: number }

// One unit of each kind of practice: its name, how long it takes (minutes) and where it starts.
export const STEP_INFO: Record<StepId, { title: string; one: string; many: string; minutesEach: number; href: string }> = {
  words: { title: 'Words', one: 'word', many: 'words', minutesEach: 0.5, href: '#practice' },
  dictation: { title: 'Dictation', one: 'word', many: 'words', minutesEach: 0.6, href: '#practice' },
  proofreading: { title: 'Proofreading', one: 'text', many: 'texts', minutesEach: 3.5, href: '#proofreading' },
  pairs: { title: 'Word pairs', one: 'question', many: 'questions', minutesEach: 0.4, href: '#pairs' },
  sprint: { title: 'Sprint', one: 'round', many: 'rounds', minutesEach: 1.5, href: '#sprint' },
}

// At most this share of the day goes to everything except words, so the words (the core) are never squeezed out.
const OTHER_SHARE = 0.55
// How many NEW words a day can bring in (the rest of the word slots are reviews and extra practice): every new word
// that is not known on sight comes back tomorrow, so a long day must not become a pile of reviews.
export function freshCapFor(minutes: number) {
  return minutes <= 5 ? 4 : minutes <= 10 ? 6 : minutes <= 15 ? 8 : minutes <= 30 ? 12 : 15
}

// Extra kinds of practice in the order they are added while they still fit; each starts at a number of minutes.
function candidates(minutes: number, on: DailyActivities): Array<{ id: Exclude<StepId, 'words'>; target: number }> {
  return [
    ...(on.proofreading && minutes >= 10 ? [{ id: 'proofreading' as const, target: minutes >= 50 ? 3 : minutes >= 30 ? 2 : 1 }] : []),
    ...(on.pairs && minutes >= 15 ? [{ id: 'pairs' as const, target: minutes >= 50 ? 20 : 10 }] : []),
    ...(on.sprint && minutes >= 30 ? [{ id: 'sprint' as const, target: minutes >= 50 ? 2 : 1 }] : []),
    ...(on.dictation && minutes >= 15 ? [{ id: 'dictation' as const, target: minutes >= 50 ? 10 : 5 }] : []),
  ]
}

const round1 = (value: number) => Math.round(value * 10) / 10

export function planSteps(minutes: number, on: DailyActivities): PlanStep[] {
  const others: PlanStep[] = []
  let used = 0
  for (const item of candidates(minutes, on)) {
    const cost = item.target * STEP_INFO[item.id].minutesEach
    if (used + cost > minutes * OTHER_SHARE) continue
    used += cost
    others.push({ ...item, minutes: round1(cost) })
  }
  const words = Math.max(6, Math.round((minutes - used) / STEP_INFO.words.minutesEach))
  return [{ id: 'words', target: words, minutes: round1(words * STEP_INFO.words.minutesEach) }, ...others]
}

export const wordsTargetFor = (minutes: number, on: DailyActivities) => planSteps(minutes, on)[0].target

// "13 words · 1 text": what a number of minutes holds. Shown next to each option in the settings.
export function describePlan(minutes: number, on: DailyActivities) {
  return planSteps(minutes, on)
    .map((step) => {
      const unit = step.target === 1 ? STEP_INFO[step.id].one : STEP_INFO[step.id].many
      return step.id === 'dictation' ? `dictation of ${step.target} words` : `${step.target} ${unit}`
    })
    .join(' · ')
}

export type Counts = Record<StepId, number>

// An answer to a word of the library counts as "words" (or "dictation"); proofreading and the level check have their own place.
const ownAttempt = (attempt: PracticeAttempt) => attempt.library !== 'Proofreading' && attempt.library !== 'Level check'
export const wordsDoneOn = (day: string, attempts: readonly PracticeAttempt[]) =>
  attempts.filter((attempt) => localDayKey(attempt.createdAt) === day && ownAttempt(attempt) && attempt.attemptMode !== 'listen-write')
    .length

// The words answered today (newest first, without repeats): the dictation of the day when the word list of the plan is used up.
export function wordIdsPractisedOn(day: string, limit: number, attempts: readonly PracticeAttempt[] = getPracticeAttempts()) {
  const ids: string[] = []
  for (const attempt of [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    if (attempt.wordId && ownAttempt(attempt) && localDayKey(attempt.createdAt) === day && !ids.includes(attempt.wordId))
      ids.push(attempt.wordId)
  return ids.slice(0, limit)
}

// What was really done on a day, from data that already syncs between devices (practice answers, pair answers, sprint rounds).
export function countDay(
  day: string,
  data: {
    attempts: readonly PracticeAttempt[]
    pairAnswers: readonly { createdAt: string }[]
    sprintRounds: readonly { date: string }[]
    proofreadingTexts: number
  },
): Counts {
  const today = data.attempts.filter((attempt) => localDayKey(attempt.createdAt) === day)
  return {
    words: wordsDoneOn(day, data.attempts),
    dictation: today.filter((attempt) => ownAttempt(attempt) && attempt.attemptMode === 'listen-write').length,
    proofreading: data.proofreadingTexts,
    pairs: data.pairAnswers.filter((item) => localDayKey(item.createdAt) === day).length,
    sprint: data.sprintRounds.filter((round) => localDayKey(round.date) === day).length,
  }
}

export type StepStatus = 'done' | 'partly' | 'todo'
export type ChecklistStep = PlanStep & { done: number; left: number; status: StepStatus; title: string }
export type Checklist = {
  steps: ChecklistStep[]
  chosenMinutes: number // what the settings ask for; minutes can be less when the day has fewer words to offer
  minutes: number
  minutesDone: number
  percent: number
  allDone: boolean
  next: ChecklistStep | null // the first step that is not finished
}

// wordsAvailable: how many words the word list of the day can still offer. A day can offer fewer than the settings ask for
// (the number of new words is capped and there may be nothing to review yet); the words step then ends when they are answered
// instead of staying "N left" for ever. Nothing offered and nothing done (empty libraries) keeps the full target.
export function buildChecklistFrom(
  profile: Pick<Profile, 'dailyMinutes' | 'activities'>,
  counts: Counts,
  wordsAvailable?: number,
): Checklist {
  const steps = planSteps(profile.dailyMinutes, profile.activities).map((planned) => {
    let step = planned
    if (step.id === 'words' && wordsAvailable !== undefined && (wordsAvailable > 0 || counts.words > 0)) {
      const target = Math.min(step.target, counts.words + wordsAvailable)
      step = { ...step, target, minutes: round1(target * STEP_INFO.words.minutesEach) }
    }
    const done = counts[step.id]
    const status: StepStatus = done >= step.target ? 'done' : done > 0 ? 'partly' : 'todo'
    return { ...step, done, left: Math.max(0, step.target - done), status, title: STEP_INFO[step.id].title }
  })
  const total = steps.reduce((sum, step) => sum + step.minutes, 0)
  const minutesDone = steps.reduce((sum, step) => sum + step.minutes * Math.min(1, step.done / step.target), 0)
  return {
    steps,
    chosenMinutes: profile.dailyMinutes,
    minutes: round1(total),
    minutesDone: round1(minutesDone),
    percent: total ? Math.min(100, Math.round((minutesDone / total) * 100)) : 0,
    allDone: steps.every((step) => step.status === 'done'),
    next: steps.find((step) => step.status !== 'done') ?? null,
  }
}

type DaySource = {
  attempts: readonly PracticeAttempt[]
  pairAnswers: readonly { createdAt: string }[]
  sprintRounds: readonly { date: string }[]
  proofreadingDone: readonly { createdAt: string }[]
}

export function readDaySource(): DaySource {
  return {
    attempts: getPracticeAttempts(),
    pairAnswers: getPairAttempts(),
    sprintRounds: getSprintRounds(),
    proofreadingDone: getProofreadingDone(),
  }
}

// The plan of one day with what was done on it. For a past day only the targets of today's settings are known.
export function checklistForDay(day: string, source: DaySource, wordsAvailable?: number): Checklist {
  const doneTexts = source.proofreadingDone.filter((item) => localDayKey(item.createdAt) === day).length
  // A proofreading text finished on another device leaves its answers here but not the "finished" note.
  const proofreadingTexts =
    doneTexts || source.attempts.some((attempt) => attempt.library === 'Proofreading' && localDayKey(attempt.createdAt) === day)
      ? Math.max(1, doneTexts)
      : 0
  return buildChecklistFrom(
    getProfile(),
    countDay(day, { attempts: source.attempts, pairAnswers: source.pairAnswers, sprintRounds: source.sprintRounds, proofreadingTexts }),
    wordsAvailable,
  )
}

export const buildChecklist = (wordsAvailable?: number, now = new Date()): Checklist =>
  checklistForDay(localDayKey(now), readDaySource(), wordsAvailable)
