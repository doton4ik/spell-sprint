import type { PracticeSettings, PracticeTask } from '../types/practice'

export const defaultPracticeSettings: PracticeSettings = {
  showHints: false,
  writeUntilCorrect: true,
  allowSkip: true,
  showRuleAfterMistake: true,
  repeatDifficultItemLater: true,
  speechLocale: 'en-US',
}

export const mixedPracticeTasks: PracticeTask[] = [
  {
    id: 'spelling-environment', type: 'correct-spelling', topic: 'General English', level: 'B1',
    prompt: 'enviroment', answer: 'environment',
    hint: 'Think of the word “iron” in the middle: env + iron + ment.',
    rule: 'Environment has one n after “e” and ends in -ment.', errorCategory: 'Missing vowel',
  },
  {
    id: 'translate-deadline', type: 'translate-ru-en', topic: 'Business English', level: 'B1',
    prompt: 'крайний срок', answer: 'deadline',
    hint: 'A date after which a task is late.',
    rule: 'Business vocabulary: deadline is a fixed date or time for completion.', errorCategory: 'Inactive vocabulary',
  },
  {
    id: 'translate-inventory', type: 'translate-en-ru', topic: 'Logistics English', level: 'B1+',
    prompt: 'inventory', answer: 'запасы', acceptedAnswers: ['инвентарь', 'товарные запасы'],
    hint: 'In a warehouse, this means the goods a company has available.',
    rule: 'Logistics vocabulary: inventory refers to stock or goods held for sale or use.', errorCategory: 'Wrong translation',
  },
  {
    id: 'grammar-supplier-agreement', type: 'correct-sentence', topic: 'Business English', level: 'B1',
    prompt: 'The supplier deliver the goods every Monday.', answer: 'The supplier delivers the goods every Monday.',
    hint: 'The subject is singular: “the supplier”.',
    rule: 'In the present simple, add -s to the verb after he, she, it, or a singular noun.', errorCategory: 'Subject–verb agreement',
  },
  {
    id: 'spelling-recommended', type: 'correct-spelling', topic: 'General English', level: 'B1+',
    prompt: 'recomended', answer: 'recommended',
    hint: 'The base word is “recommend” — notice its double consonant.',
    rule: 'Recommended keeps the double m from recommend and adds -ed.', errorCategory: 'Missing double consonant',
  },
  {
    id: 'translate-supplier', type: 'translate-ru-en', topic: 'Logistics English', level: 'B1',
    prompt: 'поставщик', answer: 'supplier',
    hint: 'A company or person that provides materials or goods.',
    rule: 'Logistics vocabulary: a supplier provides goods, materials, or services.', errorCategory: 'Inactive vocabulary',
  },
  {
    id: 'translate-shipment', type: 'translate-en-ru', topic: 'Logistics English', level: 'B1+',
    prompt: 'shipment', answer: 'поставка', acceptedAnswers: ['отгрузка', 'груз', 'партия груза'],
    hint: 'It is a quantity of goods sent somewhere.',
    rule: 'Logistics vocabulary: a shipment is a load of goods sent by a supplier or carrier.', errorCategory: 'Wrong translation',
  },
  {
    id: 'grammar-did-base-form', type: 'correct-sentence', topic: 'Grammar', level: 'B1',
    prompt: 'We didn’t received the material document.', answer: 'We didn’t receive the material document.',
    hint: 'After “didn’t”, use the base form of the verb.',
    rule: 'After did or didn’t, use the base form: didn’t receive, not didn’t received.', errorCategory: 'Verb form',
  },
]

export const taskTypeLabels: Record<PracticeTask['type'], string> = {
  'correct-spelling': 'Correct spelling',
  'translate-ru-en': 'Write in English',
  'translate-en-ru': 'Translate to Russian',
  'correct-sentence': 'Correct sentence',
}
