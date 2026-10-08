export type PracticeTaskType = 'correct-spelling' | 'translate-ru-en' | 'translate-en-ru' | 'correct-sentence'

export type PracticeMode = 'write-en' | 'listen-write' | 'translate-ru' | 'choose-spelling'

export type PracticeTask = {
  id: string
  type: PracticeTaskType
  topic: string
  level: 'Easy' | 'Medium' | 'Hard' // the word's difficulty in the library (not a CEFR level)
  prompt: string
  answer: string
  acceptedAnswers?: string[]
  hint: string
  rule: string
  errorCategory: string
  mode?: PracticeMode
  choices?: string[]
  example?: string
  extraExample?: string
  extraExampleSource?: string
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
  introduced?: boolean // "Meet the word": shown and copied once, not a test (no mistake, no good day)
  errorCategory: string
  needsReview: boolean
  createdAt: string
}

export type CheckResult = 'idle' | 'correct' | 'incorrect'

export type ErrorType =
  | 'missing_letter'
  | 'missing_vowel'
  | 'extra_letter'
  | 'letter_order'
  | 'vowel_confusion'
  | 'double_consonant'
  | 'phrase_spacing'
  | 'unknown'
