import { FormEvent, useEffect, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { backUpBeforeSignOut, getSyncStatus, restoreLearningData, signOutAndClearDevice, subscribeToSyncStatus, syncNow } from '../services/cloudSync'
import { getCloudSession, isSupabaseConfigured, requestPasswordReset, signIn, signUp, takeAuthRedirect, updatePassword } from '../services/supabase'
import { loadPracticeSettings, savePracticeSettings } from '../services/practiceStorage'
import { defaultPracticeSettings } from '../data/practice'
import { fontScaleOptions, getFontScale, setFontScale, type FontScale } from '../services/appearanceStorage'
import { dailyGoalOptions, getProfile, saveProfile } from '../services/profileStorage'
import { getOutboxSize, subscribeToOutbox } from '../services/mistakeOutbox'
import './settings.css'

// Supabase answers in short technical English; turn the common cases into plain advice.
function friendlyAuthError(error: unknown) {
  const text = error instanceof Error ? error.message : ''
  if (/invalid login credentials/i.test(text)) return 'Wrong email or password. If you have just registered, confirm your email first.'
  if (/email not confirmed/i.test(text)) return 'Confirm your email first: open the link in the message we sent you.'
  if (/already registered|already exists/i.test(text)) return 'An account with this email already exists. Sign in, or use "Forgot password?".'
  if (/rate limit|too many|security purposes/i.test(text)) return 'Too many attempts. Wait a minute and try again.'
  if (/password should be|weak password/i.test(text)) return 'Choose a longer password (at least 6 characters).'
  if (/failed to fetch|network/i.test(text)) return 'No connection to the server. Check the internet and try again.'
  return text || 'Could not complete the account request.'
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
  const [profile, setProfileState] = useState(getProfile)
  const configured = isSupabaseConfigured()
  const [syncStatus, setSyncStatus] = useState(getSyncStatus)
  useEffect(() => subscribeToSyncStatus(() => setSyncStatus(getSyncStatus())), [])
  const [queuedMistakes, setQueuedMistakes] = useState(getOutboxSize)
  useEffect(() => subscribeToOutbox(() => setQueuedMistakes(getOutboxSize())), [])
  // Opened from a link in a Supabase email (address confirmed, or password reset requested).
  useEffect(() => {
    void takeAuthRedirect()?.then(async (result) => {
      if (result.kind === 'error') { setMessage(result.message); return }
      setSession(getCloudSession())
      if (result.kind === 'recovery') { setSettingPassword(true); setMessage('Choose a new password for your account.'); return }
      setMessage('Email confirmed — you are signed in. Syncing runs automatically.')
      await syncNow()
    })
  }, [])
  function updateProfile(patch: Parameters<typeof saveProfile>[0]) { setProfileState(saveProfile(patch)) }

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
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
      setMessage(nextSession ? 'Signed in. History from your other devices has been merged into this one, and syncing now runs automatically.' : 'Account created. Confirm your email, then sign in to start synchronising.')
    } catch (error) { setMessage(friendlyAuthError(error)) } finally { setBusy(false) }
  }

  async function saveNewPassword(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try { await updatePassword(password); setPassword(''); setSettingPassword(false); setMessage('Password changed. Use it next time you sign in.') }
    catch (error) { setMessage(friendlyAuthError(error)) } finally { setBusy(false) }
  }

  async function sync() {
    setBusy(true); setMessage('')
    try { await syncNow(); const status = getSyncStatus(); if (status.lastError) throw new Error(status.lastError); setMessage(`Synced securely at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())}.`) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sync your data.') } finally { setBusy(false) }
  }

  async function restore() {
    setBusy(true); setMessage('')
    try {
      const result = await restoreLearningData()
      setMessage(result.found ? `Restored from cloud: ${result.attempts} new attempt${result.attempts === 1 ? '' : 's'} added. Nothing on this device was removed.` : 'No cloud backup found for this account yet. Use Sync now on the device that has your data.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not restore your data.') } finally { setBusy(false) }
  }

  function chooseFontScale(scale: FontScale) { setFontScale(scale); setFontScaleState(scale) }

  // Learning data is removed from this device on sign-out, so the next person starts clean.
  async function logout() {
    setBusy(true); setMessage('')
    try {
      const backedUp = await backUpBeforeSignOut()
      if (!backedUp && !window.confirm('Your latest progress could not be backed up (no connection?). Sign out anyway? Progress that has not reached the cloud will be lost on this device.')) { setMessage('Still signed in. Try again when you are online.'); return }
      await signOutAndClearDevice()
      setSession(null); setSettingPassword(false); setProfileState(getProfile())
      setMessage('Signed out. Your progress is saved in your account and was removed from this device.')
    } finally { setBusy(false) }
  }
  function setAccent(locale: 'en-US' | 'en-GB') { setSpeechLocale(locale); savePracticeSettings({ ...loadPracticeSettings(defaultPracticeSettings), speechLocale: locale }); setMessage(`Pronunciation set to ${locale === 'en-US' ? 'American English' : 'British English'}.`) }

  return <div className="settings-page" id="settings">
    <header className="settings-header"><div><p className="eyebrow">Settings</p><h1>Your learning space</h1><p>Keep studying locally, or connect a private account to back up your progress securely.</p></div></header>
    {!configured ? <section className="settings-notice"><Icon name="lightbulb" size={19} /><div><strong>Cloud sync is ready to configure</strong><p>Add the Supabase URL and anonymous key from <code>.env.example</code> to a local <code>.env.local</code> file, then restart the app. Run the included database SQL once in Supabase.</p></div></section> : null}
    <section className="settings-grid">
      <article className="settings-card"><div className="settings-card__icon"><Icon name="settings" size={19} /></div><p className="settings-card__eyebrow">Account</p>{session && settingPassword ? <><h2>Set a new password</h2><p>For {session.user.email ?? 'your account'}.</p><form onSubmit={saveNewPassword}><label>New password<input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="check-button" disabled={busy} type="submit">{busy ? 'Please wait…' : 'Save password'} <Icon name="arrow" size={16} /></button></form><button className="settings-link" type="button" disabled={busy} onClick={() => setSettingPassword(false)}>Cancel</button></>
        : session ? <><h2>{session.user.email ?? 'Signed-in learner'}</h2><p>Your account is active on this device. Signing out backs up your progress and removes it from this device.</p><button className="settings-link" type="button" disabled={busy} onClick={logout}>Sign out</button> <button className="settings-link" type="button" disabled={busy} onClick={() => { setPassword(''); setSettingPassword(true) }}>Change password</button></>
        : <><h2>{mode === 'sign-in' ? 'Sign in to sync' : mode === 'sign-up' ? 'Create your account' : 'Reset your password'}</h2><p>{mode === 'reset' ? 'Enter your email and we will send you a link to choose a new password.' : 'Each learner gets a private account: progress, mistakes and libraries are visible only to you.'}</p><form onSubmit={submit}><label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>{mode !== 'reset' ? <label>Password<input required minLength={6} type="password" autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} /></label> : null}<button className="check-button" disabled={busy || !configured} type="submit">{busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : mode === 'sign-up' ? 'Create account' : 'Send reset link'} <Icon name="arrow" size={16} /></button></form><button className="settings-link" type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Create a new account' : 'I already have an account'}</button>{mode === 'sign-in' ? <> <button className="settings-link" type="button" onClick={() => setMode('reset')}>Forgot password?</button></> : null}</>}</article>
      <article className="settings-card settings-card--sync"><div className="settings-card__icon"><Icon name="refresh" size={19} /></div><p className="settings-card__eyebrow">Cloud backup</p><h2>Sync learning history</h2><p>Practice attempts, mistakes, review progress, saved rules and imported libraries sync automatically while you are signed in: when the app opens, a few seconds after new answers, and when you leave the app.</p><button className="check-button" disabled={!session || busy} type="button" onClick={sync}><Icon name="refresh" size={16} /> Sync now</button> <button className="settings-link" disabled={!session || busy} type="button" onClick={restore}>Restore from cloud</button><small>{!session ? 'Sign in first to enable cloud backup.' : syncStatus.running ? 'Syncing…' : syncStatus.lastError ? `Last sync failed: ${syncStatus.lastError}` : syncStatus.lastSyncedAt ? `Last synced at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(syncStatus.lastSyncedAt))}. Only your account can access this data.` : 'Only your signed-in account can access this data.'}</small>{queuedMistakes ? <small>{queuedMistakes} mistake{queuedMistakes === 1 ? ' is' : 's are'} waiting to reach Rules — {session ? 'they are sent automatically when the connection allows.' : 'sign in to send them.'}</small> : null}</article>
      <article className="settings-card"><div className="settings-card__icon"><Icon name="volume" size={19} /></div><p className="settings-card__eyebrow">Pronunciation</p><h2>English voice</h2><p>Practice uses your browser’s built-in speech synthesis. No audio files or external audio service are used.</p><label>Voice variant<select value={speechLocale} onChange={(event) => setAccent(event.target.value as 'en-US' | 'en-GB')}><option value="en-US">American English (en-US)</option><option value="en-GB">British English (en-GB)</option></select></label></article>
      <article className="settings-card settings-card--compact"><div className="settings-card__icon"><Icon name="calendar" size={19} /></div><p className="settings-card__eyebrow">Profile</p><h2>Name and daily goal</h2><p>Used for the greeting and for today's progress on the Dashboard. Stored on this device.</p><label>Your name<input value={profile.name} maxLength={40} placeholder="How should we greet you?" onChange={(event) => updateProfile({ name: event.target.value })} /></label><span className="settings-field-label">Tasks per day</span><div className="font-scale-options font-scale-options--goal" role="radiogroup" aria-label="Daily goal">{dailyGoalOptions.map((goal) => <button type="button" role="radio" aria-checked={profile.dailyGoal === goal} className={profile.dailyGoal === goal ? 'font-scale-option font-scale-option--active' : 'font-scale-option'} onClick={() => updateProfile({ dailyGoal: goal })} key={goal}>{goal}</button>)}</div></article>
      <article className="settings-card settings-card--compact"><div className="settings-card__icon"><Icon name="eye" size={19} /></div><p className="settings-card__eyebrow">Appearance</p><h2>Text size</h2><p>One setting for every page. It applies immediately and is remembered on this device.</p><div className="font-scale-options" role="radiogroup" aria-label="Text size">{fontScaleOptions.map((option) => <button type="button" role="radio" aria-checked={fontScale === option.value} className={fontScale === option.value ? 'font-scale-option font-scale-option--active' : 'font-scale-option'} onClick={() => chooseFontScale(option.value)} key={option.value}>{option.label}</button>)}</div><div className="font-scale-preview"><strong>accommodation</strong><span>размещение, жильё</span><small>Example: The hotel offers free accommodation.</small></div></article>
    </section>
    {message ? <p className="settings-message" role="status">{message}</p> : null}
  </div>
}
