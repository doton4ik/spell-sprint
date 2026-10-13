# Ready prompts for Plexity (Perplexity)

Each file is one complete prompt: open a new chat, paste the whole file, send. One file = one round.

- `pairs-01.md … pairs-13.md` — 25 new sentences for each of 8 existing pairs (the pairs with the fewest sentences come first).
- `newpairs-01.md … newpairs-12.md` — 6 brand-new pairs per round, 25 sentences each (68 new pairs: A2 16, B1 20, B2 32).

The answer is JSON only. Save it as `research/pairs/batch-NN.json` (continue the numbering: batch-02, batch-03 …; batch-01 is done)
and tell Claude Code. It runs `node scripts/merge-pairs.mjs research/pairs/batch-NN.json`, shows what was rejected and why,
reads the sentences for ambiguity, then adds the good ones.

Tips: if an answer is cut off or Plexity repeats itself, ask for "the remaining pairs only" in the same chat. If a pair has an unclear
hint or meaning, Plexity should follow the rule line in the prompt.

Regenerate the files (after the pairs changed): `node scripts/make-plexity-prompts.mjs`.
