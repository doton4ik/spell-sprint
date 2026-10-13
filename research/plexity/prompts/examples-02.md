# NEW, SEPARATE TASK (examples-02.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: the 30 words from shopping-banking-balance to animals-animal-life-bite.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

For each of the 30 words below write **one new example sentence**. Each word already has one example (after "e.g."); yours must show the word in a DIFFERENT situation.

- shopping-banking-balance | balance | баланс счёта | noun | e.g. Check your balance before making a big purchase.
- shopping-banking-overdraft | overdraft | овердрафт | noun | e.g. The bank allowed a small overdraft that month.
- shopping-banking-interest-rate | interest rate | процентная ставка | noun | e.g. The interest rate on the loan seemed quite high.
- shopping-banking-pin-code | PIN code | пин-код | noun | e.g. Never share your PIN code with anyone else.
- shopping-banking-statement | statement | выписка по счёту | noun | e.g. I checked my bank statement for any mistakes.
- school-and-learning-in-class-discussion | discussion | обсуждение | noun | e.g. The class discussion lasted almost an hour.
- school-and-learning-exams-revision | revision | повторение материала | noun | e.g. I spent the weekend doing revision for maths.
- school-and-learning-exams-pass | pass | сдать экзамен | verb | e.g. She worked hard to pass the final exam.
- school-and-learning-exams-fail | fail | провалить экзамен | verb | e.g. He was worried he might fail the driving test.
- school-and-learning-exams-mark | mark | оценка, отметка | noun | e.g. The teacher gave a good mark for the essay.
- school-and-learning-exams-cheat | cheat | списывать на экзамене | verb | e.g. Students who cheat can lose all their marks.
- school-and-learning-exams-certificate | certificate | сертификат, аттестат | noun | e.g. She proudly framed her graduation certificate on the wall.
- common-actions-at-home-vacuum | vacuum | пылесосить | verb | e.g. I usually vacuum the carpet on Saturday morning.
- common-actions-out-and-about-catch-up-with | catch up with | пообщаться, узнать новости (друг друга); догнать | phrase | e.g. Let's meet soon to catch up with each other.
- clothes-and-appearance-clothing-items-collar | collar | воротник | noun | e.g. He turned up his collar because the wind was so cold.
- clothes-and-appearance-clothing-items-button | button | пуговица | noun | e.g. One button on my coat came off yesterday.
- clothes-and-appearance-clothing-items-fit | fit | подходить по размеру, сидеть (об одежде) | verb | e.g. These shoes are too small and they do not fit me.
- clothes-and-appearance-looks-and-grooming-casual | casual | повседневный | adjective | e.g. I prefer casual clothes to formal ones at weekends.
- clothes-and-appearance-looks-and-grooming-scruffy | scruffy | неопрятный, потрёпанный | adjective | e.g. His scruffy jacket had a big hole in the elbow.
- family-and-relationships-friends-and-partners-fall-out-with | fall out with | поссориться с | phrase | e.g. I never want to fall out with my best friend.
- family-and-relationships-life-events-adopt | adopt | усыновить, удочерить; взять (питомца) | verb | e.g. They decided to adopt a little girl from another country.
- hobbies-and-free-time-creative-hobbies-craft | craft | ремесло, рукоделие | noun | e.g. We made a paper bird in the craft lesson at school.
- city-and-transport-traffic-and-directions-pedestrian | pedestrian | пешеход | noun | e.g. A pedestrian must use the crossing to get over the road safely.
- city-and-transport-traffic-and-directions-opposite | opposite | напротив | preposition | e.g. The bank is opposite the supermarket, next to the bus stop.
- city-and-transport-traffic-and-directions-park | park | парковать(ся) | verb | e.g. You cannot park here because there is a sign.
- animals-pets-and-farm-animals-sheep | sheep | овца, овцы | noun | e.g. One sheep escaped from the farm and walked down the road.
- animals-pets-and-farm-animals-lead | lead | поводок | noun | e.g. Keep your dog on a lead near the busy road.
- animals-animal-life-tail | tail | хвост | noun | e.g. The dog wagged its tail when it saw me.
- animals-animal-life-hunt | hunt | охотиться | verb | e.g. Lions hunt at night when it is cooler.
- animals-animal-life-bite | bite | кусать | verb | e.g. Be careful, that dog might bite you if you touch it.

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
