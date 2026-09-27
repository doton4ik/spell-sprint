// Friendly names and one-line hints for the error patterns (see database/error-classification-seed.sql).
export const errorPatternLabels: Record<string, { label: string; hint: string }> = {
  missing_letter: { label: 'Missing letter', hint: 'A letter of the correct word was left out.' },
  extra_letter: { label: 'Extra letter', hint: 'A letter was added that is not in the word.' },
  letter_substitution: { label: 'Wrong letter', hint: 'One letter was written instead of another.' },
  letter_transposition: { label: 'Swapped letters', hint: 'Two neighbouring letters are in the wrong order.' },
  multiple_edits: { label: 'Several changes', hint: 'More than one letter needs fixing.' },
  wrong_word: { label: 'Different word', hint: 'The answer is a different word altogether.' },
  blank_answer: { label: 'No answer', hint: 'Nothing was typed.' },
  missing_double_consonant: { label: 'Double consonant', hint: 'This word has a doubled consonant.' },
  extra_double_consonant: { label: 'Only one consonant', hint: 'This consonant is not doubled in the correct word.' },
  missing_vowel: { label: 'Missing vowel', hint: 'A vowel was left out.' },
  extra_vowel: { label: 'Extra vowel', hint: 'An extra vowel was added.' },
  vowel_substitution: { label: 'Vowel mix-up', hint: 'A different vowel is needed.' },
  vowel_order: { label: 'Vowel order', hint: 'Two vowels are in the wrong order.' },
  silent_letter: { label: 'Silent letter', hint: 'A letter that is written but not pronounced.' },
  suffix_error: { label: 'Word ending', hint: 'The mistake is inside the ending of the word.' },
  silent_e_before_suffix: { label: 'Silent e before -ing/-ed', hint: 'Drop the silent e before -ing or -ed: make → making.' },
  doubling_before_suffix: { label: 'Doubling before -ing/-ed', hint: 'Short verbs double the last consonant: plan → planning.' },
  ful_suffix: { label: 'Suffix -ful', hint: 'The suffix -ful has one l: useful, careful.' },
  ly_suffix: { label: 'Adverb -ly', hint: 'happy → happily, final → finally, gentle → gently.' },
  able_ible: { label: '-able or -ible', hint: 'The right word with the wrong ending: available, possible.' },
  prefix_error: { label: 'Word beginning', hint: 'The mistake is inside the beginning of the word.' },
  verb_ending_error: { label: 'Verb ending', hint: 'Check the -ing / -ed / -s ending.' },
  plural_ending_error: { label: 'Plural ending', hint: 'Check the plural ending.' },
  grammar_rule_error: { label: 'Grammar', hint: 'A grammar rule is involved.' },
  confusing_words_error: { label: 'Confusing words', hint: 'These two words are easy to mix up.' },
  phonetic_spelling: { label: 'Spelled by ear', hint: 'The word was written the way it sounds.' },
  unclassified: { label: 'Other', hint: 'No clear pattern yet.' },
}

export function errorPatternLabel(slug: string) {
  return errorPatternLabels[slug] ?? { label: slug, hint: '' }
}
