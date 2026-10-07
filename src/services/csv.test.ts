import { describe, expect, it } from 'vitest'
import { parseCsvRows } from './csv'

describe('parseCsvRows', () => {
  it('reads quoted fields with commas, doubled quotes and new lines', () => {
    expect(parseCsvRows('word,example\nbill,"The bill, please."\nquote,"He said ""hi""\non two lines"')).toEqual([
      ['word', 'example'], ['bill', 'The bill, please.'], ['quote', 'He said "hi"\non two lines'],
    ])
  })
  it('handles Windows line endings and skips empty lines', () => {
    expect(parseCsvRows('a,b\r\n\r\nc,d\r\n')).toEqual([['a', 'b'], ['c', 'd']])
  })
})
