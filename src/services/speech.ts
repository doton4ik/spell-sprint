export function canSpeak() { return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window }

export function speakEnglish(text: string, locale: 'en-US' | 'en-GB') {
  if (!canSpeak()) return { ok: false, fallback: false }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase()) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance)
  return { ok: true, fallback: Boolean(preferred && preferred.lang.toLowerCase() !== locale.toLowerCase()) }
}
