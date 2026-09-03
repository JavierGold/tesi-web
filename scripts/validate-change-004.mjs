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

if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar CAMBIO-004.')

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

async function fillCareers(page) {
  await page.locator('#career-name').fill('Persona de prueba')
  await page.locator('#career-email').fill('persona@example.com')
  await page.locator('#career-phone').fill('+52 477 123 4567')
  await page.locator('#career-area').selectOption('Desarrollo de software')
  await page.locator('#career-technologies').fill('Java, TypeScript')
  await page.locator('#career-availability').fill('Inmediata')
  await page.locator('#career-message').fill('Mensaje de validación del formulario.')
  await page.locator('#career-cv').setInputFiles({
    name: 'cv-prueba.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 validación CAMBIO-004'),
  })
}

async function fillContact(page) {
  await page.locator('#contact-name').fill('Persona de prueba')
  await page.locator('#contact-company').fill('Empresa de prueba')
  await page.locator('#contact-email').fill('persona@example.com')
  await page.locator('#contact-phone').fill('+52 477 123 4567')
  await page.locator('#contact-need').selectOption('Datos y procesos ETL')
  await page.locator('#contact-message').fill('Mensaje de validación del formulario.')
}

for (const scenario of [
  { name: 'empleo', path: '/empleo', button: 'Enviar mi CV', errors: 8, fill: fillCareers },
  { name: 'contacto', path: '/contacto', button: 'Enviar mensaje', errors: 6, fill: fillContact },
]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } })
  const page = await context.newPage()
  const requests = []
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.route('https://api.web3forms.com/submit', async (route, request) => {
    requests.push(request.postData() || '')
    await new Promise((resolve) => setTimeout(resolve, 250))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.goto(`http://localhost:3000${scenario.path}`, { waitUntil: 'networkidle' })
  const submit = page.locator('.form-submit')
  await submit.scrollIntoViewIfNeeded()
  await submit.click()
  await page.locator('.form-error').first().waitFor()
  const invalidErrors = await page.locator('.form-error').count()
  const invalidRequests = requests.length

  await scenario.fill(page)
  await submit.click()
  const disabledDuringSubmit = await submit.isDisabled()
  await submit.click({ force: true })
  await page.getByText('Gracias por tu mensaje, nos pondremos en contacto').waitFor()

  const payload = requests[0] || ''
  const expectedPayload = scenario.name === 'empleo'
    ? ['name="name"', 'name="email"', 'name="phone"', 'name="area"', 'name="technologies"', 'name="availability"', 'name="message"', 'name="attachment"; filename="cv-prueba.pdf"', 'TESI - Empleo']
    : ['name="name"', 'name="company"', 'name="email"', 'name="phone"', 'name="need"', 'name="message"', 'TESI - Contacto']

  results.push({
    scenario: scenario.name,
    invalidErrors,
    invalidRequests,
    disabledDuringSubmit,
    singleRequest: requests.length === 1,
    payloadComplete: expectedPayload.every((value) => payload.includes(value)),
    formHiddenAfterSuccess: (await page.locator('form.form-panel').count()) === 0,
    confirmationVisible: await page.getByText('Gracias por tu mensaje, nos pondremos en contacto').isVisible(),
    noHorizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    pageErrors,
  })
  await context.close()
}

const errorContext = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const errorPage = await errorContext.newPage()
await errorPage.route('https://api.web3forms.com/submit', (route) => route.fulfill({
  status: 500,
  contentType: 'application/json',
  body: JSON.stringify({ success: false, message: 'Error de prueba' }),
}))
await errorPage.goto('http://localhost:3000/contacto', { waitUntil: 'networkidle' })
await errorPage.locator('.form-section').scrollIntoViewIfNeeded()
await errorPage.waitForTimeout(900)
await fillContact(errorPage)
await errorPage.locator('.form-submit').click()
await errorPage.getByText('Error de prueba').waitFor()
const failureResult = {
  formRemainsVisible: await errorPage.locator('form.form-panel').isVisible(),
  dataPreserved: (await errorPage.locator('#contact-company').inputValue()) === 'Empresa de prueba',
  retryEnabled: await errorPage.locator('.form-submit').isEnabled(),
  noSuccessMessage: (await errorPage.getByText('Gracias por tu mensaje, nos pondremos en contacto').count()) === 0,
}
await errorContext.close()
await browser.close()

const passed = results.every((result) =>
  result.invalidErrors === (result.scenario === 'empleo' ? 8 : 6) &&
  result.invalidRequests === 0 &&
  result.disabledDuringSubmit &&
  result.singleRequest &&
  result.payloadComplete &&
  result.formHiddenAfterSuccess &&
  result.confirmationVisible &&
  result.noHorizontalOverflow &&
  result.pageErrors.length === 0,
) && Object.values(failureResult).every(Boolean)

console.log(JSON.stringify({ results, failureResult }, null, 2))
if (!passed) process.exitCode = 1
