import { getStreak } from '../services/dailyPlan'
import { getLearningAnalytics } from '../services/learningAnalytics'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { DropPanel } from '../components/ui/DropPanel'
import { InfoTip } from '../components/ui/InfoTip'
import {
  backUpBeforeSignOut,
  getSyncStatus,
  restoreLearningData,
  signOutAndClearDevice,
  subscribeToSyncStatus,
  syncNow,
} from '../services/cloudSync'
import {
  getCloudSession,
  isSupabaseConfigured,
  requestPasswordReset,
  signIn,
  signUp,
  takeAuthRedirect,
  updatePassword,
} from '../services/supabase'
import { loadPracticeSettings, savePracticeSettings } from '../services/practiceStorage'
import { defaultPracticeSettings } from '../data/practice'
import {
  fontScaleOptions,
  getFontScale,
  getTheme,
  setFontScale,
  setTheme,
  themeOptions,
  type FontScale,
  type Theme,
} from '../services/appearanceStorage'
import { describePlan } from '../services/dailyChecklist'
import { dailyMinutesOptions, getProfile, saveProfile, type DailyActivities } from '../services/profileStorage'
import { getOutboxSize, subscribeToOutbox } from '../services/mistakeOutbox'
import './settings.css'

// Password reset needs a working mail service in Supabase (custom SMTP). Until then the button is hidden.
const passwordResetByEmail = import.meta.env.VITE_PASSWORD_RESET_EMAIL === 'on'

// Supabase answers in short technical English; turn the common cases into plain advice.
function friendlyAuthError(error: unknown) {
  const text = error instanceof Error ? error.message : ''
  if (/invalid login credentials/i.test(text)) return 'Wrong email or password.'
  if (/email not confirmed/i.test(text)) return 'Confirm your email first: open the link in the message we sent you.'
  if (/already registered|already exists/i.test(text))
    return 'An account with this email already exists. Sign in, or use "Forgot password?".'
  if (/rate limit|too many|security purposes/i.test(text)) return 'Too many attempts. Wait a minute and try again.'
  if (/password should be|weak password/i.test(text)) return 'Choose a longer password (at least 8 characters).'
  if (/email (signups|logins) are disabled|provider is disabled/i.test(text))
    return 'Sign-in by email is switched off in Supabase (Authentication → Sign In / Providers → Email).'
  if (/failed to fetch|network/i.test(text)) return 'No connection to the server. Check the internet and try again.'
  return text || 'Could not complete the account request.'
}

const activityRows: Array<[keyof DailyActivities, string, string]> = [
  ['proofreading', 'Proofreading', 'from 10 min'],
  ['pairs', 'Word pairs', 'from 15 min'],
  ['dictation', 'Dictation', 'from 15 min'],
  ['sprint', 'Sprint', 'from 30 min'],
]

