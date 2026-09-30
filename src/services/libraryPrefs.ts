// The learner's own view of the built-in vocabulary: words they chose to hide, and which add-on packs
// are switched on. Each entry remembers when it was last changed, so two devices merge by "latest wins"
// (a word hidden on the phone and restored later on the laptop ends up restored everywhere).
const PREFS_KEY = 'spell-sprint.library-prefs'
const UPDATED_EVENT = 'spell-sprint:learning-updated'

type Flag = { on: boolean; at: string }
// removed: things the learner deleted — imported libraries ("lib:<name>"), imported words ("word:<wordId>")
// and saved rules ("rule:<id>").
// Sync only ever adds, so without these marks a deleted library would come back from the cloud.
// notes: the learner's own memory tip per word ("acco-MM-odation: two cots, two mattresses").
// An empty text is a deleted note; it stays as a mark so an older copy cannot bring it back.
type Note = { text: string; at: string }
export type LibraryPrefs = { hidden: Record<string, Flag>; packs: Record<string, Flag>; removed: Record<string, Flag>; notes: Record<string, Note>; packsInitialised?: boolean }
export const NOTE_LIMIT = 140

const empty = (): LibraryPrefs => ({ hidden: {}, packs: {}, removed: {}, notes: {} })

function isNoteMap(value: unknown): value is Record<string, Note> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value as object).every((note) => note && typeof (note as Note).text === 'string' && typeof (note as Note).at === 'string')
}

function isFlagMap(value: unknown): value is Record<string, Flag> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value as object).every((flag) => flag && typeof (flag as Flag).on === 'boolean' && typeof (flag as Flag).at === 'string')
}

export function getLibraryPrefs(): LibraryPrefs {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? 'null') as Partial<LibraryPrefs> | null
    if (!stored) return empty()
    return { hidden: isFlagMap(stored.hidden) ? stored.hidden : {}, packs: isFlagMap(stored.packs) ? stored.packs : {}, removed: isFlagMap(stored.removed) ? stored.removed : {}, notes: isNoteMap(stored.notes) ? stored.notes : {}, packsInitialised: stored.packsInitialised === true }
  } catch { return empty() }
}

function save(prefs: LibraryPrefs, announce = true) {
  try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)) } catch { /* private mode: the change lasts for this visit only */ }
  if (announce) window.dispatchEvent(new Event(UPDATED_EVENT))
}

const now = () => new Date().toISOString()

export function getHiddenWordIds() {
  return new Set(Object.entries(getLibraryPrefs().hidden).filter(([, flag]) => flag.on).map(([id]) => id))
}

export function setWordHidden(wordId: string, hidden: boolean) {
  const prefs = getLibraryPrefs()
  prefs.hidden[wordId] = { on: hidden, at: now() }
  save(prefs)
}

export function getWordNote(wordId: string) { return getLibraryPrefs().notes[wordId]?.text ?? '' }

export function setWordNote(wordId: string, text: string) {
  const prefs = getLibraryPrefs()
  prefs.notes[wordId] = { text: text.trim().slice(0, NOTE_LIMIT), at: now() }
  save(prefs)
}

export function getRemovedKeys() {
  return new Set(Object.entries(getLibraryPrefs().removed).filter(([, flag]) => flag.on).map(([key]) => key))
}

export function setRemoved(keys: string[], removed: boolean) {
  if (!keys.length) return
  const prefs = getLibraryPrefs()
  const at = now()
  for (const key of keys) prefs.removed[key] = { on: removed, at }
  save(prefs)
}

export function isPackEnabled(packId: string) { return getLibraryPrefs().packs[packId]?.on === true }

export function setPackEnabled(packId: string, on: boolean) {
  const prefs = getLibraryPrefs()
  prefs.packs[packId] = { on, at: now() }
  save(prefs)
}

// Learners who practised a pack's words before packs existed keep that pack switched on. The date is
// the epoch, so any real choice (on this or another device) wins over this automatic one.
export function initialisePacks(packIdsInUse: string[]) {
  const prefs = getLibraryPrefs()
  if (prefs.packsInitialised) return
  for (const id of packIdsInUse) if (!prefs.packs[id]) prefs.packs[id] = { on: true, at: new Date(0).toISOString() }
  prefs.packsInitialised = true
  save(prefs, false)
}

// Cloud restore: keep the most recent change for every word and pack.
export function mergeLibraryPrefs(incoming: unknown) {
  if (!incoming || typeof incoming !== 'object') return
  const remote = incoming as Partial<LibraryPrefs>
  const local = getLibraryPrefs()
  const merge = <T extends { at: string }>(mine: Record<string, T>, theirs: unknown, valid: (value: unknown) => value is Record<string, T>) => {
    if (!valid(theirs)) return mine
    const result = { ...mine }
    for (const [id, flag] of Object.entries(theirs)) if (!result[id] || flag.at > result[id].at) result[id] = flag
    return result
  }
  const next: LibraryPrefs = { hidden: merge(local.hidden, remote.hidden, isFlagMap), packs: merge(local.packs, remote.packs, isFlagMap), removed: merge(local.removed, remote.removed, isFlagMap), notes: merge(local.notes, remote.notes, isNoteMap), packsInitialised: local.packsInitialised || remote.packsInitialised === true }
  if (JSON.stringify(next) !== JSON.stringify(local)) save(next)
}
