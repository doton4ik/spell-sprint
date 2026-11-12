// British and American spellings of the same word ("colour" / "color", "organise" / "organize", "travelled" /
// "traveled"). In a dictation both are what the speaker said, so Listening accepts either. Every word is turned into
// one spelling (the American one) before it is compared. Only listed words change: "surprize" stays a mistake.

// colour -> color, and every word that starts with one of these (colourful, neighbourhood, favourite)
const OUR = [
  'armour',
  'behaviour',
  'candour',
  'colour',
  'endeavour',
  'favour',
  'flavour',
  'harbour',
  'honour',
  'humour',
  'labour',
  'neighbour',
  'odour',
  'parlour',
  'rigour',
  'rumour',
  'saviour',
  'splendour',
  'tumour',
  'vapour',
  'vigour',
]

// organise -> organize, with the endings below (organised, organising, organisation, organiser)
const ISE = [
  'apologis',
  'authoris',
  'capitalis',
  'categoris',
  'centralis',
  'characteris',
  'civilis',
  'commercialis',
  'computeris',
  'criticis',
  'customis',
  'digitis',
  'emphasis',
  'equalis',
  'familiaris',
  'fantasis',
  'finalis',
  'generalis',
  'globalis',
  'harmonis',
  'hospitalis',
  'initialis',
  'jeopardis',
  'legalis',
  'localis',
  'maximis',
  'memoris',
  'minimis',
  'mobilis',
  'modernis',
  'monetis',
  'neutralis',
  'normalis',
  'optimis',
  'organis',
  'penalis',
  'personalis',
  'popularis',
  'prioritis',
  'privatis',
  'publicis',
  'realis',
  'recognis',
  'socialis',
  'specialis',
  'stabilis',
  'standardis',
  'summaris',
  'symbolis',
  'sympathis',
  'utilis',
  'visualis',
]
const ISE_ENDINGS = ['e', 'es', 'ed', 'ing', 'er', 'ers', 'ation', 'ations', 'able']
// analyse -> analyze (but "analysis" and "analyst" are the same in both)
const YSE = ['analys', 'paralys']
const YSE_ENDINGS = ['e', 'es', 'ed', 'ing', 'er', 'ers']

// Whole words: British -> American
const WORDS: Record<string, string> = {
  acknowledgement: 'acknowledgment',
  aeroplane: 'airplane',
  aeroplanes: 'airplanes',
  afterwards: 'afterward',
  ageing: 'aging',
  aluminium: 'aluminum',
  analogue: 'analog',
  appal: 'appall',
  burnt: 'burned',
  calibre: 'caliber',
  cancelled: 'canceled',
  cancelling: 'canceling',
  catalogue: 'catalog',
  catalogues: 'catalogs',
  centimetre: 'centimeter',
  centimetres: 'centimeters',
  centre: 'center',
  centred: 'centered',
  centres: 'centers',
  cosy: 'cozy',
  counselling: 'counseling',
  counsellor: 'counselor',
  counsellors: 'counselors',
  defence: 'defense',
  defences: 'defenses',
  dialled: 'dialed',
  dialling: 'dialing',
  dialogue: 'dialog',
  dialogues: 'dialogs',
  distil: 'distill',
  doughnut: 'donut',
  doughnuts: 'donuts',
  dreamt: 'dreamed',
  enrol: 'enroll',
  enrolment: 'enrollment',
  fibre: 'fiber',
  fibres: 'fibers',
  fuelled: 'fueled',
  fuelling: 'fueling',
  fulfil: 'fulfill',
  fulfilment: 'fulfillment',
  grey: 'gray',
  instalment: 'installment',
  instalments: 'installments',
  instil: 'instill',
  jewellery: 'jewelry',
  judgement: 'judgment',
  judgements: 'judgments',
  kilometre: 'kilometer',
  kilometres: 'kilometers',
  labelled: 'labeled',
  labelling: 'labeling',
  leapt: 'leaped',
  learnt: 'learned',
  levelled: 'leveled',
  licence: 'license',
  licences: 'licenses',
  litre: 'liter',
  litres: 'liters',
  manoeuvre: 'maneuver',
  manoeuvres: 'maneuvers',
  marvellous: 'marvelous',
  maths: 'math',
  metre: 'meter',
  metres: 'meters',
  millimetre: 'millimeter',
  millimetres: 'millimeters',
  modelled: 'modeled',
  modelling: 'modeling',
  mould: 'mold',
  moustache: 'mustache',
  mum: 'mom',
  mummy: 'mommy',
  offence: 'offense',
  offences: 'offenses',
  ok: 'okay',
  omelette: 'omelet',
  plough: 'plow',
  practise: 'practice',
  practised: 'practiced',
  practises: 'practices',
  practising: 'practicing',
  pretence: 'pretense',
  programme: 'program',
  programmes: 'programs',
  pyjamas: 'pajamas',
  quarrelled: 'quarreled',
  sceptic: 'skeptic',
  sceptical: 'skeptical',
  signalled: 'signaled',
  signalling: 'signaling',
  skilful: 'skillful',
  sombre: 'somber',
  speciality: 'specialty',
  spelt: 'spelled',
  sulphur: 'sulfur',
  theatre: 'theater',
  theatres: 'theaters',
  totalled: 'totaled',
  towards: 'toward',
  travelled: 'traveled',
  traveller: 'traveler',
  travellers: 'travelers',
  travelling: 'traveling',
  tyre: 'tire',
  tyres: 'tires',
  wilful: 'willful',
  yoghurt: 'yogurt',
}

// One spelling for a plain word (lower case). A word that is not listed comes back unchanged.
export function americanSpelling(word: string): string {
  const cut = word.endsWith("'s") ? -2 : word.endsWith("s'") ? -1 : 0
  const base = cut ? word.slice(0, cut) : word
  const tail = cut ? word.slice(cut) : ''
  if (Object.hasOwn(WORDS, base)) return WORDS[base] + tail
  const our = OUR.find((stem) => base.startsWith(stem))
  if (our) return `${our.slice(0, -3)}or${base.slice(our.length)}${tail}`
  for (const [stems, endings] of [
    [ISE, ISE_ENDINGS],
    [YSE, YSE_ENDINGS],
  ])
    for (const stem of stems)
      if (base.startsWith(stem) && endings.includes(base.slice(stem.length)))
        return `${stem.slice(0, -1)}z${base.slice(stem.length)}${tail}`
  return word
}

// A sentence with every word in one spelling, for comparing (case and punctuation are handled by the caller).
export const inOneSpelling = (text: string) =>
  text
    .split(/\s+/)
    .map((word) => {
      // punctuation around the word stays where it is
      const [, before, core, after] = /^([^A-Za-z']*)(.*?)([^A-Za-z']*)$/.exec(word) ?? ['', '', word, '']
      const changed = americanSpelling(core.toLocaleLowerCase().replace(/[’‘`]/g, "'"))
      return changed === core.toLocaleLowerCase().replace(/[’‘`]/g, "'") ? word : `${before}${changed}${after}`
    })
    .join(' ')
