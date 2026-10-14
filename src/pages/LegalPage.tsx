import './legal.css'

// Plain-language privacy notice and terms. Written to match what the app really does (see src/services/cloudSync.ts,
// errorLog.ts, supabase.ts); update them whenever the app starts storing or sending something new.
// The contact address is set at build time (VITE_CONTACT_EMAIL) so it is never written into the code.
const UPDATED = '13 October 2026'
const contact = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim()

type Section = { title: string; body: Array<string | string[]> }

const privacy: Section[] = [
  {
    title: 'What stays on your device',
    body: [
      'Spell Sprint keeps your practice in your browser (browser storage): your answers, mistakes and review dates, your name and daily goal, text size and theme, the words you add, notes on rules, and the last error reports. It sets no cookies of its own.',
      'Without an account, nothing leaves your device.',
    ],
  },
  {
    title: 'If you create an account',
    body: [
      'You sign in with an e-mail address and a password. Sign-in is handled by Supabase (our database and sign-in provider); we never see your password.',
      'Then a copy of your progress is stored in the cloud so you can restore it on another device:',
      [
        'your progress (answers, mistakes, review dates, settings, your own words and libraries)',
        'mistakes linked to rules, your progress on rules, your notes on rules and your rule practice results',
        'reports you send about a word that looks wrong (the word and your note)',
        'messages you send with the Feedback button (your text, the kind of message, the page you were on, the app version and the browser)',
        'technical error reports: the error message, the page name, the app version and the browser. Never your answers, your words or the full address of the page',
      ],
      'Only your own account can read this data; other learners cannot.',
    ],
  },
  {
    title: 'What we do not do',
    body: [
      'No advertising, no analytics or tracking scripts, no selling or sharing of your data. Speech uses your browser’s built-in voices; which service a browser uses for them depends on the browser.',
    ],
  },
  {
    title: 'Who handles the data',
    body: [
      [
        'Supabase: database and sign-in (the project runs in the EU, Stockholm)',
        'Netlify: hosting of the website',
        'Tatoeba: some example sentences come from tatoeba.org (licence CC BY 2.0 FR); they are bundled with the app, nothing is sent to Tatoeba when you use them',
      ],
    ],
  },
  {
    title: 'Keeping and deleting your data',
    body: [
      'Signing out backs up your progress and removes it from the device. Your cloud copy stays until you ask for it to be deleted. Deleting your account and cloud data is done on request; see the contact below. You can also ask for a copy of your data.',
      'Error reports are kept only as long as they are needed to fix the problem.',
    ],
  },
  {
    title: 'Contact',
    body: [
      contact
        ? `For questions, a copy of your data or deletion of your account, write to ${contact}.`
        : 'For questions, a copy of your data or deletion of your account, write to the person who runs this site.',
    ],
  },
]

const terms: Section[] = [
  {
    title: 'What this is',
    body: [
      'Spell Sprint is a free tool for practising English spelling. It is provided as it is, without promises that it is always available or free of mistakes.',
    ],
  },
  {
    title: 'Using it',
    body: [
      'Use it for your own learning. Do not try to break it, overload it, read other people’s data or use automated tools against it. Keep your password to yourself.',
      'Do not send content in word reports that is offensive or that belongs to someone else.',
    ],
  },
  {
    title: 'Your progress',
    body: [
      'The cloud backup is made with care but is not a guarantee. Keep a copy of anything you cannot lose. We may remove accounts that abuse the service.',
    ],
  },
  {
    title: 'Content',
    body: [
      'Words, rules and exercises are written for learners and can contain mistakes: if something looks wrong, report it from the word or the rule. Example sentences from Tatoeba are used under CC BY 2.0 FR (tatoeba.org).',
    ],
  },
  {
    title: 'Changes',
    body: ['These terms and the privacy notice may change when the app does. The date at the top shows the latest version.'],
  },
]

function Legal({ id, title, sections, other }: { id: string; title: string; sections: Section[]; other: { href: string; label: string } }) {
  return (
    <div className="legal-page" id={id}>
      <header className="legal-header">
        <h1>{title}</h1>
        <p>Last updated {UPDATED}.</p>
      </header>
      {sections.map((section) => (
        <section className="legal-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.body.map((part, index) =>
            Array.isArray(part) ? (
              <ul key={index}>
                {part.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p key={index}>{part}</p>
            ),
          )}
        </section>
      ))}
      <p className="legal-links">
        <a href={other.href}>{other.label}</a> · <a href="#settings">Back to Settings</a>
      </p>
    </div>
  )
}

export function PrivacyPage() {
  return <Legal id="privacy" title="Privacy" sections={privacy} other={{ href: '#terms', label: 'Terms of use' }} />
}

export function TermsPage() {
  return <Legal id="terms" title="Terms of use" sections={terms} other={{ href: '#privacy', label: 'Privacy' }} />
}
