import { getProfile, type Profile, type SpeechSpeed } from './profileStorage'

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

// Android reports voice languages as "en_US", desktop browsers as "en-US"; compare them in one form.
const normaliseLang = (lang: string) => lang.replace('_', '-').toLowerCase()

// Voices load asynchronously (on Android the first getVoices() call is often empty), so keep a copy
// that refreshes when the browser announces the list is ready.
let voices: SpeechSynthesisVoice[] = []
function loadVoices() {
  voices = window.speechSynthesis.getVoices()
}
if (canSpeak()) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

function pickVoice(locale: string) {
  if (!voices.length) loadVoices()
  const wanted = normaliseLang(locale)
  const exact = voices.filter((voice) => normaliseLang(voice.lang) === wanted)
  // Prefer an on-device voice (works offline, no delay), then the browser's default for that accent.
  const exactVoice = exact.find((voice) => voice.localService) ?? exact.find((voice) => voice.default) ?? exact[0]
  if (exactVoice) return { voice: exactVoice, exact: true }
  const english = voices.find((voice) => normaliseLang(voice.lang).startsWith('en'))
  return { voice: english, exact: false }
}

// A word or sentence that is still being read must not go on over the next question or page.
export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

// How fast words are read: the learner's choice in Settings (a profile field), one table for every screen.
export const speechRates: Record<SpeechSpeed, number> = { slow: 0.75, normal: 1, fast: 1.15 }

export function speechRate(profile: Pick<Profile, 'speechSpeed'> = getProfile()) {
  return speechRates[profile.speechSpeed] ?? 1
}

// A "slower" replay: clearly slower than the chosen speed, but never below what a voice can still pronounce clearly.
export const SLOW_FACTOR = 0.7
export const SLOW_FLOOR = 0.5
export function slowSpeechRate(profile: Pick<Profile, 'speechSpeed'> = getProfile()) {
  return Math.max(SLOW_FLOOR, Math.round(speechRate(profile) * SLOW_FACTOR * 100) / 100)
}

export function speakEnglish(text: string, locale: 'en-US' | 'en-GB', options: { slow?: boolean } = {}) {
  if (!canSpeak()) return { ok: false, fallback: false }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  utterance.rate = options.slow ? slowSpeechRate() : speechRate()
  const { voice, exact } = pickVoice(locale)
  if (voice) utterance.voice = voice
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
  // Only warn when a different accent is really being used; with no voice list yet, the browser picks by utterance.lang.
  return { ok: true, fallback: Boolean(voice && !exact) }
}
