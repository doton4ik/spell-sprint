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
const { restoreLearningData, syncLearningData } = await import('./cloudSync')
const supabase = await import('./supabase')
const { getProfile, saveProfile } = await import('./profileStorage')
const { getListeningProgress, saveClipScore } = await import('./listening')
const { getProofreadingDone, markProofreadingDone } = await import('./proofreadingDone')
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
  it('when another device saved in between, pulls again and saves over the newer version', async () => {
    vi.clearAllMocks()
    vi.mocked(supabase.getActiveCloudSession).mockResolvedValue({} as never)
    vi.mocked(supabase.loadCloudSnapshotVersion).mockResolvedValueOnce('v1').mockResolvedValueOnce('v2')
    vi.mocked(supabase.loadCloudSnapshot)
      .mockResolvedValueOnce({ updatedAt: 'v1', payload: {} })
      .mockResolvedValueOnce({ updatedAt: 'v2', payload: {} })
    vi.mocked(supabase.saveCloudSnapshot).mockResolvedValueOnce(null).mockResolvedValueOnce('v3')
    await syncLearningData()
    expect(vi.mocked(supabase.saveCloudSnapshot).mock.calls.map((call) => call[1])).toEqual(['v1', 'v2'])
    expect(vi.mocked(supabase.loadCloudSnapshot)).toHaveBeenCalledTimes(2)
    expect(syncedVersion()).toBe('v3')
  })
})

describe('the profile: the newer one wins', () => {
  beforeEach(() => window.localStorage.clear())
  const cloud = (payload: Record<string, unknown>) =>
    vi.mocked(supabase.loadCloudSnapshot).mockResolvedValueOnce({ updatedAt: 'v1', payload } as never)
  const older = '2026-11-01T10:00:00.000Z'
  const newer = '2026-11-05T10:00:00.000Z'

  it('takes a profile changed later on another device, with its time', async () => {
    saveProfile({ name: 'Max', dailyMinutes: 10 }, older)
    cloud({ profile: { name: 'Maxim', dailyMinutes: 30, activities: { sprint: false }, updatedAt: newer } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: 'Maxim', dailyMinutes: 30, dailyGoal: 60, updatedAt: newer })
    expect(getProfile().activities).toMatchObject({ sprint: false, pairs: true })
  })
  it('keeps the profile of this device when it was changed later', async () => {
    saveProfile({ name: 'Max', dailyMinutes: 10 }, newer)
    cloud({ profile: { name: 'Maxim', dailyMinutes: 30, updatedAt: older } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: 'Max', dailyMinutes: 10, updatedAt: newer })
  })
  it('a newer cloud profile with an empty name is taken too (the name was cleared on purpose)', async () => {
    saveProfile({ name: 'Max' }, older)
    cloud({ profile: { name: '', dailyMinutes: 15, updatedAt: newer } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: '', dailyMinutes: 15 })
  })
  it('profiles saved before the time existed: the cloud one is taken only when this device has no name', async () => {
    saveProfile({ name: 'Max', dailyMinutes: 10 }, '')
    cloud({ profile: { name: 'Other', dailyGoal: 60 } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: 'Max', dailyMinutes: 10 })

    window.localStorage.clear()
    cloud({ profile: { name: 'Other', dailyGoal: 60 } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: 'Other', dailyMinutes: 30 })
    expect(getProfile().updatedAt).toBeUndefined()
  })
  it('settings changed here before signing in stay, only the missing name comes from the cloud', async () => {
    saveProfile({ dailyMinutes: 50 }, newer)
    cloud({ profile: { name: 'Max', dailyMinutes: 10, updatedAt: older } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: 'Max', dailyMinutes: 50 })
  })
  it('a name cleared here after the first sync stays cleared (the older cloud name does not come back)', async () => {
    window.localStorage.setItem('spell-sprint.sync-state', JSON.stringify({ version: 'v0', uploaded: '' }))
    saveProfile({ name: '' }, newer)
    cloud({ profile: { name: 'Max', dailyMinutes: 10, updatedAt: older } })
    await restoreLearningData()
    expect(getProfile()).toMatchObject({ name: '', updatedAt: newer })
  })
  it('a change made here after taking a profile from a device whose clock runs ahead is still the newer one', async () => {
    const ahead = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    cloud({ profile: { name: 'Max', dailyMinutes: 10, updatedAt: ahead } })
    await restoreLearningData()
    saveProfile({ dailyMinutes: 30 })
    cloud({ profile: { name: 'Max', dailyMinutes: 10, updatedAt: ahead } })
    await restoreLearningData()
    expect(getProfile().dailyMinutes).toBe(30)
    expect(getProfile().updatedAt! > ahead).toBe(true)
  })
  it('does not remember the cloud version when the progress cannot be stored (storage full)', async () => {
    cloud({ listeningProgress: { 'clip-a': { best: 90, last: 40, plays: 3 } } })
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    await expect(restoreLearningData()).rejects.toThrow()
    setItem.mockRestore()
    expect(syncedVersion()).toBeNull()
  })
  it('ignores a broken profile', async () => {
    saveProfile({ name: 'Max' }, older)
    for (const profile of ['text', null, { name: 5, updatedAt: newer }, { updatedAt: newer }]) {
      cloud({ profile })
      await restoreLearningData()
    }
    expect(getProfile()).toMatchObject({ name: 'Max', updatedAt: older })
  })
})

