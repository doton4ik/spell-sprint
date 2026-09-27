export function canSpeak() { return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window }

// Android reports voice languages as "en_US", desktop browsers as "en-US"; compare them in one form.
const normaliseLang = (lang: string) => lang.replace('_', '-').toLowerCase()

// Voices load asynchronously (on Android the first getVoices() call is often empty), so keep a copy
// that refreshes when the browser announces the list is ready.
let voices: SpeechSynthesisVoice[] = []
function loadVoices() { voices = window.speechSynthesis.getVoices() }
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

export function speakEnglish(text: string, locale: 'en-US' | 'en-GB') {
  if (!canSpeak()) return { ok: false, fallback: false }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  const { voice, exact } = pickVoice(locale)
  if (voice) utterance.voice = voice
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance)
  // Only warn when a different accent is really being used; with no voice list yet, the browser picks by utterance.lang.
  return { ok: true, fallback: Boolean(voice && !exact) }
}
