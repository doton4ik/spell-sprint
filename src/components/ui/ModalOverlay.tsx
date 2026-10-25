import { useEffect, useRef, type ReactNode } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'
import '../word-report.css'

// The dark layer and the dialog role for a panel that opens over the page: Escape or a click beside the panel closes it,
// Tab stays inside, focus comes back to the opener (see useModalFocus).
export function ModalOverlay({
  label,
  labelledBy,
  describedBy,
  role = 'dialog',
  onClose,
  children,
}: {
  label?: string
  labelledBy?: string
  describedBy?: string
  role?: 'dialog' | 'alertdialog'
  onClose: () => void
  children: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)
  // The parent passes a new onClose on every render; the key listener is added once.
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })
  useModalFocus(root)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={root}
      className="word-report-overlay"
      role={role}
      aria-modal="true"
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </div>
  )
}
