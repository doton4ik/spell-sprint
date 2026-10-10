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

test('a wrong answer in practice becomes a mistake', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#practice')
  // A new word goes straight to the test.
  const answer = page.locator('#practice-answer')
  await expect(answer).toHaveAttribute('autocorrect', 'off')
  await expect(answer).toHaveAttribute('spellcheck', 'false')
  await answer.fill('zzzz')
  await page.getByRole('button', { name: 'Check' }).click()
  await expect(page.getByText('Not quite.')).toBeVisible()
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(1)
  await expect(page.locator('.mistake-row').getByRole('button', { name: 'Report' })).toBeVisible()
  expect(errors).toEqual([])
})

test('Enter after an answer starts the next word', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#practice')
  const answer = page.locator('#practice-answer')
  await answer.fill('zzzz')
  await answer.press('Enter') // checks the answer
  await expect(page.getByText('Not quite.')).toBeVisible()
  await answer.press('Enter') // starts the next word
  await expect(page.getByText('Not quite.')).toHaveCount(0)
  await expect(answer).toHaveValue('')
  // The wrong answer was recorded once, not once per Enter.
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(1)
  expect(errors).toEqual([])
})

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
  await expect(page.locator('.session-dot--met')).toHaveCount(1)
  await page.goto('/#my-mistakes')
  await expect(page.locator('.mistake-row')).toHaveCount(0)
  expect(errors).toEqual([])
})
