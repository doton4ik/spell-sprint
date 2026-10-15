# NEW, SEPARATE TASK (topics-04.md)
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
["travel-and-culture-at-the-airport-gate","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
travel-and-culture-at-the-airport-gate | gate (noun) | выход на посадку | old: Airport and Travel Core / Travel and Culture, easy | Our gate changed twenty minutes before departure.
travel-and-culture-at-the-airport-terminal | terminal (noun) | терминал | old: Airport and Travel Core / Travel and Culture, easy | The new terminal has more shops than the old one.
travel-and-culture-at-the-airport-customs-officer | customs officer (noun) | таможенник | old: Airport and Travel Core / Travel and Culture, hard | A customs officer asked to see our documents.
travel-and-culture-at-the-airport-departure-lounge | departure lounge (noun) | зал ожидания вылета | old: Airport and Travel Core / Travel and Culture, medium | We had coffee in the departure lounge before boarding.
travel-and-culture-at-the-airport-connecting-flight | connecting flight (noun) | стыковочный рейс | old: Airport and Travel Core / Travel and Culture, hard | We had only forty minutes for our connecting flight.
travel-and-culture-at-the-airport-immigration | immigration (noun) | иммиграционная служба | old: Airport and Travel Core / Travel and Culture, hard | The queue for immigration moved very slowly.
travel-and-culture-on-the-plane-seatbelt | seatbelt (noun) | ремень безопасности | old: Airport and Travel Core / Travel and Culture, easy | Please fasten your seatbelt before take-off.
travel-and-culture-on-the-plane-cabin-crew | cabin crew (noun) | бортпроводники, экипаж самолёта | old: Airport and Travel Core / Travel and Culture, medium | The cabin crew served drinks after take-off.
travel-and-culture-on-the-plane-aisle | aisle (noun) | проход между рядами | old: Airport and Travel Core / Travel and Culture, hard | She walked down the aisle to find her row.
travel-and-culture-on-the-plane-turbulence | turbulence (noun) | турбулентность | old: Airport and Travel Core / Travel and Culture, hard | The flight was smooth apart from some turbulence.
travel-and-culture-on-the-plane-emergency-exit | emergency exit (noun) | аварийный выход | old: Airport and Travel Core / Travel and Culture, hard | Passengers near the emergency exit must listen carefully.
travel-and-culture-on-the-plane-announcement | announcement (noun) | объявление по громкой связи | old: Airport and Travel Core / Travel and Culture, hard | The pilot made an announcement about the weather.
travel-and-culture-on-the-plane-jet-lag | jet lag (noun) | усталость от смены часовых поясов, джетлаг | old: Airport and Travel Core / Travel and Culture, medium | It took me two days to recover from jet lag.
travel-and-culture-on-the-plane-runway | runway (noun) | взлётно-посадочная полоса | old: Airport and Travel Core / Travel and Culture, easy | The plane waited on the runway before take-off.
jobs-and-career-job-interview-cover-letter | cover letter (noun) | сопроводительное письмо | old: Work and Interviews Core / Jobs and Career, medium | I attached a cover letter to my application.
jobs-and-career-job-interview-curriculum-vitae | curriculum vitae (noun) | резюме | old: Work and Interviews Core / Jobs and Career, hard | Please send your curriculum vitae by Friday.
jobs-and-career-job-interview-strength | strength (noun) | сильная сторона | old: Work and Interviews Core / Jobs and Career, medium | My main strength is working well under pressure.
jobs-and-career-job-interview-weakness | weakness (noun) | слабая сторона | old: Work and Interviews Core / Jobs and Career, medium | She mentioned time management as a weakness.
jobs-and-career-job-interview-reference | reference (noun) | рекомендация от работодателя | old: Work and Interviews Core / Jobs and Career, medium | He gave his former manager as a reference.
jobs-and-career-job-interview-shortlist | shortlist (noun) | список финалистов | old: Work and Interviews Core / Jobs and Career, hard | Only five candidates made the final shortlist.
jobs-and-career-job-interview-job-offer | job offer (noun) | предложение о работе | old: Work and Interviews Core / Jobs and Career, easy | She accepted the job offer the same week.
jobs-and-career-job-interview-body-language | body language (noun) | язык тела | old: Work and Interviews Core / Jobs and Career, medium | Confident body language can help during an interview.
jobs-and-career-job-interview-eye-contact | eye contact (noun) | зрительный контакт | old: Work and Interviews Core / Jobs and Career, medium | Keeping eye contact shows that you are listening.
jobs-and-career-at-work-supervisor | supervisor (noun) | руководитель, начальник | old: Work and Interviews Core / Jobs and Career, hard | My supervisor checked the report before it was sent.
jobs-and-career-at-work-workload | workload (noun) | объём работы | old: Work and Interviews Core / Jobs and Career, medium | The workload increases at the end of every month.
jobs-and-career-at-work-overtime | overtime (noun) | сверхурочная работа | old: Work and Interviews Core / Jobs and Career, medium | He worked overtime to finish the project on time.
jobs-and-career-at-work-promotion | promotion (noun) | повышение по службе | old: Work and Interviews Core / Jobs and Career, medium | She received a promotion after two years.
jobs-and-career-at-work-resignation | resignation (noun) | заявление об увольнении | old: Work and Interviews Core / Jobs and Career, hard | He handed in his resignation last Monday.
jobs-and-career-at-work-teamwork | teamwork (noun) | командная работа | old: Work and Interviews Core / Jobs and Career, easy | Good teamwork helped us finish the project early.
jobs-and-career-at-work-punctual | punctual (adjective) | пунктуальный | old: Work and Interviews Core / Jobs and Career, hard | Being punctual is important for every meeting.
jobs-and-career-at-work-workplace | workplace (noun) | рабочее место | old: Work and Interviews Core / Jobs and Career, easy | Our workplace introduced flexible working hours.
jobs-and-career-at-work-annual-leave | annual leave (noun) | ежегодный отпуск | old: Work and Interviews Core / Jobs and Career, hard | I have ten days of annual leave left this year.
jobs-and-career-at-work-sick-leave | sick leave (noun) | больничный | old: Work and Interviews Core / Jobs and Career, medium | She took two days of sick leave last week.
time-and-dates-days-and-months-monday | Monday (noun) | понедельник | old: Time and Dates Core / Time and Dates, medium | The meeting is scheduled for Monday morning.
time-and-dates-days-and-months-tuesday | Tuesday (noun) | вторник | old: Time and Dates Core / Time and Dates, medium | We usually go to the gym on Tuesday.
time-and-dates-days-and-months-thursday | Thursday (noun) | четверг | old: Time and Dates Core / Time and Dates, hard | The report is due on Thursday afternoon.
time-and-dates-days-and-months-friday | Friday (noun) | пятница | old: Time and Dates Core / Time and Dates, easy | Most people finish work early on Friday.
time-and-dates-days-and-months-saturday | Saturday (noun) | суббота | old: Time and Dates Core / Time and Dates, hard | We do the shopping every Saturday morning.
time-and-dates-days-and-months-sunday | Sunday (noun) | воскресенье | old: Time and Dates Core / Time and Dates, easy | The shop is closed on Sunday.
time-and-dates-days-and-months-january | January (noun) | январь | old: Time and Dates Core / Time and Dates, medium | The course starts in January every year.
time-and-dates-days-and-months-march | March (noun) | март | old: Time and Dates Core / Time and Dates, easy | Spring usually begins in late March.
time-and-dates-days-and-months-april | April (noun) | апрель | old: Time and Dates Core / Time and Dates, easy | It often rains a lot in April.
time-and-dates-days-and-months-june | June (noun) | июнь | old: Time and Dates Core / Time and Dates, easy | The summer holidays usually start in June.
time-and-dates-days-and-months-august | August (noun) | август | old: Time and Dates Core / Time and Dates, medium | Many families go on holiday in August.
time-and-dates-days-and-months-september | September (noun) | сентябрь | old: Time and Dates Core / Time and Dates, medium | The new term begins in September.
time-and-dates-days-and-months-december | December (noun) | декабрь | old: Time and Dates Core / Time and Dates, medium | The office closes for a week in December.
time-and-dates-planning-time-schedule | schedule (noun) | расписание, график (дел) | old: Time and Dates Core / Time and Dates, hard | Please check the schedule before you arrive.
time-and-dates-planning-time-timetable | timetable (noun) | расписание (поездов, занятий) | old: Time and Dates Core / Time and Dates, medium | The new timetable starts next Monday.
time-and-dates-planning-time-postpone | postpone (verb) | отложить, перенести | old: Time and Dates Core / Time and Dates, hard | We had to postpone the meeting until Friday.
time-and-dates-planning-time-in-advance | in advance (phrase) | заранее | old: Time and Dates Core / Time and Dates, medium | Please book your tickets in advance.
time-and-dates-planning-time-on-time | on time (phrase) | вовремя | old: Time and Dates Core / Time and Dates, easy | The train arrived exactly on time.
time-and-dates-planning-time-punctuality | punctuality (noun) | пунктуальность | old: Time and Dates Core / Time and Dates, hard | Punctuality is expected at every business meeting.
time-and-dates-planning-time-reminder | reminder (noun) | напоминание | old: Time and Dates Core / Time and Dates, medium | I set a reminder for the dentist appointment.
time-and-dates-planning-time-duration | duration (noun) | продолжительность | old: Time and Dates Core / Time and Dates, hard | The duration of the flight is about three hours.
time-and-dates-planning-time-beforehand | beforehand (adverb) | заблаговременно | old: Time and Dates Core / Time and Dates, hard | We booked a table at the restaurant beforehand.
time-and-dates-planning-time-nowadays | nowadays (adverb) | в наши дни | old: Time and Dates Core / Time and Dates, medium | Nowadays, most people work with computers.
time-and-dates-planning-time-fortnight | fortnight (noun) | две недели | old: Time and Dates Core / Time and Dates, hard | We are going on holiday for a fortnight.
time-and-dates-planning-time-weekday | weekday (noun) | будний день | old: Time and Dates Core / Time and Dates, easy | Monday is the busiest weekday at our office.
shopping-paying-cash | cash (noun) | наличные | old: Money and Shopping Core / Shopping, easy | I always keep some cash for small shops.
shopping-paying-credit-card | credit card (noun) | кредитная карта | old: Money and Shopping Core / Shopping, medium | She paid for the tickets with a credit card.
shopping-paying-debit-card | debit card (noun) | дебетовая карта | old: Money and Shopping Core / Shopping, medium | I used my debit card at the supermarket.
shopping-paying-change | change (noun) | сдача | old: Money and Shopping Core / Shopping, medium | The cashier gave me the wrong change.
shopping-paying-price-tag | price tag (noun) | ценник | old: Money and Shopping Core / Shopping, medium | I checked the price tag before choosing the jacket.
shopping-paying-instalment | instalment (noun) | платёж в рассрочку | old: Money and Shopping Core / Shopping, hard | We paid for the sofa in monthly instalments.
shopping-paying-currency | currency (noun) | валюта | old: Money and Shopping Core / Shopping, hard | You should change your currency before the trip.
shopping-paying-surcharge | surcharge (noun) | дополнительная плата | old: Business and Office Core / Shopping, hard | There was a small surcharge for paying by card.
shopping-paying-voucher | voucher (noun) | ваучер, купон | old: Money and Shopping Core / Shopping, hard | She used a voucher to get a free coffee.
shopping-paying-loyalty-card | loyalty card (noun) | карта лояльности | old: Money and Shopping Core / Shopping, hard | I collect points with my loyalty card.
shopping-paying-till | till (noun) | касса | old: Money and Shopping Core / Shopping, easy | Please pay at the till near the door.
shopping-paying-overpay | overpay (verb) | переплатить | old: Money and Shopping Core / Shopping, medium | I did not want to overpay for the tickets.
shopping-banking-bank-account | bank account (noun) | банковский счёт | old: Money and Shopping Core / Shopping, medium | I opened a bank account when I moved here.
shopping-banking-withdraw | withdraw (verb) | снять деньги | old: Money and Shopping Core / Shopping, hard | I need to withdraw some money from the machine.
shopping-banking-deposit | deposit (verb) | внести деньги, депозит | old: Money and Shopping Core / Shopping, hard | She plans to deposit her salary tomorrow.
shopping-banking-balance | balance (noun) | баланс счёта | old: Money and Shopping Core / Shopping, medium | Check your balance before making a big purchase.
shopping-banking-overdraft | overdraft (noun) | овердрафт | old: Business and Office Core / Shopping, hard | The bank allowed a small overdraft that month.
shopping-banking-transfer | transfer (noun) | перевод денег | old: Money and Shopping Core / Shopping, medium | The transfer took two days to arrive.
shopping-banking-savings-account | savings account (noun) | сберегательный счёт | old: Money and Shopping Core / Shopping, medium | He keeps his savings account separate from his salary.
shopping-banking-interest-rate | interest rate (noun) | процентная ставка | old: Money and Shopping Core / Shopping, hard | The interest rate on the loan seemed quite high.
shopping-banking-loan | loan (noun) | кредит, заём | old: Money and Shopping Core / Shopping, easy | They took out a loan to buy the car.
shopping-banking-mortgage | mortgage (noun) | ипотека | old: Money and Shopping Core / Shopping, hard | They finally paid off their mortgage last year.
shopping-banking-pin-code | PIN code (noun) | пин-код | old: Money and Shopping Core / Shopping, medium | Never share your PIN code with anyone else.
shopping-banking-statement | statement (noun) | выписка по счёту | old: Money and Shopping Core / Shopping, hard | I checked my bank statement for any mistakes.
school-and-learning-in-class-classmate | classmate (noun) | одноклассник | old: School and Learning Core / School and Learning, medium | My classmate helped me understand the exercise.
school-and-learning-in-class-textbook | textbook (noun) | учебник | old: School and Learning Core / School and Learning, medium | Open your textbook on page twenty.
school-and-learning-in-class-blackboard | blackboard (noun) | школьная доска | old: School and Learning Core / School and Learning, medium | The teacher wrote the date on the blackboard.
school-and-learning-in-class-whiteboard | whiteboard (noun) | белая маркерная доска | old: School and Learning Core / School and Learning, easy | The teacher drew a diagram on the whiteboard.
school-and-learning-in-class-homework | homework (noun) | домашнее задание | old: School and Learning Core / School and Learning, medium | I finished my homework before dinner.
school-and-learning-in-class-lesson | lesson (noun) | урок | old: School and Learning Core / School and Learning, easy | The lesson finished ten minutes early today.
school-and-learning-in-class-lecture | lecture (noun) | лекция | old: School and Learning Core / School and Learning, medium | The lecture covered three chapters of the book.
school-and-learning-in-class-syllabus | syllabus (noun) | учебная программа | old: School and Learning Core / School and Learning, hard | The syllabus lists every topic for this term.
school-and-learning-in-class-attendance | attendance (noun) | посещаемость | old: School and Learning Core / School and Learning, hard | The teacher checks attendance every morning.
school-and-learning-in-class-participate | participate (verb) | участвовать | old: School and Learning Core / School and Learning, hard | Students are encouraged to participate in discussions.
school-and-learning-in-class-discussion | discussion (noun) | обсуждение | old: School and Learning Core / School and Learning, hard | The class discussion lasted almost an hour.
school-and-learning-exams-multiple-choice | multiple choice (noun) | тест с вариантами ответов | old: School and Learning Core / School and Learning, hard | The first section was multiple choice.
school-and-learning-exams-revision | revision (noun) | повторение материала | old: School and Learning Core / School and Learning, hard | I spent the weekend doing revision for maths.
school-and-learning-exams-pass | pass (verb) | сдать экзамен | old: School and Learning Core / School and Learning, easy | She worked hard to pass the final exam.
school-and-learning-exams-fail | fail (verb) | провалить экзамен | old: School and Learning Core / School and Learning, easy | He was worried he might fail the driving test.
