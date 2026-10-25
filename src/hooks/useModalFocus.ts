import { useEffect, useRef, type RefObject } from 'react'

const focusable =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

// A dialog that opens over the page: focus moves inside (unless the dialog already took it), Tab stays inside,
// and when it closes focus goes back to the button that opened it.
export function useModalFocus(ref: RefObject<HTMLElement | null>) {
  // Taken while rendering: a child's effect (an input that focuses itself) runs before this hook's effect.
  const openerAtOpen = useRef(typeof document === 'undefined' ? null : document.activeElement)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const opener = openerAtOpen.current instanceof HTMLElement ? openerAtOpen.current : null
    if (!root.contains(document.activeElement)) root.querySelector<HTMLElement>(focusable)?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = [...root.querySelectorAll<HTMLElement>(focusable)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('keydown', onKey)
      if (opener?.isConnected) opener.focus()
    }
  }, [ref])
}
