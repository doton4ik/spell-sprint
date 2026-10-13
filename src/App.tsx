import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorBoundary } from './components/ErrorBoundary'

// Every page except the dashboard is its own file, loaded when it is first opened: the first visit
// downloads much less. If a page file is missing (a new version was deployed while the tab was open),
// the app reloads once to get the new version.
const RELOAD_FLAG = 'spell-sprint.reloaded-for-update'
function page<T extends Record<string, unknown>>(load: () => Promise<T>, name: keyof T) {
  return lazy(async () => {
    try {
      const module = await load()
      try {
        window.sessionStorage.removeItem(RELOAD_FLAG)
      } catch {
        /* storage blocked */
      }
      return { default: module[name] as ComponentType }
    } catch (error) {
      let reloaded = false
      try {
        reloaded = window.sessionStorage.getItem(RELOAD_FLAG) === '1'
        window.sessionStorage.setItem(RELOAD_FLAG, '1')
      } catch {
        /* storage blocked */
      }
      if (!reloaded) {
        window.location.reload()
        return new Promise<never>(() => undefined)
      }
      throw error
    }
  })
}

const loaders = {
  Practice: () => import('./pages/PracticePage'),
  Mistakes: () => import('./pages/MistakesPage'),
  Rules: () => import('./pages/RulesPage'),
  Libraries: () => import('./pages/LibrariesPage'),
  Diagnostic: () => import('./pages/DiagnosticPage'),
  Settings: () => import('./pages/SettingsPage'),
  Topics: () => import('./pages/TopicsPage'),
  Proofreading: () => import('./pages/ProofreadingPage'),
  Sprint: () => import('./pages/SprintPage'),
  Pairs: () => import('./pages/PairsPage'),
  Privacy: () => import('./pages/LegalPage'),
}
const PracticePage = page(loaders.Practice, 'PracticePage')
const MistakesPage = page(loaders.Mistakes, 'MistakesPage')
const RulesPage = page(loaders.Rules, 'RulesPage')
const LibrariesPage = page(loaders.Libraries, 'LibrariesPage')
const DiagnosticPage = page(loaders.Diagnostic, 'DiagnosticPage')
const SettingsPage = page(loaders.Settings, 'SettingsPage')
const TopicsPage = page(loaders.Topics, 'TopicsPage')
const ProofreadingPage = page(loaders.Proofreading, 'ProofreadingPage')
const SprintPage = page(loaders.Sprint, 'SprintPage')
const PairsPage = page(loaders.Pairs, 'PairsPage')
const PrivacyPage = page(loaders.Privacy, 'PrivacyPage')
const TermsPage = page(loaders.Privacy, 'TermsPage')

// Once the first page is on screen and the browser is idle, the other pages (and their styles) are
// fetched in the background, so opening one later is instant.
function prefetchPages() {
  for (const load of Object.values(loaders)) load().catch(() => undefined)
}
const whenIdle = (run: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(run, { timeout: 4000 }) : setTimeout(run, 2000)

const pages: Record<string, ComponentType> = {
  practice: PracticePage,
  'my-mistakes': MistakesPage,
  rules: RulesPage,
  libraries: LibrariesPage,
  review: MistakesPage, // the old Review page: its words are in My Mistakes now
  'level-check': DiagnosticPage,
  'test-analysis': DiagnosticPage,
  settings: SettingsPage,
  topics: TopicsPage,
  proofreading: ProofreadingPage,
  sprint: SprintPage,
  pairs: PairsPage,
  privacy: PrivacyPage,
  terms: TermsPage,
}

function getRoute() {
  return window.location.hash.replace('#', '') || 'dashboard'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute())
    window.addEventListener('hashchange', updateRoute)
    whenIdle(prefetchPages)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  const Page = pages[route] ?? DashboardPage
  return (
    <AppShell activePage={route}>
      <ErrorBoundary key={route}>
        <Suspense fallback={<div className="page-loading" role="status" aria-label="Loading" />}>
          <Page />
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  )
}

export default App
