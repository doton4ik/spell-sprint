# Start here — what to paste into Plexity

All ready prompts are in THIS folder. One file = one round = one new chat.

## How, every time
1. Open the file, select ALL text (it begins with `# NEW, SEPARATE TASK (...)`), copy.
2. Paste into a NEW Plexity chat (not the one where you did the previous file).
3. Copy the answer (the code block) and save it in `research/plexity/answers/` with the SAME name as the prompt, ending in `.json`:
   `rules-02.md` -> `answers/rules-02.json`. Then tell Claude Code "check new files".
4. If the chat cuts the answer off, save what you have anyway, then write "Continue from the next item, same JSON format" and save the rest
   as `rules-02-part2.json`.

## Order (do the top ones first) — status 13 Oct 2026
| # | Files | What | Done so far |
|---|---|---|---|
| 1 | `rules-07.md` … `rules-21.md` | examples and exercises for the rules (2 rules per file). Do first **07, 08, 10, 14, 15, 17** (1 exercise each), then 09, 11, 16, 18–21 | rules-01 … rules-06 are done (12 rules), and rules-12 and rules-13 were written by Claude Code itself (quiet/quite, silent-letters, stationary/stationery, -ful) — do not paste these 8 again |
| 2 | `words-01.md` … `words-19.md` | new library words (4 topics per file) | none |
| 3 | `pairs-01.md` … `pairs-12.md` | more sentences for the existing pairs | pairs are partly done (older files); 11 pairs still have 6–7 sentences |
| 4 | `examples-01.md` … `examples-04.md` | a second example sentence for words (DONE, do not paste) | all 966 words now have a second example (the last 108 were written by Claude Code) |
| 5 | `newpairs-01.md` … (optional) | new pairs | not needed now |
| - | `level-1-A2.md` … `level-4-C1.md` | level-check questions | enough for now; C1/B2 need a lot of review |

Old prompts (word quality) moved to `research/plexity/archive/`.
