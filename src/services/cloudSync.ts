import { getImportedLibraries, mergeImportedLibraries } from './libraryStorage'
import { loadDiagnosticResult, saveDiagnosticResult } from './diagnosticStorage'
import { getReviewStates, getRuleReviewIds, mergeReviewData } from './learningData'
import { getPracticeAttempts, mergePracticeAttempts } from './practiceStorage'
import { getActiveCloudSession, loadCloudSnapshot, saveCloudSnapshot } from './supabase'

type Snapshot = { practiceAttempts?: unknown; diagnosticResult?: unknown; reviewStates?: unknown; savedRuleIds?: unknown; importedLibraries?: unknown }

// Merges the cloud copy into this device. It only adds missing data and never deletes local data.
export async function restoreLearningData() {
  const snapshot = await loadCloudSnapshot()
  if (!snapshot) return { found: false, attempts: 0 }
  const data = (snapshot.payload ?? {}) as Snapshot
  const attempts = mergePracticeAttempts(Array.isArray(data.practiceAttempts) ? data.practiceAttempts : [])
  const reviewStates = data.reviewStates && typeof data.reviewStates === 'object' && !Array.isArray(data.reviewStates) ? data.reviewStates as Parameters<typeof mergeReviewData>[0] : {}
  mergeReviewData(reviewStates, Array.isArray(data.savedRuleIds) ? data.savedRuleIds.filter((id): id is string => typeof id === 'string') : [])
  mergeImportedLibraries(Array.isArray(data.importedLibraries) ? data.importedLibraries : [])
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
  })
}
