import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { clearLegacyServiceWorkers } from './pwa/registerServiceWorker'
import { applyFontScale } from './services/appearanceStorage'
import { startAutoSync } from './services/cloudSync'
import './styles/global.css'

applyFontScale()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

void clearLegacyServiceWorkers()
startAutoSync()
