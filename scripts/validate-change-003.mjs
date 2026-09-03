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

if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar CAMBIO-003.')

const browser = await chromium.launch({ executablePath, headless: true })
const outputDirectory = join(tmpdir(), 'tesi-change-003-review')
await mkdir(outputDirectory, { recursive: true })

const viewports = [
  { name: 'mobile-390', width: 390, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

const longFilename =
  'Javier_Hernandez_Curriculum_Vitae_Experiencia_Profesional_Tecnologias_Financieras_2026.pdf'
const responsiveResults = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const page = await context.newPage()
  const consoleErrors = []
  const consoleWarnings = []
  const pageErrors = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
    if (message.type() === 'warning') consoleWarnings.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  const response = await page.goto('http://localhost:3000/empleo', { waitUntil: 'networkidle' })
  const uploader = page.locator('.cv-uploader')
  await uploader.scrollIntoViewIfNeeded()
  await uploader.waitFor({ state: 'visible' })
  await page.locator('#career-cv').setInputFiles({
    name: longFilename,
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 responsive'),
  })
  await page.getByText('Archivo listo para enviar').waitFor()

  const metrics = await page.evaluate(() => {
    const uploaderElement = document.querySelector('.cv-uploader')
    const filenameElement = document.querySelector('.cv-uploader-filename')
    if (!(uploaderElement instanceof HTMLElement) || !(filenameElement instanceof HTMLElement)) {
      return null
    }

    const uploaderBox = uploaderElement.getBoundingClientRect()
    const filenameBox = filenameElement.getBoundingClientRect()
    return {
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      uploaderWithinViewport:
        uploaderBox.left >= -1 && uploaderBox.right <= window.innerWidth + 1,
      filenameWithinUploader:
        filenameBox.left >= uploaderBox.left - 1 && filenameBox.right <= uploaderBox.right + 1,
      uploaderMinHeight: uploaderBox.height,
    }
  })

  const screenshotPath = join(outputDirectory, `employment-uploader-${viewport.name}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  responsiveResults.push({
    viewport: viewport.name,
    status: response?.status(),
    metrics,
    consoleErrors,
    consoleWarnings,
    pageErrors,
    screenshotPath,
  })
  await context.close()
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
const consoleErrors = []
const consoleWarnings = []
const pageErrors = []
let postRequests = 0

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
  if (message.type() === 'warning') consoleWarnings.push(message.text())
})
page.on('pageerror', (error) => pageErrors.push(error.message))
page.on('request', (request) => {
  if (request.method() === 'POST') postRequests += 1
})

await page.goto('http://localhost:3000/empleo', { waitUntil: 'networkidle' })
const uploader = page.locator('.cv-uploader')
const input = page.locator('#career-cv')
await uploader.scrollIntoViewIfNeeded()
await uploader.waitFor({ state: 'visible' })

const initialState = {
  title: await page.getByText('Adjuntar CV', { exact: true }).isVisible(),
  instruction: await page.getByText('Selecciona o arrastra tu archivo PDF').isVisible(),
  hint: await page.getByText('PDF, máximo 5 MB.').isVisible(),
  nativeInputHidden: await input.evaluate((element) => {
    const styles = getComputedStyle(element)
    return styles.position === 'absolute' && element.getBoundingClientRect().width <= 1
  }),
  acceptedTypes: await input.getAttribute('accept'),
}

const clickChooserPromise = page.waitForEvent('filechooser')
await uploader.click()
const clickChooser = await clickChooserPromise
await clickChooser.setFiles({
  name: longFilename,
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4 click'),
})
await page.getByText('Archivo listo para enviar').waitFor()
const clickSelectionWorks =
  (await page.getByText(longFilename, { exact: true }).isVisible()) &&
  (await page.getByText('Cambiar archivo', { exact: true }).isVisible())

await page.getByRole('button', { name: 'Quitar archivo' }).click()
const removeWorks =
  (await page.getByText('Adjuntar CV', { exact: true }).isVisible()) &&
  (await page.getByText('Archivo listo para enviar').count()) === 0

await uploader.focus()
const keyboardChooserPromise = page.waitForEvent('filechooser')
await page.keyboard.press('Enter')
const keyboardChooser = await keyboardChooserPromise
await keyboardChooser.setFiles({
  name: 'cv-teclado.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4 keyboard'),
})
await page.getByText('Archivo listo para enviar').waitFor()
const keyboardSelectionWorks = await page.getByText('cv-teclado.pdf', { exact: true }).isVisible()

const invalidDataTransfer = await page.evaluateHandle(() => {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(new File(['archivo inválido'], 'cv.txt', { type: 'text/plain' }))
  return dataTransfer
})
await uploader.dispatchEvent('dragenter', { dataTransfer: invalidDataTransfer })
const dragFeedbackWorks = await uploader.evaluate((element) => element.classList.contains('is-dragging'))
await uploader.dispatchEvent('drop', { dataTransfer: invalidDataTransfer })
await page.getByText('El CV debe ser un archivo PDF.').waitFor()
const invalidFileRejected =
  (await page.getByText('Archivo listo para enviar').count()) === 0 &&
  (await uploader.getAttribute('aria-invalid')) === 'true'

const oversizedDataTransfer = await page.evaluateHandle(() => {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(
    new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'cv-grande.pdf', {
      type: 'application/pdf',
    }),
  )
  return dataTransfer
})
await uploader.dispatchEvent('dragenter', { dataTransfer: oversizedDataTransfer })
await uploader.dispatchEvent('drop', { dataTransfer: oversizedDataTransfer })
await page.getByText('El CV no debe superar 5 MB.').waitFor()
const oversizedFileRejected = (await page.getByText('Archivo listo para enviar').count()) === 0

const validDataTransfer = await page.evaluateHandle(() => {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(
    new File(['%PDF-1.4 drag and drop'], 'cv-drag-drop.pdf', { type: 'application/pdf' }),
  )
  return dataTransfer
})
await uploader.dispatchEvent('dragenter', { dataTransfer: validDataTransfer })
await uploader.dispatchEvent('drop', { dataTransfer: validDataTransfer })
await page.getByText('Archivo listo para enviar').waitFor()
const validDropWorks = await page.getByText('cv-drag-drop.pdf', { exact: true }).isVisible()

await page.locator('#career-name').fill('Persona de prueba')
await page.locator('#career-email').fill('persona@example.com')
await page.locator('#career-phone').fill('477 123 4567')
await page.locator('#career-area').selectOption('Desarrollo de software')
await page.locator('#career-technologies').fill('Java, TypeScript')
await page.locator('#career-availability').fill('Inmediata')
await page.locator('#career-message').fill('Mensaje de validación del formulario de empleo.')
await page.getByRole('button', { name: 'Enviar mi CV' }).click()
const submitFlowWorks = await page
  .getByText('Gracias por tu interés en formar parte de TESI. Hemos recibido tu información.')
  .isVisible()

const interactionResults = {
  initialState,
  clickSelectionWorks,
  removeWorks,
  keyboardSelectionWorks,
  dragFeedbackWorks,
  invalidFileRejected,
  oversizedFileRejected,
  validDropWorks,
  submitFlowWorks,
  postRequests,
  consoleErrors,
  consoleWarnings,
  pageErrors,
}

await context.close()

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 900 },
  reducedMotion: 'reduce',
})
const reducedPage = await reducedContext.newPage()
await reducedPage.goto('http://localhost:3000/empleo', { waitUntil: 'networkidle' })
const reducedMotionResult = await reducedPage.locator('.cv-uploader').evaluate((element) => ({
  transitionDuration: getComputedStyle(element).transitionDuration,
  visible: element.getBoundingClientRect().height > 0,
}))
await reducedContext.close()
await browser.close()

const responsivePass = responsiveResults.every(
  (result) =>
    result.status === 200 &&
    result.metrics &&
    !result.metrics.horizontalOverflow &&
    result.metrics.uploaderWithinViewport &&
    result.metrics.filenameWithinUploader &&
    result.metrics.uploaderMinHeight >= 110 &&
    result.consoleErrors.length === 0 &&
    result.consoleWarnings.length === 0 &&
    result.pageErrors.length === 0,
)

const interactionsPass =
  initialState.title &&
  initialState.instruction &&
  initialState.hint &&
  initialState.nativeInputHidden &&
  initialState.acceptedTypes === '.pdf,application/pdf' &&
  clickSelectionWorks &&
  removeWorks &&
  keyboardSelectionWorks &&
  dragFeedbackWorks &&
  invalidFileRejected &&
  oversizedFileRejected &&
  validDropWorks &&
  submitFlowWorks &&
  postRequests === 0 &&
  consoleErrors.length === 0 &&
  consoleWarnings.length === 0 &&
  pageErrors.length === 0

const reducedMotionPass =
  reducedMotionResult.visible && Number.parseFloat(reducedMotionResult.transitionDuration) <= 0.001

console.log(
  JSON.stringify(
    {
      responsiveResults,
      interactionResults,
      reducedMotionResult,
    },
    null,
    2,
  ),
)

if (!responsivePass || !interactionsPass || !reducedMotionPass) process.exitCode = 1
