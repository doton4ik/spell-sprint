import { expect, test, type Page } from '@playwright/test'

// Errors in the browser console fail the test (network noise from an offline Supabase is allowed).
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|supabase/i.test(message.text())) errors.push(message.text())
  })
  return errors
}

const pages: Array<[string, RegExp]> = [
  ['dashboard', /Good (morning|afternoon|evening)/],
  ['practice', /Build accuracy/],
  ['my-mistakes', /My mistakes/],
  ['rules', /Rules that stick/],
  ['libraries', /Libraries/],
  ['review', /My mistakes/], // the old Review page opens My Mistakes
  ['level-check', /Where is your English now/],
  ['settings', /Your learning space/],
  ['topics', /Topics/],
  ['proofreading', /Find the mistakes/],
  ['sprint', /60 seconds/],
  ['pairs', /Words that sound or look alike/],
  ['privacy', /Privacy/],
  ['terms', /Terms of use/],
]

test('every page opens without an error', async ({ page }) => {
  const errors = watchErrors(page)
  for (const [route, heading] of pages) {
    await page.goto(`/#${route}`)
    await expect(page.locator('main h1').first()).toHaveText(heading)
    await expect(page.getByText('Something went wrong on this page.')).toHaveCount(0)
  }
  expect(errors).toEqual([])
})

test('every page has the same space around its content', async ({ page }) => {
  const seen = new Map<string, string[]>()
  for (const [route] of pages) {
    await page.goto(`/#${route}`)
    await expect(page.locator('main h1').first()).toBeVisible()
    // (a string: the e2e project has no DOM types)
    const padding = (await page.evaluate(
      `(() => { const s = getComputedStyle(document.querySelector('main .dashboard, main [class$="-page"], main [class*="-page "]')); return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].join(' ') })()`,
    )) as string
    seen.set(padding, [...(seen.get(padding) ?? []), route])
  }
  // One value for all pages (the tokens --page-pad-* in styles/tokens.css); a page with its own padding shows up here.
  expect(Object.fromEntries(seen)).toEqual({ [[...seen.keys()][0]]: pages.map(([route]) => route) })
})

test('on a wide screen the page titles start at the same left edge', async ({ page }) => {
  await page.setViewportSize({ width: 1915, height: 870 })
  const lefts = new Map<number, string[]>()
  for (const [route] of pages) {
    await page.goto(`/#${route}`)
    await expect(page.locator('main h1').first()).toBeVisible()
    const left = (await page.evaluate(`Math.round(document.querySelector('main h1').getBoundingClientRect().left)`)) as number
    lefts.set(left, [...(lefts.get(left) ?? []), route])
  }
  // Pages used to be centred at their own widths, so the title jumped sideways from page to page.
  expect(Object.fromEntries(lefts)).toEqual({ [[...lefts.keys()][0]]: pages.map(([route]) => route) })
})

test('a wrong answer in practice becomes a mistake', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#practice')
  // A new word goes straight to the test.
  const answer = page.locator('#practice-answer')
  await expect(answer).toHaveAttribute('autocorrect', 'off')
  await expect(answer).toHaveAttribute('spellcheck', 'false')
  await answer.fill('zzzz')
  await page.getByRole('button', { name: 'Check' }).click()
  await expect(page.getByText('Not quite')).toBeVisible()
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(1)
  await page.locator('.mistake-row').getByRole('button', { name: 'Details' }).click()
  await expect(page.locator('.mistake-row').getByRole('button', { name: 'Report' })).toBeVisible()
  expect(errors).toEqual([])
})

test('on a wide screen the feedback on an answer is in the side panel, on a narrow one under the card', async ({ page }) => {
  for (const [width, inPanel] of [
    [1700, true],
    [1300, false],
  ] as const) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#practice')
    await page.reload() // a fresh session, so the first word is new again
    const answer = page.locator('#practice-answer')
    await answer.fill('zzzz')
    await answer.press('Enter')
    await expect(page.getByText('Not quite')).toBeVisible()
    const feedback = page.locator('.task-feedback')
    await expect(page.locator('.session-rail .task-feedback')).toHaveCount(inPanel ? 1 : 0)
    await expect(page.locator('.task-card .task-feedback')).toHaveCount(inPanel ? 0 : 1)
    await expect(feedback).toHaveCount(1)
    await page.evaluate('localStorage.clear()')
  }
})

