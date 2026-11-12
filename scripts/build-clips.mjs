// Builds the video clips of Listening (src/data/listeningVideoClips.json) from the hand-checked lines in
// research/listening/<clip id>.json and the recognised words of each video (.asr/work/<video id>.json).
//
//   node scripts/build-clips.mjs                 builds every clip and writes the data file
//   node scripts/build-clips.mjs --check <file>  checks one or more clip files and prints the result, writes nothing
//
// A clip file:
//   { "id": "video-<video id>", "title": "...", "level": "A2" | "B1" | "B2", "videoId": "<video id>",
//     "lines": [ { "at": 13.3, "text": "I'm Beth. And I'm Neil." }, ... ] }
// "at" is about the second the line starts at (as printed by scripts/clip-words.mjs); "text" is what is said, checked
// by a person. The script finds the recognised words that match the text near that second and takes the exact start,
// end and the time of every word from them, so a corrected word ("wood" -> "would") keeps the right times.
// A clip made by scripts/make-clip.mjs that has no file here is kept as it is.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { plain } from '../src/services/contractions.ts'

const LEAD = 0.15 // as in src/services/wordPhrases.ts: the line starts a little before its first word
const TAIL = 0.3 // and ends a little after its last one
const SEARCH = 8 // seconds around "at" in which the line is looked for
const MIN_WORDS = 5
const MAX_WORDS = 16
const MIN_SECONDS = 1.2
const MAX_SECONDS = 12

const root = new URL('../', import.meta.url)
const linesDir = new URL('research/listening/', root)
const dataFile = new URL('src/data/listeningVideoClips.json', root)
const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const files = checkOnly
  ? args.filter((arg) => arg !== '--check')
  : readdirSync(linesDir)
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map((name) => fileURLToPath(new URL(name, linesDir)))
if (!files.length) {
  console.error('No clip files. Give them after --check, or put them in research/listening/.')
  process.exit(1)
}

const key = (word) => plain(word).replace(/\s+/g, '')
// How many words must be changed, added or removed to turn one list into the other
function distance(a, b) {
  let row = b.map((_, j) => j + 1)
  for (let i = 0; i < a.length; i += 1) {
    let diagonal = i
    let left = i + 1
    row = row.map((above, j) => {
      const value = a[i] === b[j] ? diagonal : 1 + Math.min(diagonal, left, above)
      diagonal = above
      left = value
      return value
    })
  }
  return row.length ? row[row.length - 1] : a.length
}

