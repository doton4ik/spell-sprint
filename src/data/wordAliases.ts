// Some words are in two built-in libraries (accommodation is a travel word and a commonly misspelled
// word). Each row keeps its own id in its library, but they are one word to learn: answers, review
// dates and mistakes are kept under one id, so mastering it in one library masters it in both.
export const wordAliases: Readonly<Record<string, string>> = {
  'general-english-commonly-misspelled-environment': 'general-english-active-vocabulary-environment',
  'general-english-commonly-misspelled-accommodation': 'travel-and-culture-at-the-destination-accommodation',
  'food-and-drinks-caf-and-restaurant-reservation': 'travel-and-culture-travel-planning-reservation',
  'health-and-body-body-and-symptoms-injury': 'sport-and-fitness-health-and-recovery-injury',
  'health-and-body-at-the-doctor-appointment': 'everyday-life-home-and-services-appointment',
  'general-english-commonly-misspelled-neighbour': 'people-and-family-family-and-friends-neighbour',
  'general-english-commonly-misspelled-library': 'places-in-town-places-in-town-library',
  'general-english-confusable-words-weather': 'weather-and-seasons-weather-and-seasons-weather',
}

export const canonicalWordId = (wordId: string) => wordAliases[wordId] ?? wordId
