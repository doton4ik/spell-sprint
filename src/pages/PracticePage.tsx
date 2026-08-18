import { mixedPracticeTasks } from '../data/practice'
import { usePracticeSession } from '../hooks/usePracticeSession'
import { Icon } from '../components/icons/Icon'
import { PracticeSettings } from '../components/practice/PracticeSettings'
import { TaskCard } from '../components/practice/TaskCard'
import './practice.css'

export function PracticePage() {
  const session = usePracticeSession(mixedPracticeTasks)

  if (session.completed) {
    return (
      <div className="practice-page practice-page--complete" id="practice">
        <div className="completion-card">
          <span className="completion-card__icon"><Icon name="check" size={29} strokeWidth={2.3} /></span>
          <p className="eyebrow">Mixed practice complete</p>
          <h1>Nice focused work.</h1>
          <p>You completed {session.totalTasks} mixed tasks across spelling, grammar, business, and logistics English.</p>
          <button className="check-button" type="button" onClick={session.restart}><Icon name="refresh" size={18} /> Start another round</button>
        </div>
      </div>
    )
  }

  return (
    <div className="practice-page" id="practice">
      <header className="practice-header">
        <div>
          <p className="eyebrow">Practice</p>
          <h1>Build accuracy, one answer at a time.</h1>
          <p>Mixed practice adapts your attention across spelling, vocabulary, and grammar.</p>
        </div>
        <PracticeSettings settings={session.settings} onChange={session.setSettings} />
      </header>

      <section className="practice-workspace" aria-label="Practice session">
        <aside className="session-sidebar">
          <div className="session-mode"><span><Icon name="shuffle" size={17} /> Mixed practice</span><small>4 task types</small></div>
          <div className="session-progress"><div><span>Session progress</span><strong>{session.taskIndex + 1} <small>/ {session.totalTasks}</small></strong></div><div className="session-progress__track"><div style={{ width: `${session.progress}%` }} /></div></div>
          <div className="session-note"><Icon name="lightbulb" size={17} /><p><strong>Write until correct is on.</strong> Your answer stays private until you choose to reveal it.</p></div>
          <div className="session-types"><span>In this session</span><p>Correct spelling</p><p>Write in English</p><p>Translate to Russian</p><p>Correct sentences</p></div>
        </aside>
        <TaskCard
          task={session.currentTask}
          answer={session.answer}
          result={session.result}
          attemptsOnTask={session.attemptsOnTask}
          answerRevealed={session.answerRevealed}
          showHints={session.settings.showHints}
          showRuleAfterMistake={session.settings.showRuleAfterMistake}
          writeUntilCorrect={session.settings.writeUntilCorrect}
          allowSkip={session.settings.allowSkip}
          onAnswerChange={session.setAnswer}
          onCheck={session.checkAnswer}
          onShowAnswer={session.revealAnswer}
          onSkip={session.skip}
          onNext={session.advance}
        />
      </section>
    </div>
  )
}
