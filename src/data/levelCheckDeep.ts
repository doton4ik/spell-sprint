import type { LevelItem, LevelPassage, Skill } from './levelCheckBank'

// The deeper question types of the level check: use of English (gap-fill, find the mistake, word formation),
// collocations and phrasal verbs, reading and dictation. Written by hand. Every item has a fixed id (never
// derived from a position), and levelCheckBank.test.ts checks the shape: one clearly right answer among the
// choices, enough items at every level, a short explanation. Levels: 1 = A2, 2 = B1, 3 = B2, 4 = C1.
// Usage the two main kinds of English disagree on (hospital / the hospital, colour / color) is avoided.
type Level = 1 | 2 | 3 | 4

const pick = (
  id: string,
  skill: Skill,
  level: Level,
  prompt: string,
  answer: string,
  wrong: string[],
  explain: string,
  extra: Partial<LevelItem> = {},
): LevelItem => ({ id, skill, level, prompt, answer, kind: 'choice', choices: [answer, ...wrong], explain, ...extra })

const GAP = 'Choose the best option to complete the sentence.'
const MISTAKE = 'Choose the part of the sentence that has the mistake.'
const PHRASE = 'Choose the word or phrase that fits.'
const ARTICLE = { logAs: 'Grammar · Articles' }

const gap = (id: string, level: Level, prompt: string, answer: string, wrong: string[], explain: string, extra: Partial<LevelItem> = {}) =>
  pick(`lcd-gr-${id}`, 'grammar', level, prompt, answer, wrong, explain, { instruction: GAP, ...extra })
const mistake = (id: string, level: Level, sentence: string, parts: string[], answer: string, explain: string) =>
  pick(
    `lcd-gr-${id}`,
    'grammar',
    level,
    `“${sentence}”`,
    answer,
    parts.filter((part) => part !== answer),
    explain,
    { instruction: MISTAKE },
  )
const phrase = (id: string, level: Level, prompt: string, answer: string, wrong: string[], explain: string) =>
  pick(`lcd-vc-${id}`, 'vocabulary', level, prompt, answer, wrong, explain, { instruction: PHRASE })
const formation = (id: string, level: Level, prompt: string, answer: string, explain: string): LevelItem => ({
  id: `lcd-wf-${id}`,
  skill: 'grammar',
  level,
  kind: 'type',
  prompt,
  answer,
  explain,
  log: false,
  instruction: 'Write the correct form of the word in capitals.',
})
// alternatives: other ways to write what was heard (digits instead of number words)
const dictation = (id: string, level: Level, sentence: string, alternatives: string[] = []): LevelItem => ({
  id: `lcd-ls-${id}`,
  skill: 'listening',
  level,
  kind: 'dictation',
  prompt: sentence,
  answer: [sentence, ...alternatives].join('|'),
  explain: 'Listen again for the little words: articles, endings and prepositions.',
})

