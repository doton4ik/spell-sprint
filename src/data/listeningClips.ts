import videoClips from './listeningVideoClips.json'

// Short clips for listening dictation: the learner hears a line and writes it. Written by hand.
// A clip is read by the browser voice ('voice'). A clip from a video ('youtube') has the same lines, each with
// the second it starts and ends at, so the player can replay just that line.
// wordStarts: the second each word of the text starts at (video lines), so the hint can light up the word being said
export type ListeningLine = { text: string; start?: number; end?: number; wordStarts?: number[] }
export type ListeningSource = { kind: 'voice' } | { kind: 'youtube'; videoId: string }
export type ListeningClip = {
  id: string // fixed: never change it
  title: string
  level: 'A2' | 'B1' | 'B2'
  source: ListeningSource
  lines: ListeningLine[]
}

const voiceClips: ListeningClip[] = [
  {
    id: 'clip-train-delay',
    title: 'A delayed train',
    level: 'A2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Excuse me, is this the train to Manchester?' },
      { text: 'Yes, but it is running twenty minutes late.' },
      { text: 'That is a pity, because I have a meeting at noon.' },
      { text: 'You could take the bus instead, it leaves in five minutes.' },
      { text: "Thanks, I'll go and buy a ticket now." },
    ],
  },
  {
    id: 'clip-new-flat',
    title: 'Looking at a flat',
    level: 'B1',
    source: { kind: 'voice' },
    lines: [
      { text: 'The flat is on the third floor and has a small balcony.' },
      { text: 'How much is the rent, and are the bills included?' },
      { text: 'It is six hundred a month, and the water is included.' },
      { text: 'I would like to think about it before I decide.' },
      { text: 'Of course, but please let us know by Friday.' },
    ],
  },
  {
    id: 'clip-work-update',
    title: 'A meeting update',
    level: 'B2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Unfortunately, the supplier has postponed the delivery until next week.' },
      { text: 'That will make it difficult to meet our deadline.' },
      { text: 'We should have asked for a written guarantee in advance.' },
      { text: 'Let us look for an alternative before the customer complains.' },
      { text: 'I will send you the revised schedule by the end of the day.' },
    ],
  },
  {
    id: 'clip-cafe-order',
    title: 'Ordering in a café',
    level: 'A2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Good morning, what would you like to drink?' },
      { text: "I'd like a large coffee and a chocolate biscuit, please." },
      { text: 'Would you like milk or sugar in your coffee?' },
      { text: 'Just a little milk, thank you, and a glass of water.' },
      { text: 'That is four pounds fifty, and here is your receipt.' },
      { text: 'Thank you, I will sit near the window, because it is warm.' },
    ],
  },
  {
    id: 'clip-doctor-phone',
    title: "A doctor's appointment",
    level: 'A2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Good morning, this is the surgery, how can I help?' },
      { text: 'I have a terrible headache and a sore throat.' },
      { text: 'Can you come to see the doctor this afternoon?' },
      { text: 'I can come at half past four, if that is possible.' },
      { text: 'Yes, that is fine, please come ten minutes early.' },
      { text: 'Thank you, I will definitely be there on time.' },
    ],
  },
  {
    id: 'clip-weekend-weather',
    title: 'Weekend plans and weather',
    level: 'A2',
    source: { kind: 'voice' },
    lines: [
      { text: 'What are you doing this weekend, Anna?' },
      { text: 'The weather forecast says it will be sunny on Saturday.' },
      { text: 'Lovely! Are you going to the seaside with your family?' },
      { text: 'Yes, we are leaving early, but on Sunday it will rain.' },
      { text: 'Then come to my house, and we can cook dinner together.' },
      { text: 'That is a great idea, I will bring some vegetables.' },
    ],
  },
  {
    id: 'clip-job-interview',
    title: 'A job interview',
    level: 'B1',
    source: { kind: 'voice' },
    lines: [
      { text: 'Thank you for coming, could you tell me about your experience?' },
      { text: 'I have worked as a receptionist in a large hotel for three years.' },
      { text: 'What do you think is your greatest strength?' },
      { text: 'I am very organised, and I can deal with difficult customers politely.' },
      { text: 'If we offered you the job, when could you start?' },
      { text: "I must give a month's notice, so I could start in April." },
    ],
  },
  {
    id: 'clip-faulty-toaster',
    title: 'Returning a faulty toaster',
    level: 'B1',
    source: { kind: 'voice' },
    lines: [
      { text: 'Hello, I bought this toaster last week, but it has stopped working.' },
      { text: 'I am sorry to hear that, have you got the receipt with you?' },
      { text: 'Yes, here it is, and I have not damaged it in any way.' },
      { text: 'If you like, we can give you a refund or a replacement.' },
      { text: 'I would prefer a refund, because I have already ordered another one.' },
      { text: 'No problem, please sign here, and you will receive the money soon.' },
    ],
  },
  {
    id: 'clip-airport-checkin',
    title: 'Checking in at the airport',
    level: 'B1',
    source: { kind: 'voice' },
    lines: [
      { text: 'Good afternoon, may I see your passport and booking reference, please?' },
      { text: 'Here they are, and I would like a window seat if one is available.' },
      { text: 'I am afraid the window seats are taken, but there is an aisle seat.' },
      { text: 'That is fine, but will I have to pay extra for this suitcase?' },
      { text: 'Only if it weighs more than twenty kilograms, and yours does not.' },
      { text: 'Here is your boarding pass, and your flight leaves from gate twelve.' },
    ],
  },
  {
    id: 'clip-arctic-news',
    title: 'A science news item',
    level: 'B2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Scientists in Norway have announced a remarkable discovery about the Arctic environment.' },
      { text: 'It is believed that the ice is melting far faster than previously predicted.' },
      { text: 'The results, which were collected over ten years, were checked by independent experts.' },
      { text: 'If the data had been less reliable, the findings would have been ignored.' },
      { text: 'According to the team, sea levels could rise significantly if emissions are not reduced.' },
      { text: 'Governments will be expected to respond to these warnings at the conference next month.' },
    ],
  },
  {
    id: 'clip-home-working',
    title: 'Working from home debate',
    level: 'B2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Do you think working from home should become permanent for most employees?' },
      { text: 'Personally, I find it more productive, although I do miss my colleagues.' },
      { text: 'The difficulty is that new staff are seldom given enough guidance remotely.' },
      { text: 'That is true, but a flexible arrangement would surely satisfy both groups.' },
      { text: 'If the company had consulted us earlier, the transition would have been smoother.' },
      { text: 'Perhaps we should propose three office days a week and review the outcome.' },
    ],
  },
  {
    id: 'clip-lecture-opening',
    title: 'Opening of a lecture',
    level: 'B2',
    source: { kind: 'voice' },
    lines: [
      { text: 'Good morning, everyone, and welcome to the introduction to modern psychology.' },
      { text: 'Over twelve weeks, we will examine how behaviour is influenced by society.' },
      { text: 'You will be assessed through one essay and a final examination in January.' },
      { text: 'Attendance is not compulsory, but I strongly recommend that you come to every session.' },
      { text: 'Please do not worry if some of the terminology seems unfamiliar at first.' },
      { text: 'So, to begin, how would you define the word personality?' },
    ],
  },
]

// Clips made from a video by scripts/make-clip.mjs come after the hand-written ones.
export const listeningClips: ListeningClip[] = [...voiceClips, ...(videoClips as ListeningClip[])]
