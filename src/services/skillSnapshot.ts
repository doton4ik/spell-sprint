import type { Skill } from '../data/levelCheckBank'
import type { PracticeAttempt, PracticeTaskType } from '../types/practice'
import { getPracticeAttempts } from './practiceStorage'

// "Where you stand today" on the Level check page: how the last 30 days of real answers split across
// the three skills. It is what the learner already did, not a test, so it needs no questions.
export type SkillSnapshot = { skill: Skill; percent: number | null; answers: number }

export const SNAPSHOT_DAYS = 30
export const MIN_SNAPSHOT_ANSWERS = 8 // below this a percentage would mostly be luck

const skillOfTask: Record<PracticeTaskType, Skill> = {
  'correct-spelling': 'spelling',
  'translate-ru-en': 'vocabulary',
  'translate-en-ru': 'vocabulary',
  'correct-sentence': 'grammar',
}

const skills: Skill[] = ['spelling', 'vocabulary', 'grammar']

export function skillSnapshot(attempts: readonly PracticeAttempt[], now = Date.now()): SkillSnapshot[] {
  const since = new Date(now - SNAPSHOT_DAYS * 86400000).toISOString()
  const recent = attempts.filter((attempt) => !attempt.introduced && !attempt.wasSkipped && attempt.createdAt >= since)
  return skills.map((skill) => {
    const own = recent.filter((attempt) => skillOfTask[attempt.taskType] === skill)
    const right = own.filter((attempt) => attempt.isCorrect).length
    return { skill, answers: own.length, percent: own.length >= MIN_SNAPSHOT_ANSWERS ? Math.round((right / own.length) * 100) : null }
  })
}

export const getSkillSnapshot = () => skillSnapshot(getPracticeAttempts())
