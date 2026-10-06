import { mixedPracticeTasks } from '../data/practice'
import { proofreadingTexts } from '../data/proofreadingTexts'
import type { PracticeAttempt } from '../types/practice'
import { getHiddenWordIds } from './libraryPrefs'
import { getEveryWord } from './libraryStorage'

// The app changes: words leave the library, texts are retired, the early demo tasks are gone, and
// the learner hides words. Mistakes on those are no longer worth repeating. The answers themselves
// stay in the history (streak, statistics, cloud sync); only My Mistakes, review and patterns skip them.
const retiredTaskIds = new Set(mixedPracticeTasks.map((task) => task.id))
const textsById = new Map(proofreadingTexts.map((text) => [text.id, text]))

export function relevanceCheck() {
  const words = new Set(getEveryWord().map((word) => word.wordId))
  const hidden = getHiddenWordIds()
  return (attempt: Pick<PracticeAttempt, 'wordId' | 'taskId'>) => {
    if (attempt.wordId) return words.has(attempt.wordId) && !hidden.has(attempt.wordId)
    if (retiredTaskIds.has(attempt.taskId) || hidden.has(`task:${attempt.taskId}`)) return false
    // Proofreading: proof-<text id>-<type>-<word>. The ten-sentence mode has no stored text.
    if (attempt.taskId.startsWith('proof-') && !attempt.taskId.startsWith('proof-sentences-')) {
      const id = [...textsById.keys()].find((textId) => attempt.taskId.startsWith(`proof-${textId}-`))
      return Boolean(id && !textsById.get(id)!.hidden)
    }
    return true
  }
}
