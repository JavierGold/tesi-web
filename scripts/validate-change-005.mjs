import { access } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const candidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
]
let executablePath
for (const candidate of candidates) {
  try {
    await access(candidate)
    executablePath = candidate
    break
  } catch { continue }
}
if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar CAMBIO-005.')

const browser = await chromium.launch({ executablePath, headless: true })
const uploadAuthorization = {
  message: 'Carga autorizada.',
  key: 'applications/18ed5d9a-39fb-4f20-8f18-62fa6ef2c64a/cv.pdf',
  uploadToken: 'db7ec680-bd90-44ee-8069-559fa4e44819',
  upload: {
    url: 'https://employment-upload.test',
    fields: { key: 'applications/test/cv.pdf', policy: 'signed-policy' },
  },
}

async function revealForm(page, path = '/empleo') {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })
  await page.locator('.form-section').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
}

async function fillEmployment(page, availability = 'Tiempo completo') {
  await page.locator('#career-name').fill('Persona de prueba')
  await page.locator('#career-email').fill('persona@example.com')
  await page.locator('#career-phone').fill('+52 477 123 4567')
  await page.locator('#career-area').selectOption('Desarrollo de software')
  await page.locator('#career-technologies').fill('Java, TypeScript')
  await page.locator('#career-availability').selectOption(availability)
  await page.locator('#career-message').fill('Mensaje de validación del formulario de empleo.')
  await page.locator('#career-cv').setInputFiles({
    name: 'cv-prueba.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 CAMBIO-005'),
  })
}

async function mockEmployment(page, { failAt } = {}) {
  const calls = { authorization: 0, upload: 0, submit: 0, submitBody: null, uploadBody: '' }
  await page.route('https://employment-api.test/employment/upload', async (route) => {
    calls.authorization += 1
    await route.fulfill({
      status: failAt === 'authorization' ? 500 : 200,
      contentType: 'application/json',
      body: JSON.stringify(failAt === 'authorization'
        ? { message: 'No fue posible preparar el envío del CV.' }
        : uploadAuthorization),
    })
  })
  await page.route('https://employment-upload.test/', async (route, request) => {
    calls.upload += 1
    calls.uploadBody = request.postData() || ''
    await new Promise((resolve) => setTimeout(resolve, 200))
    await route.fulfill({ status: failAt === 'upload' ? 500 : 201, body: '<PostResponse />' })
  })
  await page.route('https://employment-api.test/employment/submit', async (route, request) => {
    calls.submit += 1
    calls.submitBody = request.postDataJSON()
    await new Promise((resolve) => setTimeout(resolve, 200))
    await route.fulfill({
      status: failAt === 'submit' ? 500 : 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: failAt === 'submit'
        ? 'No fue posible procesar tu solicitud. Inténtalo de nuevo.'
        : 'Solicitud enviada correctamente.' }),
    })
  })
  return calls
}

