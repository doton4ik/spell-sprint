import { useEffect, useState } from 'react'
import { isDarkTheme, setTheme, THEME_EVENT } from '../../services/appearanceStorage'
import { Icon } from '../icons/Icon'

// One tap between the day and the night theme. It sets an explicit light / dark choice (Settings still offers "System").
export function ThemeToggle({ className }: { className: string }) {
  const [dark, setDark] = useState(() => isDarkTheme())
  useEffect(() => {
    const update = () => setDark(isDarkTheme())
    window.addEventListener(THEME_EVENT, update)
    return () => window.removeEventListener(THEME_EVENT, update)
  }, [])
  const next = dark ? 'Light theme' : 'Dark theme'
  return (
    <button className={className} type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} title={`Switch to ${next.toLowerCase()}`}>
      <Icon name={dark ? 'sun' : 'moon'} size={19} />
      <span>{next}</span>
    </button>
  )
}
