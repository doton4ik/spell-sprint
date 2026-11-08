// Renders public/icons/*.png from public/icons/spell-sprint-icon.svg with Playwright's Chromium.
// Run: node scripts/make-icons.mjs
// - icon-192.png, icon-512.png: rounded icon (purpose "any")
// - icon-maskable-512.png: full-bleed square, artwork inside the safe zone (Android adaptive icons)
// - icon-1024.png: App Store icon, full-bleed square, no transparency (Apple rounds the corners itself)
// - apple-touch-icon.png (180): full-bleed square for iOS home screens
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../public/icons/', import.meta.url))
const svg = readFileSync(`${dir}spell-sprint-icon.svg`, 'utf8')
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const art = inner.replace(/<rect[^>]*\/>/, '')
const BLUE = '#2d4f80'

const rounded = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">${inner}</svg>`
const square = (size, scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}"><rect width="512" height="512" fill="${BLUE}"/><g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${art}</g></svg>`

const jobs = [
  ['icon-192.png', 192, rounded(192), true],
  ['icon-512.png', 512, rounded(512), true],
  ['icon-maskable-512.png', 512, square(512, 0.78), false],
  ['icon-1024.png', 1024, square(1024, 0.9), false],
  ['apple-touch-icon.png', 180, square(180, 0.9), false],
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const [name, size, markup, transparent] of jobs) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<html><body style="margin:0;background:${transparent ? 'transparent' : BLUE}">${markup}</body></html>`)
  const buffer = await page.screenshot({ omitBackground: transparent, clip: { x: 0, y: 0, width: size, height: size } })
  writeFileSync(`${dir}${name}`, buffer)
  console.log(name, buffer.length)
}
await browser.close()
