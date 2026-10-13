// Backup of the project to a folder, normally the Google Drive folder (Drive for desktop syncs it to the cloud):
//   pnpm backup                         the Drive folder is found automatically (see below)
//   pnpm backup --to="G:\My Drive\SpellSprint-backups"
//   pnpm backup --with-env              also puts .env* files in the zip (they hold keys: only for a private Drive)
// What goes in: one zip of the working folder (code, content, docs, research, local .claude skills, database/ SQL files;
// without node_modules, dist, caches and the 100 MB Tatoeba download) and one git bundle with the whole history,
// including commits that are not pushed yet. The newest KEEP backups stay, older ones are removed (only files this script made).
// Not included: the Supabase database (users' progress). Export that from the Supabase dashboard, see docs/backup.md.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const args = process.argv.slice(2)
const arg = (name) => args.find((item) => item.startsWith(`--${name}=`))?.slice(name.length + 3)
const KEEP = Number(arg('keep') ?? 10)
const withEnv = args.includes('--with-env')

function findDriveFolder() {
  const names = ['My Drive', 'Мой диск']
  const candidates = []
  for (const letter of 'DEFGHIJKLMNOPQRSTUVWXYZ') for (const name of names) candidates.push(`${letter}:\\${name}`)
  for (const name of ['Google Drive', ...names]) candidates.push(join(homedir(), name))
  return candidates.find((path) => existsSync(path))
}

const target =
  arg('to') ?? process.env.SPELLSPRINT_BACKUP_DIR ?? (findDriveFolder() ? join(findDriveFolder(), 'SpellSprint-backups') : undefined)
if (!target) {
  console.log('Google Drive folder not found.')
  console.log('Install "Google Drive for desktop", sign in, then run again, or give the folder:')
  console.log('  pnpm backup --to="G:\\My Drive\\SpellSprint-backups"')
  console.log('or set SPELLSPRINT_BACKUP_DIR once (Windows: setx SPELLSPRINT_BACKUP_DIR "G:\\My Drive\\SpellSprint-backups").')
  process.exit(1)
}
mkdirSync(target, { recursive: true })

const stamp = new Date().toLocaleString('sv').replace(/[: ]/g, '-').slice(0, 16) // 2026-10-13-14-05
const zip = join(target, `spell-sprint-${stamp}.zip`)
const bundle = join(target, `spell-sprint-${stamp}.bundle`)

const skip = [
  'node_modules',
  'dist',
  '.netlify',
  '.git',
  'test-results',
  'playwright-report',
  '.arena',
  'arena-skill',
  'research/tatoeba',
  '.DS_Store',
  ...(withEnv ? [] : ['.env', '.env.*']),
]
const tarArgs = ['-a', '-c', '-f', zip, ...skip.flatMap((item) => ['--exclude', item]), '-C', root, '.']
console.log(`zip    -> ${zip}`)
// Windows has its own bsdtar (it writes zip); a tar from Git Bash would read "C:" as a host name.
const winTar = 'C:/Windows/System32/tar.exe'
execFileSync(process.platform === 'win32' && existsSync(winTar) ? winTar : 'tar', tarArgs, { stdio: 'inherit' })
console.log(`bundle -> ${bundle}`)
execFileSync('git', ['-C', root, 'bundle', 'create', bundle, '--all'], { stdio: 'inherit' })
const mb = (path) => (statSync(path).size / 1048576).toFixed(1)
console.log(`done: zip ${mb(zip)} MB, bundle ${mb(bundle)} MB${withEnv ? '' : ' (.env files left out)'}`)

// Keep the newest KEEP pairs, remove older ones made by this script.
const mine = readdirSync(target).filter((name) => /^spell-sprint-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}\.(zip|bundle)$/.test(name))
const stamps = [...new Set(mine.map((name) => name.slice(13, 29)))].sort().reverse()
for (const old of stamps.slice(KEEP))
  for (const ext of ['zip', 'bundle']) rmSync(join(target, `spell-sprint-${old}.${ext}`), { force: true })
if (stamps.length > KEEP) console.log(`removed ${stamps.length - KEEP} old backup(s), kept ${KEEP}`)
console.log('Restore: unzip the zip, run `pnpm install`; the history: `git clone spell-sprint-<stamp>.bundle spell-sprint`.')
