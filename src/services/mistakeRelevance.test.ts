import { beforeEach, describe, expect, it } from 'vitest'
import { mixedPracticeTasks } from '../data/practice'
import { hiddenProofreadingTextIds } from '../data/proofreadingHidden'
import { setWordHidden } from './libraryPrefs'
import { getEveryWord } from './libraryStorage'
import { relevanceCheck } from './mistakeRelevance'

describe('relevanceCheck', () => {
  beforeEach(() => window.localStorage.clear())
  const knownId = () => getEveryWord()[0].wordId

  it('never counts a listening dictation line, which has no word id', () => {
    const relevant = relevanceCheck()
    expect(relevant({ taskId: 'listen-clip1-3' })).toBe(false)
    expect(relevant({ taskId: 'listen-' })).toBe(false)
    expect(relevant({ taskId: 'listen-clip1-3', wordId: undefined })).toBe(false)
    expect(relevant({ taskId: 'listen-clip1-3', wordId: '' })).toBe(false)
  })
  it('counts an answer about a word that is in the library', () => {
    expect(relevanceCheck()({ taskId: 'anything', wordId: knownId() })).toBe(true)
  })
  it('drops an answer about a word that has left the library', () => {
    expect(relevanceCheck()({ taskId: 'anything', wordId: 'no-such-word-anywhere' })).toBe(false)
  })
  it('drops an answer about a word the learner hid, and takes it back when the word is shown again', () => {
    const wordId = knownId()
    setWordHidden(wordId, true)
    expect(relevanceCheck()({ taskId: 't', wordId })).toBe(false)
    setWordHidden(wordId, false)
    expect(relevanceCheck()({ taskId: 't', wordId })).toBe(true)
  })
  it('hiding one word does not hide the others', () => {
    const [first, second] = getEveryWord()
    setWordHidden(first.wordId, true)
    const relevant = relevanceCheck()
    expect(relevant({ taskId: 't', wordId: first.wordId })).toBe(false)
    expect(relevant({ taskId: 't', wordId: second.wordId })).toBe(true)
  })
  it('a word id in a listening-looking task is still judged by the word', () => {
    expect(relevanceCheck()({ taskId: 'listen-clip1-3', wordId: knownId() })).toBe(true)
  })
  it('drops the retired early demo tasks', () => {
    const relevant = relevanceCheck()
    expect(mixedPracticeTasks.length).toBeGreaterThan(0)
    for (const task of mixedPracticeTasks) expect(relevant({ taskId: task.id })).toBe(false)
  })
  it('drops a task the learner hid with a task: key', () => {
    setWordHidden('task:custom-task-1', true)
    const relevant = relevanceCheck()
    expect(relevant({ taskId: 'custom-task-1' })).toBe(false)
    expect(relevant({ taskId: 'custom-task-2' })).toBe(true)
  })
  it('drops proofreading mistakes from a retired text and keeps the others', () => {
    const retired = [...hiddenProofreadingTextIds][0]
    const relevant = relevanceCheck()
    expect(relevant({ taskId: `proof-${retired}-spelling-colour` })).toBe(false)
    expect(relevant({ taskId: 'proof-some-live-text-spelling-colour' })).toBe(true)
  })
  it('matches a retired text id as a whole, not as a prefix of a longer id', () => {
    const retired = [...hiddenProofreadingTextIds][0]
    expect(relevanceCheck()({ taskId: `proof-${retired}extra-spelling-x` })).toBe(true)
  })
  it('keeps other word-less tasks', () => {
    expect(relevanceCheck()({ taskId: 'sprint-round-5' })).toBe(true)
  })
})
