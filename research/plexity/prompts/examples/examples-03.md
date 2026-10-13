You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

For each of the 30 words below write **one new example sentence**. Each word already has one example (after "e.g."); yours must show the word in a DIFFERENT situation.

- describing-things-size-and-shape-circular | circular | круглый | adjective | e.g. We had dinner at a small circular table by the window.
- describing-things-size-and-shape-straight | straight | прямой | adjective | e.g. Draw a straight line from this point to the edge.
- describing-things-material-and-texture-sticky | sticky | липкий | adjective | e.g. My fingers are sticky because I ate a lot of honey.
- describing-things-quality-and-colour-beige | beige | бежевый | adjective | e.g. She wore a beige coat and brown boots.
- describing-things-quality-and-colour-excellent | excellent | отличный | adjective | e.g. Your English is excellent, and you speak very clearly.
- describing-things-quality-and-colour-ordinary | ordinary | обычный | adjective | e.g. It was an ordinary day, and nothing special happened.
- phone-and-messages-phone-basics-signal | signal | сигнал | noun | e.g. There is no signal in the mountains, so I cannot call.
- phone-and-messages-phone-basics-silent | silent | беззвучный | adjective | e.g. Put your phone on silent during the lesson, please.
- phone-and-messages-texting-and-online-forward | forward | пересылать | verb | e.g. Can you forward this email to the whole team?
- study-and-career-learning-and-research-tutor | tutor | репетитор, преподаватель | noun | e.g. My tutor helps me with my writing.
- study-and-career-learning-and-research-handout | handout | раздаточный материал | noun | e.g. The teacher gave us a handout with the main rules.
- study-and-career-career-development-workshop | workshop | мастер-класс, семинар | noun | e.g. I went to a writing workshop on Saturday.
- study-and-career-career-development-part-time | part-time | неполный рабочий день | adjective | e.g. She has a part-time job in a café.
- travel-and-culture-travel-planning-customs | customs | таможня | noun | e.g. We waited an hour to go through customs.
- common-actions-out-and-about-knock | knock | стучать | verb | e.g. Please knock before you come in.
- common-actions-out-and-about-hurry | hurry | спешить, торопиться | verb | e.g. We must hurry or we will be late.
- common-actions-at-home-dust | dust | вытирать пыль | verb | e.g. I dust the shelves once a week.
- common-actions-everyday-phrasal-verbs-check-in | check in | регистрироваться (в отеле, аэропорту) | phrase | e.g. We can check in after two o'clock.
- common-actions-everyday-phrasal-verbs-check-out | check out | выписываться (из отеля) | phrase | e.g. We have to check out by eleven.
- common-actions-everyday-phrasal-verbs-turn-up | turn up | прибавлять (громкость) | phrase | e.g. Can you turn up the radio?
- common-actions-everyday-phrasal-verbs-go-on | go on | продолжаться, происходить | phrase | e.g. Please go on, I'm listening.
- general-english-commonly-misspelled-maintenance | maintenance | техническое обслуживание | noun | e.g. The lift is closed for maintenance.
- general-english-commonly-misspelled-existence | existence | существование | noun | e.g. Do you believe in the existence of ghosts?
- general-english-commonly-misspelled-height | height | рост, высота | noun | e.g. What is the height of that tower?
- general-english-commonly-misspelled-humorous | humorous | юмористический, смешной | adjective | e.g. He wrote a humorous story about his cat.
- general-english-commonly-misspelled-guarantee | guarantee | гарантия | noun | e.g. The phone comes with a two-year guarantee.
- phone-and-messages-phone-basics-contact | contact | контакт (в телефоне) | noun | e.g. Save her number as a new contact.
- phone-and-messages-phone-basics-speaker | speaker | динамик | noun | e.g. Put the call on speaker so we can all hear.
- phone-and-messages-phone-basics-unlock | unlock | разблокировать | verb | e.g. Use your fingerprint to unlock the screen.
- phone-and-messages-calls-dial | dial | набирать (номер) | verb | e.g. Dial the number slowly and carefully.

## Rules for the sentence

- 6-16 words, natural, with a capital letter and a full stop or question mark.
- It must contain the word **exactly in the form written in the list** (no plural, no past tense, no other word form). The sentence will later be used with a gap, so there must be one clear right word for the gap: if two different words of the same kind fit, change the sentence.
- The meaning must match the Russian translation, the part of speech and the first example. Easy surrounding words (the learner is tested on the target word).
- A different topic or situation from the first example, not just the same sentence with one word changed.
- Neutral content. No names of brands, politics, religion, violence.

## Output format

[
  {"word_id": "travel-and-culture-on-the-plane-crew", "extra_example": "The crew checked every seat before take-off."}
]

Use the word_id exactly as written. Before you answer, check each sentence: it contains the word in the listed form and no other word could fill the gap.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
