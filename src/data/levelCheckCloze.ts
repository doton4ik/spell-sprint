import type { LevelItem, LevelPassage } from './levelCheckBank'
import { pick } from './levelCheckDeep'

// Gapped texts for the level check, in the style of the multiple-choice gap-fill of Cambridge Linguaskill and the gapped texts of the
// Oxford Placement Test (written 15 Oct 2026): a short text with three numbered gaps and four words to choose from for each.
// They test grammar and word choice in context. Every gap has one possible answer: words that mean the same are never both
// offered. Levels are the author's judgement, not calibrated on learners; when unsure, the level is the lower one.
type Level = 1 | 2 | 3 | 4

type Gap = [answer: string, wrong: [string, string, string], explain: string]
const cloze = (passage: string, level: Level, gaps: Gap[]): LevelItem[] =>
  gaps.map(([answer, wrong, explain], index) =>
    pick(`lcd-cz-${passage}-${index + 1}`, 'reading', level, `Gap ${index + 1}`, answer, wrong, explain, {
      passage,
      format: 'cloze',
      instruction: 'Choose the best word for the gap.',
    }),
  )

export const clozePassages: LevelPassage[] = [
  {
    id: 'cz-town',
    level: 1,
    title: 'My town',
    text: 'I live (1) ___ a small town in the north of England. It has a lovely park and a river. There (2) ___ a lot of old trees in the park, and every Sunday my family goes there for a picnic. My brother (3) ___ swim very well, so he always wants to go into the river, even when it is cold. I think it is a great place to live.',
  },
  {
    id: 'cz-market',
    level: 1,
    title: 'A wet Saturday',
    text: 'Last Saturday I went to the market (1) ___ my mother. We bought some vegetables and a cake with candles on it for my grandmother’s birthday. It was very crowded, (2) ___ we did not stay long. On the way home it started to rain, and because we had no umbrellas, we got very (3) ___. My grandmother laughed when she saw us at the door.',
  },
  {
    id: 'cz-gym',
    level: 2,
    title: 'Joining a gym',
    text: 'My doctor had told me to do more exercise, but for years I kept finding excuses. Then a colleague invited me to a class, and joining a gym (1) ___ out to be the best decision I made last year. At first I found it hard to get up early, but now I look forward (2) ___ every session. I have also (3) ___ several new friends there, and we often have coffee together afterwards.',
  },
  {
    id: 'cz-edinburgh',
    level: 2,
    title: 'A day in Edinburgh',
    text: 'Last month we took the train to Edinburgh. The journey was long, but it was worth it (1) ___ the views from the window. When we arrived, it was (2) ___ a wet afternoon that we spent the first hour in a café. In the end the sun came out, and we (3) ___ at the castle just before it closed. It was the perfect end to a long day.',
  },
  {
    id: 'cz-noise',
    level: 3,
    title: 'City noise',
    text: 'Although a large (1) ___ of residents say they are bothered by noise, few have ever made a complaint. This is partly (2) ___ to the belief that nothing can be done. As a result, councils often have no idea (3) ___ serious the problem really is, and plans for quieter streets are put off year after year. Meanwhile, those who live beside busy roads simply learn to put up with it.',
  },
  {
    id: 'cz-volunteer',
    level: 3,
    title: 'Volunteering abroad',
    text: 'Volunteering abroad is often described as a life-changing experience. Since our programme (1) ___ in 2010, more than five thousand people have taken part in twelve countries. Some give up after a week, (2) ___ others stay for months. (3) ___ the difficulties, most say they would do it again, and many return as team leaders. The work is unpaid, and volunteers usually have to pay for their own flights.',
  },
  {
    id: 'cz-attention',
    level: 4,
    title: 'Divided attention',
    text: 'Attention is a limited resource. We can switch quickly between tasks, but research suggests that every switch (1) ___ a cost. (2) ___, people who constantly check their phones often work more slowly than they realise. It would be wrong, (3) ___, to conclude that technology is entirely to blame; the habit may be as much a symptom of overwork as a cause of it.',
  },
  {
    id: 'cz-translation',
    level: 4,
    title: 'What a translation is',
    text: 'It is often assumed that a good translation is one that (1) ___ like the original. In practice, translators must decide what to preserve: the exact words, the rhythm, or the tone, for example. Each choice involves (2) ___ something else. It is hardly (3) ___, then, that no two translators produce the same text, and that great works are translated again and again.',
  },
]

export const clozeItems: LevelItem[] = [
  ...cloze('cz-town', 1, [
    ['in', ['on', 'at', 'to'], 'Live in + a town.'],
    ['are', ['is', 'has', 'have'], 'A plural noun: there are.'],
    ['can', ['is', 'does', 'has'], 'Can + verb shows ability.'],
  ]),
  ...cloze('cz-market', 1, [
    ['with', ['to', 'at', 'by'], 'Go with someone.'],
    ['so', ['because', 'but', 'or'], 'So gives the result.'],
    ['wet', ['wetly', 'water', 'wetting'], 'Get + adjective: get wet.'],
  ]),
  ...cloze('cz-gym', 2, [
    ['turned', ['came', 'worked', 'found'], 'Turn out to be means prove to be in the end.'],
    ['to', ['for', 'at', 'on'], 'Look forward to + noun.'],
    ['made', ['done', 'taken', 'kept'], 'We make friends.'],
  ]),
  ...cloze('cz-edinburgh', 2, [
    ['for', ['by', 'with', 'of'], 'Worth it for + the reason.'],
    ['such', ['so', 'too', 'very'], 'Such + a + adjective + noun + that.'],
    ['arrived', ['reached', 'got', 'came'], 'Arrive at a place.'],
  ]),
  ...cloze('cz-noise', 3, [
    ['number', ['amount', 'deal', 'level'], 'A large number of + plural noun.'],
    ['due', ['because', 'since', 'as'], 'Due to introduces a cause.'],
    ['how', ['what', 'which', 'so'], 'How + adjective in an indirect question.'],
  ]),
  ...cloze('cz-volunteer', 3, [
    ['began', ['has begun', 'begins', 'had begun'], 'Since + past simple, then present perfect.'],
    ['while', ['because', 'unless', 'so'], 'While contrasts two groups.'],
    ['Despite', ['Although', 'However', 'Because'], 'Despite + noun: despite the difficulties.'],
  ]),
  ...cloze('cz-attention', 4, [
    ['carries', ['makes', 'does', 'pays'], 'A switch carries a cost.'],
    ['Consequently', ['Nevertheless', 'Otherwise', 'Conversely'], 'Consequently introduces a result.'],
    ['however', ['thus', 'hence', 'since'], 'However marks a contrast with the idea before.'],
  ]),
  ...cloze('cz-translation', 4, [
    ['reads', ['writes', 'speaks', 'says'], 'A text reads well or reads like another.'],
    ['giving up', ['to give up', 'give up', 'gives up'], 'Involve + the -ing form.'],
    ['surprising', ['surprised', 'surprise', 'surprisingly'], 'Hardly surprising: an adjective.'],
  ]),
]
