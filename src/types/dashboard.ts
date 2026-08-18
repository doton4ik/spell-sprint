export type NavigationItem = {
  label: string
  icon: IconName
  isActive?: boolean
  badge?: number
}

export type IconName =
  | 'dashboard'
  | 'practice'
  | 'mistakes'
  | 'rules'
  | 'topics'
  | 'analysis'
  | 'library'
  | 'settings'
  | 'arrow'
  | 'calendar'
  | 'bolt'
  | 'chevron'
  | 'check'
  | 'eye'
  | 'lightbulb'
  | 'shuffle'
  | 'skip'
  | 'refresh'
  | 'sliders'
  | 'volume'

export type Metric = {
  label: string
  value: string
  note: string
  tone: 'teal' | 'blue' | 'amber' | 'violet'
  icon: IconName
}

export type TopicProgress = {
  topic: string
  score: number
  status: 'Strong' | 'Developing' | 'Needs focus'
}

export type MistakePreview = {
  submitted: string
  correct: string
  category: string
  when: string
}

export type WeekDay = {
  label: string
  completed: number
  target: number
  isToday?: boolean
}
