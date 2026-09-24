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

export function applyFontScale(scale: FontScale = getFontScale()) {
  const factor = fontScaleOptions.find((option) => option.value === scale)?.factor ?? 1
  document.documentElement.style.setProperty('--fs', String(factor))
}

export function setFontScale(scale: FontScale) {
  try { window.localStorage.setItem(KEY, scale) } catch { /* the choice still applies for this visit */ }
  applyFontScale(scale)
}
