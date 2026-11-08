import type { CapacitorConfig } from '@capacitor/cli'

// The app id is permanent once the app is published: change it BEFORE the first upload to a store, never after.
const config: CapacitorConfig = {
  appId: 'app.spellsprint.learn',
  appName: 'Spell Sprint',
  webDir: 'dist',
  backgroundColor: '#f5f0e6',
  plugins: {
    LocalNotifications: { smallIcon: 'ic_stat_icon', iconColor: '#2d4f80' },
  },
}

export default config
