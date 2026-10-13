# Plexity (Perplexity) — everything for working with it in one place

```
research/plexity/
  README.md              this file
  prompts/               ALL ready prompts, in one folder. Start with prompts/START-HERE.md
  answers/               what Plexity answered: save a file here with the same name as the prompt, ending in .json
                         (older answers are in subfolders pairs/, words/, rules/, ...; new ones can go straight here)
  templates/             the rules and long prompts the ready ones are built from
  inputs/                data that old prompts were built from
  archive/               old prompts that are done (word quality)
```

## Who does what
You paste a prompt, save the answer, say "check new files". Claude Code runs the checks and the merge, has the content reviewed by Opus, adds the good items,
and runs `pnpm check`. The SQL files for rules (`database/content-pack-5-...`) are run by you in the Supabase SQL Editor.

## Commands (Claude Code runs these)
- Prompts: `node scripts/make-plexity-prompts.mjs` (pairs), `node scripts/plexity-rules.mjs prompts`, `node scripts/plexity-content.mjs prompts words|examples|level`.
- Merge: `node scripts/merge-pairs.mjs <file>`, `node scripts/plexity-rules.mjs merge <file>`, `node scripts/plexity-content.mjs merge words|examples|level <file>`; add `--apply` to write.

## When Plexity cuts the answer off or eats the underscores
- Prompts are short and end with "How to answer": the whole answer in ONE code block, compact JSON, never stop mid-item.
- A cut-off answer is trimmed to the last complete item by the merge scripts; the rest can be asked for with "Continue ...".
- A gap shown as `_` instead of `___` is restored by the scripts.
- Every prompt starts with a banner naming exactly its items; the merge warns when an answer belongs to another prompt.
