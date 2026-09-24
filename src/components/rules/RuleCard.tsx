import { useEffect, useMemo, useRef, useState } from 'react'
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

type RuleCardProps = {
  rule: Rule
  rulesById: Map<string, Rule>
  progress: UserRuleProgress | null
  expanded: boolean
  focused?: boolean
  onToggle: () => void
  onProgressChange: (progress: UserRuleProgress) => void
}

type Details = {
  examples: RuleExample[]
  linkedWords: Array<{ wordId: string; word?: string; translation?: string }>
  relationships: RuleRelationship[]
  linkedMistakes: MistakeEvent[]
  exercises: RuleExercise[]
  note: string
}

// Collapsed: one compact row (title, category, status). Expanded: the full study card. The extra
// data is fetched only the first time a card is opened, so a long list of rules stays cheap.
export function RuleCard({ rule, rulesById, progress, expanded, focused, onToggle, onProgressChange }: RuleCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [details, setDetails] = useState<Details | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (focused) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [focused])

  useEffect(() => {
    if (!expanded || details) return
    let cancelled = false
    Promise.all([getRuleExamples(rule.id), getRuleLinkedWords(rule.id), getRuleRelationships(rule.id), getLinkedMistakesForRule(rule.id), getRuleExercises(rule.id), getUserRuleNote(rule.id)])
      .then(([examples, linkedWords, relationships, linkedMistakes, exercises, noteRow]) => {
        if (cancelled) return
        setDetails({ examples, linkedWords, relationships, linkedMistakes, exercises, note: noteRow?.note ?? '' })
        setNoteDraft(noteRow?.note ?? '')
      })
    return () => { cancelled = true }
  }, [expanded, rule.id, details])

  const status = progress?.status ?? 'new'
  const priority = progress?.priority ?? 'practice'
  const streakDays = Math.min(progress?.correctCalendarDays.length ?? 0, 5)
  const accuracy = useMemo(() => {
    if (!progress) return null
    const total = progress.correctCount + progress.mistakeCount
    return total ? Math.round((progress.correctCount / total) * 100) : null
  }, [progress])
  const statusClass = status === 'repeat_later' ? 'review' : status === 'archived' ? 'mastered' : status

  const correctExamples = details?.examples.filter((example) => example.exampleType === 'correct') ?? []
  const incorrectExamples = details?.examples.filter((example) => example.exampleType === 'incorrect') ?? []
  const exceptionExamples = details?.examples.filter((example) => example.exampleType === 'exception') ?? []

  async function saveNote() {
    setSavingNote(true)
    try { await saveUserRuleNote(rule.id, noteDraft); setDetails((current) => current && { ...current, note: noteDraft }) } catch { /* the draft stays in the box */ }
    setSavingNote(false)
  }
  async function act(action: (ruleId: string) => Promise<UserRuleProgress | null>) {
    setBusy(true)
    const next = await action(rule.id)
    if (next) onProgressChange(next)
    setBusy(false)
  }
  function listen() { if (rule.ttsText) speakEnglish(rule.ttsText, loadPracticeSettings(defaultPracticeSettings).speechLocale) }

  return (
    <article className={`rule-card-v2${expanded ? ' rule-card-v2--open' : ''}${focused ? ' rule-card-v2--focused' : ''}`} ref={cardRef}>
      <button className="rule-card-v2__head" type="button" onClick={onToggle} aria-expanded={expanded}>
        <span className="rule-card-v2__badges">
          <span className="rule-family">{ruleCategoryLabel(rule.category)}</span>
          {rule.source === 'personal' ? <span className="rule-type-pill rule-type-pill--personal">Personal</span> : null}
        </span>
        <span className="rule-card-v2__title">{rule.title}</span>
        <span className="rule-card-v2__summary">{rule.shortExplanation}</span>
        <span className="rule-card-v2__state">
          {progress ? <><span className={`learning-status learning-status--${statusClass}`}>{ruleStatusLabels[status]}</span><span className={`rule-priority rule-priority--${priority}`}>{rulePriorityLabels[priority]}</span></> : <span className="rule-card-v2__hint">Not started</span>}
          <span className="rule-card-v2__chevron" aria-hidden="true"><Icon name="chevron" size={16} /></span>
        </span>
      </button>

      {expanded ? (
        <div className="rule-card-v2__body">
          {!details ? <p className="rule-card-v2__loading">Loading…</p> : (
            <>
              <div className="rule-card-v2__col">
                <div className="rule-card-v2__typeline"><span className="rule-type-pill">{ruleTypeLabels[rule.ruleType] ?? rule.ruleType}</span>{rule.ttsText ? <button className="quiet-action" type="button" onClick={listen}><Icon name="volume" size={14} /> Listen</button> : null}</div>

                {incorrectExamples.slice(0, 2).map((example) => (
                  <div className="wrong-right" key={example.id}>
                    <div><span>Wrong</span><s>{example.text}</s></div>
                    <Icon name="arrow" size={16} />
                    <div><span>Correct</span><strong>{example.correction ?? rule.title}</strong></div>
                  </div>
                ))}
                {correctExamples.length ? <div className="rule-examples"><span>More examples</span><p>{correctExamples.map((example) => example.text).join(' · ')}</p></div> : null}
                {exceptionExamples.length ? <div className="rule-examples rule-examples--exception"><span>Exceptions</span><p>{exceptionExamples.map((example) => example.text).join(' · ')}</p></div> : null}
                {rule.mnemonic ? <div className="memory-cue"><Icon name="lightbulb" size={16} /><p><strong>Memory cue</strong>{rule.mnemonic}</p></div> : null}
                {details.linkedWords.length ? <div className="rule-linked-words"><span>Linked words</span><p>{details.linkedWords.map((word) => word.translation ? `${word.word ?? word.wordId} (${word.translation})` : word.word ?? word.wordId).join(' · ')}</p></div> : null}
                {details.relationships.length ? <div className="rule-linked-words"><span>Related rules</span><p>{details.relationships.map((relationship) => rulesById.get(relationship.relatedRuleId)?.title ?? relationship.relatedRuleId).join(' · ')}</p></div> : null}
              </div>

              <div className="rule-card-v2__col">
                <div className="rule-progress-strip">
                  <span className="rule-progress-strip__stat">{progress?.mistakeCount ?? 0} mistake{(progress?.mistakeCount ?? 0) === 1 ? '' : 's'}</span>
                  <span className="rule-progress-strip__stat">{accuracy === null ? 'No practice yet' : `${accuracy}% accuracy`}</span>
                </div>
                <div className="rule-mastery-bar" aria-label={`${streakDays} of 5 correct days towards mastered`}>
                  {[1, 2, 3, 4, 5].map((day) => <span key={day} className={day <= streakDays ? 'rule-mastery-bar__dot rule-mastery-bar__dot--filled' : 'rule-mastery-bar__dot'} />)}
                  <small>{streakDays}/5 correct days</small>
                </div>

                {details.linkedMistakes.length ? (
                  <div className="rule-linked-mistakes"><span>Your related mistakes</span>
                    {details.linkedMistakes.slice(0, 3).map((mistake) => <p key={mistake.id}><s>{mistake.userAnswer || 'Skipped'}</s> → <strong>{mistake.correctAnswer}</strong></p>)}
                  </div>
                ) : null}

                {details.exercises.length ? <div className="rule-mini-practice"><RuleExerciseRunner items={details.exercises.map((exercise) => ({ exercise }))} loop onProgress={onProgressChange} /></div> : null}

                <div className="rule-note">
                  <span>Personal note / mnemonic</span>
                  <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write your own memory trick for this rule…" rows={2} />
                  {noteDraft !== details.note ? <button className="quiet-action" type="button" disabled={savingNote} onClick={saveNote}>{savingNote ? 'Saving…' : 'Save note'}</button> : null}
                </div>

                <div className="rule-card-v2__actions">
                  <button className="rule-save" type="button" disabled={busy || status === 'repeat_later'} onClick={() => void act(addRuleToRepeatLater)}><Icon name="calendar" size={15} /> Add to Repeat later</button>
                  <button className="rule-save rule-save--active" type="button" disabled={busy || status === 'mastered'} onClick={() => void act(markRuleAsMastered)}><Icon name="check" size={15} /> Mark as mastered</button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </article>
  )
}
