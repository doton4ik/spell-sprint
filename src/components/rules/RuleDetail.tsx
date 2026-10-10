import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../icons/Icon'
import { ruleCategoryLabel, rulePriorityLabels, ruleStatusLabels, ruleTypeLabels } from '../../data/ruleCategories'
import { defaultPracticeSettings } from '../../data/practice'
import { getLinkedMistakesForRule, getRuleExamples, getRuleLinkedWords, getRuleRelationships } from '../../services/rulesService'
import { getUserRuleNote, saveUserRuleNote } from '../../services/ruleNotesService'
import { addRuleToRepeatLater, getRuleExercises, markRuleAsMastered } from '../../services/rulePracticeService'
import { loadPracticeSettings } from '../../services/practiceStorage'
import { speakEnglish } from '../../services/speech'
import type { MistakeEvent, Rule, RuleExample, RuleExercise, RuleRelationship, UserRuleProgress } from '../../types/rules'
import { RuleExerciseRunner } from './RuleExerciseRunner'

const MAX_WORDS = 8
// "встреча (по записи), запись (к врачу), приём" -> "встреча (по записи)": the first meaning is enough in a chip.
const shortTranslation = (translation: string) => translation.split(/,\s(?![^(]*\))/)[0]

export type RuleTab = 'rule' | 'examples' | 'practice' | 'notes'
const tabs: Array<{ id: RuleTab; label: string }> = [
  { id: 'rule', label: 'Rule' },
  { id: 'examples', label: 'Examples' },
  { id: 'practice', label: 'Practice' },
  { id: 'notes', label: 'Notes' },
]

type RuleDetailProps = {
  rule: Rule
  rulesById: Map<string, Rule>
  progress: UserRuleProgress | null
  initialTab?: RuleTab
  onBack: () => void
  onProgressChange: (progress: UserRuleProgress) => void
}

type Details = {
  examples: RuleExample[]
  linkedWords: Array<{ wordId: string; word: string; translation?: string }>
  relationships: RuleRelationship[]
  linkedMistakes: MistakeEvent[]
  exercises: RuleExercise[]
  note: string
}

