import { useEffect, useState } from 'react'
import { Icon } from '../icons/Icon'
import { getRuleChallenge } from '../../services/rulePracticeService'
import { setPendingRuleFocus } from '../../services/rulesService'
import type { Rule } from '../../types/rules'
import { RuleExerciseRunner, type RunnerItem } from './RuleExerciseRunner'

type Phase = { kind: 'loading' } | { kind: 'empty' } | { kind: 'running'; items: RunnerItem[] } | { kind: 'done'; correct: number; total: number }

// "Did you get the rule, or just this word?" — shown after a spelling mistake that is linked to a
// rule: one short task per rule on a different word. It sits outside the task form on purpose,
// because the runner has its own form and Enter key.
export function RuleChallenge({ rules, avoidWord, onClose }: { rules: Rule[]; avoidWord: string; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })
  const ruleKey = rules.map((rule) => rule.id).join()

  useEffect(() => {
    let cancelled = false
    const titles = new Map(rules.map((rule) => [rule.id, rule.title]))
    getRuleChallenge(rules.map((rule) => rule.id), avoidWord).then((exercises) => {
      if (cancelled) return
      setPhase(exercises.length ? { kind: 'running', items: exercises.map((exercise) => ({ exercise, ruleTitle: titles.get(exercise.ruleId) })) } : { kind: 'empty' })
    })
    return () => { cancelled = true }
  }, [avoidWord, ruleKey]) // rules is a fresh array on every render; its ids are what matters

  function openRule() { setPendingRuleFocus(rules[0].id); window.location.hash = 'rules' }

  return (
    <section className="rule-challenge" aria-label="Rule challenge">
      <div className="rule-challenge__head">
        <span><Icon name="bolt" size={15} /> Rule challenge</span>
        <button className="quiet-action" type="button" onClick={onClose} aria-label="Close the rule challenge">Close</button>
      </div>
      {phase.kind === 'loading' ? <p className="rule-challenge__text">Finding a new word for this rule…</p> : null}
      {phase.kind === 'empty' ? <p className="rule-challenge__text">No new-word tasks for this rule yet. <button className="rule-challenge__link" type="button" onClick={openRule}>Open the rule</button></p> : null}
      {phase.kind === 'running' ? (
        <>
          <p className="rule-challenge__text">Same rule, different word — this shows whether the rule stuck, not just the word.</p>
          <RuleExerciseRunner items={phase.items} showRuleTitle onFinish={(result) => setPhase({ kind: 'done', ...result })} />
        </>
      ) : null}
      {phase.kind === 'done' ? (
        <div className={`rule-challenge__result rule-challenge__result--${phase.correct === phase.total ? 'good' : 'retry'}`}>
          <strong>{phase.correct === phase.total ? 'You applied the rule to a new word.' : 'The rule has not stuck yet.'}</strong>
          <p>{phase.correct === phase.total ? 'That counts towards mastering it.' : 'Read the short explanation once more — it will come back in your rule practice.'}</p>
          <button className="rule-challenge__link" type="button" onClick={openRule}>Open the rule <Icon name="arrow" size={14} /></button>
        </div>
      ) : null}
    </section>
  )
}
