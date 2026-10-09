import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { clearLegacyServiceWorkers } from './pwa/registerServiceWorker'
import { applyFontScale, applyTheme } from './services/appearanceStorage'
import { startAutoSync } from './services/cloudSync'
import { captureAuthRedirect } from './services/supabase'
import { startErrorLog } from './services/errorLog'
import './styles/global.css'
import './styles/looks.css'

startErrorLog()
applyFontScale()
applyTheme()
captureAuthRedirect()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

void clearLegacyServiceWorkers()
startAutoSync()
