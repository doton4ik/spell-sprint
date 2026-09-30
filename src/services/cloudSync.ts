import { getImportedLibraries, mergeImportedLibraries } from './libraryStorage'
import { loadDiagnosticResult, saveDiagnosticResult } from './diagnosticStorage'
import { getReviewStates, getRuleReviewIds, mergeReviewData } from './learningData'
import { getPracticeAttempts, mergePracticeAttempts } from './practiceStorage'
import { getLevelChecks, mergeLevelChecks } from './levelCheck'
import { flushMistakeOutbox, getOutboxSize } from './mistakeOutbox'
import { getProfile, saveProfile } from './profileStorage'
import { getLibraryPrefs, mergeLibraryPrefs } from './libraryPrefs'
import { getPairAttempts, mergePairAttempts } from './pairs'
import { clearPersonalData } from './deviceData'
import { getActiveCloudSession, getCloudSession, loadCloudSnapshot, loadCloudSnapshotVersion, saveCloudSnapshot, signOut } from './supabase'

type Snapshot = { practiceAttempts?: unknown; diagnosticResult?: unknown; reviewStates?: unknown; savedRuleIds?: unknown; importedLibraries?: unknown; levelChecks?: unknown; profile?: unknown; libraryPrefs?: unknown; pairAttempts?: unknown }

// Merges the cloud copy into this device. It only adds missing data and never deletes local data.
export async function restoreLearningData() {
  const snapshot = await loadCloudSnapshot()
  if (!snapshot) return { found: false, attempts: 0 }
  writeSyncState({ ...readSyncState(), version: snapshot.updatedAt })
  const data = (snapshot.payload ?? {}) as Snapshot
  // Deletion marks first, so a library or saved rule removed on another device is not merged back in.
  mergeLibraryPrefs(data.libraryPrefs)
  const attempts = mergePracticeAttempts(Array.isArray(data.practiceAttempts) ? data.practiceAttempts : [])
  const reviewStates = data.reviewStates && typeof data.reviewStates === 'object' && !Array.isArray(data.reviewStates) ? data.reviewStates as Parameters<typeof mergeReviewData>[0] : {}
  mergeReviewData(reviewStates, Array.isArray(data.savedRuleIds) ? data.savedRuleIds.filter((id): id is string => typeof id === 'string') : [])
  mergeImportedLibraries(Array.isArray(data.importedLibraries) ? data.importedLibraries : [])
  mergeLevelChecks(data.levelChecks)
  mergePairAttempts(data.pairAttempts)
  const profile = data.profile as { name?: unknown; dailyGoal?: unknown } | undefined
  if (profile && !getProfile().name && typeof profile.name === 'string' && profile.name) saveProfile({ name: profile.name, ...(typeof profile.dailyGoal === 'number' ? { dailyGoal: profile.dailyGoal } : {}) })
  if (!loadDiagnosticResult() && data.diagnosticResult && typeof data.diagnosticResult === 'object') saveDiagnosticResult(data.diagnosticResult as Parameters<typeof saveDiagnosticResult>[0])
  return { found: true, attempts }
}

// The backup holds the whole history (up to a few MB), so a sync downloads it only when another
// device has changed it, and uploads it only when this device has something new.
// Both are kept in storage, so reopening the app does not re-download or re-upload an unchanged backup.
const SYNC_STATE_KEY = 'spell-sprint.sync-state'
type SyncState = { version: string | null; uploaded: string }
function readSyncState(): SyncState { try { const value = JSON.parse(window.localStorage.getItem(SYNC_STATE_KEY) ?? 'null') as SyncState | null; return value && typeof value.uploaded === 'string' ? value : { version: null, uploaded: '' } } catch { return { version: null, uploaded: '' } } }
function writeSyncState(state: SyncState) { try { window.localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state)) } catch { /* next sync just does a full exchange */ } }
// A short fingerprint of the uploaded data (FNV-1a), not the data itself.
function fingerprint(text: string) { let hash = 0x811c9dc5; for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 0x01000193) } return `${text.length}:${(hash >>> 0).toString(36)}` }

export async function syncLearningData() {
  if (!await getActiveCloudSession()) throw new Error('Sign in before synchronising your learning data.')
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
    levelChecks: getLevelChecks(),
    profile: getProfile(),
    libraryPrefs: getLibraryPrefs(),
    pairAttempts: getPairAttempts(),
  }
  const uploaded = fingerprint(JSON.stringify(payload))
  const state = readSyncState()
  if (remoteVersion !== null && remoteVersion === state.version && uploaded === state.uploaded) return
  const version = await saveCloudSnapshot({ ...payload, syncedAt: new Date().toISOString() })
  writeSyncState({ version, uploaded })
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

export function getSyncStatus() { return { running: Boolean(running), lastSyncedAt, lastError } }
export function subscribeToSyncStatus(onChange: () => void) {
  window.addEventListener(SYNC_STATUS_EVENT, onChange)
  return () => window.removeEventListener(SYNC_STATUS_EVENT, onChange)
}
const announce = () => window.dispatchEvent(new Event(SYNC_STATUS_EVENT))

export function syncNow(): Promise<void> {
  if (running) { again = true; return running }
  running = (async () => {
    announce()
    try {
      void flushMistakeOutbox() // mistakes made offline or before signing in reach the rules module now
      applyingRemote = true // the merge fires "data changed" events; they must not schedule another sync
      await syncLearningData()
      lastSyncedAt = new Date().toISOString(); lastError = null
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Sync failed'
    } finally {
      applyingRemote = false
      running = null
      announce()
      if (again) { again = false; scheduleSync() }
    }
  })()
  return running
}

function scheduleSync(delay = AUTO_SYNC_DELAY_MS) {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => { void syncIfSignedIn() }, delay)
}

async function syncIfSignedIn() {
  if (!getCloudSession()) return
  await syncNow()
}

let started = false
export function startAutoSync() {
  if (started) return
  started = true
  const onLocalChange = () => { if (!applyingRemote && getCloudSession()) scheduleSync() }
  window.addEventListener('spell-sprint:practice-updated', onLocalChange)
  window.addEventListener('spell-sprint:learning-updated', onLocalChange)
  document.addEventListener('visibilitychange', () => {
    if (!getCloudSession()) return
    // Leaving: push right away. Coming back: pull what other devices added in the meantime.
    void syncNow()
  })
  window.addEventListener('online', () => { void syncIfSignedIn() })
  void syncIfSignedIn()
}

// Signing out removes this learner's data from the device (it may be shared), after a last backup.
// Returns false when the backup did not complete, so the page can ask before anything is lost.
export async function backUpBeforeSignOut() {
  await syncNow()
  await flushMistakeOutbox()
  return !lastError && getOutboxSize() === 0
}

export async function signOutAndClearDevice() {
  window.clearTimeout(timer)
  await signOut()
  clearPersonalData()
}
