import { useMemo } from 'react'
import { defaultPracticeSettings } from '../../data/practice'
import { mistakeGuides } from '../../data/mistakeGuides'
import { localDayKey } from '../../services/dateKeys'
import { getAllWords } from '../../services/libraryStorage'
import { loadPracticeSettings } from '../../services/practiceStorage'
import { canSpeak, speakEnglish } from '../../services/speech'
import { Icon } from '../icons/Icon'

// A small number from the day, so the word and the tip stay the same all day and change tomorrow.
function dayNumber(salt: number) {
  const key = localDayKey(new Date())
  let hash = salt
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash
}

// Wide screens only (CSS): a word and a spelling tip for today, in the space beside the dashboard.
export function DayRail() {
  const word = useMemo(() => {
    const candidates = getAllWords().filter((entry) => entry.example && entry.translation)
    return candidates.length ? candidates[dayNumber(7) % candidates.length] : null
  }, [])
  const tip = useMemo(() => {
    const guides = Object.values(mistakeGuides).filter((guide) => guide.rule)
    return guides.length ? guides[dayNumber(13) % guides.length] : null
  }, [])

  return (
    <aside className="day-rail" aria-label="Today">
      {word ? (
        <section className="day-card">
          <span className="day-card__label">Word of the day</span>
          <div className="day-card__word">
            <strong>{word.word}</strong>
            {canSpeak() ? (
              <button
                className="day-card__speak"
                type="button"
                aria-label={`Listen to ${word.word}`}
                onClick={() => speakEnglish(word.word, loadPracticeSettings(defaultPracticeSettings).speechLocale)}
              >
                <Icon name="volume" size={16} />
              </button>
            ) : null}
          </div>
          <p className="day-card__translation">{word.translation}</p>
          <p className="day-card__example">{word.example}</p>
        </section>
      ) : null}
      {tip ? (
        <section className="day-card">
          <span className="day-card__label">Spelling tip</span>
          <p className="day-card__tip">{tip.rule}</p>
          <div className="day-card__chips">
            {tip.examples.slice(0, 4).map((example) => (
              <span key={example}>{example}</span>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  )
}
