import type { LevelItem, LevelPassage } from './levelCheckBank'
import { reading } from './levelCheckDeep'

// Reading for the level check, second set (written 15 Oct 2026): dialogues, a letter, a notice, a story and short articles.
// The questions ask for meaning, not for a phrase to find in the text: how someone feels, what is meant but not said,
// why someone says something, what the writer thinks, which statement is NOT true. The right answer is a paraphrase, never a
// copy of the text, and the wrong options are true in the text but do not answer the question, or go too far.
// The levels are the author's judgement, not calibrated on learners; when unsure, the level is the lower one.
// A line of a dialogue starts with the speaker's name and a colon; \n starts a new line on the page.
const lines = (...rows: string[]) => rows.join('\n')

export const meaningPassages: LevelPassage[] = [
  {
    id: 'cinema-plan',
    level: 1,
    title: 'Plans for Saturday',
    text: lines(
      'Sam: Are you busy on Saturday?',
      'Lena: I have to work until one o’clock. Why?',
      'Sam: There is a new film at the cinema. I thought we could go together.',
      'Lena: I’d love to, but I don’t like evening films. I get tired.',
      'Sam: No problem. There is also a show at three o’clock.',
      'Lena: That’s perfect. Let’s meet outside the cinema at half past two.',
      'Sam: Great. I’ll buy the tickets.',
    ),
  },
  {
    id: 'lost-key',
    level: 1,
    title: 'A lost key',
    text: lines(
      'Mr Brown: Excuse me, I can’t find my key. I think I left it in the room.',
      'Receptionist: Which room is it?',
      'Mr Brown: Number twelve, on the second floor.',
      'Receptionist: Don’t worry. I have a second key. I’ll come up with you.',
      'Mr Brown: Thank you. This is the second time this week!',
      'Receptionist: It happens. Next time, please leave the key at the desk when you go out.',
    ),
  },
  {
    id: 'flat-rota',
    level: 2,
    title: 'Whose turn is it?',
    text: lines(
      'Maya: Have you seen the kitchen? Someone has left the dishes again.',
      'Ravi: Don’t look at me. I’ve been at the office until nine every night this week.',
      'Maya: I’m not blaming you. It’s just that I did the shopping and the bins, and nobody even said thank you.',
      'Ravi: Fair enough. Look, why don’t we make a rota? Then everyone knows whose turn it is.',
      'Maya: A rota? We’re not at school, Ravi.',
      'Ravi: No, but it would stop us arguing about it. I’ll draw one tonight.',
      'Maya: Fine. But I’m not doing Sundays.',
    ),
  },
  {
    id: 'restaurant-letter',
    level: 2,
    title: 'A letter to a restaurant',
    text: lines(
      'Dear Mr Evans,',
      'I am writing about my visit to your restaurant last Friday. We had booked a table for eight o’clock for my parents’ anniversary, but we were not seated until half past nine. Nobody told us about the delay, and when I asked at the desk, the waiter simply said it was “a busy night”. The food, once it arrived, was excellent, and the staff at our table were very kind. However, I felt that we deserved an apology. I would be grateful if you could look into how bookings are managed. I do not expect a refund, but I hope this will not happen to other customers.',
      'Yours sincerely,',
      'Helen Carter',
    ),
  },
  {
    id: 'pool-notice',
    level: 2,
    title: 'Notice to members',
    text: 'Because of repair work, the swimming pool will be closed from Monday 3rd to Friday 14th. The gym and the sauna will stay open as usual, but the changing rooms will be shared, so members are asked to bring a lock for their lockers. Anyone who has a ticket for the pool will be able to use it after the pool reopens, as all tickets will be extended by two weeks. Members who would like to swim in the meantime may use the town pool on Park Road at a reduced price, on showing their membership card.',
  },
  {
    id: 'bus-canary',
    level: 2,
    title: 'The bird on the bus',
    text: 'Julia was still angry when she got on the bus. She had waited for twenty minutes in the rain, and now the only free seat was next to a man with a large cage on his knees. Inside the cage, a small grey bird was singing. Julia sat down with a sigh. By the third stop, however, she had stopped checking her phone. “It’s a canary,” the man explained. “He sings best when it’s raining.” Julia laughed for the first time that day, and when the man got off, she realised she had missed her own stop.',
  },
  {
    id: 'late-report',
    level: 3,
    title: 'A word with the manager',
    text: lines(
      'Karen: Thanks for coming in, Dev. I wanted to talk about the Harlow report.',
      'Dev: Is something wrong with it?',
      'Karen: Not wrong, exactly. The figures are solid, and the client has already said how thorough it is. What worries me is that it arrived two days late again.',
      'Dev: I did warn you the data was slow to come in.',
      'Karen: You did, and I appreciate that. But a warning on the day isn’t the same as a conversation a week before. If you had told me earlier, I could have asked the client for more time.',
      'Dev: I suppose I was hoping I could catch up.',
      'Karen: That’s the part I’d like to change. Next time, flag it early, even if it feels like admitting a problem.',
    ),
  },
  {
    id: 'museum-screens',
    level: 3,
    title: 'Dinosaurs and screens',
    text: 'When the city museum announced that it would replace its dinosaur skeleton with an interactive display, the reaction was predictable. Letters to the local paper accused the museum of “dumbing down”. Yet the visitor figures tell a different story. Since the new gallery opened, attendance among teenagers has more than doubled, and teachers report that pupils come back to class asking questions rather than simply remembering the exhibits. The curator admits she was nervous: “People assume that touching a screen means thinking less. In our experience the opposite is true, provided the screen asks something of you.” Not everyone is convinced. One retired geologist told us he still misses the skeleton, though he conceded that his grandchildren have never asked so many questions about rocks.',
  },
  {
    id: 'plants-request',
    level: 3,
    title: 'A favour',
    text: lines(
      'Tom: Hi, Priya. I hope I’m not disturbing you. I was wondering whether you could possibly water my plants next weekend.',
      'Priya: Next weekend? Oh. Let me think. I’m not sure what my plans are yet.',
      'Tom: No pressure at all. It’s only for two days.',
      'Priya: It’s just that my sister might be visiting, and the last time she came, I hardly had a minute to myself.',
      'Tom: Of course, I understand. I’ll ask Mrs Hall downstairs instead.',
      'Priya: Sorry, Tom. If anything changes, I’ll let you know.',
    ),
  },
  {
    id: 'commuters',
    level: 3,
    title: 'Reading on the train',
    text: 'A survey of five thousand commuters found that those who read during their journey reported lower stress than those who listened to music or scrolled through their phones. The researchers caution against drawing firm conclusions. People who choose to read may already be calmer, or may simply have a seat, which is not true for everyone on a crowded train. Still, the authors suggest that the habit of turning attention to a single, absorbing task may help. “It isn’t the book itself,” said the lead researcher. “It’s the fact that you stop reacting to every notification.”',
  },
  {
    id: 'high-street',
    level: 4,
    title: 'The high street',
    text: 'It has become fashionable to lament that our high streets are dying, as though shops were living creatures and their closure a kind of bereavement. Nostalgia is cheap, and it flatters those who indulge in it: it allows us to mourn the greengrocer we never actually used. The uncomfortable truth is that the high street thrived because it served a purpose that has since been taken over by the internet. Councils that respond by pouring money into pedestrianisation and festivals are treating a symptom. What towns need is not a revival of the past, but a plausible answer to the question of why anyone would come at all. Some are finding it in unglamorous places: a library with a good café, a repair shop, a market that opens in the evenings. None of these will restore the old order, and it would be a mistake to expect them to.',
  },
  {
    id: 'deadline-talk',
    level: 4,
    title: 'The timeline',
    text: lines(
      'Marta: I take your point about the timeline, but I’d be failing the team if I agreed to it without some concessions.',
      'Lucas: Concessions? The client has already moved the deadline once, and I’d hardly call that inflexible.',
      'Marta: Moved it by three days, yes. Which, given the scope, amounts to very little.',
      'Lucas: So what would satisfy you?',
      'Marta: Two more people, or a smaller first release. I’d honestly prefer the second; it’s easier to justify to management.',
      'Lucas: You’re assuming the client will see a smaller release as progress rather than a retreat.',
      'Marta: And you’re assuming they won’t. That’s precisely why we should put it to them rather than guess.',
    ),
  },
  {
    id: 'forgetting',
    level: 4,
    title: 'In defence of forgetting',
    text: 'We tend to treat forgetting as a failure of memory, yet some psychologists argue that it is among memory’s most useful features. A system that retained every detail with equal clarity would be hopelessly cluttered, unable to distinguish the significant from the trivial. Forgetting, on this view, is less like losing a file than like clearing a desk: what remains is what is likely to be needed again. The argument has limits, of course. It does not explain why distressing memories can persist for years, nor why trivial ones, such as a jingle or a stranger’s phone number, sometimes refuse to fade. Its defenders concede both points, but maintain that no theory of memory can be judged by its exceptions alone.',
  },
]

