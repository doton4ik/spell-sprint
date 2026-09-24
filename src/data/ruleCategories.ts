// The 13 areas Rules must cover (see the project brief). Stored as a fixed list so every
// category has a filter tab even before any rule has been added to it yet.
export const ruleCategories: Array<{ slug: string; label: string }> = [
  { slug: 'english_spelling', label: 'English spelling' },
  { slug: 'english_grammar', label: 'English grammar' },
  { slug: 'double_consonants', label: 'Double consonants' },
  { slug: 'vowels_and_letter_patterns', label: 'Vowels & letter patterns' },
  { slug: 'silent_letters', label: 'Silent letters' },
  { slug: 'prefixes_and_suffixes', label: 'Prefixes & suffixes' },
  { slug: 'verb_endings', label: 'Verb endings' },
  { slug: 'plural_forms', label: 'Plural forms' },
  { slug: 'confusing_words', label: 'Confusing words' },
  { slug: 'irregular_forms_and_exceptions', label: 'Irregular forms & exceptions' },
  { slug: 'compound_words_and_expressions', label: 'Compound words & expressions' },
  { slug: 'business_and_logistics_english', label: 'Business & logistics English' },
  { slug: 'personal_note', label: 'Personal notes' },
]

export function ruleCategoryLabel(slug: string) {
  return ruleCategories.find((category) => category.slug === slug)?.label ?? slug
}

export const ruleTypeLabels: Record<string, string> = {
  language_rule: 'Language rule',
  exception: 'Exception',
  confusing_words: 'Confusing words',
  personal_note: 'Personal note',
}

export const ruleStatusLabels: Record<string, string> = {
  new: 'New', learning: 'Learning', repeat_later: 'Repeat later', mastered: 'Mastered', archived: 'Archived',
}

export const rulePriorityLabels: Record<string, string> = {
  critical: 'Critical', practice: 'Practice', stable: 'Stable',
}
