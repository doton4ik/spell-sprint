export type PracticeTaskType =
  | 'correct-spelling'
  | 'translate-ru-en'
  | 'translate-en-ru'
  | 'correct-sentence'

export type PracticeMode = 'write-en' | 'listen-write' | 'translate-ru' | 'choose-spelling'

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
  mode?: PracticeMode
  choices?: string[]
  example?: string
  wordId?: string
  library?: string
  topicId?: string
  subtopic?: string
}

export type PracticeSettings = {
  showHints: boolean
  writeUntilCorrect: boolean
  allowSkip: boolean
  showRuleAfterMistake: boolean
  repeatDifficultItemLater: boolean
  speechLocale: 'en-US' | 'en-GB'
}

export type PracticeAttempt = {
  id: string
  taskId: string
  taskType: PracticeTaskType
  topic: string
  topicId?: string
  subtopic?: string
  wordId?: string
  library?: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  wasSkipped: boolean
  wasAnswerRevealed: boolean
  hintUsed: boolean
  attemptMode: PracticeMode
  errorType: ErrorType
  confidence: number
  nextReviewAt?: string
  wasMarkedForReview?: boolean
  errorCategory: string
  needsReview: boolean
  createdAt: string
}

export type CheckResult = 'idle' | 'correct' | 'incorrect'

export type ErrorType = 'missing_letter' | 'extra_letter' | 'letter_order' | 'vowel_confusion' | 'double_consonant' | 'phrase_spacing' | 'unknown'
