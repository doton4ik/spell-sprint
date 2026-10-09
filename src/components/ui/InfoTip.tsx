import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

// A small "?" that shows a short explanation on click (and on keyboard focus), so helper text does not
// take up room on the page. It works on touch screens, unlike a title tooltip. The bubble is fixed to
// the viewport, so it never runs off the screen or gets clipped by a card; it opens above the "?"
// when there is room (so it does not cover the number next to it) and below otherwise.
const MARGIN = 16

export function InfoTip({ children, label = 'More info' }: { children: string; label?: string }) {
  const [place, setPlace] = useState<CSSProperties | null>(null)
  const root = useRef<HTMLSpanElement>(null)
  const id = useId()
  const open = place !== null

  useEffect(() => {
    if (!open) return
    const close = (event: Event) => {
      if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') return
      if (event.type === 'pointerdown' && root.current?.contains(event.target as Node)) return
      setPlace(null)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  function toggle() {
    if (open || !root.current) return setPlace(null)
    const rect = root.current.getBoundingClientRect()
    const width = Math.min(240, window.innerWidth - MARGIN * 2)
    const left = Math.min(Math.max(rect.left - 8, MARGIN), window.innerWidth - MARGIN - width)
    const above = rect.top > 150
    setPlace(above ? { left, width, bottom: window.innerHeight - rect.top + 8 } : { left, width, top: rect.bottom + 8 })
  }

  return (
    <span className="info-tip" ref={root}>
      <button className="info-tip__button" type="button" aria-label={label} aria-expanded={open} aria-controls={id} onClick={toggle}>
        ?
      </button>
      {open ? (
        <span className="info-tip__bubble" id={id} role="note" style={place}>
          {children}
        </span>
      ) : null}
    </span>
  )
}