// ---- Use of English ------------------------------------------------------------------------
const grammarItems: LevelItem[] = [
  // A2
  gap('1-01', 1, 'She ___ to school every day.', 'goes', ['go', 'going', 'is go'], 'He, she and it take -s in the present simple.'),
  gap('1-02', 1, 'There ___ two apples on the table.', 'are', ['is', 'be', 'am'], 'Two apples is plural, so use are.'),
  gap('1-03', 1, 'I have ___ umbrella in my bag.', 'an', ['a', 'the', 'no article'], 'Umbrella starts with a vowel sound, so an.', ARTICLE),
  gap('1-04', 1, 'He is taller ___ his brother.', 'than', ['that', 'then', 'as'], 'Use than after a comparative.'),
  gap('1-05', 1, 'Yesterday we ___ to the park.', 'went', ['go', 'goed', 'gone'], 'Go is irregular: the past is went.'),
  mistake('1-06', 1, 'I am agree with you.', ['I', 'am agree', 'with', 'you'], 'am agree', 'Say “I agree”, without am.'),
  // B1
  gap(
    '2-01',
    2,
    'If it ___ tomorrow, we will stay at home.',
    'rains',
    ['will rain', 'rained', 'would rain'],
    'After if, the present simple talks about the future.',
  ),
  gap(
    '2-02',
    2,
    'I ___ here since 2020.',
    'have lived',
    ['live', 'am living', 'lived'],
    'Since a starting point needs the present perfect.',
  ),
  gap(
    '2-03',
    2,
    'She works as ___ engineer.',
    'an',
    ['a', 'the', 'no article'],
    'A job takes a or an; engineer starts with a vowel sound.',
    ARTICLE,
  ),
  gap(
    '2-04',
    2,
    'He asked me where ___.',
    'I lived',
    ['did I live', 'I did live', 'lived I'],
    'In a reported question the word order is like a statement.',
  ),
  mistake(
    '2-05',
    2,
    'She suggested to go to the park.',
    ['She', 'suggested', 'to go', 'to the park'],
    'to go',
    'After suggest use -ing: suggested going.',
  ),
  gap(
    '2-06',
    2,
    'The book ___ by millions of people.',
    'was read',
    ['read', 'is reading', 'has reading'],
    'The passive is was + past participle.',
  ),
  // B2
  gap(
    '3-01',
    3,
    'If I ___ more time, I would learn Spanish.',
    'had',
    ['have', 'would have', 'will have'],
    'Second conditional: if + past simple, would + verb.',
  ),
  gap(
    '3-02',
    3,
    'By the time we arrived, the film ___.',
    'had already started',
    ['already started', 'has already started', 'was already starting'],
    'An earlier past action needs the past perfect.',
  ),
  gap('3-03', 3, 'He was born in ___ Netherlands.', 'the', ['a', 'an', 'no article'], 'Plural country names take the.', ARTICLE),
  gap('3-04', 3, 'She is not used to ___ up so early.', 'getting', ['get', 'got', 'be get'], 'After be used to, use the -ing form.'),
  mistake(
    '3-05',
    3,
    'Hardly he had arrived when it started to rain.',
    ['Hardly', 'he had arrived', 'when', 'it started to rain'],
    'he had arrived',
    'After hardly, invert: Hardly had he arrived.',
  ),
  gap(
    '3-06',
    3,
    'I wish I ___ the answer yesterday.',
    'had known',
    ['knew', 'would know', 'have known'],
    'A wish about the past uses the past perfect.',
  ),
  // C1
  gap(
    '4-01',
    4,
    'Not only ___ late, but he also forgot the documents.',
    'did he arrive',
    ['he arrived', 'arrived he', 'he did arrive'],
    'After Not only at the start, the verb comes first.',
  ),
  gap(
    '4-02',
    4,
    'Had I known about the problem, I ___ earlier.',
    'would have called',
    ['will call', 'would call', 'had called'],
    'Had I known… means If I had known…; then would have.',
  ),
  gap('4-03', 4, 'She is ___ only person here who knows the code.', 'the', ['a', 'an', 'no article'], 'Only takes the.', ARTICLE),
  gap(
    '4-04',
    4,
    'The report, ___ was published last week, caused a debate.',
    'which',
    ['what', 'who', 'whose'],
    'Use which for a thing after a comma.',
  ),
  mistake(
    '4-05',
    4,
    'Despite of the rain, we had a picnic.',
    ['Despite of', 'the rain,', 'we had', 'a picnic'],
    'Despite of',
    'Say despite, or in spite of, never despite of.',
  ),
  gap(
    '4-06',
    4,
    'It is high time we ___ a decision.',
    'made',
    ['make', 'will make', 'have made'],
    'After It is time, use the past simple.',
  ),
]

