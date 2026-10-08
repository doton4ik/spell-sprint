import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./supabase', () => ({
  loadCloudSnapshot: vi.fn(async () => ({ updatedAt: '2026-10-08T10:00:00.000Z', payload: { practiceAttempts: [] } })),
  loadCloudSnapshotVersion: vi.fn(),
  saveCloudSnapshot: vi.fn(),
  getActiveCloudSession: vi.fn(),
  getCloudSession: vi.fn(),
  signOut: vi.fn(),
}))
const failMerge = vi.hoisted(() => ({ on: false }))
vi.mock('./practiceStorage', async (original) => {
  const actual = await original<typeof import('./practiceStorage')>()
  return {
    ...actual,
    mergePracticeAttempts: (items: never[]) => {
      if (failMerge.on) throw new Error('QuotaExceededError')
      return actual.mergePracticeAttempts(items)
    },
  }
})
const { restoreLearningData } = await import('./cloudSync')
const syncedVersion = () => JSON.parse(window.localStorage.getItem('spell-sprint.sync-state') ?? 'null')?.version ?? null

describe('restoring the cloud backup', () => {
  beforeEach(() => {
    window.localStorage.clear()
    failMerge.on = false
  })

  it('remembers the cloud version once everything is merged', async () => {
    await restoreLearningData()
    expect(syncedVersion()).toBe('2026-10-08T10:00:00.000Z')
  })
  it('does not remember it when a merge fails, so the next sync pulls again instead of overwriting', async () => {
    failMerge.on = true
    await expect(restoreLearningData()).rejects.toThrow()
    expect(syncedVersion()).toBeNull()
  })
})
