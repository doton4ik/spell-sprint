import { describe, expect, it } from 'vitest'
import { diffStrings } from './spellDiff'

describe('diffStrings', () => {
  it('finds no edits in equal words', () => {
    expect(diffStrings('receive', 'receive')).toEqual({ distance: 0, ops: [] })
  })
  it('handles empty input on either side or both', () => {
    expect(diffStrings('', '')).toEqual({ distance: 0, ops: [] })
    const insert = diffStrings('', 'ab')
    expect(insert.distance).toBe(2)
    expect(insert.ops.map((op) => op.type)).toEqual(['insert', 'insert'])
    const remove = diffStrings('ab', '')
    expect(remove.distance).toBe(2)
    expect(remove.ops.map((op) => op.type)).toEqual(['delete', 'delete'])
  })
  it('reports a missing letter as a delete at its place in the expected word', () => {
    // "enviroment": the n before "ment" is gone
    const result = diffStrings('environment', 'enviroment')
    expect(result.distance).toBe(1)
    expect(result.ops).toHaveLength(1)
    expect(result.ops[0]).toMatchObject({ type: 'delete', expected: 'n', submitted: '' })
    expect('environment'[result.ops[0].expectedIndex]).toBe('n')
  })
  it('reports an extra letter as an insert, placed before the given expected index', () => {
    const result = diffStrings('necessary', 'neccessary')
    expect(result.distance).toBe(1)
    expect(result.ops).toHaveLength(1)
    expect(result.ops[0]).toMatchObject({ type: 'insert', expected: '', submitted: 'c' })
    expect('neccessary'[result.ops[0].submittedIndex]).toBe('c')
  })
  it('reports a wrong letter as a substitute', () => {
    const result = diffStrings('separate', 'seperate')
    expect(result.distance).toBe(1)
    expect(result.ops).toEqual([{ type: 'substitute', expectedIndex: 3, submittedIndex: 3, expected: 'a', submitted: 'e' }])
  })
  it('reports two swapped neighbours as one transpose, not two substitutions', () => {
    const result = diffStrings('receive', 'recieve')
    expect(result.distance).toBe(1)
    expect(result.ops).toEqual([{ type: 'transpose', expectedIndex: 3, submittedIndex: 3, expected: 'ei', submitted: 'ie' }])
  })
  it('is case sensitive: the caller decides whether to lower-case', () => {
    expect(diffStrings('Word', 'word').distance).toBe(1)
    expect(diffStrings('word', 'word').distance).toBe(0)
  })
  it('counts spaces as letters', () => {
    const result = diffStrings('ice cream', 'icecream')
    expect(result.distance).toBe(1)
    expect(result.ops[0]).toMatchObject({ type: 'delete', expected: ' ' })
  })
  it('walks real code points, so one astral character is one edit', () => {
    expect(diffStrings('a😀b', 'ab')).toMatchObject({ distance: 1, ops: [{ type: 'delete', expected: '😀' }] })
  })
  it('distance equals the number of operations and is symmetric', () => {
    const pairs: Array<[string, string]> = [
      ['accommodation', 'acommodation'],
      ['definitely', 'definately'],
      ['kitten', 'sitting'],
      ['', 'abc'],
      ['abc', 'cba'],
    ]
    for (const [a, b] of pairs) {
      const forward = diffStrings(a, b)
      expect(forward.ops).toHaveLength(forward.distance)
      expect(diffStrings(b, a).distance).toBe(forward.distance)
    }
  })
  it('gives the classic distance for kitten to sitting', () => {
    expect(diffStrings('kitten', 'sitting').distance).toBe(3)
  })
  it('lists operations from left to right', () => {
    const { ops } = diffStrings('abcdef', 'xbcdey')
    expect(ops.map((op) => op.expectedIndex)).toEqual([0, 5])
  })
})
