# NEW, SEPARATE TASK (topics-03.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY the 97 words listed below and nothing else.

You help organise the word lists of an English-spelling app for Russian-speaking learners. For each word choose ONE topic from the list and ONE level.

## Topics (use the id exactly)
- home = Home and Housework: rooms, furniture, chores, cleaning, repairs, rent
- food = Food and Cooking: meals, ingredients, cooking verbs, restaurants, drinks
- shopping = Shopping and Money: shops, prices, paying, banks, saving, spending, debt
- clothes = Clothes and Appearance: clothes, shoes, fashion, how people look
- routine = Daily Routine and Time: daily habits, days, dates, frequency, time expressions
- weather = Weather and Seasons: weather, seasons, climate, natural events
- phone = Phone and Messages: calls, texts, letters, e-mail, post
- family = Family and Relationships: relatives, friends, dating, marriage, life stages
- feelings = Feelings and Character: emotions, personality, behaviour, opinions
- city = City and Directions: buildings, streets, places in town, giving directions
- transport = Transport: cars, buses, trains, driving, public transport
- travel = Travel and Hotels: holidays, booking, hotels, sightseeing, luggage
- airport = At the Airport: flights, check-in, security, passport control
- health = Health and Body: body parts, illness, doctor, medicine, healthy living
- sport = Sport and Hobbies: sports, games, music, films, books, leisure
- nature = Nature and Animals: animals, plants, landscape, environment
- school = School and Studying: lessons, exams, university, learning, education
- jobs = Jobs and Interviews: professions, applying, CV, interview, salary, career
- office = Office and Business: meetings, deadlines, e-mail at work, companies, management
- tech = Technology and Internet: computers, phones, apps, the web, social media, gadgets
- phrasal = Phrasal Verbs: verb + particle (give up, look after, turn down)
- actions = Everyday Actions: common verbs for doing, moving, thinking, saying
- describing = Describing Things: adjectives and adverbs for size, quality, manner, degree
- misspelled = Commonly Misspelled Words: words with tricky spelling that do not belong to a topic above
- confusable = Confusable Words: look-alike and sound-alike words (affect/effect, principal/principle)
- logistics = Logistics and Warehouse: warehouse, stock, shipping, supply chain
- customs = Customs and Trade: import, export, tariffs, customs documents, freight

## Rules
- Pick the topic where a learner would most expect to find the word. A word has exactly one topic.
- "old:" shows where the word sits today (library / topic) and an old easy/medium/hard mark. The old names are vague, so use them only as a hint; the word, its translation and the example sentence decide.
- If a word fits the topic of its sentence only by accident, judge the word itself (e.g. "delay" is transport or office, not "weather" because the example mentions rain).
- misspelled = a word chosen mainly because its spelling is tricky and it has no clear topic; confusable = a word whose job is to be told apart from a look-alike. Use these two only when the old library clearly says so ("Commonly Misspelled", "Confusable").
- logistics and customs are for professional words that an ordinary learner would not meet outside that work; a general word like "stock" or "deliver" goes to a normal topic (shopping, office, transport).
- Level is CEFR: A2 = basic everyday word; B1 = common word, intermediate; B2 = upper-intermediate; C1 = advanced or formal. Use the Oxford 3000/5000 lists and your own knowledge of the word's frequency. Old easy/medium/hard is only a hint: easy is usually A2 or B1, hard is usually B2 or C1, but decide by the word. Do not use A1 or C2: give A1 words A2 and C2 words C1.
- Do not change, skip, add or reorder words. Return one entry per input word, in the same order.

## Output format
ONE code block (three backticks + json). One entry per line: ["word_id","topic_id","level"]. No comments, no text before or after.

