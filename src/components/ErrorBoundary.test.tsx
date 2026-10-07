import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { getStoredErrors } from '../services/errorLog'

// React logs caught render errors to the console; keep the test output clean.
vi.spyOn(console, 'error').mockImplementation(() => undefined)
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function Broken(): never { throw new Error('Broken page for the test') }

describe('ErrorBoundary', () => {
  afterEach(() => { document.body.innerHTML = ''; window.localStorage.clear() })

  it('shows a calm message instead of a blank screen and logs the error', async () => {
    const host = document.createElement('div'); document.body.append(host)
    const root = createRoot(host)
    await act(async () => root.render(<ErrorBoundary resetKey="practice"><Broken /></ErrorBoundary>))
    expect(host.textContent).toContain('Something went wrong on this page.')
    expect(getStoredErrors().map((item) => item.message)).toContain('Broken page for the test')
    root.unmount()
  })

  it('opening another page tries again', async () => {
    const host = document.createElement('div'); document.body.append(host)
    const root = createRoot(host)
    await act(async () => root.render(<ErrorBoundary resetKey="a"><Broken /></ErrorBoundary>))
    await act(async () => root.render(<ErrorBoundary resetKey="b"><p>Working page</p></ErrorBoundary>))
    expect(host.textContent).toContain('Working page')
    root.unmount()
  })
})
