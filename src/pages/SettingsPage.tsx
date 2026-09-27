import { FormEvent, useEffect, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { getSyncStatus, restoreLearningData, subscribeToSyncStatus, syncNow } from '../services/cloudSync'
import { getCloudSession, isSupabaseConfigured, signIn, signOut, signUp } from '../services/supabase'
import { loadPracticeSettings, savePracticeSettings } from '../services/practiceStorage'
import { defaultPracticeSettings } from '../data/practice'
import { fontScaleOptions, getFontScale, setFontScale, type FontScale } from '../services/appearanceStorage'
import { dailyGoalOptions, getProfile, saveProfile } from '../services/profileStorage'
import { getOutboxSize, subscribeToOutbox } from '../services/mistakeOutbox'
import './settings.css'

export function SettingsPage() {
  const [session, setSession] = useState(getCloudSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
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
  function updateProfile(patch: Parameters<typeof saveProfile>[0]) { setProfileState(saveProfile(patch)) }

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const result = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password)
      const nextSession = 'access_token' in result ? getCloudSession() : null
      setSession(nextSession)
      if (nextSession) await syncNow()
      setMessage(nextSession ? 'Signed in. History from your other devices has been merged into this one, and syncing now runs automatically.' : 'Account created. Confirm your email, then sign in to start synchronising.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not complete the account request.') } finally { setBusy(false) }
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

  async function logout() { await signOut(); setSession(null); setMessage('You have been signed out. Your local data stays on this device.') }
  function setAccent(locale: 'en-US' | 'en-GB') { setSpeechLocale(locale); savePracticeSettings({ ...loadPracticeSettings(defaultPracticeSettings), speechLocale: locale }); setMessage(`Pronunciation set to ${locale === 'en-US' ? 'American English' : 'British English'}.`) }

  return <div className="settings-page" id="settings">
    <header className="settings-header"><div><p className="eyebrow">Settings</p><h1>Your learning space</h1><p>Keep studying locally, or connect a private account to back up your progress securely.</p></div></header>
    {!configured ? <section className="settings-notice"><Icon name="lightbulb" size={19} /><div><strong>Cloud sync is ready to configure</strong><p>Add the Supabase URL and anonymous key from <code>.env.example</code> to a local <code>.env.local</code> file, then restart the app. Run the included database SQL once in Supabase.</p></div></section> : null}
    <section className="settings-grid">
      <article className="settings-card"><div className="settings-card__icon"><Icon name="settings" size={19} /></div><p className="settings-card__eyebrow">Account</p>{session ? <><h2>{session.user.email ?? 'Signed-in learner'}</h2><p>Your account is active on this device.</p><button className="settings-link" type="button" onClick={logout}>Sign out</button></> : <><h2>{mode === 'sign-in' ? 'Sign in to sync' : 'Create your account'}</h2><p>Use an email and password to keep a private backup of your learning data.</p><form onSubmit={submit}><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="check-button" disabled={busy || !configured} type="submit">{busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={16} /></button></form><button className="settings-link" type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Create a new account' : 'I already have an account'}</button></>}</article>
      <article className="settings-card settings-card--sync"><div className="settings-card__icon"><Icon name="refresh" size={19} /></div><p className="settings-card__eyebrow">Cloud backup</p><h2>Sync learning history</h2><p>Practice attempts, mistakes, review progress, saved rules and imported libraries sync automatically while you are signed in: when the app opens, a few seconds after new answers, and when you leave the app.</p><button className="check-button" disabled={!session || busy} type="button" onClick={sync}><Icon name="refresh" size={16} /> Sync now</button> <button className="settings-link" disabled={!session || busy} type="button" onClick={restore}>Restore from cloud</button><small>{!session ? 'Sign in first to enable cloud backup.' : syncStatus.running ? 'Syncing…' : syncStatus.lastError ? `Last sync failed: ${syncStatus.lastError}` : syncStatus.lastSyncedAt ? `Last synced at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(syncStatus.lastSyncedAt))}. Only your account can access this data.` : 'Only your signed-in account can access this data.'}</small>{queuedMistakes ? <small>{queuedMistakes} mistake{queuedMistakes === 1 ? ' is' : 's are'} waiting to reach Rules — {session ? 'they are sent automatically when the connection allows.' : 'sign in to send them.'}</small> : null}</article>
      <article className="settings-card"><div className="settings-card__icon"><Icon name="volume" size={19} /></div><p className="settings-card__eyebrow">Pronunciation</p><h2>English voice</h2><p>Practice uses your browser’s built-in speech synthesis. No audio files or external audio service are used.</p><label>Voice variant<select value={speechLocale} onChange={(event) => setAccent(event.target.value as 'en-US' | 'en-GB')}><option value="en-US">American English (en-US)</option><option value="en-GB">British English (en-GB)</option></select></label></article>
      <article className="settings-card settings-card--compact"><div className="settings-card__icon"><Icon name="calendar" size={19} /></div><p className="settings-card__eyebrow">Profile</p><h2>Name and daily goal</h2><p>Used for the greeting and for today's progress on the Dashboard. Stored on this device.</p><label>Your name<input value={profile.name} maxLength={40} placeholder="How should we greet you?" onChange={(event) => updateProfile({ name: event.target.value })} /></label><span className="settings-field-label">Tasks per day</span><div className="font-scale-options font-scale-options--goal" role="radiogroup" aria-label="Daily goal">{dailyGoalOptions.map((goal) => <button type="button" role="radio" aria-checked={profile.dailyGoal === goal} className={profile.dailyGoal === goal ? 'font-scale-option font-scale-option--active' : 'font-scale-option'} onClick={() => updateProfile({ dailyGoal: goal })} key={goal}>{goal}</button>)}</div></article>
      <article className="settings-card settings-card--compact"><div className="settings-card__icon"><Icon name="eye" size={19} /></div><p className="settings-card__eyebrow">Appearance</p><h2>Text size</h2><p>One setting for every page. It applies immediately and is remembered on this device.</p><div className="font-scale-options" role="radiogroup" aria-label="Text size">{fontScaleOptions.map((option) => <button type="button" role="radio" aria-checked={fontScale === option.value} className={fontScale === option.value ? 'font-scale-option font-scale-option--active' : 'font-scale-option'} onClick={() => chooseFontScale(option.value)} key={option.value}>{option.label}</button>)}</div><div className="font-scale-preview"><strong>accommodation</strong><span>размещение, жильё</span><small>Example: The hotel offers free accommodation.</small></div></article>
    </section>
    {message ? <p className="settings-message" role="status">{message}</p> : null}
  </div>
}
