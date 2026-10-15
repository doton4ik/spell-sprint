// The topics of the built-in library, in the order a learner sees them. One place for names and sections:
// a section is what used to be a "library group" (Libraries → tabs, the first-run setup, the topic list).
// The same list lives in scripts/library-topics.mjs for the content scripts; a test keeps the two equal.
export type LibraryTopic = { id: string; name: string; section: LibrarySectionId; about: string }
export type LibrarySectionId =
  'everyday-life' | 'people' | 'places-travel' | 'health-free-time' | 'study-work' | 'technology' | 'language' | 'professional'

export const librarySections: { id: LibrarySectionId; name: string; description: string }[] = [
  { id: 'everyday-life', name: 'Everyday life', description: 'Home, food, shopping, clothes, time, weather and phones.' },
  { id: 'people', name: 'People', description: 'Family, relationships, feelings, character and opinions.' },
  { id: 'places-travel', name: 'Places and travel', description: 'The city, transport, trips, hotels and airports.' },
  { id: 'health-free-time', name: 'Health and free time', description: 'Body and health, sport, hobbies, nature and animals.' },
  { id: 'study-work', name: 'Study and work', description: 'School, jobs, interviews, the office and business.' },
  { id: 'technology', name: 'Technology', description: 'Computers, phones, apps and the internet.' },
  { id: 'language', name: 'Language', description: 'Phrasal verbs, common verbs, adjectives, tricky spellings and look-alike words.' },
  { id: 'professional', name: 'Professional', description: 'Optional vocabulary for logistics, warehouses and trade.' },
]

export const libraryTopics: LibraryTopic[] = [
  { id: 'home', name: 'Home and Housework', section: 'everyday-life', about: 'rooms, furniture, chores, cleaning, repairs, rent' },
  { id: 'food', name: 'Food and Cooking', section: 'everyday-life', about: 'meals, ingredients, cooking verbs, restaurants, drinks' },
  { id: 'shopping', name: 'Shopping and Money', section: 'everyday-life', about: 'shops, prices, paying, banks, saving, spending, debt' },
  { id: 'clothes', name: 'Clothes and Appearance', section: 'everyday-life', about: 'clothes, shoes, fashion, how people look' },
  {
    id: 'routine',
    name: 'Daily Routine and Time',
    section: 'everyday-life',
    about: 'daily habits, days, dates, frequency, time expressions',
  },
  { id: 'weather', name: 'Weather and Seasons', section: 'everyday-life', about: 'weather, seasons, climate, natural events' },
  { id: 'phone', name: 'Phone and Messages', section: 'everyday-life', about: 'calls, texts, letters, e-mail, post' },
  { id: 'family', name: 'Family and Relationships', section: 'people', about: 'relatives, friends, dating, marriage, life stages' },
  { id: 'feelings', name: 'Feelings and Character', section: 'people', about: 'emotions, personality, behaviour' },
  { id: 'ideas', name: 'Ideas and Society', section: 'people', about: 'opinions, society, reasons, choices, abstract everyday words' },
  { id: 'city', name: 'City and Directions', section: 'places-travel', about: 'buildings, streets, places in town, giving directions' },
  { id: 'transport', name: 'Transport', section: 'places-travel', about: 'cars, buses, trains, driving, public transport' },
  { id: 'travel', name: 'Travel and Hotels', section: 'places-travel', about: 'holidays, booking, hotels, sightseeing, luggage' },
  { id: 'airport', name: 'At the Airport', section: 'places-travel', about: 'flights, check-in, security, passport control' },
  { id: 'health', name: 'Health and Body', section: 'health-free-time', about: 'body parts, illness, doctor, medicine, healthy living' },
  { id: 'sport', name: 'Sport and Hobbies', section: 'health-free-time', about: 'sports, games, music, films, books, leisure' },
  { id: 'nature', name: 'Nature and Animals', section: 'health-free-time', about: 'animals, plants, landscape, environment' },
  { id: 'school', name: 'School and Studying', section: 'study-work', about: 'lessons, exams, university, learning, education' },
  { id: 'jobs', name: 'Jobs and Interviews', section: 'study-work', about: 'professions, applying, CV, interview, salary, career' },
  { id: 'office', name: 'Office and Business', section: 'study-work', about: 'meetings, deadlines, e-mail at work, companies, management' },
  { id: 'tech', name: 'Technology and Internet', section: 'technology', about: 'computers, phones, apps, the web, social media, gadgets' },
  { id: 'phrasal', name: 'Phrasal Verbs', section: 'language', about: 'verb + particle (give up, look after, turn down)' },
  { id: 'actions', name: 'Everyday Actions', section: 'language', about: 'common verbs for doing, moving, thinking, saying' },
  { id: 'describing', name: 'Describing Things', section: 'language', about: 'adjectives and adverbs for size, quality, manner, degree' },
  { id: 'misspelled', name: 'Commonly Misspelled Words', section: 'language', about: 'words with tricky spelling' },
  { id: 'confusable', name: 'Confusable Words', section: 'language', about: 'look-alike and sound-alike words (affect/effect)' },
  {
    id: 'logistics',
    name: 'Logistics and Trade',
    section: 'professional',
    about: 'warehouse, stock, shipping, supply chain, import, export, tariffs, freight',
  },
]

export const cefrLevels = ['A2', 'B1', 'B2', 'C1'] as const
export type CefrLevel = (typeof cefrLevels)[number]
export const isCefrLevel = (value: string | undefined): value is CefrLevel => (cefrLevels as readonly string[]).includes(value ?? '')
