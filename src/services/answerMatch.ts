import type { PracticeTask } from '../types/practice'

// Several English answers can be right for one Russian prompt (мусор → rubbish, trash, garbage).
// These helpers decide which accepted answer the learner was aiming at.
const normalise = (value: string) => value.trim().toLocaleLowerCase().replaceAll('ё', 'е').replace(/[’']/g, "'").replace(/[.,!?]+$/g, '').replace(/\s+/g, ' ')
export const comparable = (value: string) => normalise(value).replaceAll(/[-\s]/g, '')

export const acceptedAnswers = (task: PracticeTask) => [task.answer, ...(task.acceptedAnswers ?? [])]

export function isAcceptedAnswer(answer: string, task: PracticeTask) {
  return acceptedAnswers(task).map(comparable).includes(comparable(answer))
}

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]; row[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]
}

// The accepted answer closest to what was typed: "tresh" was an attempt at "trash", not at "rubbish",
// so the mistake is explained and classified against "trash". Ties keep the main answer.
export function closestAnswer(answer: string, task: PracticeTask) {
  const typed = comparable(answer)
  return acceptedAnswers(task).reduce((best, option) => (distance(typed, comparable(option)) < distance(typed, comparable(best)) ? option : best), task.answer)
}
