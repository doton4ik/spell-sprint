You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

For each of the 30 words below write **one new example sentence**. Each word already has one example (after "e.g."); yours must show the word in a DIFFERENT situation.

- food-and-drinks-caf-and-restaurant-bill | bill | счёт (в кафе, ресторане) | noun | e.g. The waiter brought the bill after our coffee.
- food-and-drinks-caf-and-restaurant-tip | tip | чаевые | noun | e.g. We left a small tip for the helpful waiter.
- places-in-town-places-in-town-square | square | площадь | noun | e.g. People gathered in the square for the concert.
- shopping-shopping-bargain | bargain | выгодная покупка | noun | e.g. This jacket was a real bargain during the sale.
- health-and-body-at-the-doctor-check-up | check-up | медосмотр | noun | e.g. I visit the doctor for a yearly check-up.
- technology-devices-and-software-storage | storage | память (устройства), хранилище | noun | e.g. The phone has enough storage for many photos.
- technology-online-life-attachment | attachment | вложение | noun | e.g. The email included an attachment with the schedule.
- technology-online-life-backup | backup | резервная копия | noun | e.g. I made a backup before updating the computer.
- nature-and-animals-nature-and-animals-eagle | eagle | орёл | noun | e.g. We saw an eagle flying above the valley.
- general-english-commonly-misspelled-rhythm | rhythm | ритм | noun | e.g. The drummer kept a steady rhythm during the song.
- general-english-confusable-words-principal | principal | главный, основной | adjective | e.g. Cost was the principal reason for our decision to stay at home.
- general-english-confusable-words-stationary | stationary | неподвижный | adjective | e.g. The bicycle remained stationary near the wall.
- common-actions-everyday-phrasal-verbs-look-up | look up | искать (в словаре) | phrase | e.g. I used a dictionary to look up the new word.
- common-actions-everyday-phrasal-verbs-set-up | set up | настроить, основать | phrase | e.g. We need to set up the new printer today.
- travel-and-culture-at-the-airport-check-in-desk | check-in desk | стойка регистрации | noun | e.g. There was a long queue at the check-in desk.
- travel-and-culture-at-the-airport-gate | gate | выход на посадку | noun | e.g. Our gate changed twenty minutes before departure.
- travel-and-culture-at-the-airport-customs-officer | customs officer | таможенник | noun | e.g. A customs officer asked to see our documents.
- travel-and-culture-at-the-airport-departure-lounge | departure lounge | зал ожидания вылета | noun | e.g. We had coffee in the departure lounge before boarding.
- travel-and-culture-on-the-plane-cabin-crew | cabin crew | бортпроводники, экипаж самолёта | noun | e.g. The cabin crew served drinks after take-off.
- jobs-and-career-job-interview-strength | strength | сильная сторона | noun | e.g. My main strength is working well under pressure.
- jobs-and-career-job-interview-weakness | weakness | слабая сторона | noun | e.g. She mentioned time management as a weakness.
- jobs-and-career-job-interview-reference | reference | рекомендация от работодателя | noun | e.g. He gave his former manager as a reference.
- jobs-and-career-job-interview-shortlist | shortlist | список финалистов | noun | e.g. Only five candidates made the final shortlist.
- jobs-and-career-at-work-annual-leave | annual leave | ежегодный отпуск | noun | e.g. I have ten days of annual leave left this year.
- shopping-paying-change | change | сдача | noun | e.g. The cashier gave me the wrong change.
- shopping-paying-currency | currency | валюта | noun | e.g. You should change your currency before the trip.
- shopping-paying-loyalty-card | loyalty card | карта лояльности | noun | e.g. I collect points with my loyalty card.
- shopping-paying-till | till | касса | noun | e.g. Please pay at the till near the door.
- shopping-paying-overpay | overpay | переплатить | verb | e.g. I did not want to overpay for the tickets.
- shopping-banking-deposit | deposit | внести деньги, депозит | verb | e.g. She plans to deposit her salary tomorrow.

## Rules for the sentence

- 6-16 words, natural, with a capital letter and a full stop or question mark.
- It must contain the word **exactly in the form written in the list** (no plural, no past tense, no other word form). The sentence will later be used with a gap, so there must be one clear right word for the gap: if two different words of the same kind fit, change the sentence.
- The meaning must match the Russian translation, the part of speech and the first example. Easy surrounding words (the learner is tested on the target word).
- A different topic or situation from the first example, not just the same sentence with one word changed.
- Neutral content. No names of brands, politics, religion, violence.

## Output format

[
  {"word_id": "travel-and-culture-on-the-plane-crew", "extra_example": "The crew checked every seat before take-off."}
]

Use the word_id exactly as written. Before you answer, check each sentence: it contains the word in the listed form and no other word could fill the gap.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