describe('progress kept outside the answer log', () => {
  beforeEach(() => window.localStorage.clear())

  it('merges listening scores and finished proofreading texts from another device, and merging twice changes nothing', async () => {
    saveClipScore('clip-a', 60)
    markProofreadingDone('text-1', new Date('2026-11-02T10:00:00.000Z'))
    const payload = {
      listeningProgress: { 'clip-a': { best: 90, last: 40, plays: 3 }, 'clip-b': { best: 70, last: 70, plays: 1 }, broken: { best: 'x' } },
      proofreadingDone: [
        { textId: 'text-2', createdAt: '2026-11-03T10:00:00.000Z' },
        { textId: 'text-1', createdAt: '2026-11-02T10:00:00.000Z' },
        { textId: 7 },
      ],
    }
    for (let round = 0; round < 2; round += 1) {
      vi.mocked(supabase.loadCloudSnapshot).mockResolvedValueOnce({ updatedAt: 'v1', payload } as never)
      await restoreLearningData()
    }
    expect(getListeningProgress()).toEqual({ 'clip-a': { best: 90, last: 40, plays: 3 }, 'clip-b': { best: 70, last: 70, plays: 1 } })
    expect(getProofreadingDone().map((item) => item.textId)).toEqual(['text-2', 'text-1'])
  })
  it('uploads them, and the time of the profile, with the backup', async () => {
    vi.clearAllMocks()
    saveProfile({ name: 'Max' }, '2026-11-05T10:00:00.000Z')
    saveClipScore('clip-a', 60)
    markProofreadingDone('text-1', new Date('2026-11-02T10:00:00.000Z'))
    vi.mocked(supabase.getActiveCloudSession).mockResolvedValue({} as never)
    vi.mocked(supabase.loadCloudSnapshotVersion).mockResolvedValueOnce(null)
    vi.mocked(supabase.loadCloudSnapshot).mockResolvedValueOnce(null as never)
    vi.mocked(supabase.saveCloudSnapshot).mockResolvedValueOnce('v9')
    await syncLearningData()
    expect(vi.mocked(supabase.saveCloudSnapshot).mock.calls[0][0]).toMatchObject({
      profile: { name: 'Max', updatedAt: '2026-11-05T10:00:00.000Z' },
      listeningProgress: { 'clip-a': { best: 60, last: 60, plays: 1 } },
      proofreadingDone: [{ textId: 'text-1', createdAt: '2026-11-02T10:00:00.000Z' }],
    })
  })
})