const formationItems: LevelItem[] = [
  formation('1-01', 1, 'She is a very good ___ . (SING)', 'singer', 'Add -er for the person who sings.'),
  formation('1-02', 1, 'The weather is ___ today. (SUN)', 'sunny', 'Add -y to make an adjective.'),
  formation('1-03', 1, 'He walked ___ to the door. (SLOW)', 'slowly', 'Most adverbs end in -ly.'),
  formation('2-01', 2, 'We were very ___ with the service. (SATISFY)', 'satisfied', 'A feeling uses the -ed adjective.'),
  formation('2-02', 2, 'His ___ surprised everyone. (DECIDE)', 'decision', 'The noun of decide is decision.'),
  formation('2-03', 2, 'It is ___ to park here. (LEGAL)', 'illegal', 'Il- goes before words that start with l.'),
  formation('3-01', 3, 'The ___ of the project took three years. (COMPLETE)', 'completion', 'The noun of complete is completion.'),
  formation('3-02', 3, 'She spoke ___ about her job. (ENTHUSIASM)', 'enthusiastically', 'Enthusiastic + ally makes the adverb.'),
  formation('3-03', 3, 'It was an ___ mistake. (EXCUSE)', 'inexcusable', 'In- + excuse + -able means cannot be excused.'),
  formation('4-01', 4, 'He was blamed for his ___ . (RESPONSIBLE)', 'irresponsibility', 'Ir- before r, and -ity for the noun.'),
  formation('4-02', 4, 'The ___ of the data is in doubt. (ACCURATE)', 'accuracy', 'The noun of accurate is accuracy.'),
  formation('4-03', 4, 'She is known for her ___ approach. (PRAGMATISM)', 'pragmatic', 'The adjective of pragmatism is pragmatic.'),
]

// ---- Collocations and phrasal verbs --------------------------------------------------------
const vocabularyItems: LevelItem[] = [
  phrase('1-01', 1, 'I need to ___ a decision soon.', 'make', ['do', 'take', 'have'], 'We say make a decision.'),
  phrase('1-02', 1, 'Please ___ off the lights when you leave.', 'turn', ['put', 'set', 'get'], 'Turn off the lights.'),
  phrase('1-03', 1, 'She ___ the bus to work every day.', 'takes', ['does', 'makes', 'goes'], 'We take a bus, a train or a taxi.'),
  phrase('1-04', 1, 'Can you ___ me a favour?', 'do', ['make', 'give', 'take'], 'We say do someone a favour.'),
  phrase('1-05', 1, 'Don’t forget to ___ your teeth.', 'brush', ['wash', 'clean', 'wipe'], 'We brush our teeth.'),
  phrase('1-06', 1, 'Look ___! A car is coming.', 'out', ['up', 'for', 'at'], 'Look out means be careful.'),
  phrase('2-01', 2, 'We have run ___ milk. Can you buy some?', 'out of', ['off', 'away', 'over'], 'Run out of means there is none left.'),
  phrase('2-02', 2, 'He ___ his mind and stayed at home.', 'changed', ['turned', 'moved', 'switched'], 'We say change your mind.'),
  phrase('2-03', 2, 'It is important to ___ attention in class.', 'pay', ['give', 'make', 'take'], 'We say pay attention.'),
  phrase('2-04', 2, 'The meeting was ___ off because of the strike.', 'called', ['turned', 'put', 'cut'], 'Call off means cancel.'),
  phrase('2-05', 2, 'They ___ a deal after a long discussion.', 'reached', ['took', 'put', 'held'], 'We reach an agreement or a deal.'),
  phrase('2-06', 2, 'I am looking ___ to seeing you.', 'forward', ['ahead', 'up', 'out'], 'Look forward to is a fixed phrase.'),
  phrase('3-01', 3, 'She decided to ___ up smoking.', 'give', ['put', 'take', 'set'], 'Give up means stop doing something.'),
  phrase('3-02', 3, 'He ___ a good impression at the interview.', 'made', ['did', 'took', 'had'], 'We say make an impression.'),
  phrase('3-03', 3, 'The new law will ___ into effect in May.', 'come', ['go', 'get', 'run'], 'We say come into effect.'),
  phrase(
    '3-04',
    3,
    'We need to ___ with the problem quickly.',
    'deal',
    ['solve', 'treat', 'work'],
    'Deal with a problem is the usual phrase.',
  ),
  phrase('3-05', 3, 'She ___ the blame for the mistake.', 'took', ['got', 'had', 'made'], 'We say take the blame.'),
  phrase(
    '3-06',
    3,
    'He was ___ with breaking the law.',
    'charged',
    ['accused', 'blamed', 'sued'],
    'Charged with is used for a crime; accused takes of.',
  ),
  phrase(
    '4-01',
    4,
    'The government has ___ out a new policy.',
    'rolled',
    ['turned', 'passed', 'run'],
    'Roll out means introduce a plan or product.',
  ),
  phrase('4-02', 4, 'His speech ___ a lot of controversy.', 'sparked', ['lit', 'struck', 'flamed'], 'We say spark controversy.'),
  phrase('4-03', 4, 'The two companies decided to ___ forces.', 'join', ['meet', 'bring', 'add'], 'Join forces means work together.'),
  phrase('4-04', 4, 'We must ___ the issue head-on.', 'tackle', ['hit', 'catch', 'stop'], 'We tackle an issue or a problem.'),
  phrase('4-05', 4, 'He was ___ of all charges.', 'cleared', ['free', 'released', 'emptied'], 'Cleared of charges means found not guilty.'),
  phrase(
    '4-06',
    4,
    'The negotiations have reached a ___.',
    'deadlock',
    ['deadline', 'deadweight', 'deadbeat'],
    'A deadlock is a point where no side will move.',
  ),
]

