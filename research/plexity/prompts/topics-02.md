# NEW, SEPARATE TASK (topics-02.md)
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
["food-and-drinks-caf-and-restaurant-beverage","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
food-and-drinks-caf-and-restaurant-beverage | beverage (noun) | напиток | old: Food and Drinks Core / Food and Drinks, hard | Water is the healthiest beverage after exercise.
food-and-drinks-caf-and-restaurant-sparkling-water | sparkling water (noun) | газированная вода | old: Food and Drinks Core / Food and Drinks, medium | She ordered sparkling water with lemon.
food-and-drinks-caf-and-restaurant-allergic | allergic (adjective) | с аллергией (на что-то), аллергический | old: Food and Drinks Core / Food and Drinks, hard | My sister is allergic to peanuts.
food-and-drinks-caf-and-restaurant-vegetarian | vegetarian (noun) | вегетарианец; вегетарианский | old: Food and Drinks Core / Food and Drinks, hard | The vegetarian asked about the ingredients in the soup.
food-and-drinks-caf-and-restaurant-takeaway | takeaway (noun) | еда навынос | old: Food and Drinks Core / Food and Drinks, medium | We bought takeaway because we had no time to cook.
food-and-drinks-caf-and-restaurant-portion | portion (noun) | порция | old: Food and Drinks Core / Food and Drinks, medium | The restaurant served a large portion of pasta.
people-and-family-family-and-friends-relative | relative (noun) | родственник | old: People and Feelings Core / People and Family, medium | A relative visited us during the holiday.
people-and-family-family-and-friends-neighbour | neighbour (noun) | сосед | old: People and Feelings Core / People and Family, hard | Our neighbour helped carry the heavy boxes.
people-and-family-family-and-friends-colleague | colleague (noun) | коллега | old: People and Feelings Core / People and Family, hard | A colleague showed me how to use the new system.
people-and-family-family-and-friends-friendship | friendship (noun) | дружба | old: People and Feelings Core / People and Family, hard | Their friendship became stronger after many shared experiences.
people-and-family-family-and-friends-grandparents | grandparents (noun) | бабушка и дедушка | old: People and Feelings Core / People and Family, medium | My grandparents live in a quiet village.
people-and-family-family-and-friends-sibling | sibling (noun) | брат или сестра | old: People and Feelings Core / People and Family, hard | Do you have a sibling, or are you an only child?
people-and-family-family-and-friends-stranger | stranger (noun) | незнакомец | old: People and Feelings Core / People and Family, medium | A stranger showed us the way to the station.
people-and-family-family-and-friends-guest | guest (noun) | гость | old: People and Feelings Core / People and Family, easy | Every guest received a welcome drink.
people-and-family-family-and-friends-generation | generation (noun) | поколение | old: People and Feelings Core / People and Family, hard | Each generation faces different challenges at work.
people-and-family-family-and-friends-marriage | marriage (noun) | брак | old: People and Feelings Core / People and Family, medium | Their marriage has lasted for more than twenty years.
feelings-feelings-happy | happy (adjective) | счастливый | old: People and Feelings Core / Feelings, easy | I feel happy when I finish my work early.
feelings-feelings-anxious | anxious (adjective) | встревоженный, тревожный | old: People and Feelings Core / Feelings, hard | He felt anxious before the important interview.
feelings-feelings-embarrassed | embarrassed (adjective) | смущённый | old: People and Feelings Core / Feelings, hard | She felt embarrassed after forgetting the person’s name.
feelings-feelings-jealous | jealous (adjective) | ревнивый, завистливый | old: People and Feelings Core / Feelings, hard | He became jealous when his friend received praise.
feelings-feelings-grateful | grateful (adjective) | благодарный | old: People and Feelings Core / Feelings, medium | I am grateful for your help with this project.
feelings-feelings-disappointed | disappointed (adjective) | разочарованный | old: People and Feelings Core / Feelings, hard | She was disappointed when the event was cancelled.
feelings-feelings-confident | confident (adjective) | уверенный | old: People and Feelings Core / Feelings, medium | I feel more confident after practising every day.
feelings-feelings-exhausted | exhausted (adjective) | измотанный | old: People and Feelings Core / Feelings, hard | We were exhausted after moving all the furniture.
feelings-feelings-curious | curious (adjective) | любопытный | old: People and Feelings Core / Feelings, medium | The child was curious about the unusual machine.
feelings-feelings-proud | proud (adjective) | гордый | old: People and Feelings Core / Feelings, easy | My parents were proud of my exam result.
feelings-feelings-lonely | lonely (adjective) | одинокий | old: People and Feelings Core / Feelings, medium | He felt lonely after moving to a new city.
feelings-feelings-relieved | relieved (adjective) | испытывающий облегчение | old: People and Feelings Core / Feelings, hard | I felt relieved when the test finally ended.
feelings-feelings-frustrated | frustrated (adjective) | раздосадованный | old: People and Feelings Core / Feelings, hard | She became frustrated when the computer stopped working.
feelings-feelings-excited | excited (adjective) | взволнованный, радостный | old: People and Feelings Core / Feelings, medium | The students were excited about their first trip.
home-around-the-house-kitchen | kitchen (noun) | кухня | old: Home and Town Core / Home, easy | We cleaned the kitchen after preparing dinner.
home-around-the-house-bedroom | bedroom (noun) | спальня | old: Home and Town Core / Home, medium | The bedroom became warmer after we closed the window.
home-around-the-house-bathroom | bathroom (noun) | ванная | old: Home and Town Core / Home, medium | The hotel bathroom was small but very clean.
home-around-the-house-furniture | furniture (noun) | мебель | old: Home and Town Core / Home, hard | We moved the furniture before painting the room.
home-around-the-house-curtain | curtain (noun) | штора | old: Home and Town Core / Home, medium | Please close the curtain before the sun gets stronger.
home-around-the-house-staircase | staircase (noun) | лестница | old: Home and Town Core / Home, hard | The old staircase leads to the second floor.
home-around-the-house-neighbourhood | neighbourhood (noun) | район (где живёшь), округа | old: Home and Town Core / Home, hard | Our neighbourhood has a quiet park nearby.
home-around-the-house-rent | rent (noun) | аренда; арендовать | old: Home and Town Core / Home, easy | I pay the rent on the first day of each month.
home-around-the-house-landlord | landlord (noun) | арендодатель | old: Home and Town Core / Home, hard | The landlord repaired the broken window quickly.
home-around-the-house-appliance | appliance (noun) | бытовой прибор | old: Home and Town Core / Home, hard | This kitchen appliance uses very little electricity.
home-around-the-house-laundry | laundry (noun) | стирка, бельё | old: Home and Town Core / Home, hard | I usually do the laundry on Saturday morning.
home-around-the-house-cupboard | cupboard (noun) | шкаф, буфет | old: Home and Town Core / Home, hard | The clean plates are in the kitchen cupboard.
places-in-town-places-in-town-pharmacy | pharmacy (noun) | аптека | old: Home and Town Core / Places in Town, hard | The pharmacy closes at eight o’clock tonight.
places-in-town-places-in-town-library | library (noun) | библиотека | old: Home and Town Core / Places in Town, medium | I borrowed an English dictionary from the library.
places-in-town-places-in-town-post-office | post office (noun) | почта | old: Home and Town Core / Places in Town, easy | The post office is next to the supermarket.
places-in-town-places-in-town-bakery | bakery (noun) | пекарня | old: Home and Town Core / Places in Town, medium | The bakery sells warm bread every morning.
places-in-town-places-in-town-crossroads | crossroads (noun) | перекрёсток | old: Home and Town Core / Places in Town, hard | Turn left at the crossroads after the bridge.
places-in-town-places-in-town-pavement | pavement (noun) | тротуар | old: Home and Town Core / Places in Town, hard | Please walk carefully on the wet pavement.
places-in-town-places-in-town-bridge | bridge (noun) | мост | old: Home and Town Core / Places in Town, easy | We crossed the bridge before sunset.
places-in-town-places-in-town-square | square (noun) | площадь | old: Home and Town Core / Places in Town, easy | People gathered in the square for the concert.
places-in-town-places-in-town-supermarket | supermarket (noun) | супермаркет | old: Home and Town Core / Places in Town, medium | I bought fresh vegetables at the supermarket.
places-in-town-places-in-town-station | station (noun) | вокзал, станция | old: Home and Town Core / Places in Town, medium | The bus station is five minutes from here.
shopping-shopping-refund | refund (noun) | возврат денег | old: Home and Town Core / Shopping, hard | The shop offered a refund for the damaged item.
shopping-shopping-discount | discount (noun) | скидка | old: Home and Town Core / Shopping, medium | Students receive a discount with a valid card.
shopping-shopping-cashier | cashier (noun) | кассир | old: Home and Town Core / Shopping, hard | The cashier scanned the items very quickly.
shopping-shopping-customer | customer (noun) | покупатель | old: Home and Town Core / Shopping, medium | The customer asked for help finding the right size.
shopping-shopping-bargain | bargain (noun) | выгодная покупка | old: Home and Town Core / Shopping, hard | This jacket was a real bargain during the sale.
shopping-shopping-afford | afford (verb) | позволить себе | old: Home and Town Core / Shopping, hard | I cannot afford a new laptop this month.
shopping-shopping-exchange | exchange (verb) | обменять | old: Home and Town Core / Shopping, medium | The store allowed me to exchange the damaged shirt.
shopping-shopping-fitting-room | fitting room (noun) | примерочная | old: Home and Town Core / Shopping, medium | The fitting room was empty, so I tried the jacket.
shopping-shopping-sold-out | sold out (phrase) | распродано | old: Home and Town Core / Shopping, easy | The popular tickets were sold out by noon.
health-and-body-body-and-symptoms-stomach | stomach (noun) | живот, желудок | old: Health and Body Core / Health and Body, hard | My stomach hurt after I ate too quickly.
health-and-body-body-and-symptoms-throat | throat (noun) | горло | old: Health and Body Core / Health and Body, medium | My throat felt sore after speaking all day.
health-and-body-body-and-symptoms-shoulder | shoulder (noun) | плечо | old: Health and Body Core / Health and Body, medium | He carried the bag over one shoulder.
health-and-body-body-and-symptoms-knee | knee (noun) | колено | old: Health and Body Core / Health and Body, medium | My knee hurt after the long walk.
health-and-body-body-and-symptoms-headache | headache (noun) | головная боль | old: Health and Body Core / Health and Body, medium | I stayed home because I had a headache.
health-and-body-body-and-symptoms-fever | fever (noun) | жар, высокая температура | old: Health and Body Core / Health and Body, medium | The child had a high fever during the night.
health-and-body-body-and-symptoms-cough | cough (noun) | кашель; кашлять | old: Health and Body Core / Health and Body, hard | Her cough became better after a few days.
health-and-body-body-and-symptoms-sneeze | sneeze (verb) | чихать | old: Health and Body Core / Health and Body, hard | I always sneeze when the room is dusty.
health-and-body-body-and-symptoms-dizzy | dizzy (adjective) | чувствующий головокружение (голова кружится) | old: Health and Body Core / Health and Body, hard | I felt dizzy after standing up too quickly.
health-and-body-body-and-symptoms-sore | sore (adjective) | больной, ноющий (о горле, мышцах) | old: Health and Body Core / Health and Body, medium | My muscles were sore after the first workout.
health-and-body-body-and-symptoms-bruise | bruise (noun) | синяк | old: Health and Body Core / Health and Body, hard | The fall left a dark bruise on his arm.
health-and-body-body-and-symptoms-injury | injury (noun) | травма | old: Health and Body Core / Health and Body, medium | He returned to training after a minor injury.
health-and-body-at-the-doctor-appointment | appointment (noun) | встреча (по записи), запись (к врачу), приём | old: Health and Body Core / Health and Body, medium | I have a dentist appointment tomorrow afternoon.
health-and-body-at-the-doctor-prescription | prescription (noun) | рецепт (врача) | old: Health and Body Core / Health and Body, hard | The doctor gave me a prescription for medicine.
health-and-body-at-the-doctor-symptom | symptom (noun) | симптом | old: Health and Body Core / Health and Body, hard | A sore throat can be a common cold symptom.
health-and-body-at-the-doctor-treatment | treatment (noun) | лечение | old: Health and Body Core / Health and Body, medium | The treatment helped reduce his back pain.
health-and-body-at-the-doctor-recover | recover (verb) | выздоравливать | old: Health and Body Core / Health and Body, medium | It took him two weeks to recover fully.
health-and-body-at-the-doctor-vaccine | vaccine (noun) | вакцина | old: Health and Body Core / Health and Body, hard | The nurse explained how the vaccine protects people.
health-and-body-at-the-doctor-dentist | dentist (noun) | стоматолог | old: Health and Body Core / Health and Body, medium | I have an appointment with the dentist next week.
health-and-body-at-the-doctor-ambulance | ambulance (noun) | скорая помощь | old: Health and Body Core / Health and Body, hard | The ambulance arrived within a few minutes.
health-and-body-at-the-doctor-painkiller | painkiller (noun) | обезболивающее | old: Health and Body Core / Health and Body, hard | The doctor recommended a painkiller for the headache.
health-and-body-at-the-doctor-check-up | check-up (noun) | медосмотр | old: Health and Body Core / Health and Body, medium | I visit the doctor for a yearly check-up.
health-and-body-at-the-doctor-allergy | allergy (noun) | аллергия | old: Health and Body Core / Health and Body, hard | The nurse asked whether I had any allergy.
health-and-body-at-the-doctor-insurance | insurance (noun) | страховка | old: Health and Body Core / Health and Body, hard | Health insurance can cover part of the treatment.
technology-devices-and-software-device | device (noun) | устройство | old: Technology and Internet Core / Technology, medium | This device measures temperature very accurately.
technology-devices-and-software-screen | screen (noun) | экран | old: Technology and Internet Core / Technology, easy | The phone screen became difficult to read in sunlight.
technology-devices-and-software-keyboard | keyboard (noun) | клавиатура | old: Technology and Internet Core / Technology, medium | I cleaned the keyboard before starting work.
technology-devices-and-software-battery | battery (noun) | батарея, аккумулятор | old: Technology and Internet Core / Technology, medium | The battery lasted through the entire journey.
technology-devices-and-software-charger | charger (noun) | зарядное устройство, зарядка | old: Technology and Internet Core / Technology, medium | I packed my charger before leaving the apartment.
technology-devices-and-software-software | software (noun) | программное обеспечение | old: Technology and Internet Core / Technology, medium | The new software makes our daily tasks easier.
technology-devices-and-software-update | update (noun) | обновление; обновлять | old: Technology and Internet Core / Technology, medium | The latest update fixed several small problems.
technology-devices-and-software-install | install (verb) | установить | old: Technology and Internet Core / Technology, medium | Please install the application before the lesson.
technology-devices-and-software-download | download (verb) | скачивать | old: Technology and Internet Core / Technology, easy | You can download the document from the website.
technology-devices-and-software-password | password (noun) | пароль | old: Technology and Internet Core / Technology, medium | Never share your password with another person.
technology-devices-and-software-storage | storage (noun) | память (устройства), хранилище | old: Technology and Internet Core / Technology, medium | The phone has enough storage for many photos.
technology-devices-and-software-wireless | wireless (adjective) | беспроводной | old: Technology and Internet Core / Technology, hard | The office has a wireless internet connection.
