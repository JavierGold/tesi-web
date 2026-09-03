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
    continue
  }
}

if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar el sitio.')

const browser = await chromium.launch({ executablePath, headless: true })
const outputDirectory = join(tmpdir(), 'tesi-site-review')
await mkdir(outputDirectory, { recursive: true })

const routes = [
  { path: '/', name: 'home', sections: 6, title: 'TESI | Tecnología en Soluciones Informáticas' },
  { path: '/nosotros', name: 'about', sections: 8, title: 'Sobre nosotros | TESI' },
  { path: '/empleo', name: 'employment', sections: 4, title: 'Empleo | TESI' },
  { path: '/contacto', name: 'contact', sections: 3, title: 'Contacto | TESI' },
]

const viewports = [
  { name: 'mobile-320', width: 320, height: 900 },
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'mobile-390', width: 390, height: 900, screenshot: true },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 1000, screenshot: true },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const page = await context.newPage()

  for (const route of routes) {
    const consoleErrors = []
    const consoleWarnings = []
    const pageErrors = []
    const failedResponses = []

    const onConsole = (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
      if (message.type() === 'warning') consoleWarnings.push(message.text())
    }
    const onPageError = (error) => pageErrors.push(error.message)
    const onResponse = (response) => {
      if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`)
    }

    page.on('console', onConsole)
    page.on('pageerror', onPageError)
    page.on('response', onResponse)

    const response = await page.goto(`http://localhost:3000${route.path}`, {
      waitUntil: 'networkidle',
    })
    await page.locator('main > article').waitFor({ state: 'visible' })

    await page.evaluate(async () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
      await new Promise((resolve) => window.setTimeout(resolve, 900))
    })

    const metrics = await page.evaluate(() => {
      const root = document.documentElement
      const brokenImages = Array.from(document.images)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.src)
      const unlabeledControls = Array.from(
        document.querySelectorAll('form input:not([type="hidden"]), form select, form textarea'),
      )
        .filter((control) => !control.id || !document.querySelector(`label[for="${control.id}"]`))
        .map((control) => control.id || control.tagName)

      return {
        sectionCount: document.querySelectorAll('main article > section').length,
        h1Count: document.querySelectorAll('main h1').length,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        brokenImages,
        unlabeledControls,
      }
    })

    let screenshotPath
    if (viewport.screenshot) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      screenshotPath = join(outputDirectory, `${route.name}-${viewport.name}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: true })
    }

    results.push({
      route: route.path,
      viewport: viewport.name,
      status: response?.status(),
      title: await page.title(),
      ...metrics,
      horizontalOverflow: metrics.scrollWidth > metrics.clientWidth + 1,
      consoleErrors,
      consoleWarnings,
      pageErrors,
      failedResponses,
      screenshotPath,
    })

    page.off('console', onConsole)
    page.off('pageerror', onPageError)
    page.off('response', onResponse)
  }

  await context.close()
}

const interactionPage = await browser.newPage({ viewport: { width: 390, height: 900 } })
await interactionPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await interactionPage.getByRole('button', { name: 'Abrir menú' }).click()
const mobileMenuOpened =
  (await interactionPage.locator('body.menu-open').count()) === 1 &&
  (await interactionPage.locator('#primary-navigation.is-open').count()) === 1
await interactionPage.keyboard.press('Escape')
const mobileMenuClosed =
  (await interactionPage.locator('body.menu-open').count()) === 0 &&
  (await interactionPage.getByRole('button', { name: 'Abrir menú' }).count()) === 1
await interactionPage.getByRole('button', { name: 'Abrir menú' }).click()
await interactionPage
  .getByRole('navigation', { name: 'Navegación principal' })
  .getByRole('link', { name: 'Empleo', exact: true })
  .click()
await interactionPage.waitForURL('**/empleo')
const mobileNavigationWorks = interactionPage.url().endsWith('/empleo')

await interactionPage.goto('http://localhost:3000/nosotros', { waitUntil: 'networkidle' })
const timelineItems = await interactionPage.locator('.timeline-item').count()
const timelineTrackBox = await interactionPage.locator('.timeline-track').boundingBox()
const mobileTimelineIsVertical = Boolean(
  timelineTrackBox && timelineTrackBox.height > timelineTrackBox.width,
)

let formPostRequests = 0
interactionPage.on('request', (request) => {
  if (request.method() === 'POST') formPostRequests += 1
})
await interactionPage.route('https://api.web3forms.com/submit', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, message: 'Email sent successfully!' }),
  })
})
await interactionPage.route('https://employment-api.test/employment/upload', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      message: 'Carga autorizada.',
      key: 'applications/18ed5d9a-39fb-4f20-8f18-62fa6ef2c64a/cv.pdf',
      uploadToken: 'db7ec680-bd90-44ee-8069-559fa4e44819',
      upload: { url: 'https://employment-upload.test', fields: { key: 'cv.pdf' } },
    }),
  })
})
await interactionPage.route('https://employment-upload.test/', async (route) => {
  await route.fulfill({ status: 201, contentType: 'application/xml', body: '<PostResponse />' })
})
await interactionPage.route('https://employment-api.test/employment/submit', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Solicitud enviada correctamente.' }),
  })
})

await interactionPage.goto('http://localhost:3000/empleo', { waitUntil: 'networkidle' })
await interactionPage.locator('.form-section').scrollIntoViewIfNeeded()
await interactionPage.waitForTimeout(900)
await interactionPage.getByRole('button', { name: 'Enviar mi CV' }).click()
await interactionPage.locator('.form-error').first().waitFor()
const careersRequiredErrors = await interactionPage.locator('.form-error').count()
await interactionPage.locator('#career-name').fill('Persona de prueba')
await interactionPage.locator('#career-email').fill('persona@example.com')
await interactionPage.locator('#career-phone').fill('477 123 4567')
await interactionPage.locator('#career-area').selectOption('Desarrollo de software')
await interactionPage.locator('#career-technologies').fill('Java, TypeScript')
await interactionPage.locator('#career-availability').selectOption('Tiempo completo')
await interactionPage.locator('#career-message').fill('Mensaje de validación del formulario.')
await interactionPage.locator('#career-cv').setInputFiles({
  name: 'cv.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('archivo inválido'),
})
await interactionPage.getByRole('button', { name: 'Enviar mi CV' }).click()
const invalidCvRejected = await interactionPage.getByText('El CV debe ser un archivo PDF.').isVisible()
await interactionPage.locator('#career-cv').setInputFiles({
  name: 'cv.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
})
await interactionPage.getByText('El CV no debe superar 5 MB.').waitFor()
await interactionPage.getByRole('button', { name: 'Enviar mi CV' }).click()
const oversizedCvRejected = await interactionPage.getByText('El CV no debe superar 5 MB.').isVisible()
await interactionPage.locator('#career-cv').setInputFiles({
  name: 'cv.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4 validación frontend'),
})
await interactionPage.getByText('Archivo listo para enviar').waitFor()
await interactionPage.getByRole('button', { name: 'Enviar mi CV' }).click()
await interactionPage.getByText('Gracias por tu mensaje, nos pondremos en contacto').waitFor()
const careersSuccess = await interactionPage
  .getByText('Gracias por tu mensaje, nos pondremos en contacto')
  .isVisible()

await interactionPage.goto('http://localhost:3000/contacto', { waitUntil: 'networkidle' })
await interactionPage.locator('.form-section').scrollIntoViewIfNeeded()
await interactionPage.waitForTimeout(900)
await interactionPage.getByRole('button', { name: 'Enviar mensaje' }).click()
await interactionPage.locator('.form-error').first().waitFor()
const contactRequiredErrors = await interactionPage.locator('.form-error').count()
await interactionPage.locator('#contact-name').fill('Persona de prueba')
await interactionPage.locator('#contact-company').fill('Empresa de prueba')
await interactionPage.locator('#contact-email').fill('persona@example.com')
await interactionPage.locator('#contact-phone').fill('477 123 4567')
await interactionPage
  .locator('#contact-need')
  .selectOption('Mantenimiento y evolución de sistemas financieros/bancarios')
await interactionPage.locator('#contact-message').fill('Mensaje de validación del formulario.')
await interactionPage.getByRole('button', { name: 'Enviar mensaje' }).click()
const contactSuccess = await interactionPage
  .getByText('Gracias por tu mensaje, nos pondremos en contacto')
  .isVisible()
await interactionPage.close()

const reducedMotionResults = []
for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
    reducedMotion: 'reduce',
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' })
  const hiddenContent = await page.locator('[data-page-reveal], [data-reveal]').evaluateAll((elements) =>
    elements.filter((element) => getComputedStyle(element).visibility === 'hidden').length,
  )
  reducedMotionResults.push({ route: route.path, errors, hiddenContent })
  await page.close()
}

await browser.close()

const interactionResults = {
  mobileMenuOpened,
  mobileMenuClosed,
  mobileNavigationWorks,
  timelineItems,
  mobileTimelineIsVertical,
  careersRequiredErrors,
  invalidCvRejected,
  oversizedCvRejected,
  careersSuccess,
  contactRequiredErrors,
  contactSuccess,
  formPostRequests,
}

const failures = results.filter((result) => {
  const route = routes.find((item) => item.path === result.route)
  return (
    result.status !== 200 ||
    result.sectionCount !== route?.sections ||
    result.title !== route?.title ||
    result.h1Count !== 1 ||
    result.horizontalOverflow ||
    result.brokenImages.length > 0 ||
    result.unlabeledControls.length > 0 ||
    result.consoleErrors.length > 0 ||
    result.consoleWarnings.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedResponses.length > 0
  )
})

const interactionsPass =
  mobileMenuOpened &&
  mobileMenuClosed &&
  mobileNavigationWorks &&
  timelineItems === 5 &&
  mobileTimelineIsVertical &&
  careersRequiredErrors === 8 &&
  invalidCvRejected &&
  oversizedCvRejected &&
  careersSuccess &&
  contactRequiredErrors === 6 &&
  contactSuccess &&
  formPostRequests === 4

const reducedMotionPass = reducedMotionResults.every(
  (result) => result.errors.length === 0 && result.hiddenContent === 0,
)

console.log(
  JSON.stringify(
    {
      checkedPages: results.length,
      failures,
      interactionResults,
      reducedMotionResults,
      screenshots: results.flatMap((result) => result.screenshotPath ?? []),
    },
    null,
    2,
  ),
)

if (failures.length > 0 || !interactionsPass || !reducedMotionPass) process.exitCode = 1
