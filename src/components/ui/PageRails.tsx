import { useMemo, type ReactNode } from 'react'
import { cefrLevels } from '../../data/libraryTopics'
import { setPendingPracticeSelection } from '../../services/libraryPractice'
import { getAllWords } from '../../services/libraryStorage'
import { getMistakeEntries, getRuleReviewIds, isDueToday } from '../../services/learningData'
import { pairStatuses } from '../../services/pairs'
import { getPracticeAttempts } from '../../services/practiceStorage'
import { getSprintRounds } from '../../services/sprint'
import { getTopicStats } from '../../services/topicStats'

// Wide screens only (CSS): a few quiet cards in the margin beside a page, about what that page is for. A rail with
// nothing to say is not drawn, and nothing here repeats what the page itself already shows.
function Rail({ children, label }: { children: ReactNode; label: string }) {
  return (
    <aside className="page-rail" aria-label={label}>
      <div className="page-rail__stick">{children}</div>
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

// Pairs: the pairs waiting for a review today (the page itself shows the numbers and the trickiest pairs).
export function PairsRail() {
  const due = useMemo(() => pairStatuses().filter((item) => item.due && item.state !== 'new'), [])
  if (!due.length) return null
  return (
    <Rail label="Pairs to review">
      <RailCard label="To repeat today">
        {due.slice(0, 6).map((item) => (
          <p className="rail-row" key={item.pair.id}>
            <span>{item.pair.words.join(' / ')}</span>
          </p>
        ))}
        {due.length > 6 ? <p className="rail-row rail-row--note">and {due.length - 6} more</p> : null}
      </RailCard>
    </Rail>
  )
}

// Libraries: the words in practice by level, and how many are put aside.
export function LibrariesRail() {
  const counts = useMemo(() => {
    const words = getAllWords()
    return {
      total: words.length,
      byLevel: cefrLevels.map((level) => [level, words.filter((word) => word.level === level).length] as const),
    }
  }, [])
  if (!counts.total) return null
  return (
    <Rail label="Words by level">
      <RailCard label="In practice, by level">
        {counts.byLevel.map(([level, count]) => (
          <RailRow key={level} name={level} value={String(count)} />
        ))}
      </RailCard>
    </Rail>
  )
}

// My mistakes: where the open mistakes stand today.
export function MistakesRail() {
  const status = useMemo(() => {
    const open = getMistakeEntries().filter((entry) => !entry.archived)
    return {
      due: open.filter(isDueToday).length,
      difficult: open.filter((entry) => entry.status === 'difficult').length,
      learning: open.filter((entry) => entry.status === 'learning' || entry.status === 'review').length,
      mastered: open.filter((entry) => entry.status === 'mastered').length,
    }
  }, [])
  if (!status.due && !status.difficult && !status.learning && !status.mastered) return null
  return (
    <Rail label="Mistakes status">
      <RailCard label="Where you stand">
        <RailRow name="To review today" value={String(status.due)} />
        <RailRow name="Difficult" value={String(status.difficult)} />
        <RailRow name="Being learned" value={String(status.learning)} />
        <RailRow name="Mastered" value={String(status.mastered)} />
      </RailCard>
    </Rail>
  )
}

// Rules: how a rule gets into your practice, and how many you have marked for review.
export function RulesRail() {
  const marked = useMemo(() => getRuleReviewIds().length, [])
  return (
    <Rail label="About rules practice">
      <RailCard label="How it works">
        <p className="rail-note">Open a rule, read it, then try its exercises. A rule you miss comes back in your review.</p>
        <RailRow name="Marked for review" value={String(marked)} />
      </RailCard>
    </Rail>
  )
}

// Level check: what a check is, so the choice between the full one and the quick one is clear.
export function LevelRail() {
  return (
    <Rail label="About the level check">
      <RailCard label="How it works">
        <RailRow name="Full check" value="30 questions" />
        <RailRow name="Quick check" value="16 questions" />
        <p className="rail-note">Questions get harder or easier with your answers. Your result and plan are kept in the history.</p>
      </RailCard>
    </Rail>
  )
}