// The selected rule, one thing at a time: Rule, Examples, Practice, Notes. Render it with key={rule.id}
// so switching rules starts fresh (first tab, nothing left over from the last rule).
export function RuleDetail({ rule, rulesById, progress, initialTab = 'rule', onBack, onProgressChange }: RuleDetailProps) {
  const [tab, setTab] = useState<RuleTab>(initialTab)
  const [details, setDetails] = useState<Details | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getRuleExamples(rule.id),
      getRuleLinkedWords(rule.id),
      getRuleRelationships(rule.id),
      getLinkedMistakesForRule(rule.id),
      getRuleExercises(rule.id),
      getUserRuleNote(rule.id),
    ]).then(([examples, linkedWords, relationships, linkedMistakes, exercises, noteRow]) => {
      if (cancelled) return
      setDetails({ examples, linkedWords, relationships, linkedMistakes, exercises, note: noteRow?.note ?? '' })
      setNoteDraft(noteRow?.note ?? '')
    })
    return () => {
      cancelled = true
    }
  }, [rule.id])

  const status = progress?.status ?? 'new'
  const priority = progress?.priority ?? 'practice'
  const streakDays = Math.min(progress?.correctCalendarDays.length ?? 0, 5)
  const accuracy = useMemo(() => {
    if (!progress) return null
    const total = progress.correctCount + progress.mistakeCount
    return total ? Math.round((progress.correctCount / total) * 100) : null
  }, [progress])
  const statusClass = status === 'repeat_later' ? 'review' : status === 'archived' ? 'mastered' : status

  const wrong = details?.examples.filter((example) => example.exampleType === 'incorrect') ?? []
  const right = details?.examples.filter((example) => example.exampleType === 'correct') ?? []
  const exceptions = details?.examples.filter((example) => example.exampleType === 'exception') ?? []

  async function saveNote() {
    setSavingNote(true)
    try {
      await saveUserRuleNote(rule.id, noteDraft)
      setDetails((current) => current && { ...current, note: noteDraft })
    } catch {
      /* the draft stays in the box */
    }
    setSavingNote(false)
  }
  async function act(action: (ruleId: string) => Promise<UserRuleProgress | null>) {
    setBusy(true)
    const next = await action(rule.id)
    if (next) onProgressChange(next)
    setBusy(false)
  }
  function listen() {
    if (rule.ttsText) speakEnglish(rule.ttsText, loadPracticeSettings(defaultPracticeSettings).speechLocale)
  }

  return (
    <article className="rules-detail" aria-label={rule.title}>
      <button className="rules-detail__back" type="button" onClick={onBack}>
        <Icon name="chevron" size={15} /> All rules
      </button>
      <header className="rules-detail__head">
        <div className="rules-detail__meta">
          <span className="rule-family">{ruleCategoryLabel(rule.category)}</span>
          <span className="rule-type-pill">{ruleTypeLabels[rule.ruleType] ?? rule.ruleType}</span>
          {rule.source === 'personal' ? <span className="rule-type-pill rule-type-pill--personal">Personal</span> : null}
        </div>
        <h2>{rule.title}</h2>
      </header>

      <div className="rules-tabs" role="tablist" aria-label="Rule sections">
        {tabs.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'rules-tab rules-tab--active' : 'rules-tab'}
            onClick={() => setTab(item.id)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rules-pane" role="tabpanel">
        {!details ? (
          <p className="rules-pane__loading">Loading…</p>
        ) : tab === 'rule' ? (
          <>
            <p className="rules-pane__lead">{rule.shortExplanation}</p>
            {rule.ttsText ? (
              <button className="quiet-action rules-pane__listen" type="button" onClick={listen}>
                <Icon name="volume" size={14} /> Listen
              </button>
            ) : null}
            {rule.mnemonic ? (
              <div className="memory-cue">
                <Icon name="lightbulb" size={16} />
                <p>
                  <strong>Memory cue</strong>
                  {rule.mnemonic}
                </p>
              </div>
            ) : null}
            {details.linkedWords.length ? (
              <div className="rules-words">
                <strong>Words with this rule</strong>
                <ul>
                  {details.linkedWords.slice(0, MAX_WORDS).map((word) => (
                    <li key={word.wordId} title={word.translation}>
                      {word.word}
                      {word.translation ? <small>{shortTranslation(word.translation)}</small> : null}
                    </li>
                  ))}
                  {details.linkedWords.length > MAX_WORDS ? (
                    <li className="rules-words__more">+{details.linkedWords.length - MAX_WORDS} more</li>
                  ) : null}
                </ul>
              </div>
            ) : null}
            {details.relationships.length ? (
              <p className="rules-pane__line">
                <strong>Related</strong>{' '}
                {details.relationships
                  .map((relationship) => rulesById.get(relationship.relatedRuleId)?.title ?? relationship.relatedRuleId)
                  .join(' · ')}
              </p>
            ) : null}

            <div className="rules-progress">
              <div className="rules-progress__state">
                {progress ? (
                  <>
                    <span className={`learning-status learning-status--${statusClass}`}>{ruleStatusLabels[status]}</span>
                    <span className={`rule-priority rule-priority--${priority}`}>{rulePriorityLabels[priority]}</span>
                  </>
                ) : (
                  <span className="rules-progress__hint">Not started</span>
                )}
                <span className="rules-progress__stat">
                  {progress?.mistakeCount ?? 0} mistake{(progress?.mistakeCount ?? 0) === 1 ? '' : 's'}
                  {accuracy === null ? '' : ` · ${accuracy}% accuracy`}
                </span>
              </div>
              <div className="rule-mastery-bar" aria-label={`${streakDays} of 5 correct days towards mastered`}>
                {[1, 2, 3, 4, 5].map((day) => (
                  <span
                    key={day}
                    className={day <= streakDays ? 'rule-mastery-bar__dot rule-mastery-bar__dot--filled' : 'rule-mastery-bar__dot'}
                  />
                ))}
                <small>{streakDays}/5 correct days</small>
              </div>
              <div className="rules-progress__actions">
                <button
                  className="outline-action"
                  type="button"
                  disabled={busy || status === 'repeat_later'}
                  onClick={() => void act(addRuleToRepeatLater)}
                >
                  <Icon name="calendar" size={15} /> Repeat later
                </button>
                <button
                  className="outline-action"
                  type="button"
                  disabled={busy || status === 'mastered'}
                  onClick={() => void act(markRuleAsMastered)}
                >
                  <Icon name="check" size={15} /> Mark as mastered
                </button>
              </div>
            </div>
          </>
        ) : tab === 'examples' ? (
          <>
            {wrong.length ? (
              <ul className="rules-fixes">
                {wrong.map((example) => (
                  <li key={example.id}>
                    <s>{example.text}</s>
                    <Icon name="arrow" size={14} />
                    <strong>{example.correction ?? rule.title}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
            {right.length ? (
              <ul className="rules-lines">
                {right.map((example) => (
                  <li key={example.id}>
                    <Icon name="check" size={15} /> {example.text}
                  </li>
                ))}
              </ul>
            ) : null}
            {exceptions.length ? (
              <div className="rules-exceptions">
                <strong>Exceptions</strong>
                <ul className="rules-lines">
                  {exceptions.map((example) => (
                    <li key={example.id}>{example.text}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {!wrong.length && !right.length && !exceptions.length ? <p className="rules-pane__loading">No examples yet.</p> : null}
          </>
        ) : tab === 'practice' ? (
          <>
            {details.exercises.length ? (
              <div className="rule-mini-practice">
                <RuleExerciseRunner items={details.exercises.map((exercise) => ({ exercise }))} loop onProgress={onProgressChange} />
              </div>
            ) : (
              <p className="rules-pane__loading">No exercises for this rule yet.</p>
            )}
            {details.linkedMistakes.length ? (
              <div className="rule-linked-mistakes">
                <span>Your related mistakes</span>
                {details.linkedMistakes.slice(0, 3).map((mistake) => (
                  <p key={mistake.id}>
                    <s>{mistake.userAnswer || 'Skipped'}</s> → <strong>{mistake.correctAnswer}</strong>
                  </p>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rule-note">
            <span>Your own memory trick for this rule</span>
            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Write your own memory trick for this rule…"
              rows={4}
            />
            {noteDraft !== details.note ? (
              <button className="outline-action" type="button" disabled={savingNote} onClick={saveNote}>
                {savingNote ? 'Saving…' : 'Save note'}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </article>
  )
}
