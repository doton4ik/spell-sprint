// Damerau-Levenshtein (optimal string alignment) that returns not only the distance but also
// the list of edit operations, so a mistake can be described as "a letter was left out",
// "two letters were swapped", and so on. Pure and dependency-free: runs locally in the browser.

export type EditOp = {
  type: 'insert' | 'delete' | 'substitute' | 'transpose'
  // Position in the expected word. For an insert, the extra letter sits just before this index.
  expectedIndex: number
  // Position in the submitted word.
  submittedIndex: number
  // Expected letters involved ('' for an insert; two letters for a transpose).
  expected: string
  // Submitted letters involved ('' for a delete; two letters for a transpose).
  submitted: string
}

export function diffStrings(expectedText: string, submittedText: string): { distance: number; ops: EditOp[] } {
  const expected = Array.from(expectedText)
  const submitted = Array.from(submittedText)
  const m = expected.length
  const n = submitted.length
  const table: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i += 1) table[i][0] = i
  for (let j = 0; j <= n; j += 1) table[0][j] = j

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = expected[i - 1] === submitted[j - 1] ? 0 : 1
      table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, table[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && expected[i - 1] === submitted[j - 2] && expected[i - 2] === submitted[j - 1]) {
        table[i][j] = Math.min(table[i][j], table[i - 2][j - 2] + 1)
      }
    }
  }

  // Walk back from the bottom-right corner, recording which edit produced each step.
  // Preference order on ties: match, transpose, substitute, delete, insert.
  const ops: EditOp[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && expected[i - 1] === submitted[j - 1] && table[i][j] === table[i - 1][j - 1]) {
      i -= 1; j -= 1
    } else if (i > 1 && j > 1 && expected[i - 1] === submitted[j - 2] && expected[i - 2] === submitted[j - 1] && table[i][j] === table[i - 2][j - 2] + 1) {
      ops.push({ type: 'transpose', expectedIndex: i - 2, submittedIndex: j - 2, expected: expected[i - 2] + expected[i - 1], submitted: submitted[j - 2] + submitted[j - 1] })
      i -= 2; j -= 2
    } else if (i > 0 && j > 0 && table[i][j] === table[i - 1][j - 1] + 1) {
      ops.push({ type: 'substitute', expectedIndex: i - 1, submittedIndex: j - 1, expected: expected[i - 1], submitted: submitted[j - 1] })
      i -= 1; j -= 1
    } else if (i > 0 && table[i][j] === table[i - 1][j] + 1) {
      ops.push({ type: 'delete', expectedIndex: i - 1, submittedIndex: j, expected: expected[i - 1], submitted: '' })
      i -= 1
    } else {
      ops.push({ type: 'insert', expectedIndex: i, submittedIndex: j - 1, expected: '', submitted: submitted[j - 1] })
      j -= 1
    }
  }

  return { distance: table[m][n], ops: ops.reverse() }
}
