// Text size preference: a slider from 85% to 200%. It sets one CSS variable (--fs) on <html>; every font size in the
// stylesheets is written as calc(Npx * var(--fs)), so one setting scales the whole app evenly.
export type FontScale = number // percent

export const FONT_SCALE_MIN = 85
export const FONT_SCALE_MAX = 200
export const FONT_SCALE_STEP = 5

const KEY = 'spell-sprint.font-scale'
// The four named sizes of the earlier version are still read.
const legacy: Record<string, number> = { compact: 92, default: 100, large: 115, xlarge: 130 }
export const clampFontScale = (value: number) =>
  Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP))

export function getFontScale(): FontScale {
  try {
    const stored = window.localStorage.getItem(KEY)
    if (stored && stored in legacy) return legacy[stored]
    const value = Number(stored)
    return stored && Number.isFinite(value) ? clampFontScale(value) : 100
  } catch {
    return 100
  }
}

// A wide screen shows the same text small and leaves much of the page empty, so the whole app is a little larger there. The
// learner's own choice (above) is applied on top of this. Phones and laptops (under 1400 px) are not changed.
export function screenFactor(width: number) {
  return width >= 2200 ? 1.2 : width >= 1700 ? 1.1 : width >= 1400 ? 1.05 : 1
}

// A larger text size must lay the page out like a smaller window, as browser zoom does: at 180% a 1900 px screen is
// about 1050 px wide, so side panels leave and grids lose columns. Every width/height in a media query of the
// stylesheets is multiplied by the text size (a breakpoint of 800px becomes 1440px at 180%), and the same factor is
// exposed to scripts through `currentTextFactor` and the "text-size-change" event.
let textFactor = 1
export const currentTextFactor = () => textFactor
const originalMedia = new WeakMap<CSSMediaRule, string>()
const appliedFactor = new WeakMap<CSSMediaRule, number>()

function scaleRules(rules: CSSRuleList, factor: number) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule) {
      if (!originalMedia.has(rule)) originalMedia.set(rule, rule.media.mediaText)
      if (appliedFactor.get(rule) !== factor) {
        const scaled = (originalMedia.get(rule) ?? '').replace(
          /(\d+(?:\.\d+)?)px/g,
          (_, value) => `${Math.round(Number(value) * factor * 100) / 100}px`,
        )
        if (scaled && scaled !== rule.media.mediaText) rule.media.mediaText = scaled
        appliedFactor.set(rule, factor)
      }
    }
    const inner = (rule as CSSGroupingRule).cssRules
    if (inner?.length) scaleRules(inner, factor)
  }
}

function scaleMediaQueries() {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      scaleRules(sheet.cssRules, textFactor)
    } catch {
      /* a sheet from another site cannot be read: it keeps its own breakpoints */
    }
  }
}

let watching = false
let scheduled = false
const scheduleScale = () => {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    scaleMediaQueries()
  })
}

export function applyFontScale(scale: FontScale = getFontScale()) {
  const factor = Math.round((clampFontScale(scale) / 100) * screenFactor(window.innerWidth) * 1000) / 1000
  document.documentElement.style.setProperty('--fs', String(factor))
  const changed = factor !== textFactor
  textFactor = factor
  if (changed) {
    scaleMediaQueries()
    window.dispatchEvent(new Event('text-size-change'))
  }
  // The window can be resized or moved to another screen: the size follows it.
  if (!watching) {
    watching = true
    window.addEventListener('resize', () => applyFontScale())
    // Pages are loaded as they are opened, and their stylesheets join the document later.
    new MutationObserver((records) => {
      for (const record of records)
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof HTMLLinkElement) node.addEventListener('load', scheduleScale)
          if (node instanceof HTMLLinkElement || node instanceof HTMLStyleElement) scheduleScale()
        }
    }).observe(document.head, { childList: true })
    window.addEventListener('load', scheduleScale)
  }
}

export function setFontScale(scale: FontScale) {
  try {
    window.localStorage.setItem(KEY, String(clampFontScale(scale)))
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
