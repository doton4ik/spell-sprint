import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../icons/Icon'

// A choice that takes one line until it is opened: the button shows what is chosen, a panel below it holds
// the options. Closes on a click outside and on Escape. Used where a list of options would fill a card.
export function DropPanel({ label, summary, children }: { label: string; summary: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const close = (event: Event) => {
      if (event.type === 'keydown') {
        if ((event as KeyboardEvent).key !== 'Escape') return
        button.current?.focus()
      }
      if (event.type === 'pointerdown' && root.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div className="drop" ref={root}>
      <span className="settings-field-label">{label}</span>
      <button className="drop__button" ref={button} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span className="drop__summary">{summary}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open ? (
        <div className="drop__panel" id={id}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  )
}
