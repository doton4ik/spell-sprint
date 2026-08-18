import { personalMistakeSeeds } from '../data/personalMistakes'
import { loadDiagnosticResult } from './diagnosticStorage'
import { getPracticeAttempts } from './practiceStorage'

export type AnalyticsTopic = { topic: string; score: number; status: 'Strong' | 'Developing' | 'Needs focus' }
export type DailyActivity = { label: string; completed: number; target: number; isToday?: boolean }

const fallbackTopics: AnalyticsTopic[] = [
  { topic: 'Logistics English', score: 82, status: 'Strong' },
  { topic: 'Business English', score: 68, status: 'Developing' },
  { topic: 'General vocabulary', score: 64, status: 'Developing' },
  { topic: 'Spelling patterns', score: 43, status: 'Needs focus' },
]

const blockTopics: Record<string, string> = {
  spelling: 'Spelling patterns', vocabulary: 'General vocabulary', grammar: 'Grammar', business: 'Business English', logistics: 'Logistics English', production: 'Short production',
}

function dayKey(date: Date) { return date.toISOString().slice(0, 10) }
function titleForDay(date: Date) { return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date) }
function statusFor(score: number): AnalyticsTopic['status'] {
  return score >= 80 ? 'Strong' : score >= 60 ? 'Developing' : 'Needs focus'
}

export function getLearningAnalytics() {
  const attempts = getPracticeAttempts()
  const diagnostic = loadDiagnosticResult()
  const diagnosticAnswers = diagnostic?.answers ?? []
  const trackedAttempts = attempts.length + diagnosticAnswers.length
  const correct = attempts.filter((item) => item.isCorrect).length + diagnosticAnswers.filter((item) => item.isCorrect).length
  const mistakes = attempts.filter((item) => !item.isCorrect).length + diagnosticAnswers.filter((item) => !item.isCorrect).length
  const accuracy = trackedAttempts ? Math.round((correct / trackedAttempts) * 100) : 76

  const topicStats = new Map<string, { correct: number; total: number }>()
  for (const attempt of attempts) {
    const current = topicStats.get(attempt.topic) ?? { correct: 0, total: 0 }
    current.total += 1; current.correct += Number(attempt.isCorrect); topicStats.set(attempt.topic, current)
  }
  for (const answer of diagnosticAnswers) {
    const topic = blockTopics[answer.blockId]
    const current = topicStats.get(topic) ?? { correct: 0, total: 0 }
    current.total += 1; current.correct += Number(answer.isCorrect); topicStats.set(topic, current)
  }
  const topics: AnalyticsTopic[] = topicStats.size
    ? [...topicStats.entries()].map(([topic, value]) => {
      const score = Math.round((value.correct / value.total) * 100)
      return { topic, score, status: statusFor(score) }
    }).sort((a, b) => a.score - b.score).slice(0, 5)
    : fallbackTopics

  const daily: DailyActivity[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index))
    const key = dayKey(date)
    const practiceCount = attempts.filter((item) => item.createdAt.slice(0, 10) === key).length
    const diagnosticCount = diagnostic?.completedAt.slice(0, 10) === key ? diagnosticAnswers.length : 0
    return { label: titleForDay(date), completed: practiceCount + diagnosticCount, target: 12, isToday: index === 6 }
  })

  const categoryCount = new Map<string, number>()
  for (const item of attempts.filter((entry) => !entry.isCorrect)) categoryCount.set(item.errorCategory, (categoryCount.get(item.errorCategory) ?? 0) + 1)
  const mainCategory = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Spelling patterns'
  const weakTopic = topics.find((item) => item.status === 'Needs focus') ?? topics[topics.length - 1]
  const recent = attempts.filter((item) => !item.isCorrect).slice(0, 3).map((item) => ({ submitted: item.userAnswer || 'Skipped', correct: item.correctAnswer, category: item.errorCategory, when: new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt)) }))
  const fallbackMistakes = personalMistakeSeeds.slice(0, 3).map((item) => ({ submitted: item.userVersion, correct: item.word, category: item.category, when: 'Personal baseline' }))

  return {
    accuracy, totalAttempts: trackedAttempts || 34, mistakes: mistakes || personalMistakeSeeds.length, repeatLater: attempts.filter((item) => item.needsReview && !item.isCorrect).length || personalMistakeSeeds.length,
    topics, daily, weeklyTotal: daily.reduce((sum, item) => sum + item.completed, 0), weakTopic, mainCategory, recent: recent.length ? recent : fallbackMistakes,
    recommendation: weakTopic?.topic ?? 'Business & Logistics', hasLiveData: trackedAttempts > 0,
  }
}
