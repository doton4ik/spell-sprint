import { getImportedLibraries, mergeImportedLibraries } from './libraryStorage'
import { loadDiagnosticResult, saveDiagnosticResult } from './diagnosticStorage'
import { getReviewStates, getRuleReviewIds, mergeReviewData } from './learningData'
import { getPracticeAttempts, mergePracticeAttempts } from './practiceStorage'
import { getStoredLevelChecks, mergeLevelChecks } from './levelCheck'
import { flushMistakeOutbox, getOutboxSize } from './mistakeOutbox'
import { flushWordReports } from './wordReports'
import { flushFeedback } from './feedback'
import { getProfile, nearestMinutes, saveProfile } from './profileStorage'
import { getLibraryPrefs, mergeLibraryPrefs } from './libraryPrefs'
import { getPairAttempts, mergePairAttempts } from './pairs'
import { getAllYellowCards, mergeYellowCards } from './yellowCards'
import { getSprintRounds, mergeSprintRounds } from './sprint'
import { getListeningProgress, mergeListeningProgress } from './listeningProgress'
import { getProofreadingDone, mergeProofreadingDone } from './proofreadingDone'
import { clearPersonalData } from './deviceData'
import {
  deleteAccount,
  getActiveCloudSession,
  getCloudSession,
  loadCloudSnapshot,
  loadCloudSnapshotVersion,
  saveCloudSnapshot,
  signOut,
} from './supabase'

type Snapshot = {
  yellowCards?: unknown
  practiceAttempts?: unknown
  diagnosticResult?: unknown
  reviewStates?: unknown
  savedRuleIds?: unknown
  importedLibraries?: unknown
  levelChecks?: unknown
  profile?: unknown
  libraryPrefs?: unknown
  pairAttempts?: unknown
  sprintRounds?: unknown
  listeningProgress?: unknown
  proofreadingDone?: unknown
}

// Merges the cloud copy into this device. It only adds missing data and never deletes local data.
export async function restoreLearningData() {
  const snapshot = await loadCloudSnapshot()
  if (!snapshot) return { found: false, attempts: 0 }
  const data = (snapshot.payload ?? {}) as Snapshot
  // Deletion marks first, so a library or saved rule removed on another device is not merged back in.
  mergeLibraryPrefs(data.libraryPrefs)
  const attempts = mergePracticeAttempts(Array.isArray(data.practiceAttempts) ? data.practiceAttempts : [])
  const reviewStates =
    data.reviewStates && typeof data.reviewStates === 'object' && !Array.isArray(data.reviewStates)
      ? (data.reviewStates as Parameters<typeof mergeReviewData>[0])
      : {}
  mergeReviewData(
    reviewStates,
    Array.isArray(data.savedRuleIds) ? data.savedRuleIds.filter((id): id is string => typeof id === 'string') : [],
  )
  mergeImportedLibraries(Array.isArray(data.importedLibraries) ? data.importedLibraries : [])
  mergeLevelChecks(data.levelChecks)
  mergePairAttempts(data.pairAttempts)
  mergeYellowCards(data.yellowCards)
  mergeProfile(data.profile)
  if (!loadDiagnosticResult() && data.diagnosticResult && typeof data.diagnosticResult === 'object')
    saveDiagnosticResult(data.diagnosticResult as Parameters<typeof saveDiagnosticResult>[0])
  mergeSprintRounds(data.sprintRounds)
  mergeListeningProgress(data.listeningProgress)
  mergeProofreadingDone(data.proofreadingDone)
  // Only now: if any merge above failed, the version stays old and the next sync pulls again.
  writeSyncState({ ...readSyncState(), version: snapshot.updatedAt })
  return { found: true, attempts }
}

// The profile (name, minutes a day, kinds of practice) is one small record, so the newer one wins as a whole:
// a change made in Settings on one device reaches the others. A profile saved before the time was stored has no
// time and counts as the oldest; then the old rule applies (the cloud profile is taken only if this device has no name).
function mergeProfile(value: unknown) {
  if (!value || typeof value !== 'object') return
  const remote = value as { name?: unknown; dailyGoal?: unknown; dailyMinutes?: unknown; activities?: unknown; updatedAt?: unknown }
  if (typeof remote.name !== 'string') return
  const local = getProfile()
  const remoteAt = typeof remote.updatedAt === 'string' ? remote.updatedAt : ''
  const remoteIsNewer = remoteAt > (local.updatedAt ?? '')
  if (remoteIsNewer || (!local.updatedAt && !local.name && remote.name)) {
    // An older snapshot has only a goal in tasks: half as many minutes (profileStorage picks the nearest option).
    const minutes =
      typeof remote.dailyMinutes === 'number'
        ? remote.dailyMinutes
        : typeof remote.dailyGoal === 'number'
          ? remote.dailyGoal / 2
          : undefined
    saveProfile(
      {
        name: remote.name,
        ...(minutes !== undefined ? { dailyMinutes: nearestMinutes(minutes) } : {}),
        ...(remote.activities && typeof remote.activities === 'object' ? { activities: remote.activities as Record<string, boolean> } : {}),
      },
      remoteAt,
    )
  } else if (!local.name && remote.name) {
    // The settings here are newer (changed before signing in), only the name is missing.
    saveProfile({ name: remote.name })
  }
}

