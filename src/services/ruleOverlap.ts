import type { Rule, RuleExample, RuleExercise } from '../types/rules'

// On a rule's page the Examples tab and the Practice tab sit side by side. A learner who has just read
// "We stayed in cheap accommodation" must not then be asked to spell "accommodation": the answer would be copied, not
// remembered. So the page shows only examples that do not contain the answer of any exercise, and an exercise is
// left out when its answer (or its whole sentence) is still on show.
// The rule's own words (accept / except in "Accept or except") are in every example by nature and are not counted.
const wordsIn = (text: string) => text.toLocaleLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []

export function ruleKeywords(rule: Pick<Rule, 'title' | 'mnemonic' | 'shortExplanation'>) {
  return new Set([...wordsIn(rule.title), ...wordsIn(rule.mnemonic ?? '')].filter((word) => word.length > 2))
}

// The word the learner has to produce, or nothing when the answer is the rule's own word or is not a single word.
function targetWord(exercise: Pick<RuleExercise, 'answer'>, keywords: Set<string>) {
  const words = wordsIn(exercise.answer)
  if (words.length !== 1) return null
  return keywords.has(words[0]) ? null : words[0]
}

const exampleWords = (example: Pick<RuleExample, 'text' | 'correction'>) =>
  new Set([...wordsIn(example.text), ...wordsIn(example.correction ?? '')])
const sameSentence = (a: string, b: string) => wordsIn(a).join(' ') === wordsIn(b).join(' ')

export function overlaps(
  example: Pick<RuleExample, 'text' | 'correction'>,
  exercise: Pick<RuleExercise, 'answer' | 'prompt'>,
  keywords: Set<string>,
) {
  const target = targetWord(exercise, keywords)
  if (target && exampleWords(example).has(target)) return true
  const filled = exercise.prompt.replace('___', exercise.answer)
  return sameSentence(example.text, exercise.prompt) || sameSentence(example.text, filled) || sameSentence(example.correction ?? '', filled)
}

const MIN_CLEAN = 4
const SHOWN = 12

// The examples to show: those that give away no exercise, a mix of right and wrong ones, up to SHOWN. A rule with almost no
// clean example shows its first ones instead (and its exercises are filtered against them).
export function pickShownExamples(examples: RuleExample[], exercises: RuleExercise[], keywords: Set<string>) {
  const clean = examples.filter((example) => !exercises.some((exercise) => overlaps(example, exercise, keywords)))
  const pool = clean.length >= MIN_CLEAN ? clean : examples
  const byType = (type: string) => pool.filter((example) => example.exampleType === type)
  const mixed: RuleExample[] = []
  const lists = [byType('incorrect'), byType('correct'), byType('exception')]
  for (let index = 0; mixed.length < Math.min(SHOWN, pool.length); index += 1) {
    let added = false
    for (const list of lists) {
      if (list[index] && mixed.length < SHOWN) {
        mixed.push(list[index])
        added = true
      }
    }
    if (!added) break
  }
  return mixed
}

// The exercises that do not repeat what is on show. If nothing is left (all of them overlap), the learner still gets them all.
export function exercisesWithoutOverlap(exercises: RuleExercise[], shown: RuleExample[], keywords: Set<string>) {
  const rest = exercises.filter((exercise) => !shown.some((example) => overlaps(example, exercise, keywords)))
  return rest.length >= Math.min(4, exercises.length) ? rest : exercises
}
