import { getPracticeAttempts } from './practiceStorage'
import { getMistakeEntries, getReviewEntries } from './learningData'
import { localDayKey } from './dateKeys'
import { getProfile } from './profileStorage'

export type AnalyticsTopic = { topic: string; score: number; correct: number; total: number; status: 'Strong' | 'Developing' | 'Needs focus' | 'Preliminary' }
export type DailyActivity = { label: string; completed: number; target: number; isToday?: boolean }
export type AccuracyStat = { percent: number | null; correct: number; total: number; previousPercent: number | null; enoughData: boolean }

// Below these counts a percentage says more about luck than about the learner.
export const MIN_ANSWERS_FOR_ACCURACY = 10
export const MIN_ANSWERS_FOR_TOPIC = 8
const WINDOW_DAYS = 30

function titleForDay(date: Date) { return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date) }
function statusFor(score: number, total: number): AnalyticsTopic['status'] {
  if (total < MIN_ANSWERS_FOR_TOPIC) return 'Preliminary'
  return score >= 80 ? 'Strong' : score >= 60 ? 'Developing' : 'Needs focus'
}
const daysAgo = (days: number) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - days); return date.toISOString() }
const percent = (correct: number, total: number) => total ? Math.round((correct / total) * 100) : null

// One source for every number here: the practice attempt log (practice, reviews and level checks
// all write to it), so Dashboard, My Mistakes and Topics count the same answers.
export function getLearningAnalytics() {
  const attempts = getPracticeAttempts()
  const mistakes = attempts.filter((item) => !item.isCorrect).length

  const since = daysAgo(WINDOW_DAYS - 1)
  const previousSince = daysAgo(WINDOW_DAYS * 2 - 1)
  const recentWindow = attempts.filter((item) => item.createdAt >= since)
  const previousWindow = attempts.filter((item) => item.createdAt >= previousSince && item.createdAt < since)
  const recentCorrect = recentWindow.filter((item) => item.isCorrect).length
  const previousCorrect = previousWindow.filter((item) => item.isCorrect).length
  const accuracy: AccuracyStat = {
    percent: percent(recentCorrect, recentWindow.length), correct: recentCorrect, total: recentWindow.length,
    previousPercent: previousWindow.length >= MIN_ANSWERS_FOR_ACCURACY ? percent(previousCorrect, previousWindow.length) : null,
    enoughData: recentWindow.length >= MIN_ANSWERS_FOR_ACCURACY,
  }

  const topicStats = new Map<string, { correct: number; total: number }>()
  for (const attempt of recentWindow) {
    const current = topicStats.get(attempt.topic) ?? { correct: 0, total: 0 }
    current.total += 1; current.correct += Number(attempt.isCorrect); topicStats.set(attempt.topic, current)
  }
  // Weakest confident topics first; topics with too few answers go last and are labelled as such.
  const topics: AnalyticsTopic[] = [...topicStats.entries()]
    .map(([topic, value]) => { const score = percent(value.correct, value.total) ?? 0; return { topic, score, ...value, status: statusFor(score, value.total) } })
    .sort((a, b) => Number(a.status === 'Preliminary') - Number(b.status === 'Preliminary') || a.score - b.score)
    .slice(0, 5)

  const goal = getProfile().dailyGoal
  const daily: DailyActivity[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index))
    const key = localDayKey(date)
    return { label: titleForDay(date), completed: attempts.filter((item) => localDayKey(item.createdAt) === key).length, target: goal, isToday: index === 6 }
  })

  const categoryCount = new Map<string, number>()
  for (const item of recentWindow.filter((entry) => !entry.isCorrect)) categoryCount.set(item.errorCategory, (categoryCount.get(item.errorCategory) ?? 0) + 1)
  const mainCategory = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Spelling patterns'
  const weakTopic = topics.find((item) => item.status === 'Needs focus') ?? topics.find((item) => item.status !== 'Preliminary')
  const recent = attempts.filter((item) => !item.isCorrect).slice(0, 3).map((item) => ({ submitted: item.userAnswer || 'Skipped', correct: item.correctAnswer, category: item.errorCategory, when: new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt)) }))
  const mistakeEntries = getMistakeEntries()

  return {
    accuracy, totalAttempts: attempts.length, mistakes, repeatLater: getReviewEntries().length,
    openMistakes: mistakeEntries.filter((entry) => entry.status !== 'mastered').length,
    difficultWords: mistakeEntries.filter((entry) => entry.status === 'difficult').length,
    topics, daily, weeklyTotal: daily.reduce((sum, item) => sum + item.completed, 0), weakTopic, mainCategory, recent,
    recommendation: weakTopic?.topic ?? 'Practice', hasLiveData: attempts.length > 0,
  }
}
