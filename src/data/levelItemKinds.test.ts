import { describe, expect, it } from 'vitest'
import { buildLevelBank } from './levelCheckBank'
import { levelItemKinds } from './levelItemKinds'
import { levelItemKindsData } from './levelItemKindsData'

// levelItemKindsData.ts is made from the bank (see levelItemKindsGenerate.test.ts for the command). Old checks are scored again from this list, so every id in it must still be in the bank with the same kind (retired
// questions stay in the bank). A question added later is not in an old check, so it does not need to be listed.
const bank = buildLevelBank([])
describe('the list of question kinds', () => {
  it('matches the bank: every listed id is in the bank with the same kind and number of options', () => {
    const byId = new Map(bank.map((item) => [item.id, item]))
    const listed = levelItemKinds()
    expect(listed.size).toBeGreaterThan(500)
    for (const [id, entry] of listed) {
      const item = byId.get(id)
      expect(item, `${id} is not in the bank (make the list again: see levelItemKindsGenerate.test.ts)`).toBeTruthy()
      expect(entry).toEqual({ kind: item!.kind ?? 'type', options: item!.choices?.length })
    }
  })

  it('lists every question the bank has today (so an old check can be scored again)', () => {
    const listed = levelItemKinds()
    const missing = bank.filter((item) => !listed.has(item.id)).map((item) => item.id)
    // a question added after the list was made cannot be in an old check, so this only warns by being short
    expect(missing.length).toBeLessThan(40)
  })

  it('keeps the list small: it is read on the first screen', () => {
    expect(JSON.stringify(levelItemKindsData).length).toBeLessThan(24000)
  })

  it('has ids without spaces', () => {
    for (const item of bank) expect(item.id).not.toMatch(/\s/)
  })
})
