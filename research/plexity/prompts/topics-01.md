# NEW, SEPARATE TASK (topics-01.md)
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
["logistics-inventory-control-inventory","home","A2"],
...
]
```

Before you answer, check: 97 entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
logistics-inventory-control-inventory | inventory (noun) | запасы | old: Shared — Inventory Fundamentals / Logistics, medium | The inventory report showed fewer items than expected.
logistics-inventory-control-stock | stock (noun) | товарный запас | old: Shared — Inventory Fundamentals / Logistics, easy | The store keeps extra stock for busy weekends.
logistics-inventory-control-replenishment | replenishment (noun) | пополнение запасов | old: Shared — Inventory Fundamentals / Logistics, hard | The manager planned replenishment before the shelves became empty.
logistics-inventory-control-safety-stock | safety stock (noun) | страховой запас | old: Shared — Inventory Fundamentals / Logistics, hard | Safety stock protects the warehouse from unexpected demand.
logistics-inventory-control-demand-planning | demand planning (noun) | планирование спроса | old: Shared — Inventory Fundamentals / Logistics, hard | Good demand planning helps the company order materials early.
logistics-inventory-control-inventory-accuracy | inventory accuracy (noun) | точность учёта запасов | old: Shared — Inventory Fundamentals / Logistics, hard | Inventory accuracy improved after the team checked every shelf.
logistics-receiving-and-storage-storage-location | storage location (noun) | место хранения | old: Shared — Inventory Fundamentals / Logistics, medium | Each box has a clear storage location in the warehouse.
general-english-professional-communication-deadline | deadline (noun) | крайний срок | old: Shared — Professional Essentials / General English, medium | I finished the report before the deadline.
general-english-professional-communication-research | research (noun) | исследование | old: Shared — Professional Essentials / General English, medium | Her research helped the team understand customer needs.
general-english-professional-communication-responsibility | responsibility (noun) | ответственность | old: Shared — Professional Essentials / General English, medium | Checking the order is my responsibility today.
general-english-professional-communication-achievement | achievement (noun) | достижение | old: Shared — Professional Essentials / General English, medium | Passing the difficult exam was a proud achievement.
general-english-professional-communication-presentation | presentation (noun) | презентация | old: Shared — Professional Essentials / General English, easy | His presentation explained the new process clearly.
general-english-professional-communication-communication | communication (noun) | общение | old: Shared — Professional Essentials / General English, medium | Clear communication prevents many problems at work.
logistics-supply-chain-supplier | supplier (noun) | поставщик | old: Supply Chain Core / Logistics, easy | The supplier delivered the materials on time.
logistics-supply-chain-shipment | shipment (noun) | поставка / отгрузка | old: Supply Chain Core / Logistics, medium | The shipment arrived at the warehouse this morning.
logistics-supply-chain-delivery | delivery (noun) | доставка | old: Supply Chain Core / Logistics, easy | The delivery reached our office before lunch.
logistics-receiving-and-storage-goods-receipt | goods receipt (noun) | приёмка товара | old: Supply Chain Core / Logistics, medium | The clerk recorded the goods receipt in the system.
logistics-order-fulfilment-order-picking | order picking (noun) | комплектация заказа | old: Supply Chain Core / Logistics, medium | Order picking becomes faster when products are well labelled.
logistics-receiving-and-storage-warehouse-layout | warehouse layout (noun) | планировка склада | old: Supply Chain Core / Logistics, hard | The new warehouse layout saves space and walking time.
logistics-supply-chain-distribution-center | distribution centre (noun) | распределительный центр | old: Supply Chain Core / Logistics, hard | The distribution centre sends products across the region.
logistics-supply-chain-lead-time | lead time (noun) | срок поставки | old: Supply Chain Core / Logistics, medium | The supplier reduced the lead time by two days.
logistics-supply-chain-transportation-cost | transportation cost (noun) | транспортные расходы | old: Supply Chain Core / Logistics, hard | Fuel prices increased the transportation cost this month.
warehouse-operations-sap-warehouse-processes-material | material (noun) | материал | old: Warehouse Operations — SAP / Warehouse Operations, easy | The worker moved the material to another shelf.
warehouse-operations-sap-warehouse-processes-purchase-order | purchase order (noun) | заказ на поставку | old: Warehouse Operations — SAP / Warehouse Operations, medium | The buyer sent a purchase order to the supplier.
warehouse-operations-sap-warehouse-processes-goods-movement | goods movement (noun) | движение товара | old: Warehouse Operations — SAP / Warehouse Operations, hard | The system records every goods movement automatically.
warehouse-operations-sap-warehouse-processes-warehouse-task | warehouse task (noun) | складская задача | old: Warehouse Operations — SAP / Warehouse Operations, hard | The worker completed the warehouse task before noon.
warehouse-operations-sap-warehouse-processes-inbound-processing | inbound processing (noun) | входящая обработка | old: Warehouse Operations — SAP / Warehouse Operations, hard | Inbound processing begins when the truck reaches the dock.
warehouse-operations-sap-warehouse-processes-outbound-processing | outbound processing (noun) | исходящая обработка | old: Warehouse Operations — SAP / Warehouse Operations, hard | Outbound processing prepares customer orders for dispatch.
warehouse-operations-inventory-control-physical-inventory | physical inventory (noun) | физическая инвентаризация | old: Warehouse Operations — SAP / Warehouse Operations, hard | The team counted the physical inventory on Friday.
warehouse-operations-sap-warehouse-processes-material-document | material document (noun) | документ материала | old: Warehouse Operations — SAP / Warehouse Operations, hard | The system created a material document after the movement.
business-and-office-finance-and-planning-revenue | revenue (noun) | выручка | old: Business and Office Core / Business and Office, medium | The company increased its revenue during the summer.
business-and-office-finance-and-planning-expenses | expenses (noun) | расходы | old: Business and Office Core / Business and Office, medium | We reviewed our monthly expenses before planning the budget.
business-and-office-finance-and-planning-profit | profit (noun) | прибыль | old: Business and Office Core / Business and Office, medium | The business made a small profit last quarter.
business-and-office-finance-and-planning-profit-margin | profit margin (noun) | маржа, норма прибыли | old: Business and Office Core / Business and Office, hard | The higher profit margin supported the company’s growth.
business-and-office-finance-and-planning-invoice | invoice (noun) | счёт (на оплату), счёт-фактура | old: Business and Office Core / Business and Office, medium | Please check the invoice before sending the payment.
business-and-office-meetings-and-negotiation-negotiation | negotiation (noun) | переговоры | old: Business and Office Core / Business and Office, medium | The negotiation ended with a fair agreement.
business-and-office-meetings-and-negotiation-agreement | agreement (noun) | соглашение | old: Business and Office Core / Business and Office, easy | Both companies signed the agreement after the meeting.
business-and-office-meetings-and-negotiation-recruitment | recruitment (noun) | подбор персонала | old: Business and Office Core / Business and Office, hard | The recruitment process starts with an online application.
business-and-office-finance-and-planning-target | target (noun) | цель | old: Business and Office Core / Business and Office, easy | Our team reached the monthly target in September.
business-and-office-meetings-and-negotiation-customer-satisfaction | customer satisfaction (noun) | удовлетворённость клиентов | old: Business and Office Core / Business and Office, hard | Customer satisfaction improved after delivery became faster.
business-and-office-finance-and-planning-market-demand | market demand (noun) | рыночный спрос | old: Business and Office Core / Business and Office, hard | Market demand changes when prices or seasons change.
business-and-office-finance-and-planning-cash-flow | cash flow (noun) | денежный поток | old: Business and Office Core / Business and Office, hard | Good cash flow helps a small business pay bills.
business-and-office-meetings-and-negotiation-complaint | complaint (noun) | жалоба | old: Business and Office Core / Business and Office, medium | The manager answered the customer’s complaint politely.
general-english-active-vocabulary-environment | environment (noun) | окружающая среда | old: General English — Active Vocabulary / General English, medium | We should protect the environment by wasting less water.
general-english-active-vocabulary-opportunity | opportunity (noun) | возможность | old: General English — Active Vocabulary / General English, medium | This course gave me an opportunity to improve my skills.
general-english-active-vocabulary-society | society (noun) | общество | old: General English — Active Vocabulary / General English, medium | Education can create positive changes in society.
general-english-active-vocabulary-technology | technology (noun) | технология | old: General English — Active Vocabulary / General English, easy | Modern technology makes communication much easier.
general-english-active-vocabulary-culture | culture (noun) | культура | old: General English — Active Vocabulary / General English, easy | Learning about another culture can change your perspective.
study-and-career-learning-and-research-assignment | assignment (noun) | задание | old: Study and Career Core / Study and Career, medium | I completed the assignment before the evening class.
study-and-career-career-development-interview | interview (noun) | собеседование | old: Study and Career Core / Study and Career, medium | She prepared carefully for her job interview.
study-and-career-career-development-qualification | qualification (noun) | квалификация | old: Study and Career Core / Study and Career, hard | This qualification can help me find better work.
study-and-career-career-development-experience | experience (noun) | опыт | old: Study and Career Core / Study and Career, easy | Do you have any experience of working with children?
travel-and-culture-travel-planning-luggage | luggage (noun) | багаж | old: Travel and Culture Core / Travel and Culture, medium | Please keep your luggage near your seat.
travel-and-culture-travel-planning-departure | departure (noun) | отправление, вылет | old: Travel and Culture Core / Travel and Culture, medium | The departure was delayed because of heavy rain.
travel-and-culture-travel-planning-arrival | arrival (noun) | прибытие | old: Travel and Culture Core / Travel and Culture, medium | Our arrival at the hotel was later than expected because of the traffic.
travel-and-culture-at-the-destination-accommodation | accommodation (noun) | жильё, проживание, размещение | old: Travel and Culture Core / Travel and Culture, hard | Our accommodation was clean and close to public transport.
travel-and-culture-at-the-destination-directions | directions (noun) | указания, как пройти | old: Travel and Culture Core / Travel and Culture, medium | The receptionist gave us clear directions to the station.
travel-and-culture-travel-planning-ticket | ticket (noun) | билет | old: Travel and Culture Core / Travel and Culture, easy | I bought a train ticket online yesterday.
travel-and-culture-travel-planning-reservation | reservation (noun) | бронирование, бронь | old: Travel and Culture Core / Travel and Culture, medium | Our hotel reservation includes breakfast and free Wi-Fi.
travel-and-culture-travel-planning-delay | delay (noun) | задержка | old: Travel and Culture Core / Travel and Culture, medium | The flight had a short delay because of fog.
travel-and-culture-travel-planning-border | border (noun) | граница | old: Travel and Culture Core / Travel and Culture, easy | The truck waited at the border for inspection.
travel-and-culture-at-the-destination-sightseeing | sightseeing (noun) | осмотр достопримечательностей | old: Travel and Culture Core / Travel and Culture, hard | We spent the afternoon sightseeing in the old town.
sport-and-fitness-training-and-competition-training | training (noun) | тренировка | old: Sport and Fitness Core / Sport and Fitness, easy | Regular training helps athletes improve their technique.
sport-and-fitness-training-and-competition-match | match (noun) | матч | old: Sport and Fitness Core / Sport and Fitness, easy | The team won the match by one goal.
sport-and-fitness-training-and-competition-tournament | tournament (noun) | турнир | old: Sport and Fitness Core / Sport and Fitness, medium | Our club organised a small tournament last weekend.
sport-and-fitness-training-and-competition-goalkeeper | goalkeeper (noun) | вратарь | old: Sport and Fitness Core / Sport and Fitness, medium | The goalkeeper stopped the ball near the final whistle.
sport-and-fitness-training-and-competition-defender | defender (noun) | защитник | old: Sport and Fitness Core / Sport and Fitness, medium | The defender blocked the shot near the goal.
sport-and-fitness-training-and-competition-score | score (noun) | счёт (в игре) | old: Sport and Fitness Core / Sport and Fitness, easy | The final score was three goals to one.
sport-and-fitness-health-and-recovery-injury | injury (noun) | травма | old: Sport and Fitness Core / Sport and Fitness, medium | He returned to training after a minor injury.
everyday-life-daily-routines-breakfast | breakfast (noun) | завтрак | old: Everyday Life — Daily Routines / Everyday Life, easy | I usually eat breakfast before leaving home.
everyday-life-daily-routines-commute | commute (verb) | ездить на работу или учёбу (и обратно) | old: Everyday Life — Daily Routines / Everyday Life, medium | I commute by bus when the weather is cold.
everyday-life-home-and-services-appointment | appointment (noun) | встреча (по записи), запись (к врачу), приём | old: Everyday Life — Daily Routines / Everyday Life, medium | I have a dentist appointment tomorrow afternoon.
everyday-life-home-and-services-receipt | receipt (noun) | чек | old: Everyday Life — Daily Routines / Everyday Life, easy | Keep the receipt in case you need a refund.
transport-and-trade-road-freight-freight | freight (noun) | груз | old: Transport and Trade — Road Freight / Transport and Trade, medium | The company transports freight between several European cities.
transport-and-trade-road-freight-consignment | consignment (noun) | партия груза | old: Transport and Trade — Road Freight / Transport and Trade, hard | The carrier delivered the consignment without any damage.
transport-and-trade-road-freight-carrier | carrier (noun) | перевозчик | old: Transport and Trade — Road Freight / Transport and Trade, medium | The carrier called before arriving at the warehouse.
transport-and-trade-customs-and-trade-customs-clearance | customs clearance (noun) | таможенное оформление | old: Transport and Trade — Road Freight / Transport and Trade, hard | Customs clearance took longer because one document was missing.
transport-and-trade-customs-and-trade-bill-of-lading | bill of lading (noun) | коносамент | old: Transport and Trade — Road Freight / Transport and Trade, hard | The driver checked the bill of lading before departure.
food-and-drinks-meals-and-cooking-lunch | lunch (noun) | обед | old: Food and Drinks Core / Food and Drinks, easy | We ate a quick lunch after the morning meeting.
food-and-drinks-meals-and-cooking-dinner | dinner (noun) | ужин | old: Food and Drinks Core / Food and Drinks, easy | My family usually has dinner at seven.
food-and-drinks-meals-and-cooking-ingredient | ingredient (noun) | ингредиент | old: Food and Drinks Core / Food and Drinks, medium | Fresh garlic is my favourite ingredient for soup.
food-and-drinks-meals-and-cooking-recipe | recipe (noun) | рецепт (блюда) | old: Food and Drinks Core / Food and Drinks, medium | This recipe is simple enough for beginners.
food-and-drinks-meals-and-cooking-vegetable | vegetable (noun) | овощ | old: Food and Drinks Core / Food and Drinks, hard | Every healthy meal should include at least one vegetable.
food-and-drinks-meals-and-cooking-fruit | fruit (noun) | фрукт | old: Food and Drinks Core / Food and Drinks, easy | I take a piece of fruit to work each day.
food-and-drinks-meals-and-cooking-delicious | delicious (adjective) | вкусный | old: Food and Drinks Core / Food and Drinks, hard | The homemade soup was delicious and easy to prepare.
food-and-drinks-meals-and-cooking-bake | bake (verb) | печь, выпекать | old: Food and Drinks Core / Food and Drinks, easy | We bake fresh bread at home on Sundays.
food-and-drinks-meals-and-cooking-boil | boil (verb) | варить, кипятить | old: Food and Drinks Core / Food and Drinks, medium | Boil the vegetables for five minutes before serving.
food-and-drinks-meals-and-cooking-chop | chop (verb) | нарезать | old: Food and Drinks Core / Food and Drinks, medium | Please chop the onions before heating the pan.
food-and-drinks-meals-and-cooking-fry | fry (verb) | жарить | old: Food and Drinks Core / Food and Drinks, easy | We fry the potatoes in a little oil.
food-and-drinks-meals-and-cooking-seasoning | seasoning (noun) | приправа | old: Food and Drinks Core / Food and Drinks, hard | This seasoning gives the soup a stronger flavour.
food-and-drinks-meals-and-cooking-dessert | dessert (noun) | десерт | old: Food and Drinks Core / Food and Drinks, hard | We shared a light dessert after dinner.
food-and-drinks-caf-and-restaurant-menu | menu (noun) | меню | old: Food and Drinks Core / Food and Drinks, easy | The restaurant menu includes several vegetarian dishes.
food-and-drinks-caf-and-restaurant-order | order (verb) | заказывать; заказ | old: Food and Drinks Core / Food and Drinks, easy | We decided to order soup and sparkling water.
food-and-drinks-caf-and-restaurant-bill | bill (noun) | счёт (в кафе, ресторане) | old: Food and Drinks Core / Food and Drinks, easy | The waiter brought the bill after our coffee.
food-and-drinks-caf-and-restaurant-tip | tip (noun) | чаевые | old: Food and Drinks Core / Food and Drinks, easy | We left a small tip for the helpful waiter.
food-and-drinks-caf-and-restaurant-waiter | waiter (noun) | официант | old: Food and Drinks Core / Food and Drinks, medium | The waiter explained the daily special politely.
food-and-drinks-caf-and-restaurant-reservation | reservation (noun) | бронирование, бронь | old: Food and Drinks Core / Food and Drinks, medium | We made a reservation at the restaurant for Friday.
