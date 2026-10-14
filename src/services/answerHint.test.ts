import { describe, expect, it } from 'vitest'
import { answerHint, looksPhrasal, wordCount } from './answerHint'

describe('answerHint', () => {
  it('counts words, and a hyphenated word is one word', () => {
    expect(wordCount('pass')).toBe(1)
    expect(wordCount('  show   up ')).toBe(2)
    expect(wordCount('check-up')).toBe(1)
    expect(wordCount('')).toBe(0)
  })

  it('says how many words and what kind of word', () => {
    expect(answerHint('pass', { partOfSpeech: 'verb', subtopic: 'Exams' })).toBe('1 word · verb')
    expect(answerHint('job offer', { partOfSpeech: 'noun', subtopic: 'Job Interview' })).toBe('2 words · noun')
    expect(answerHint('applicant', { partOfSpeech: 'noun' })).toBe('1 word · noun')
  })

  it('calls a word from a phrasal verb subtopic a phrasal verb', () => {
    expect(answerHint('show up', { partOfSpeech: 'phrase', subtopic: 'Everyday Phrasal Verbs' })).toBe('2 words · phrasal verb')
  })

  it('shows only the count when the kind is unknown or "other"', () => {
    expect(answerHint('whatever', undefined)).toBe('1 word')
    expect(answerHint('odd thing', { partOfSpeech: 'other' })).toBe('2 words')
  })

  it('shows nothing for an empty answer', () => {
    expect(answerHint('   ')).toBe('')
  })

  it('also recognises a phrasal verb filed outside the phrasal verbs subtopic, but not look-alikes', () => {
    for (const word of ['tidy up', 'hang out', 'try on', 'catch up with', 'fall out with', 'switch off'])
      expect(answerHint(word, { partOfSpeech: 'phrase', subtopic: 'Around the House' })).toBe(
        `${word.split(' ').length} words · phrasal verb`,
      )
    for (const word of ['sold out', 'straight on', 'in advance', 'on time', 'run errands', 'get lost', 'bus stop'])
      expect(looksPhrasal(word)).toBe(false)
    expect(answerHint('bus stop', { partOfSpeech: 'noun' })).toBe('2 words · noun') // only a "phrase" is guessed at
  })
})
