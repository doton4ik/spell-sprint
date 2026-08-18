import type { PropsWithChildren } from 'react'
import { navigationItems } from '../../data/dashboard'
import { Icon } from '../icons/Icon'
import './app-shell.css'

type AppShellProps = PropsWithChildren<{
  activePage: string
}>

export function AppShell({ children, activePage }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand" href="#dashboard" aria-label="Spell Sprint dashboard">
          <span className="brand-mark"><Icon name="bolt" size={19} strokeWidth={2.2} /></span>
          <span>Spell<span>Sprint</span></span>
        </a>

        <nav className="main-nav">
          {navigationItems.map((item) => (
            <a className={`nav-link${item.label.toLowerCase().replaceAll(' ', '-') === activePage ? ' nav-link--active' : ''}`} href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`} key={item.label}>
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

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigationItems.slice(0, 6).map((item) => (
          <a className={`mobile-nav__link${item.label.toLowerCase().replaceAll(' ', '-') === activePage ? ' mobile-nav__link--active' : ''}`} href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`} key={item.label}>
            <Icon name={item.icon} size={20} />
            <span>{item.label === 'My Mistakes' ? 'Mistakes' : item.label === 'Test Analysis' ? 'Analysis' : item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
