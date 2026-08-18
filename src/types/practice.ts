export type PracticeTaskType =
  | 'correct-spelling'
  | 'translate-ru-en'
  | 'translate-en-ru'
  | 'correct-sentence'

export type PracticeTask = {
  id: string
  type: PracticeTaskType
  topic: string
  level: 'B1' | 'B1+' | 'B2'
  prompt: string
  answer: string
  acceptedAnswers?: string[]
  hint: string
  rule: string
  errorCategory: string
}

export type PracticeSettings = {
  showHints: boolean
  writeUntilCorrect: boolean
  allowSkip: boolean
  showRuleAfterMistake: boolean
  repeatDifficultItemLater: boolean
}

export type PracticeAttempt = {
  id: string
  taskId: string
  taskType: PracticeTaskType
  topic: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  wasSkipped: boolean
  wasAnswerRevealed: boolean
  errorCategory: string
  needsReview: boolean
  createdAt: string
}

export type CheckResult = 'idle' | 'correct' | 'incorrect'
