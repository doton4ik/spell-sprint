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

## The three big jobs of October 2026 (prompts → answers → check → merge)
| Job | Prompts | Save the answers as | Check / merge |
|---|---|---|---|
| Topic and level of every word (done) | `prompts/topics-NN.md` (10) | `answers/topics/topics-NN.json` | `node scripts/merge-topics.mjs [--apply]`, fixes in `scripts/topic-fixes.mjs` and `level-changes.txt`, then `node scripts/apply-topic-map.mjs --write` |
| New words for every topic | `prompts/newwords-NN.md` (33), built by `scripts/make-newword-prompts.mjs` | `answers/newwords/newwords-NN.json` | `node scripts/merge-newwords.mjs [--apply]` adds the good words to the library CSV |
| Three times more examples and exercises for every rule | `prompts/rules3-NN.md` (43), built by `scripts/make-rule-prompts.mjs` | `answers/rules3/rules3-NN.json` | `node scripts/merge-rule-answers.mjs [--apply]` writes `database/rules-import/more-practice-pack-3.json`; then the pack builder makes the SQL for the user to run |

`pnpm check` runs `scripts/check-library.mjs` (topic, level, fields of every word) after a merge. Start a NEW chat for every prompt: a chat that
still holds the earlier task repeats its sentences.

## When Plexity cuts the answer off or eats the underscores
- Prompts are short and end with "How to answer": the whole answer in ONE code block, compact JSON, never stop mid-item.
- A cut-off answer is trimmed to the last complete item by the merge scripts; the rest can be asked for with "Continue ...".
- A gap shown as `_` instead of `___` is restored by the scripts.
- Every prompt starts with a banner naming exactly its items; the merge warns when an answer belongs to another prompt.
