// Mirrors the Supabase "rules" module (database/rules-schema.sql). Field names are camelCase
// here; the service layer converts to/from the snake_case columns used by Postgres.

export type RuleType = 'language_rule' | 'exception' | 'confusing_words' | 'personal_note'
export type RuleSource = 'built-in' | 'personal'
export type RuleVisibility = 'public' | 'private'
export type RuleExampleType = 'correct' | 'incorrect' | 'exception'
export type RuleWordRelation = 'primary' | 'related'
export type RuleExerciseType = 'spell' | 'correct_word' | 'multiple_choice' | 'fill_gap' | 'grammar'
export type RuleStatus = 'new' | 'learning' | 'repeat_later' | 'mastered' | 'archived'
export type RulePriority = 'critical' | 'practice' | 'stable'

export type Rule = {
  id: string
  slug: string
  title: string
  category: string
  ruleType: RuleType
  shortExplanation: string
  ttsText?: string
  mnemonic?: string
  source: RuleSource
  visibility: RuleVisibility
  createdBy?: string
  isActive: boolean
  metadata: Record<string, unknown>
}

export type RuleExample = {
  id: string
  ruleId: string
  exampleType: RuleExampleType
  text: string
  correction?: string
  note?: string
}

export type RuleWordLink = {
  id: string
  ruleId: string
  wordId: string
  relation: RuleWordRelation
  note?: string
}

export type RuleExercise = {
  id: string
  ruleId: string
  exerciseType: RuleExerciseType
  prompt: string
  answer: string
  choices?: string[]
  metadata: Record<string, unknown>
}

export type RuleRelationship = {
  id: string
  ruleId: string
  relatedRuleId: string
  relationType?: string
}

// Personal, per-user data. Everything below is scoped to auth.uid() by RLS.

export type MistakeEvent = {
  id: string
  userId: string
  wordId?: string
  taskId?: string
  userAnswer?: string
  correctAnswer?: string
  errorType?: string
  errorCategory?: string
  category: string // 'Classified' once linked to at least one rule, 'Unclassified' otherwise
  createdAt: string
}

export type MistakeRuleLink = {
  id: string
  mistakeEventId: string
  ruleId: string
  userId: string
  createdAt: string
}

export type UserRuleProgress = {
  id?: string
  userId: string
  ruleId: string
  status: RuleStatus
  priority: RulePriority
  mistakeCount: number
  correctCount: number
  correctCalendarDays: string[] // distinct 'YYYY-MM-DD' days with a correct answer, towards the 5-day mastered rule
  lastResultAt?: string
}

export type RulePracticeAttempt = {
  id: string
  userId: string
  ruleId: string
  exerciseId?: string
  isCorrect: boolean
  createdAt: string
}

export type UserRuleNote = {
  id?: string
  userId: string
  ruleId: string
  note: string
}

// Outcome of recording one practice mistake against the rules module.
export type MistakeRecordOutcome = { recorded: boolean; ruleIds: string[]; unclassified: boolean; patternSlugs: string[] }
