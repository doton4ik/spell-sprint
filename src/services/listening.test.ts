import { beforeEach, describe, expect, it } from 'vitest'
import { listeningClips } from '../data/listeningClips'
import {
  checkLine,
  clipScore,
  getListeningProgress,
  lastListenedClipId,
  lineHint,
  mergeListeningProgress,
  missedWords,
  recordListeningAnswer,
  saveClipScore,
} from './listening'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts } from './practiceStorage'

describe('checkLine', () => {
  it('accepts the line with other case, punctuation and apostrophe', () => {
    expect(checkLine("Thanks, I'll go and buy a ticket now.", 'thanks i’ll go and buy a ticket now').correct).toBe(true)
  })
  it('accepts a contraction for the long form and the other way round', () => {
    expect(checkLine('That is a pity.', "That's a pity").correct).toBe(true)
    expect(checkLine("It's six hundred a month.", 'It is six hundred a month').correct).toBe(true)
  })
  it('accepts a number written as a word or as digits', () => {
    expect(checkLine('It leaves in five minutes.', 'It leaves in 5 minutes').correct).toBe(true)
  })
  it('does not accept its for it’s', () => {
    expect(checkLine("It's late.", 'Its late').correct).toBe(false)
  })
  it('marks the words that differ', () => {
    const result = checkLine('The water is included.', 'The watter is include')
    expect(result.correct).toBe(false)
    expect(result.given.filter((word) => !word.same).map((word) => word.text)).toEqual(['watter', 'include'])
  })
  it('counts an empty answer as a miss', () => {
    const result = checkLine('Hello there.', '  ')
    expect(result.correct).toBe(false)
    expect(result.expected.every((word) => !word.same)).toBe(true)
  })
})

describe('clipScore', () => {
  it('is the share of right lines', () => {
    expect(clipScore([true, true, false, true])).toBe(75)
    expect(clipScore([])).toBe(0)
  })
})

describe('listening clips', () => {
  it('have fixed unique ids and complete, readable lines', () => {
    expect(new Set(listeningClips.map((clip) => clip.id)).size).toBe(listeningClips.length)
    for (const clip of listeningClips)
      for (const line of clip.lines) {
        expect(line.text.trim()).toBe(line.text)
        // a hand-written line is a whole sentence; a phrase cut from a video may stop at a comma
        if (clip.source.kind === 'voice') expect(line.text).toMatch(/[.?!]$/)
        expect(line.text.split(/\s+/).length).toBeGreaterThanOrEqual(5)
        expect(line.text.split(/\s+/).length).toBeLessThanOrEqual(16)
        // one start time per word, in order, so the hint lights up the right word
        if (line.wordStarts) {
          expect(line.wordStarts).toHaveLength(line.text.split(/\s+/).length)
          expect([...line.wordStarts].sort((a, b) => a - b)).toEqual(line.wordStarts)
        }
      }
  })
  it('video lines have a start before their end', () => {
    for (const clip of listeningClips.filter((entry) => entry.source.kind === 'youtube'))
      for (const line of clip.lines) {
        expect(line.start).toBeDefined()
        expect(line.end).toBeGreaterThan(line.start ?? Infinity)
      }
  })
})

describe('lineHint', () => {
  it('shows the first letter and the length of every word, with the punctuation', () => {
    expect(lineHint("It is a pity, isn't it?")).toBe('I· i· a p···, i···· i·?')
  })
})