export const meaningItems: LevelItem[] = [
  ...reading('cinema-plan', 1, [
    [
      'Why does Lena prefer the afternoon show?',
      'She gets tired in the evening',
      ['She works all day', 'She does not like films', 'The cinema closes early'],
      'She says she gets tired in the evening.',
    ],
    [
      'What does Lena mean when she says “That’s perfect”?',
      'The three o’clock show suits her',
      ['She wants a longer film', 'She is already at the cinema', 'She does not want to go'],
      'Perfect shows the afternoon show fits her plans.',
    ],
    [
      'What will Sam do?',
      'Buy the tickets',
      ['Finish work early', 'Call the cinema', 'Choose a different film'],
      'Sam says he will buy the tickets.',
    ],
  ]),
  ...reading('lost-key', 1, [
    [
      'What is Mr Brown’s problem?',
      'He cannot find his key',
      ['His room is too small', 'He is on the wrong floor', 'He has no money'],
      'He says he cannot find his key.',
    ],
    [
      'What does “This is the second time this week” show?',
      'He has had the same problem before',
      ['The hotel has too few keys', 'Mr Brown has stayed for two weeks', 'Mr Brown dislikes room twelve'],
      'It has already happened twice this week.',
    ],
    [
      'What does the receptionist advise?',
      'Leave the key at the desk when going out',
      ['Keep a second key in the room', 'Move to a different floor', 'Ask for a bigger room'],
      'She asks him to leave the key at the desk.',
    ],
  ]),
  ...reading('flat-rota', 2, [
    [
      'How does Maya feel at the start of the conversation?',
      'Annoyed that she does more than the others',
      ['Worried about being late for work', 'Pleased with how the flat looks', 'Angry with Ravi in particular'],
      'She says she is not blaming Ravi, but she does more work.',
    ],
    [
      'Why does Ravi suggest a rota?',
      'To stop arguments about whose turn it is',
      ['Because he is busy at the office', 'To teach the others a lesson', 'Because Maya asked him for one'],
      'He says it would stop them arguing about it.',
    ],
    [
      'What does Maya mean by “We’re not at school”?',
      'A rota seems childish to her',
      ['She wants to go back to school', 'The flat is far from a school', 'She has no time to read'],
      'She finds the idea of a rota too childish.',
    ],
  ]),
  ...reading('restaurant-letter', 2, [
    [
      'Why is Helen writing?',
      'To report a problem and ask for an apology',
      ['To complain about the food', 'To thank the staff for their kindness', 'To book a table for another date'],
      'She wants an apology and better bookings, not a refund.',
    ],
    [
      'What does the waiter’s reply suggest?',
      'He did not take the problem seriously',
      ['He did not know about the booking', 'He offered them a free dessert', 'He was new to the job'],
      '“A busy night” is neither an explanation nor an apology.',
    ],
    [
      'Which statement is NOT true?',
      'Helen wants a refund for the meal',
      ['The family waited about an hour and a half', 'The food was good', 'The table had been booked in advance'],
      'She says she does not expect a refund.',
    ],
  ]),
  ...reading('pool-notice', 2, [
    [
      'What happens to a pool ticket bought before the closure?',
      'It can still be used after the pool reopens',
      ['It will be refunded in cash', 'It can only be used at the town pool', 'It runs out on the 14th'],
      'Tickets will be extended, so they can be used later.',
    ],
    [
      'Who can swim at the town pool on Park Road for less?',
      'Members who show their card',
      ['Anyone who lives in the town', 'People who only use the gym', 'Staff working on the repairs'],
      'The reduced price is for members showing their card.',
    ],
    [
      'What is the main purpose of the notice?',
      'To explain the changes during the repairs',
      [
        'To announce a new gym and sauna for members',
        'To ask members to pay for the repair work',
        'To advertise the town pool to new visitors',
      ],
      'It lists closures, what stays open and the alternatives.',
    ],
  ]),
  ...reading('bus-canary', 2, [
    [
      'How did Julia’s mood change?',
      'She began angry and ended up cheerful',
      ['She was cheerful all day', 'She became more and more upset', 'She was bored and then tired'],
      'She was angry at first, then laughed.',
    ],
    [
      'Why did Julia miss her stop?',
      'The bird and the man had distracted her',
      ['She fell asleep for a few minutes', 'She was busy looking at her phone', 'The bus did not stop at her usual stop'],
      'She stopped checking her phone and enjoyed the conversation.',
    ],
    [
      'What does the man say about the canary?',
      'It sings best in wet weather',
      ['It only sings for him', 'It sings when it is hungry', 'It is afraid of the rain'],
      'He says the bird sings best when it is raining.',
    ],
  ]),
  ...reading('late-report', 3, [
    [
      'How does Karen view the report itself?',
      'She is satisfied with its quality',
      ['She thinks it is too detailed', 'She doubts some of the figures', 'She has not read it yet'],
      'She calls the figures solid and mentions the client’s praise.',
    ],
    [
      'What does Karen imply by “a warning on the day isn’t the same as a conversation a week before”?',
      'He should have raised the problem much sooner',
      ['He should have spoken to the client himself', 'His message was written too informally', 'She never reads his messages'],
      'Early notice would have let her ask the client for time.',
    ],
    [
      'What does Dev’s remark “I was hoping I could catch up” suggest?',
      'He did not want to admit he was falling behind',
      ['He did not think the deadline mattered', 'He blamed the client for the delay', 'He planned to ask for more time'],
      'He hoped to fix it quietly instead of admitting the problem.',
    ],
  ]),
  ...reading('museum-screens', 3, [
    [
      'What does the writer suggest about the critics?',
      'Their fears are contradicted by the visitor figures',
      ['They have never visited the new gallery', 'They were right about the teenagers', 'They want the skeleton moved to a school'],
      'Attendance and pupils’ questions suggest the change has worked.',
    ],
    [
      'What does the curator mean by “provided the screen asks something of you”?',
      'The display must make visitors think actively',
      ['The screens must be free to use', 'Visitors must read the labels first', 'The museum must ask for donations'],
      'A screen helps only if visitors have to think.',
    ],
    [
      'What is the effect of the geologist’s comment at the end?',
      'It shows that even a doubter noticed a benefit',
      [
        'It proves that the new gallery has failed',
        'It shows that geologists dislike technology',
        'It suggests that children find rocks dull',
      ],
      'He still misses the skeleton but admits the children ask more.',
    ],
  ]),
  ...reading('plants-request', 3, [
    [
      'What is Priya’s real answer to Tom’s request?',
      'She is politely refusing',
      ['She has agreed but wants more details', 'She has already promised Mrs Hall', 'She is happy to help'],
      'She gives a reason and apologises instead of agreeing.',
    ],
    [
      'Why does Priya mention her sister?',
      'To give a reason without saying no directly',
      ['To invite Tom to meet her sister', 'To suggest that Tom asks her sister', 'To explain why plants need water'],
      'A polite excuse avoids a direct refusal.',
    ],
    [
      'How does Tom react?',
      'He accepts it and looks for another solution',
      ['He insists that she should change her mind', 'He becomes angry and leaves', 'He cancels his weekend plans'],
      'He says he understands and will ask Mrs Hall.',
    ],
  ]),
  ...reading('commuters', 3, [
    [
      'Why do the researchers avoid firm conclusions?',
      'Calmer people may simply prefer reading',
      ['The survey included too few people to be reliable', 'The survey was paid for by publishers', 'Music reduces stress as well'],
      'Cause and effect could run the other way round.',
    ],
    [
      'What does the lead researcher see as the real benefit?',
      'Focusing on one task instead of reacting to alerts',
      ['Learning new vocabulary on the way', 'Books being easier on the eyes than screens', 'Getting a seat on the train'],
      'The researcher says you stop reacting to every notification.',
    ],
    [
      'Which statement best sums up the text?',
      'Reading may help, but the evidence is not conclusive',
      ['Reading is proven to reduce stress', 'Music is worse for stress than scrolling', 'Only people with seats can read'],
      'The researchers suggest a benefit but warn against firm conclusions.',
    ],
  ]),
  ...reading('high-street', 4, [
    [
      'What is the writer’s attitude to nostalgia about high streets?',
      'Sceptical: it comforts but does not help',
      ['Sympathetic: it expresses a real loss', 'Enthusiastic: it should guide policy', 'Indifferent: it does not matter'],
      'The writer calls nostalgia cheap and flattering.',
    ],
    [
      'What does “treating a symptom” suggest about the councils’ approach?',
      'It treats the effect, not the cause',
      [
        'It is too expensive for the councils to continue',
        'It follows advice from medical experts',
        'It deals with the root of the problem',
      ],
      'The real cause is that the internet took over the old purpose.',
    ],
    [
      'What does the writer say about the examples at the end?',
      'They offer a new purpose, not a return to the past',
      [
        'They will bring back the old high street in time',
        'They are too modest to make any real difference',
        'Councils are ignoring them in favour of festivals',
      ],
      'None of them will restore the old order.',
    ],
  ]),
  ...reading('deadline-talk', 4, [
    [
      'What is Marta’s position?',
      'She will accept the timeline only if something changes',
      ['She refuses to work for the client', 'She thinks the timeline is already generous', 'She wants the deadline cancelled'],
      'She asks for concessions before agreeing.',
    ],
    [
      'What does Marta imply by “amounts to very little”?',
      'The extension does not solve the real problem',
      ['The client was unreasonable to refuse', 'Three days is more than enough', 'She wants a longer extension from Lucas'],
      'Given the scope, three days changes almost nothing.',
    ],
    [
      'How does Marta answer Lucas’s last objection?',
      'She suggests asking the client instead of guessing',
      [
        'She admits that a smaller release would look like a retreat',
        'She insists the client will certainly see it as progress',
        'She agrees to drop her proposal for a smaller release',
      ],
      'Both are assuming; she suggests putting it to the client.',
    ],
  ]),
  ...reading('forgetting', 4, [
    [
      'What does the comparison with clearing a desk suggest?',
      'Forgetting keeps what is useful and drops the rest',
      ['Forgetting is a careless mistake', 'Memory should be tidied by deliberate effort', 'Old memories are always the most useful'],
      'What remains is what is likely to be needed again.',
    ],
    [
      'What is the writer’s attitude to the argument?',
      'Interested, but aware of its limits',
      ['Convinced that it explains all memory', 'Dismissive of the people who defend it', 'Unaware that it has exceptions'],
      'The writer states its limits fairly.',
    ],
    [
      'What do the defenders of the theory say about the exceptions?',
      'On their own, they do not disprove it',
      ['They only follow distressing events', 'They prove that the theory is false', 'They are too rare to study'],
      'No theory is judged by its exceptions alone.',
    ],
  ]),
]
