// Makes a listening-dictation clip from a YouTube link: downloads the captions (not the video) with yt-dlp,
// cuts them into short phrases with their times and adds the clip to src/data/listeningVideoClips.json.
//
//   node scripts/make-clip.mjs <link or id> [--title "A short title"] [--level B1] [--min 5] [--max 14] [--file captions.vtt] [--from 15] [--to 70]
//
// --from and --to (seconds) keep only the phrases inside that part of the video.
//
// With --file the captions come from a .vtt file you already have (the link only gives the video id).
// If YouTube answers "confirm you are not a bot", sign in in your browser and add --browser chrome (or edge, firefox):
// yt-dlp then reads that browser's cookies. Only do this on your own computer.
//
// Needs yt-dlp (pip install yt-dlp). Manual captions are preferred over the automatic ones. The text is
// only a draft: read the phrases (and listen to the video) before it goes to learners.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makePhrases, parseVtt, youtubeId } from '../src/services/captionPhrases.ts'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at >= 0 ? args[at + 1] : fallback
}
const input = args.find((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'))
const id = input && youtubeId(input)
if (!id) {
  console.error('Give a YouTube link or the 11-character video id.')
  process.exit(1)
}
const level = option('level', 'B1')
if (!['A2', 'B1', 'B2'].includes(level)) {
  console.error('--level is A2, B1 or B2.')
  process.exit(1)
}

let manual = true
let cues
if (option('file')) {
  cues = parseVtt(readFileSync(option('file'), 'utf8'))
} else {
  const dir = mkdtempSync(join(tmpdir(), 'clip-'))
  // pip may not put the yt-dlp command on PATH: then it is run as a Python module
  const run = (args) => {
    try {
      return execFileSync('yt-dlp', args, { stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      return execFileSync('python', ['-m', 'yt_dlp', ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    }
  }
  const download = (flags) =>
    run([
      '--skip-download',
      '--sub-langs',
      'en.*,en',
      '--sub-format',
      'vtt',
      ...(option('browser') ? ['--cookies-from-browser', option('browser')] : []),
      ...flags,
      '-o',
      join(dir, '%(id)s.%(ext)s'),
      `https://www.youtube.com/watch?v=${id}`,
    ])
  const found = () => readdirSync(dir).find((file) => file.endsWith('.vtt'))
  try {
    download(['--write-subs'])
    if (!found()) {
      manual = false
      download(['--write-auto-subs'])
    }
  } catch (error) {
    const lines = String(error.stderr || error.message)
      .trim()
      .split(/\r?\n/)
    if (error.code === 'ENOENT') console.error('yt-dlp is not installed. Install it with: pip install yt-dlp')
    else if (/not a bot/i.test(lines.join(' ')))
      console.error(
        'YouTube asks to confirm you are not a bot. Add --browser chrome (or edge, firefox) after signing in there, or download the .vtt yourself and use --file.',
      )
    else console.error(lines.find((line) => line.startsWith('ERROR')) ?? lines.slice(-2).join(' | '))
    rmSync(dir, { recursive: true, force: true })
    process.exit(1)
  }
  const file = found()
  if (!file) {
    console.error('This video has no English captions.')
    rmSync(dir, { recursive: true, force: true })
    process.exit(1)
  }
  cues = parseVtt(readFileSync(join(dir, file), 'utf8'))
  rmSync(dir, { recursive: true, force: true })
}

const all = makePhrases(cues, { minWords: Number(option('min', 5)), maxWords: Number(option('max', 14)) })
const from = Number(option('from', 0))
const to = Number(option('to', Infinity))
const phrases = all.filter((phrase) => phrase.start >= from - 0.5 && phrase.end <= to + 1)
const flagged = phrases.filter((phrase) => phrase.trimmed).length
if (!phrases.length) {
  console.error('No phrases came out of the captions.')
  process.exit(1)
}

const dataFile = new URL('../src/data/listeningVideoClips.json', import.meta.url)
const clips = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, 'utf8')) : []
const clip = {
  id: `video-${id}`,
  title: option('title', `Video ${id}`),
  level,
  source: { kind: 'youtube', videoId: id },
  lines: phrases.map(({ text, start, end }) => ({ text, start, end })),
}
const at = clips.findIndex((entry) => entry.id === clip.id)
if (at >= 0) clips[at] = clip
else clips.push(clip)
writeFileSync(dataFile, `${JSON.stringify(clips, null, 2)}\n`)

console.log(`${manual ? 'Manual' : 'AUTOMATIC'} captions, ${phrases.length} phrases → src/data/listeningVideoClips.json (${clip.id})`)
if (!manual) console.log('Automatic captions have mistakes and often no punctuation: check every phrase against the video.')
if (flagged) console.log(`${flagged} phrase(s) marked ~ had a window much longer than the words: their end was cut back, check them.`)
phrases.forEach((phrase, i) =>
  console.log(`${String(i + 1).padStart(2)}.${phrase.trimmed ? '~' : ' '}[${phrase.start}–${phrase.end}] ${phrase.text}`),
)