describe('saving answers', () => {
  beforeEach(() => window.localStorage.clear())

  it('saves a wrong line as a mistake of the Listening library', () => {
    recordListeningAnswer({ id: 'clip-a', title: 'A' }, 2, 'The shop opens at nine.', 'The shop open at nine', {
      correct: false,
      skipped: false,
      hintUsed: false,
    })
    const [attempt] = getPracticeAttempts()
    expect(attempt).toMatchObject({
      taskId: 'listen-clip-a-2',
      library: 'Listening',
      attemptMode: 'listen-write',
      isCorrect: false,
      needsReview: true,
      correctAnswer: 'The shop opens at nine.',
    })
  })
  it('saves a skipped line as a miss without an answer', () => {
    recordListeningAnswer({ id: 'clip-a', title: 'A' }, 0, 'Hello there my friend.', '', { correct: false, skipped: true, hintUsed: false })
    expect(getPracticeAttempts()[0]).toMatchObject({ wasSkipped: true, userAnswer: '', isCorrect: false })
  })
  it('a right line is not a mistake', () => {
    recordListeningAnswer({ id: 'clip-a', title: 'A' }, 1, 'Hello there my friend.', 'hello there my friend', {
      correct: true,
      skipped: false,
      hintUsed: false,
    })
    expect(getPracticeAttempts()[0]).toMatchObject({ isCorrect: true, needsReview: false })
  })
  it('keeps the best score of a clip', () => {
    saveClipScore('clip-a', 60)
    saveClipScore('clip-a', 40)
    expect(getListeningProgress()['clip-a']).toEqual({ best: 60, last: 40, plays: 2 })
  })
})

describe('merging progress from another device', () => {
  beforeEach(() => window.localStorage.clear())
  it('keeps the best score and the larger number of plays; the last score comes from the device that played more', () => {
    saveClipScore('clip-a', 80)
    saveClipScore('clip-a', 50) // here: best 80, last 50, plays 2
    mergeListeningProgress({ 'clip-a': { best: 70, last: 70, plays: 1 }, 'clip-b': { best: 40, last: 40, plays: 5 } })
    expect(getListeningProgress()).toEqual({ 'clip-a': { best: 80, last: 50, plays: 2 }, 'clip-b': { best: 40, last: 40, plays: 5 } })
    mergeListeningProgress({ 'clip-a': { best: 95, last: 95, plays: 4 } })
    expect(getListeningProgress()['clip-a']).toEqual({ best: 95, last: 95, plays: 4 })
  })
  it('ignores what is not progress', () => {
    saveClipScore('clip-a', 80)
    for (const value of [null, 'text', [1, 2], { 'clip-a': null }, { 'clip-a': { best: '100', last: 1, plays: 1 } }])
      mergeListeningProgress(value)
    expect(getListeningProgress()).toEqual({ 'clip-a': { best: 80, last: 80, plays: 1 } })
  })
})

describe('missedWords', () => {
  const attempt = (taskId: string, correctAnswer: string, userAnswer: string, createdAt: string, extra = {}) =>
    ({ taskId, correctAnswer, userAnswer, createdAt, isCorrect: false, wasSkipped: false, ...extra }) as PracticeAttempt
  it('counts the words missed in wrong lines, most often first, and ignores short words and skipped lines', () => {
    const list = [
      attempt('listen-video-abc-1', 'I was really nervous today.', 'I was realy nervus today.', '2026-11-01T10:00:00Z'),
      attempt('listen-video-abc-4', 'It was really hard.', 'It was relly hard.', '2026-11-02T10:00:00Z'),
      attempt('listen-video-xyz-2', 'She went home.', '', '2026-11-02T11:00:00Z', { wasSkipped: true }),
      attempt('listen-video-xyz-3', 'He is here.', 'He is here.', '2026-11-02T12:00:00Z', { isCorrect: true }),
      attempt('spell-1', 'Something else entirely.', 'Somethin', '2026-11-02T12:00:00Z'),
    ]
    const result = missedWords(list)
    expect(result[0]).toMatchObject({ word: 'really', count: 2, clipId: 'video-abc', text: 'It was really hard.' })
    expect(result.map((item) => item.word)).toContain('nervous')
    expect(result.map((item) => item.word)).not.toContain('went')
  })
  it('finds the clip listened to last', () => {
    const list = [attempt('listen-a-0', 'x', 'y', '2026-11-01T10:00:00Z'), attempt('listen-video-b-12', 'x', 'y', '2026-11-03T10:00:00Z')]
    expect(lastListenedClipId(list)).toBe('video-b')
    expect(lastListenedClipId([])).toBeNull()
  })
})

