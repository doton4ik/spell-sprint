# NEW, SEPARATE TASK (topics-09.md)
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
["travel-and-culture-on-the-plane-pilot","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
travel-and-culture-on-the-plane-pilot | pilot (noun) | пилот | old: Airport and Travel Core / Travel and Culture, easy | The pilot said we would land soon.
travel-and-culture-on-the-plane-landing | landing (noun) | приземление | old: Airport and Travel Core / Travel and Culture, medium | The landing was very smooth.
travel-and-culture-on-the-plane-cockpit | cockpit (noun) | кабина пилота | old: Airport and Travel Core / Travel and Culture, medium | The children were allowed to visit the cockpit.
travel-and-culture-at-the-airport-layover | layover (noun) | пересадка (ожидание между рейсами) | old: Airport and Travel Core / Travel and Culture, medium | We had a four-hour layover in Dubai.
travel-and-culture-on-the-plane-lifejacket | lifejacket (noun) | спасательный жилет | old: Airport and Travel Core / Travel and Culture, medium | There is a lifejacket under your seat.
travel-and-culture-on-the-plane-jet | jet (noun) | реактивный самолёт | old: Airport and Travel Core / Travel and Culture, easy | A jet flew low over the city.
travel-and-culture-on-the-plane-crew | crew (noun) | экипаж | old: Airport and Travel Core / Travel and Culture, easy | The crew welcomed us on board.
travel-and-culture-at-the-airport-flight | flight (noun) | рейс, полёт | old: Airport and Travel Core / Travel and Culture, medium | Our flight was cancelled because of fog.
travel-and-culture-at-the-airport-boarding | boarding (noun) | посадка на борт | old: Airport and Travel Core / Travel and Culture, medium | Boarding starts thirty minutes before take-off.
travel-and-culture-at-the-airport-passport | passport (noun) | паспорт (заграничный) | old: Airport and Travel Core / Travel and Culture, medium | Don't forget your passport!
travel-and-culture-at-the-airport-carousel | carousel (noun) | багажная лента | old: Airport and Travel Core / Travel and Culture, medium | Our bags came out on carousel three.
travel-and-culture-at-the-airport-scanner | scanner (noun) | сканер, рамка досмотра | old: Airport and Travel Core / Travel and Culture, medium | Put your bag through the scanner.
jobs-and-career-job-interview-candidate | candidate (noun) | кандидат | old: Work and Interviews Core / Jobs and Career, medium | There are five candidates for the job.
jobs-and-career-job-interview-applicant | applicant (noun) | соискатель | old: Work and Interviews Core / Jobs and Career, hard | Every applicant must send a CV.
jobs-and-career-job-interview-vacancy | vacancy (noun) | вакансия | old: Work and Interviews Core / Jobs and Career, medium | There is a vacancy for a receptionist.
jobs-and-career-job-interview-interviewer | interviewer (noun) | интервьюер, собеседующий | old: Work and Interviews Core / Jobs and Career, hard | The interviewer asked about my experience.
jobs-and-career-job-interview-hire | hire (verb) | нанимать | old: Work and Interviews Core / Jobs and Career, easy | The café wants to hire two new waiters.
jobs-and-career-at-work-contract | contract (noun) | контракт, договор | old: Work and Interviews Core / Jobs and Career, medium | Read the contract before you sign it.
jobs-and-career-at-work-shift | shift (noun) | смена (на работе) | old: Work and Interviews Core / Jobs and Career, easy | I work the night shift this week.
jobs-and-career-at-work-client | client (noun) | клиент | old: Work and Interviews Core / Jobs and Career, medium | I have a meeting with a client at ten.
jobs-and-career-at-work-boss | boss (noun) | босс, шеф | old: Work and Interviews Core / Jobs and Career, medium | My boss let me leave early today.
jobs-and-career-at-work-unemployed | unemployed (adjective) | безработный | old: Work and Interviews Core / Jobs and Career, medium | He was unemployed for six months.
jobs-and-career-at-work-colleagues | colleagues (noun) | коллеги | old: Work and Interviews Core / Jobs and Career, medium | My colleagues are very helpful.
jobs-and-career-at-work-receptionist | receptionist (noun) | администратор (на ресепшене) | old: Work and Interviews Core / Jobs and Career, hard | The receptionist gave me a visitor badge.
jobs-and-career-at-work-payslip | payslip (noun) | расчётный листок | old: Work and Interviews Core / Jobs and Career, medium | Check your payslip at the end of the month.
jobs-and-career-at-work-manager | manager (noun) | менеджер | old: Work and Interviews Core / Jobs and Career, medium | Ask the manager if you have a problem.
school-and-learning-in-class-notebook | notebook (noun) | тетрадь, блокнот | old: School and Learning Core / School and Learning, medium | Write the new words in your notebook.
school-and-learning-in-class-pupil | pupil (noun) | школьник | old: School and Learning Core / School and Learning, medium | There are thirty pupils in the class.
school-and-learning-in-class-headteacher | headteacher (noun) | директор школы | old: School and Learning Core / School and Learning, hard | The headteacher spoke to the whole school.
school-and-learning-in-class-subject | subject (noun) | предмет (учебный) | old: School and Learning Core / School and Learning, medium | My favourite subject is history.
school-and-learning-in-class-ruler | ruler (noun) | линейка | old: School and Learning Core / School and Learning, easy | Draw a line with a ruler.
school-and-learning-in-class-rubber | rubber (noun) | ластик | old: School and Learning Core / School and Learning, medium | Can I borrow your rubber?
school-and-learning-in-class-calculator | calculator (noun) | калькулятор | old: School and Learning Core / School and Learning, medium | You can use a calculator in this test.
school-and-learning-in-class-uniform | uniform (noun) | форма (школьная) | old: School and Learning Core / School and Learning, medium | Pupils wear a blue uniform.
school-and-learning-in-class-absent | absent (adjective) | отсутствующий | old: School and Learning Core / School and Learning, medium | Three pupils were absent today.
school-and-learning-in-class-playground | playground (noun) | детская площадка | old: School and Learning Core / School and Learning, medium | The children are playing in the playground.
school-and-learning-in-class-dictionary | dictionary (noun) | словарь | old: School and Learning Core / School and Learning, medium | Look the word up in a dictionary.
school-and-learning-in-class-pencil | pencil (noun) | карандаш | old: School and Learning Core / School and Learning, easy | Write your answers in pencil.
school-and-learning-in-class-classroom | classroom (noun) | класс (комната) | old: School and Learning Core / School and Learning, medium | Our classroom is on the second floor.
school-and-learning-in-class-term | term (noun) | четверть, триместр | old: School and Learning Core / School and Learning, easy | The summer term ends in July.
family-and-relationships-life-events-bride | bride (noun) | невеста | old: Family and Relationships Core / Family and Relationships, easy | The bride wore a long white dress.
family-and-relationships-life-events-groom | groom (noun) | жених | old: Family and Relationships Core / Family and Relationships, medium | The groom gave a short speech.
family-and-relationships-life-events-honeymoon | honeymoon (noun) | медовый месяц | old: Family and Relationships Core / Family and Relationships, medium | They went to Italy on their honeymoon.
family-and-relationships-life-events-widow | widow (noun) | вдова | old: Family and Relationships Core / Family and Relationships, medium | His grandmother has been a widow for years.
family-and-relationships-relatives-ancestor | ancestor (noun) | предок | old: Family and Relationships Core / Family and Relationships, medium | My ancestors came from Scotland.
family-and-relationships-relatives-stepmother | stepmother (noun) | мачеха | old: Family and Relationships Core / Family and Relationships, medium | He gets on well with his stepmother.
family-and-relationships-relatives-stepfather | stepfather (noun) | отчим | old: Family and Relationships Core / Family and Relationships, medium | Her stepfather taught her to drive.
family-and-relationships-relatives-grandchild | grandchild (noun) | внук, внучка | old: Family and Relationships Core / Family and Relationships, medium | She has one grandchild and another on the way.
family-and-relationships-relatives-toddler | toddler (noun) | малыш (1–3 года) | old: Family and Relationships Core / Family and Relationships, medium | The toddler is learning to walk.
family-and-relationships-relatives-teenager | teenager (noun) | подросток | old: Family and Relationships Core / Family and Relationships, medium | Their son is a teenager now.
family-and-relationships-relatives-adult | adult (noun) | взрослый | old: Family and Relationships Core / Family and Relationships, easy | Tickets are ten pounds for an adult.
family-and-relationships-friends-and-partners-boyfriend | boyfriend (noun) | парень (молодой человек) | old: Family and Relationships Core / Family and Relationships, medium | Her boyfriend cooked dinner for her.
family-and-relationships-friends-and-partners-girlfriend | girlfriend (noun) | девушка (в отношениях) | old: Family and Relationships Core / Family and Relationships, medium | He met his girlfriend at university.
family-and-relationships-friends-and-partners-relationship | relationship (noun) | отношения | old: Family and Relationships Core / Family and Relationships, hard | They have a very close relationship.
family-and-relationships-relatives-babysitter | babysitter (noun) | няня (на время) | old: Family and Relationships Core / Family and Relationships, medium | We need a babysitter for Saturday night.
city-and-transport-getting-around-tram | tram (noun) | трамвай | old: City and Transport Core / City and Transport, easy | The tram stops right outside our flat.
city-and-transport-getting-around-fare | fare (noun) | стоимость проезда | old: City and Transport Core / City and Transport, medium | The bus fare went up again.
city-and-transport-getting-around-route | route (noun) | маршрут | old: City and Transport Core / City and Transport, easy | Which route does this bus take?
city-and-transport-getting-around-taxi | taxi (noun) | такси | old: City and Transport Core / City and Transport, easy | We took a taxi to the station.
city-and-transport-getting-around-cyclist | cyclist (noun) | велосипедист | old: City and Transport Core / City and Transport, medium | The road has a lane for cyclists.
city-and-transport-getting-around-motorway | motorway (noun) | автомагистраль | old: City and Transport Core / City and Transport, medium | It is faster to drive on the motorway.
city-and-transport-places-in-the-city-district | district (noun) | округ, район города | old: City and Transport Core / City and Transport, medium | This district is full of restaurants.
city-and-transport-places-in-the-city-avenue | avenue (noun) | проспект | old: City and Transport Core / City and Transport, easy | The hotel is on Park Avenue.
city-and-transport-places-in-the-city-fountain | fountain (noun) | фонтан | old: City and Transport Core / City and Transport, medium | Children played near the fountain.
city-and-transport-places-in-the-city-statue | statue (noun) | статуя | old: City and Transport Core / City and Transport, easy | There is a statue of a horse in the park.
city-and-transport-places-in-the-city-bench | bench (noun) | скамейка | old: City and Transport Core / City and Transport, easy | We sat on a bench and ate ice cream.
city-and-transport-traffic-and-directions-signpost | signpost (noun) | дорожный указатель | old: City and Transport Core / City and Transport, medium | Follow the signpost to the beach.
city-and-transport-traffic-and-directions-lane | lane (noun) | полоса (дороги); переулок | old: City and Transport Core / City and Transport, easy | Stay in the left lane.
city-and-transport-traffic-and-directions-parking | parking (noun) | парковка | old: City and Transport Core / City and Transport, medium | Parking is free after six.
city-and-transport-traffic-and-directions-subway | subway (noun) | подземный переход | old: City and Transport Core / City and Transport, easy | Use the subway to cross the main road.
people-and-family-feelings-upset | upset (adjective) | расстроенный | old: People and Feelings Core / People and Family, easy | He was upset about the bad news.
people-and-family-feelings-confused | confused (adjective) | сбитый с толку | old: People and Feelings Core / People and Family, medium | I was confused by the instructions.
people-and-family-family-and-friends-generous | generous (adjective) | щедрый | old: People and Feelings Core / People and Family, medium | My aunt is very generous with presents.
people-and-family-family-and-friends-honest | honest (adjective) | честный | old: People and Feelings Core / People and Family, easy | Please give me an honest answer.
people-and-family-family-and-friends-polite | polite (adjective) | вежливый | old: People and Feelings Core / People and Family, easy | It is polite to say thank you.
people-and-family-family-and-friends-rude | rude (adjective) | невежливый, хамский | old: People and Feelings Core / People and Family, easy | Don't be rude to the waiter.
people-and-family-family-and-friends-shy | shy (adjective) | застенчивый | old: People and Feelings Core / People and Family, easy | He was too shy to speak in class.
people-and-family-feelings-furious | furious (adjective) | взбешённый | old: People and Feelings Core / People and Family, medium | She was furious when she saw the mess.
people-and-family-feelings-cheerful | cheerful (adjective) | весёлый, жизнерадостный | old: People and Feelings Core / People and Family, medium | She is always cheerful in the morning.
people-and-family-family-and-friends-stubborn | stubborn (adjective) | упрямый | old: People and Feelings Core / People and Family, medium | My brother is too stubborn to say sorry.
health-and-body-body-and-symptoms-ankle | ankle (noun) | лодыжка | old: Health and Body Core / Health and Body, easy | I twisted my ankle playing football.
health-and-body-body-and-symptoms-wrist | wrist (noun) | запястье | old: Health and Body Core / Health and Body, medium | She wears a watch on her left wrist.
health-and-body-body-and-symptoms-elbow | elbow (noun) | локоть | old: Health and Body Core / Health and Body, easy | He hit his elbow on the door.
health-and-body-body-and-symptoms-rash | rash (noun) | сыпь | old: Health and Body Core / Health and Body, easy | The cream gave me a red rash.
health-and-body-at-the-doctor-bandage | bandage (noun) | бинт, повязка | old: Health and Body Core / Health and Body, medium | The nurse put a bandage on my hand.
health-and-body-body-and-symptoms-chest | chest (noun) | грудь, грудная клетка | old: Health and Body Core / Health and Body, easy | He felt a pain in his chest.
health-and-body-at-the-doctor-pill | pill (noun) | таблетка | old: Health and Body Core / Health and Body, medium | Take one pill after every meal.
health-and-body-at-the-doctor-nurse | nurse (noun) | медсестра | old: Health and Body Core / Health and Body, easy | The nurse took my blood pressure.
health-and-body-at-the-doctor-thermometer | thermometer (noun) | градусник | old: Health and Body Core / Health and Body, hard | Put the thermometer under your arm.
health-and-body-body-and-symptoms-wound | wound (noun) | рана | old: Health and Body Core / Health and Body, easy | The nurse cleaned the wound.
technology-devices-and-software-laptop | laptop (noun) | ноутбук | old: Technology and Internet Core / Technology, easy | I do my homework on a laptop.
technology-devices-and-software-printer | printer (noun) | принтер | old: Technology and Internet Core / Technology, medium | The printer has run out of paper.
technology-devices-and-software-router | router (noun) | роутер | old: Technology and Internet Core / Technology, easy | Restart the router if the internet is slow.
technology-devices-and-software-virus | virus (noun) | вирус (компьютерный) | old: Technology and Internet Core / Technology, easy | A virus deleted all my files.
technology-devices-and-software-folder | folder (noun) | папка | old: Technology and Internet Core / Technology, easy | Save the document in this folder.
technology-devices-and-software-cursor | cursor (noun) | курсор | old: Technology and Internet Core / Technology, easy | Move the cursor to the top of the page.
technology-devices-and-software-tablet | tablet (noun) | планшет | old: Technology and Internet Core / Technology, easy | My son watches cartoons on his tablet.
