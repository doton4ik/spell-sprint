# NEW, SEPARATE TASK (topics-05.md)
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
["school-and-learning-exams-grade","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
school-and-learning-exams-grade | grade (noun) | оценка (в школе) | old: School and Learning Core / School and Learning, easy | She received the highest grade in the class.
school-and-learning-exams-mark | mark (noun) | оценка, отметка | old: School and Learning Core / School and Learning, easy | The teacher gave a good mark for the essay.
school-and-learning-exams-cheat | cheat (verb) | списывать на экзамене | old: School and Learning Core / School and Learning, hard | Students who cheat can lose all their marks.
school-and-learning-exams-certificate | certificate (noun) | сертификат, аттестат | old: School and Learning Core / School and Learning, hard | She proudly framed her graduation certificate on the wall.
school-and-learning-exams-resit | resit (noun) | пересдача экзамена | old: School and Learning Core / School and Learning, hard | He passed the resit after failing the first attempt.
common-actions-at-home-tidy-up | tidy up (phrase) | убираться, наводить порядок | old: Everyday Actions Core / Common Actions, easy | Can you tidy up your room before dinner?
common-actions-at-home-vacuum | vacuum (verb) | пылесосить | old: Everyday Actions Core / Common Actions, hard | I usually vacuum the carpet on Saturday morning.
common-actions-at-home-iron | iron (verb) | гладить одежду | old: Everyday Actions Core / Common Actions, easy | I need to iron this shirt before work.
common-actions-at-home-put-away | put away (phrase) | убирать на место | old: Everyday Actions Core / Common Actions, medium | Please put away your toys before bedtime.
common-actions-at-home-plug-in | plug in (phrase) | включать в розетку | old: Everyday Actions Core / Common Actions, medium | Remember to plug in the laptop overnight.
common-actions-at-home-unplug | unplug (verb) | отключать от розетки | old: Everyday Actions Core / Common Actions, hard | Always unplug the iron after using it.
common-actions-out-and-about-queue-up | queue up (phrase) | стоять в очереди | old: Everyday Actions Core / Common Actions, hard | We had to queue up outside the cinema.
common-actions-out-and-about-run-errands | run errands (phrase) | бегать по делам, выполнять поручения | old: Everyday Actions Core / Common Actions, hard | I need to run errands before the shops close.
common-actions-out-and-about-drop-by | drop by (phrase) | зайти ненадолго | old: Everyday Actions Core / Common Actions, medium | Feel free to drop by whenever you are free.
common-actions-out-and-about-hang-out | hang out (phrase) | проводить время с друзьями | old: Everyday Actions Core / Common Actions, medium | We usually hang out at the park after school.
common-actions-out-and-about-catch-up-with | catch up with (phrase) | пообщаться, узнать новости (друг друга); догнать | old: Everyday Actions Core / Common Actions, hard | Let's meet soon to catch up with each other.
common-actions-out-and-about-get-lost | get lost (phrase) | заблудиться | old: Everyday Actions Core / Common Actions, easy | Tourists sometimes get lost in the old part of town.
common-actions-out-and-about-rush-hour | rush hour (noun) | час пик | old: Everyday Actions Core / Common Actions, medium | The roads are very busy during rush hour.
clothes-and-appearance-clothing-items-trousers | trousers (noun) | брюки | old: Clothes and Appearance Core / Clothes and Appearance, medium | He bought a new pair of trousers for the job interview.
clothes-and-appearance-clothing-items-sweater | sweater (noun) | свитер | old: Clothes and Appearance Core / Clothes and Appearance, medium | I wear a warm sweater when it gets cold in the evening.
clothes-and-appearance-clothing-items-underwear | underwear (noun) | нижнее бельё | old: Clothes and Appearance Core / Clothes and Appearance, medium | She packed socks and clean underwear for the weekend trip.
clothes-and-appearance-clothing-items-sleeve | sleeve (noun) | рукав | old: Clothes and Appearance Core / Clothes and Appearance, medium | The sleeve of my shirt got wet in the rain.
clothes-and-appearance-clothing-items-collar | collar (noun) | воротник | old: Clothes and Appearance Core / Clothes and Appearance, easy | He turned up his collar because the wind was so cold.
clothes-and-appearance-clothing-items-pocket | pocket (noun) | карман | old: Clothes and Appearance Core / Clothes and Appearance, easy | I found some coins in the pocket of my old jeans.
clothes-and-appearance-clothing-items-button | button (noun) | пуговица | old: Clothes and Appearance Core / Clothes and Appearance, easy | One button on my coat came off yesterday.
clothes-and-appearance-clothing-items-wear | wear (verb) | носить | old: Clothes and Appearance Core / Clothes and Appearance, easy | You should wear a hat when the sun is strong.
clothes-and-appearance-clothing-items-fit | fit (verb) | подходить по размеру, сидеть (об одежде) | old: Clothes and Appearance Core / Clothes and Appearance, easy | These shoes are too small and they do not fit me.
clothes-and-appearance-clothing-items-try-on | try on (phrase) | примерять | old: Clothes and Appearance Core / Clothes and Appearance, medium | Can I try on this jacket in the changing room, please?
clothes-and-appearance-accessories-scarf | scarf (noun) | шарф | old: Clothes and Appearance Core / Clothes and Appearance, easy | She wrapped a long woollen scarf around her neck.
clothes-and-appearance-accessories-gloves | gloves (noun) | перчатки | old: Clothes and Appearance Core / Clothes and Appearance, easy | Don't forget your gloves because it is freezing outside.
clothes-and-appearance-accessories-necklace | necklace (noun) | ожерелье, колье | old: Clothes and Appearance Core / Clothes and Appearance, medium | My grandmother gave me a silver necklace for my birthday.
clothes-and-appearance-accessories-bracelet | bracelet (noun) | браслет | old: Clothes and Appearance Core / Clothes and Appearance, medium | She lost her gold bracelet at the beach last summer.
clothes-and-appearance-accessories-sunglasses | sunglasses (noun) | солнцезащитные очки | old: Clothes and Appearance Core / Clothes and Appearance, medium | It was so bright that I had to wear my sunglasses.
clothes-and-appearance-accessories-umbrella | umbrella (noun) | зонт | old: Clothes and Appearance Core / Clothes and Appearance, medium | Take an umbrella with you because it might rain later.
clothes-and-appearance-accessories-wallet | wallet (noun) | бумажник, кошелёк | old: Clothes and Appearance Core / Clothes and Appearance, easy | He took some money out of his wallet and paid.
clothes-and-appearance-accessories-put-on | put on (phrase) | надевать | old: Clothes and Appearance Core / Clothes and Appearance, easy | Put on your coat before you go out, please.
clothes-and-appearance-looks-and-grooming-hairstyle | hairstyle (noun) | причёска | old: Clothes and Appearance Core / Clothes and Appearance, medium | She changed her hairstyle and now she looks much younger.
clothes-and-appearance-looks-and-grooming-beard | beard (noun) | борода | old: Clothes and Appearance Core / Clothes and Appearance, easy | My uncle grew a long beard during the winter.
clothes-and-appearance-looks-and-grooming-moustache | moustache (noun) | усы | old: Clothes and Appearance Core / Clothes and Appearance, hard | The old waiter had a thick grey moustache.
clothes-and-appearance-looks-and-grooming-perfume | perfume (noun) | духи | old: Clothes and Appearance Core / Clothes and Appearance, medium | She put on a little perfume before the party.
clothes-and-appearance-looks-and-grooming-shave | shave (verb) | брить(ся) | old: Clothes and Appearance Core / Clothes and Appearance, easy | My dad likes to shave every morning before breakfast.
clothes-and-appearance-looks-and-grooming-comb | comb (verb) | расчёсывать | old: Clothes and Appearance Core / Clothes and Appearance, medium | Please comb your hair before we take the photo.
clothes-and-appearance-looks-and-grooming-fashionable | fashionable (adjective) | модный | old: Clothes and Appearance Core / Clothes and Appearance, hard | Long coats are very fashionable in cities this autumn.
clothes-and-appearance-looks-and-grooming-elegant | elegant (adjective) | элегантный, изящный | old: Clothes and Appearance Core / Clothes and Appearance, hard | She looked elegant in her long black dress.
clothes-and-appearance-looks-and-grooming-casual | casual (adjective) | повседневный | old: Clothes and Appearance Core / Clothes and Appearance, medium | I prefer casual clothes to formal ones at weekends.
clothes-and-appearance-looks-and-grooming-scruffy | scruffy (adjective) | неопрятный, потрёпанный | old: Clothes and Appearance Core / Clothes and Appearance, hard | His scruffy jacket had a big hole in the elbow.
family-and-relationships-relatives-cousin | cousin (noun) | двоюродный брат (сестра) | old: Family and Relationships Core / Family and Relationships, easy | My cousin is coming to stay with us next week.
family-and-relationships-relatives-nephew | nephew (noun) | племянник | old: Family and Relationships Core / Family and Relationships, medium | My nephew is five years old and loves football.
family-and-relationships-relatives-niece | niece (noun) | племянница | old: Family and Relationships Core / Family and Relationships, medium | My niece gave me a picture she painted herself.
family-and-relationships-relatives-aunt | aunt (noun) | тётя | old: Family and Relationships Core / Family and Relationships, easy | My aunt always sends me a card on my birthday.
family-and-relationships-relatives-uncle | uncle (noun) | дядя | old: Family and Relationships Core / Family and Relationships, easy | My uncle works as a driver in a big company.
family-and-relationships-relatives-twins | twins (noun) | близнецы | old: Family and Relationships Core / Family and Relationships, easy | The twins look so alike that nobody can tell them apart.
family-and-relationships-relatives-elderly | elderly (adjective) | пожилой | old: Family and Relationships Core / Family and Relationships, medium | Please give your seat to an elderly person on the bus.
family-and-relationships-friends-and-partners-flatmate | flatmate (noun) | сосед по квартире | old: Family and Relationships Core / Family and Relationships, medium | My flatmate cooks dinner on Monday and I cook on Tuesday.
family-and-relationships-friends-and-partners-acquaintance | acquaintance (noun) | знакомый | old: Family and Relationships Core / Family and Relationships, hard | He is not a close friend, only an acquaintance from university.
family-and-relationships-friends-and-partners-engaged | engaged (adjective) | помолвленный | old: Family and Relationships Core / Family and Relationships, easy | They got engaged last summer and will marry next year.
family-and-relationships-friends-and-partners-trust | trust (verb) | доверять | old: Family and Relationships Core / Family and Relationships, easy | I trust my best friend with all my secrets.
family-and-relationships-friends-and-partners-argue | argue (verb) | спорить, ссориться | old: Family and Relationships Core / Family and Relationships, medium | My brother and I often argue about what to watch.
family-and-relationships-friends-and-partners-fall-out-with | fall out with (phrase) | поссориться с | old: Family and Relationships Core / Family and Relationships, medium | I never want to fall out with my best friend.
family-and-relationships-life-events-wedding | wedding (noun) | свадьба | old: Family and Relationships Core / Family and Relationships, easy | We are going to a wedding in the mountains next Saturday.
family-and-relationships-life-events-divorce | divorce (noun) | развод | old: Family and Relationships Core / Family and Relationships, medium | After the divorce, the children lived with their mother.
family-and-relationships-life-events-anniversary | anniversary (noun) | годовщина | old: Family and Relationships Core / Family and Relationships, medium | It is our wedding anniversary, so we are going out for dinner.
family-and-relationships-life-events-funeral | funeral (noun) | похороны | old: Family and Relationships Core / Family and Relationships, medium | Many people came to the funeral to say goodbye.
family-and-relationships-life-events-celebrate | celebrate (verb) | праздновать, отмечать | old: Family and Relationships Core / Family and Relationships, medium | We always celebrate the New Year with our whole family.
family-and-relationships-life-events-adopt | adopt (verb) | усыновить, удочерить; взять (питомца) | old: Family and Relationships Core / Family and Relationships, easy | They decided to adopt a little girl from another country.
family-and-relationships-life-events-bring-up | bring up (phrase) | воспитывать | old: Family and Relationships Core / Family and Relationships, easy | She had to bring up three children on her own.
family-and-relationships-life-events-look-after | look after (phrase) | заботиться о, присматривать за | old: Family and Relationships Core / Family and Relationships, easy | Can you look after my cat while I am on holiday?
hobbies-and-free-time-sport-and-exercise-gym | gym (noun) | спортзал | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | I go to the gym three times a week after work.
hobbies-and-free-time-sport-and-exercise-jog | jog (verb) | бегать трусцой | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | I like to jog in the park before breakfast.
hobbies-and-free-time-sport-and-exercise-exercise | exercise (verb) | делать упражнения, заниматься спортом | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Doctors say we should exercise for at least thirty minutes daily.
hobbies-and-free-time-sport-and-exercise-equipment | equipment (noun) | оборудование, снаряжение | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | The club buys all the sports equipment for the children.
hobbies-and-free-time-sport-and-exercise-competition | competition (noun) | соревнование, конкурс | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | She won first prize in the swimming competition last month.
hobbies-and-free-time-sport-and-exercise-champion | champion (noun) | чемпион | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | The young champion held up the cup and smiled.
hobbies-and-free-time-sport-and-exercise-referee | referee (noun) | судья (в спорте) | old: Hobbies and Free Time Core / Hobbies and Free Time, hard | The referee stopped the match when the player fell down.
hobbies-and-free-time-sport-and-exercise-stadium | stadium (noun) | стадион | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | Thousands of fans filled the stadium for the final.
hobbies-and-free-time-sport-and-exercise-take-part-in | take part in (phrase) | участвовать в | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | Everyone in our class wants to take part in the race.
hobbies-and-free-time-creative-hobbies-paint | paint (verb) | рисовать красками | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | My sister likes to paint pictures of flowers and trees.
hobbies-and-free-time-creative-hobbies-knit | knit (verb) | вязать | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | My grandmother taught me how to knit a warm scarf.
hobbies-and-free-time-creative-hobbies-sew | sew (verb) | шить | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Can you sew this button back onto my shirt, please?
hobbies-and-free-time-creative-hobbies-hobby | hobby (noun) | хобби, увлечение | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Photography is not just a hobby for me; it is my passion.
hobbies-and-free-time-creative-hobbies-photography | photography (noun) | фотография, фотосъёмка | old: Hobbies and Free Time Core / Hobbies and Free Time, hard | She is studying photography because she wants to work for a magazine.
hobbies-and-free-time-creative-hobbies-guitar | guitar (noun) | гитара | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | He plays the guitar in a small band at weekends.
hobbies-and-free-time-creative-hobbies-instrument | instrument (noun) | (музыкальный) инструмент | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Which musical instrument would you like to learn to play?
hobbies-and-free-time-creative-hobbies-gardening | gardening (noun) | садоводство | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Gardening is a relaxing hobby, especially on warm sunny days.
hobbies-and-free-time-creative-hobbies-collect | collect (verb) | коллекционировать, собирать | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | My brother likes to collect old coins and stamps.
hobbies-and-free-time-creative-hobbies-craft | craft (noun) | ремесло, рукоделие | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | We made a paper bird in the craft lesson at school.
hobbies-and-free-time-relaxing-and-going-out-cinema | cinema (noun) | кинотеатр | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | We usually go to the cinema on Friday evening.
hobbies-and-free-time-relaxing-and-going-out-concert | concert (noun) | концерт | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | The concert starts at eight, so we must leave early.
hobbies-and-free-time-relaxing-and-going-out-audience | audience (noun) | публика, зрители | old: Hobbies and Free Time Core / Hobbies and Free Time, hard | The audience clapped loudly at the end of the show.
hobbies-and-free-time-relaxing-and-going-out-festival | festival (noun) | фестиваль | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | Thousands of young people travel to the music festival every summer.
hobbies-and-free-time-relaxing-and-going-out-board-game | board game (phrase) | настольная игра | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | On rainy days we play a board game together as a family.
hobbies-and-free-time-relaxing-and-going-out-relax | relax (verb) | расслабляться | old: Hobbies and Free Time Core / Hobbies and Free Time, easy | I like to relax with a good book after dinner.
hobbies-and-free-time-relaxing-and-going-out-enjoyable | enjoyable (adjective) | приятный, увлекательный | old: Hobbies and Free Time Core / Hobbies and Free Time, hard | The trip to the mountains was really enjoyable for everyone.
hobbies-and-free-time-relaxing-and-going-out-exciting | exciting (adjective) | захватывающий, волнующий | old: Hobbies and Free Time Core / Hobbies and Free Time, medium | The last ten minutes of the match were really exciting.
city-and-transport-places-in-the-city-skyscraper | skyscraper (noun) | небоскрёб | old: City and Transport Core / City and Transport, hard | From the top of the skyscraper you can see the whole city.
city-and-transport-places-in-the-city-suburb | suburb (noun) | пригород | old: City and Transport Core / City and Transport, medium | We live in a quiet suburb about ten kilometres from the centre.
city-and-transport-places-in-the-city-crowded | crowded (adjective) | многолюдный, переполненный | old: City and Transport Core / City and Transport, medium | The train was so crowded that I had to stand.