const page = await browser.newPage({ viewport: { width: 390, height: 900 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const calls = await mockEmployment(page)
await revealForm(page)
const availabilityOptions = await page.locator('#career-availability option').allTextContents()
await page.locator('.form-submit').click()
await page.locator('.form-error').first().waitFor()
const requiredErrors = await page.locator('.form-error').count()
const noInvalidRequests = Object.values(calls).slice(0, 3).every((value) => value === 0)

await fillEmployment(page)
await page.locator('#career-availability').evaluate((select) => {
  const invalid = document.createElement('option')
  invalid.value = 'Remoto'
  invalid.textContent = 'Remoto'
  select.append(invalid)
  select.value = 'Remoto'
  select.dispatchEvent(new Event('change', { bubbles: true }))
})
await page.locator('.form-submit').click()
await page.getByText('Selecciona tu disponibilidad.').waitFor()
const invalidAvailabilityBlocked = calls.authorization === 0

await page.locator('#career-availability').selectOption('Tiempo completo')
await page.locator('.form-submit').click()
const loadingVisible = await page.getByText('Enviando CV…').isVisible()
const disabledDuringSubmit = await page.locator('.form-submit').isDisabled()
await page.locator('.form-submit').click({ force: true })
await page.getByText('Gracias por tu mensaje, nos pondremos en contacto').waitFor()
const confirmationStyles = await page.locator('.form-confirmation').evaluate((element) => {
  const style = getComputedStyle(element)
  return [style.color, style.backgroundColor, style.borderRadius, style.fontFamily]
})
const success = {
  availabilityOptions,
  requiredErrors,
  noInvalidRequests,
  invalidAvailabilityBlocked,
  loadingVisible,
  disabledDuringSubmit,
  singleFlow: calls.authorization === 1 && calls.upload === 1 && calls.submit === 1,
  pdfUploaded: calls.uploadBody.includes('cv-prueba.pdf') && calls.uploadBody.includes('%PDF-1.4'),
  payloadComplete: ['name', 'email', 'phone', 'area', 'technologies', 'availability', 'message', 'cvKey', 'uploadToken']
    .every((field) => Object.hasOwn(calls.submitBody || {}, field)),
  availabilitySent: calls.submitBody?.availability === 'Tiempo completo',
  formHidden: (await page.locator('form.form-panel').count()) === 0,
  responsive: await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
  errors,
}
await page.close()

const halfTimePage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const halfTimeCalls = await mockEmployment(halfTimePage)
await revealForm(halfTimePage)
await fillEmployment(halfTimePage, 'Medio tiempo')
await halfTimePage.locator('.form-submit').click()
await halfTimePage.getByText('Gracias por tu mensaje, nos pondremos en contacto').waitFor()
const halfTimeAccepted = halfTimeCalls.submitBody?.availability === 'Medio tiempo'
await halfTimePage.close()

const failureResults = []
for (const failAt of ['authorization', 'upload', 'submit']) {
  const failurePage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await mockEmployment(failurePage, { failAt })
  await revealForm(failurePage)
  await fillEmployment(failurePage)
  await failurePage.locator('.form-submit').click()
  await failurePage.locator('.form-submit-error').waitFor()
  failureResults.push({
    failAt,
    formVisible: await failurePage.locator('form.form-panel').isVisible(),
    dataPreserved: (await failurePage.locator('#career-name').inputValue()) === 'Persona de prueba',
    retryEnabled: await failurePage.locator('.form-submit').isEnabled(),
    noSuccess: (await failurePage.getByText('Gracias por tu mensaje, nos pondremos en contacto').count()) === 0,
  })
  await failurePage.close()
}

const contactPage = await browser.newPage({ viewport: { width: 390, height: 900 } })
let web3FormsCalls = 0
let awsCalls = 0
contactPage.on('request', (request) => {
  if (request.url().includes('employment-api.test')) awsCalls += 1
})
await contactPage.route('https://api.web3forms.com/submit', async (route) => {
  web3FormsCalls += 1
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
})
await revealForm(contactPage, '/contacto')
await contactPage.locator('#contact-name').fill('Persona de prueba')
await contactPage.locator('#contact-company').fill('Empresa de prueba')
await contactPage.locator('#contact-email').fill('persona@example.com')
await contactPage.locator('#contact-phone').fill('+52 477 123 4567')
await contactPage.locator('#contact-need').selectOption('Datos y procesos ETL')
await contactPage.locator('#contact-message').fill('Mensaje válido para el formulario de contacto.')
await contactPage.locator('.form-submit').click()
await contactPage.getByText('Gracias por tu mensaje, nos pondremos en contacto').waitFor()
const contactConfirmationStyles = await contactPage.locator('.form-confirmation').evaluate((element) => {
  const style = getComputedStyle(element)
  return [style.color, style.backgroundColor, style.borderRadius, style.fontFamily]
})
const contactUnchanged = web3FormsCalls === 1 && awsCalls === 0
const sameConfirmation = JSON.stringify(confirmationStyles) === JSON.stringify(contactConfirmationStyles)
await contactPage.close()
await browser.close()

const passed =
  JSON.stringify(success.availabilityOptions) === JSON.stringify(['Selecciona una opción', 'Tiempo completo', 'Medio tiempo']) &&
  success.requiredErrors === 8 && success.noInvalidRequests && success.invalidAvailabilityBlocked &&
  success.loadingVisible && success.disabledDuringSubmit && success.singleFlow && success.pdfUploaded &&
  success.payloadComplete && success.availabilitySent && success.formHidden && success.responsive &&
  success.errors.length === 0 && halfTimeAccepted &&
  failureResults.every(({ failAt: _failAt, ...result }) => Object.values(result).every(Boolean)) &&
  contactUnchanged && sameConfirmation

console.log(JSON.stringify({ success, halfTimeAccepted, failureResults, contactUnchanged, sameConfirmation }, null, 2))
if (!passed) process.exitCode = 1
