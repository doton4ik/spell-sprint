import { useEffect, useId, useRef, useState } from 'react'

// A small "?" that shows a short explanation on click (and on keyboard focus), so helper text does not
// take up room on the page. It works on touch screens, unlike a title tooltip.
export function InfoTip({ children, label = 'More info' }: { children: string; label?: string }) {
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const close = (event: Event) => {
      if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') return
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

  function toggle() {
    if (!open && root.current) setAlignRight(root.current.getBoundingClientRect().left + 260 > window.innerWidth)
    setOpen(!open)
  }

  return (
    <span className="info-tip" ref={root}>
      <button className="info-tip__button" type="button" aria-label={label} aria-expanded={open} aria-controls={id} onClick={toggle}>
        ?
      </button>
      {open ? (
        <span className={alignRight ? 'info-tip__bubble info-tip__bubble--right' : 'info-tip__bubble'} id={id} role="note">
          {children}
        </span>
      ) : null}
    </span>
  )
}
