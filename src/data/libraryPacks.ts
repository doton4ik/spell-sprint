import type { LibraryWord, WordLibrary } from '../types/library'

// Optional add-on packs. Every built-in word that is not in a pack belongs to the base library, which everyone gets.
// A pack is switched on per learner in Libraries → Add-on packs.
export type LibraryPack = {
  id: string
  name: string
  description: string
  libraries: string[] // whole built-in libraries, by their name in the "library" column of the CSV
  wordIds?: string[] // or single words taken out of the base library (they stay in their topic when the pack is on)
}

// Business, office and sport are ordinary topics now; only the narrow professional vocabulary stays an add-on.
export const libraryPacks: LibraryPack[] = [
  {
    id: 'logistics',
    name: 'Logistics and Trade',
    description: 'Warehouse, stock, shipping, supply chain, import, export and freight.',
    libraries: ['Logistics and Trade'],
  },
  // Words of little use to most learners: bookish or old-fashioned ("bequeath", "poetess"), very narrow ("incisor",
  // "staccato") or rare names of things ("heifer"). They were picked from the library by hand (12 November 2026);
  // British everyday words ("fortnight", "dustbin") and hard but useful ones ("detriment") stayed in the base library.
  {
    id: 'rare',
    name: 'Rare and bookish words',
    description: 'Formal, old-fashioned and very narrow words you can leave for later.',
    libraries: [],
    wordIds: [
      'actions-abound',
      'describing-antiquated',
      'describing-beguiling',
      'actions-bequeath',
      'describing-ceaseless',
      'actions-commend',
      'sport-concerto',
      'describing-docile',
      'describing-dutiful',
      'actions-engross',
      'school-essayist',
      'nature-ewe',
      'nature-fissure',
      'actions-glean',
      'nature-heifer',
      'health-incisor',
      'home-lavatory',
      'city-lowland',
      'describing-motley',
      'feelings-mournful',
      'sport-pathos',
      'actions-pertain',
      'sport-poetess',
      'nature-reed',
      'actions-relinquish',
      'describing-remedial',
      'describing-remorseless',
      'health-sedate',
      'sport-somersault',
      'sport-staccato',
      'describing-stately',
      'feelings-tedium',
      'nature-tract',
      'tech-transistor',
      'feelings-undaunted',
      'actions-venerate',
      'office-wares',
    ],
  },
]

export function packForLibrary(libraryName: string) {
  return libraryPacks.find((pack) => pack.libraries.includes(libraryName))
}

const packOfWord = new Map(libraryPacks.flatMap((pack) => (pack.wordIds ?? []).map((wordId) => [wordId, pack] as const)))
// The pack a single word was moved into, if any
export const packForWord = (wordId: string) => packOfWord.get(wordId)

// The words of a pack among the given libraries (pass every library, also the ones switched off), each word once.
export function wordsOfPack(pack: LibraryPack, libraries: WordLibrary[]): LibraryWord[] {
  const ids = new Set(pack.wordIds)
  const seen = new Set<string>()
  const words: LibraryWord[] = []
  for (const library of libraries)
    for (const word of library.words) {
      if (seen.has(word.wordId) || !(pack.libraries.includes(library.name) || ids.has(word.wordId))) continue
      seen.add(word.wordId)
      words.push(word)
    }
  return words
}
