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
    title: 'My new flat',
    level: 'A2',
    format: 'message',
    topic: 'Home and Town',
    text: 'Hi Tom! Last week I {found|past-irregular|finded} {a new flat|article-missing|new flat}. It {is|agreement|are} small but very bright, and {the kitchen|article|a kitchen} is my favourite room.\n\nMy neighbours {are|agreement|is} really friendly. Yesterday one of them {gave|past-irregular|gived} me {some|quantifier|many} advice about {the buses|article-missing|buses} in this area. There {is|agreement|are} a nice park near {my|pronoun|me} building, so I {go|agreement|goes} running there every morning.\n\n{Do you want|word-order|You want} to visit me on Saturday? I can {cook|modal|to cook} dinner for us!',
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