describe('checkLine: what was heard can be written in more than one way', () => {
  it('accepts British and American spelling of the same word', () => {
    expect(
      checkLine("That's what we'll be discussing in this programme.", 'That is what we will be discussing in this program').correct,
    ).toBe(true)
    expect(checkLine('Maybe about a litre?', 'maybe about a liter').correct).toBe(true)
    expect(checkLine('Many people are obsessed with maximizing choice.', 'Many people are obsessed with maximising choice').correct).toBe(
      true,
    )
    expect(checkLine('I just need to practise more.', 'I just need to practice more').correct).toBe(true)
    expect(checkLine("It's okay to make mistakes.", 'its ok to make mistakes').correct).toBe(false) // "its" is still a mistake
    expect(checkLine("It's okay to make mistakes.", "It's OK to make mistakes").correct).toBe(true)
  })
  it('does not mark the other spelling when something else is wrong', () => {
    const result = checkLine('I eat fruit and yogurt for breakfast.', 'I eat fruit and yoghurt for brekfast')
    expect(result.correct).toBe(false)
    expect(result.given.filter((word) => !word.same).map((word) => word.text)).toEqual(['brekfast'])
  })
  it('still rejects a misspelling that only looks like the other spelling', () => {
    expect(checkLine('What a surprise that was.', 'What a surprize that was').correct).toBe(false)
    expect(checkLine('The colour is nice.', 'The colr is nice').correct).toBe(false)
  })
  it('accepts any number in digits or in words', () => {
    expect(
      checkLine('Lions, for example, can sleep up to 20 hours a day.', 'lions for example can sleep up to twenty hours a day').correct,
    ).toBe(true)
    expect(
      checkLine('On average, users stuck with a single task for 40 seconds,', 'On average users stuck with a single task for forty seconds')
        .correct,
    ).toBe(true)
    expect(
      checkLine('down from 75 seconds measured just five years earlier.', 'down from seventy-five seconds measured just 5 years earlier')
        .correct,
    ).toBe(true)
    expect(
      checkLine('and it says you can do 50 kilometers an hour maximum.', 'and it says you can do fifty kilometres an hour maximum').correct,
    ).toBe(true)
    expect(checkLine('for 40 seconds,', 'for fourteen seconds').correct).toBe(false)
  })
})

describe('video clips', () => {
  const video = listeningClips.filter((clip) => clip.source.kind === 'youtube')
  it('have clean text: no dashes, brackets, stray spaces or doubled words', () => {
    for (const clip of video)
      for (const line of clip.lines) {
        expect(line.text, `${clip.id}: ${line.text}`).not.toMatch(/[—–[\]()]|\s[,.;:!?]|\s{2,}/)
        expect(line.text, `${clip.id}: ${line.text}`).toMatch(/[.?!,;:]$/)
        const words = line.text
          .toLowerCase()
          .replace(/[^a-z' ]/g, '')
          .split(' ')
        // "that that" and "had had" can be right; the recognition doubled words like "and And"
        const doubled = words.filter((word, i) => word === words[i + 1] && !['that', 'had'].includes(word))
        expect(doubled, `${clip.id}: ${line.text}`).toEqual([])
      }
  })
  it('a line lasts between one and twelve seconds and lines follow each other', () => {
    for (const clip of video) {
      let before = -1
      for (const line of clip.lines) {
        const seconds = (line.end ?? 0) - (line.start ?? 0)
        expect(seconds, `${clip.id}: ${line.text}`).toBeGreaterThan(1)
        expect(seconds, `${clip.id}: ${line.text}`).toBeLessThanOrEqual(12)
        expect(line.start, `${clip.id}: ${line.text}`).toBeGreaterThan(before)
        before = line.start ?? 0
      }
    }
  })
  it('a second part comes right after the first part of the same video', () => {
    const ids = listeningClips.map((clip) => clip.id)
    for (const id of ids.filter((entry) => entry.endsWith('-2') && ids.includes(entry.slice(0, -2))))
      expect(ids.indexOf(id)).toBe(ids.indexOf(id.slice(0, -2)) + 1)
  })
  it('there are clips of every level, read by a voice and from a video', () => {
    for (const level of ['A2', 'B1', 'B2'])
      for (const kind of ['voice', 'youtube'])
        expect(
          listeningClips.filter((clip) => clip.level === level && clip.source.kind === kind).length,
          `${level} ${kind}`,
        ).toBeGreaterThanOrEqual(3)
  })
})
