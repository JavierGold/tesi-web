import { access } from 'node:fs/promises'
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
    continue
  }
}

if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar el sitio.')

const baseUrl = (process.env.TESI_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const routes = [
  { path: '/', heading: 'Tecnología para sistemas que no pueden detenerse.' },
  {
    path: '/sobre-nosotros',
    heading: 'Experiencia tecnológica. Conocimiento del sector. Compromiso con cada proyecto.',
  },
  { path: '/empleo', heading: 'Tu próximo reto puede comenzar en TESI.' },
  { path: '/contacto', heading: 'Hablemos de tecnología.' },
]
const viewports = [
  { name: 'mobile', width: 390, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 900 },
  { name: 'desktop', width: 1920, height: 1080 },
]

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()

  for (const route of routes) {
    const errors = []
    const failedResources = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`)
    })

    const directResponse = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { level: 1, name: route.heading }).waitFor()
    const directPath = new URL(page.url()).pathname
    const directContentType = directResponse?.headers()['content-type'] ?? ''

    const initialHeader = await page.locator('.site-header').boundingBox()
    const initiallyCompact = await page.locator('.site-header.is-compact').count()
    const mainTop = await page.locator('#main-content').evaluate((element) =>
      Math.round(element.getBoundingClientRect().top + window.scrollY),
    )

    const reloadResponse = await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('heading', { level: 1, name: route.heading }).waitFor()
    const reloadPath = new URL(page.url()).pathname

    await page.waitForTimeout(100)
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
    await page.locator('.site-header.is-compact').waitFor()
    await page.waitForFunction(() => window.scrollY > 24)
    await page.waitForTimeout(300)
    const compactHeader = await page.locator('.site-header').boundingBox()
    const activeLabel = await page.locator('.nav-link[aria-current="page"]').textContent()
    const offsets = await page.evaluate(() => ({
      scrollPaddingTop: Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
      mainScrollMarginTop: Number.parseFloat(
        getComputedStyle(document.querySelector('#main-content')).scrollMarginTop,
      ),
    }))
    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )

    let mobileMenu
    if (viewport.width <= 860) {
      const button = page.getByRole('button', { name: 'Abrir menú' })
      const buttonBox = await button.boundingBox()
      await button.click()
      await page.waitForTimeout(300)
      const navigationBox = await page.locator('#primary-navigation.is-open').boundingBox()
      mobileMenu = {
        buttonIsTouchSized: Boolean(buttonBox && buttonBox.width >= 44 && buttonBox.height >= 44),
        coversViewport: Boolean(
          navigationBox &&
            Math.abs(navigationBox.y) <= 1 &&
            navigationBox.height >= viewport.height - 2,
        ),
        navigationBox,
      }
      await page.getByRole('button', { name: 'Cerrar menú' }).click()
    }

    results.push({
      viewport: viewport.name,
      route: route.path,
      directStatus: directResponse?.status(),
      directContentType,
      directPath,
      reloadStatus: reloadResponse?.status(),
      reloadPath,
      heading: route.heading,
      initiallyCompact,
      initialHeaderHeight: initialHeader?.height,
      compactHeaderHeight: compactHeader?.height,
      stickyTop: compactHeader?.y,
      mainTop,
      activeLabel: activeLabel?.trim(),
      offsets,
      horizontalOverflow,
      mobileMenu,
      errors,
      failedResources,
    })

    page.removeAllListeners('pageerror')
    page.removeAllListeners('response')
  }

  await context.close()
}

async function clickNavigation(page, label) {
  const menuButton = page.getByRole('button', { name: 'Abrir menú' })
  if (await menuButton.isVisible()) await menuButton.click()
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', { name: label, exact: true })
    .click()
}

const historyPage = await browser.newPage({ viewport: { width: 390, height: 900 } })
await historyPage.goto(baseUrl, { waitUntil: 'networkidle' })
await clickNavigation(historyPage, 'Empleo')
await historyPage.waitForURL('**/empleo')
const mobileMenuClosedAfterSelection =
  (await historyPage.locator('#primary-navigation.is-open').count()) === 0
await clickNavigation(historyPage, 'Contacto')
await historyPage.waitForURL('**/contacto')
await historyPage.goBack({ waitUntil: 'networkidle' })
const backPath = new URL(historyPage.url()).pathname
const backActive = await historyPage.locator('.nav-link[aria-current="page"]').textContent()
await historyPage.goForward({ waitUntil: 'networkidle' })
const forwardPath = new URL(historyPage.url()).pathname
const forwardActive = await historyPage.locator('.nav-link[aria-current="page"]').textContent()
await historyPage.close()

const animationPage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await animationPage.goto(`${baseUrl}/sobre-nosotros`, { waitUntil: 'networkidle' })
const animationStart = Date.now()
await animationPage.locator('.pmi-model').scrollIntoViewIfNeeded()
await animationPage.locator('[data-pmi-section].is-live').waitFor({ timeout: 1800 })
const animationDurationMs = Date.now() - animationStart
const pmiState = await animationPage.evaluate(() => ({
  coreVisible: getComputedStyle(document.querySelector('[data-pmi-core]')).visibility !== 'hidden',
  dimensionCount: document.querySelectorAll('[data-pmi-dimension]').length,
  visibleDimensions: Array.from(document.querySelectorAll('[data-pmi-dimension]')).filter(
    (element) =>
      getComputedStyle(element).visibility !== 'hidden' &&
      Number.parseFloat(getComputedStyle(element).opacity) > 0.99,
  ).length,
  hasRequiredLabels: ['Proyecto exitoso', 'Requerimientos', 'Calidad', 'Tiempo', 'Costo'].every(
    (label) => document.querySelector('.pmi-model')?.textContent?.includes(label),
  ),
}))
await animationPage.close()

const reducedPage = await browser.newPage({
  viewport: { width: 390, height: 900 },
  reducedMotion: 'reduce',
})
await reducedPage.goto(`${baseUrl}/sobre-nosotros`, { waitUntil: 'networkidle' })
await reducedPage.locator('.pmi-model').scrollIntoViewIfNeeded()
const reducedMotionVisible = await reducedPage.locator('[data-pmi-core], [data-pmi-dimension]').evaluateAll(
  (elements) =>
    elements.every(
      (element) =>
        getComputedStyle(element).visibility !== 'hidden' &&
        Number.parseFloat(getComputedStyle(element).opacity) > 0.99,
    ),
)
await reducedPage.close()
await browser.close()

const routeFailures = results.filter((result) => {
  const expectedActive = result.route === '/' ? 'Home' : routes.find((route) => route.path === result.route)?.heading
  const activeMatches =
    result.route === '/sobre-nosotros'
      ? result.activeLabel === 'Sobre nosotros'
      : result.route === '/empleo'
        ? result.activeLabel === 'Empleo'
        : result.route === '/contacto'
          ? result.activeLabel === 'Contacto'
          : result.activeLabel === expectedActive

  return (
    result.directStatus !== 200 ||
    !result.directContentType.includes('text/html') ||
    result.directPath !== result.route ||
    result.reloadStatus !== 200 ||
    result.reloadPath !== result.route ||
    result.initiallyCompact !== 0 ||
    !result.initialHeaderHeight ||
    !result.compactHeaderHeight ||
    result.compactHeaderHeight >= result.initialHeaderHeight ||
    Math.abs(result.stickyTop ?? 99) > 1 ||
    result.mainTop < result.initialHeaderHeight - 1 ||
    result.offsets.scrollPaddingTop < result.compactHeaderHeight ||
    result.offsets.mainScrollMarginTop < result.compactHeaderHeight ||
    !activeMatches ||
    result.horizontalOverflow ||
    result.mobileMenu?.buttonIsTouchSized === false ||
    result.mobileMenu?.coversViewport === false ||
    result.errors.length > 0 ||
    result.failedResources.length > 0
  )
})

const historyPass =
  mobileMenuClosedAfterSelection &&
  backPath === '/empleo' &&
  backActive?.trim() === 'Empleo' &&
  forwardPath === '/contacto' &&
  forwardActive?.trim() === 'Contacto'
const animationPass =
  animationDurationMs <= 1500 &&
  pmiState.coreVisible &&
  pmiState.dimensionCount === 4 &&
  pmiState.visibleDimensions === 4 &&
  pmiState.hasRequiredLabels

console.log(
  JSON.stringify(
    {
      baseUrl,
      checkedRouteViewports: results.length,
      routeFailures,
      history: {
        mobileMenuClosedAfterSelection,
        backPath,
        backActive: backActive?.trim(),
        forwardPath,
        forwardActive: forwardActive?.trim(),
      },
      animation: { animationDurationMs, ...pmiState, reducedMotionVisible },
    },
    null,
    2,
  ),
)

if (routeFailures.length > 0 || !historyPass || !animationPass || !reducedMotionVisible) {
  process.exitCode = 1
}
