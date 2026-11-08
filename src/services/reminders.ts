// Daily practice reminder, only in the store apps (Android / iOS, through Capacitor). On the website there is no reminder.
// Local notifications: nothing is sent from a server and no data leaves the device.
// The next 14 days are scheduled one by one, so a day that is already finished can be skipped (today's reminder is dropped
// once the plan is done). The app re-plans them every time it opens or comes back to the front.
import { Capacitor } from '@capacitor/core'
import { safeSetItem } from './safeStorage'

const KEY = 'spell-sprint.reminders'
export const REMINDER_DAYS = 14
const ID_BASE = 7000

export type ReminderSettings = { enabled: boolean; time: string } // time = "HH:MM", 24 hours
export const defaultReminder: ReminderSettings = { enabled: false, time: '19:00' }

export const remindersAvailable = () => Capacitor.isNativePlatform()

export function isValidTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function getReminder(): ReminderSettings {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Partial<ReminderSettings>
    return { enabled: stored.enabled === true, time: isValidTime(stored.time) ? stored.time : defaultReminder.time }
  } catch {
    return defaultReminder
  }
}

export function saveReminder(settings: ReminderSettings) {
  safeSetItem(KEY, JSON.stringify(settings))
}

/** The moments to notify: that time on each of the next days, never one already past, today's skipped when today is done. */
export function reminderMoments(now: Date, time: string, doneToday: boolean, days = REMINDER_DAYS): Date[] {
  const [hour, minute] = time.split(':').map(Number)
  const moments: Date[] = []
  for (let offset = 0; offset < days; offset++) {
    const moment = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute, 0, 0)
    if (moment.getTime() <= now.getTime() + 30_000) continue // already past (or about to be)
    if (offset === 0 && doneToday) continue
    moments.push(moment)
  }
  return moments
}

/** Ask for permission when needed. Returns true when notifications are allowed. */
export async function ensureReminderPermission() {
  if (!remindersAvailable()) return false
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  const current = await LocalNotifications.checkPermissions()
  if (current.display === 'granted') return true
  if (current.display === 'denied') return false
  return (await LocalNotifications.requestPermissions()).display === 'granted'
}

/** Replace all scheduled reminders with the ones the settings ask for. Never throws: a failed reminder must not break the app. */
export async function syncReminders(doneToday: boolean, now = new Date()) {
  if (!remindersAvailable()) return
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const settings = getReminder()
    const ids = Array.from({ length: REMINDER_DAYS }, (_, index) => ({ id: ID_BASE + index }))
    await LocalNotifications.cancel({ notifications: ids })
    if (!settings.enabled) return
    if ((await LocalNotifications.checkPermissions()).display !== 'granted') return
    const notifications = reminderMoments(now, settings.time, doneToday).map((at) => ({
      id: ID_BASE + Math.round((at.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86_400_000),
      title: 'Time to practise',
      body: 'Your words are waiting. A few minutes keep them fresh.',
      schedule: { at, allowWhileIdle: true },
      smallIcon: 'ic_stat_icon',
    }))
    if (notifications.length) await LocalNotifications.schedule({ notifications })
  } catch {
    // Reminders are a convenience; ignore failures.
  }
}

async function replan() {
  const { buildChecklist } = await import('./dailyChecklist')
  await syncReminders(buildChecklist().allDone)
}

/** Call once at start-up: plans the reminders now and again whenever the app goes to the background or comes back. */
export async function startReminders() {
  if (!remindersAvailable()) return
  try {
    const { App } = await import('@capacitor/app')
    await App.addListener('appStateChange', () => void replan())
    await replan()
  } catch {
    // ignore
  }
}

/** Settings: turn the reminder on or off, or change its time. Returns false when the device refused notifications. */
export async function applyReminder(settings: ReminderSettings) {
  if (settings.enabled && !(await ensureReminderPermission())) {
    saveReminder({ ...settings, enabled: false })
    return false
  }
  saveReminder(settings)
  await replan()
  return true
}
