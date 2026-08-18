import { useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { learningRules } from '../data/rules'
import { getRuleReviewIds, toggleRuleReview } from '../services/learningData'
import type { LearningRule } from '../types/learning'
import './learning.css'

const filters: Array<'All' | LearningRule['family']> = ['All', 'Spelling', 'Grammar', 'Word forms', 'Business English', 'Logistics English']

export function RulesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [reviewIds, setReviewIds] = useState(getRuleReviewIds)
  const visibleRules = filter === 'All' ? learningRules : learningRules.filter((rule) => rule.family === filter)

  return (
    <div className="learning-page" id="rules">
      <header className="learning-header">
        <div><p className="eyebrow">Reference library</p><h1>Rules that stick</h1><p>Short explanations, visual contrasts, and memory cues for the patterns you want to automate.</p></div>
        <div className="rules-saved"><Icon name="calendar" size={17} /><span><strong>{reviewIds.length}</strong> rules in review</span></div>
      </header>

      <div className="rule-filter filter-tabs">{filters.map((item) => <button type="button" className={filter === item ? 'filter-tabs__active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
      <section className="rules-grid">
        {visibleRules.map((rule) => {
          const saved = reviewIds.includes(rule.id)
          return (
            <article className="rule-card" key={rule.id}>
              <div className="rule-card__top"><span className="rule-family">{rule.family}</span><button className={saved ? 'rule-save rule-save--active' : 'rule-save'} type="button" onClick={() => setReviewIds(toggleRuleReview(rule.id))}>{saved ? 'In review' : 'Add to review'}</button></div>
              <h2>{rule.title}</h2><p className="rule-summary">{rule.shortExplanation}</p>
              <div className="wrong-right"><div><span>Wrong</span><s>{rule.wrong}</s></div><Icon name="arrow" size={16} /><div><span>Correct</span><strong>{rule.correct}</strong></div></div>
              <div className="memory-cue"><Icon name="lightbulb" size={16} /><p><strong>Memory cue</strong>{rule.memoryCue}</p></div>
              <div className="rule-examples"><span>More examples</span><p>{rule.examples.join(' · ')}</p></div>
              <a className="rule-practice" href="#practice">Practice this rule <Icon name="arrow" size={16} /></a>
            </article>
          )
        })}
      </section>
    </div>
  )
}
