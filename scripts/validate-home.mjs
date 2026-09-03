import { access, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
]

let executablePath
for (const candidate of browserCandidates) {
  try {
    await access(candidate)
    executablePath = candidate
    break
  } catch {
    // Try the next installed browser.
  }
}

if (!executablePath) {
  throw new Error('No se encontró Chrome o Edge para validar el Home.')
}

const browser = await chromium.launch({ executablePath, headless: true })
const outputDirectory = join(tmpdir(), 'tesi-home-review')
await mkdir(outputDirectory, { recursive: true })

const viewports = [
  { name: 'mobile-320', width: 320, height: 900, screenshot: true },
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'mobile-390', width: 390, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024, screenshot: true },
  { name: 'tablet-1024', width: 1024, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 1000, screenshot: true },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

const results = []

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const consoleErrors = []
  const pageErrors = []
  const failedResponses = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`)
    }
  })

  const response = await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle',
  })

  await page.evaluate(async () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
    await new Promise((resolve) => window.setTimeout(resolve, 1800))
  })

  const metrics = await page.evaluate(() => {
    const root = document.documentElement
    const brokenImages = Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.src)

    return {
      sectionCount: document.querySelectorAll('.home > section').length,
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      scrollHeight: root.scrollHeight,
      brokenImages,
      h1Count: document.querySelectorAll('main h1').length,
    }
  })

  let screenshotPath
  if (viewport.screenshot) {
    screenshotPath = join(outputDirectory, `${viewport.name}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: true })
  }

  results.push({
    viewport: viewport.name,
    status: response?.status(),
    ...metrics,
    horizontalOverflow: metrics.scrollWidth > metrics.clientWidth + 1,
    consoleErrors,
    pageErrors,
    failedResponses,
    screenshotPath,
  })

  await page.close()
}

const reducedMotionPage = await browser.newPage({
  viewport: { width: 390, height: 900 },
  reducedMotion: 'reduce',
})
const reducedMotionErrors = []
reducedMotionPage.on('pageerror', (error) => reducedMotionErrors.push(error.message))
await reducedMotionPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
const reducedMotionSectionCount = await reducedMotionPage.locator('.home > section').count()
await reducedMotionPage.close()
await browser.close()

const report = {
  results,
  reducedMotion: {
    sectionCount: reducedMotionSectionCount,
    pageErrors: reducedMotionErrors,
  },
}

console.log(JSON.stringify(report, null, 2))

const hasErrors =
  results.some(
    (result) =>
      result.status !== 200 ||
      result.sectionCount !== 6 ||
      result.h1Count !== 1 ||
      result.horizontalOverflow ||
      result.brokenImages.length > 0 ||
      result.consoleErrors.length > 0 ||
      result.pageErrors.length > 0 ||
      result.failedResponses.length > 0,
  ) ||
  reducedMotionSectionCount !== 6 ||
  reducedMotionErrors.length > 0

if (hasErrors) process.exitCode = 1
