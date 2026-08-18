import { FormEvent, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { syncLearningData } from '../services/cloudSync'
import { getCloudSession, isSupabaseConfigured, signIn, signOut, signUp } from '../services/supabase'
import { loadPracticeSettings, savePracticeSettings } from '../services/practiceStorage'
import { defaultPracticeSettings } from '../data/practice'
import './settings.css'

export function SettingsPage() {
  const [session, setSession] = useState(getCloudSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [speechLocale, setSpeechLocale] = useState(() => loadPracticeSettings(defaultPracticeSettings).speechLocale)
  const configured = isSupabaseConfigured()

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const result = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password)
      const nextSession = 'access_token' in result ? getCloudSession() : null
      setSession(nextSession)
      setMessage(nextSession ? 'Signed in. Your local learning history is ready to sync.' : 'Account created. Confirm your email, then sign in to start synchronising.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not complete the account request.') } finally { setBusy(false) }
  }

  async function sync() {
    setBusy(true); setMessage('')
    try { await syncLearningData(); setMessage(`Synced securely at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())}.`) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sync your data.') } finally { setBusy(false) }
  }

  async function logout() { await signOut(); setSession(null); setMessage('You have been signed out. Your local data stays on this device.') }
  function setAccent(locale: 'en-US' | 'en-GB') { setSpeechLocale(locale); savePracticeSettings({ ...loadPracticeSettings(defaultPracticeSettings), speechLocale: locale }); setMessage(`Pronunciation set to ${locale === 'en-US' ? 'American English' : 'British English'}.`) }

  return <div className="settings-page" id="settings">
    <header className="settings-header"><div><p className="eyebrow">Settings</p><h1>Your learning space</h1><p>Keep studying locally, or connect a private account to back up your progress securely.</p></div></header>
    {!configured ? <section className="settings-notice"><Icon name="lightbulb" size={19} /><div><strong>Cloud sync is ready to configure</strong><p>Add the Supabase URL and anonymous key from <code>.env.example</code> to a local <code>.env.local</code> file, then restart the app. Run the included database SQL once in Supabase.</p></div></section> : null}
    <section className="settings-grid">
      <article className="settings-card"><div className="settings-card__icon"><Icon name="settings" size={19} /></div><p className="settings-card__eyebrow">Account</p>{session ? <><h2>{session.user.email ?? 'Signed-in learner'}</h2><p>Your account is active on this device.</p><button className="settings-link" type="button" onClick={logout}>Sign out</button></> : <><h2>{mode === 'sign-in' ? 'Sign in to sync' : 'Create your account'}</h2><p>Use an email and password to keep a private backup of your learning data.</p><form onSubmit={submit}><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="check-button" disabled={busy || !configured} type="submit">{busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={16} /></button></form><button className="settings-link" type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Create a new account' : 'I already have an account'}</button></>}</article>
      <article className="settings-card settings-card--sync"><div className="settings-card__icon"><Icon name="refresh" size={19} /></div><p className="settings-card__eyebrow">Cloud backup</p><h2>Sync learning history</h2><p>Backs up practice attempts, diagnostics, review progress, saved rules, and imported libraries to your account.</p><button className="check-button" disabled={!session || busy} type="button" onClick={sync}><Icon name="refresh" size={16} /> Sync now</button><small>{session ? 'Only your signed-in account can access this data.' : 'Sign in first to enable cloud backup.'}</small></article>
      <article className="settings-card"><div className="settings-card__icon"><Icon name="volume" size={19} /></div><p className="settings-card__eyebrow">Pronunciation</p><h2>English voice</h2><p>Practice uses your browser’s built-in speech synthesis. No audio files or external audio service are used.</p><label>Voice variant<select value={speechLocale} onChange={(event) => setAccent(event.target.value as 'en-US' | 'en-GB')}><option value="en-US">American English (en-US)</option><option value="en-GB">British English (en-GB)</option></select></label></article>
    </section>
    {message ? <p className="settings-message" role="status">{message}</p> : null}
  </div>
}
