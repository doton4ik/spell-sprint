const serviceWorkerCacheName = /workbox|vite[- ]pwa|vite-plugin-pwa|spell[- ]sprint/i

/** Removes obsolete offline assets without touching application data storage. */
export async function clearLegacyServiceWorkers() {
  if (!('serviceWorker' in navigator)) return

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))

    if ('caches' in window) {
      const cacheNames = await window.caches.keys()
      await Promise.all(cacheNames.filter((name) => serviceWorkerCacheName.test(name)).map((name) => window.caches.delete(name)))
    }
  } catch {
    // A failed cleanup must never prevent the application from rendering.
  }
}