// ---- Reading -------------------------------------------------------------------------------
type Question = [prompt: string, answer: string, wrong: [string, string, string], explain: string]
const reading = (passage: string, level: Level, questions: Question[]): LevelItem[] =>
  questions.map(([prompt, answer, wrong, explain], index) =>
    pick(`lcd-rd-${passage}-${index + 1}`, 'reading', level, prompt, answer, wrong, explain, {
      passage,
      instruction: 'Choose the best answer, using the text.',
    }),
  )

export const levelPassages: LevelPassage[] = [
  {
    id: 'bike',
    level: 1,
    title: 'A new bike',
    text: 'Tom has a new bike. His uncle gave it to him on his birthday. It is red and it has a small bell. Tom rides the bike to school every morning, and it takes ten minutes. On Saturdays he rides with his friend Ben to the park. They have a picnic there. Last Saturday it rained, so they stayed at home and played games.',
  },
  {
    id: 'bakery',
    level: 1,
    title: 'Maria’s day',
    text: 'Maria works in a bakery. She starts at six o’clock in the morning and finishes at two. In the afternoon she often goes to the market near her house. She buys vegetables and fruit for her family. Her favourite fruit is the peach, but peaches are expensive in winter, so she does not buy them then. On Sundays Maria cooks lunch for her parents, and her brother brings dessert.',
  },
  {
    id: 'library',
    level: 2,
    title: 'The library moves',
    text: 'The town library will move to a new building next month. The old building is too small, and it has no lift, so people in wheelchairs cannot reach the second floor. The new library is near the station, which will make it easier for students to visit after school. It will also have a café and a quiet room for studying. Some residents are unhappy because the new building is far from the old town centre, and older people may find it hard to walk there. The council says a free bus will run every half hour to solve this problem.',
  },
  {
    id: 'remote',
    level: 2,
    title: 'Working from home',
    text: 'Since last year, Anna has worked from home three days a week. She says she saves two hours a day because she does not have to travel. However, she misses talking to her colleagues over coffee, and sometimes the days feel very long when she is alone in the flat. To solve this, she now works in a café once a week. “It is noisy, but it is good for me to see other people,” she says. Her manager has noticed that she finishes her tasks faster at home, so he has agreed to continue the arrangement.',
  },
  {
    id: 'bees',
    level: 3,
    title: 'The honeybee decline',
    text: 'Honeybee numbers have fallen sharply in many countries over the past two decades. Scientists blame a combination of factors: pesticides that damage the bees’ nervous systems, the loss of wild flowers as farmland expands, and a parasite called the varroa mite. Although honey production has remained stable, partly because beekeepers replace lost colonies, the situation worries researchers. Bees pollinate about a third of the crops humans eat, so a collapse could affect food prices and variety. Some farmers have started planting strips of wildflowers around their fields. Early results suggest these strips support wild pollinators too, though it is too soon to say whether they will reverse the decline. Critics argue that voluntary measures are not enough and that stricter rules on pesticides are needed.',
  },
  {
    id: 'nights',
    level: 3,
    title: 'The night shift',
    text: 'Working nights is more than an inconvenience; it can affect health. Researchers who followed thousands of nurses found that those who regularly worked night shifts were more likely to develop heart problems, even after taking age and lifestyle into account. The likely cause is a disrupted body clock: the body expects to be active in daylight, so sleeping by day is rarely as restful. Employers cannot always avoid night work, but some hospitals now schedule shifts so that staff rotate forward, from mornings to afternoons to nights, which seems easier on the body than the reverse. The study’s authors stress that the risk is modest for any one person. They also caution that the research shows a link, not proof that night work itself causes the illnesses.',
  },
  {
    id: 'silence',
    level: 4,
    title: 'Silence as a luxury',
    text: 'Silence, once the default condition of most human lives, has become an unusual commodity. Hotels now advertise “quiet floors”, and some airlines sell seats away from children. Yet the appeal of quiet is not simply a reaction against noise. Psychologists who study attention argue that constant background sound, even when we barely notice it, leaves us with fewer mental resources for reflection. In one experiment, volunteers who spent twenty minutes in a silent room afterwards solved problems more creatively than those who had listened to music. It would be tempting to conclude that we should all retreat to monasteries, but the authors are careful not to go that far. They point out that the benefit seems to depend on choosing silence rather than having it imposed; people who were forced to sit quietly reported more anxiety. The lesson, then, is less about eliminating noise than about regaining control over when and how we hear it.',
  },
  {
    id: 'translation',
    level: 4,
    title: 'Translation and nuance',
    text: 'Machine translation has improved dramatically, yet professional translators are not rushing to retrain. The software handles routine documents competently, but it still stumbles over ambiguity, humour and cultural reference. A joke about a local politician, for example, may be rendered word for word and fall flat. More subtly, the tool tends to flatten style: a writer’s deliberately awkward phrasing may be “corrected” into smooth, forgettable prose. Some translators now use the technology as a first draft and spend their time editing, which can be quicker for technical material but, they say, is often slower for literature, where fixing a clumsy draft requires as much thought as starting afresh. Clients, meanwhile, increasingly expect lower prices on the grounds that “the computer does most of the work”, a claim the translators dispute. Their concern is not that machines will replace them overnight, but that the perceived value of careful human judgement is being quietly eroded.',
  },
]

