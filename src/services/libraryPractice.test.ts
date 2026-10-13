import { describe, expect, it } from 'vitest'
import { gapSentence, getTaskById, getTasksForWordIds } from './libraryPractice'

describe('Fill the gap', () => {
  it('takes the word out of its example', () => {
    expect(gapSentence('I borrowed a book from the library.', 'library')).toBe('I borrowed a book from the _____.')
    expect(gapSentence('Weather changes fast here.', 'weather')).toBe('_____ changes fast here.')
    expect(gapSentence('We met at the bus stop.', 'bus stop')).toBe('We met at the _____.')
  })
  it('skips an example with another form of the word', () => {
    expect(gapSentence('She borrowed my pen.', 'borrow')).toBeNull()
    expect(gapSentence('Our neighbours are friendly.', 'neighbour')).toBeNull()
    expect(gapSentence(undefined, 'word')).toBeNull()
  })
})

describe('A second gap sentence', () => {
  const id = 'general-english-professional-communication-deadline' // base library; its second example is a Tatoeba sentence with the word in it

  it('is a task of its own, credited to its source, with the first example left out of the feedback', () => {
    const task = getTaskById(`library-${id}-gap2`)
    expect(task?.prompt).toContain('_____')
    expect(task?.extraExampleSource).toMatch(/^tatoeba:\d+$/)
    expect(task?.example).toBeUndefined()
    expect(getTaskById(`library-${id}-gap`)?.example).toBeTruthy()
  })

  it('takes one place in a session: one gap task per word, either sentence', () => {
    const seen = new Set<string>()
    for (let run = 0; run < 40; run += 1) {
      const tasks = getTasksForWordIds([id], 'fill-gap')
      expect(tasks).toHaveLength(1)
      seen.add(tasks[0].id)
    }
    expect([...seen].sort()).toEqual([`library-${id}-gap`, `library-${id}-gap2`])
  })
})
