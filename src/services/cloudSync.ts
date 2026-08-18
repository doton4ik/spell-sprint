import { getImportedLibraries } from './libraryStorage'
import { loadDiagnosticResult } from './diagnosticStorage'
import { getReviewStates, getRuleReviewIds } from './learningData'
import { getPracticeAttempts } from './practiceStorage'
import { saveCloudSnapshot } from './supabase'

export async function syncLearningData() {
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
