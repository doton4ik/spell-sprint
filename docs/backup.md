# Backup to Google Drive

Two different things can be lost: the **project** (code, content, SQL files, notes) and the **users' data** in Supabase.

## 1. The project → Google Drive (`pnpm backup`)

One-time setup:
1. Install **Google Drive for desktop** and sign in. It adds a drive (for example `G:\My Drive`, or `Мой диск`).
2. Run in the project folder:
   ```
   pnpm backup
   ```
   The script finds the Drive folder itself and makes `SpellSprint-backups` in it. If it cannot find it, give the folder once:
   ```
   pnpm backup --to="G:\My Drive\SpellSprint-backups"
   ```
   or set it for good (Windows): `setx SPELLSPRINT_BACKUP_DIR "G:\My Drive\SpellSprint-backups"` and reopen the terminal.

What one backup is (two files with the same time stamp, in the Drive folder):
- `spell-sprint-<time>.zip` — the working folder: `src`, `database` (SQL files), `docs`, `research`, `scripts`, local `.claude` skills, config.
  Left out: `node_modules`, `dist`, caches, `.git`, the 100 MB Tatoeba download (it can be downloaded again), and the **`.env` files**.
- `spell-sprint-<time>.bundle` — the whole git history, including commits that are **not pushed** to GitHub yet.
- The newest 10 backups are kept; older ones are removed (only files named by this script).

`.env` holds keys. By default it is NOT copied. If your Drive is private and you want it in the backup, add `--with-env`.
Keep the Supabase keys also in a password manager, so that the project can be started again after a loss.

Restore: unzip the zip, `pnpm install`. For the history: `git clone spell-sprint-<time>.bundle spell-sprint`.

Automatic daily backup (you run this once in a terminal; it creates a Windows scheduled task, change the time if you like):
```
schtasks /create /sc daily /st 21:00 /tn "SpellSprint backup" /tr "cmd /c cd /d E:\proj\spellsprint && pnpm backup"
```
Remove it later: `schtasks /delete /tn "SpellSprint backup"`. The PC must be on at that time (or the task runs at the next start if you add `/z`-style options in Task Scheduler).

## 2. Users' data (Supabase) — not covered by `pnpm backup`

The progress of signed-in learners lives in the Supabase project "SpellSprint". Claude Code cannot export it (it has read-only access
and never uses the service key). Options for you:
- **Supabase dashboard → Database → Backups.** Daily backups are part of paid plans; on the free plan they are not. Check your plan.
- **Table export:** Dashboard → Table Editor → pick a table → Export (CSV). Do it for the tables with learner data. Drop the CSV files in the Drive folder.
- **Full dump** (needs the database password, `supabase` CLI): `supabase db dump --db-url "<connection string>" -f dump.sql`. Never paste the connection string in chat or commit it.

Learners' own devices also keep a local copy and a cloud snapshot, so most progress survives; a real backup protects against a bad migration or a deleted project.

## 3. Habit

- Run `pnpm backup` before a big change (a migration, a content merge) and after `git push`.
- Once in a while open the Drive folder and check that new files appear and that the zip opens.