// The backup holds the whole history (up to a few MB), so a sync downloads it only when another
// device has changed it, and uploads it only when this device has something new.
// Both are kept in storage, so reopening the app does not re-download or re-upload an unchanged backup.
const SYNC_STATE_KEY = 'spell-sprint.sync-state'
type SyncState = { version: string | null; uploaded: string }
function readSyncState(): SyncState {
  try {
    const value = JSON.parse(window.localStorage.getItem(SYNC_STATE_KEY) ?? 'null') as SyncState | null
    return value && typeof value.uploaded === 'string' ? value : { version: null, uploaded: '' }
  } catch {
    return { version: null, uploaded: '' }
  }
}
function writeSyncState(state: SyncState) {
  try {
    window.localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state))
  } catch {
    /* next sync just does a full exchange */
  }
}
// A short fingerprint of the uploaded data (FNV-1a), not the data itself.
function fingerprint(text: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${text.length}:${(hash >>> 0).toString(36)}`
}

const SAVE_TRIES = 3

export async function syncLearningData() {
  if (!(await getActiveCloudSession())) throw new Error('Sign in before synchronising your learning data.')
  for (let attempt = 0; attempt < SAVE_TRIES; attempt += 1) if (await pullThenPush()) return
  throw new Error('Another device is saving at the same time. Your answers are safe here; sync will try again.')
}

// One round: pull what is new, then save over exactly that version. False when another device
// saved in between (nothing was written; the next round pulls their data first).
async function pullThenPush() {
  // Pull first, so a fresh device can never overwrite an existing cloud backup with empty data.
  const remoteVersion = await loadCloudSnapshotVersion()
  if (remoteVersion === null || remoteVersion !== readSyncState().version) await restoreLearningData()
  const payload = {
    version: 1,
    practiceAttempts: getPracticeAttempts(),
    diagnosticResult: loadDiagnosticResult(),
    reviewStates: getReviewStates(),
    savedRuleIds: getRuleReviewIds(),
    importedLibraries: getImportedLibraries(),
    levelChecks: getStoredLevelChecks(),
    profile: getProfile(),
    libraryPrefs: getLibraryPrefs(),
    pairAttempts: getPairAttempts(),
    yellowCards: getAllYellowCards(),
    sprintRounds: getSprintRounds(),
    listeningProgress: getListeningProgress(),
    proofreadingDone: getProofreadingDone(),
  }
  const uploaded = fingerprint(JSON.stringify(payload))
  const state = readSyncState()
  if (remoteVersion !== null && remoteVersion === state.version && uploaded === state.uploaded) return true
  const version = await saveCloudSnapshot({ ...payload, syncedAt: new Date().toISOString() }, remoteVersion)
  if (!version) return false
  writeSyncState({ version, uploaded })
  return true
}

// ---- Automatic sync ---------------------------------------------------------------------------
// Signed-in devices keep themselves in step without pressing "Sync now": pull + push when the app
// opens, shortly after new answers, and when the tab is hidden (phone locked, app switched).
// Every run is "pull first, then push", and merging only ever adds, so two devices cannot erase
// each other's history.
// After new answers. Leaving the app (tab hidden, phone locked) still syncs at once.
const AUTO_SYNC_DELAY_MS = 20000
const SYNC_STATUS_EVENT = 'spell-sprint:sync-status'
let running: Promise<void> | null = null
let again = false
let timer: number | undefined
let applyingRemote = false
let lastSyncedAt: string | null = null
let lastError: string | null = null

export function getSyncStatus() {
  return { running: Boolean(running), lastSyncedAt, lastError }
}
export function subscribeToSyncStatus(onChange: () => void) {
  window.addEventListener(SYNC_STATUS_EVENT, onChange)
  return () => window.removeEventListener(SYNC_STATUS_EVENT, onChange)
}
const announce = () => window.dispatchEvent(new Event(SYNC_STATUS_EVENT))

export function syncNow(): Promise<void> {
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    announce()
    try {
      void flushMistakeOutbox() // mistakes made offline or before signing in reach the rules module now
      void flushWordReports()
      void flushFeedback()
      applyingRemote = true // the merge fires "data changed" events; they must not schedule another sync
      await syncLearningData()
      lastSyncedAt = new Date().toISOString()
      lastError = null
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Sync failed'
    } finally {
      applyingRemote = false
      running = null
      announce()
      if (again) {
        again = false
        scheduleSync()
      }
    }
  })()
  return running
}

function scheduleSync(delay = AUTO_SYNC_DELAY_MS) {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    void syncIfSignedIn()
  }, delay)
}

async function syncIfSignedIn() {
  if (!getCloudSession()) return
  await syncNow()
}

let started = false
export function startAutoSync() {
  if (started) return
  started = true
  const onLocalChange = () => {
    if (!applyingRemote && getCloudSession()) scheduleSync()
  }
  window.addEventListener('spell-sprint:practice-updated', onLocalChange)
  window.addEventListener('spell-sprint:learning-updated', onLocalChange)
  window.addEventListener('spell-sprint:profile-updated', onLocalChange) // a change in Settings reaches the other devices too
  document.addEventListener('visibilitychange', () => {
    if (!getCloudSession()) return
    // Leaving: push right away. Coming back: pull what other devices added in the meantime.
    void syncNow()
  })
  window.addEventListener('online', () => {
    void syncIfSignedIn()
  })
  void syncIfSignedIn()
}

// Signing out removes this learner's data from the device (it may be shared), after a last backup.
// Returns false when the backup did not complete, so the page can ask before anything is lost.
export async function backUpBeforeSignOut() {
  await syncNow()
  await flushMistakeOutbox()
  return !lastError && getOutboxSize() === 0
}

// Deletes the account in the cloud first; the device is cleared only if that worked.
export async function deleteAccountAndClearDevice() {
  window.clearTimeout(timer)
  await deleteAccount()
  clearPersonalData()
}

export async function signOutAndClearDevice() {
  window.clearTimeout(timer)
  await signOut()
  clearPersonalData()
}
