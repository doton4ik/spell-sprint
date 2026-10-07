import { mixedPracticeTasks } from '../data/practice'
import { hiddenProofreadingTextIds } from '../data/proofreadingHidden'
import type { PracticeAttempt } from '../types/practice'
import { getHiddenWordIds } from './libraryPrefs'
import { getEveryWord } from './libraryStorage'

// The app changes: words leave the library, texts are retired, the early demo tasks are gone, and
// the learner hides words. Mistakes on those are no longer worth repeating. The answers themselves
// stay in the history (streak, statistics, cloud sync); only My Mistakes, review and patterns skip them.
const retiredTaskIds = new Set(mixedPracticeTasks.map((task) => task.id))

export function relevanceCheck() {
  const words = new Set(getEveryWord().map((word) => word.wordId))
  const hidden = getHiddenWordIds()
  return (attempt: Pick<PracticeAttempt, 'wordId' | 'taskId'>) => {
    if (attempt.wordId) return words.has(attempt.wordId) && !hidden.has(attempt.wordId)
    if (retiredTaskIds.has(attempt.taskId) || hidden.has(`task:${attempt.taskId}`)) return false
    // Proofreading: proof-<text id>-<type>-<word>; mistakes in a retired text are skipped.
    if (attempt.taskId.startsWith('proof-')) for (const id of hiddenProofreadingTextIds) if (attempt.taskId.startsWith(`proof-${id}-`)) return false
    return true
  }
}
