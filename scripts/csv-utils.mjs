// A small CSV reader and writer for the library file (quoted cells, doubled quotes, line breaks inside quotes).
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

const quote = (value) => (/[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)
export const serialiseCsv = (rows, eol = '\n') => rows.map((row) => row.map(quote).join(',')).join(eol) + eol
