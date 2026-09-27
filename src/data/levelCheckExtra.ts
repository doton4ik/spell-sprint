import type { LevelItem } from './levelCheckBank'

// Extra level-check questions: [skill, level (1 = A2 … 4 = C1), prompt, answer]. Filled from the
// content brief; an empty list simply means the check uses the built-in bank only.
export const extraLevelItems: Array<[LevelItem['skill'], LevelItem['level'], string, string]> = []
