// Turns the captions of a video (a WebVTT file) into short phrases for listening dictation, each with the
// second it starts and ends at. Used by scripts/make-clip.mjs, which Node runs straight from this file:
// keep it free of imports.
export type Cue = { start: number; end: number; text: string }
// trimmed: the caption stayed on screen much longer than the words take, so the end was cut back (worth a look)
export type Phrase = { text: string; start: number; end: number; trimmed?: boolean }

const entities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
}

// "01:02:03.500" or "02:03.500" in seconds
function seconds(stamp: string) {
  const parts = stamp.replace(',', '.').split(':').map(Number)
  return parts.reduce((total, part) => total * 60 + part, 0)
}

// What is not spoken: sound notes ([Music], (laughs)), music signs, the ">>" that marks a new speaker.
function clean(line: string) {
  return line
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => entities[entity])
    .replace(/\[[^\]]*\]|\([^)]*\)|[♪♫]/g, ' ')
    .replace(/^\s*(?:>>|-)\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseVtt(vtt: string): Cue[] {
  const cues: Cue[] = []
  for (const block of vtt.replace(/\r/g, '').split(/\n{2,}/)) {
    const lines = block.split('\n')
    const at = lines.findIndex((line) => line.includes('-->'))
    if (at < 0) continue
    const match = /([\d:.,]+)\s*-->\s*([\d:.,]+)/.exec(lines[at])
    if (!match) continue
    const text = lines
      .slice(at + 1)
      .map(clean)
      .filter(Boolean)
      .join('\n')
    cues.push({ start: seconds(match[1]), end: seconds(match[2]), text })
  }
  return cues
}

type Word = { word: string; start: number; end: number }

// Automatic captions repeat the line above in every cue and add tiny filler cues; each spoken line is kept once.
// The words of a line share the time of its cue evenly: close enough to start and stop a phrase.
function words(cues: Cue[]): Word[] {
  const result: Word[] = []
  let previous = ''
  for (const cue of cues) {
    if (cue.end - cue.start < 0.1) continue
    const lines = cue.text.split('\n').filter(Boolean)
    lines.forEach((line, index) => {
      if (line === previous) return
      previous = line
      const parts = line.split(' ')
      // a two-line cue shows the older line first: it was spoken before this cue began
      const from = lines.length > 1 && index === 0 ? Math.max(0, cue.start - 1) : cue.start
      const step = (cue.end - from) / parts.length
      parts.forEach((word, i) => result.push({ word, start: from + step * i, end: from + step * (i + 1) }))
    })
  }
  return result
}

export type PhraseOptions = { minWords?: number; maxWords?: number; maxSeconds?: number }

// Lines that talk to the viewer of the video, not to the learner of the clip.
export const isPromo = (text: string) =>
  /\b(click (here|the link)|subscribe|next video|follow us|visit (our|the) website|thanks for watching|link in the description)\b/i.test(
    text,
  )

// About how long a line takes to say: ~2.5 words a second and a breath.
const spokenSeconds = (wordCount: number) => Math.min(Math.max(wordCount * 0.4 + 1, 3), 8)

export function makePhrases(cues: Cue[], { minWords = 5, maxWords = 14, maxSeconds = 8 }: PhraseOptions = {}): Phrase[] {
  const stream = words(cues)
  const groups: Word[][] = []
  let group: Word[] = []
  const close = () => {
    if (group.length) groups.push(group)
    group = []
  }
  for (const item of stream) {
    group.push(item)
    const sentenceEnd = /[.?!]["')]*$/.test(item.word)
    const softEnd = /[,;:]$/.test(item.word) && group.length >= minWords + 3
    if (sentenceEnd || softEnd || group.length >= maxWords) close()
  }
  close()
  // a group that is too short joins the next one, if the two together are not too long
  const merged: Word[][] = []
  for (const next of groups) {
    const last = merged[merged.length - 1]
    if (last && last.length < minWords && last.length + next.length <= maxWords) last.push(...next)
    else merged.push([...next])
  }
  const phrases = merged
    .filter((words) => words.length >= minWords && !isPromo(words.map((item) => item.word).join(' ')))
    .map((words) => {
      const start = Math.max(0, Math.round((words[0].start - 0.15) * 10) / 10)
      const end = Math.round((words[words.length - 1].end + 0.35) * 10) / 10
      // a window much longer than the words need plays silence or the next speaker: cut it back
      return end - start > maxSeconds
        ? {
            text: words.map((item) => item.word).join(' '),
            start,
            end: Math.round((start + spokenSeconds(words.length)) * 10) / 10,
            trimmed: true,
          }
        : { text: words.map((item) => item.word).join(' '), start, end }
    })
  // a caption can stay on screen after the words are spoken: a phrase ends where the next one begins
  return phrases.map((phrase, i) => {
    const next = phrases[i + 1]
    return next && next.start > phrase.start && next.start + 0.4 < phrase.end
      ? { ...phrase, end: Math.round((next.start + 0.4) * 10) / 10 }
      : phrase
  })
}

// "https://youtu.be/ID", "https://www.youtube.com/watch?v=ID", "/shorts/ID", "/embed/ID" or the bare id.
export function youtubeId(input: string) {
  const text = input.trim()
  if (/^[\w-]{11}$/.test(text)) return text
  try {
    const url = new URL(text)
    const id = url.hostname.endsWith('youtu.be')
      ? url.pathname.slice(1)
      : (url.searchParams.get('v') ?? url.pathname.split('/').pop() ?? '')
    return /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}
