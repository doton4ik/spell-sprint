// Texts for the Proofreading mode. Each text is stored CORRECT; {correct|type|wrong} marks a place
// where the program may put a mistake. Several correct or wrong variants are separated by " ; ".
// A missing word is a wrong variant without it ({a car|article-missing|car}), an extra word is a
// wrong variant with it ({London|article-extra|the London}). Spelling mistakes are added
// automatically and are not marked. Full format: see the content brief.

export type ProofreadingLevel = 'A2' | 'B1' | 'B2' | 'C1'
export type ProofreadingFormat = 'email' | 'message' | 'story' | 'notice' | 'article' | 'dialogue' | 'review' | 'diary' | 'instructions' | 'report' | 'post' | 'blog' | 'interview' | 'chat' | 'column' | 'application' | 'speech'
// situation: who wrote the text and why the learner is checking it ("Your friend wants to post this review…").
export type ProofreadingText = { id: string; title: string; level: ProofreadingLevel; format: ProofreadingFormat; topic: string; text: string; situation?: string }

export const proofreadingTexts: ProofreadingText[] = [
  {
    id: 'a2-message-new-flat',
    title: 'Moving in',
    level: 'A2',
    format: 'message',
    topic: 'Home and Town',
    text: 'Hi Tom! Last week I {found|past-irregular|finded} {a new flat|article-missing|new flat}. It {is|agreement|are} small but very bright, and {the kitchen|article|a kitchen} is my favourite room.\n\nMy neighbours {are|agreement|is} really friendly. Yesterday one of them {gave|past-irregular|gived} me {some|quantifier|many} advice about {the buses|article-missing|buses} in this area. There {is|agreement|are} a nice park near {my|pronoun|me} building, so I {go|agreement|goes} running there every morning.\n\n{Do you want|word-order|You want} to visit me on Saturday? I can {cook|modal|to cook} dinner for us!',
  },
  // ───────────── A2 (12) ─────────────
  {
    id: 'a2-email-new-flat',
    title: 'My new flat',
    level: 'A2',
    format: 'email',
    topic: 'Everyday Life',
    text: 'Hi Tom,\n\nThanks for your email. I {have lived|tense|live} in my new flat {for|since-for|since} two weeks. I {like|agreement|likes} it a lot. It is on {the second floor|article-missing|second floor}, and there is {a small balcony|article-missing|small balcony}.\n\nYesterday my friends {came|past-irregular|comed} to see it. We {made|past-irregular|maked} dinner and watched a film together. My friends {were|agreement|was} very kind. They {brought|past-irregular|bringed} {an|article|a} old lamp for the kitchen.\n\nCan you {visit|modal|to visit} me next weekend? We can walk to {the park|article-missing|park} near my house. Please tell me {when you can come|word-order|when can you come}. Write soon.\n\nMaria',
  },
  {
    id: 'a2-message-prague',
    title: 'Greetings from Prague',
    level: 'A2',
    format: 'message',
    topic: 'Travel and Culture',
    text: 'Hi Ben! We are in Prague now. The weather {is|agreement|are} lovely. Yesterday we {saw|past-irregular|seed} {the old bridge|article-missing|old bridge}. It was {more beautiful|comparative|beautifuler} than {I thought|word-order|thought I}.\n\nOur hotel is {next to|preposition|next of} the station. We have been here {for|since-for|since} three days. There are {many|quantifier|much} museums here, and we enjoy {walking|gerund-infinitive|to walk} in the old town. Last night we had {an|article|a} amazing dinner in {a small restaurant|article-missing|small restaurant}. Tomorrow we {will visit|tense|visited} {a castle|article-missing|castle}. Please send {me|pronoun|I} a message soon.',
  },
  {
    id: 'a2-story-birthday-cake',
    title: 'A cake for Grandma',
    level: 'A2',
    format: 'story',
    topic: 'Food and Drinks',
    text: 'Last Sunday Lena {wanted|tense|want} to make a cake for her grandmother. She {went|past-irregular|goed} to {the shop|article-missing|shop}. There she {bought|past-irregular|buyed} flour, eggs and {a lemon|article-missing|lemon}. At home she {put|past-irregular|putted} everything on {the table|article-missing|table} and started to cook. Soon the cake smelled {good|word-form|well}.\n\nWhen her grandmother {came|past-irregular|comed}, she was very happy. She asked, "How {did you make|word-order|you made} it?" Lena smiled. Her grandmother said it was {the best|comparative|the goodest} cake she had ever eaten. They ate the whole cake together. Then {they|pronoun|them} drank tea and talked {for|since-for|since} an hour.',
  },
  {
    id: 'a2-notice-early-closing',
    title: 'Notice for all staff',
    level: 'A2',
    format: 'notice',
    topic: 'Work and Career',
    text: 'Notice for all staff\n\nOur office {will close|tense|closed} at four o\'clock next Friday. All workers {must|modal|must to} leave the building by half past four. The bus to the station {leaves|agreement|leave} from {the main entrance|article-missing|main entrance}. Please do not leave your bags in {the corridor|article-missing|corridor}.\n\nThere {is|agreement|are} {a new manager|article-missing|new manager} in the sales team. {His|pronoun|He} name is Mr Novak. He {has worked|tense|works} here {since|since-for|for} March. Please give him {a warm welcome|article-missing|warm welcome}. Thank you {for|preposition|to} your help.',
  },
  {
    id: 'a2-dialogue-before-test',
    title: 'Before the test',
    level: 'A2',
    format: 'dialogue',
    topic: 'Study and Learning',
    text: 'Anna: Hi Paul! {How are you|word-order|How you are} today? Are you ready for {the test|article-missing|test}?\nPaul: Not really. Yesterday I {had|past-irregular|haved} {a bad headache|article-missing|bad headache}. So I {could|modal|can} not study.\nAnna: Don\'t worry. I {can help|modal|can to help} you. We can study together in {the library|article-missing|library}. Here is some {advice|plural-uncountable|advices}: sleep well tonight.\nPaul: Thanks! {How much|quantifier|How many} time do we have?\nAnna: About two hours. Bring {your|confusable|you\'re} grammar book, a pen and some water.\nPaul: OK. I already feel {better|comparative|more better}. I am afraid of {failing|gerund-infinitive|fail}, but I hope it will be fine.\nAnna: Good luck, Paul! See you {at|preposition|on} five o\'clock.',
  },
  {
    id: 'a2-diary-sore-throat',
    title: 'A sick day',
    level: 'A2',
    format: 'diary',
    topic: 'Health and Body',
    text: 'Monday\n\nI {woke|past-irregular|waked} up with {a sore throat|article-missing|sore throat} this morning. My mother said I {should|modal|should to} stay at home. I did not want to miss {an|article|a} important lesson, so I went to school. By lunch I felt {worse|comparative|worser}. The nurse {gave|past-irregular|gived} me {a pill|article-missing|pill}.\n\nNow I {am lying|tense|lie} on {the sofa|article-missing|sofa}. My sister {made|past-irregular|maked} me soup, and it was very good. My friends {are|agreement|is} worried about me. I am {too|confusable|to} tired to read a book. I have been ill {since|since-for|for} Sunday, and I do not know {when I can|word-order|when can I} go back to school.',
  },
  {
    id: 'a2-instructions-send-photo',
    title: 'How to send a photo by email',
    level: 'A2',
    format: 'instructions',
    topic: 'Technology',
    text: 'How to send a photo by email\n\nSending photos {is|agreement|are} {easier|comparative|more easier} than sending letters. You need {an|article|a} email address first. Open {the gallery|article-missing|gallery} on your phone. Choose the photo you {want|agreement|wants} to send and press the small arrow. Then write {a short message|article-missing|short message}. Be careful with private {information|plural-uncountable|informations}.\n\nBefore {sending|gerund-infinitive|send} the email, check the address twice. If the photo is very big, you {can|modal|can to} make it smaller. Finally, press {the green button|article-missing|green button} and wait {for|preposition|to} a reply. How long {does it take|word-order|it takes}? Only a minute or two.',
  },
  {
    id: 'a2-review-town-park',
    title: 'A lovely place for families',
    level: 'A2',
    format: 'review',
    topic: 'Home and Town',
    text: 'A lovely place for families\n\nWe {went|past-irregular|goed} to {the new park|article-missing|new park} in the town centre last Saturday. There {are|agreement|is} two big playgrounds and {a small lake|article-missing|small lake}. My children {spent|past-irregular|spended} hours on the swings. The café {sells|agreement|sell} {cheap|word-form|cheaply} drinks. Everyone {is|agreement|are} very friendly.\n\nIt is {the best|comparative|the most good} park in our town. Entry is {free|word-form|freely} for everyone. There are too {few|quantifier|little} benches, but it is good for children to spend time in {nature|article-extra|the nature}. We will {definitely come|word-order|come definitely} back soon.',
  },
  {
    id: 'a2-article-save-money',
    title: 'How to save money',
    level: 'A2',
    format: 'article',
    topic: 'Shopping and Money',
    text: 'How to save money\n\n{Many|quantifier|Much} people want {to save|gerund-infinitive|saving} money, but it is not easy. Here {are|agreement|is} three simple ideas.\n\nFirst, keep {a list|article-missing|list} of everything you buy. After a month you will see {how much|quantifier|how many} money you spend. Second, do not buy things just because {they|pronoun|them} are cheap. If you buy {fewer|quantifier|less} clothes, you will have more money for important things. Third, open {a savings account|article-missing|savings account}.\n\nMy brother {began|past-irregular|begun} this plan last year. He {bought|past-irregular|buyed} {a new laptop|article-missing|new laptop} last month without any help. I asked him how {he saved|word-order|did he save}.',
  },
  {
    id: 'a2-report-mountain-trip',
    title: 'Weather report: our school trip',
    level: 'A2',
    format: 'report',
    topic: 'Nature and Weather',
    text: 'Weather report: our school trip\n\nLast week our class {went|past-irregular|goed} to the mountains. On Monday the weather {was|agreement|were} sunny and {hotter|comparative|more hot} than in town. On Tuesday it {rained|tense|rains} all day, so we stayed in {the hut|article-missing|hut}. We {sat|past-irregular|sitted} by {the fire|article-missing|fire} and played cards.\n\nOn Wednesday there {was|agreement|were} fresh snow on the top of the mountain. We walked up and looked at {the lake|article-missing|lake}. We {took|past-irregular|taked} {many|quantifier|much} photos. I wondered why {the weather was|word-order|was the weather} so different there. I have wanted to visit the mountains {since|since-for|for} I was a child, and we {should|modal|should to} go again in summer.',
  },
  {
    id: 'a2-story-first-day',
    title: 'The first day',
    level: 'A2',
    format: 'story',
    topic: 'People and Feelings',
    text: 'Tom {felt|past-irregular|feeled} very nervous on his first day at school. In {the classroom|article-missing|classroom} he sat {next to|preposition|next of} a girl called Mia. He {had never|tense|has never} seen so many children in one room. She smiled and asked {what his name was|word-order|what was his name}. Soon he felt {more relaxed|comparative|relaxeder}.\n\nAt lunch Mia {gave|past-irregular|gived} him {a sandwich|article-missing|sandwich}. She also liked {football|article-extra|the football}, like Tom. Everyone in the class {was|agreement|were} friendly. After school Tom {ran|past-irregular|runned} home and told his mother about {his|pronoun|him} day. He {could|modal|can} not wait to go back.',
  },
  {
    id: 'a2-message-running',
    title: 'Come running with me',
    level: 'A2',
    format: 'message',
    topic: 'Sport and Fitness',
    text: 'Hi Kate!\n\nGuess what! I {started|tense|have started} training last month. I really enjoy {running|gerund-infinitive|to run} in {the park|article-missing|park} near my house. My brother {runs|agreement|run} with me. At first I {could|modal|can} only run {for|since-for|since} ten minutes. Now I can run for half {an|article|a} hour, and I feel {stronger|comparative|more strong}. I also use {a small app|article-missing|small app} to count my steps.\n\nWould you like {to join|gerund-infinitive|joining} me on Saturday? We can meet {at|preposition|in} {the park gate|article-missing|park gate} at eight. Bring {comfortable|word-form|comfortably} shoes and a bottle of water. Please tell me {if you can|word-order|if can you} come.',
  },
  {
    id: 'b1-email-course',
    title: 'About the evening course',
    level: 'B1',
    format: 'email',
    topic: 'Study and Learning',
    text: 'Dear Ms Clark,\n\nI {have been|tense|am} a student on your evening course {for|since-for|since} three months, and I {really enjoy|word-order|enjoy really} the lessons. However, I would like to ask you for some {information|plural-uncountable|informations} about the final exam.\n\nLast week I missed two classes because I {was|agreement|were} ill and {lost|past-irregular|losed} my notes, so I am worried {about|preposition|of} the new topics. Could you tell me {where I can|word-order|where can I} find the materials? I am {interested in|preposition|interested at} doing extra exercises, because grammar is {more difficult|comparative|more difficulter ; difficulter} for me than speaking.\n\nI am looking forward {to hearing|gerund-infinitive|to hear} from you.\n\nKind regards,\nMarta',
  },
  {
    id: 'b2-review-cafe',
    title: 'A café worth visiting',
    level: 'B2',
    format: 'review',
    topic: 'Food and Drinks',
    text: 'The Green Corner opened {in|preposition|on} the city centre last spring, and since then it {has become|tense|became} one of my favourite places. The interior is simple but {surprisingly|word-form|surprising} warm, and the waiters {are|agreement|is} friendly without being pushy.\n\nI {had never tried|tense|have never tried} Georgian food before, so the waiter suggested {ordering|gerund-infinitive|to order} a few small dishes. Everything {was cooked|passive|was cook ; cooked} fresh, and the bread was {the best|comparative|the most best} I have eaten this year.\n\nMy only complaint is the noise. If the tables {were|conditional|would be} further apart, it {would be|conditional|will be} easier to talk. {Its|confusable|It\'s} prices are reasonable, though, and I would happily recommend it to anyone who {enjoys|agreement|enjoy} trying new flavours.',
  },
  // ───────────── B1 and B2 (assistant batch, reviewed) ─────────────
  {
    id: 'b1-email-busy-week', title: 'A busy week', level: 'B1', format: 'email', topic: 'Everyday Life',
    text: 'Hi Sam, I {have had|tense|had} a very busy week so far. Our new neighbour {has|agreement|have} two young children. They moved into {the flat|article-missing|flat} above ours on Monday. Their boxes were much {heavier|comparative|more heavier} than they expected.\n\nYesterday I {helped|tense|have helped} them carry a table upstairs. One child asked me where {I lived|word-order|did I live}. I told him I lived downstairs and offered {to lend|gerund-infinitive|lending} them a lamp. They {were|agreement|was} pleased because their lights were not working.\n\nI also bought some bread for dinner on my way home. The shop assistant gave me {the wrong bag|article-missing|wrong bag} by mistake. I returned it and got {my|pronoun|me} shopping back. Can we meet on Saturday? I need {a quiet afternoon|article-missing|quiet afternoon} after all this activity.\n\nBest wishes, Alex',
  },
  {
    id: 'b1-message-station-plan', title: 'At the station', level: 'B1', format: 'message', topic: 'Travel and Culture',
    text: 'Hi! I {arrived|tense|have arrived} at the station twenty minutes ago. The train to the coast {leaves|agreement|leave} from platform four. I bought {a return ticket|article-missing|return ticket} because it was cheaper than two single tickets. The clerk gave me {some information|plural-uncountable|some informations} about the last train home.\n\nPlease meet me beside {the main entrance|article-missing|main entrance} at nine. If you bring a bag, you {can leave|modal|can to leave} it in the station locker. I asked the guard where {the lockers were|word-order|were the lockers}. He said they were behind the ticket office.\n\nWe can visit the old market first. Its stalls sell {many|quantifier|much} small gifts, but we do not have to buy anything. I would rather spend our money on lunch. The café across the square {serves|agreement|serve} good soup. Text me when you get here, and I will wait {for|preposition|on} you.',
  },
  {
    id: 'b1-story-family-soup', title: 'The soup recipe', level: 'B1', format: 'story', topic: 'Food and Drinks',
    text: 'On Sunday, Mia {decided|tense|has decided} to cook lunch for her family. She found {a recipe|article-missing|recipe} in an old notebook. It called for two onions, carrots and {some rice|plural-uncountable|some rices}. Mia {bought|past-irregular|buyed} everything at the corner shop.\n\nAt home, she asked her brother to cut the vegetables. He worked {carefully|word-form|careful} but dropped an onion on the floor. Mia laughed and gave {him|pronoun|he} another one. They put the vegetables in {a large pot|article-missing|large pot} and added water. Their mother asked whether {the soup was ready|word-order|was the soup ready}.\n\nAfter half an hour, Mia tasted it. The soup needed {a little|quantifier|a few} salt, so she added some. Her father came in while she was setting {the table|article-missing|table}. Everyone enjoyed {eating|gerund-infinitive|to eat} together. Mia kept the recipe because it was {easier|comparative|more easier} than she had expected.',
  },
  {
    id: 'b1-notice-office-move', title: 'Office move', level: 'B1', format: 'notice', topic: 'Work and Career',
    text: 'Our team is moving to another floor next Monday. Please put your personal things in {a labelled box|article-missing|labelled box} before Friday afternoon. The boxes {are|agreement|is} available beside reception. Do not leave {any equipment|plural-uncountable|any equipments} on your desk.\n\nThe new office is {smaller|comparative|more smaller} than our current one, but it has better light. Each desk will have {a chair|article-missing|chair} and a screen. If you need help carrying a box, you {can ask|modal|can to ask} one of the moving team. Please tell {them|pronoun|they} which desk is yours.\n\nA short meeting will take place at ten on Monday. The manager will explain where {the meeting rooms are|word-order|are the meeting rooms}. There is also {a kitchen|article-missing|kitchen} near the entrance. It has cups and a kettle, but you should bring your own lunch. Thank you {for|preposition|to} helping us make the move easy.',
  },
  {
    id: 'b1-article-study-breaks', title: 'Better study breaks', level: 'B1', format: 'article', topic: 'Study and Learning',
    text: 'Many students {spend|agreement|spends} hours looking at the same page. Taking {a short break|article-missing|short break} can make studying feel easier. Last term, I {tried|tense|have tried} a simple plan. I worked for half an hour, then walked around the room. This was {more useful|comparative|more more useful} than checking my phone.\n\nDuring each break, I drank water and looked out of {the window|article-missing|window}. I avoided {reading|gerund-infinitive|to read} messages because they made it hard to return to my work. My friend asked me how {I kept|word-order|did I keep} track of time. I showed her my kitchen timer.\n\nAt first, I had {little|quantifier|few} energy after lunch. After two weeks, I felt better and finished my homework earlier. I also kept {a notebook|article-missing|notebook} beside me for questions. When I needed help, I asked {my teacher|pronoun|me teacher} instead of guessing.',
  },
  {
    id: 'b1-dialogue-evening-walk', title: 'An evening walk', level: 'B1', format: 'dialogue', topic: 'Health and Body',
    text: 'Anna: Do you want to come for {a walk|article-missing|walk} after dinner?\nBen: Yes. I {sat|past-irregular|sitted} at my desk all day, and my legs feel stiff.\nAnna: We could walk through {the park|article-missing|park} near my house.\nBen: That sounds good. Is it {farther|comparative|more farther} than the river path?\nAnna: No, it is close. The entrance {is|agreement|are} just across the road.\nBen: I {have had|tense|had} a headache since lunchtime, so I would prefer a quiet route.\nAnna: Of course. You {can bring|modal|can to bring} a bottle of water.\nBen: Thanks. My doctor told {me|pronoun|I} to take regular breaks from my screen.\nAnna: I enjoy {walking|gerund-infinitive|to walk} there because the paths are wide.\nBen: What time {does the gate close|word-order|the gate closes}?\nAnna: At nine. We have enough time for {a gentle walk|article-missing|gentle walk} before it gets dark.\nBen: Great. I will meet you {at|preposition|on} your front door at seven.',
  },
  {
    id: 'b1-review-budget-phone', title: 'A simple phone', level: 'B1', format: 'review', topic: 'Technology',
    text: 'I {bought|past-irregular|buyed} this phone last month because my old one stopped working. It has {a bright screen|article-missing|bright screen} and a battery that lasts all day. The buttons {are|agreement|is} easy to use, even when I wear gloves. I also like its {simple|word-form|simply} menu.\n\nSetting it up took {less|quantifier|fewer} time than I expected. The instructions explained where {the memory card goes|word-order|does the memory card go}. I needed {an adapter|article-missing|adapter} for my old charger, so I bought one nearby. Since then, the phone {has worked|tense|worked} well.\n\nThe camera is {better|comparative|more better} in daylight than indoors. It sometimes saves photos slowly, but that is not a big problem for me. I would recommend {it|pronoun|him} to someone who wants {a reliable device|article-missing|reliable device} without paying too much. Its sound is clear enough for calls.',
  },
  {
    id: 'b1-diary-new-neighbour', title: 'A new neighbour', level: 'B1', format: 'diary', topic: 'Home and Town',
    text: 'Today I {met|past-irregular|meeted} the new person who lives next door. She moved into {the empty flat|article-missing|empty flat} yesterday. Her name is Sara, and she {works|agreement|work} at the library. She asked where {the nearest shop was|word-order|was the nearest shop}.\n\nI showed her the way and helped carry {a small box|article-missing|small box} upstairs. She had brought {too much|quantifier|too many} furniture for the living room, so we moved a chair into the bedroom. She thanked {me|pronoun|I} and offered me tea.\n\nWe talked for an hour. Sara {has lived|tense|lived} in this town for three years, but this is her first flat near the centre. She said the buses here were {more frequent|comparative|more more frequent} than at her old address. I enjoyed {talking|gerund-infinitive|to talk} to her. Before I left, I told her about {the weekend market|article-missing|weekend market} in the square.',
  },
  {
    id: 'b1-instructions-return-parcel', title: 'Returning a parcel', level: 'B1', format: 'instructions', topic: 'Shopping and Money',
    text: 'First, check that you {have|agreement|has} your receipt. Put the unwanted item in {a strong box|article-missing|strong box} and close it with tape. If the box is damaged, ask the shop for another one. You {can return|modal|can to return} the item within two weeks of purchase.\n\nWrite your address {clearly|word-form|clear} on the form. Do not include {too much|quantifier|too many} paper inside the parcel. Attach {the return label|article-missing|return label} to the top, not the bottom. The shop assistant will tell you where {the parcel should go|word-order|should the parcel go}.\n\nTake it to {the nearest collection point|article-missing|nearest collection point} and keep the receipt they give you. The shop {will send|tense|sent} your money back after it receives the parcel. If you paid by card, the payment will go back to {your|pronoun|you} account. Please wait {for|preposition|on} a message before contacting the shop.',
  },
  {
    id: 'b1-report-park-paths', title: 'Park paths', level: 'B1', format: 'report', topic: 'Nature and Weather',
    text: 'Last Saturday, our group {walked|tense|has walked} through the local park after heavy rain. Several paths {were|agreement|was} wet and difficult to use. We counted {many|quantifier|much} puddles near the pond. One path was {narrower|comparative|more narrower} than the others, so people had to walk slowly.\n\nWe spoke to {a park worker|article-missing|park worker} about the problem. She asked which path {we had used|word-order|had we used}. We showed {her|pronoun|she} a map and pointed to the north entrance. A tree had fallen across {the main path|article-missing|main path} during the storm.\n\nThe worker said her team {would clear|reported-speech|will clear} it the next morning. She also suggested putting more stones on the muddy ground. Our group recommends {a clear sign|article-missing|clear sign} at each entrance when a path is closed. This would help visitors choose {a safer route|article-missing|safer route} without walking through the mud.',
  },
  {
    id: 'b1-email-club-training', title: 'Training together', level: 'B1', format: 'email', topic: 'Sport and Fitness',
    text: 'Hi Leo, our sports club {starts|agreement|start} a new beginner class next week. I went to {a trial session|article-missing|trial session} last Tuesday and enjoyed it. The coach {taught|past-irregular|teached} us how to warm up safely. She gave everyone {a simple plan|article-missing|simple plan} to follow at home.\n\nThe exercises were {easier|comparative|more easier} than I expected. We did {a few|quantifier|a little} stretches before moving on to short runs. I asked the coach how {I could improve|word-order|could I improve} my balance. She showed {me|pronoun|I} an exercise that takes only five minutes.\n\nI {have practised|tense|practised} it every day since the session. The next class is on Thursday evening. You {can join|modal|can to join} without buying any special equipment. Bring water and wear comfortable shoes. We can meet at {the sports hall|article-missing|sports hall} entrance just before six. I hope you can come. Best, Max',
  },
  {
    id: 'b1-message-family-visit', title: 'Sunday plans', level: 'B1', format: 'message', topic: 'People and Feelings',
    text: 'Hi, I {spoke|past-irregular|speaked} to our aunt this morning. She sounded happy about our visit. She has {a new puppy|article-missing|new puppy}, and she wants us to meet it. Her neighbours {are|agreement|is} coming for tea too. I think it will be {a lovely afternoon|article-missing|lovely afternoon}.\n\nI {have not seen|tense|did not see} her for six months, so I am excited. She asked whether {we could arrive early|word-order|could we arrive early}. I told {her|pronoun|she} we could be there by two. Please bring {a small cake|article-missing|small cake} if you have time to buy one.\n\nLast time, there was {too much|quantifier|too many} food on the table, so we do not need anything large. We can help her make tea and then take the puppy outside. She enjoys {walking|gerund-infinitive|to walk} with visitors. I will call you when I get on {the bus|article-missing|bus}. See you on Sunday!',
  },
  {
    id: 'b1-story-lost-umbrella', title: 'The lost umbrella', level: 'B1', format: 'story', topic: 'Everyday Life',
    text: 'Yesterday, Nina {left|past-irregular|leaved} her umbrella on the bus. She noticed it was missing when she reached {the office|article-missing|office}. It {was|agreement|were} raining hard, and her coat was thin. She asked a colleague where {the lost property desk was|word-order|was the lost property desk}.\n\nAt lunch, Nina rang the bus company. The person on the phone spoke {slowly|word-form|slow} and asked her to describe the umbrella. Nina said it had {a wooden handle|article-missing|wooden handle} and a blue cover. She had bought it {a few|quantifier|a little} weeks earlier. The clerk checked a list and found it.\n\nNina {went|past-irregular|goed} to collect it after work. The desk was {closer|comparative|more closer} than she had expected. She thanked {the clerk|article-missing|clerk} and put the umbrella in her bag. Since then, she {has checked|tense|checked} her seat before leaving every bus. She does not want another wet journey home.',
  },
  {
    id: 'b1-notice-museum-visit', title: 'Museum visit', level: 'B1', format: 'notice', topic: 'Travel and Culture',
    text: 'Our group {is visiting|tense|visited} the local museum on Friday. Please arrive at {the school entrance|article-missing|school entrance} by eight thirty. The bus {leaves|agreement|leave} at nine, so we cannot wait for late arrivals. Bring {a packed lunch|article-missing|packed lunch} and a bottle of water.\n\nAt the museum, a guide will show us old tools and clothes. Some rooms have {many|quantifier|much} small objects behind glass. Do not touch them. The guide will explain how {people lived|word-order|did people live} in the town long ago. If you have questions, you {can ask|modal|can to ask} them at the end of each room.\n\nThe visit will finish at three. We will meet beside {the main stairs|article-missing|main stairs} before returning to the bus. Tell {your teacher|pronoun|you teacher} if you need to leave the group. Please walk {quietly|word-form|quiet} inside the museum. We hope everyone enjoys the trip.',
  },
  {
    id: 'b1-article-market-produce', title: 'Buying fresh food', level: 'B1', format: 'article', topic: 'Food and Drinks',
    text: 'Buying food at {a local market|article-missing|local market} can be enjoyable. Some stalls {sell|agreement|sells} fruit that was picked that morning. Last weekend, I {went|past-irregular|goed} to a market near my home. I bought apples, carrots and some cheese for lunch.\n\nThe seller asked how {I planned|word-order|did I plan} to cook the carrots. I told {her|pronoun|she} I would roast them. She suggested adding {a little|quantifier|a few} oil and some herbs. Her advice was {simpler|comparative|more simpler} than the recipe I had found online.\n\nI took my shopping home in {a cloth bag|article-missing|cloth bag}. It was strong enough for everything. The vegetables tasted fresh, and I enjoyed {preparing|gerund-infinitive|to prepare} lunch. Since that day, I {have visited|tense|visited} the market every Saturday. Going early helps me find what I need before the busiest hour.',
  },
  {
    id: 'b1-dialogue-first-shift', title: 'A first shift', level: 'B1', format: 'dialogue', topic: 'Work and Career',
    text: 'Eva: I {start|tense|started} my new job tomorrow, and I feel nervous.\nOmar: Did they give you {a timetable|article-missing|timetable} for the first week?\nEva: Yes, but I forgot where {the training room is|word-order|is the training room}.\nOmar: Ask at reception. The staff are usually helpful.\nEva: I also need {a clean shirt|article-missing|clean shirt} for the first day.\nOmar: You {can borrow|modal|can to borrow} one of mine if it fits.\nEva: Thanks. I {bought|past-irregular|buyed} new shoes, but they hurt my feet.\nOmar: Try wearing them for {a few|quantifier|a little} hours tonight.\nEva: The manager said the morning shift was {quieter|comparative|more quieter} than the afternoon shift.\nOmar: That gives you time to learn. Ask {your colleagues|pronoun|you colleagues} for help.\nEva: I hope I can remember everyone\'s name.\nOmar: Keep {a small notebook|article-missing|small notebook} in your pocket and write things down after work.',
  },
  {
    id: 'b1-review-language-class', title: 'An evening class', level: 'B1', format: 'review', topic: 'Study and Learning',
    text: 'I joined {an evening class|article-missing|evening class} at the community centre last month. The teacher {explains|agreement|explain} new words clearly and gives us time to practise. Our group has fewer than ten people, so everyone can speak. I {have learned|tense|learned} a lot since the first lesson.\n\nBefore each class, we read {a short story|article-missing|short story}. The teacher asks what {we understood|word-order|did we understand} and helps us with difficult sentences. She never laughs at mistakes. This makes {us|pronoun|we} feel comfortable. The exercises become {harder|comparative|more harder} each week, but they are still enjoyable.\n\nI particularly like {working|gerund-infinitive|to work} with a partner. We talk about ordinary situations, such as asking for directions. I keep {a list|article-missing|list} of useful phrases at home. The room can be cold in winter, so bring a jumper. Apart from that, I would recommend this class to any beginner.',
  },
  {
    id: 'b1-diary-new-routine', title: 'A gentler routine', level: 'B1', format: 'diary', topic: 'Health and Body',
    text: 'This morning, I {woke|past-irregular|waked} up earlier than usual. I had {a glass of water|article-missing|glass of water} before breakfast and opened the window. My legs {felt|past-irregular|feeled} tired after yesterday\'s walk, so I chose a gentle stretch.\n\nI {have followed|tense|followed} this routine for a week now. At first, I had {little|quantifier|few} patience with slow exercises. Today they felt {easier|comparative|more easier}. I asked my friend how {she stayed|word-order|did she stay} motivated, and she suggested keeping a diary. I thanked {her|pronoun|she} for the idea.\n\nAfter lunch, I went outside for {a short walk|article-missing|short walk}. The air was cool, but the sun was bright. I enjoyed {moving|gerund-infinitive|to move} without rushing. Tomorrow I want to try the same plan again. A calm start to the day {helps|agreement|help} me concentrate, especially when I have a lot of work.',
  },
  {
    id: 'b1-instructions-update-app', title: 'Updating an app', level: 'B1', format: 'instructions', topic: 'Technology',
    text: 'Before you begin, make sure your phone {has|agreement|have} enough power. Connect it to {a reliable network|article-missing|reliable network} and open the settings menu. Look for {the update button|article-missing|update button} near the bottom of the screen. You {can check|modal|can to check} the version number there.\n\nPress the button once and wait. Do not close the app while it {is updating|tense|updated}. The download may take {a few|quantifier|a little} minutes. If a message appears, read it {carefully|word-form|careful} before choosing an option. The help page shows where {your saved files are|word-order|are your saved files}.\n\nWhen the update finishes, open {the app|article-missing|app} again. Check that your notes are still there. If anything is missing, contact the support team and tell {them|pronoun|they} what happened. Keep {a copy|article-missing|copy} of important notes before future updates. This simple step can save you time.',
  },
  {
    id: 'b1-report-street-lights', title: 'Street lighting', level: 'B1', format: 'report', topic: 'Home and Town',
    text: 'Last week, we {asked|tense|have asked} residents about the lights on our street. Most people {were|agreement|was} satisfied with the lamps near the shops. However, the road beside {the public garden|article-missing|public garden} was much darker. Several residents said they needed {a brighter lamp|article-missing|brighter lamp} near the crossing.\n\nWe walked along the road on Friday evening. There were {fewer|quantifier|less} working lights at the far end than near the centre. One resident asked when {the broken lamp would be repaired|word-order|would the broken lamp be repaired}. We told {her|pronoun|she} we would report the problem.\n\nOur group recommends checking all the lamps every month. The route to {the bus stop|article-missing|bus stop} should be safe after dark. We also suggest adding {a clear sign|article-missing|clear sign} at the crossing. Better lighting would make the walk {safer|comparative|more safer} for everyone who uses this street in the evening.',
  },
  {
    id: 'b1-email-shoe-exchange', title: 'A shoe exchange', level: 'B1', format: 'email', topic: 'Shopping and Money',
    text: 'Hello, I {bought|past-irregular|buyed} a pair of walking shoes from your shop on Tuesday. They looked comfortable, but the left shoe {is|agreement|are} too tight. I still have {the receipt|article-missing|receipt} and the original box. I would like to exchange them for {a larger size|article-missing|larger size}.\n\nI wore the shoes only inside my home. The soles are clean, and I have kept {all the packaging|plural-uncountable|all the packagings}. Could you tell me where {I should bring|word-order|should I bring} them? If my size is not available, I {can wait|modal|can to wait} until next week.\n\nYour website says exchanges are possible within fourteen days. I {have checked|tense|checked} the size guide since buying the shoes, and I think the next size will fit. Please let {me|pronoun|I} know if I need to complete {a form|article-missing|form} first. Thank you for your help. Kind regards, Jo',
  },
  {
    id: 'b1-message-rainy-weekend', title: 'Rainy weekend', level: 'B1', format: 'message', topic: 'Nature and Weather',
    text: 'Hi! The weather forecast {says|agreement|say} it will rain most of Saturday. I checked it this morning. We can still take {a short walk|article-missing|short walk} if the rain stops after lunch. The path through the woods is {drier|comparative|more drier} than the one beside the stream.\n\nBring {a warm coat|article-missing|warm coat} because the wind is strong today. I have {some information|plural-uncountable|some informations} about the route on my phone. My brother asked where {we planned to meet|word-order|did we plan to meet}. I told {him|pronoun|he} to wait outside the library.\n\nIf it rains too hard, we {can visit|modal|can to visit} the indoor garden instead. It has a small café, so we could have tea there. Please send me {a message|article-missing|message} before you leave home. I will bring an umbrella, but it is not big enough for both of us.',
  },
  {
    id: 'b1-story-local-race', title: 'A local race', level: 'B1', format: 'story', topic: 'Sport and Fitness',
    text: 'Tom {ran|past-irregular|runned} in a local race on Sunday. He had trained for {a month|article-missing|month} and felt ready. His friends {were|agreement|was} waiting near the start line. They gave him {a bottle of water|article-missing|bottle of water} and wished him luck.\n\nThe first part of the route was flat, but the last hill was {steeper|comparative|more steeper} than Tom expected. He had {little|quantifier|few} energy left near the top. A runner beside him said that they could finish together. Tom thanked {her|pronoun|she}, and they continued at a steady pace.\n\nAfter the race, someone asked how {he had prepared|word-order|had he prepared}. Tom said he enjoyed {running|gerund-infinitive|to run} in the mornings before work. He {has kept|tense|kept} the same habit since the race. The result was not important to him; finishing with {a new friend|article-missing|new friend} made the day special.',
  },
  {
    id: 'b2-review-small-theatre', title: 'The little theatre', level: 'B2', format: 'review', topic: 'Travel and Culture',
    text: 'I visited {a small theatre|article-missing|small theatre} during a weekend away. The building {was built|passive|was build} more than a century ago, but the seats are comfortable. Staff handed us {a programme|article-missing|programme} at the door and showed us to our places. The stage was closer than I expected, which made the performance feel personal.\n\nThe play began with {a quiet scene|article-missing|quiet scene} in a family kitchen. Its dialogue sounded natural, although a few jokes depended on local expressions. I asked my companion why {the audience had laughed|word-order|had the audience laughed} at one line. She explained the reference during the interval. The actors spoke {clearly|word-form|clear}, so even unfamiliar words were easy to follow.\n\nI have visited {several|quantifier|much} theatres this year, and this one was the most welcoming. The director said the group {would perform|reported-speech|will perform} another play the following month. I would recommend booking {a seat|article-missing|seat} early, because the room is small. The ticket cost less than a meal out, and the experience stayed with me for days.',
  },
  {
    id: 'b2-instructions-interview-prep', title: 'Preparing for an interview', level: 'B2', format: 'instructions', topic: 'Work and Career',
    text: 'Begin by reading {the job description|article-missing|job description} carefully. Identify the duties you have already handled and prepare {a brief example|article-missing|brief example} for each one. Your examples should describe what you did, not just what your team achieved. If you have a gap in experience, explain how you {would learn|conditional|will learn} the missing skill if you were offered the role.\n\nFind out where {the interview will take place|word-order|will the interview take place} and allow extra time for the journey. Bring {a printed copy|article-missing|printed copy} of your CV, even if you sent it earlier. Documents should be {organised|passive|organise} so that you can find them quickly. Avoid {memorising|gerund-infinitive|to memorise} complete answers; they often sound unnatural.\n\nDuring the interview, listen to each question before replying. If something is unclear, ask {the interviewer|article-missing|interviewer} to repeat it. Speak {confidently|word-form|confident}, but do not claim skills you have never used. Afterwards, write down {a few|quantifier|a little} points you could improve. The interviewer said a decision {would be made|reported-speech|will be made} by the end of the following week.',
  },
  {
    id: 'b2-report-library-survey', title: 'Library survey', level: 'B2', format: 'report', topic: 'Study and Learning',
    text: 'Our class carried out {a short survey|article-missing|short survey} about study spaces last week. The questions {were sent|passive|were send} to students who use the town library regularly. Most respondents valued the quiet rooms, but several mentioned a shortage of desks. We asked how {they usually found|word-order|did they usually find} a place during busy periods.\n\nMany students arrived early because they expected the rooms to fill by midday. There were {fewer|quantifier|less} complaints about noise than we had anticipated. However, students said that {the internet connection|article-missing|internet connection} was unreliable near the windows. One respondent suggested moving the study lamps, while another recommended {adding|gerund-infinitive|to add} more sockets.\n\nOur findings should be treated {carefully|word-form|careful}, as only regular visitors answered the survey. We recommend testing {the connection|article-missing|connection} throughout the building before buying new equipment. The librarian said the results would be discussed at the next staff meeting. If the proposed changes {were made|conditional|would be made}, more students could use the rooms comfortably during exams.',
  },
  {
    id: 'b2-message-data-backup', title: 'Before the update', level: 'B2', format: 'message', topic: 'Technology',
    text: 'Before you install {the latest update|article-missing|latest update}, please make a copy of your project files. The shared folder {was created|passive|was create} for temporary drafts, not permanent storage. I discovered yesterday that one of my diagrams had disappeared after I changed devices. Fortunately, I had saved {a separate copy|article-missing|separate copy} on my computer.\n\nThe support page explains where {the backup option is|word-order|is the backup option}, although the screenshots are slightly old. Select your files {carefully|word-form|careful}; copying everything will take much longer. There is {less|quantifier|fewer} space on the shared drive than we thought. I recommend {removing|gerund-infinitive|to remove} duplicate drafts before you begin.\n\nThe technician said the update would not affect files stored locally. Even so, I would rather not rely on that promise alone. If the connection {failed|conditional|would fail} halfway through, you could restart the upload later. Send me {a quick message|article-missing|quick message} when your backup is complete, and I will check that our final diagrams are still available.',
  },
  {
    id: 'b2-story-roof-repair', title: 'The leaking roof', level: 'B2', format: 'story', topic: 'Home and Town',
    text: 'When the first storm arrived, water began dripping through {the kitchen ceiling|article-missing|kitchen ceiling}. A loose tile {had been damaged|passive|had been damage} by the wind, although nobody had noticed it before. The family placed {a large bucket|article-missing|large bucket} under the leak and moved the table away. Their youngest child wondered why {the ceiling was wet|word-order|was the ceiling wet} when the windows were shut.\n\nThe next morning, a roofer inspected the house. He spoke {honestly|word-form|honest} about the cost and showed them photographs of the broken tile. He advised {replacing|gerund-infinitive|to replace} a second tile as well, since it had started to crack. The repair took {less|quantifier|fewer} time than the family expected.\n\nThat evening, rain returned, but the kitchen stayed dry. The roofer had said the new tiles {would last|reported-speech|will last} for many years. If they {had waited|conditional|would have waited} another month, the water might have damaged the walls too. The family decided to keep {a small emergency fund|article-missing|small emergency fund} for future repairs. The house felt peaceful again once the bucket was put away.',
  },
  {
    id: 'b2-notice-market-refunds', title: 'Market refunds', level: 'B2', format: 'notice', topic: 'Shopping and Money',
    text: 'Customers who wish to return {a faulty item|article-missing|faulty item} should speak to the stall holder before leaving the market. Proof of purchase {is required|passive|is require} for refunds, so please keep your receipt. If you paid by card, bring {the same card|article-missing|same card} when you return. Refunds cannot be paid in cash for card purchases.\n\nPlease describe the problem {clearly|word-form|clear} and show the item to the seller. They may ask when {you first noticed|word-order|did you first notice} the fault. If the item was a gift, the person who bought it may need to provide the receipt. We have {fewer|quantifier|less} staff at the information desk on Sundays, so allow extra time.\n\nItems damaged through ordinary use cannot automatically be exchanged. The market manager said complaints would be reviewed within five working days. If you {were unsure|conditional|would be unsure} about the process, a staff member could explain it to you. Please keep {a copy|article-missing|copy} of any written complaint. We aim to handle every request fairly and without delay.',
  },
  {
    id: 'b2-article-city-trees', title: 'Trees on our streets', level: 'B2', format: 'article', topic: 'Nature and Weather',
    text: 'A street with mature trees can feel noticeably cooler on {a hot afternoon|article-missing|hot afternoon}. In one neighbourhood, several trees {were removed|passive|were remove} after their roots damaged the pavement. Residents then asked for {a new planting plan|article-missing|new planting plan} rather than leaving the street bare. They wanted shade without repeating the same problem.\n\nThe council invited residents to discuss where {the new trees should go|word-order|should the new trees go}. A local gardener recommended {choosing|gerund-infinitive|to choose} varieties with roots suited to narrow spaces. She spoke {openly|word-form|open} about the need for watering during dry summers. There was {less|quantifier|fewer} space beside the shops than in the residential part of the street.\n\nThe council said the first trees {would be planted|reported-speech|will be planted} the following spring. If the young trees {were watered|conditional|would be watered} regularly, they could grow well despite the limited space. Neighbours offered to check {the soil|article-missing|soil} during warm weeks. The plan will not solve every problem, but it gives the street a greener future.',
  },
  {
    id: 'b2-dialogue-training-load', title: 'Training without rushing', level: 'B2', format: 'dialogue', topic: 'Sport and Fitness',
    text: 'Coach: I noticed you changed {your training plan|article-missing|training plan} last week.\nRunner: Yes, but the new sessions {were suggested|passive|were suggest} by a friend.\nCoach: Did you ask why {the distances increased|word-order|did the distances increase} so quickly?\nRunner: No. I assumed that more running would always help.\nCoach: Progress depends on recovery too. You have {fewer|quantifier|less} rest days than before.\nRunner: I felt tired yesterday and struggled to finish {a short run|article-missing|short run}.\nCoach: I recommend {reducing|gerund-infinitive|to reduce} the distance for a week.\nRunner: My friend said the tiredness would disappear after a few sessions.\nCoach: If you {ignored|conditional|would ignore} it, you could make the problem worse.\nRunner: I see. I should pay attention to how I feel.\nCoach: Exactly. Record each session {accurately|word-form|accurate}, including the easy ones.\nRunner: I will keep {a simple diary|article-missing|simple diary} and show it to you next Monday.',
  },
  {
    id: 'b2-review-community-choir', title: 'A welcoming choir', level: 'B2', format: 'review', topic: 'People and Feelings',
    text: 'I joined {a community choir|article-missing|community choir} because I wanted to meet people after moving house. New members are welcomed at the start of each rehearsal, and nobody expects them to read music. The group begins with {a short warm-up|article-missing|short warm-up} before learning songs together. That routine helped me feel less nervous on my first evening.\n\nThe conductor explains {clearly|word-form|clear} which parts each group should sing. She asked me whether {I preferred|word-order|did I prefer} a seat near the front or the back. I chose the back until I knew a few more people. There were {fewer|quantifier|less} unfamiliar faces by my third visit. I soon found myself {looking forward|gerund-infinitive|to look forward} to rehearsals.\n\nAt the end of term, we performed for friends and relatives. The conductor said the concert {would be|reported-speech|will be} informal, which took some pressure off us. If I {had stayed|conditional|would have stayed} at home that first evening, I would have missed several new friendships. I would recommend the choir to anyone seeking {a relaxed social activity|article-missing|relaxed social activity}.',
  },
  {
    id: 'b2-report-shared-kitchen', title: 'A shared kitchen', level: 'B2', format: 'report', topic: 'Everyday Life',
    text: 'This report examines how residents use {the shared kitchen|article-missing|shared kitchen} in our building. The room {was renovated|passive|was renovate} last autumn, and most residents now find it easier to prepare meals there. However, several people have reported that clean dishes are sometimes left on the worktop. We asked when {the kitchen became|word-order|did the kitchen become} busiest.\n\nThe answers showed that most residents cook between six and eight in the evening. There is {less|quantifier|fewer} cupboard space than many expected. Some residents suggested {adding|gerund-infinitive|to add} a shelf for shared equipment, while others wanted clearer labels. A simple cleaning rota could make responsibilities {clearer|comparative|more clearer} without creating unnecessary rules.\n\nThe caretaker said the cupboard doors {would be repaired|reported-speech|will be repaired} the following week. If everyone {put|conditional|would put} their dishes away after use, the room could serve more people comfortably. We recommend placing {a notice|article-missing|notice} beside the sink and reviewing the arrangement after a month. Residents should be invited to comment before any permanent changes are made.',
  },
  {
    id: 'b2-email-coastal-host', title: 'Questions before arrival', level: 'B2', format: 'email', topic: 'Travel and Culture',
    text: 'Dear host, thank you for sending {the arrival details|article-missing|arrival details} for our stay next month. We understand that the cottage {is reached|passive|is reach} by a narrow lane. Could you tell us where {we should park|word-order|should we park} if another car is already outside? We will arrive in the early evening and would rather avoid blocking the road.\n\nWe are also planning {to visit|gerund-infinitive|visiting} the coastal path. Your guide mentions that some sections become slippery after rain. Is there {a shorter route|article-missing|shorter route} suitable for an easy morning walk? We have {less|quantifier|fewer} time on our final day, so a local suggestion would be helpful.\n\nMy friend said the village shop would close early on Sundays. If that information {were correct|conditional|would be correct}, we could bring breakfast supplies with us. Please let us know whether {the kitchen|article-missing|kitchen} has a kettle and basic cooking equipment. We appreciate your advice and look forward to seeing the area at a relaxed pace. Kind regards, Elise',
  },
  {
    id: 'b2-message-dinner-guests', title: 'Dinner for everyone', level: 'B2', format: 'message', topic: 'Food and Drinks',
    text: 'I have checked {the dinner menu|article-missing|dinner menu} with everyone coming on Friday. The main dish {will be prepared|passive|will be prepare} without nuts, as one guest cannot eat them. I am making {a separate sauce|article-missing|separate sauce} so people can choose how much to add. Please do not put nuts on the table, even as a snack.\n\nOur neighbour offered {to bring|gerund-infinitive|bringing} dessert, but I asked her to send the ingredients first. She wanted to know whether {the oven would be free|word-order|would the oven be free} after six. It should be, provided the vegetables cook on time. I have {less|quantifier|fewer} preparation to do than I expected because two friends volunteered to help.\n\nOne guest said he would arrive a little late. If the train {were delayed|conditional|would be delayed} further, we could keep his meal warm. Could you bring {a serving spoon|article-missing|serving spoon} for the rice? Mine has disappeared. I want the evening to feel relaxed rather than perfectly planned, so there is no need to rush here after work.',
  },
  {
    id: 'b2-story-warehouse-lesson', title: 'A better route', level: 'B2', format: 'story', topic: 'Work and Career',
    text: 'When Lena joined {the warehouse team|article-missing|warehouse team}, she noticed that staff crossed the same aisle several times to collect each order. The routes {had been designed|passive|had been design} years earlier, before the shelves were rearranged. She drew {a simple map|article-missing|simple map} and marked where the busiest items were kept. Her supervisor asked why {the team travelled|word-order|did the team travel} so far between picks.\n\nLena suggested {moving|gerund-infinitive|to move} a few common items closer to the packing area. She explained her idea {carefully|word-form|careful}, since she did not want to criticise anyone\'s work. The change required {fewer|quantifier|less} steps for most orders, although large items still needed special handling.\n\nThe supervisor said the new route {would be tested|reported-speech|will be tested} for two weeks. If the trial {saved|conditional|would save} time without causing mistakes, the team could keep it. By the end of the trial, colleagues were using {the updated map|article-missing|updated map} without being reminded. Lena learnt that a useful suggestion often begins with listening to the people who do the work every day.',
  },
  {
    id: 'b2-notice-exam-room', title: 'Exam room arrangements', level: 'B2', format: 'notice', topic: 'Study and Learning',
    text: 'Students sitting {the written exam|article-missing|written exam} should arrive twenty minutes before the start. Desks {have been arranged|passive|have been arrange} in rows, and each place has a number. Check {the seating list|article-missing|seating list} outside the room before entering. Staff will explain where {you should leave|word-order|should you leave} coats and bags.\n\nOnly approved materials may be kept on desks. There are {fewer|quantifier|less} spare pens available this term, so bring your own. Avoid {bringing|gerund-infinitive|to bring} notes into the room, even if you do not intend to read them. If you need help, raise your hand and speak {quietly|word-form|quiet} to a member of staff.\n\nThe examination officer said late arrivals would be admitted only during the first fifteen minutes. If a student {felt|conditional|would feel} unwell, a supervisor could take them to the rest area. Please listen to {the final instructions|article-missing|final instructions} before opening your paper. These arrangements are intended to keep the room calm and fair for everyone.',
  },
  {
    id: 'b2-article-sleep-habits', title: 'A calmer evening', level: 'B2', format: 'article', topic: 'Health and Body',
    text: 'A regular evening routine can make {the end of the day|article-missing|end of the day} feel less rushed. In a small local workshop, participants {were asked|passive|were ask} to record what they did before bed. Most discovered that they spent longer on their phones than they had realised. The organiser asked when {they usually turned|word-order|did they usually turn} off their screens.\n\nSeveral participants tried reading a paper book instead. Others prepared clothes for the next day or wrote {a short list|article-missing|short list} of unfinished tasks. There was {less|quantifier|fewer} late-night checking of messages when phones were left in another room. These changes were modest, but people described feeling calmer.\n\nThe organiser said the group {would meet|reported-speech|will meet} again the following month to discuss what worked. If a routine {felt|conditional|would feel} too strict, participants could change it rather than abandon it. The aim was not to create perfect habits, but to make {a little space|article-missing|little space} for rest. Anyone with persistent sleep problems should speak to a qualified health professional.',
  },
  {
    id: 'b2-dialogue-new-device', title: 'Choosing a device', level: 'B2', format: 'dialogue', topic: 'Technology',
    text: 'Nora: I need {a new laptop|article-missing|new laptop} for my course, but the choices are confusing.\nIvo: What tasks {will you use it for|word-order|you will use it for}?\nNora: Mostly writing reports and editing photographs.\nIvo: Then check whether {the memory can be upgraded|passive|the memory can be upgrade}.\nNora: The seller said this model would last for several years.\nIvo: That depends on your needs. Do you have {a fixed budget|article-missing|fixed budget}?\nNora: Yes, and I have {less|quantifier|fewer} money available than I first thought.\nIvo: I suggest {comparing|gerund-infinitive|to compare} repair costs as well as the purchase price.\nNora: Why {are repairs important|word-order|repairs are important} if it comes with a guarantee?\nIvo: A guarantee has limits. If you {broke|conditional|would break} the screen, you might have to pay.\nNora: That is worth considering. I will read {the conditions|article-missing|conditions} before deciding.\nIvo: Good idea. Choose {carefully|word-form|careful}, and do not let a sale sign rush you.',
  },
  {
    id: 'b2-diary-garden-project', title: 'The courtyard garden', level: 'B2', format: 'diary', topic: 'Home and Town',
    text: 'Today we began turning {the shared courtyard|article-missing|shared courtyard} into a small garden. The old benches {were moved|passive|were move} to one side so we could see how much space was available. A neighbour brought {a rough plan|article-missing|rough plan} showing paths between the flower beds. We discussed where {the new planters should stand|word-order|should the new planters stand}.\n\nSome residents suggested {growing|gerund-infinitive|to grow} herbs that anyone could use. Others wanted flowers that would attract insects. There was {less|quantifier|fewer} agreement about the seating area, but everyone listened politely. I spoke {openly|word-form|open} about the need to leave enough room for bicycles and pushchairs.\n\nOur caretaker said the soil would be delivered on Friday. If the weather {stayed|conditional|would stay} dry, we could fill the planters over the weekend. Before leaving, I put {a notice|article-missing|notice} in the entrance inviting more neighbours to take part. The courtyard still looks untidy, but it already feels like a place we are building together.',
  },
  {
    id: 'b2-instructions-budget-plan', title: 'Planning monthly costs', level: 'B2', format: 'instructions', topic: 'Shopping and Money',
    text: 'Start by listing {your regular expenses|article-missing|regular expenses}, such as rent and travel. Each amount should be {recorded|passive|record} in the same place so you can review it later. Then make {a separate list|article-missing|separate list} of costs that change from month to month. If you are unsure where {your money has gone|word-order|has your money gone}, check your recent receipts.\n\nAvoid {estimating|gerund-infinitive|to estimate} every cost from memory. Small purchases can add up, although each one seems unimportant. You may have {less|quantifier|fewer} money left for leisure than you expected. Look {carefully|word-form|careful} at subscriptions you no longer use before cutting things that matter to you.\n\nA financial adviser at our workshop said the plan would be easier to maintain if it remained simple. If an unexpected bill {arrived|conditional|would arrive}, a small reserve could help you manage it. Review {the plan|article-missing|plan} each month and adjust it when your circumstances change. The goal is to understand your spending, not to judge yourself for every purchase.',
  },
  {
    id: 'b2-report-river-cleanup', title: 'Riverbank clean-up', level: 'B2', format: 'report', topic: 'Nature and Weather',
    text: 'Last month, volunteers organised {a riverbank clean-up|article-missing|riverbank clean-up} near the footbridge. Protective gloves {were provided|passive|were provide} at the meeting point, along with bags for ordinary litter. The organiser gave {a short safety talk|article-missing|short safety talk} before anyone approached the water. She explained where {volunteers should leave|word-order|should volunteers leave} sharp or unfamiliar objects.\n\nThe group collected {less|quantifier|fewer} litter than during the previous event, which may reflect earlier work in the area. Volunteers avoided {disturbing|gerund-infinitive|to disturb} plants along the bank and stayed on existing paths. One team recorded the places where bins were full. They reported their findings {accurately|word-form|accurate} so the local maintenance team could act.\n\nThe organiser said the results {would be shared|reported-speech|will be shared} with residents the following week. If more bins {were installed|conditional|would be installed} near the bridge, visitors might find it easier to dispose of rubbish properly. We recommend arranging {another visit|article|other visit} after the summer holidays. Regular checks would help us understand whether the riverbank is staying cleaner over time.',
  },
  {
    id: 'b2-email-club-feedback', title: 'Feedback on the class', level: 'B2', format: 'email', topic: 'Sport and Fitness',
    text: 'Dear club manager, I am writing to offer {some feedback|plural-uncountable|some feedbacks} on the evening exercise class. The sessions {are led|passive|are lead} by an encouraging instructor, and beginners receive {a clear explanation|article-missing|clear explanation} of each movement. I particularly appreciate the time set aside for questions at the end.\n\nRecently, the class has become crowded. Several members asked whether {the room could be changed|word-order|could the room be changed} to a larger one. It is difficult to move {safely|word-form|safe} when people stand close together. We also have {fewer|quantifier|less} mats than participants on some evenings. I suggest {adding|gerund-infinitive|to add} a booking system so staff know how many people to expect.\n\nThe instructor said the timetable would be reviewed next month. If a second session {were offered|conditional|would be offered}, some members could attend earlier and reduce the pressure on the room. Please consider placing {a notice|article-missing|notice} at reception when a class is full. I enjoy attending and hope these suggestions will make it comfortable for everyone. Kind regards, Dan',
  },
  {
    id: 'b2-message-difficult-talk', title: 'After the conversation', level: 'B2', format: 'message', topic: 'People and Feelings',
    text: 'I am glad we finally had {a proper conversation|article-missing|proper conversation} yesterday. Some things {were misunderstood|passive|were misunderstand} when we exchanged hurried messages, and neither of us felt heard. Thank you for giving me {a chance|article-missing|chance} to explain why I was upset. I realise now that I made assumptions about your plans.\n\nYou asked why {I had not called|word-order|had I not called} sooner. I was afraid of making the disagreement worse. I should have spoken {honestly|word-form|honest} instead of avoiding it. There is {less|quantifier|fewer} tension between us now that we know what happened. I appreciate {listening|gerund-infinitive|to listen} to your side as well.\n\nYou said you would send me the details of next week\'s gathering. If I {were free|conditional|would be free}, I could help set up the room beforehand. Whatever we decide, I do not want one difficult afternoon to change our friendship. Let us make {a fresh start|article-missing|fresh start} and speak directly whenever something feels wrong.',
  },
  {
    id: 'b2-story-missed-delivery', title: 'A missed delivery', level: 'B2', format: 'story', topic: 'Everyday Life',
    text: 'When Priya returned from work, she found {a delivery note|article-missing|delivery note} under the door. The parcel {had been taken|passive|had been take} to a nearby collection point because nobody had answered the bell. She had expected {a replacement kettle|article-missing|replacement kettle}, as the old one had stopped heating water. She checked where {the collection point was|word-order|was the collection point} before leaving again.\n\nThe shop was closing soon, so she walked {quickly|word-form|quick} through the side streets. There were {fewer|quantifier|less} people waiting than she had feared. The assistant asked for identification before {handing|gerund-infinitive|to hand} over the parcel. Priya showed her card and signed the form.\n\nThe assistant said the shop {would close|reported-speech|will close} in ten minutes. If Priya {had taken|conditional|would have taken} the longer route, she would have arrived too late. At home, she opened {the box|article-missing|box} and found the kettle safely packed. She made tea and decided to update her delivery instructions so future parcels would be left at the collection point directly.',
  },
  {
    id: 'b2-notice-heritage-walk', title: 'Guided town walk', level: 'B2', format: 'notice', topic: 'Travel and Culture',
    text: 'Visitors joining {the guided town walk|article-missing|guided town walk} should meet outside the old library. The route {has been planned|passive|has been plan} to avoid the busiest roads, but a few sections include steps. Please wear comfortable shoes and bring water on warm days. A guide will explain where {the group will stop|word-order|will the group stop} for a short break.\n\nWe ask participants to listen {carefully|word-form|careful} when crossing roads. The guide may recommend {waiting|gerund-infinitive|to wait} until everyone has reached the next corner. There are {fewer|quantifier|less} sheltered places on the second half of the route, so consider bringing a light coat. Children are welcome when accompanied by an adult.\n\nThe organiser said the walk would finish near the market square. If heavy rain {were forecast|conditional|would be forecast}, the event could be postponed and ticket holders would receive a message. Please keep {the booking confirmation|article-missing|booking confirmation} on your phone or in print. We hope the walk gives visitors an enjoyable introduction to the town\'s older streets.',
  },
  {
    id: 'b2-article-meal-sharing', title: 'Sharing food at home', level: 'B2', format: 'article', topic: 'Food and Drinks',
    text: 'When several people share {a kitchen|article-missing|kitchen}, planning meals together can save effort. In one household, a weekly menu {was introduced|passive|was introduce} after residents kept buying the same ingredients. They agreed on {a short shopping list|article-missing|short shopping list} every Sunday and left room for individual meals. One resident asked how {the costs would be divided|word-order|would the costs be divided}.\n\nThe group decided to record shared purchases and settle the balance monthly. There was {less|quantifier|fewer} wasted food once everyone knew what was in the fridge. They enjoyed {trying|gerund-infinitive|to try} recipes from different family traditions, although not everyone liked the same spices. Their discussions became {more respectful|comparative|more more respectful} when they stopped assuming that one person would always cook.\n\nA resident said the arrangement would only work if people could change it. If someone {worked|conditional|would work} late, the others could save a portion rather than waiting. They put {a simple calendar|article-missing|simple calendar} on the fridge so everyone could see the plan. The system was not perfect, but it made shared evenings easier and more welcoming.',
  },
  {
    id: 'b2-dialogue-project-meeting', title: 'The project meeting', level: 'B2', format: 'dialogue', topic: 'Work and Career',
    text: 'Leah: Has {the meeting agenda|article-missing|meeting agenda} been sent to everyone?\nRavi: Yes, it {was shared|passive|was share} this morning.\nLeah: Do you know why {the deadline was moved|word-order|was the deadline moved}?\nRavi: The client needs more time to review the first draft.\nLeah: That gives us {less|quantifier|fewer} time for testing at the end.\nRavi: I suggest {checking|gerund-infinitive|to check} the risky sections earlier.\nLeah: Good idea. Please explain that {clearly|word-form|clear} at the meeting.\nRavi: Our manager said she would join remotely.\nLeah: If she {were here|conditional|would be here}, we could discuss the drawings together.\nRavi: We can still share {a copy|article-missing|copy} on screen.\nLeah: Have you prepared the list of questions?\nRavi: Yes. I put {the most urgent ones|article-missing|most urgent ones} at the top.\nLeah: Great. Let us make sure every decision has an owner before we finish.',
  },
  {
    id: 'b2-review-study-group', title: 'A useful study group', level: 'B2', format: 'review', topic: 'Study and Learning',
    text: 'I attended {a weekly study group|article-missing|weekly study group} during the final month of my course. The sessions {were organised|passive|were organise} by students rather than teachers, which made questions easier to ask. Each week, someone prepared {a short exercise|article-missing|short exercise} for the others. We then discussed where {our answers differed|word-order|did our answers differ} and checked the course notes.\n\nThe group worked best when members explained their reasoning {clearly|word-form|clear}. There was {less|quantifier|fewer} pressure to answer immediately than in class. I enjoyed {hearing|gerund-infinitive|to hear} different approaches to the same problem. One student was particularly good at turning long instructions into manageable steps without oversimplifying them.\n\nOur organiser said the group would continue next term. If I {had studied|conditional|would have studied} alone, I would probably have missed several useful ideas. The only drawback was that meetings sometimes ran late. I recommend setting {a clear finishing time|article-missing|clear finishing time} at the start. Overall, the group helped me study more confidently and notice mistakes in my own work.',
  },
  {
    id: 'b2-diary-return-to-running', title: 'Running again', level: 'B2', format: 'diary', topic: 'Health and Body',
    text: 'Today I completed {a gentle run|article-missing|gentle run} after several weeks away from training. My old schedule {had been changed|passive|had been change} because I needed more time to recover from a minor strain. I followed {a shorter route|article-missing|shorter route} along the canal and paid attention to my pace. My friend asked how {I felt|word-order|did I feel} afterwards.\n\nI told her that I felt fine, although I was tempted {to run|gerund-infinitive|running} farther. My physiotherapist had advised me to increase distances {gradually|word-form|gradual}. There was {less|quantifier|fewer} discomfort than during my previous attempt, which was encouraging. I stopped when I reached the planned turning point rather than adding another loop.\n\nThe physiotherapist said the next stage {would depend|reported-speech|will depend} on how my leg responded. If the discomfort {returned|conditional|would return}, I could take another rest day and ask for advice. I recorded {a few details|article-missing|few details} about the run in my diary. Taking things slowly is frustrating, but finishing comfortably felt better than forcing a faster result.',
  },
  {
    id: 'b2-instructions-secure-notes', title: 'Protecting your notes', level: 'B2', format: 'instructions', topic: 'Technology',
    text: 'Before sharing {a set of notes|article-missing|set of notes}, check whether it contains private information. Access settings {should be reviewed|passive|should be review} each time you invite someone new. Give collaborators {a clear description|article-missing|clear description} of what they may edit. If you are unsure who {can currently see|word-order|can see currently} the file, open its sharing panel.\n\nAvoid {using|gerund-infinitive|to use} the same password across different accounts. A longer phrase can be {easier|comparative|more easier} to remember than a random string, but it still needs to be unique. There may be {fewer|quantifier|less} people with access than you expect; check rather than assuming. Keep a separate copy of important work in case something is deleted.\n\nThe support team said older links would stop working after permissions changed. If someone {needed|conditional|would need} continued access, you could send a new invitation. Review {the activity history|article-missing|activity history} when a document changes unexpectedly. These habits cannot prevent every problem, but they make it easier to understand what happened and recover your work.',
  },
  {
    id: 'b2-report-housing-feedback', title: 'Housing feedback', level: 'B2', format: 'report', topic: 'Home and Town',
    text: 'Residents completed {a housing survey|article-missing|housing survey} during the spring. Responses {were collected|passive|were collect} anonymously to encourage honest comments about shared areas. Most residents liked {the new entrance lighting|article-missing|new entrance lighting}, but several wanted better bicycle storage. We asked where {bicycles were usually kept|word-order|were bicycles usually kept} when the racks were full.\n\nMany people said they avoided {leaving|gerund-infinitive|to leave} bikes outside overnight. There was {less|quantifier|fewer} concern about the garden than in the previous survey, perhaps because it is now maintained regularly. The caretaker explained {clearly|word-form|clear} why an extra rack could not be placed near the fire exit. A different location beside the rear wall may be possible.\n\nThe housing officer said the suggestion would be reviewed at the next planning meeting. If that space {were approved|conditional|would be approved}, residents could use it without blocking the path. We recommend placing {a diagram|article-missing|diagram} in the entrance so people can comment on the proposed position. This would make the decision more transparent before any work begins.',
  },
  {
    id: 'b2-email-delayed-refund', title: 'A delayed refund', level: 'B2', format: 'email', topic: 'Shopping and Money',
    text: 'Dear customer service team, I am writing about {a refund|article-missing|refund} for an item I returned last month. The parcel {was delivered|passive|was deliver} to your returns centre, according to the tracking record. I have attached {a copy|article-missing|copy} of the receipt and the delivery confirmation. Could you tell me when {the refund will appear|word-order|will the refund appear} in my account?\n\nI understand that returns may take time to process. However, there has been {less|quantifier|fewer} communication than I expected since the parcel arrived. I tried contacting the help desk last week but received only an automatic reply. Please check the case {carefully|word-form|careful}, as the original payment was made with a card that remains active.\n\nYour representative said the payment would be issued within ten working days. If there {were a problem|conditional|would be a problem} with the return, I would appreciate an explanation and the steps needed to resolve it. Please send {a written update|article-missing|written update} when you have checked the record. Kind regards, Robin',
  },
  {
    id: 'b2-story-wildlife-pond', title: 'The new pond', level: 'B2', format: 'story', topic: 'Nature and Weather',
    text: 'A group of neighbours created {a small pond|article-missing|small pond} in the community garden. Its position {was chosen|passive|was choose} to receive morning light without becoming too hot in summer. They placed {a shallow stone|article-missing|shallow stone} near the edge so small animals could climb out. One child asked when {frogs might arrive|word-order|might frogs arrive}.\n\nThe gardener advised {waiting|gerund-infinitive|to wait} rather than bringing animals from somewhere else. She spoke {patiently|word-form|patient} about how long a healthy pond can take to develop. There was {less|quantifier|fewer} water in it after a dry week, so the group added collected rainwater. They also left nearby plants undisturbed.\n\nThe gardener said insects {would appear|reported-speech|will appear} before larger visitors. If the neighbours {kept|conditional|would keep} the water clean, the pond could become a useful habitat over time. By late summer, they noticed insects moving across {the surface|article-missing|surface}. Nobody had expected an immediate transformation, but even this small change made the garden feel more alive.',
  },
  {
    id: 'b2-notice-leisure-pool', title: 'Pool timetable changes', level: 'B2', format: 'notice', topic: 'Sport and Fitness',
    text: 'From Monday, {the public pool|article-missing|public pool} will close an hour earlier on weekday evenings. The timetable {has been adjusted|passive|has been adjust} while repairs are completed in the changing rooms. Please check {the revised schedule|article-missing|revised schedule} before travelling. Reception staff can explain where {the temporary entrance is|word-order|is the temporary entrance} for evening classes.\n\nMembers are asked to move {carefully|word-form|careful} through the corridor near the work area. We recommend {arriving|gerund-infinitive|to arrive} a little earlier, as there are {fewer|quantifier|less} changing spaces available. Lockers remain in use, but the showers beside the training pool are closed. Signs will direct visitors to the open facilities.\n\nThe manager said the work would finish before the end of next month. If repairs {took|conditional|would take} longer, members would receive another update. Please speak to {a member of staff|article-missing|member of staff} if you need help finding an accessible route. We apologise for the inconvenience and thank everyone for their patience during the repairs.',
  },
  {
    id: 'b2-article-listening-well', title: 'Listening well', level: 'B2', format: 'article', topic: 'People and Feelings',
    text: 'When a friend shares {a difficult experience|article-missing|difficult experience}, it can be tempting to offer an immediate solution. In a communication workshop, participants {were encouraged|passive|were encourage} to listen first and ask questions. They practised {a simple technique|article-missing|simple technique}: repeating the main concern in their own words before responding. This helped them check whether {they had understood|word-order|had they understood} correctly.\n\nSome participants found it hard to avoid {interrupting|gerund-infinitive|to interrupt} with their own stories. Others learnt to speak {gently|word-form|gentle} when they disagreed. There was {less|quantifier|fewer} pressure to fix every problem once they realised that being heard could itself be helpful. The exercises also showed that silence need not mean indifference.\n\nThe facilitator said these habits would take practice outside the workshop. If someone {needed|conditional|would need} practical help, a listener could still offer it after asking what would be useful. Participants took home {a short guide|article-missing|short guide} with example questions. The aim was not to follow a script, but to make room for another person\'s feelings.',
  },
  {
    id: 'b2-dialogue-weekend-chores', title: 'Sharing the chores', level: 'B2', format: 'dialogue', topic: 'Everyday Life',
    text: 'Maya: Have you seen {the cleaning schedule|article-missing|cleaning schedule} for this weekend?\nTheo: Yes, it {was posted|passive|was post} on the fridge yesterday.\nMaya: Do you know why {the tasks were changed|word-order|were the tasks changed}?\nTheo: Someone is away, so we need to share their jobs.\nMaya: I have {less|quantifier|fewer} time on Saturday than I expected.\nTheo: I do not mind {doing|gerund-infinitive|to do} the kitchen in the morning.\nMaya: Thanks. I can clean the hallway after lunch.\nTheo: Our neighbour said she would bring the supplies on Friday.\nMaya: If she {forgot|conditional|would forget}, we could use what is in the cupboard.\nTheo: Good point. I will check {the cupboard|article-missing|cupboard} tonight.\nMaya: Please write {a clear note|article-missing|clear note} if anything is missing.\nTheo: I will. Then everyone can see what still needs to be bought.',
  },
  // ───────────── Long reads (assistant batch 1, reviewed) ─────────────
  {
    id: 'b1-post-drums-at-3am',
    title: 'Drums at 3 a.m.',
    level: 'B1',
    format: 'post',
    topic: 'Home and Neighbours',
    situation: 'Your flatmate wrote this post for a local forum and asked you to check it before posting.',
    text: `Hi everyone. I {have lived|tense|live} in this building {for|since-for|since} three months, and until last week I {thought|past-irregular|thinked} it was the quietest place in the city. Then, last Tuesday, my new neighbour {moved|tense|has moved} in upstairs. {He|pronoun|Him} seems friendly, but he has one very {unusual|word-form|unusually} habit.
  
  At 3 a.m. on Wednesday I {woke|past-irregular|waked} up because someone was playing the drums. It was not {a gentle|article|an gentle} rhythm. It was a rock solo, and my bed was shaking {like|confusable|as} a washing machine. The noise was {louder|comparative|more loud} than a thunderstorm. My cat {was|agreement|were} hiding {under|preposition|at} the sofa, and I {lay|past-irregular|layed} awake, wondering what {to do|gerund-infinitive|doing}.
  
  On Thursday I {took|past-irregular|taked} a deep breath and knocked on his door. He was wearing pyjamas and holding {a pair of|article-missing|pair of} drumsticks, and he was so {friendly|word-form|friend} that I found it hard to be angry. He {told|confusable|said} me that his band has a concert {on|preposition|in} Saturday. I asked him {to practise|gerund-infinitive|practising} earlier in the day, and he promised to try.
  
  For two nights everything was {quiet|word-form|quietly}. Then, last night at 3 a.m., the drums started again! This time I {ran|past-irregular|runned} upstairs and banged on his door, which slowly opened. The flat was empty. On the floor was a speaker playing a recording of drums, with {a note|article-missing|note} next to it: "Sorry! My timer {is|agreement|are} wrong." Meanwhile, the old lady {who|pronoun|which} lives next door came out in her dressing gown and said she had been enjoying the "concerts" for a week.
  
  I have not slept properly {since|since-for|for} Wednesday, so I need {some advice|plural-uncountable|some advices}. If I {tell|conditional|will tell} him the truth, he will probably laugh. But he {should|modal|should to} know that {his|pronoun|him} speaker is ruining my nights, and I have already spent {much|quantifier|many} money on earplugs. Is it {better|comparative|more good} to wait until after his concert? What would you do?`,
  },
  {
    id: 'b1-chat-secret-party',
    title: 'Operation Dana',
    level: 'B1',
    format: 'chat',
    topic: 'Friends and Celebrations',
    situation: 'Your friend Mia sent you this group chat to check before she shows it to the whole class as a funny story.',
    text: `Mia: Okay team, listen carefully! Dana's birthday is {on|preposition|in} Saturday, and we {must|modal|must to} keep it a total secret.
  Tom: I {bought|past-irregular|buyed} the balloons yesterday. I {spent|past-irregular|spended} twenty pounds, so please be {grateful|word-form|gratefully}.
  Leo: Twenty pounds for air? Fine. I'll bring the music. I have {many|quantifier|much} good playlists, but Dana {hates|agreement|hate} loud songs.
  
  Anya: I ordered a chocolate cake from the bakery near the station. The lady {who|pronoun|which} works there asked what to write on it.
  Sam: Can someone tell me {where the party is|word-order|where is the party}? And what {time do we|word-order|time we do} meet?
  Mia: At my flat, of course! Please avoid {talking|gerund-infinitive|to talk} about it on the phone, everyone.
  Tom: I'll arrive from {Leeds|article-extra|the Leeds} at five, and I {might|modal|might to} be late.
  Mia: Please don't be late, Tom. The cake must be on the table at seven o'clock exactly!
  Leo: Don't worry, we will all be there before she arrives, and nobody will say a word.
  
  Leo: I {met|past-irregular|meeted} Dana in town today. She asked why I was smiling so {much|quantifier|many}.
  Sam: Bad news. I {left|past-irregular|leaved} my phone in Dana's car, and she {saw|past-irregular|seen} the cake photo.
  Mia: What?! What {did you tell|word-order|you told} her?
  Sam: I said it was {a present|article-missing|present} for my aunt. She believed me, {luckily|word-form|lucky}.
  Tom: Guys, another problem. Dana's mum called me. She wants {to bring|gerund-infinitive|bringing} a second cake!
  Leo: Two cakes? That's {more|comparative|most} than we need.
  Anya: Don't panic. If she {brings|conditional|will bring} another cake, we'll just eat both. I have some {information|plural-uncountable|informations} too: ours looks {amazing|word-form|amazingly}.
  
  Mia: Perfect! You are {the best|article-missing|best} team ever. Now, who will keep Dana busy {during|confusable|while} the afternoon?
  Sam: I can take her shopping. She never says no {to|preposition|for} shopping.
  Dana: Hi everyone! I {have been|tense|am} in this chat {since|since-for|for} Monday. Someone added me by mistake, and I love {your|pronoun|you} playlists.
  Dana: Don't worry, I'll act {surprised|word-form|surprising} on Saturday. Just one question: who is going to tell my mum that we already have a cake?`,
  },
  {
    id: 'b2-blog-leaning-cake',
    title: 'The Leaning Wedding Cake',
    level: 'B2',
    format: 'blog',
    topic: 'Family and Celebrations',
    situation: 'Your friend Ola wrote this blog post about her sister\'s wedding and asked you to check it before publishing.',
    text: `Three months ago my sister asked me {to make|gerund-infinitive|making} her wedding cake. It was {an honour|article|a honour} to be asked, but suddenly I was {responsible for|preposition|responsible of} the most important dessert of her life. I had never baked anything {more difficult|comparative|difficulter} than a banana loaf, but I {said|past-irregular|sayed} yes anyway. I watched {dozens|quantifier|dozen} of videos, bought a professional mixer, and {told|confusable|said} everyone that I was {confident|word-form|confidence}.
  
  Everything went wrong from the start. During the first weekend, my oven {broke|past-irregular|breaked} down halfway through the baking. My second attempt {was ruined|passive|ruined} when the dog jumped onto the table and {ate|past-irregular|eated} an entire layer. If I {had known|conditional|knew} how hard it would be, I would have ordered a cake from a shop. By Thursday I had {no|quantifier|none} time to start again, and I even considered {calling|gerund-infinitive|to call} a bakery. Instead, I {spent|past-irregular|spended} every evening that week {trying|gerund-infinitive|to try} to save my sister's wedding, working with {increasing|word-form|increase} panic.
  
  On Friday night I finally produced a four-layer tower. By midnight the tower {had been decorated|passive|had decorated} with sugar flowers. It leaned {slightly|word-form|slight}, though definitely {to the left|preposition|at the left}, like a very tired sandwich, and it was {edible|word-form|edibly}. Then I carried it to my car, {which|pronoun|what} was parked outside, and {drove|past-irregular|drived} at ten miles an hour. I {must have|modal|must had} been crazy to take a leaning tower across the city! The next morning my sister asked me {whether I had finished|word-order|whether had I finished} the decorations, and I said everything was under control.
  
  The wedding itself was beautiful, and the cake looked {surprisingly|word-form|surprising} good under the lights. At nine o'clock the guests {were served|passive|served} big slices, and everybody agreed it was delicious. Then {its|confusable|it's} top layer slowly slid off and landed in my uncle's lap. My uncle, who {was covered|passive|covered} in cream, said nothing, and for a second nobody moved. Then everybody {was|agreement|were} laughing, and later my sister and {I|pronoun|me} cried with laughter, while the photographer took {the best|article-missing|best} photo of the evening.
  
  My sister {has been telling|tense|is telling} this story {for|since-for|since} a month, and every time the cake gets taller. I have also received lots of {advice|plural-uncountable|advices} from readers about baking. If you {were|conditional|would be} me, would you ever try again?`,
  },
  {
    id: 'b2-interview-balloon-pilot',
    title: 'Landing Among Cows',
    level: 'B2',
    format: 'interview',
    topic: 'Jobs and Adventures',
    situation: 'You work for a student magazine and must check this interview with a balloon pilot before it is published.',
    text: `Interviewer: Ana, you {have been flying|tense|are flying} balloons {for|since-for|since} twelve years. How did it all begin?
  Ana: By accident, honestly. I {went|past-irregular|goed} to a village festival, {won|past-irregular|winned} a free flight in a raffle, and {fell|past-irregular|falled} in love with the silence up there. Before that, I worked in {an|article|a} office and hated every Monday. My friends {were|agreement|was} worried, and my mother asked {me|pronoun|I} whether I had lost my mind.
  
  Interviewer: What is the hardest part of {being|gerund-infinitive|be} a pilot?
  Ana: The weather, definitely. A balloon cannot be steered like a car. You choose the height, and the wind does the rest. That is why a pilot {is not allowed|passive|not allowed} to take off in strong wind, even when the passengers are {disappointed|word-form|disappoint}. I am responsible {for|preposition|of} everybody's safety, and it is {better|comparative|more good} to be safe on {the ground|article|a ground} than sorry in a tree.
  
  Interviewer: What was your scariest flight?
  Ana: Last summer the wind suddenly {became|past-irregular|becomed} much {stronger|comparative|more strong} than the forecast, and we {were forced|passive|forced} to land in a field full of cows. A farmer came running out of {his|pronoun|him} house. He asked us {what we were doing|word-order|what were we doing} on his land, and he wanted to know {why we had landed|word-order|why had we landed}. I expected him {to shout|gerund-infinitive|shouting}, but he laughed and invited us for breakfast. We ate eggs and toast while twenty cows stared {at|preposition|to} us. If we {hadn't landed|conditional|didn't land} there, we would never have become friends. Now he comes to every festival with {a basket|article-missing|basket} of apples.
  
  Interviewer: Do you ever feel afraid up there?
  Ana: Of course, but fear is {useful|word-form|use}. It reminds me {to check|gerund-infinitive|checking} the equipment twice. I have felt nervous {since|since-for|for} my very first flight, and nothing serious has ever {gone|past-irregular|went} wrong. I {must|modal|must to} respect the wind, because it never respects {me|pronoun|I}.
  
  Interviewer: Last question. If you {could|conditional|can} take anyone on a flight, who would you choose?
  Ana: My grandmother. She always {told|confusable|said} me that people were not made for the sky, and she has never {flown|past-irregular|flied}. If she ever {agrees|conditional|will agree}, the whole village will be {told|passive|telling} about it. Maybe next year I will finally {convince|word-form|convinced} her.`,
  },
  // ───────────── Long reads (batch 2: written and reviewed in the project) ─────────────
  {
    id: 'a2-message-neighbours-cat',
    title: 'The cat upstairs',
    level: 'A2',
    format: 'message',
    topic: 'Home and Neighbours',
    situation: 'Your friend Lena wrote this note to her new neighbour and asked you to check it before she puts it under the door.',
    text: `Hi Mrs Green,
  
  My name {is|agreement|are} Lena, and I live in the flat above yours. I {moved|tense|move} here two weeks ago, and I want to say sorry about something strange.
  
  Every evening {a grey cat|article-missing|grey cat} comes {to|preposition|at} my balcony. He is very {friendly|word-form|friend}, so I {gave|past-irregular|gived} him some milk and a little fish. Yesterday I {bought|past-irregular|buyed} a bag of cat food {for|preposition|to} him, because I {thought|past-irregular|thinked} he was {hungry|word-form|hunger} and alone.
  
  This morning I saw {the same|article|a same} cat in your window. Then I noticed {his|pronoun|him} blue collar with {a small bell|article-missing|small bell}. He is your cat! Now I understand why he {is|agreement|are} getting so fat. I am really sorry. I {didn't|tense|don't} know that he had a home.
  
  I have got a big bag of cat food and {nobody|quantifier|anybody} to give it to. Would you like {to have|gerund-infinitive|having} it? I can {bring|modal|to bring} it to your door this afternoon. If you {don't want|conditional|won't want} it, I will take it to the animal shelter {next to|preposition|next} the park.
  
  Also, I {would love|modal|would loved} to meet you properly. Do you {drink|agreement|drinks} coffee? My kitchen is small, but it is very {sunny|word-form|sun}, and your cat already {knows|agreement|know} the way!
  
  Best wishes,
  Lena (flat 6)`,
  },
  {
    id: 'b1-review-escape-room',
    title: 'The room we never left',
    level: 'B1',
    format: 'review',
    topic: 'Free Time',
    situation: 'Your classmate wrote this review for a booking website and asked you to check it before posting.',
    text: `Last Saturday my friends and I {went|past-irregular|goed} to "The Locked Library", a new escape room in the city centre. We {had booked|tense|have booked} a sixty-minute game, and the website promised {an exciting|article|a exciting} adventure "for clever readers only". We are all students of literature, so we {thought|past-irregular|thinked} it would be easy.
  
  The room looked amazing. There {were|agreement|was} old books everywhere, a huge wooden desk and a clock that ticked very loudly. Our task was to find a secret key before the librarian "came back". In the first ten minutes we {solved|tense|have solved} two puzzles and felt very proud of ourselves.
  
  Then everything changed. The third puzzle was a poem with {no|quantifier|any} clues at all. We read it again and again, but nobody {understood|past-irregular|understanded} it. Marco kept {reading|gerund-infinitive|to read} it aloud in a funny voice, and the clock seemed {louder|comparative|more loud} than before. Anna {was|agreement|were} sure that the answer was hidden in the first letters of each line, but it {wasn't|tense|isn't}.
  
  With five minutes left, we asked for {a hint|article-missing|hint}. A voice from the speaker told us {to look|gerund-infinitive|looking} under the desk. We {found|past-irregular|finded} a key there, but it did not open the door. It opened a small box with {another|article|an other} poem inside!
  
  In the end we did not escape. When the time was up, the manager came in and {told|confusable|said} us something terrible: the door had been unlocked {since|since-for|for} the beginning. We could {have walked|modal|walked} out at any moment, and nobody had even {tried|tense|try} the handle.
  
  Would I recommend it? Yes, {definitely|word-form|definite}. The puzzles are {more difficult|comparative|difficulter} than in other escape rooms, the decoration is beautiful, and the price is {reasonable|word-form|reason}. My only advice is this: if you {go|conditional|will go}, read every poem slowly, work as a team, and check the door first!`,
  },
  {
    id: 'b1-email-wrong-suitcase',
    title: 'Not my suitcase',
    level: 'B1',
    format: 'email',
    topic: 'Travel',
    situation: 'Your cousin wrote this email to an airline after a holiday and asked you to check it before sending.',
    text: `Dear Customer Service,
  
  I am writing about a problem {with|preposition|of} my luggage. On 14 July I {flew|past-irregular|flied} from Rome to Manchester on flight BA 2591, and I {picked up|tense|pick up} a black suitcase from the carousel. It looked {exactly|word-form|exact} like mine, so I {didn't|tense|don't} check the name tag.
  
  When I {got|past-irregular|getted} home and opened it, I had a big surprise. Instead {of|preposition|from} my clothes, there {were|agreement|was} twelve jars of honey, a pair of {enormous|word-form|enormously} boots and a very old camera. There was also {a letter|article-missing|letter} in Italian. I could understand only one sentence: "Please give this to my grandson."
  
  I feel {terrible|word-form|terribly} about this, because somebody {is|agreement|are} probably waiting for these things. I have not opened the jars, and everything {is|agreement|are} still in the suitcase. The owner's name on the tag is G. Rossi, and {there is|agreement|there are} a phone number, but nobody {answers|agreement|answer} it.
  
  I also need my own suitcase back as soon as {possible|word-form|possibly}. It is black with {a red ribbon|article-missing|red ribbon} on the handle, and inside there are my glasses, my work laptop and some important documents. I have to go back to work {on|preposition|in} Monday, so it is {quite|confusable|quiet} urgent.
  
  Could you please {tell|confusable|say} me what I should do? I would be happy {to bring|gerund-infinitive|bringing} the suitcase to the airport, or a driver could {collect|modal|to collect} it from my house. I am at home every afternoon this week.
  
  If Mr Rossi {has|conditional|will have} my suitcase, perhaps he is just as confused as I am. Please give him my phone number {too|confusable|to}. I am sure we can sort this out quickly.
  
  Thank you for your help. I look forward {to hearing|gerund-infinitive|to hear} from you.
  
  Yours faithfully,
  Daniel Brooks`,
  },
  {
    id: 'b2-column-month-without-car',
    title: 'Thirty days on two wheels',
    level: 'B2',
    format: 'column',
    topic: 'City Life',
    situation: 'Your friend writes a column for the local newspaper and asked you to check this week\'s piece before the editor sees it.',
    text: `When my car {broke|past-irregular|breaked} down in March, the mechanic told me it {would take|reported-speech|will take} a month to get the parts. My first reaction {was|agreement|were} panic. I {had been driving|tense|have been driving} to work every day for eleven years, and the idea of {taking|gerund-infinitive|take} the bus seemed impossible. My neighbour, who {cycles|agreement|cycle} everywhere, simply laughed and {lent|past-irregular|lended} me her old bike.
  
  The first week was a disaster. I arrived {at|preposition|to} the office wet, {exhausted|word-form|exhausting} and twenty minutes late, and my colleagues could hardly hide their smiles. If I {had checked|conditional|checked} the weather forecast, I would have taken a raincoat. I also {discovered|tense|have discovered} that our city {was designed|passive|designed} for cars, not people: the cycle lanes {suddenly|word-form|sudden} end in the middle of busy roads.
  
  By the second week, however, something {had changed|tense|has changed}. I noticed things I had never seen from behind the wheel: {a bakery|article-missing|bakery} that opens at six, a tiny park full of cherry trees, and an old man who {feeds|agreement|feed} the pigeons at exactly the same time {every|quantifier|all} morning. I was spending {less|quantifier|fewer} money on petrol and more on coffee and croissants.
  
  By the end of the month I was fitter than I {had been|tense|was being} for years, and I slept {better|comparative|more better} too. My doctor, who {had warned|tense|has warned} me {about|preposition|for} my blood pressure last winter, was {impressed|word-form|impressing} by the results.
  
  Last Friday the mechanic called to say that my car was ready. I was asked to pick it up before the weekend, but I have not {done|past-irregular|did} it yet. I am not sure I {want|agreement|wants} it back. Of course, cycling is not always {practical|word-form|practically}, especially with two children and {a weekly shop|article-missing|weekly shop} to carry.
  
  So here is my suggestion. If our council {built|conditional|would build} safer cycle lanes, many more people would leave {their|confusable|there} cars at home. Until then, I am going to keep riding — and I will buy a better raincoat.`,
  },
  {
    id: 'c1-blog-getting-lost',
    title: 'In praise of getting lost',
    level: 'C1',
    format: 'blog',
    topic: 'Travel and Technology',
    situation: 'A travel blogger you know asked you to proofread this post before it goes online.',
    text: `Last spring, on a trip to Lisbon, my phone {died|word-form|dead} on the very first morning. My charger {had been left|passive|had left} in a café at the airport, and every shop I tried {was|agreement|were} closed for a public holiday. {Never had I felt|word-order|Never I had felt} so helpless in a city: no map, no reviews, no blue dot {telling|gerund-infinitive|tells} me where I was.
  
  What followed, however, turned out to be the most {memorable|word-form|memorably} day of the whole holiday. Without directions, I had no choice but to wander. I climbed streets I would never {have chosen|modal|had chosen}, stopped in a square simply because I {heard|past-irregular|heared} music, and ended up {having|gerund-infinitive|to have} lunch in {a tiny restaurant|article-missing|tiny restaurant} with no sign on the door. The owner, {whose|pronoun|who's} English was even {worse|comparative|worser} than my Portuguese, cooked whatever she {had bought|tense|has bought} at the market that morning.
  
  Had I been {following|gerund-infinitive|follow} my phone, I would have eaten at one of the five "top-rated" places near the cathedral, along with a hundred other tourists {reading|gerund-infinitive|read} the same list. Navigation apps are {undeniably|word-form|undeniable} useful, but they are designed {to take|gerund-infinitive|taking} us to the places that other people have already approved. The more we {rely|agreement|relies} on them, the fewer surprises we allow ourselves.
  
  {Not only did I|word-order|Not only I did} find {the best|article|a best} grilled sardines of my life; I also had my first proper conversation in Portuguese. When I asked the owner for directions back to the hotel, she drew a map {on|preposition|in} a paper napkin and told me that the tram {would be|reported-speech|will be} packed by the time I reached the stop. It was. I {had to|modal|must} stand for forty minutes, squeezed {between|preposition|among} a cello and a basket of oranges.
  
  I am not suggesting that we {abandon|tense|will abandon} technology altogether. Yesterday I {was reminded|passive|reminded} how useful a map {can|modal|can to} be when my train {was cancelled|passive|cancelled} in the middle {of|preposition|from} nowhere. But I now leave my phone {in|preposition|at} my pocket for at least one afternoon on every trip. It is worth {getting|gerund-infinitive|to get} lost, as long as you are prepared to ask for help.
  
  If I {had not lost|conditional|did not lose} my charger that morning, I would have seen Lisbon — but I would never have met it.`,
  },
  {
    id: 'c1-story-museum-dark',
    title: 'The night the museum went dark',
    level: 'C1',
    format: 'story',
    topic: 'Culture',
    situation: 'Your friend entered a short-story competition and asked you to proofread the story before the deadline.',
    text: `The power {went|past-irregular|goed} off at exactly ten past nine, just as the last group of visitors {was being led|passive|was leading} through the Egyptian gallery. For a few seconds {nobody|quantifier|anybody} moved. Then a child {began|past-irregular|begun} to cry, and somewhere in the darkness a phone torch came on, {lighting|gerund-infinitive|lit} up a golden mask that seemed {to be staring|gerund-infinitive|be staring} straight at us.
  
  The guard, a tall man {whose|pronoun|which} name badge said Felix, calmly asked us {to stay|gerund-infinitive|staying} where we were. He explained that the emergency lights {should have switched|modal|should switched} on automatically and that he could not understand why they {had not|tense|have not}. Hardly {had he finished|word-order|he had finished} speaking when we heard a long, slow scratching sound coming {from|preposition|of} the far end of the room.
  
  {Nobody|quantifier|Anybody} said a word. My sister, who {is|agreement|are} usually the bravest person I know, grabbed my arm {so|confusable|such} hard that it {hurt|past-irregular|hurted}. The sound stopped, started again, and then {was followed|passive|followed} by a soft thud. Felix walked towards it with his torch, and we {reluctantly|word-form|reluctant} followed him, partly because nobody wanted {to be left|passive|to leave} alone in the dark.
  
  Behind a glass case we found the cause {of|preposition|for} the noise: a very small, very embarrassed cat, trying to climb into a basket of ancient bread. According to Felix, it {had been living|tense|has been living} in the museum's storeroom for weeks, and the staff had been trying to catch it since February. "We call her Cleopatra," he said. "She has {better|comparative|more better} taste than most of our visitors."
  
  When the lights finally came back on, the gallery looked {surprisingly|word-form|surprising} ordinary. The golden mask was just a mask again. Before we left, Felix told us that a team from the animal shelter {would come|reported-speech|will come} the following morning, and he asked us not {to mention|gerund-infinitive|mentioning} the cat on social media.
  
  I {kept|past-irregular|keeped} my promise for {a whole year|article-missing|whole year}. Then, last month, I {received|tense|have received} a postcard from the museum. On the front {was|agreement|were} a photograph of the Egyptian gallery, and in the corner, if you {look|conditional|will look} carefully, you can see a small grey shape sitting proudly on the edge of a sarcophagus. On the back, someone {had written|tense|has written} just three words: "She stayed. Felix."
  
  Had the power not failed that evening, I {would never have learnt|conditional|would never learn} that the most interesting thing in a museum is not always behind glass.`,
  },
  // ───────────── Batch 3: written and reviewed in the project ─────────────
  {
    id: 'a2-diary-wrong-class',
    title: 'The wrong class',
    level: 'A2',
    format: 'diary',
    topic: 'Sport and Free Time',
    situation: 'Your friend keeps an English diary for practice and asked you to check today\'s page.',
    text: `Monday, 6 October
  
  Today I {went|past-irregular|goed} to the new gym {near|preposition|near of} my office {for|preposition|at} the first time. I {wanted|tense|want} to lift weights, because my doctor says I {need|agreement|needs} more exercise. The woman at the desk {gave|past-irregular|gived} me a card and said, "Room 3, at seven o'clock."
  
  I {was|agreement|were} a bit nervous, so I arrived early. The room was big and {bright|word-form|brightly}, with mirrors {on|preposition|in} every wall, but there {were|agreement|was} no weights. Then twenty women in colourful clothes came in, and a young man {turned|tense|turns} on loud music. It was {a dance class|article-missing|dance class}!
  
  I wanted to leave, but the teacher smiled {at|preposition|to} me and {said|confusable|told}, "Welcome! Don't be shy." For an hour I jumped, turned and {fell|past-irregular|falled} over twice. Everybody {laughed|tense|laughs}, but in a friendly way. At the end, an old lady {told|confusable|said} me that I was {better|comparative|more good} than her husband.
  
  Now my legs hurt and I can't {walk|modal|to walk} properly. But I {have|tense|am having} a new plan. I {am going|tense|go} back on Wednesday, and this time I will bring {my|pronoun|me} sister. She loves dancing, and she says I will be the star of the class!`,
  },
  {
    id: 'a2-chat-pizza-for-twelve',
    title: 'Pizza for twelve',
    level: 'A2',
    format: 'chat',
    topic: 'Family and Food',
    situation: 'Your friend Ella wants to share her family\'s funny group chat in English class and asked you to check it first.',
    text: `Mum: Hi everyone! Dad {is|agreement|are} ordering pizza tonight. What do you {want|agreement|wants}?
  Tom: Pepperoni, please! And {some|quantifier|any} garlic bread.
  Ella: I {don't|agreement|doesn't} eat meat, remember? Can I have {the one|article|a one} with mushrooms?
  Grandma: I {would like|modal|would liked} a small one with tomatoes, please.
  Dad: OK. I {wrote|past-irregular|writed} everything down. The pizzas will arrive {at|preposition|in} seven.
  
  Tom: Dad, why {are there|word-order|there are} twelve boxes at the door??
  Dad: What? I {ordered|tense|order} four!
  Mum: You pressed "12", not "4". The driver {is|agreement|are} still {here|confusable|hear}. He {thinks|agreement|think} we are having a party.
  Ella: Well, we can {have|modal|having} one! Let's {invite|gerund-infinitive|inviting} the neighbours.
  Grandma: I can't eat three pizzas, but I {know|agreement|knows} who can.
  Tom: My friends {are coming|tense|come} in ten minutes.
  Mum: Good. And next time, Dad, please {read|agreement|reads} the order before you pay.
  Dad: Sorry! The good news is that we {got|past-irregular|getted} one pizza for free.
  Ella: That's {the best|comparative|the most good} mistake of the year!`,
  },
  {
    id: 'b1-application-festival',
    title: 'Forty cups of tea',
    level: 'B1',
    format: 'application',
    topic: 'Work and Volunteering',
    situation: 'Your friend Maya is applying to volunteer at a music festival and asked you to check her letter before she sends it.',
    text: `Dear Festival Team,
  
  I {am writing|tense|write} to apply for a volunteer place at this year's Green Fields Music Festival. I {saw|past-irregular|seen} your advertisement online last week, and I {have wanted|tense|want} to work at a festival {since|since-for|for} I was fifteen.
  
  I am twenty, and I study {music|article-extra|the music} at college. Last summer I worked in a busy café, so I am used {to talking|gerund-infinitive|to talk} to lots of people at once. I am also good {at|preposition|in} solving problems. Once, during a power cut, I {made|past-irregular|maked} forty cups of tea with one camping stove!
  
  I must be honest {about|preposition|for} one thing: I have never camped before. My parents {think|agreement|thinks} I will hate the mud. To prepare, I {spent|past-irregular|spended} a whole night in a tent in our garden. It {rained|tense|rains} all night, but I stayed completely dry.
  
  I would be happy {to help|gerund-infinitive|helping} at the information tent or in the recycling area. I don't mind {working|gerund-infinitive|to work} early in the morning or late at night, and I can work {an extra hour|article|a extra hour} every day if necessary. I speak English, Spanish and {a little|quantifier|a few} French.
  
  If you {need|conditional|will need} someone for the children's area, I {have|tense|am having} some experience. Last summer I {looked after|tense|look after} my three young cousins for two weeks, and they all survived.
  
  Please find my CV {attached|word-form|attaching}. Thank you {for|preposition|to} reading my application. I {look|agreement|looks} forward to hearing from you.
  
  Yours sincerely,
  Maya Lopez`,
  },
  {
    id: 'b2-speech-farewell-helen',
    title: 'Nine years next to Helen',
    level: 'B2',
    format: 'speech',
    topic: 'Work',
    situation: 'Your colleague Sam is giving a farewell speech tomorrow and asked you to check it tonight.',
    text: `Good evening, everyone. For those who {don't|agreement|doesn't} know me, I'm Sam, and I {have had|tense|had} the pleasure of {sitting|gerund-infinitive|sit} next to Helen for the last nine years. When I {was asked|passive|asked} to give this speech, I said yes {immediately|word-form|immediate} — and then I {panicked|tense|panic}.
  
  How do you sum up nine years in five minutes? Helen {joined|tense|has joined} the company {in|preposition|on} 2016, when we {were|agreement|was} still a team of six people in a room above a bakery. The smell of fresh bread {made|tense|makes} it almost impossible to concentrate, but Helen somehow {managed|tense|manages} to finish every project before the deadline. She {taught|past-irregular|teached} more than thirty new colleagues, including me.
  
  On my first day, I {accidentally|word-form|accidental} deleted the client database. Instead of {shouting|gerund-infinitive|shout} at me, she made two cups of tea and said, "Right. Let's fix it." If she {hadn't helped|conditional|didn't help} me that day, I would have been fired within a week.
  
  Helen is the most {patient|word-form|patience} person I have ever worked with, but she is also {surprisingly|word-form|surprising} competitive. Anyone who has played table tennis with her at the Christmas party knows exactly what I {mean|agreement|means}.
  
  Next month Helen and her husband are moving to Portugal, where they {are going to|tense|are going} open a small guesthouse by the sea. She {has been learning|tense|is learning} Portuguese {for|since-for|since} two years, and she tells me she can already order coffee without {pointing|gerund-infinitive|to point}.
  
  We will miss {her|pronoun|she} calm voice, her terrible jokes and {the|article|a} chocolate biscuits she hides in her top drawer. The office will not be {the same|article|same} without you, Helen.
  
  So please raise your glasses. To Helen — {may|modal|might} the guesthouse always be full, and may the guests never {find|agreement|finds} the chocolate!`,
  },
  {
    id: 'c1-column-five-stars',
    title: 'The tyranny of five stars',
    level: 'C1',
    format: 'column',
    topic: 'Society and Technology',
    situation: 'A journalist friend asked you to proofread her weekly column before it goes to print.',
    text: `Last week I {spent|past-irregular|spended} forty minutes {choosing|gerund-infinitive|to choose} a toaster. Not because toasters are {complicated|word-form|complicating}, but because I made the mistake of {reading|gerund-infinitive|to read} the reviews. {Seldom have I seen|word-order|Seldom I have seen} such passion {devoted|word-form|devoting} to a kitchen appliance. One customer described it as "life-changing"; another, {whose|pronoun|who's} toast had apparently {caught|past-irregular|catched} fire, {gave|past-irregular|gived} it {a single star|article-missing|single star} and a paragraph of capital letters.
  
  We have become a society of reviewers. Every taxi ride, hotel room and dental appointment {is|agreement|are} now followed by a polite request to rate our experience, and many of us feel strangely {guilty|word-form|guiltily} if we {ignore|conditional|will ignore} it. Restaurants {are judged|passive|judge} not only by the food they serve but by how many stars they {can|modal|can to} collect, and a single angry review, {written|passive|writing} in thirty seconds, can {cost|modal|costs} a small business months {of|preposition|for} income.
  
  The problem is not that reviews {exist|agreement|exists}. They are, without {doubt|plural-uncountable|doubts}, useful. The problem is that they have quietly replaced {our own|pronoun|ours own} judgement. Had I trusted my instincts, I {would have bought|conditional|would buy} the {cheapest|comparative|most cheap} toaster in the shop and {been|tense|be} perfectly happy. Instead, I read two hundred opinions by strangers whose expectations I knew {nothing|quantifier|anything} about.
  
  There is also something {odd|word-form|oddly} about the scale itself. On most platforms, anything below four stars {is seen|passive|sees} as a failure, which means that a perfectly decent meal {is described|passive|describes} as "disappointing" by people who simply {forgot|past-irregular|forgetted} to award the fifth star. If ratings {were treated|conditional|would be treated} as honest information rather than as tips, they would be far {more useful|comparative|usefuller}.
  
  So I {have decided|tense|am deciding} on an experiment. For one month, I will not read {a single review|article-missing|single review} before buying anything, booking anywhere or eating anywhere. {Not only will I save|word-order|Not only I will save} time; I suspect I will also make {a few|quantifier|a little} interesting mistakes. My friends {have warned|agreement|has warned} me that I will end up in terrible restaurants, and they may well be right.
  
  But if the worst that can happen {is|agreement|are} a slightly burnt slice of toast, I am prepared {to take|gerund-infinitive|taking} the risk.`,
  },
  {
    id: 'c1-interview-lighthouse-keeper',
    title: 'The last keeper',
    level: 'C1',
    format: 'interview',
    topic: 'Jobs and History',
    situation: 'You help edit a local history magazine and must proofread this interview before it is printed.',
    text: `Interviewer: Mr Hale, you {were|agreement|was} the last keeper of the North Point lighthouse. How long {did you live|word-order|you lived} there?
  Hale: Twenty-two years. I arrived {in|preposition|at} 1984, a year after my father {had retired|tense|has retired} from the same job, and I stayed until the light {was automated|passive|automated} in 2006. People often ask {whether I was|word-order|whether was I} lonely. Honestly, I was too busy {to be|gerund-infinitive|being} lonely.
  
  Interviewer: What did a typical day {look|tense|looked} like?
  Hale: There was no such thing as {a typical day|article-missing|typical day}. In calm weather I painted, {repaired|tense|have repaired} the generator and cleaned the lens, {which|pronoun|what} had to {be polished|passive|polish} every single morning. In a storm, I {hardly|word-form|hard} slept at all. {Rarely did a winter pass|word-order|Rarely a winter passed} without at least one ship {asking|gerund-infinitive|asks} for help on the radio.
  
  Interviewer: Were you ever afraid?
  Hale: Only once. In 1991 a wave {broke|past-irregular|breaked} a window {on|preposition|at} the second floor, and the whole tower seemed {to shake|gerund-infinitive|shake}. I remember {thinking|gerund-infinitive|to think} that if the glass at the top {had cracked|conditional|cracked}, the light would have gone out, and nobody would {have been warned|passive|have warned} about the rocks. I {spent|past-irregular|spended} the night {holding|gerund-infinitive|to hold} a torch in the lantern room, just in case.
  
  Interviewer: How did you feel when the lighthouse was automated?
  Hale: Relieved and heartbroken {at|preposition|in} the same time. The engineers who installed the new system told me it would need {checking|gerund-infinitive|to check} only twice a year, and they were right. A machine {does|agreement|do} the job perfectly well. But a machine doesn't {notice|agreement|notices} that a fishing boat is late, or that the birds have gone quiet before a storm.
  
  Interviewer: Do you still visit?
  Hale: Every summer. The building {has been turned|passive|has turned} into a small museum, and I am occasionally {asked|passive|asking} to give tours. Children always {want|agreement|wants} to know where {I slept|word-order|did I sleep} and what I ate. Visitors are rarely {interested|word-form|interesting} in the lens, which is a pity, because it is {the most beautiful|comparative|the beautifullest} object I have ever looked after.
  
  Interviewer: Would you do it all again?
  Hale: Without {hesitation|plural-uncountable|hesitations}. {Had I been offered|passive|Had I offered} a quieter life, I would {have refused|conditional|refuse} it.`,
  },
  // ───────────── Batch 4: A2 and C1, written and reviewed in the project ─────────────
  {
    id: 'a2-email-found-dog',
    title: 'Is this your dog?',
    level: 'A2',
    format: 'email',
    topic: 'Home and Neighbours',
    situation: 'Your neighbour Sarah found a lost dog and asked you to check her email to the owner.',
    text: `Dear Mr Patel,
  
  I {found|past-irregular|finded} your phone number on the collar of a small brown dog. He {was|agreement|were} in our garden this morning, sitting under the apple tree. I think {his|pronoun|him} name is Biscuit, because he {comes|agreement|come} when I say it.
  
  He is very {friendly|word-form|friend}, and he is not hurt. He {ate|past-irregular|eated} a {whole|word-form|wholly} bowl of chicken and then {slept|past-irregular|sleeped} on my sofa for two hours. My cat is not very happy {about|preposition|of} this!
  
  I {called|tense|call} you twice today, but nobody {answered|tense|answers}. Maybe you {are|agreement|is} at work. We live {at|preposition|in} 14 Mill Lane, near {the old church|article-missing|old church}. I am at home {every|quantifier|all} evening, so you can {come|modal|to come} any time after six.
  
  If you {don't|agreement|doesn't} have a car, I can bring Biscuit to you. My son wants {to keep|gerund-infinitive|keeping} him, but I {told|confusable|said} him that Biscuit already has a family.
  
  Please call me on this number: 07700 900123.
  
  Best wishes,
  Sarah Jones
  
  P.S. He {doesn't|agreement|don't} like the rain!`,
  },
  {
    id: 'a2-review-seven-floors',
    title: 'Seven floors and no lift',
    level: 'A2',
    format: 'review',
    topic: 'Travel',
    situation: 'Your aunt wrote this hotel review in English and asked you to check it before she posts it.',
    text: `We {stayed|tense|stay} at the Sea View Hotel for three nights {in|preposition|on} August. The hotel {is|agreement|are} right next {to|preposition|of} the beach, and the view from our room was {beautiful|word-form|beautifully}.
  
  But there was one big problem. Our room {was|agreement|were} on the seventh floor, and the lift {didn't|tense|doesn't} work for the whole week. Every day we {carried|tense|carry} our bags, our beach chairs and {a big umbrella|article-missing|big umbrella} up 140 stairs. My husband said it was {better|comparative|more good} than the gym.
  
  The breakfast was {delicious|word-form|deliciously}, with fresh bread, eggs and {lots of|quantifier|many of} fruit. The young man at reception {was|agreement|were} very kind. He {brought|past-irregular|bringed} us cold water every evening and {said|confusable|told} sorry many times.
  
  On our last day, the lift {started|tense|starts} working again. We were so {happy|word-form|happily} that we rode up and down three times!
  
  Would I go back? Yes, but I {would ask|modal|would asked} for a room on the first floor. If you {have|conditional|will have} bad knees, please check the lift before you book. Four stars, because the view {is|agreement|are} worth every step.`,
  },
  {
    id: 'a2-post-missing-bike',
    title: 'Who took my bike?',
    level: 'A2',
    format: 'post',
    topic: 'Town and Neighbours',
    situation: 'Your brother wrote this post for the local neighbours\' group and asked you to check it.',
    text: `Help! Somebody {stole|past-irregular|stealed} my bike yesterday.
  
  It is {a red bike|article-missing|red bike} with a black basket and a small bell. I {left|past-irregular|leaved} it outside the supermarket on Station Road {at|preposition|in} about five o'clock. I {went|past-irregular|goed} inside for ten minutes, and when I came out, it {wasn't|tense|isn't} there.
  
  I {have had|tense|have} this bike for six years. My grandfather {gave|past-irregular|gived} it to me, so it is very {special|word-form|specially} to me. I {looked|tense|look} everywhere: in the park, behind the bus station and near the school. I also {asked|tense|ask} the people in the supermarket, but nobody {saw|past-irregular|seen} anything.
  
  If you {see|conditional|will see} it, please send me a message. I will give {you|pronoun|your} a box of chocolates!
  
  UPDATE: I {found|past-irregular|finded} my bike! It was outside the other supermarket, the one on Park Street. I {am|agreement|is} so sorry, everyone. I forgot that I {went|tense|go} to the other shop first. Thank you all for {your|pronoun|you} help — and the chocolates {are|agreement|is} for me now!`,
  },
  {
    id: 'c1-report-four-day-week',
    title: 'The four-day week: three months on',
    level: 'C1',
    format: 'report',
    topic: 'Work',
    situation: 'Your manager wrote this report for the board and asked you to proofread it before the meeting.',
    text: `In March our company began {a three-month trial|article-missing|three-month trial} of a four-day working week. Employees continued {to receive ; receiving|gerund-infinitive|receive} their full salary but {were expected|passive|expected} to complete their work in thirty-two hours rather than forty. This report {summarises|agreement|summarise} the results and {makes|agreement|make} a recommendation.
  
  Productivity. Contrary {to|preposition|with} what many managers {had predicted|tense|have predicted}, output did not {fall|tense|fell}. In fact, the number of customer requests handled per week {rose|past-irregular|rised} slightly, and the sales team closed {more|comparative|most} contracts in May than in {any|quantifier|some} previous month. Several employees reported that meetings had become {noticeably|word-form|noticeable} shorter, as nobody wanted {to waste|gerund-infinitive|wasting} the limited time available.
  
  Wellbeing. Of the 140 employees who completed our survey, 82 per cent said they felt {less|comparative|fewer} tired, and sick leave {fell|past-irregular|fallen} by almost a third. However, not everyone {benefited|agreement|benefit} equally. {A number of|quantifier|An amount of} parents pointed out that their children's schools {were|agreement|was} still open on Fridays, which meant that the extra day off {was spent|passive|spent} on housework rather than rest.
  
  Problems. The customer service department found the change {the hardest|comparative|the most hard}. Since customers {expect|agreement|expects} help five days a week, the team had to {be divided|passive|divide} into two groups, and some clients complained that they could not reach the person they usually {dealt|past-irregular|dealed} with. {Had we planned|conditional|If we would have planned} the rota more carefully from the start, most of these complaints {could have been avoided|passive|could have avoided}.
  
  Recommendation. On balance, the trial {has been|tense|was being} a success. We therefore recommend that the four-day week {be made ; is made|passive|make} permanent, on two conditions: that each department designs its own schedule, and that the results {are reviewed ; be reviewed|passive|review} again in twelve months. {Under no circumstances should employees|word-order|Under no circumstances employees should} be expected {to work|gerund-infinitive|working} longer days to make up {for|preposition|of} the lost time, as this would {undermine|modal|undermines} the purpose of the scheme.`,
  },
  {
    id: 'c1-review-novel-backwards',
    title: 'A life told backwards',
    level: 'C1',
    format: 'review',
    topic: 'Books and Culture',
    situation: 'A friend writes book reviews for a student magazine and asked you to proofread this one.',
    text: `{Few|quantifier|A few} debut novels {have divided|agreement|has divided} readers as sharply as Clara Venn's The Hours Before. {Told|passive|Telling} entirely in reverse, it begins with {its|confusable|it's} narrator's funeral and ends, three hundred pages later, {on|preposition|in} the morning of her birth. It is {an ambitious idea|article|a ambitious idea}, and for the first hundred pages it works {remarkably|word-form|remarkable} well.
  
  Venn writes with a precision that {is|agreement|are} rare in first novels. Each chapter {is set|passive|sets} a few months {earlier|comparative|more early} than the one before, so the reader constantly learns why things happened only after {seeing|gerund-infinitive|to see} their consequences. A broken friendship in chapter two {is explained|passive|explains} in chapter nine; a mysterious scar is finally {accounted for|preposition|accounted} in the book's last pages. {Rarely has a plot device been used|word-order|Rarely a plot device has been used} so effectively to create suspense.
  
  The problem is that the technique gradually {becomes|agreement|become} exhausting. By the middle of the novel, I found myself {checking|gerund-infinitive|to check} dates at the top of each chapter rather than paying attention to the characters. Some of the minor figures, who {appear|agreement|appears} only once or twice, are so {thinly|word-form|thin} drawn that it is hard to care what happens {to|preposition|with} them.
  
  The prose, however, {deserves|agreement|deserve} nothing but praise. Venn has an {extraordinary|word-form|extraordinarily} ear for dialogue, particularly in the scenes {between|preposition|among} the narrator and her elderly father, {whose|pronoun|who's} memory is failing. {Had the whole book been written|passive|Had the whole book written} with the same tenderness, it {would have been|conditional|would be} a masterpiece.
  
  Should you read it? If you {enjoy|conditional|will enjoy} puzzles and are prepared {to work|gerund-infinitive|working} hard, almost certainly. If, on the other hand, you want a story that simply {carries|agreement|carry} you along, you may find it more frustrating {than|confusable|then} rewarding. Either way, Venn is a writer {to watch|gerund-infinitive|watching}, and I suspect her second novel will be {considerably|word-form|considerable} more confident.`,
  },
  {
    id: 'c1-story-late-letter',
    title: 'Forty-three years late',
    level: 'C1',
    format: 'story',
    topic: 'People and Memories',
    situation: 'Your friend wants to send this true story to a magazine and asked you to proofread it.',
    text: `The envelope {was|agreement|were} yellow with age, and the stamp showed a queen who had not been on a stamp for decades. It arrived {on|preposition|in} a Tuesday, wedged {between|preposition|among} a gas bill and a pizza menu, {addressed|passive|addressing} to someone called Margaret Ellis at our flat.
  
  I would probably {have thrown|conditional|throw} it away {had my neighbour not stopped|conditional|if my neighbour did not stop} me on the stairs. Mrs Okafor, who {has lived|tense|lives} in the building since 1979, recognised the name at once. Margaret, she told me, {had rented|tense|has rented} my flat when she was {a young nurse|article-missing|young nurse}, and had left {suddenly|word-form|sudden} one winter without {telling|gerund-infinitive|to tell} anyone where she was going.
  
  {Curiosity|article-extra|The curiosity} got the better of me. Although I knew I should not {open|modal|to open} other people's post, I persuaded myself that, after forty-three years, nobody would mind. Inside {was|agreement|were} a single page in neat blue {handwriting|plural-uncountable|handwritings}. It was from a man called Daniel, who {apologised|tense|apologises} for {missing|gerund-infinitive|to miss} their meeting at the station and begged Margaret {to give|gerund-infinitive|giving} him one more chance. He {would be|reported-speech|will be} waiting, he wrote, under the clock at noon on the following Saturday.
  
  {Not until I had read it three times did I notice|word-order|Not until I had read it three times I noticed} the date: 12 February 1981. The letter had clearly {been lost|passive|lost} somewhere in the postal system, and Margaret had never {received|tense|receive} it. {Had it arrived|conditional|If it arrived} on time, her whole life {might have been|modal|might be} different.
  
  It took me two months {to find|gerund-infinitive|finding} her. Thanks {to|preposition|for} a hospital newsletter and {a great deal of|quantifier|a great many} patience, I eventually {traced|tense|have traced} her to a care home {on|preposition|in} the coast. When I {handed|tense|hand} her the envelope, she read it in silence, then laughed until she {had to|modal|must} wipe her eyes.
  
  "He found me anyway," she said. "Three years later, in a bookshop." She folded the letter {carefully|word-form|careful} and asked me {to stay|gerund-infinitive|staying} for tea.`,
  },
]
