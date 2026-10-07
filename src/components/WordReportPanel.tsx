import { useState } from 'react'
import { Icon } from './icons/Icon'
import { getCloudSession } from '../services/supabase'
import { reportWord, wordReportReasons, type WordReportReason } from '../services/wordReports'
import './word-report.css'

export type ReportedWord = { wordId: string; word: string; translation?: string; library?: string }

// "Report this word": pick a reason, add a comment if you like, and (by default) hide the word from
// your own practice straight away. Not a <form>: it is shown inside the practice answer form.
export function WordReportPanel({ word, onDone, onCancel }: { word: ReportedWord; onDone: (hide: boolean) => void; onCancel: () => void }) {
  const [reason, setReason] = useState<WordReportReason | null>(null)
  const [comment, setComment] = useState('')
  const [hide, setHide] = useState(true)
  const [state, setState] = useState<'editing' | 'sending' | 'done'>('editing')
  const [sent, setSent] = useState(false)

  async function send() {
    if (!reason) return
    setState('sending')
    setSent(await reportWord({ ...word, reason, comment }))
    setState('done')
  }

  if (state === 'done') {
    return (
      <div className="word-report word-report--done" role="status">
        <p>
          <Icon name="check" size={15} /> Thank you — “{word.word}” is reported.{' '}
          {sent
            ? 'We will check it.'
            : getCloudSession()
              ? 'It will be sent when you are back online.'
              : 'It will be sent once you sign in (Settings).'}
          {hide
            ? word.wordId.startsWith('task:')
              ? ' It is hidden from your practice.'
              : ' It is hidden from your practice; you can restore it in Libraries → My Libraries.'
            : ''}
        </p>
        <button className="check-button" type="button" onClick={() => onDone(hide)}>
          {hide ? 'Next word' : 'OK'}
        </button>
      </div>
    )
  }

  return (
    <div className="word-report" role="group" aria-label={`Report “${word.word}”`}>
      <p className="word-report__title">
        <Icon name="flag" size={15} /> What is wrong with “{word.word}”?
      </p>
      <div className="word-report__reasons" role="radiogroup">
        {wordReportReasons.map((item) => (
          <button
            type="button"
            role="radio"
            aria-checked={reason === item.id}
            className={reason === item.id ? 'word-report__reason word-report__reason--on' : 'word-report__reason'}
            onClick={() => setReason(item.id)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <input
        className="word-report__comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={500}
        placeholder={reason === 'wrong-translation' ? 'The right translation, if you know it' : 'A comment (optional)'}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            void send()
          }
        }}
      />
      <label className="word-report__hide">
        <input type="checkbox" checked={hide} onChange={(event) => setHide(event.target.checked)} /> Also hide it from my practice
      </label>
      <div className="word-report__actions">
        <button className="check-button" type="button" disabled={!reason || state === 'sending'} onClick={() => void send()}>
          {state === 'sending' ? 'Sending…' : 'Send report'}
        </button>
        <button className="quiet-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
