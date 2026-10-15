import { expect, test, type Page } from '@playwright/test'

// The whole level check, answered without thinking: the first option, "I don't know" for the typed ones.
// It must reach the result without a console error. Audio is not needed (a typed dictation is skipped).
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|supabase/i.test(message.text())) errors.push(message.text())
  })
  return errors
}

async function answerOne(page: Page) {
  const choice = page.locator('.level-choice').first()
  if (await choice.count()) {
    await choice.click()
  } else {
    await page.getByRole('button', { name: /I don.t know/ }).click()
  }
  await expect(page.locator('.level-feedback')).toBeVisible()
}

test('the whole level check can be answered, and ends with a result', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#level-check')
  await expect(page.locator('main h1')).toHaveText(/Where is your English now/)
  await page.getByRole('button', { name: /Start the check/ }).click()

  const seen = new Set<string>()
  for (let step = 0; step < 40; step += 1) {
    await expect(page.locator('.level-question')).toBeVisible()
    seen.add(await page.locator('.level-question__skill').innerText())
    await answerOne(page)
    const last = page.getByRole('button', { name: /See my level/ })
    if (await last.count()) {
      await last.click()
      break
    }
    await page.getByRole('button', { name: /^Next/ }).click()
  }

  await expect(page.locator('main h1')).toHaveText(/Your level/)
  // reading and the other skills were really asked
  expect([...seen].sort()).toEqual(expect.arrayContaining(['Grammar', 'Reading', 'Spelling', 'Vocabulary']))
  expect(errors).toEqual([])
})

test('the quick check has about half the questions and ends with a result', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#level-check')
  await page.getByRole('button', { name: /Quick check/ }).click()
  await expect(page.getByText(/Question 1 of 1[0-9]/)).toBeVisible() // 12 to 19: far fewer than the full check
  for (let step = 0; step < 25; step += 1) {
    await expect(page.locator('.level-question')).toBeVisible()
    await answerOne(page)
    const last = page.getByRole('button', { name: /See my level/ })
    if (await last.count()) {
      await last.click()
      break
    }
    await page.getByRole('button', { name: /^Next/ }).click()
  }
  await expect(page.locator('main h1')).toHaveText(/Your level/)
  expect(errors).toEqual([])
})

test('a check that was left half way can be continued after a reload', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/#level-check')
  await page.getByRole('button', { name: /Start the check/ }).click()
  for (let step = 0; step < 3; step += 1) {
    await expect(page.locator('.level-question')).toBeVisible()
    await answerOne(page)
    await page.getByRole('button', { name: /^Next/ }).click()
  }
  await page.reload()
  await expect(page.getByRole('button', { name: /Continue · 3 of \d+/ })).toBeVisible()
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByText(/Question 4 of/)).toBeVisible()
  expect(errors).toEqual([])
})
