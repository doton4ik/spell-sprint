import { describe, expect, it } from 'vitest'
import type { PracticeTask } from '../types/practice'
import { closestAnswer, comparable, isAcceptedAnswer, russianAnswers } from './answerMatch'

const task = (answer: string, acceptedAnswers?: string[]): PracticeTask => ({ id: 't', type: 'translate-ru-en', topic: '', level: 'B1', prompt: '', answer, acceptedAnswers, hint: '', rule: '', errorCategory: '' })

describe('isAcceptedAnswer', () => {
  it('ignores case, spaces around, final punctuation and ё', () => {
    expect(isAcceptedAnswer('  Environment. ', task('environment'))).toBe(true)
    expect(isAcceptedAnswer('ещё', task('еще'))).toBe(true)
  })
  it('treats a hyphen or a space the same (check-in, check in)', () => {
    expect(isAcceptedAnswer('check in desk', task('check-in desk'))).toBe(true)
  })
  it('accepts the alternatives and nothing else', () => {
    const rubbish = task('rubbish', ['trash', 'garbage'])
    expect(isAcceptedAnswer('trash', rubbish)).toBe(true)
    expect(isAcceptedAnswer('tresh', rubbish)).toBe(false)
  })
  it('does not accept a spelling mistake', () => {
    expect(isAcceptedAnswer('enviroment', task('environment'))).toBe(false)
  })
})

describe('closestAnswer', () => {
  it('picks the accepted answer the learner aimed at', () => {
    expect(closestAnswer('tresh', task('rubbish', ['trash', 'garbage']))).toBe('trash')
  })
  it('keeps the main answer on a tie', () => {
    expect(closestAnswer('xxxxxx', task('abc', ['abd']))).toBe('abc')
  })
})

describe('russianAnswers', () => {
  it('splits meanings on , ; / but not inside brackets', () => {
    const answers = russianAnswers('больной, ноющий (о горле, мышцах)')
    expect(answers).toContain('больной')
    expect(answers).toContain('ноющий')
    expect(answers.some((answer) => answer === 'мышцах)' || answer === 'мышцах')).toBe(false)
  })
  it('accepts a meaning without its note', () => {
    expect(russianAnswers('парень (молодой человек)').map(comparable)).toContain(comparable('парень'))
  })
})