const readingItems: LevelItem[] = [
  ...reading('bike', 1, [
    ['Who gave Tom the bike?', 'His uncle', ['His friend Ben', 'His father', 'His teacher'], 'The text says his uncle gave it to him.'],
    ['How long does Tom’s ride to school take?', 'Ten minutes', ['An hour', 'Twenty minutes', 'Five minutes'], 'It takes ten minutes.'],
    [
      'Why did the boys not go to the park last Saturday?',
      'It rained',
      ['Tom was ill', 'The bike was broken', 'They had school'],
      'Last Saturday it rained.',
    ],
  ]),
  ...reading('bakery', 1, [
    [
      'What does Maria do?',
      'She works in a bakery',
      ['She sells fruit at the market', 'She cooks in a restaurant', 'She teaches children'],
      'The text begins: Maria works in a bakery.',
    ],
    [
      'When does Maria finish work?',
      'At two o’clock',
      ['At six o’clock', 'At noon', 'At four o’clock'],
      'She starts at six and finishes at two.',
    ],
    [
      'Why does Maria not buy peaches in winter?',
      'They are expensive',
      ['She does not like them', 'The market is closed', 'Her brother brings them'],
      'Peaches are expensive in winter.',
    ],
  ]),
  ...reading('library', 2, [
    [
      'Why is the library moving?',
      'The old building is too small and hard to reach',
      ['The council wants a bigger café', 'Students asked for more books', 'The old building is closing down'],
      'It is too small and has no lift.',
    ],
    [
      'What is the main worry of some residents?',
      'The new library is far from the town centre for older people',
      ['The café will be noisy', 'The bus will be expensive', 'There will be fewer books'],
      'Older people may find it hard to walk there.',
    ],
    [
      'What will the council do about the worry?',
      'Run a free bus',
      ['Build a car park', 'Keep the old library open', 'Pay for taxis'],
      'A free bus will run every half hour.',
    ],
  ]),
  ...reading('remote', 2, [
    [
      'How much time does Anna save by working from home?',
      'Two hours a day',
      ['Two days a week', 'Three hours a week', 'Half an hour a day'],
      'She saves two hours a day.',
    ],
    [
      'What does Anna dislike about working at home?',
      'Feeling alone',
      ['The noise', 'The slow internet', 'Her manager'],
      'She misses her colleagues and feels alone.',
    ],
    [
      'Why will the arrangement continue?',
      'She finishes her tasks faster at home',
      ['She asked for more days', 'Her colleagues prefer it', 'It is cheaper for the company'],
      'Her manager noticed she works faster at home.',
    ],
  ]),
  ...reading('bees', 3, [
    [
      'Why has honey production stayed stable?',
      'Beekeepers replace lost colonies',
      ['The bees have recovered', 'Pesticides have been banned', 'The varroa mite has disappeared'],
      'Partly because beekeepers replace lost colonies.',
    ],
    [
      'What do the wildflower strips seem to do?',
      'Help wild pollinators as well',
      ['Increase the price of honey', 'Kill the varroa mite', 'Reduce the amount of farmland'],
      'Early results suggest they support wild pollinators too.',
    ],
    [
      'What is the critics’ view?',
      'Voluntary measures are not enough',
      ['Pesticides are harmless', 'The decline is exaggerated', 'Beekeepers should be paid more'],
      'They want stricter rules on pesticides.',
    ],
  ]),
  ...reading('nights', 3, [
    [
      'What does the study suggest about night-shift nurses?',
      'They have a higher risk of heart problems',
      ['They sleep more than other nurses', 'They make more mistakes', 'They are paid less'],
      'They were more likely to develop heart problems.',
    ],
    [
      'Which rota seems easier on the body?',
      'Mornings, then afternoons, then nights',
      ['Nights first, then mornings', 'Only night shifts', 'A different shift every day'],
      'Rotating forward seems easier than the reverse.',
    ],
    [
      'What do the authors warn about?',
      'The study shows a link, not proof of cause',
      ['The risk is very large for everyone', 'Nurses should stop working nights', 'Age does not matter at all'],
      'They say the research shows a link, not proof.',
    ],
  ]),
  ...reading('silence', 4, [
    [
      'According to the psychologists, why might background sound be harmful?',
      'It leaves less mental capacity for reflection',
      ['It damages our hearing', 'It makes people angry', 'It makes us tired'],
      'It leaves fewer mental resources for reflection.',
    ],
    [
      'What did the experiment suggest?',
      'Time in a silent room improved creative problem solving',
      ['Music helps people solve problems', 'Silence causes anxiety in everyone', 'Twenty minutes is too long to sit quietly'],
      'The silent group solved problems more creatively.',
    ],
    [
      'What is the authors’ main point?',
      'Control over when we hear noise matters more than removing it',
      ['People should move to monasteries', 'Hotels should ban noise', 'Silence is always good for everyone'],
      'The lesson is about regaining control over how we hear it.',
    ],
  ]),
  ...reading('translation', 4, [
    [
      'What problem does machine translation still have?',
      'It struggles with ambiguity, humour and culture',
      ['It is too slow for routine documents', 'It cannot translate technical texts', 'It is too expensive for clients'],
      'It stumbles over ambiguity, humour and cultural reference.',
    ],
    [
      'Why might editing a machine draft be slower for literature?',
      'Fixing a clumsy draft can take as much thought as starting again',
      ['Literature is always longer', 'Machines refuse to translate novels', 'There are few editors'],
      'Fixing a clumsy draft needs as much thought as starting afresh.',
    ],
    [
      'What worries translators most?',
      'Careful human judgement being valued less',
      ['Losing all their work overnight', 'The software becoming free', 'Clients wanting longer texts'],
      'The perceived value of human judgement is being eroded.',
    ],
  ]),
]

