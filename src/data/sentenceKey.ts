// A short, stable key for a pair sentence (FNV-1a, 32 bits, base 36). pairIndex.ts keeps the right answer of the
// sentences of three-word pairs under this key, so My Mistakes can name the right word of an old attempt without
// loading the 170 KB of sentences. The same function is used by scripts/build-pair-index.mjs.
export function sentenceKey(text: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(36)
}
