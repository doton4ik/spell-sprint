import { useEffect, useState, type PropsWithChildren } from 'react'
import { navigationItems } from '../../data/dashboard'
import type { IconName } from '../../types/dashboard'
import { Icon } from '../icons/Icon'
import './app-shell.css'

type AppShellProps = PropsWithChildren<{
  activePage: string
}>

const pageId = (label: string) => label.toLowerCase().replaceAll(' ', '-')
const shortLabel = (label: string) => label === 'My Mistakes' ? 'Mistakes' : label === 'Test Analysis' ? 'Analysis' : label

// The phone bar has room for four pages; everything else (Libraries, Settings, …) sits behind "More".
const mobileMainPages = ['Dashboard', 'Practice', 'My Mistakes', 'Rules']
const mobileMoreItems: Array<{ label: string; icon: IconName }> = [
  ...navigationItems.filter((item) => !mobileMainPages.includes(item.label)),
  { label: 'Settings', icon: 'settings' },
]

export function AppShell({ children, activePage }: AppShellProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = mobileMoreItems.some((item) => pageId(item.label) === activePage)

  useEffect(() => { setMoreOpen(false) }, [activePage])

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand" href="#dashboard" aria-label="Spell Sprint dashboard">
          <span className="brand-mark"><Icon name="bolt" size={19} strokeWidth={2.2} /></span>
          <span>Spell<span>Sprint</span></span>
        </a>

        <nav className="main-nav">
          {navigationItems.map((item) => (
            <a className={`nav-link${pageId(item.label) === activePage ? ' nav-link--active' : ''}`} href={`#${pageId(item.label)}`} key={item.label}>
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings"><Icon name="settings" size={19} /><span>Settings</span></a>
          <div className="profile-mini">
            <div className="profile-avatar">M</div>
            <div><strong>Max</strong><span>B1 learning path</span></div>
            <Icon name="chevron" size={17} />
          </div>
        </div>
      </aside>

      <main className="page-content">{children}</main>

      {moreOpen ? (
        <>
          <button className="mobile-more__backdrop" type="button" aria-label="Close menu" onClick={() => setMoreOpen(false)} />
          <nav className="mobile-more" aria-label="More pages">
            {mobileMoreItems.map((item) => (
              <a className={`mobile-more__link${pageId(item.label) === activePage ? ' mobile-more__link--active' : ''}`} href={`#${pageId(item.label)}`} key={item.label} onClick={() => setMoreOpen(false)}>
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </>
      ) : null}

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigationItems.filter((item) => mobileMainPages.includes(item.label)).map((item) => (
          <a className={`mobile-nav__link${pageId(item.label) === activePage ? ' mobile-nav__link--active' : ''}`} href={`#${pageId(item.label)}`} key={item.label}>
            <Icon name={item.icon} size={20} />
            <span>{shortLabel(item.label)}</span>
          </a>
        ))}
        <button className={`mobile-nav__link${moreActive || moreOpen ? ' mobile-nav__link--active' : ''}`} type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>
          <Icon name="more" size={20} />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
