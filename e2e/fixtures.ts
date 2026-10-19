import { expect, test as base } from '@playwright/test'

// Windows now and then refuses a single connection from the browser to the local server with net::ERR_NETWORK_ACCESS_DENIED
// (WSAEACCES, 10013). It comes as single refusals (about 1 request in 500) and, when many connections are opened at once, as short bursts.
// A page needs several requests, so about 1 page load in 100 broke: a script that never arrived left an empty page and the test waited
// until it timed out. The app is not at fault (the same happens with the version before any change, and with Node itself: connect EACCES).
// So the requests to the preview server go through Playwright, which asks again when the connection fails.
const LOCAL_SERVER = /^http:\/\/127\.0\.0\.1:4180\//
const ATTEMPTS = 8 // with the waits below this keeps asking for about 4 seconds: the refusals come in short bursts

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(LOCAL_SERVER, async (route) => {
      let lastError: unknown
      for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
        try {
          await route.fulfill({ response: await route.fetch() })
          return
        } catch (error) {
          lastError = error
          await new Promise((resolve) => setTimeout(resolve, 150 * attempt))
        }
      }
      console.error(`[e2e fixtures] gave up on ${route.request().url()}: ${String(lastError).slice(0, 200)}`)
      await route.abort()
    })
    await use(context)
  },
})

export { expect }