```json
[
["technology-online-life-website","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
technology-online-life-website | website (noun) | сайт | old: Technology and Internet Core / Technology, medium | The company website provides useful information.
technology-online-life-browser | browser (noun) | браузер | old: Technology and Internet Core / Technology, medium | I opened the website in a different browser.
technology-online-life-attachment | attachment (noun) | вложение | old: Technology and Internet Core / Technology, hard | The email included an attachment with the schedule.
technology-online-life-username | username (noun) | имя пользователя | old: Technology and Internet Core / Technology, medium | Choose a username that is easy to remember.
technology-online-life-notification | notification (noun) | уведомление | old: Technology and Internet Core / Technology, hard | The app sent a notification about the new message.
technology-online-life-subscribe | subscribe (verb) | подписаться | old: Technology and Internet Core / Technology, medium | You can subscribe to the newsletter for weekly updates.
technology-online-life-account | account (noun) | аккаунт, учётная запись | old: Technology and Internet Core / Technology, medium | I created an account to save my progress.
technology-online-life-privacy | privacy (noun) | конфиденциальность | old: Technology and Internet Core / Technology, hard | The application settings include a privacy section.
technology-online-life-search-engine | search engine (noun) | поисковая система | old: Technology and Internet Core / Technology, medium | I used a search engine to find the address.
technology-online-life-social-media | social media (noun) | соцсети | old: Technology and Internet Core / Technology, easy | Many people use social media to share news.
technology-online-life-delete | delete (verb) | удалить | old: Technology and Internet Core / Technology, medium | Please delete the old files after checking them.
technology-online-life-backup | backup (noun) | резервная копия | old: Technology and Internet Core / Technology, medium | I made a backup before updating the computer.
nature-and-animals-nature-and-animals-forest | forest (noun) | лес | old: Nature and Weather Core / Nature and Animals, medium | We walked through the forest on a cool morning.
nature-and-animals-nature-and-animals-mountain | mountain (noun) | гора | old: Nature and Weather Core / Nature and Animals, medium | The mountain was covered with snow in winter.
nature-and-animals-nature-and-animals-valley | valley (noun) | долина | old: Nature and Weather Core / Nature and Animals, medium | A small river runs through the green valley.
nature-and-animals-nature-and-animals-island | island (noun) | остров | old: Nature and Weather Core / Nature and Animals, hard | They visited a quiet island during their holiday.
nature-and-animals-nature-and-animals-wildlife | wildlife (noun) | дикие животные (и растения) | old: Nature and Weather Core / Nature and Animals, medium | The national park protects local wildlife.
nature-and-animals-nature-and-animals-insect | insect (noun) | насекомое | old: Nature and Weather Core / Nature and Animals, medium | A small insect landed on the window.
nature-and-animals-nature-and-animals-butterfly | butterfly (noun) | бабочка | old: Nature and Weather Core / Nature and Animals, hard | A colourful butterfly rested on the flower.
nature-and-animals-nature-and-animals-squirrel | squirrel (noun) | белка | old: Nature and Weather Core / Nature and Animals, hard | A squirrel quickly climbed the tree.
nature-and-animals-nature-and-animals-eagle | eagle (noun) | орёл | old: Nature and Weather Core / Nature and Animals, medium | We saw an eagle flying above the valley.
nature-and-animals-nature-and-animals-pollution | pollution (noun) | загрязнение | old: Nature and Weather Core / Nature and Animals, hard | Public transport can help reduce air pollution.
nature-and-animals-nature-and-animals-recycle | recycle (verb) | перерабатывать | old: Nature and Weather Core / Nature and Animals, medium | We recycle paper and plastic at home.
weather-and-seasons-weather-and-seasons-weather | weather (noun) | погода | old: Nature and Weather Core / Weather and Seasons, medium | The weather changed suddenly before the walk.
weather-and-seasons-weather-and-seasons-temperature | temperature (noun) | температура (сколько градусов) | old: Nature and Weather Core / Weather and Seasons, hard | The temperature dropped during the night.
weather-and-seasons-weather-and-seasons-forecast | forecast (noun) | прогноз | old: Nature and Weather Core / Weather and Seasons, hard | The weather forecast predicts rain tomorrow.
weather-and-seasons-weather-and-seasons-thunderstorm | thunderstorm (noun) | гроза | old: Nature and Weather Core / Weather and Seasons, hard | A thunderstorm interrupted our evening walk.
weather-and-seasons-weather-and-seasons-breeze | breeze (noun) | лёгкий ветер | old: Nature and Weather Core / Weather and Seasons, medium | A cool breeze came through the open window.
weather-and-seasons-weather-and-seasons-drizzle | drizzle (noun) | морось | old: Nature and Weather Core / Weather and Seasons, hard | Light drizzle continued throughout the morning.
weather-and-seasons-weather-and-seasons-humid | humid (adjective) | влажный | old: Nature and Weather Core / Weather and Seasons, hard | The room felt humid after the heavy rain.
weather-and-seasons-weather-and-seasons-freezing | freezing (adjective) | очень холодный, морозный | old: Nature and Weather Core / Weather and Seasons, medium | It was freezing outside, so I wore two coats.
weather-and-seasons-weather-and-seasons-autumn | autumn (noun) | осень | old: Nature and Weather Core / Weather and Seasons, medium | The trees become colourful in autumn.
weather-and-seasons-weather-and-seasons-spring | spring (noun) | весна | old: Nature and Weather Core / Weather and Seasons, easy | Flowers begin to grow in spring.
weather-and-seasons-weather-and-seasons-flood | flood (noun) | наводнение | old: Nature and Weather Core / Weather and Seasons, medium | The heavy rain caused a flood near the river.
weather-and-seasons-weather-and-seasons-drought | drought (noun) | засуха | old: Nature and Weather Core / Weather and Seasons, hard | The long drought damaged many local farms.
general-english-commonly-misspelled-accommodation | accommodation (noun) | жильё, проживание, размещение | old: Spelling Traps Core / General English, hard | Our accommodation was clean and close to public transport.
general-english-commonly-misspelled-receive | receive (verb) | получать | old: Spelling Traps Core / General English, hard | I expect to receive the package tomorrow morning.
general-english-commonly-misspelled-separate | separate (adjective) | отдельный; разделять | old: Spelling Traps Core / General English, hard | Please keep the clean and dirty clothes separate.
general-english-commonly-misspelled-definitely | definitely (adverb) | определённо | old: Spelling Traps Core / General English, hard | I will definitely call you after the meeting.
general-english-commonly-misspelled-occasionally | occasionally (adverb) | время от времени | old: Spelling Traps Core / General English, hard | We occasionally eat dinner at a small restaurant.
general-english-commonly-misspelled-necessary | necessary (adjective) | необходимый | old: Spelling Traps Core / General English, hard | A valid passport is necessary for this journey.
general-english-commonly-misspelled-embarrass | embarrass (verb) | смущать | old: Spelling Traps Core / General English, hard | I did not want to embarrass my colleague.
general-english-commonly-misspelled-environment | environment (noun) | окружающая среда | old: Spelling Traps Core / General English, medium | We should protect the environment by wasting less water.
general-english-commonly-misspelled-government | government (noun) | правительство | old: Spelling Traps Core / General English, hard | The government announced new support for small businesses.
general-english-commonly-misspelled-restaurant | restaurant (noun) | ресторан | old: Spelling Traps Core / General English, hard | We chose a quiet restaurant near the station.
general-english-commonly-misspelled-calendar | calendar (noun) | календарь | old: Spelling Traps Core / General English, hard | I marked the appointment on my calendar.
general-english-commonly-misspelled-library | library (noun) | библиотека | old: Spelling Traps Core / General English, medium | I borrowed an English dictionary from the library.
general-english-commonly-misspelled-february | February (noun) | февраль | old: Spelling Traps Core / General English, hard | My sister was born in February, the shortest month.
general-english-commonly-misspelled-wednesday | Wednesday (noun) | среда (день недели) | old: Spelling Traps Core / General English, hard | Our English lesson moves to Wednesday this week.
general-english-commonly-misspelled-knowledge | knowledge (noun) | знание | old: Spelling Traps Core / General English, hard | Her knowledge of computers helped the whole team.
general-english-commonly-misspelled-achieve | achieve (verb) | достигать | old: Spelling Traps Core / General English, hard | Daily practice can help you achieve your goals.
general-english-commonly-misspelled-believe | believe (verb) | верить | old: Spelling Traps Core / General English, medium | I believe this plan will save us time.
general-english-commonly-misspelled-foreign | foreign (adjective) | иностранный | old: Spelling Traps Core / General English, hard | Learning a foreign language takes patience and practice.
general-english-commonly-misspelled-weird | weird (adjective) | странный | old: Spelling Traps Core / General English, hard | That weird sound came from the old machine.
general-english-commonly-misspelled-neighbour | neighbour (noun) | сосед | old: Spelling Traps Core / General English, hard | Our neighbour helped carry the heavy boxes.
general-english-commonly-misspelled-privilege | privilege (noun) | привилегия | old: Spelling Traps Core / General English, hard | It is a privilege to learn from experienced colleagues.
general-english-commonly-misspelled-conscience | conscience (noun) | совесть | old: Spelling Traps Core / General English, hard | His conscience told him to return the lost wallet.
general-english-commonly-misspelled-rhythm | rhythm (noun) | ритм | old: Spelling Traps Core / General English, hard | The drummer kept a steady rhythm during the song.
general-english-commonly-misspelled-answer | answer (noun) | ответ | old: Spelling Traps Core / General English, medium | Please write your answer in the correct box.
general-english-confusable-words-their | their (adjective) | их (притяжательное) | old: Spelling Traps Core / General English, medium | The students put their books on the desk.
general-english-confusable-words-there | there (adverb) | там | old: Spelling Traps Core / General English, medium | Your keys are over there beside the phone.
general-english-confusable-words-affect | affect (verb) | влиять | old: Spelling Traps Core / General English, hard | Lack of sleep can affect your concentration.
general-english-confusable-words-effect | effect (noun) | эффект, результат | old: Spelling Traps Core / General English, hard | The new rule had a positive effect on safety.
general-english-confusable-words-principal | principal (adjective) | главный, основной | old: Spelling Traps Core / General English, hard | Cost was the principal reason for our decision to stay at home.
general-english-confusable-words-principle | principle (noun) | принцип | old: Spelling Traps Core / General English, hard | Fairness is an important principle at work.
general-english-confusable-words-stationary | stationary (adjective) | неподвижный | old: Spelling Traps Core / General English, hard | The bicycle remained stationary near the wall.
general-english-confusable-words-stationery | stationery (noun) | канцтовары | old: Spelling Traps Core / General English, hard | The office ordered new stationery for the team.
general-english-confusable-words-advice | advice (noun) | совет | old: Spelling Traps Core / General English, medium | My teacher gave me useful advice about pronunciation.
general-english-confusable-words-advise | advise (verb) | советовать | old: Spelling Traps Core / General English, medium | I advise you to check the address twice.
general-english-confusable-words-loose | loose (adjective) | свободный (об одежде), расшатанный | old: Spelling Traps Core / General English, medium | The loose handle needs to be repaired.
general-english-confusable-words-lose | lose (verb) | терять | old: Spelling Traps Core / General English, medium | Try not to lose your ticket during the journey.
general-english-confusable-words-quiet | quiet (adjective) | тихий | old: Spelling Traps Core / General English, medium | The library is quiet in the afternoon.
general-english-confusable-words-quite | quite (adverb) | довольно | old: Spelling Traps Core / General English, medium | The new exercise was quite difficult for me.
general-english-confusable-words-weather | weather (noun) | погода | old: Spelling Traps Core / General English, medium | The weather changed suddenly before the walk.
general-english-confusable-words-whether | whether (conjunction) | ли (вводит вопрос) | old: Spelling Traps Core / General English, medium | I do not know whether the shop is open.
common-actions-everyday-phrasal-verbs-look-up | look up (phrase) | искать (в словаре) | old: Phrasal Verbs Core / Common Actions, easy | I used a dictionary to look up the new word.
common-actions-everyday-phrasal-verbs-give-up | give up (phrase) | сдаваться, бросать (привычку) | old: Phrasal Verbs Core / Common Actions, easy | Do not give up when the exercise becomes difficult.
common-actions-everyday-phrasal-verbs-turn-on | turn on (phrase) | включить | old: Phrasal Verbs Core / Common Actions, easy | Please turn on the light before you read.
common-actions-everyday-phrasal-verbs-turn-off | turn off (phrase) | выключить | old: Phrasal Verbs Core / Common Actions, easy | Remember to turn off the computer after work.
common-actions-everyday-phrasal-verbs-find-out | find out (phrase) | выяснить | old: Phrasal Verbs Core / Common Actions, medium | I called the office to find out the opening time.
common-actions-everyday-phrasal-verbs-figure-out | figure out (phrase) | разобраться | old: Phrasal Verbs Core / Common Actions, medium | We worked together to figure out the problem.
common-actions-everyday-phrasal-verbs-carry-on | carry on (phrase) | продолжать | old: Phrasal Verbs Core / Common Actions, medium | Please carry on with the task while I am away.
common-actions-everyday-phrasal-verbs-break-down | break down (phrase) | сломаться | old: Phrasal Verbs Core / Common Actions, medium | The old car may break down during the journey.
common-actions-everyday-phrasal-verbs-run-out-of | run out of (phrase) | закончиться (о запасах) | old: Phrasal Verbs Core / Common Actions, medium | We may run out of milk before the shops open.
common-actions-everyday-phrasal-verbs-put-off | put off (phrase) | откладывать | old: Phrasal Verbs Core / Common Actions, hard | Do not put off your important homework until Sunday.
common-actions-everyday-phrasal-verbs-set-up | set up (phrase) | настроить, основать | old: Phrasal Verbs Core / Common Actions, medium | We need to set up the new printer today.
common-actions-everyday-phrasal-verbs-take-off | take off (phrase) | взлетать, снимать | old: Phrasal Verbs Core / Common Actions, medium | The plane will take off after the storm ends.
common-actions-everyday-phrasal-verbs-get-along-with | get along with (phrase) | ладить с | old: Phrasal Verbs Core / Common Actions, hard | I get along with my colleagues very well.
common-actions-everyday-phrasal-verbs-come-across | come across (phrase) | наткнуться на | old: Phrasal Verbs Core / Common Actions, hard | You may come across new words in every article.
common-actions-everyday-phrasal-verbs-work-out | work out (phrase) | решить; тренироваться | old: Phrasal Verbs Core / Common Actions, hard | I work out at the gym three times a week.
common-actions-everyday-phrasal-verbs-show-up | show up (phrase) | появиться | old: Phrasal Verbs Core / Common Actions, medium | Please show up ten minutes before the appointment.
common-actions-everyday-phrasal-verbs-call-off | call off (phrase) | отменить | old: Phrasal Verbs Core / Common Actions, hard | They had to call off the match because of rain.
common-actions-everyday-phrasal-verbs-look-forward-to | look forward to (phrase) | ждать с нетерпением | old: Phrasal Verbs Core / Common Actions, hard | I look forward to visiting my family next month.
travel-and-culture-at-the-airport-boarding-pass | boarding pass (noun) | посадочный талон | old: Airport and Travel Core / Travel and Culture, medium | Please show your boarding pass at the gate.
travel-and-culture-at-the-airport-passport-control | passport control (noun) | паспортный контроль | old: Airport and Travel Core / Travel and Culture, medium | We waited twenty minutes at passport control.
travel-and-culture-at-the-airport-baggage-claim | baggage claim (noun) | зона выдачи багажа | old: Airport and Travel Core / Travel and Culture, medium | Our suitcases appeared at baggage claim after ten minutes.
travel-and-culture-at-the-airport-check-in-desk | check-in desk (noun) | стойка регистрации | old: Airport and Travel Core / Travel and Culture, medium | There was a long queue at the check-in desk.
