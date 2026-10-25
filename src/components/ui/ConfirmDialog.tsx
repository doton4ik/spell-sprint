import { useEffect, useRef } from 'react'
import { ModalOverlay } from './ModalOverlay'

export type ConfirmOptions = { title: string; message: string; confirmLabel: string; cancelLabel?: string }

// A question over the page, in the look of the site (it replaces window.confirm, which blocks the page and ignores the theme).
// Cancel has the focus first, so Enter never confirms by accident.
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onAnswer,
}: ConfirmOptions & { onAnswer: (yes: boolean) => void }) {
  const cancel = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cancel.current?.focus()
  }, [])

  return (
    <ModalOverlay role="alertdialog" labelledBy="confirm-title" describedBy="confirm-message" onClose={() => onAnswer(false)}>
      <div className="word-report">
        <p className="word-report__title" id="confirm-title">
          {title}
        </p>
        <p className="word-report__hint" id="confirm-message">
          {message}
        </p>
        <div className="word-report__actions">
          <button className="check-button" type="button" onClick={() => onAnswer(true)}>
            {confirmLabel}
          </button>
          <button className="quiet-button" type="button" ref={cancel} onClick={() => onAnswer(false)}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
