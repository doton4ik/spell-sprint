export type PersonalMistakeSeed = {
  word: string
  userVersion: string
  category: string
  cue: string
  topic: string
}

export const personalMistakeSeeds: PersonalMistakeSeed[] = [
  { word: 'friend', userVersion: 'frend', category: 'Missing vowel', cue: 'i before e', topic: 'General English' },
  { word: 'receive', userVersion: 'recieved', category: 'Letter order', cue: 'ei after c', topic: 'General English' },
  { word: 'because', userVersion: 'becouse', category: 'Vowel substitution', cue: 'because: au', topic: 'General English' },
  { word: 'which', userVersion: 'wich', category: 'Missing consonant', cue: 'wh + ich', topic: 'General English' },
  { word: 'necessary', userVersion: 'nesesary', category: 'Missing letters', cue: 'one c, double s', topic: 'General English' },
  { word: 'interesting', userVersion: 'intresting', category: 'Missing vowel', cue: 'inter-esting', topic: 'General English' },
  { word: 'beautiful', userVersion: 'beautifull', category: 'Extra double consonant', cue: 'one l', topic: 'General English' },
  { word: 'tomorrow', userVersion: 'tomorow', category: 'Missing double consonant', cue: 'double r', topic: 'Travel' },
  { word: 'finally', userVersion: 'finaly', category: 'Missing double consonant', cue: 'double l', topic: 'General English' },
  { word: 'restaurant', userVersion: 'restaurent', category: 'Vowel substitution', cue: 'au + a', topic: 'Travel' },
  { word: 'breakfast', userVersion: 'breakfest', category: 'Vowel substitution', cue: 'ea', topic: 'Everyday life' },
  { word: 'bought', userVersion: 'bougth', category: 'Letter order', cue: 'ght order', topic: 'Word forms' },
  { word: 'forgotten', userVersion: 'forgoted', category: 'Wrong past participle', cue: 'forget – forgot – forgotten', topic: 'Word forms' },
  { word: 'borrow', userVersion: 'borow', category: 'Missing double consonant', cue: 'double r', topic: 'General English' },
  { word: 'directions', userVersion: 'dirrection', category: 'Word form', cue: 'one r, plural s', topic: 'Travel' },
  { word: 'recommended', userVersion: 'recomended', category: 'Missing double consonant', cue: 'double m', topic: 'Business English' },
  { word: 'useful', userVersion: 'usefull', category: 'Extra double consonant', cue: 'one l', topic: 'General English' },
  { word: 'again', userVersion: 'agian', category: 'Letter order', cue: 'a-g-a-i-n', topic: 'General English' },
]