const problems = []
const notes = []
function buildClip(file) {
  const clip = JSON.parse(readFileSync(file, 'utf8'))
  const fail = (text) => problems.push(`${clip.id ?? file}: ${text}`)
  if (!/^video-[\w-]+$/.test(clip.id ?? '')) fail('"id" must look like video-<video id>')
  if (!clip.title) fail('no "title"')
  if (!['A2', 'B1', 'B2'].includes(clip.level)) fail('"level" must be A2, B1 or B2')
  const wordsFile = new URL(`.asr/work/${clip.videoId}.json`, root)
  if (!existsSync(wordsFile)) {
    fail(`no recognised words for video ${clip.videoId} (.asr/work/)`)
    return null
  }
  const words = JSON.parse(readFileSync(wordsFile, 'utf8'))
  const keys = words.map((word) => key(word.w))
  let lastWord = -1
  let lastEnd = 0
  const seen = new Set()
  const lines = []
  for (const [index, line] of (clip.lines ?? []).entries()) {
    const where = `line ${index} "${String(line.text).slice(0, 40)}"`
    const text = String(line.text ?? '').trim()
    const textWords = text.split(/\s+/).filter(Boolean)
    if (textWords.length < MIN_WORDS || textWords.length > MAX_WORDS)
      fail(`${where}: ${textWords.length} words (must be ${MIN_WORDS}-${MAX_WORDS})`)
    if (!/^["“]?[A-Za-z0-9]/.test(text)) fail(`${where}: must start with a letter or a number`)
    if (!/[.?!,;:]["”]?$/.test(text)) fail(`${where}: must end with a punctuation mark`)
    if (/\s[,.;:!?]|\s{2,}|[—–]|[[\]()]/.test(text)) fail(`${where}: stray space, dash or bracket`)
    if (seen.has(plain(text))) fail(`${where}: the same line twice`)
    seen.add(plain(text))
    if (typeof line.at !== 'number') {
      fail(`${where}: no "at"`)
      continue
    }
    // the stretch of recognised words that reads most like the text, as near to "at" as possible
    const wanted = textWords.map(key).filter(Boolean)
    let best = null
    for (let from = 0; from < words.length; from += 1) {
      if (Math.abs(words[from].s - line.at) > SEARCH) continue
      for (let size = Math.max(1, wanted.length - 3); size <= wanted.length + 3 && from + size <= words.length; size += 1) {
        const score = distance(wanted, keys.slice(from, from + size).filter(Boolean))
        const off = Math.abs(words[from].s - line.at)
        if (!best || score < best.score || (score === best.score && off < best.off)) best = { from, to: from + size - 1, score, off }
      }
    }
    if (!best || best.score > Math.max(2, Math.round(wanted.length * 0.3))) {
      fail(`${where}: not found near ${line.at} s${best ? ` (closest differs in ${best.score} words)` : ''}`)
      continue
    }
    const heard = words.slice(best.from, best.to + 1)
    if (best.from <= lastWord) fail(`${where}: overlaps the line before it`)
    lastWord = best.to
    const start = Math.max(0, Math.round((heard[0].s - LEAD) * 10) / 10)
    const end = Math.round((heard[heard.length - 1].e + TAIL) * 10) / 10
    if (end - start < MIN_SECONDS || end - start > MAX_SECONDS)
      fail(`${where}: lasts ${(end - start).toFixed(1)} s (must be ${MIN_SECONDS}-${MAX_SECONDS})`)
    if (start < lastEnd - 0.6) fail(`${where}: starts before the line before it has ended`)
    lastEnd = end
    // one time per written word; when the number of words differs from what was recognised, they are spread evenly
    const wordStarts = textWords.map((_, i) => {
      const at = textWords.length === heard.length ? i : Math.round((i * (heard.length - 1)) / Math.max(1, textWords.length - 1))
      return Math.round(heard[at].s * 100) / 100
    })
    for (let i = 1; i < wordStarts.length; i += 1) wordStarts[i] = Math.max(wordStarts[i], wordStarts[i - 1])
    if (best.score) notes.push(`${clip.id} #${index}: text "${text}" | recognised "${heard.map((word) => word.w).join(' ')}"`)
    lines.push({ text, start, end, wordStarts })
  }
  if (lines.length < 8) fail(`only ${lines.length} lines (a clip has at least 8)`)
  return { id: clip.id, title: clip.title, level: clip.level, source: { kind: 'youtube', videoId: clip.videoId }, lines }
}

const built = files.map(buildClip).filter(Boolean)
if (notes.length) {
  console.log(`Corrected against the recognised speech (${notes.length}):`)
  for (const note of notes) console.log(`  ${note}`)
}
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
for (const clip of built) {
  const seconds = clip.lines.reduce((sum, line) => sum + line.end - line.start, 0)
  console.log(`${clip.id}: ${clip.lines.length} lines, ${Math.round(seconds)} s of speech (${clip.level}, ${clip.title})`)
  if (checkOnly) for (const [i, line] of clip.lines.entries()) console.log(`  #${i} [${line.start}-${line.end}] ${line.text}`)
}
if (checkOnly) process.exit(0)

// Videos keep their place in the data file; a new video goes to the end. A clip without a file here stays as it is.
const old = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, 'utf8')) : []
const byId = new Map(built.map((clip) => [clip.id, clip]))
const all = old.map((clip) => byId.get(clip.id) ?? clip)
for (const clip of built) if (!old.some((entry) => entry.id === clip.id)) all.push(clip)
// The clips of one video stand together, the first part first ("video-<id>" before "video-<id>-2").
const videos = [...new Set(all.map((clip) => clip.source.videoId))]
const result = videos.flatMap((videoId) =>
  all.filter((clip) => clip.source.videoId === videoId).sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id)),
)
writeFileSync(dataFile, `${JSON.stringify(result, null, 2)}\n`)
console.log(`\nWrote ${result.length} clips to src/data/listeningVideoClips.json (run prettier on it).`)
