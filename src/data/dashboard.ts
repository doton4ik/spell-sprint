import type {
  Metric,
  MistakePreview,
  NavigationItem,
  TopicProgress,
  WeekDay,
} from '../types/dashboard'

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: 'dashboard', isActive: true },
  { label: 'Practice', icon: 'practice' },
  { label: 'My Mistakes', icon: 'mistakes', badge: 28 },
  { label: 'Rules', icon: 'rules' },
  { label: 'Topics', icon: 'topics' },
  { label: 'Test Analysis', icon: 'analysis' },
  { label: 'Libraries', icon: 'library' },
]

export const metrics: Metric[] = [
  {
    label: 'Accuracy',
    value: '76%',
    note: '+4% vs. last week',
    tone: 'teal',
    icon: 'dashboard',
  },
  {
    label: 'Repeat later',
    value: '28',
    note: '11 due today',
    tone: 'amber',
    icon: 'calendar',
  },
  {
    label: 'Errors today',
    value: '5',
    note: 'Mostly spelling',
    tone: 'violet',
    icon: 'mistakes',
  },
  {
    label: 'Completed tasks',
    value: '34',
    note: '8 more than yesterday',
    tone: 'blue',
    icon: 'practice',
  },
]

export const topicProgress: TopicProgress[] = [
  { topic: 'Logistics English', score: 82, status: 'Strong' },
  { topic: 'Business English', score: 68, status: 'Developing' },
  { topic: 'General vocabulary', score: 64, status: 'Developing' },
  { topic: 'Spelling patterns', score: 43, status: 'Needs focus' },
]

export const recentMistakes: MistakePreview[] = [
  {
    submitted: 'recieved',
    correct: 'received',
    category: 'Letter order',
    when: '10 min ago',
  },
  {
    submitted: 'tomorow',
    correct: 'tomorrow',
    category: 'Double consonant',
    when: 'Today',
  },
  {
    submitted: 'He work in logistics.',
    correct: 'He works in logistics.',
    category: 'Subject–verb agreement',
    when: 'Today',
  },
]

export const weekProgress: WeekDay[] = [
  { label: 'Mon', completed: 8, target: 12 },
  { label: 'Tue', completed: 11, target: 12 },
  { label: 'Wed', completed: 6, target: 12 },
  { label: 'Thu', completed: 12, target: 12 },
  { label: 'Fri', completed: 7, target: 12 },
  { label: 'Sat', completed: 5, target: 12 },
  { label: 'Sun', completed: 9, target: 12, isToday: true },
]