// ---- Dictation -----------------------------------------------------------------------------
const dictationItems: LevelItem[] = [
  dictation('1-01', 1, 'My brother plays football on Sunday.'),
  dictation('1-02', 1, 'The shop opens at nine o’clock.', [
    'The shop opens at 9 o’clock.',
    'The shop opens at nine oclock.',
    'The shop opens at 9 oclock.',
  ]),
  dictation('1-03', 1, 'Can you help me with this bag?'),
  dictation('1-04', 1, 'We are going to the station now.'),
  dictation('1-05', 1, 'She has two cats and a small dog.', ['She has 2 cats and a small dog.']),
  dictation('1-06', 1, 'It is very cold in the morning.'),
  dictation('2-01', 2, 'I have lived in this city for about ten years.', ['I have lived in this city for about 10 years.']),
  dictation('2-02', 2, 'He said that the meeting would start at half past three.', [
    'He said that the meeting would start at half past 3.',
  ]),
  dictation('2-03', 2, 'If the weather is nice, we will have lunch in the garden.'),
  dictation('2-04', 2, 'She forgot to bring her passport, so she missed the flight.'),
  dictation('2-05', 2, 'The new restaurant near the river is surprisingly cheap.'),
  dictation('2-06', 2, 'Could you tell me where the nearest pharmacy is?'),
  dictation('3-01', 3, 'Despite working very hard, she did not manage to finish the project on time.'),
  dictation('3-02', 3, 'The company announced that it would reduce its prices by the end of the year.'),
  dictation('3-03', 3, 'Nobody expected the negotiations to continue for such a long time.'),
  dictation('3-04', 3, 'He suggested that we should postpone the decision until everyone had read the report.'),
  dictation('3-05', 3, 'Although the journey was exhausting, the view from the hotel was worth the effort.'),
  dictation('3-06', 3, 'The article claims that regular exercise improves both memory and concentration.'),
  dictation('4-01', 4, 'The committee has been blamed for ignoring the concerns of local residents.'),
  dictation('4-02', 4, 'Nobody could have predicted that the unemployment rate would rise so rapidly.'),
  dictation('4-03', 4, 'Had the manager been more experienced, the misunderstanding might never have occurred.'),
  dictation('4-04', 4, 'Contrary to popular belief, the experiment did not prove that the theory was entirely correct.'),
  dictation('4-05', 4, 'It is widely acknowledged that environmental regulations have become increasingly difficult to enforce.'),
  dictation('4-06', 4, 'She was reluctant to accept the offer without having consulted her colleagues beforehand.'),
]

export const deepLevelItems: LevelItem[] = [...grammarItems, ...formationItems, ...vocabularyItems, ...readingItems, ...dictationItems]
