// The new flat list of library topics (docs/libraries-plan.md). One place for the ids, names and sections:
// the prompts for the assistant, the merge script and (later) the app read it from here.
export const TOPICS = [
  ['home', 'Home and Housework', 'Everyday life', 'rooms, furniture, chores, cleaning, repairs, rent'],
  ['food', 'Food and Cooking', 'Everyday life', 'meals, ingredients, cooking verbs, restaurants, drinks'],
  ['shopping', 'Shopping and Money', 'Everyday life', 'shops, prices, paying, banks, saving, spending, debt'],
  ['clothes', 'Clothes and Appearance', 'Everyday life', 'clothes, shoes, fashion, how people look'],
  ['routine', 'Daily Routine and Time', 'Everyday life', 'daily habits, days, dates, frequency, time expressions'],
  ['weather', 'Weather and Seasons', 'Everyday life', 'weather, seasons, climate, natural events'],
  ['phone', 'Phone and Messages', 'Everyday life', 'calls, texts, letters, e-mail, post'],
  ['family', 'Family and Relationships', 'People', 'relatives, friends, dating, marriage, life stages'],
  ['feelings', 'Feelings and Character', 'People', 'emotions, personality, behaviour'],
  ['ideas', 'Ideas and Society', 'People', 'opinions, society, reasons, choices, abstract everyday words'],
  ['city', 'City and Directions', 'Places and travel', 'buildings, streets, places in town, giving directions'],
  ['transport', 'Transport', 'Places and travel', 'cars, buses, trains, driving, public transport'],
  ['travel', 'Travel and Hotels', 'Places and travel', 'holidays, booking, hotels, sightseeing, luggage'],
  ['airport', 'At the Airport', 'Places and travel', 'flights, check-in, security, passport control'],
  ['health', 'Health and Body', 'Health and free time', 'body parts, illness, doctor, medicine, healthy living'],
  ['sport', 'Sport and Hobbies', 'Health and free time', 'sports, games, music, films, books, leisure'],
  ['nature', 'Nature and Animals', 'Health and free time', 'animals, plants, landscape, environment'],
  ['school', 'School and Studying', 'Study and work', 'lessons, exams, university, learning, education'],
  ['jobs', 'Jobs and Interviews', 'Study and work', 'professions, applying, CV, interview, salary, career'],
  ['office', 'Office and Business', 'Study and work', 'meetings, deadlines, e-mail at work, companies, management'],
  ['tech', 'Technology and Internet', 'Technology', 'computers, phones, apps, the web, social media, gadgets'],
  ['phrasal', 'Phrasal Verbs', 'Language', 'verb + particle (give up, look after, turn down)'],
  ['actions', 'Everyday Actions', 'Language', 'common verbs for doing, moving, thinking, saying'],
  ['describing', 'Describing Things', 'Language', 'adjectives and adverbs for size, quality, manner, degree'],
  ['misspelled', 'Commonly Misspelled Words', 'Language', 'words with tricky spelling that do not belong to a topic above'],
  ['confusable', 'Confusable Words', 'Language', 'look-alike and sound-alike words (affect/effect, principal/principle)'],
  ['logistics', 'Logistics and Trade', 'Professional', 'warehouse, stock, shipping, supply chain, import, export, tariffs, freight'],
]
// the answers still use the old id 'customs'; it is merged into 'logistics' (scripts/topic-fixes.mjs)
export const OLD_TOPIC_IDS = ['customs']
export const LEVELS = ['A2', 'B1', 'B2', 'C1']
