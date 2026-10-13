# Start here — what to paste into Plexity

All ready prompts are in THIS folder. One file = one round = one new chat.

## How, every time
1. Open the file, select ALL text (it begins with `# NEW, SEPARATE TASK (...)`), copy.
2. Paste into a NEW Plexity chat (not the one where you did the previous file).
3. Copy the answer (the code block) and save it in `research/plexity/answers/` with the SAME name as the prompt, ending in `.json`:
   `rules-02.md` -> `answers/rules-02.json`. Then tell Claude Code "check new files".
4. If the chat cuts the answer off, save what you have anyway, then write "Continue from the next item, same JSON format" and save the rest
   as `rules-02-part2.json`.

## Order (do the top ones first)
| # | Files | What | Done so far |
|---|---|---|---|
| 1 | `rules-02.md` … `rules-21.md` | examples and exercises for the rules (2 rules per file) | rules-01 only (accept/except, -able/-ible) |
| 2 | `words-01.md` … `words-19.md` | new library words (4 topics per file) | none |
| 3 | `pairs-01.md` … `pairs-12.md` | more sentences for the existing pairs | pairs are partly done (older files) |
| 4 | `examples-02.md` … `examples-04.md` | a second example sentence for words | examples-01 done |
| 5 | `newpairs-01.md` … (optional) | new pairs | not needed now |
| - | `level-1-A2.md` … `level-4-C1.md` | level-check questions | enough for now; C1/B2 need a lot of review |

Old prompts (word quality) moved to `research/plexity/archive/`.
