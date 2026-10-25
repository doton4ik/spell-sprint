import videoClips from './listeningVideoClips.json'

// Short clips for listening dictation: the learner hears a line and writes it. Written by hand.
// A clip is read by the browser voice ('voice'). A clip from a video ('youtube') has the same lines, each with
// the second it starts and ends at, so the player can replay just that line.
export type ListeningLine = { text: string; start?: number; end?: number }
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
]

// Clips made from a video by scripts/make-clip.mjs come after the hand-written ones.
export const listeningClips: ListeningClip[] = [...voiceClips, ...(videoClips as ListeningClip[])]