test('dictation reads the word only when Play is pressed', async ({ page }) => {
  // counts every call to speechSynthesis.speak (a string: the e2e project has no DOM types)
  await page.addInitScript(
    `window.__spoken = 0; const speak = window.speechSynthesis.speak.bind(window.speechSynthesis); window.speechSynthesis.speak = (utterance) => { window.__spoken += 1; speak(utterance) }`,
  )
  await page.goto('/#practice')
  const modeBox = page.locator('.practice-select', { hasText: 'Mode' }).locator('select')
  if (!(await modeBox.isVisible())) await page.getByRole('button', { name: 'Change' }).click()
  await modeBox.selectOption({ label: 'Listen and write' })
  await expect(page.locator('.dictation-play')).toBeVisible()
  await page.waitForTimeout(1000) // it used to start after about a third of a second
  expect(await page.evaluate('window.__spoken')).toBe(0)
  await page.locator('.dictation-play').click()
  expect(await page.evaluate('window.__spoken')).toBe(1)
})

test('the side menu fits a short window: the profile at its bottom is not cut off', async ({ page }) => {
  for (const height of [900, 768, 700]) {
    await page.setViewportSize({ width: 1300, height })
    await page.goto('/#dashboard')
    const profile = page.locator('.sidebar .profile-mini')
    await expect(profile).toBeVisible()
    const bottom = (await profile.boundingBox())!.y + (await profile.boundingBox())!.height
    expect(bottom, `window ${height} px high`).toBeLessThanOrEqual(height)
  }
})

test('Enter after an answer starts the next word', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#practice')
  const answer = page.locator('#practice-answer')
  await answer.fill('zzzz')
  await answer.press('Enter') // checks the answer
  await expect(page.getByText('Not quite')).toBeVisible()
  await answer.press('Enter') // starts the next word
  await expect(page.getByText('Not quite')).toHaveCount(0)
  await expect(answer).toHaveValue('')
  // The wrong answer was recorded once, not once per Enter.
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(1)
  expect(errors).toEqual([])
})

for (const mode of ['Write in English', 'Listen and write']) {
  test(`after a right answer and Enter the cursor is back in the answer box for the next word (${mode})`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/#practice')
    const modeBox = page.locator('.practice-select', { hasText: 'Mode' }).locator('select')
    if (!(await modeBox.isVisible())) await page.getByRole('button', { name: 'Change' }).click()
    await modeBox.selectOption({ label: mode })
    const answer = page.locator('#practice-answer')
    await answer.fill('zzzz')
    await answer.press('Enter')
    await expect(page.getByText('Not quite')).toBeVisible()
    const right = await page.locator('.session-missed strong').first().innerText()
    await answer.fill(right)
    await answer.press('Enter') // checks the right answer: the box is switched off now
    await expect(page.getByText('Not quite')).toHaveCount(0)
    await page.keyboard.press('Enter') // next word (the box is switched off, so the key goes to the page)
    await expect(answer).toHaveValue('')
    await expect(answer).toBeEnabled()
    await expect(answer).toBeFocused() // typing can go on at once, without a click into the box
    expect(errors).toEqual([])
  })
}

test('a proofreading text can be opened and checked', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#proofreading')
  await page.locator('.proof-card').first().click()
  await expect(page.getByText(/of \d+ mistakes marked/)).toBeVisible()
  await page.getByRole('button', { name: 'Check' }).click()
  await expect(page.getByText(/missed|found/i).first()).toBeVisible()
  expect(errors).toEqual([])
})

test('the ten-sentence mode loads its sentences', async ({ page }) => {
  await page.goto('/#proofreading')
  await page.getByRole('radio', { name: /Ten sentences/ }).click()
  await page.getByRole('button', { name: /Start 10 sentences/ }).click()
  await expect(page.getByText('Ten real sentences')).toBeVisible()
})

test('typos not noticed in Spelling hunt become yellow cards, not mistakes', async ({ page }) => {
  await page.goto('/#proofreading')
  await page.getByRole('radio', { name: /Spelling hunt/ }).click()
  await page.locator('.proof-card').first().click()
  await page.getByRole('button', { name: 'Check' }).click()
  await page.goto('/#my-mistakes')
  await expect(page.getByRole('heading', { name: /Yellow cards/ })).toBeVisible()
  await expect(page.locator('.mistake-row--yellow').first()).toBeVisible()
  await expect(page.locator('.mistake-row:not(.mistake-row--yellow)')).toHaveCount(0)
})

test('"I don\'t know this word" shows it first, and copying it is not a mistake', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#practice')
  await expect(page.locator('#practice-answer')).toBeVisible() // a new word is tested straight away
  await page.getByRole('button', { name: /I don.t know this word/ }).click()
  await expect(page.getByText('Meet the word first.')).toBeVisible()
  const word = (await page.locator('.meet-word__word').textContent())!.trim()
  await page.locator('#meet-answer').fill('zzzz')
  await page.getByRole('button', { name: 'Got it' }).click()
  await expect(page.getByText(/Not the same yet/)).toBeVisible()
  await page.locator('#meet-answer').fill(word)
  await page.getByRole('button', { name: 'Got it' }).click()
  await expect(page.locator('.session-sidebar .session-dot--met')).toHaveCount(1)
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(0)
  expect(errors).toEqual([])
})
