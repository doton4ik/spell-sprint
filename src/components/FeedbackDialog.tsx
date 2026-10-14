import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons/Icon'
import { getCloudSession } from '../services/supabase'
import {
  FEEDBACK_MAX,
  feedbackKinds,
  isMessageLongEnough,
  submitFeedback,
  type FeedbackKind,
  type SubmitResult,
} from '../services/feedback'
import './word-report.css'

// The contact address is set at build time (VITE_CONTACT_EMAIL), the same one the privacy page shows.
const contact = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim()

function resultText(result: SubmitResult) {
  if (result === 'sent') return 'Thank you — your message reached us.'
  if (result === 'limit') return 'You have already sent several messages today. Please write again tomorrow.'
  return getCloudSession()
    ? 'Thank you — it is saved and will be sent when you are back online.'
    : 'Thank you — it is saved on this device and will be sent once you sign in (Settings).'
}

// "Feedback": what is broken, an idea, a mistake in the content. Opens over the page from the menu.
export function FeedbackDialog({ onClose }: { onClose: () => void }) {
  const [kind, setKind] = useState<FeedbackKind>('bug')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'editing' | 'sending' | 'done'>('editing')
  const [result, setResult] = useState<SubmitResult>('saved')
  const field = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    field.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function send() {
    if (!isMessageLongEnough(message) || state === 'sending') return
    setState('sending')
    setResult(await submitFeedback(kind, message))
    setState('done')
  }

  return (
    <div
      className="word-report-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Send feedback"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {state === 'done' ? (
        <div className="word-report word-report--done" role="status">
          <p>
            <Icon name="check" size={15} /> {resultText(result)}
          </p>
          <button className="check-button" type="button" onClick={onClose}>
            OK
          </button>
        </div>
      ) : (
        <div className="word-report" role="group" aria-label="Feedback">
          <p className="word-report__title">
            <Icon name="lightbulb" size={15} /> What would you like to tell us?
          </p>
          <div className="word-report__reasons" role="radiogroup" aria-label="Kind of message">
            {feedbackKinds.map((item) => (
              <button
                type="button"
                role="radio"
                aria-checked={kind === item.id}
                className={kind === item.id ? 'word-report__reason word-report__reason--on' : 'word-report__reason'}
                onClick={() => setKind(item.id)}
                key={item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
          <textarea
            ref={field}
            className="word-report__comment word-report__comment--multiline"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={FEEDBACK_MAX}
            rows={4}
            aria-label="Your message"
            placeholder={
              kind === 'bug'
                ? 'What did you do, and what happened?'
                : kind === 'content'
                  ? 'Which word or rule, and what is wrong?'
                  : 'Write a few words'
            }
          />
          <p className="word-report__hint">
            No answers or personal data are sent with it, only the page you are on and the app version.
            {contact ? (
              <>
                {' '}
                You can also write to <a href={`mailto:${contact}`}>{contact}</a>.
              </>
            ) : null}
          </p>
          <div className="word-report__actions">
            <button
              className="check-button"
              type="button"
              disabled={!isMessageLongEnough(message) || state === 'sending'}
              onClick={() => void send()}
            >
              {state === 'sending' ? 'Sending…' : 'Send'}
            </button>
            <button className="quiet-button" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
