import { useEffect, useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { DiagnosticPage } from './pages/DiagnosticPage'
import { LibrariesPage } from './pages/LibrariesPage'
import { MistakesPage } from './pages/MistakesPage'
import { PracticePage } from './pages/PracticePage'
import { ProofreadingPage } from './pages/ProofreadingPage'
import { ReviewPage } from './pages/ReviewPage'
import { RulesPage } from './pages/RulesPage'
import { SettingsPage } from './pages/SettingsPage'
import { TopicsPage } from './pages/TopicsPage'

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

  return (
    <AppShell activePage={route}>
      {route === 'practice' ? <PracticePage /> : null}
      {route === 'my-mistakes' ? <MistakesPage /> : null}
      {route === 'rules' ? <RulesPage /> : null}
      {route === 'libraries' ? <LibrariesPage /> : null}
      {route === 'review' ? <ReviewPage /> : null}
      {route === 'level-check' || route === 'test-analysis' ? <DiagnosticPage /> : null}
      {route === 'settings' ? <SettingsPage /> : null}
      {route === 'topics' ? <TopicsPage /> : null}
      {route === 'proofreading' ? <ProofreadingPage /> : null}
      {!['practice', 'my-mistakes', 'rules', 'libraries', 'review', 'level-check', 'test-analysis', 'settings', 'topics', 'proofreading'].includes(route) ? <DashboardPage /> : null}
    </AppShell>
  )
}

export default App
