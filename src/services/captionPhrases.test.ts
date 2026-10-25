import { describe, expect, it } from 'vitest'
import { makePhrases, parseVtt, youtubeId } from './captionPhrases'

const manual = `WEBVTT

00:00:01.000 --> 00:00:03.000
Excuse me, is this the train
to Manchester?

00:00:03.500 --> 00:00:06.000
[Music]
Yes, but it is running twenty minutes late.

00:00:06.500 --> 00:00:07.000
Oh.
`

describe('parseVtt', () => {
  it('reads times and text, and drops sound notes', () => {
    const cues = parseVtt(manual)
    expect(cues).toHaveLength(3)
    expect(cues[0]).toEqual({ start: 1, end: 3, text: 'Excuse me, is this the train\nto Manchester?' })
    expect(cues[1].text).toBe('Yes, but it is running twenty minutes late.')
  })
  it('reads short stamps and the tags of automatic captions', () => {
    const cues = parseVtt('WEBVTT\n\n01:05.250 --> 01:07.000 align:start position:0%\nso<00:01:05.500><c> what</c><c> now</c>\n')
    expect(cues).toEqual([{ start: 65.25, end: 67, text: 'so what now' }])
  })
})

describe('makePhrases', () => {
  it('cuts at the end of a sentence and gives each phrase its time', () => {
    const phrases = makePhrases(parseVtt(manual))
    expect(phrases.map((phrase) => phrase.text)).toEqual([
      'Excuse me, is this the train to Manchester?',
      'Yes, but it is running twenty minutes late.',
    ])
    expect(phrases[0].start).toBeLessThanOrEqual(1)
    expect(phrases[0].end).toBeGreaterThanOrEqual(3)
    expect(phrases[1].start).toBeGreaterThan(phrases[0].start)
  })
  it('does not let a phrase run into the next one', () => {
    const vtt = `WEBVTT

00:00:10.000 --> 00:00:20.000
Oh, not much, just sitting around doing nothing.

00:00:13.000 --> 00:00:18.000
Lucky you! Do you not have work to do?
`
    const [first, second] = makePhrases(parseVtt(vtt))
    expect(second.start).toBeGreaterThan(first.start)
    expect(first.end).toBeLessThanOrEqual(second.start + 0.5)
  })
  it('drops lines that talk to the viewer of the video', () => {
    const vtt = `WEBVTT

00:00:01.000 --> 00:00:04.000
Lovely to meet you, said the old man.

00:00:05.000 --> 00:00:08.000
Click here to learn eight different ways to say hello.

00:00:09.000 --> 00:00:12.000
And click here to subscribe to our channel.
`
    expect(makePhrases(parseVtt(vtt)).map((phrase) => phrase.text)).toEqual(['Lovely to meet you, said the old man.'])
  })
  it('cuts back a window that is much longer than the words', () => {
    const vtt = `WEBVTT

00:01:00.000 --> 00:01:12.000
But what is his name, that is right.
`
    const [phrase] = makePhrases(parseVtt(vtt))
    expect(phrase.trimmed).toBe(true)
    expect(phrase.end - phrase.start).toBeLessThanOrEqual(8)
    expect(phrase.start).toBeLessThanOrEqual(60)
  })
  it('leaves a normal window alone', () => {
    const [phrase] = makePhrases(parseVtt('WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nExcuse me, is this the train to Manchester?\n'))
    expect(phrase.trimmed).toBeUndefined()
  })
  it('keeps a line that automatic captions repeat only once', () => {
    const auto = `WEBVTT

00:00:00.000 --> 00:00:02.000
we went to the shop

00:00:02.000 --> 00:00:02.010
we went to the shop

00:00:02.010 --> 00:00:04.000
we went to the shop
and bought some bread today
`
    const phrases = makePhrases(parseVtt(auto), { maxWords: 20 })
    expect(phrases).toHaveLength(1)
    expect(phrases[0].text).toBe('we went to the shop and bought some bread today')
  })
  it('splits text without punctuation at the longest length', () => {
    const long = Array.from({ length: 30 }, (_, i) => `word${i}`).join(' ')
    const phrases = makePhrases([{ start: 0, end: 30, text: long }], { maxWords: 12 })
    expect(phrases.every((phrase) => phrase.text.split(' ').length <= 12)).toBe(true)
    expect(phrases.map((phrase) => phrase.text).join(' ')).toBe(long)
  })
})

describe('youtubeId', () => {
  it('finds the id in the usual links', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=abcDEF12345&t=5s')).toBe('abcDEF12345')
    expect(youtubeId('https://youtu.be/abcDEF12345?si=x')).toBe('abcDEF12345')
    expect(youtubeId('https://www.youtube.com/shorts/abcDEF12345')).toBe('abcDEF12345')
    expect(youtubeId('abcDEF12345')).toBe('abcDEF12345')
  })
  it('refuses something that is not a video link', () => {
    expect(youtubeId('https://example.com/watch')).toBeNull()
    expect(youtubeId('hello')).toBeNull()
  })
})
