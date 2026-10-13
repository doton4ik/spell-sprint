# NEW, SEPARATE TASK (examples-04.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: the 18 words from phone-and-messages-texting-and-online-unread to describing-things-size-and-shape-deep.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

For each of the 18 words below write **one new example sentence**. Each word already has one example (after "e.g."); yours must show the word in a DIFFERENT situation.

- phone-and-messages-texting-and-online-unread | unread | непрочитанный | adjective | e.g. I have twenty unread messages.
- phone-and-messages-texting-and-online-block | block | блокировать | verb | e.g. You can block people who send spam.
- travel-and-culture-on-the-plane-landing | landing | приземление | noun | e.g. The landing was very smooth.
- travel-and-culture-on-the-plane-lifejacket | lifejacket | спасательный жилет | noun | e.g. There is a lifejacket under your seat.
- travel-and-culture-at-the-airport-boarding | boarding | посадка на борт | noun | e.g. Boarding starts thirty minutes before take-off.
- travel-and-culture-at-the-airport-carousel | carousel | багажная лента | noun | e.g. Our bags came out on carousel three.
- jobs-and-career-at-work-payslip | payslip | расчётный листок | noun | e.g. Check your payslip at the end of the month.
- school-and-learning-in-class-subject | subject | предмет (учебный) | noun | e.g. My favourite subject is history.
- school-and-learning-in-class-ruler | ruler | линейка | noun | e.g. Draw a line with a ruler.
- school-and-learning-in-class-term | term | четверть, триместр | noun | e.g. The summer term ends in July.
- city-and-transport-getting-around-cyclist | cyclist | велосипедист | noun | e.g. The road has a lane for cyclists.
- city-and-transport-traffic-and-directions-subway | subway | подземный переход | noun | e.g. Use the subway to cross the main road.
- technology-devices-and-software-virus | virus | вирус (компьютерный) | noun | e.g. A virus deleted all my files.
- technology-devices-and-software-cable | cable | кабель, провод | noun | e.g. Connect the cable to the back of the TV.
- technology-devices-and-software-icon | icon | значок, иконка | noun | e.g. Tap the camera icon to take a photo.
- shopping-paying-cheap | cheap | дешёвый | adjective | e.g. The bus is cheap but slow.
- describing-things-size-and-shape-wide | wide | широкий | adjective | e.g. The river is very wide here.
- describing-things-size-and-shape-deep | deep | глубокий | adjective | e.g. Be careful, the water is deep.

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
