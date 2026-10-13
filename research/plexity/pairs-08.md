
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### late-lately (level B1)
Words: late / lately
Meaning: late = поздно; опоздавший; lately = в последнее время
Rule: late = not on time, near the end · lately = recently
Existing sentences (do not repeat these ideas):
    - The bus was ___ again this morning.  [late]
    - Have you seen Maria ___?  [lately]
    - I stayed up ___ finishing the essay.  [late]
    - Sales have improved ___ at our shop.  [lately]
    - Sorry I'm ___; the traffic was awful.  [late]

### hard-hardly (level B1)
Words: hard / hardly
Meaning: hard = усердно; твёрдый, трудный; hardly = едва, почти не
Rule: hard = with effort (work hard) · hardly = almost not (I could hardly hear)
Existing sentences (do not repeat these ideas):
    - She works very ___ before every exam.  [hard]
    - I could ___ hear him on the phone.  [hardly]
    - The ground was ___ after the frost.  [hard]
    - We had ___ any milk left.  [hardly]
    - They train ___ all winter.  [hard]

### actual-topical (level B2)
Words: actual / topical
Meaning: actual = фактический, настоящий; topical = актуальный, злободневный
Rule: "актуальный" is topical or current — never actual (= real)
Existing sentences (do not repeat these ideas):
    - We need the ___ figures, not guesses.  [actual]
    - The programme discussed several ___ issues.  [topical]
    - The ___ distance was shorter than the map showed.  [actual]
    - Climate change remains a highly ___ subject.  [topical]
    - Tell me the ___ reason you left early.  [actual]

### fabric-factory (level B2)
Words: fabric / factory
Meaning: fabric = ткань; factory = фабрика, завод
Rule: "фабрика" is a factory · fabric is ткань
Existing sentences (do not repeat these ideas):
    - This dress is made of soft cotton ___.  [fabric]
    - My uncle works in a car ___.  [factory]
    - The sofa ___ feels rough.  [fabric]
    - The old ___ closed last winter.  [factory]
    - Silk is an expensive ___.  [fabric]

### custom-habit (level B2)
Words: custom / habit
Meaning: custom = обычай; habit = привычка
Rule: custom = a tradition of a group · habit = something one person often does
Existing sentences (do not repeat these ideas):
    - Drinking tea at four is a local ___.  [custom]
    - Biting his nails is a bad ___.  [habit]
    - In this village, it's a wedding ___.  [custom]
    - She got into the ___ of running early.  [habit]
    - Removing shoes indoors is a common ___.  [custom]

### policy-politics (level B2)
Words: policy / politics
Meaning: policy = политика, правила (организации); politics = политика (государство, партии)
Rule: policy = a plan or rules (refund policy) · politics = government and parties
Existing sentences (do not repeat these ideas):
    - The company changed its holiday ___.  [policy]
    - He never talks about ___ at family dinners.  [politics]
    - What's your school's phone-use ___?  [policy]
    - She studied ___ at university.  [politics]
    - Our refund ___ is printed on the receipt.  [policy]

### choice-chance (level B1)
Words: choice / chance
Meaning: choice = выбор; chance = шанс, вероятность
Rule: choice = choosing between options · chance = a possibility
Existing sentences (do not repeat these ideas):
    - You have no ___ but to apologise.  [choice]
    - There's a good ___ of rain later.  [chance]
    - Blue was an easy ___ for the walls.  [choice]
    - Is there any ___ I can change my seat?  [chance]
    - The menu offers plenty of ___ for vegetarians.  [choice]

### say-speak (level A2)
Words: say / speak
Meaning: say = сказать (слова); speak = говорить (языком, с кем-то)
Rule: say + the words (say hello) · speak + a language, or speak to someone
Existing sentences (do not repeat these ideas):
    - What did she ___ about the meeting?  [say]
    - Could I ___ to Mr Brown now?  [speak]
    - Don't ___ anything to upset him.  [say]
    - He can ___ three languages well.  [speak]
    - I didn't know what to ___.  [say]

## Rules for every sentence

1. **Exactly one `___`**, and exactly one option fits. Read the sentence with every option: if two sound natural, drop it.
2. **The context must decide the answer.** A learner who knows the rule gets it right; one who doesn't can't guess from grammar alone.
3. **No leaks:** the sentence must not contain any other option of the same pair, or another form of the answer word.
4. **5–16 words**, starts with a capital letter (or with `___`), ends with `.`, `?` or `!`, no double spaces.
5. **Easy surrounding vocabulary.** The learner is tested on the pair, not on hard words. The level of the pair (A2 / B1 / B2)
   sets the level of the other words: A2 = everyday words, B1 = general topics, B2 = work, news, abstract.
6. **Neutral content**: everyday life, school, work, travel, home, food, health, hobbies, technology, nature, shopping.
   No politics, religion, violence, brands, rude words.
7. **Variety**, per pair: the gap at the start, middle and end; statements, questions, negatives, commands, "if / because / when" sentences,
   short dialogue lines; different subjects, tenses and topics; different names. Never two sentences with the same frame
   and one changed word. Do not follow a template.
8. **Balance:** each word of the pair is the answer a similar number of times (for 2 words about 50/50;
   for 3 words about a third each). Mix the order, no pattern.
9. Use only real English words as options. Never invent misspellings. Use standard British rules where the pair differs
   between British and American usage (practice/practise, licence/license), and write only sentences that are correct under
   the British rule.
10. Write the sentences yourself. Do not copy from textbooks, dictionaries or websites.


## Output format — JSON only, nothing else

```json
[
  {
    "pairId": "their-there-theyre",
    "add": [
      { "text": "The kids left ___ shoes by the door.", "answer": "their" },
      { "text": "___ a good chance it will rain tonight.", "answer": "there" }
    ]
  }
]
```

- `pairId` must be exactly an id from the list.
- `answer` must be exactly one of the pair's words, spelled the same as in the list (including apostrophes, e.g. `they're`).
- No comments, no markdown outside the code block, no explanations.


## Before you answer, check yourself

For each sentence: (a) test every option in the gap, (b) confirm only one works, (c) confirm no leak (rule 3), (d) count words
(5–16), (e) confirm no sentence is a near copy of another one in your answer. Remove any sentence that fails.

