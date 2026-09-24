import { useEffect, useState } from 'react'
import { Icon } from '../icons/Icon'
import { buildRulePracticeQueue, type RulePracticeQueue } from '../../services/rulePracticeService'
import type { UserRuleProgress } from '../../types/rules'
import { RuleExerciseRunner } from './RuleExerciseRunner'

type Phase = 'loading' | 'ready' | 'running' | 'done'

// The compact "repeat your mistakes" block at the top of the Rules page: one exercise at a time,
// so nothing needs scrolling. The next one appears as soon as the previous one is answered.
export function RulePracticePanel({ onProgress }: { onProgress: (progress: UserRuleProgress) => void }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [queue, setQueue] = useState<RulePracticeQueue | null>(null)
  const [result, setResult] = useState({ correct: 0, total: 0 })

  async function load() {
    setPhase('loading')
    setQueue(await buildRulePracticeQueue())
    setPhase('ready')
  }

  useEffect(() => { void load() }, [])

  const count = queue?.items.length ?? 0

  return (
    <section className="rule-practice-panel" aria-label="Rule practice">
      <div className="rule-practice-panel__head">
        <div><span className="rule-practice-panel__eyebrow"><Icon name="bolt" size={14} /> Rule practice</span><h2>Repeat what you get wrong</h2></div>
        {phase === 'running' ? <button className="quiet-action" type="button" onClick={() => setPhase('ready')}>Stop</button> : null}
      </div>

      {phase === 'loading' ? <p className="rule-practice-panel__text">Preparing your exercises…</p> : null}

      {phase === 'ready' && !count ? <p className="rule-practice-panel__text">No exercises yet. They appear here once your rules have practice tasks.</p> : null}

      {phase === 'ready' && count ? (
        <div className="rule-practice-panel__start">
          <p className="rule-practice-panel__text">
            {queue?.source === 'weak' ? `${count} quick exercises from ${queue.ruleCount} rule${queue.ruleCount === 1 ? '' : 's'} you still need to repeat.` : `No weak rules yet — ${count} exercises from a mix of rules.`}
          </p>
          <button className="check-button" type="button" onClick={() => setPhase('running')}><Icon name="practice" size={16} /> Start</button>
        </div>
      ) : null}

      {phase === 'running' && queue ? <RuleExerciseRunner items={queue.items} showRuleTitle onProgress={onProgress} onFinish={(finished) => { setResult(finished); setPhase('done') }} /> : null}

      {phase === 'done' ? (
        <div className="rule-practice-panel__start">
          <p className="rule-practice-panel__text"><strong>{result.correct} of {result.total} correct.</strong> {result.correct === result.total ? 'Clean round!' : 'The rules you missed will come back first.'}</p>
          <button className="check-button" type="button" onClick={() => void load()}><Icon name="refresh" size={16} /> Practice again</button>
        </div>
      ) : null}
    </section>
  )
}
