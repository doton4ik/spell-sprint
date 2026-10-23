import { builtInLoading } from './data/startBuiltInLoad'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { clearLegacyServiceWorkers } from './pwa/registerServiceWorker'
import { applyFontScale, applyTheme } from './services/appearanceStorage'
import { startAutoSync } from './services/cloudSync'
import { captureAuthRedirect } from './services/supabase'
import { startErrorLog } from './services/errorLog'
import './styles/global.css'

startErrorLog()
applyFontScale()
applyTheme()
captureAuthRedirect()

const root = createRoot(document.getElementById('root')!)

// The built-in words are a separate download (data/libraries.ts); nothing that reads them runs before they are here.
// index.html shows "Spell Sprint" in the meantime.
builtInLoading.then(
  () => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    void clearLegacyServiceWorkers()
    startAutoSync()
  },
  () => {
    root.render(
      <p className="boot-screen">
        The word list could not be loaded. Check your connection and <a href="">reload the page</a>.
      </p>,
    )
  },
)
