// Prints the recognised words of a video (from .asr/work/<video id>.json, made by scripts/make-clip.mjs) as short
// rows, each with the second it starts at. Read it to choose the lines of a listening clip by hand
// (research/listening/<clip id>.json, built by scripts/build-clips.mjs).
//
//   node scripts/clip-words.mjs <video id> [--from 60] [--to 180]
import { existsSync, readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at >= 0 ? Number(args[at + 1]) : fallback
}
const id = args.find((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'))
const file = new URL(`../.asr/work/${id}.json`, import.meta.url)
if (!id || !existsSync(file)) {
  console.error('No recognised words for this video. Run scripts/make-clip.mjs for it first (it keeps them in .asr/work/).')
  process.exit(1)
}
const from = option('from', 0)
const to = option('to', Infinity)
const words = JSON.parse(readFileSync(file, 'utf8')).filter((word) => word.e >= from && word.s <= to)

// A new row after a sentence end, after a pause, or after ten words.
let row = []
const flush = () => {
  if (row.length) console.log(`[${row[0].s.toFixed(1)}] ${row.map((word) => word.w).join(' ')}`)
  row = []
}
words.forEach((word, i) => {
  row.push(word)
  const next = words[i + 1]
  const pause = next ? next.s - word.e : 0
  if (/[.?!]["')]*$/.test(word.w) || pause >= 0.4 || row.length >= 10) {
    flush()
    if (pause >= 1.5) console.log(`        … ${pause.toFixed(1)} s without speech`)
  }
})
flush()
