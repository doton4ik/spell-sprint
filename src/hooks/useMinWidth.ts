import { useEffect, useState } from 'react'
import { currentTextFactor } from '../services/appearanceStorage'

// True when the window is at least `px` wide, counted in the same scaled units as the stylesheets' media queries
// (a larger text size makes the page behave like a narrower window).
export function useMinWidth(px: number) {
  const test = () => window.innerWidth >= px * currentTextFactor()
  const [matches, setMatches] = useState(test)
  useEffect(() => {
    const update = () => setMatches(test())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('text-size-change', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('text-size-change', update)
    }
  }, [px]) // eslint-disable-line react-hooks/exhaustive-deps
  return matches
}
