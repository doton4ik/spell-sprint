import type { PracticeTaskType } from './practice'

export type DiagnosticBlockId = 'spelling' | 'vocabulary' | 'grammar' | 'business' | 'logistics' | 'production'

export type DiagnosticBlock = {
  id: DiagnosticBlockId
  label: string
  description: string
  total: number
}

export type DiagnosticTask = {
  id: string
  blockId: DiagnosticBlockId
  type: PracticeTaskType
  prompt: string
  answer: string
  acceptedAnswers?: string[]
  topic: string
}

export type DiagnosticAnswer = {
  taskId: string
  blockId: DiagnosticBlockId
  isCorrect: boolean
  skipped: boolean
  answer: string
}

export type DiagnosticResult = {
  completedAt: string
  answers: DiagnosticAnswer[]
  incomplete: boolean
}
