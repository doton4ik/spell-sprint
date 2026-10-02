import { getActiveCloudSession, isSupabaseConfigured, supabaseAuthedFetch } from './supabase'

// Learners flag built-in words that should not be in the library (database/word-reports.sql).
// A report is saved on the device first and sent when there is a signed-in session, like the
// mistake outbox; until then it waits here.

export type WordReportReason = 'strange' | 'not-useful' | 'too-specialised' | 'wrong-translation' | 'wrong-spelling' | 'other'
export const wordReportReasons: Array<{ id: WordReportReason; label: string }> = [
  { id: 'strange', label: 'Strange or unnatural' },
  { id: 'not-useful', label: 'Not worth learning' },
  { id: 'too-specialised', label: 'Too specialised' },
  { id: 'wrong-translation', label: 'Wrong translation' },
  { id: 'wrong-spelling', label: 'Mistake in the word or example' },
  { id: 'other', label: 'Something else' },
]
export type WordReport = { wordId: string; word: string; translation?: string; library?: string; reason: WordReportReason; comment?: string; at: string; sent?: boolean }

const KEY = 'spell-sprint.word-reports'
function read(): WordReport[] { try { const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }
function write(items: WordReport[]) { try { window.localStorage.setItem(KEY, JSON.stringify(items.slice(-200))) } catch { /* storage blocked */ } }

export const isWordReported = (wordId: string) => read().some((item) => item.wordId === wordId)

// Saves the report and tries to send it. Returns whether it already reached the server.
export async function reportWord(report: Omit<WordReport, 'at' | 'sent'>) {
  write([...read().filter((item) => item.wordId !== report.wordId), { ...report, comment: report.comment?.trim().slice(0, 500) || undefined, at: new Date().toISOString() }])
  await flushWordReports()
  return read().find((item) => item.wordId === report.wordId)?.sent === true
}

let flushing: Promise<void> | null = null
export function flushWordReports() {
  if (flushing) return flushing
  flushing = (async () => {
    try {
      const pending = read().filter((item) => !item.sent)
      if (!isSupabaseConfigured() || !pending.length) return
      const session = await getActiveCloudSession()
      if (!session) return
      for (const item of pending) {
        try {
          await supabaseAuthedFetch(session, '/rest/v1/word_reports?on_conflict=user_id,word_id', {
            method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({ user_id: session.user.id, word_id: item.wordId, word: item.word.slice(0, 120), translation: item.translation?.slice(0, 300) ?? null, library: item.library?.slice(0, 120) ?? null, reason: item.reason, comment: item.comment ?? null, updated_at: new Date().toISOString() }),
          })
          write(read().map((saved) => (saved.wordId === item.wordId ? { ...saved, sent: true } : saved)))
        } catch (error) {
          // A row the server refuses (bad data) is dropped; anything else (no table yet, no network) waits.
          const status = (error as { status?: number }).status
          if (status === 400 || status === 422) { write(read().map((saved) => (saved.wordId === item.wordId ? { ...saved, sent: true } : saved))); continue }
          console.warn('Word report kept on the device; will retry.', error)
          break
        }
      }
    } finally {
      flushing = null
    }
  })()
  return flushing
}
