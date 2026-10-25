import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { YouTubePlayer, type LinePlayer } from '../components/listening/YouTubePlayer'
import { defaultPracticeSettings } from '../data/practice'
import { listeningClips, type ListeningClip } from '../data/listeningClips'
import {
  checkLine,
  clipScore,
  getListeningProgress,
  lineHint,
  recordListeningAnswer,
  saveClipScore,
  type LineResult,
} from '../services/listening'
import { loadPracticeSettings } from '../services/practiceStorage'
import { canSpeak, speakEnglish, stopSpeaking } from '../services/speech'
import './listening.css'

type Answered = { text: string; given: string; correct: boolean; skipped: boolean }
type Phase = { kind: 'list' } | { kind: 'session'; clip: ListeningClip } | { kind: 'done'; clip: ListeningClip; answered: Answered[] }

export function ListeningPage() {
  const [phase, setPhase] = useState<Phase>({ kind: 'list' })
  useEffect(() => stopSpeaking, [])
  if (phase.kind === 'session')
    return (
      <Session
        clip={phase.clip}
        onFinish={(answered) => {
          saveClipScore(phase.clip.id, clipScore(answered.map((item) => item.correct)))
          setPhase({ kind: 'done', clip: phase.clip, answered })
        }}
        onQuit={() => setPhase({ kind: 'list' })}
      />
    )
  if (phase.kind === 'done') {
    const score = clipScore(phase.answered.map((item) => item.correct))
    const wrong = phase.answered.filter((item) => !item.correct).length
    return (
      <div className="listen-page">
        <header className="listen-header">
          <h1>{score}%</h1>
          <p>
            {phase.answered.length - wrong} of {phase.answered.length} lines written right in “{phase.clip.title}”.
            {wrong ? ' The lines you missed are in My Mistakes.' : ''}
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
        <ol className="listen-transcript">
          {phase.answered.map((item, i) => (
            <li key={i} className={item.correct ? 'listen-transcript--good' : 'listen-transcript--bad'}>
              <span>{item.text}</span>
              {item.correct ? null : <small>{item.skipped ? 'skipped' : `you wrote: ${item.given}`}</small>}
            </li>
          ))}
        </ol>
      </div>
    )
  }
  const progress = getListeningProgress()
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
              <small>
                {clip.lines.length} lines{progress[clip.id] ? ` · best ${progress[clip.id].best}%` : ''}
              </small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Session({ clip, onFinish, onQuit }: { clip: ListeningClip; onFinish: (answered: Answered[]) => void; onQuit: () => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<(LineResult & { skipped: boolean }) | null>(null)
  const [hint, setHint] = useState(false)
  const [answered, setAnswered] = useState<Answered[]>([])
  const input = useRef<HTMLInputElement>(null)
  const video = useRef<LinePlayer>(null)
  // a video that cannot be shown (blocked, removed, not allowed to be embedded) falls back to the voice
  const [videoFailed, setVideoFailed] = useState(false)
  const line = clip.lines[index]
  const videoId = clip.source.kind === 'youtube' && !videoFailed ? clip.source.videoId : null
  const locale = loadPracticeSettings(defaultPracticeSettings).speechLocale
  const play = (slow: boolean) => {
    if (videoId && line.start !== undefined && line.end !== undefined) video.current?.playLine(line.start, line.end, slow ? 0.5 : 1)
    else speakEnglish(line.text, locale, slow ? 0.6 : 1)
  }

  // each new line is played once on its own; the cleanup stops a line that is still playing
  useEffect(() => {
    if (videoId && line.start !== undefined && line.end !== undefined) video.current?.playLine(line.start, line.end, 1)
    else speakEnglish(line.text, locale)
    input.current?.focus()
    const player = video.current
    return () => {
      stopSpeaking()
      player?.stop()
    }
  }, [line.text, line.start, line.end, locale, videoId])

  // the answer is saved when it is checked, so a clip left half way keeps what was done
  const settle = (skipped: boolean) => {
    if (result) return
    const checked = checkLine(line.text, skipped ? '' : answer)
    setResult({ ...checked, skipped })
    recordListeningAnswer(clip, index, line.text, skipped ? '' : answer, { correct: checked.correct, skipped, hintUsed: hint })
  }
  const next = () => {
    if (!result) return
    const all = [...answered, { text: line.text, given: answer.trim(), correct: result.correct, skipped: result.skipped }]
    if (index + 1 >= clip.lines.length) return onFinish(all)
    setAnswered(all)
    setIndex(index + 1)
    setAnswer('')
    setResult(null)
    setHint(false)
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
      <div className="listen-progress" aria-hidden="true">
        <span style={{ width: `${(index / clip.lines.length) * 100}%` }} />
      </div>
      <section className="listen-card">
        {videoId ? <YouTubePlayer ref={video} videoId={videoId} onFailed={() => setVideoFailed(true)} /> : null}
        <div className="listen-play">
          <button className="check-button" type="button" onClick={() => play(false)}>
            <Icon name="volume" size={18} /> Play
          </button>
          <button className="template-button" type="button" onClick={() => play(true)}>
            Slowly
          </button>
          {result ? null : (
            <button className="template-button" type="button" onClick={() => setHint(true)} disabled={hint}>
              Hint
            </button>
          )}
        </div>
        {hint && !result ? <p className="listen-hint">{lineHint(line.text)}</p> : null}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (result) next()
            else if (answer.trim()) settle(false)
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
              <strong>{result.correct ? 'Right' : result.skipped ? 'Skipped' : 'Not quite'}</strong>
              {result.correct ? null : (
                <>
                  {result.skipped ? null : (
                    <p className="listen-yours">
                      {result.given.length
                        ? result.given.map((word, i) => (
                            <span key={i} className={word.same ? '' : 'listen-word--wrong'}>
                              {word.text}{' '}
                            </span>
                          ))
                        : '—'}
                    </p>
                  )}
                  <p className="listen-right">{line.text}</p>
                </>
              )}
              <button className="next-button" type="submit">
                {index + 1 >= clip.lines.length ? 'Finish' : 'Next line'}
              </button>
            </div>
          ) : (
            <div className="listen-play">
              <button className="check-button" type="submit" disabled={!answer.trim()}>
                Check
              </button>
              <button className="quiet-button" type="button" onClick={() => settle(true)}>
                Skip
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  )
}
