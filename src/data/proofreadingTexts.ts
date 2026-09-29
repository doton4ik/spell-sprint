// Texts for the Proofreading mode. Each text is stored CORRECT; {correct|type|wrong} marks a place
// where the program may put a mistake. Several correct or wrong variants are separated by " ; ".
// A missing word is a wrong variant without it ({a car|article-missing|car}), an extra word is a
// wrong variant with it ({London|article-extra|the London}). Spelling mistakes are added
// automatically and are not marked. Full format: see the content brief.

export type ProofreadingLevel = 'A2' | 'B1' | 'B2' | 'C1'
export type ProofreadingFormat = 'email' | 'message' | 'story' | 'notice' | 'article' | 'dialogue' | 'review' | 'diary' | 'instructions' | 'report'
export type ProofreadingText = { id: string; title: string; level: ProofreadingLevel; format: ProofreadingFormat; topic: string; text: string }

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
]
