import { useState } from 'react'
import { skillLabels } from '../../data/levelCheckBank'
import { getMistakePatterns, isHabit } from '../../services/mistakePatterns'
import { getSkillSnapshot } from '../../services/skillSnapshot'
import { getTopicStats } from '../../services/topicStats'

// "Where you stand today": a picture built from the learner's own answers (last 30 days), so the Level
// check page has something real to show before and between checks.
const tone = (percent: number) => (percent >= 80 ? 'good' : percent >= 60 ? 'mid' : 'low')

export function LevelPicture() {
  const [skills] = useState(getSkillSnapshot)
  const [habits] = useState(() => getMistakePatterns().patterns.filter(isHabit).slice(0, 3))
  const [topics] = useState(getTopicStats)
  const strong = topics.filter((topic) => topic.status === 'strong').slice(0, 4)
  const focus = topics.filter((topic) => topic.status === 'needs-focus').slice(0, 4)

  return (
    <section className="level-picture" aria-labelledby="level-picture-title">
      <div className="level-section-head">
        <h2 id="level-picture-title">Where you stand today</h2>
        <span>your answers, last 30 days</span>
      </div>
      <div className="level-picture__grid">
        <div className="level-picture__card">
          <h3>Skills</h3>
          <ul className="level-skillbars">
            {skills.map(({ skill, percent, answers }) => (
              <li key={skill}>
                <span className="level-skillbars__name">{skillLabels[skill]}</span>
                <span className="level-skillbars__track">
                  {percent !== null ? (
                    <i className={`level-skillbars__fill level-skillbars__fill--${tone(percent)}`} style={{ width: `${percent}%` }} />
                  ) : null}
                </span>
                <span className="level-skillbars__value">{percent !== null ? `${percent}%` : '—'}</span>
                <small>{percent !== null ? `${answers} answers` : answers ? 'too few answers' : 'no answers yet'}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="level-picture__card">
          <h3>Habits to work on</h3>
          {habits.length ? (
            <ul className="level-habits">
              {habits.map((habit) => (
                <li key={habit.slug}>
                  <strong>{habit.label}</strong>
                  <span>{habit.errors} mistakes</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="level-muted">No repeated habits yet.</p>
          )}
          <a className="level-picture__link" href="#my-mistakes">
            All problems and rules →
          </a>
        </div>
      </div>
      {strong.length || focus.length ? (
        <div className="level-picture__card level-picture__topics">
          <div>
            <h3>Strong topics</h3>
            <p>{strong.length ? strong.map((topic) => <span key={topic.topic}>{topic.topic}</span>) : <em>none yet</em>}</p>
          </div>
          <div>
            <h3>Needs focus</h3>
            <p>{focus.length ? focus.map((topic) => <span key={topic.topic}>{topic.topic}</span>) : <em>none</em>}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
