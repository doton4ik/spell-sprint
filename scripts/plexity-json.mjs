// Reads an answer saved from Plexity and makes it usable even when the chat gave a messy copy:
//  - a code fence (```json ... ```) or text around the JSON is cut away;
//  - an answer cut off in the middle (the chat ran out of room) is trimmed to the last COMPLETE item and closed;
//  - in text fields (text, prompt, sentence) a gap that lost its underscores in the chat (`_` or `__`) becomes `___`.
// The report line says what was repaired, so nothing is changed silently.
import { readFileSync } from 'node:fs'

const GAP_FIELDS = new Set(['text', 'prompt', 'sentence', 'correction', 'extra_example', 'example'])

function repair(text) {
  const stack = []
  let inString = false
  let escaped = false
  let best = -1
  let bestStack = []
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{' || char === '[') stack.push(char)
    else if (char === '}' || char === ']') {
      stack.pop()
      best = i
      bestStack = [...stack]
    }
  }
  if (best < 0) return null
  return (
    text.slice(0, best + 1) +
    bestStack
      .reverse()
      .map((open) => (open === '{' ? '}' : ']'))
      .join('')
  )
}

function fixGaps(value, key = '') {
  if (typeof value === 'string')
    return GAP_FIELDS.has(key) && !value.includes('___') ? value.replace(/(?<![A-Za-z0-9])_{1,2}(?![A-Za-z0-9_])/g, '___') : value
  if (Array.isArray(value)) return value.map((item) => fixGaps(item, key))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fixGaps(v, k)]))
  return value
}

export function readAnswer(file) {
  let text = readFileSync(file, 'utf8').replace(/^﻿/, '').trim()
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/)
  if (fence) text = fence[1].trim()
  const start = text.search(/[[{]/)
  if (start > 0) text = text.slice(start)
  let data
  try {
    data = JSON.parse(text)
  } catch {
    const fixed = repair(text)
    if (!fixed) throw new Error(`${file}: not JSON and nothing to repair`)
    data = JSON.parse(fixed)
    console.log(
      `NOTE ${file}: the answer was cut off; the last complete items were kept (ask Plexity to continue and save the rest as another file)`,
    )
  }
  const before = JSON.stringify(data)
  const fixed = fixGaps(data)
  if (JSON.stringify(fixed) !== before) console.log(`NOTE ${file}: gaps that had lost their underscores were restored`)
  return fixed
}
