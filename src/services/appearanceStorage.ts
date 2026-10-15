// Text size preference. It sets one CSS variable (--fs) on <html>; every font size in the
// stylesheets is written as calc(Npx * var(--fs)), so one setting scales the whole app evenly.
export type FontScale = 'compact' | 'default' | 'large' | 'xlarge'

export const fontScaleOptions: Array<{ value: FontScale; label: string; factor: number }> = [
  { value: 'compact', label: 'Compact', factor: 0.92 },
  { value: 'default', label: 'Default', factor: 1 },
  { value: 'large', label: 'Large', factor: 1.15 },
  { value: 'xlarge', label: 'Extra large', factor: 1.3 },
]

const KEY = 'spell-sprint.font-scale'
const isFontScale = (value: unknown): value is FontScale => fontScaleOptions.some((option) => option.value === value)

export function getFontScale(): FontScale {
  try {
    const stored = window.localStorage.getItem(KEY)
    return isFontScale(stored) ? stored : 'default'
  } catch {
    return 'default'
  }
}

// A wide screen shows the same text small and leaves much of the page empty, so the whole app is a little larger there. The
// learner's own choice (above) is applied on top of this. Phones and laptops (under 1400 px) are not changed.
export function screenFactor(width: number) {
  return width >= 2200 ? 1.2 : width >= 1700 ? 1.1 : width >= 1400 ? 1.05 : 1
}

let watching = false
export function applyFontScale(scale: FontScale = getFontScale()) {
  const factor = fontScaleOptions.find((option) => option.value === scale)?.factor ?? 1
  document.documentElement.style.setProperty('--fs', String(Math.round(factor * screenFactor(window.innerWidth) * 1000) / 1000))
  // The window can be resized or moved to another screen: the size follows it.
  if (!watching) {
    watching = true
    window.addEventListener('resize', () => applyFontScale())
  }
}

export function setFontScale(scale: FontScale) {
  try {
    window.localStorage.setItem(KEY, scale)
  } catch {
    /* the choice still applies for this visit */
  }
  applyFontScale(scale)
}

// Colour theme: follow the system (default), or always light / always dark. "system" leaves
// data-theme off <html>, so the prefers-color-scheme rules in tokens.css decide.
export type Theme = 'system' | 'light' | 'dark'
export const themeOptions: Array<{ value: Theme; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
const THEME_KEY = 'spell-sprint.theme'
const isTheme = (value: unknown): value is Theme => themeOptions.some((option) => option.value === value)

export function getTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(theme: Theme = getTheme()) {
  if (theme === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* the choice still applies for this visit */
  }
  applyTheme(theme)
}