// Where you are, in a few numbers: a card in the third column (it was a rail beside the page).
function SettingsGlance() {
  const stats = useMemo(() => ({ analytics: getLearningAnalytics(), streak: getStreak().streak }), [])
  const { analytics, streak } = stats
  if (!analytics.totalAttempts) return null
  const rows: Array<[string, string]> = [
    ['Day streak', String(streak)],
    ['Answers so far', String(analytics.totalAttempts)],
    ['Words to master', String(analytics.openMistakes)],
    ...(analytics.accuracy.percent !== null ? ([['Accuracy, 30 days', `${analytics.accuracy.percent}%`]] as Array<[string, string]>) : []),
  ]
  return (
    <article className="settings-card settings-glance">
      <div className="settings-card__head">
        <h2>At a glance</h2>
      </div>
      <dl>
        {rows.map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export function SettingsPage() {
  const [session, setSession] = useState(getCloudSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up' | 'reset'>('sign-in')
  const [settingPassword, setSettingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [speechLocale, setSpeechLocale] = useState(() => loadPracticeSettings(defaultPracticeSettings).speechLocale)
  const [fontScale, setFontScaleState] = useState<FontScale>(getFontScale)
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const [profile, setProfileState] = useState(getProfile)
  const configured = isSupabaseConfigured()
  const [syncStatus, setSyncStatus] = useState(getSyncStatus)
  useEffect(() => subscribeToSyncStatus(() => setSyncStatus(getSyncStatus())), [])
  const [queuedMistakes, setQueuedMistakes] = useState(getOutboxSize)
  useEffect(() => subscribeToOutbox(() => setQueuedMistakes(getOutboxSize())), [])
  // Opened from a link in a Supabase email (address confirmed, or password reset requested).
  useEffect(() => {
    void takeAuthRedirect()?.then(async (result) => {
      if (result.kind === 'error') {
        setMessage(result.message)
        return
      }
      setSession(getCloudSession())
      if (result.kind === 'recovery') {
        setSettingPassword(true)
        setMessage('Choose a new password for your account.')
        return
      }
      setMessage('Email confirmed — you are signed in. Syncing runs automatically.')
      await syncNow()
    })
  }, [])
  function updateProfile(patch: Parameters<typeof saveProfile>[0]) {
    setProfileState(saveProfile(patch))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (mode === 'reset') {
        await requestPasswordReset(email)
        setMessage('If an account exists for this email, a reset link is on its way. Open it on this device.')
        return
      }
      const result = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password)
      const nextSession = 'access_token' in result ? getCloudSession() : null
      setSession(nextSession)
      if (nextSession) await syncNow()
      setMessage(
        nextSession
          ? 'Signed in. History from your other devices has been merged into this one, and syncing now runs automatically.'
          : 'Account created. Confirm your email, then sign in to start synchronising.',
      )
    } catch (error) {
      setMessage(friendlyAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  async function saveNewPassword(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await updatePassword(password)
      setPassword('')
      setSettingPassword(false)
      setMessage('Password changed. Use it next time you sign in.')
    } catch (error) {
      setMessage(friendlyAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  async function sync() {
    setBusy(true)
    setMessage('')
    try {
      await syncNow()
      const status = getSyncStatus()
      if (status.lastError) throw new Error(status.lastError)
      setMessage(`Synced securely at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not sync your data.')
    } finally {
      setBusy(false)
    }
  }

  async function restore() {
    setBusy(true)
    setMessage('')
    try {
      const result = await restoreLearningData()
      setMessage(
        result.found
          ? `Restored from cloud: ${result.attempts} new attempt${result.attempts === 1 ? '' : 's'} added. Nothing on this device was removed.`
          : 'No cloud backup found for this account yet. Use Sync now on the device that has your data.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not restore your data.')
    } finally {
      setBusy(false)
    }
  }

  function chooseFontScale(scale: FontScale) {
    setFontScale(scale)
    setFontScaleState(scale)
  }

  // Learning data is removed from this device on sign-out, so the next person starts clean.
  async function logout() {
    setBusy(true)
    setMessage('')
    try {
      const backedUp = await backUpBeforeSignOut()
      if (
        !backedUp &&
        !window.confirm(
          'Your latest progress could not be backed up (no connection?). Sign out anyway? Progress that has not reached the cloud will be lost on this device.',
        )
      ) {
        setMessage('Still signed in. Try again when you are online.')
        return
      }
      await signOutAndClearDevice()
      setSession(null)
      setSettingPassword(false)
      setProfileState(getProfile())
      setMessage('Signed out. Your progress is saved in your account and was removed from this device.')
    } finally {
      setBusy(false)
    }
  }
  function setAccent(locale: 'en-US' | 'en-GB') {
    setSpeechLocale(locale)
    savePracticeSettings({ ...loadPracticeSettings(defaultPracticeSettings), speechLocale: locale })
    setMessage(`Pronunciation set to ${locale === 'en-US' ? 'American English' : 'British English'}.`)
  }

  return (
    <div className="settings-page" id="settings">
      <header className="settings-header">
        <div>
          <h1>Your learning space</h1>
        </div>
      </header>
      {!configured ? (
        <section className="settings-notice">
          <Icon name="lightbulb" size={19} />
          <div>
            <strong>Cloud sync is ready to configure</strong>
            <p>
              Add the Supabase URL and anonymous key from <code>.env.example</code> to a local <code>.env.local</code> file, then restart
              the app. Run the included database SQL once in Supabase.
            </p>
          </div>
        </section>
      ) : null}
      {message ? (
        <p className="settings-message" role="status">
          {message}
        </p>
      ) : null}
      <section className="settings-grid">
        <div className="settings-col">
          <article className="settings-card">
            <div className="settings-card__head">
              <h2>Account</h2>
              {mode === 'reset' && !session ? null : (
                <InfoTip>
                  {session
                    ? 'Your account is active on this device. Signing out backs up your progress and removes it from this device.'
                    : 'Each learner gets a private account: progress, mistakes and libraries are visible only to you.'}
                </InfoTip>
              )}
            </div>
            {session && settingPassword ? (
              <>
                <strong className="settings-card__lead">Set a new password</strong>
                <p>For {session.user.email ?? 'your account'}.</p>
                <form onSubmit={saveNewPassword}>
                  <label>
                    New password
                    <input
                      required
                      minLength={8}
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>
                  <button className="check-button" disabled={busy} type="submit">
                    {busy ? 'Please wait…' : 'Save password'} <Icon name="arrow" size={16} />
                  </button>
                </form>
                <button className="settings-link" type="button" disabled={busy} onClick={() => setSettingPassword(false)}>
                  Cancel
                </button>
              </>
            ) : session ? (
              <>
                <strong className="settings-card__lead">{session.user.email ?? 'Signed-in learner'}</strong>
                <button className="settings-link" type="button" disabled={busy} onClick={logout}>
                  Sign out
                </button>{' '}
                <button
                  className="settings-link"
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setPassword('')
                    setSettingPassword(true)
                  }}
                >
                  Change password
                </button>
              </>
            ) : (
              <>
                <strong className="settings-card__lead">
                  {mode === 'sign-in' ? 'Sign in to sync' : mode === 'sign-up' ? 'Create your account' : 'Reset your password'}
                </strong>
                {mode === 'reset' ? <p>Enter your email and we will send you a link to choose a new password.</p> : null}
                <form onSubmit={submit}>
                  <label>
                    Email
                    <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </label>
                  {mode !== 'reset' ? (
                    <label>
                      Password
                      <input
                        required
                        minLength={mode === 'sign-up' ? 8 : undefined}
                        type="password"
                        autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </label>
                  ) : null}
                  <button className="check-button" disabled={busy || !configured} type="submit">
                    {busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : mode === 'sign-up' ? 'Create account' : 'Send reset link'}{' '}
                    <Icon name="arrow" size={16} />
                  </button>
                </form>
                {mode === 'sign-up' ? (
                  <small>
                    By creating an account you accept the <a href="#terms">terms of use</a> and the <a href="#privacy">privacy notice</a>.
                  </small>
                ) : null}
                <button className="settings-link" type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
                  {mode === 'sign-in' ? 'Create a new account' : 'I already have an account'}
                </button>
                {mode === 'sign-in' && passwordResetByEmail ? (
                  <>
                    {' '}
                    <button className="settings-link" type="button" onClick={() => setMode('reset')}>
                      Forgot password?
                    </button>
                  </>
                ) : null}
                {mode === 'sign-in' && !passwordResetByEmail ? (
                  <small>Forgot your password? Ask the person who invited you to the site.</small>
                ) : null}
              </>
            )}
          </article>
          <article className="settings-card settings-card--sync">
            <div className="settings-card__head">
              <h2>Cloud backup</h2>
              <InfoTip>
                Practice attempts, mistakes, review progress, saved rules and imported libraries sync automatically while you are signed in:
                when the app opens, shortly after new answers, and when you leave the app. Only your account can access this data.
              </InfoTip>
            </div>
            <button className="check-button" disabled={!session || busy} type="button" onClick={sync}>
              <Icon name="refresh" size={16} /> Sync now
            </button>{' '}
            <button className="settings-link" disabled={!session || busy} type="button" onClick={restore}>
              Restore from cloud
            </button>
            <small>
              {!session
                ? 'Sign in first to enable cloud backup.'
                : syncStatus.running
                  ? 'Syncing…'
                  : syncStatus.lastError
                    ? `Last sync failed: ${syncStatus.lastError}`
                    : syncStatus.lastSyncedAt
                      ? `Last synced at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(syncStatus.lastSyncedAt))}.`
                      : 'Not synced yet.'}
            </small>
            {queuedMistakes ? (
              <small>
                {queuedMistakes} mistake{queuedMistakes === 1 ? ' is' : 's are'} waiting to reach Rules —{' '}
                {session ? 'they are sent automatically when the connection allows.' : 'sign in to send them.'}
              </small>
            ) : null}
          </article>
        </div>
        <div className="settings-col">
          <article className="settings-card settings-card--compact">
            <div className="settings-card__head">
              <h2>Profile</h2>
              <InfoTip>
                The name is used for the greeting on the Dashboard. The time per day and the kinds of practice set today’s plan. Words are
                always in the plan; the Dashboard shows what is done today and what is left. All of this is stored on this device.
              </InfoTip>
            </div>
            <label className="settings-name">
              Your name
              <input
                value={profile.name}
                maxLength={40}
                placeholder="How should we greet you?"
                onChange={(event) => updateProfile({ name: event.target.value })}
              />
            </label>
            <DropPanel label="Time per day" summary={<strong>{profile.dailyMinutes} min</strong>}>
              {(close) => (
                <div className="plan-options" role="radiogroup" aria-label="Time per day">
                  {dailyMinutesOptions.map((minutes) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={profile.dailyMinutes === minutes}
                      className={profile.dailyMinutes === minutes ? 'plan-option plan-option--active' : 'plan-option'}
                      onClick={() => {
                        updateProfile({ dailyMinutes: minutes })
                        close()
                      }}
                      key={minutes}
                    >
                      <strong>{minutes} min</strong>
                      <span>{describePlan(minutes, profile.activities)}</span>
                    </button>
                  ))}
                </div>
              )}
            </DropPanel>
            <p className="settings-plan-line">{describePlan(profile.dailyMinutes, profile.activities)}</p>
            <DropPanel
              label="Include in the day"
              summary={
                activityRows
                  .filter(([key]) => profile.activities[key])
                  .map(([, label]) => label)
                  .join(' · ') || 'Words only'
              }
            >
              {() => (
                <div className="plan-toggles">
                  {activityRows.map(([key, label, note]) => (
                    <label className="plan-toggle" key={key}>
                      <input
                        type="checkbox"
                        checked={profile.activities[key]}
                        onChange={(event) => updateProfile({ activities: { [key]: event.target.checked } })}
                      />
                      <span>{label}</span>
                      <small>{note}</small>
                    </label>
                  ))}
                </div>
              )}
            </DropPanel>
          </article>
          <article className="settings-card">
            <div className="settings-card__head">
              <h2>Pronunciation</h2>
              <InfoTip>Practice uses your browser’s built-in speech synthesis. No audio files or external audio service are used.</InfoTip>
            </div>
            <label>
              English voice
              <select value={speechLocale} onChange={(event) => setAccent(event.target.value as 'en-US' | 'en-GB')}>
                <option value="en-US">American English (en-US)</option>
                <option value="en-GB">British English (en-GB)</option>
              </select>
            </label>
          </article>
        </div>
        <div className="settings-col">
          <article className="settings-card settings-card--compact">
            <div className="settings-card__head">
              <h2>Appearance</h2>
              <InfoTip>
                Text size and theme apply to every page at once and are remembered on this device. “System” follows your device’s light or
                dark mode.
              </InfoTip>
            </div>
            <span className="settings-field-label">Text size</span>
            <div className="font-scale-options" role="radiogroup" aria-label="Text size">
              {fontScaleOptions.map((option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={fontScale === option.value}
                  className={fontScale === option.value ? 'font-scale-option font-scale-option--active' : 'font-scale-option'}
                  onClick={() => chooseFontScale(option.value)}
                  key={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="settings-field-label">Theme</span>
            <div className="font-scale-options font-scale-options--theme" role="radiogroup" aria-label="Theme">
              {themeOptions.map((option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === option.value}
                  className={theme === option.value ? 'font-scale-option font-scale-option--active' : 'font-scale-option'}
                  onClick={() => {
                    setTheme(option.value)
                    setThemeState(option.value)
                  }}
                  key={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="font-scale-preview">
              <strong>accommodation</strong>
              <span>размещение, жильё</span>
              <small>Example: The hotel offers free accommodation.</small>
            </div>
          </article>
          <SettingsGlance />
        </div>
      </section>
      <p className="settings-legal">
        <a href="#privacy">Privacy</a> · <a href="#terms">Terms of use</a>
      </p>
    </div>
  )
}
