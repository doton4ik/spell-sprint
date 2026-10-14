import { act, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { usePracticeSession } from './usePracticeSession'
import type { PracticeTask } from '../types/practice'
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const task = (id: string): PracticeTask =>
  ({ id, wordId: id, type: 'translate-ru-en', mode: 'write-en', prompt: `ru-${id}`, answer: id }) as PracticeTask
const tasks = [task('one'), task('two'), task('three')]

const latest: { current: ReturnType<typeof usePracticeSession> | null } = { current: null }
const session = () => latest.current!
function Harness() {
  const value = usePracticeSession(tasks, 'all')
  useEffect(() => {
    latest.current = value
  })
  return null
}

async function mount() {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  await act(async () => root.render(<Harness />))
  return root
}

describe('usePracticeSession', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    window.localStorage.clear()
  })

  it('walks through the tasks and then reports the session as completed', async () => {
    await mount()
    expect(session().completed).toBe(false)
    expect(session().currentTask).toBeDefined()
    for (let step = 0; step < 3; step += 1) await act(async () => session().advance())
    expect(session().completed).toBe(true)
  })

  it('treats two moves forward at once at the end as completed, never as a missing task', async () => {
    await mount()
    await act(async () => {
      session().advance() // to the second task
      session().advance() // a second call from the same render: the stale one steps past the last task
      session().advance()
    })
    expect(session().completed).toBe(true)
    expect(session().currentTask).toBeUndefined()
  })
})
