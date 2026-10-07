import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app version shown in error reports: the Netlify commit, or "dev" locally.
export default defineConfig({
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(process.env.COMMIT_REF?.slice(0, 7) ?? 'dev') },
})
