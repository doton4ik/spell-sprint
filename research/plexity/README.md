# Plexity (Perplexity) — everything for working with it in one place

```
research/plexity/
  README.md              this file
  templates/             the rules and the long prompts (the source the ready prompts are built from)
    pairs.md             rules for Pairs sentences
    word-quality.md      word-quality review prompt
    deep-analysis.txt    deep analysis prompt
  prompts/               READY prompts: open a file, copy it all, paste it into a new Plexity chat
    pairs/               pairs-NN.md (more sentences for existing pairs), newpairs-NN.md (new pairs)
    word-quality/        prompt-NN.txt (+ pairs.txt, grammar-errors.txt)
  answers/               what Plexity answered, saved here; Claude Code checks and merges it
    pairs/               batch-NN.json, review-*.json, skip-*.json, existing-pairs.txt
    word-quality/        batch-NN.csv
  inputs/                data that prompts were built from
    word-quality-batches/
```

## Pairs

1. Paste a prompt from `prompts/pairs/` into a new chat. One file = one round.
2. Save the JSON answer as `answers/pairs/batch-NN.json` (next free number) and tell Claude Code.
3. Claude Code runs `node scripts/merge-pairs.mjs research/plexity/answers/pairs/batch-NN.json`, reads the rejects, has the sentences
   reviewed for ambiguity, then adds the good ones.
4. After the pairs change, rebuild the prompts: `node scripts/make-plexity-prompts.mjs`.

New kinds of tasks get their own folder in `prompts/` and `answers/` (for example `words/`, `examples/`, `level-check/`).

## Words, second examples, level-check questions

All three use one script: `scripts/plexity-content.mjs`.

| What | Prompts (paste into Plexity) | Save the answer as | Check and merge (Claude Code runs this) |
|---|---|---|---|
| New library words (10 per slot, 74 slots, 13 rounds) | `prompts/words/words-NN.md` | `answers/words/words-NN.json` | `node scripts/plexity-content.mjs merge words <file> [--apply]` |
| A second example for words that have none (144 words, 4 rounds) | `prompts/examples/examples-NN.md` | `answers/examples/examples-NN.json` | `... merge examples <file> [--apply]` |
| Level-check questions (A2, B1, B2, C1; about 30 each) | `prompts/level-check/level-N-XX.md` | `answers/level-check/level-N-batch-NN.json` | `... merge level <file> --batch=NN [--apply]` |

Rebuild the prompts after the data changed: `node scripts/plexity-content.mjs prompts words|examples|level`.
After a merge Claude Code runs `pnpm check` and has the content reviewed (Russian translations and ambiguous questions need a second pair of eyes).
Second examples are saved with the source `written`; they also give each such word a second gap sentence in "Fill the gap".
