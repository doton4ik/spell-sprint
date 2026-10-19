// The names and instructions of the five skills. Kept apart from levelCheckBank.ts (which pulls in every question), so the
// parts of the app that only need a label (levelCheck.ts, read on the first screen) do not load the bank.
import type { Skill } from './levelCheckBank'

export const skillLabels: Record<Skill, string> = {
  spelling: 'Spelling',
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  listening: 'Listening',
}
export const skillInstructions: Record<Skill, string> = {
  spelling: 'Write the word correctly. Some are already right — then just copy them.',
  vocabulary: 'Choose the word or phrase that fits.',
  grammar: 'Rewrite the sentence correctly. If it is already right, copy it.',
  reading: 'Read the text, then choose the best answer.',
  listening: 'Listen, then type exactly what you hear.',
}
