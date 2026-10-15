import { useEffect, useState, type PropsWithChildren } from 'react'
import { STORAGE_FAILED_EVENT } from '../../services/safeStorage'
import { navigationItems } from '../../data/dashboard'
import { getMistakeEntries, isDueToday, subscribeToLearningData } from '../../services/learningData'
import { getProfile, subscribeToProfile } from '../../services/profileStorage'
import type { IconName } from '../../types/dashboard'
import { Icon } from '../icons/Icon'
import { FeedbackDialog } from '../FeedbackDialog'
import { BrandMark } from './BrandMark'
import './app-shell.css'

type AppShellProps = PropsWithChildren<{
  activePage: string
}>

// The badge counts what can be done today: mistakes due now (not archived, not mastered).
const countOpenMistakes = () => getMistakeEntries().filter(isDueToday).length
const pageId = (label: string) => label.toLowerCase().replaceAll(' ', '-')
const shortLabel = (label: string) => (label === 'My Mistakes' ? 'Mistakes' : label === 'Level Check' ? 'Level' : label)

// The phone bar has room for four pages; everything else (Libraries, Settings, …) sits behind "More".
const mobileMainPages = ['Dashboard', 'Practice', 'My Mistakes', 'Rules']
const moreGroups: Array<{ title: string; items: Array<{ label: string; icon: IconName; note: string }> }> = [
  {
    title: 'Train',
    items: [
      { label: 'Sprint', icon: 'bolt', note: '60-second speed round' },
      { label: 'Pairs', icon: 'shuffle', note: 'Words people mix up' },
      { label: 'Proofreading', icon: 'eye', note: 'Find mistakes in a text' },
      { label: 'Level Check', icon: 'analysis', note: 'Find your level' },
    ],
  },
  {
    title: 'Words',
    items: [
      { label: 'Libraries', icon: 'library', note: 'Word lists and packs' },
      { label: 'Topics', icon: 'topics', note: 'Progress by topic' },
    ],
  },
]
const mobileMoreItems = [...moreGroups.flatMap((group) => group.items), { label: 'Settings' }]

const MENU_HIDDEN_KEY = 'spell-sprint.menu-hidden'
function readMenuHidden() {
  try {
    return window.localStorage.getItem(MENU_HIDDEN_KEY) === '1'
  } catch {
    return false
  }
}

