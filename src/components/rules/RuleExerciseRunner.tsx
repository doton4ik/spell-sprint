import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons/Icon'
import { AnswerDiff } from '../practice/AnswerDiff'
import { recordRulePracticeAttempt } from '../../services/rulePracticeService'
import type { RuleExercise, RuleExerciseType, UserRuleProgress } from '../../types/rules'

export type RunnerItem = { exercise: RuleExercise; ruleTitle?: string }

type RuleExerciseRunnerProps = {
  items: RunnerItem[]
  // Keep going round the same exercises (used inside one rule's card); otherwise finish after the last one.
  loop?: boolean
  showRuleTitle?: boolean
  onProgress?: (progress: UserRuleProgress) => void
  onFinish?: (result: { correct: number; total: number }) => void
}

const typeLabels: Record<RuleExerciseType, string> = { spell: 'Spell it', correct_word: 'Fix the spelling', fill_gap: 'Fill the gap', multiple_choice: 'Choose', grammar: 'Grammar' }
const AUTO_ADVANCE_MS = 900
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ')

// One exercise at a time, like word practice: answer it, and a right answer moves on by itself;
// a wrong one shows the correct answer and waits for Next (Enter works too).
export function RuleExerciseRunner({ items, loop, showRuleTitle, onProgress, onFinish }: RuleExerciseRunnerProps) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const tally = useRef({ correct: 0, total: 0 })
  const item = items[index]

  function next() {
    if (index + 1 >= items.length) {
      if (!loop) { onFinish?.({ ...tally.current }); return }
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
    setAnswer(''); setFeedback(null)
  }

  useEffect(() => {
    if (feedback !== 'correct') return
    const timer = window.setTimeout(next, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [feedback, index])

  async function check(value: string) {
    if (!item || feedback || !value.trim()) return
    const isCorrect = normalize(value) === normalize(item.exercise.answer)
    tally.current.total += 1
    if (isCorrect) tally.current.correct += 1
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    const progress = await recordRulePracticeAttempt(item.exercise.ruleId, isCorrect, item.exercise.id)
    if (progress) onProgress?.(progress)
  }

  if (!item) return null
  const { exercise } = item
  const choices = exercise.exerciseType === 'multiple_choice' ? exercise.choices : undefined

  return (
    <div className="rule-runner">
      <div className="rule-runner__meta">
        <span>{typeLabels[exercise.exerciseType]}</span>
        {showRuleTitle && item.ruleTitle ? <span className="rule-runner__rule">{item.ruleTitle}</span> : null}
        {!loop ? <span className="rule-runner__count">{index + 1} / {items.length}</span> : null}
      </div>
      <p className="rule-runner__prompt">{exercise.prompt}</p>

      {feedback ? (
        <div className={`rule-runner__feedback rule-runner__feedback--${feedback}`} role="status">
          <span>{feedback === 'correct' ? 'Correct!' : <>Not quite: <AnswerDiff expected={exercise.answer} submitted={answer} /></>}</span>
          {feedback === 'incorrect' ? <button className="next-button" type="button" onClick={next} autoFocus>Next <Icon name="arrow" size={15} /></button> : null}
        </div>
      ) : choices?.length ? (
        <div className="rule-runner__choices">{choices.map((choice) => <button type="button" className="rule-runner__choice" onClick={() => { setAnswer(choice); void check(choice) }} key={choice}>{choice}</button>)}</div>
      ) : (
        <form className="rule-runner__form" onSubmit={(event) => { event.preventDefault(); void check(answer) }} key={index}>
          <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer" autoComplete="off" autoFocus />
          <button className="check-button" type="submit" disabled={!answer.trim()}>Check</button>
        </form>
      )}
    </div>
  )
}
