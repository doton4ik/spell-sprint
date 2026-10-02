// Wrong options for "Choose correct spelling": the slips learners really make (a lost double letter,
// an unclear vowel, ie/ei, -ful/-full), never a real word (battery → batter) and never an obvious
// fake (bbattery). For a phrase, the longest word gets the slip.

const VOWEL_SWAPS: Array<[RegExp, string]> = [[/a/g, 'e'], [/e/g, 'a'], [/i/g, 'e'], [/e/g, 'i'], [/o/g, 'u'], [/u/g, 'o'], [/ou/g, 'o'], [/au/g, 'o']]

const SOUND_ALIKE: Array<[string, string]> = [['ough', 'off'], ['igh', 'i'], ['ou', 'ow'], ['ow', 'ou'], ['ee', 'ea'], ['ea', 'ee'], ['oo', 'u'], ['ai', 'ay'], ['ay', 'ai'], ['oa', 'o'], ['ui', 'u'], ['au', 'aw'], ['aw', 'au'], ['ph', 'f'], ['ck', 'c'], ['wh', 'w'], ['gh', 'g']]

function slipsOf(word: string): string[] {
  const out: string[] = []
  const add = (value: string | null | undefined) => { if (value && value !== word && /^[a-z'-]+$/i.test(value)) out.push(value) }
  // A double letter written once, or a single consonant doubled (but never the first letter).
  for (const match of word.matchAll(/([b-df-hj-np-tv-z])\1/gi)) add(word.slice(0, match.index) + word.slice(match.index! + 1))
  for (const match of word.slice(1).matchAll(/(?<=[aeiou])([bdfglmnprst])(?=[aeiou])/gi)) add(word.slice(0, match.index! + 1) + match[1] + word.slice(match.index! + 1))
  // ie / ei, -ful / -full, -able / -ible, -tion / -sion, -ance / -ence
  add(word.includes('ie') ? word.replace('ie', 'ei') : word.includes('ei') ? word.replace('ei', 'ie') : null)
  add(/ful$/.test(word) ? `${word}l` : null)
  add(/able$/.test(word) ? word.replace(/able$/, 'ible') : /ible$/.test(word) ? word.replace(/ible$/, 'able') : null)
  add(/tion$/.test(word) ? word.replace(/tion$/, 'sion') : /sion$/.test(word) ? word.replace(/sion$/, 'tion') : null)
  add(/ance$/.test(word) ? word.replace(/ance$/, 'ence') : /ence$/.test(word) ? word.replace(/ence$/, 'ance') : null)
  // An unclear vowel in the middle of the word (not the first or the last letter).
  for (const [from, to] of VOWEL_SWAPS) {
    // A single vowel between consonants (so ou / ee pairs do not turn into "pruud", "vuucher").
    const single = from.source.length === 1
    const matches = [...word.matchAll(from)].filter((match) => match.index! > 0 && match.index! + match[0].length < word.length && (!single || (!/[aeiou]/.test(word[match.index! - 1]) && !/[aeiou]/.test(word[match.index! + 1]))))
    for (const match of matches.slice(0, 2)) add(word.slice(0, match.index) + to + word.slice(match.index! + match[0].length))
  }
  // A swallowed vowel (diffrent): only an unstressed-looking one between two consonants, from the third letter on.
  for (const match of [...word.matchAll(/(?<=[^aeiou])[aeiou](?=[^aeiou])/g)].filter((item) => /[aeiou]/.test(word.slice(0, item.index)) && item.index! < word.length - 2).slice(0, 2)) if (word.length > 5) add(word.slice(0, match.index) + word.slice(match.index! + 1))
  // Two letters swapped in the middle, a silent letter dropped.
  if (word.length >= 6) { const at = Math.floor(word.length / 2); if (word[at] !== word[at - 1]) add(word.slice(0, at - 1) + word[at] + word[at - 1] + word.slice(at + 1)) }
  add(/^(kn|wr)/.test(word) ? word.slice(1) : null)
  add(/[^aeiou]e$/.test(word) && word.length >= 5 ? word.slice(0, -1) : null)
  // Short words need their own slips: y → ie, ck → k, ch → tch, a doubled last consonant.
  add(/[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ie` : null)
  add(/y$/.test(word) ? `${word.slice(0, -1)}ey` : null)
  add(word.includes('ck') ? word.replace('ck', 'k') : null)
  add(/[^t]ch/.test(word) ? word.replace(/([^t])ch/, '$1tch') : word.includes('tch') ? word.replace('tch', 'ch') : null)
  add(word.length >= 3 && word.length <= 5 && /[aeiou][bdgklmnprt]$/.test(word) ? word + word.at(-1) : null)
  // Letter pairs that sound alike: proud → prowd, screen → screan, fruit → frut, cough → coff.
  for (const [from, to] of SOUND_ALIKE) if (word.includes(from)) add(word.replace(from, to))
  add(word.length <= 5 && /^[^aeiou]+[aeiou][^aeiou]$/.test(word) ? `${word}e` : null)
  return out
}

export function spellingDistractors(answer: string, isReal: (word: string) => boolean, count = 3): string[] {
  const words = answer.split(' ')
  const real = (value: string) => isReal(value.toLocaleLowerCase())
  const seen = new Set<string>([answer.toLocaleLowerCase()])
  const options: string[] = []
  // The longest word first; in a short phrase (give up) the other words help when it has too few slips.
  const order = words.map((_, index) => index).sort((a, b) => words[b].length - words[a].length)
  for (const target of order) {
    if (options.length >= count * 2) break
    for (const slip of slipsOf(words[target])) {
      if (real(slip)) continue
      const phrase = words.map((word, index) => (index === target ? slip : word)).join(' ')
      if (seen.has(phrase.toLocaleLowerCase())) continue
      seen.add(phrase.toLocaleLowerCase()); options.push(phrase)
    }
  }
  // Very short words (owl, gym): a doubled letter or an added e, so there is always something to choose from.
  if (options.length < 2 && words.length === 1 && answer.length >= 3) {
    for (const extra of [answer + answer.at(-1), /[^aeiou]$/.test(answer) ? `${answer}e` : `${answer}h`]) {
      if (options.length >= count) break
      if (!real(extra) && !seen.has(extra.toLocaleLowerCase())) { seen.add(extra.toLocaleLowerCase()); options.push(extra) }
    }
  }
  // Spread the kinds of slip: take from the start, the middle and the end of the list.
  if (options.length <= count) return options
  const picked = new Set<number>()
  for (let index = 0; picked.size < count; index += 1) picked.add(Math.floor((index * options.length) / count) % options.length)
  return [...picked].map((index) => options[index])
}

export function shuffled<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] }
  return copy
}