export function AppShell({ children, activePage }: AppShellProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  // The side menu can be hidden to give the page the whole width. A per-device choice, not part of the account.
  const [menuHidden, setMenuHidden] = useState(readMenuHidden)
  const setMenu = (hidden: boolean) => {
    setMenuHidden(hidden)
    try {
      window.localStorage.setItem(MENU_HIDDEN_KEY, hidden ? '1' : '0')
    } catch {
      // the choice then lasts until the page is closed
    }
  }
  const moreActive = mobileMoreItems.some((item) => pageId(item.label) === activePage)

  useEffect(() => {
    setMoreOpen(false)
  }, [activePage])
  useEffect(() => {
    if (!moreOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [moreOpen])

  // Live numbers for the menu: open mistakes (not yet mastered) and the learner's own name.
  const [openMistakes, setOpenMistakes] = useState(countOpenMistakes)
  const [profile, setProfile] = useState(getProfile)
  useEffect(() => subscribeToLearningData(() => setOpenMistakes(countOpenMistakes())), [])
  useEffect(() => subscribeToProfile(() => setProfile(getProfile())), [])
  // A save that failed (browser storage full or blocked): say so once, so answers are not lost unnoticed.
  const [storageFailed, setStorageFailed] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  useEffect(() => {
    const onFail = () => setStorageFailed(true)
    window.addEventListener(STORAGE_FAILED_EVENT, onFail)
    return () => window.removeEventListener(STORAGE_FAILED_EVENT, onFail)
  }, [])
  const badgeFor = (label: string) => (label === 'My Mistakes' && openMistakes ? openMistakes : null)

  return (
    <div className={`app-shell${menuHidden ? ' app-shell--menu-hidden' : ''}`}>
      <aside className="sidebar" aria-label="Main navigation" inert={menuHidden}>
        <a className="brand" href="#dashboard" aria-label="Spell Sprint dashboard">
          <BrandMark />
          <span>
            Spell<span>Sprint</span>
          </span>
        </a>
        <button
          className="menu-toggle menu-toggle--hide"
          type="button"
          onClick={() => setMenu(true)}
          aria-label="Hide the menu"
          title="Hide the menu"
        >
          <Icon name="sidebar" size={19} />
        </button>

        <nav className="main-nav">
          {navigationItems.map((item) => (
            <a
              className={`nav-link${pageId(item.label) === activePage ? ' nav-link--active' : ''}`}
              href={`#${pageId(item.label)}`}
              key={item.label}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {badgeFor(item.label) ? <span className="nav-badge">{badgeFor(item.label)}</span> : null}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings">
            <Icon name="settings" size={19} />
            <span>Settings</span>
          </a>
          <button className="nav-link nav-link--button" type="button" onClick={() => setFeedbackOpen(true)}>
            <Icon name="lightbulb" size={19} />
            <span>Feedback</span>
          </button>
          <a className="profile-mini" href="#settings">
            <div className="profile-avatar">{(profile.name.trim()[0] ?? 'S').toLocaleUpperCase()}</div>
            <div>
              <strong>{profile.name.trim() || 'Your profile'}</strong>
              <span>Goal: {profile.dailyGoal} tasks a day</span>
            </div>
            <Icon name="chevron" size={17} />
          </a>
        </div>
      </aside>

      {menuHidden ? (
        <button
          className="menu-toggle menu-toggle--show"
          type="button"
          onClick={() => setMenu(false)}
          aria-label="Show the menu"
          title="Show the menu"
        >
          <Icon name="sidebar" size={19} />
        </button>
      ) : null}

      <main className="page-content">
        {storageFailed ? (
          <div className="storage-warning" role="alert">
            <Icon name="flag" size={17} />
            <span>
              <strong>Your last answer could not be saved.</strong> The browser&apos;s storage for this site is full or blocked. Sign in and
              sync in Settings to keep your progress, or free some space in the browser.
            </span>
            <button type="button" onClick={() => setStorageFailed(false)} aria-label="Close">
              ×
            </button>
          </div>
        ) : null}
        {children}
      </main>

      {moreOpen ? (
        <>
          <button className="mobile-more__backdrop" type="button" aria-label="Close menu" onClick={() => setMoreOpen(false)} />
          <nav className="mobile-more" aria-label="More pages">
            <span className="mobile-more__handle" aria-hidden="true" />
            <a
              className={`mobile-more__profile${activePage === 'settings' ? ' mobile-more__profile--active' : ''}`}
              href="#settings"
              onClick={() => setMoreOpen(false)}
            >
              <span className="profile-avatar">{(profile.name.trim()[0] ?? 'S').toLocaleUpperCase()}</span>
              <span>
                <strong>{profile.name.trim() || 'Your profile'}</strong>
                <small>Goal: {profile.dailyGoal} tasks a day · Settings</small>
              </span>
              <Icon name="settings" size={19} />
            </a>
            {moreGroups.map((group) => (
              <section className="mobile-more__group" key={group.title}>
                <h2>{group.title}</h2>
                <div>
                  {group.items.map((item) => (
                    <a
                      className={`mobile-more__link${pageId(item.label) === activePage ? ' mobile-more__link--active' : ''}`}
                      href={`#${pageId(item.label)}`}
                      key={item.label}
                      onClick={() => setMoreOpen(false)}
                    >
                      <span className="mobile-more__icon">
                        <Icon name={item.icon} size={19} />
                      </span>
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.note}</small>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
            <button
              className="mobile-more__feedback"
              type="button"
              onClick={() => {
                setMoreOpen(false)
                setFeedbackOpen(true)
              }}
            >
              <Icon name="lightbulb" size={19} />
              <span>Send feedback</span>
            </button>
          </nav>
        </>
      ) : null}

      {feedbackOpen ? <FeedbackDialog onClose={() => setFeedbackOpen(false)} /> : null}

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigationItems
          .filter((item) => mobileMainPages.includes(item.label))
          .map((item) => (
            <a
              className={`mobile-nav__link${pageId(item.label) === activePage ? ' mobile-nav__link--active' : ''}`}
              href={`#${pageId(item.label)}`}
              key={item.label}
            >
              <span className="mobile-nav__icon">
                <Icon name={item.icon} size={20} />
              </span>
              <span>{shortLabel(item.label)}</span>
              {badgeFor(item.label) ? (
                <span className="mobile-nav__badge">{badgeFor(item.label)! > 99 ? '99+' : badgeFor(item.label)}</span>
              ) : null}
            </a>
          ))}
        <button
          className={`mobile-nav__link${moreActive || moreOpen ? ' mobile-nav__link--active' : ''}`}
          type="button"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <span className="mobile-nav__icon">
            <Icon name="more" size={20} />
          </span>
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
