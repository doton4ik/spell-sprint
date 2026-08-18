import type { LearningRule } from '../types/learning'

export const learningRules: LearningRule[] = [
  {
    id: 'double-consonants', title: 'Double consonants', family: 'Spelling',
    shortExplanation: 'Some common words need doubled letters. Learn the whole visual pattern instead of relying only on sound.',
    wrong: 'tomorow', correct: 'tomorrow', memoryCue: 'Tomorrow has a double r; useful has one l.',
    examples: ['message', 'beginning', 'recommended', 'borrow'],
  },
  {
    id: 'vowel-order', title: 'Vowel order: i and e', family: 'Spelling',
    shortExplanation: 'The order of i and e changes the spelling. Treat frequent words as a fixed letter pattern.',
    wrong: 'recieved', correct: 'received', memoryCue: 'After c, use ei: receive.',
    examples: ['receive', 'ceiling', 'their', 'believe'],
  },
  {
    id: 'did-base-verb', title: 'Base verb after did', family: 'Grammar',
    shortExplanation: 'Did and didn’t already carry the past meaning, so the next verb stays in its base form.',
    wrong: 'I didn’t went.', correct: 'I didn’t go.', memoryCue: 'Did = past. The next verb goes back to base form.',
    examples: ['Did you receive it?', 'We didn’t order it.', 'She didn’t forget.', 'They did send the invoice.'],
  },
  {
    id: 'subject-verb-agreement', title: 'Subject–verb agreement', family: 'Grammar',
    shortExplanation: 'In the present simple, a singular subject needs a verb ending in -s.',
    wrong: 'The supplier deliver goods.', correct: 'The supplier delivers goods.', memoryCue: 'One person or thing → verb + s.',
    examples: ['He works in logistics.', 'The truck arrives at noon.', 'She checks stock.', 'The system shows the balance.'],
  },
  {
    id: 'business-prepositions', title: 'Business prepositions', family: 'Business English',
    shortExplanation: 'Professional phrases often use one fixed preposition. Learn the complete phrase together.',
    wrong: 'responsible on the order', correct: 'responsible for the order', memoryCue: 'Responsible for, depend on, focus on.',
    examples: ['depend on demand', 'discuss the issue', 'reply to a customer', 'agree on a deadline'],
  },
  {
    id: 'logistics-terms', title: 'Precise logistics terms', family: 'Logistics English',
    shortExplanation: 'Use the precise term for the warehouse action, document, or stock movement.',
    wrong: 'move the stock paper', correct: 'post a goods movement', memoryCue: 'Goods movement is the SAP and warehouse term.',
    examples: ['inventory accuracy', 'storage location', 'goods receipt', 'stock transfer'],
  },
]
