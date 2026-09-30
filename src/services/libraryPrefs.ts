// The learner's own view of the built-in vocabulary: words they chose to hide, and which add-on packs
// are switched on. Each entry remembers when it was last changed, so two devices merge by "latest wins"
// (a word hidden on the phone and restored later on the laptop ends up restored everywhere).
const PREFS_KEY = 'spell-sprint.library-prefs'
const UPDATED_EVENT = 'spell-sprint:learning-updated'

type Flag = { on: boolean; at: string }
export type LibraryPrefs = { hidden: Record<string, Flag>; packs: Record<string, Flag>; packsInitialised?: boolean }

const empty = (): LibraryPrefs => ({ hidden: {}, packs: {} })

function isFlagMap(value: unknown): value is Record<string, Flag> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value as object).every((flag) => flag && typeof (flag as Flag).on === 'boolean' && typeof (flag as Flag).at === 'string')
}

export function getLibraryPrefs(): LibraryPrefs {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? 'null') as Partial<LibraryPrefs> | null
    if (!stored) return empty()
    return { hidden: isFlagMap(stored.hidden) ? stored.hidden : {}, packs: isFlagMap(stored.packs) ? stored.packs : {}, packsInitialised: stored.packsInitialised === true }
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
  const merge = (mine: Record<string, Flag>, theirs: unknown) => {
    if (!isFlagMap(theirs)) return mine
    const result = { ...mine }
    for (const [id, flag] of Object.entries(theirs)) if (!result[id] || flag.at > result[id].at) result[id] = flag
    return result
  }
  const next: LibraryPrefs = { hidden: merge(local.hidden, remote.hidden), packs: merge(local.packs, remote.packs), packsInitialised: local.packsInitialised || remote.packsInitialised === true }
  if (JSON.stringify(next) !== JSON.stringify(local)) save(next)
}
