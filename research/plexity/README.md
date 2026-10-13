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
