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
  translation?: string
  library?: string
  errorType?: ErrorType
  numberOfAttempts: number
  numberOfErrors: number
  numberOfCorrectAnswers: number
  firstSeen: string
  lastSeen: string
  nextReviewAt: string
  status: LearningStatus
  goodDays?: number // successful review days since the last mistake (0–5), see reviewSchedule.ts
  memoryCue?: string
  riskLevel?: 'low' | 'medium' | 'high'
  source?: 'practice' | 'personal-baseline'
  origin?: string // Practice, Proofreading, Level check, Sprint or Pairs
  lastMistakeAt?: string
  archived?: boolean // no mistake for 30 days and right since: kept quietly, out of the way
  pairId?: string // a mistake in a look-alike pair (Pairs page)
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
