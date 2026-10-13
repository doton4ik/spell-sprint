# Plan: many more example sentences for the Pairs exercise

For the agent who writes the content. Read this whole file, then `CLAUDE.md`, then start.

## 1. What this is and where we are

"Pairs" (page `#pairs`) trains words that sound or look alike (their / there / they're, affect / effect …).
Each task is one sentence with a gap `___` and 2–3 words to choose from. One right answer.

- Data: `src/data/pairDrills.ts` — `pairDrills: PairDrill[]`, each pair has `id`, `words` (2–3), `level` (A2/B1/B2),
  `meanings` (Russian gloss per word), `hint`, `sentences: { text, answer, source? }[]`.
- Checks: `scripts/check-pairs.mjs` (`pnpm check:pairs`, part of `pnpm check`).
- Runtime: `src/services/pairs.ts` — a session takes ~half as many pairs as tasks and 2 random sentences per pair
  (`shuffle(pair.sentences).slice(0, 2)`); "Practise this pair" shows all of a pair's sentences shuffled.
  A learner's history stores the sentence text (`PairAttempt.sentence`), so **never edit or delete an existing
  sentence text** — only add new ones.
- Today: 105 pairs (A2 39, B1 45, B2 21), about 606 sentences (≈ 5.8 per pair), 154 of them from Tatoeba
  (`source: 'tatoeba:<id>'`, CC BY 2.0 FR). Many pairs have only 4–6 sentences, so a learner sees the same sentence
  again after a few sessions and starts to remember the sentence instead of the rule.

## 2. Goal (numbers)

| Target | Minimum | Goal |
|---|---|---|
| Sentences per pair | 20 | 30–40 |
| Total sentences | about 2 500 | 3 500–4 000 |
| Every word of a pair is the answer | at least 8 times | balanced (see 4.3) |
| B2 pairs (only 21 now) | add new pairs | up to about 40 B2 pairs |
| New pairs | +40 | +80 (A2 +20, B1 +30, B2 +30) |

Do the work in this order: (1) tooling and checks, (2) raise every existing pair to 20, (3) new pairs,
(4) raise everything towards the goal. Commit after each batch.

## 3. Work method — batches, not one huge file

1. Create `research/plexity/answers/pairs/` (not part of the site build; changes there do not trigger a Netlify build).
2. Work in batches of **8–10 pairs**. For each batch write `research/plexity/answers/pairs/batch-NN.json`:
   `{ "pairId": "...", "add": [ { "text": "...", "answer": "..." } ] }` for existing pairs, and a full pair object for new pairs.
3. Write a merge script `scripts/merge-pairs.mjs` (run once per batch, idempotent): reads a batch file, appends new
   sentences to the matching pair in `src/data/pairDrills.ts` (skip a sentence whose normalised text already exists
   in ANY pair), appends new pairs at the end of their level group, and keeps the file formatted
   (`pnpm exec prettier --write src/data/pairDrills.ts`). Do not rewrite existing sentences.
   On Windows write scripts with the Write tool, not with shell heredocs (quotes break).
4. After every batch: `pnpm check:pairs`, then every 3–4 batches `pnpm check`.
5. Have the content reviewed (Opus advisor/agent) after each ~100 sentences, as with other content packs. Fix what the review finds
   before the next batch. Typical findings in earlier packs: ambiguous gaps, answer leaked by another word in the
   sentence, real-word "mistakes", duplicates.
6. Commit per 2–3 batches: clear message, ending with
   `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Never `git push` (the user pushes).

You write the sentences yourself — do not hand the writing to another tool or copy from the internet.
Tatoeba sentences are allowed as before (see 6).

## 4. Rules for a good sentence

### 4.1 One right answer, and it must be provable
A learner who knows the rule must be able to get it right with no extra context; a learner who does not must not be
able to get it right by guessing from grammar alone.

- **Exactly one option fits.** Read the sentence with each option. If two read naturally, reject it
  ("The ___ was cold" with *weather/whether*: only *weather* fits — good; "I will ___ it" with *accept/except*: only
  *accept* fits — good; "I like all fruit ___ bananas" works only with *except* — good).
- **The context must decide, not the grammar slot only.** For their/there/they're the slot already decides part
  of speech — good, but vary it: also use sentences where the learner has to read the meaning (e.g. *principal /
  principle*: "The school ___ welcomed the new students").
- **No leaks.** Do not use another form of the target word in the same sentence ("I will accept your offer, but
  I cannot ___ that excuse" is a leak). Do not repeat a word from the options elsewhere in the sentence.
- **No trick for its own sake.** No sentence that depends on a rare meaning or on British vs. American usage.
  If a pair has a regional difference (practice/practise, licence/license), state the rule in the hint, and write only
  sentences that work for the standard British rule used in the hint.
- **Natural and short:** 5–16 words (the check enforces it), exactly one `___`, ends with proper punctuation, starts with a capital.
- **Words must be at the pair's level** (A2 = everyday words, B1 = general topics, B2 = work, news, abstract).
  The *other* words of the sentence must be easy: the learner is tested on the pair, not on hard vocabulary.
- **No sensitive or odd content**: no politics, religion, violence, brand promotion, rude words. Neutral everyday life,
  study, work, travel, home, health, hobbies, technology, news.

### 4.2 Variety (the whole point of the task)
Per pair, with 30 sentences, aim for variety in:
- **Position of the gap**: beginning, middle, end of the sentence (not always the middle).
- **Sentence type**: statement, question, negative, imperative, with "if/because/when", short dialogue line.
- **Subject and tense**: not always "I/he", not always present simple.
- **Topic**: spread over home, school, work, travel, food, health, technology, nature, shopping, hobbies.
- **Form of the word where the pair allows** (plural/verb forms, e.g. *affect/effect*: verb and noun uses, *effects*).
- Never more than 2 sentences of the same pattern in a row, and no near-duplicates (same sentence, one word changed).
- Use first names sparingly; use a variety of names, places and things.

### 4.3 Balance of answers
- Each word of a pair is the answer at least 8 times and no more than 55 % of all sentences of that pair
  (for 2-word pairs: between 40 % and 60 %; for 3-word pairs: each between 20 % and 45 %).
- The order in which sentences are written must not follow a pattern (the app shuffles, but do not rely on it).

### 4.4 The hint and the meanings
- When you add a new pair: `meanings` gives a short Russian gloss for each word (as in existing pairs), `hint` is one line
  with the rule in English, in the style `their = belongs to them · there = place · they're = they are`.
- For existing pairs do not change `hint`/`meanings` unless wrong; if one is wrong or unclear, list it in your report instead of
  silently changing it.

## 5. New pairs — what to add

Add pairs that Russian speakers really confuse, and which are not in the file yet (check `id` and `words` first;
a word may appear in two pairs only when the contrast differs, e.g. *to/too/two* and *too/also*).

Families to cover (examples, not a closed list — find more):
- **Homophones**: so/sew/sow, wear/where/were, here/hear, whose/who's, weak/week, wait/weight, bare/bear, break/brake,
  dear/deer, flour/flower, hole/whole, knew/new, know/no, mail/male, meat/meet, one/won, peace/piece, plain/plane,
  principal/principle, right/write, sea/see, sight/site/cite, stair/stare, steal/steel, tail/tale, threw/through, waist/waste,
  way/weigh, which/witch, wood/would, you/ewe.
- **Look-alike verbs/nouns**: affect/effect, advice/advise, practice/practise, licence/license, device/devise, prophecy/prophesy,
  lie/lay, rise/raise, borrow/lend, fall/fell, sit/set, say/tell, hear/listen, look/see/watch, make/do, bring/take.
- **Often confused**: accept/except, access/excess, adapt/adopt, allusion/illusion, alter/altar, assure/ensure/insure, beside/besides,
  breath/breathe, cloth/clothe, complement/compliment, conscience/conscious, council/counsel, desert/dessert, elicit/illicit,
  emigrate/immigrate, loose/lose, later/latter, lightning/lightening, personal/personnel, precede/proceed, quiet/quite/quit,
  stationary/stationery, than/then, though/thought/through/tough, weather/whether.
- **Spelling/form pairs**: all ready/already, all together/altogether, every day/everyday, any one/anyone, maybe/may be,
  a lot/allot. Never use a non-word ("alot") as an option.
- **Prepositions and short words** that learners mix up with similar spelling: of/off, to/too, then/than, as/has, form/from,
  quiet/quite, were/where/wear/we're.
- **Russian-speaker traps** (look similar in Russian too): cite/site/sight, desert/dessert, principal/principle, expect/wait,
  fun/funny, historic/historical, economic/economical, sensible/sensitive, eventually/finally.

Each new pair needs at least 20 sentences straight away (same rules). Do not add a pair if you cannot write 20 good
unambiguous sentences for it. Options must be real English words that are really confusable (never a made-up
misspelling as a distractor in this exercise).

## 6. Tatoeba sentences

There is already a Tatoeba export in `research/tatoeba/`. You may use it to find extra natural sentences that contain
the pair's words (a lot of the 154 current ones come from there). Rules: take the English sentence, put `___` where
the answer is, add `source: 'tatoeba:<id>'`, keep the sentence unchanged apart from the gap. Apply every rule from
section 4 (many Tatoeba sentences are ambiguous or odd — reject those). Use Tatoeba for at most about **one third**
of the new sentences; the rest you write yourself, because written sentences can be tuned to the rule.

## 7. Checks to add to `scripts/check-pairs.mjs` (do this first)

Keep the old checks. Add:
1. **Minimum 20 sentences per pair** (after step 2 of the order; add the check as a warning first, then as an error once all pairs reach 20).
2. **No duplicate sentence text** (case-insensitive, punctuation-insensitive) inside a pair or across all pairs.
3. **No near-duplicates**: two sentences of the same pair that differ in only one word (after removing the gap) → fail.
4. **Answer balance** per pair (rules in 4.3).
5. **No leak**: the sentence text (outside the gap) must not contain any option of its own pair as a whole word
   (it hides the answer or confuses the learner). Whitelist with a comment in the script only where unavoidable.
6. **Gap sanity**: the sentence must start with a capital or `___`, end with `.`, `?` or `!`, no double spaces.
7. **Options really fit grammar slot** cannot be machine-checked; the human/Opus review covers it.
8. A summary line: number of sentences per level, the 10 pairs with the fewest sentences, the answer balance outliers.

## 8. Things not to do

- Do not edit/delete existing sentence texts, `id`s or `words` of existing pairs (learners' history refers to them).
- Do not change the app code, the Pairs page, or the review schedule. If you think something there must change, write it in the report.
- Do not touch the database; this content lives only in `src/data/pairDrills.ts`.
- Do not write `.env`/key values anywhere. Do not push.
- Do not mass-generate sentences with a template (same frame with different words): the check in 7.3 will catch it, but also do not try to avoid the check by trivial changes.
- Do not copy sentences from textbooks, dictionaries or websites.

## 9. Size and speed

3 500–4 000 sentences add roughly 250–350 KB of source to the Pairs chunk (it is lazy-loaded; the page prefetches when idle).
After the final batch run `pnpm build` and check the size of the Pairs chunk in the build output; report it. If the chunk is over 400 KB
minified, tell the user — a split by level (one file per level, loaded together) is the next step, but do not do it without asking.

## 10. Definition of done

- `pnpm check` passes (typecheck, lint, format, tests, all `check:*` scripts), including the new pair checks.
- `pnpm test:e2e` passes (builds first; on the user's PC `pnpm build` then `pnpm exec playwright test --retries=10 --workers=1` is needed because
  the network is flaky there).
- Every pair has at least 20 sentences; at least 80 % have 30+.
- Every word of every pair is the answer at least 8 times.
- A reviewer (Opus) has read a random 10 % sample of the new sentences and found no ambiguous gap; list what was fixed.
- A short report in Russian to the user: numbers before/after (pairs, sentences per level, min/median per pair), the new pairs
  list, Tatoeba share, bundle size, anything that is doubtful (hints that look wrong, pairs you dropped and why).
- All work committed in logical commits; nothing pushed.

## 11. First steps (copy this into the start of the session)

1. Read `src/data/pairDrills.ts` (top 100 lines and the list of ids), `scripts/check-pairs.mjs`, `src/services/pairs.ts`.
2. Write the new checks (section 7) in warning mode and run `pnpm check:pairs` to see the current numbers.
3. Write `scripts/merge-pairs.mjs`, test it on a copy of a tiny batch.
4. Make `research/plexity/answers/pairs/plan.md` with the list of pairs you will touch, the target per pair, and the list of new pairs.
5. Start batch 1 (the 8 pairs with the fewest sentences). After it call the reviewer.
