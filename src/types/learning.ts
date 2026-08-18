import type { ErrorType } from './practice'

export type ErrorFamily = 'Spelling' | 'Grammar' | 'Vocabulary'
export type LearningStatus = 'new' | 'learning' | 'review' | 'difficult' | 'mastered'

export type MistakeEntry = {
  taskId: string
  correctAnswer: string
  lastUserVersion: string
  errorCategory: string
  family: ErrorFamily
  topic: string
  topicId?: string
  subtopic?: string
  wordId?: string
  library?: string
  errorType?: ErrorType
  numberOfAttempts: number
  numberOfErrors: number
  numberOfCorrectAnswers: number
  firstSeen: string
  lastSeen: string
  nextReviewAt: string
  status: LearningStatus
  memoryCue?: string
  riskLevel?: 'low' | 'medium' | 'high'
  source?: 'practice' | 'personal-baseline'
}

export type ReviewState = {
  taskId: string
  completedReviews: number
  nextReviewAt: string
  lastReviewedAt?: string
}

export type LearningRule = {
  id: string
  title: string
  family: ErrorFamily | 'Business English' | 'Logistics English' | 'Word forms'
  shortExplanation: string
  wrong: string
  correct: string
  memoryCue: string
  examples: string[]
}
