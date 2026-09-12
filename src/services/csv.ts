export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') { if (quoted && text[index + 1] === '"') { field += '"'; index += 1 } else quoted = !quoted }
    else if (character === ',' && !quoted) { row.push(field.trim()); field = '' }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && text[index + 1] === '\n') index += 1; row.push(field.trim()); field = ''; if (row.some(Boolean)) rows.push(row); row = [] }
    else field += character
  }
  row.push(field.trim()); if (row.some(Boolean)) rows.push(row); return rows
}
