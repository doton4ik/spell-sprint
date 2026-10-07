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
      try { window.sessionStorage.removeItem(RELOAD_FLAG) } catch { /* storage blocked */ }
      return { default: module[name] as ComponentType }
    } catch (error) {
      let reloaded = false
      try { reloaded = window.sessionStorage.getItem(RELOAD_FLAG) === '1'; window.sessionStorage.setItem(RELOAD_FLAG, '1') } catch { /* storage blocked */ }
      if (!reloaded) { window.location.reload(); return new Promise<never>(() => undefined) }
      throw error
    }
  })
}

const PracticePage = page(() => import('./pages/PracticePage'), 'PracticePage')
const MistakesPage = page(() => import('./pages/MistakesPage'), 'MistakesPage')
const RulesPage = page(() => import('./pages/RulesPage'), 'RulesPage')
const LibrariesPage = page(() => import('./pages/LibrariesPage'), 'LibrariesPage')
const ReviewPage = page(() => import('./pages/ReviewPage'), 'ReviewPage')
const DiagnosticPage = page(() => import('./pages/DiagnosticPage'), 'DiagnosticPage')
const SettingsPage = page(() => import('./pages/SettingsPage'), 'SettingsPage')
const TopicsPage = page(() => import('./pages/TopicsPage'), 'TopicsPage')
const ProofreadingPage = page(() => import('./pages/ProofreadingPage'), 'ProofreadingPage')
const SprintPage = page(() => import('./pages/SprintPage'), 'SprintPage')
const PairsPage = page(() => import('./pages/PairsPage'), 'PairsPage')

const pages: Record<string, ComponentType> = {
  practice: PracticePage, 'my-mistakes': MistakesPage, rules: RulesPage, libraries: LibrariesPage, review: ReviewPage,
  'level-check': DiagnosticPage, 'test-analysis': DiagnosticPage, settings: SettingsPage, topics: TopicsPage,
  proofreading: ProofreadingPage, sprint: SprintPage, pairs: PairsPage,
}

function getRoute() {
  return window.location.hash.replace('#', '') || 'dashboard'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute())
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  const Page = pages[route] ?? DashboardPage
  return (
    <AppShell activePage={route}>
      <ErrorBoundary resetKey={route}>
        <Suspense fallback={<div className="page-loading" role="status" aria-label="Loading" />}>
          <Page />
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  )
}

export default App
