import { getImportedLibraries, mergeImportedLibraries } from './libraryStorage'
import { loadDiagnosticResult, saveDiagnosticResult } from './diagnosticStorage'
import { getReviewStates, getRuleReviewIds, mergeReviewData } from './learningData'
import { getPracticeAttempts, mergePracticeAttempts } from './practiceStorage'
import { getLevelChecks, mergeLevelChecks } from './levelCheck'
import { flushMistakeOutbox, getOutboxSize } from './mistakeOutbox'
import { getProfile, saveProfile } from './profileStorage'
import { clearPersonalData } from './deviceData'
import { getActiveCloudSession, getCloudSession, loadCloudSnapshot, saveCloudSnapshot, signOut } from './supabase'

type Snapshot = { practiceAttempts?: unknown; diagnosticResult?: unknown; reviewStates?: unknown; savedRuleIds?: unknown; importedLibraries?: unknown; levelChecks?: unknown; profile?: unknown }

// Merges the cloud copy into this device. It only adds missing data and never deletes local data.
export async function restoreLearningData() {
  const snapshot = await loadCloudSnapshot()
  if (!snapshot) return { found: false, attempts: 0 }
  const data = (snapshot.payload ?? {}) as Snapshot
  const attempts = mergePracticeAttempts(Array.isArray(data.practiceAttempts) ? data.practiceAttempts : [])
  const reviewStates = data.reviewStates && typeof data.reviewStates === 'object' && !Array.isArray(data.reviewStates) ? data.reviewStates as Parameters<typeof mergeReviewData>[0] : {}
  mergeReviewData(reviewStates, Array.isArray(data.savedRuleIds) ? data.savedRuleIds.filter((id): id is string => typeof id === 'string') : [])
  mergeImportedLibraries(Array.isArray(data.importedLibraries) ? data.importedLibraries : [])
  mergeLevelChecks(data.levelChecks)
  const profile = data.profile as { name?: unknown; dailyGoal?: unknown } | undefined
  if (profile && !getProfile().name && typeof profile.name === 'string' && profile.name) saveProfile({ name: profile.name, ...(typeof profile.dailyGoal === 'number' ? { dailyGoal: profile.dailyGoal } : {}) })
  if (!loadDiagnosticResult() && data.diagnosticResult && typeof data.diagnosticResult === 'object') saveDiagnosticResult(data.diagnosticResult as Parameters<typeof saveDiagnosticResult>[0])
  return { found: true, attempts }
}

export async function syncLearningData() {
  if (!await getActiveCloudSession()) throw new Error('Sign in before synchronising your learning data.')
  // Pull first, so a fresh device can never overwrite an existing cloud backup with empty data.
  await restoreLearningData()
  await saveCloudSnapshot({
    version: 1,
    syncedAt: new Date().toISOString(),
    practiceAttempts: getPracticeAttempts(),
    diagnosticResult: loadDiagnosticResult(),
    reviewStates: getReviewStates(),
    savedRuleIds: getRuleReviewIds(),
    importedLibraries: getImportedLibraries(),
    levelChecks: getLevelChecks(),
    profile: getProfile(),
  })
}

// ---- Automatic sync ---------------------------------------------------------------------------
// Signed-in devices keep themselves in step without pressing "Sync now": pull + push when the app
// opens, a few seconds after new answers, and when the tab is hidden (phone locked, app switched).
// Every run is "pull first, then push", and merging only ever adds, so two devices cannot erase
// each other's history.
const AUTO_SYNC_DELAY_MS = 4000
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
