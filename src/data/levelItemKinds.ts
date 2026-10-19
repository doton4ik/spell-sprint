// How each question of the level check was asked ("type", "choice" with 3 or 4 options, "dictation"), by id. Reading a
// stored check (getLevelChecks) needs this to score an old check again; it comes from this list and not from the bank
// itself (levelCheckBank.ts, about 100 KB of questions), so the first screen does not load the bank.
// levelItemKindsData.ts is made from the bank by src/data/levelItemKinds.test.ts (see the note there).
import { levelItemKindsData } from './levelItemKindsData'
import type { ItemKind } from './levelCheckBank'

export function levelItemKinds(): Map<string, { kind: ItemKind; options?: number }> {
  const map = new Map<string, { kind: ItemKind; options?: number }>()
  for (const [group, ids] of Object.entries(levelItemKindsData)) {
    const [kind, options] = group.split(':')
    for (const id of ids.split(' ')) map.set(id, { kind: kind as ItemKind, options: options ? Number(options) : undefined })
  }
  return map
}
