import { useMemo, type ReactNode } from 'react'
import { getStreak } from '../../services/dailyPlan'
import { getLearningAnalytics } from '../../services/learningAnalytics'
import { setPendingPracticeSelection } from '../../services/libraryPractice'
import { pairStatuses } from '../../services/pairs'
import { getPracticeAttempts } from '../../services/practiceStorage'
import { getSprintRounds } from '../../services/sprint'
import { getTopicStats } from '../../services/topicStats'

// Wide screens only (CSS): a few quiet cards in the margin beside a page, about what that page is for. A rail with
// nothing to say is not drawn, and nothing here repeats what the page itself already shows.
function Rail({ children, label }: { children: ReactNode; label: string }) {
  return (
    <aside className="page-rail" aria-label={label}>
      {children}
    </aside>
  )
}

function RailCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="rail-card">
      <span className="rail-card__label">{label}</span>
      {children}
    </section>
  )
}

function RailRow({ name, value }: { name: string; value: string }) {
  return (
    <p className="rail-row">
      <span>{name}</span>
      <strong>{value}</strong>
    </p>
  )
}

// Sprint: the words that take you longest to type, over the last rounds.
export function SprintRail() {
  const slow = useMemo(() => {
    const byWord = new Map<string, { total: number; count: number }>()
    for (const round of getSprintRounds().slice(0, 10))
      for (const answer of round.answers) {
        if (!answer.correct || answer.typeMs <= 0) continue
        const entry = byWord.get(answer.word) ?? { total: 0, count: 0 }
        entry.total += answer.typeMs
        entry.count += 1
        byWord.set(answer.word, entry)
      }
    return [...byWord.entries()]
      .map(([word, { total, count }]) => ({ word, seconds: total / count / 1000 }))
      .sort((a, b) => b.seconds / b.word.length - a.seconds / a.word.length)
      .slice(0, 5)
  }, [])
  if (slow.length < 3) return null
  return (
    <Rail label="Sprint details">
      <RailCard label="Slowest to type">
        {slow.map((item) => (
          <RailRow key={item.word} name={item.word} value={`${item.seconds.toFixed(1)} s`} />
        ))}
      </RailCard>
    </Rail>
  )
}

// Find the mistakes: the kinds of mistake you miss most often in the texts.
export function ProofreadingRail() {
  const weak = useMemo(() => {
    const counts = new Map<string, number>()
    for (const attempt of getPracticeAttempts()) {
      if (attempt.isCorrect || attempt.library !== 'Proofreading') continue
      const type = /^Grammar · (.+)$/.exec(attempt.errorCategory)?.[1]
      if (type) counts.set(type, (counts.get(type) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [])
  if (!weak.length) return null
  return (
    <Rail label="Mistake types">
      <RailCard label="Missed most often">
        {weak.map(([type, count]) => (
          <RailRow key={type} name={type} value={`${count}×`} />
        ))}
      </RailCard>
    </Rail>
  )
}

// Pairs: how many pairs are new, being learned and learned, and how many are due.
export function PairsRail() {
  const status = useMemo(() => {
    const all = pairStatuses()
    return {
      total: all.length,
      learning: all.filter((item) => item.state === 'learning').length,
      mastered: all.filter((item) => item.state === 'mastered').length,
      due: all.filter((item) => item.due && item.state !== 'new').length,
    }
  }, [])
  if (!status.learning && !status.mastered) return null
  return (
    <Rail label="Pairs progress">
      <RailCard label="Your pairs">
        <RailRow name="Learned" value={`${status.mastered} of ${status.total}`} />
        <RailRow name="Being learned" value={String(status.learning)} />
        <RailRow name="To repeat today" value={String(status.due)} />
      </RailCard>
    </Rail>
  )
}

// Topics: the topics with words waiting for a review, each one tap from practice.
export function TopicsRail() {
  const due = useMemo(
    () =>
      getTopicStats()
        .filter((topic) => topic.due > 0)
        .sort((a, b) => b.due - a.due)
        .slice(0, 5),
    [],
  )
  if (!due.length) return null
  return (
    <Rail label="Topics to review">
      <RailCard label="Waiting for review">
        {due.map((topic) => (
          <button
            className="rail-row rail-row--button"
            type="button"
            key={topic.topic}
            onClick={() => {
              setPendingPracticeSelection({
                wordIds: topic.words.map((word) => word.wordId),
                label: `Topic: ${topic.topic}`,
                mode: 'write-en',
              })
              window.location.hash = 'practice'
            }}
          >
            <span>{topic.topic}</span>
            <strong>{topic.due}</strong>
          </button>
        ))}
      </RailCard>
    </Rail>
  )
}

// Settings: where you are, in a few numbers.
export function SettingsRail() {
  const stats = useMemo(() => {
    const analytics = getLearningAnalytics()
    return { analytics, streak: getStreak().streak }
  }, [])
  if (!stats.analytics.totalAttempts) return null
  const { accuracy } = stats.analytics
  return (
    <Rail label="At a glance">
      <RailCard label="At a glance">
        <RailRow name="Day streak" value={String(stats.streak)} />
        <RailRow name="Answers so far" value={String(stats.analytics.totalAttempts)} />
        <RailRow name="Words to master" value={String(stats.analytics.openMistakes)} />
        {accuracy.percent !== null ? <RailRow name="Accuracy, 30 days" value={`${accuracy.percent}%`} /> : null}
      </RailCard>
    </Rail>
  )
}
