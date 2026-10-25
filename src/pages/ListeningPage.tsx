import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { defaultPracticeSettings } from '../data/practice'
import { listeningClips, type ListeningClip } from '../data/listeningClips'
import { checkLine, clipScore, type LineResult } from '../services/listening'
import { loadPracticeSettings } from '../services/practiceStorage'
import { canSpeak, speakEnglish, stopSpeaking } from '../services/speech'
import './listening.css'

type Phase = { kind: 'list' } | { kind: 'session'; clip: ListeningClip } | { kind: 'done'; clip: ListeningClip; results: boolean[] }

export function ListeningPage() {
  const [phase, setPhase] = useState<Phase>({ kind: 'list' })
  useEffect(() => stopSpeaking, [])
  if (phase.kind === 'session')
    return (
      <Session
        clip={phase.clip}
        onFinish={(results) => setPhase({ kind: 'done', clip: phase.clip, results })}
        onQuit={() => setPhase({ kind: 'list' })}
      />
    )
  if (phase.kind === 'done') {
    const score = clipScore(phase.results)
    return (
      <div className="listen-page">
        <header className="listen-header">
          <h1>{score}%</h1>
          <p>
            {phase.results.filter(Boolean).length} of {phase.results.length} lines written right in “{phase.clip.title}”.
          </p>
        </header>
        <div className="listen-actions">
          <button className="check-button" type="button" onClick={() => setPhase({ kind: 'session', clip: phase.clip })}>
            Again
          </button>
          <button className="template-button" type="button" onClick={() => setPhase({ kind: 'list' })}>
            All clips
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="listen-page" id="listening">
      <header className="listen-header">
        <h1>Listening dictation</h1>
        <p>Listen to a line and write what you hear. You can replay it, or play it slowly.</p>
      </header>
      {canSpeak() ? null : <p className="listen-note">This browser cannot read text aloud, so the lines will be silent.</p>}
      <ul className="listen-clips">
        {listeningClips.map((clip) => (
          <li key={clip.id}>
            <button type="button" className="listen-clip" onClick={() => setPhase({ kind: 'session', clip })}>
              <span className="listen-clip__level">{clip.level}</span>
              <strong>{clip.title}</strong>
              <small>{clip.lines.length} lines</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Session({ clip, onFinish, onQuit }: { clip: ListeningClip; onFinish: (results: boolean[]) => void; onQuit: () => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<LineResult | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const input = useRef<HTMLInputElement>(null)
  const line = clip.lines[index]
  const locale = loadPracticeSettings(defaultPracticeSettings).speechLocale
  const play = (slow: boolean) => speakEnglish(line.text, locale, slow ? 0.6 : 1)

  // each new line is read once on its own; the cleanup stops a line that is still being read
  useEffect(() => {
    speakEnglish(line.text, locale)
    input.current?.focus()
    return stopSpeaking
  }, [line.text, locale])

  const check = () => {
    if (result) return
    setResult(checkLine(line.text, answer))
  }
  const next = () => {
    if (!result) return
    const all = [...results, result.correct]
    if (index + 1 >= clip.lines.length) return onFinish(all)
    setResults(all)
    setIndex(index + 1)
    setAnswer('')
    setResult(null)
  }

  return (
    <div className="listen-page">
      <header className="listen-session-head">
        <button className="quiet-button" type="button" onClick={onQuit}>
          Back
        </button>
        <span>
          {clip.title} · {index + 1} / {clip.lines.length}
        </span>
      </header>
      <section className="listen-card">
        <div className="listen-play">
          <button className="check-button" type="button" onClick={() => play(false)}>
            <Icon name="volume" size={18} /> Play
          </button>
          <button className="template-button" type="button" onClick={() => play(true)}>
            Slowly
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (result) next()
            else check()
          }}
        >
          <input
            ref={input}
            className="listen-input"
            value={answer}
            readOnly={Boolean(result)}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Write the line you heard"
            aria-label="The line you heard"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {result ? (
            <div className={`listen-result listen-result--${result.correct ? 'good' : 'bad'}`} role="status">
              <strong>{result.correct ? 'Right' : 'Not quite'}</strong>
              {result.correct ? null : (
                <>
                  <p className="listen-yours">
                    {result.given.length
                      ? result.given.map((word, i) => (
                          <span key={i} className={word.same ? '' : 'listen-word--wrong'}>
                            {word.text}{' '}
                          </span>
                        ))
                      : '—'}
                  </p>
                  <p className="listen-right">{line.text}</p>
                </>
              )}
              <button className="next-button" type="submit">
                {index + 1 >= clip.lines.length ? 'Finish' : 'Next line'}
              </button>
            </div>
          ) : (
            <button className="check-button" type="submit">
              Check
            </button>
          )}
        </form>
      </section>
    </div>
  )
}
