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

if (!executablePath) throw new Error('No se encontró Chrome o Edge para validar los modelos de /nosotros.')

const browser = await chromium.launch({ executablePath, headless: true })
const outputDirectory = join(tmpdir(), 'tesi-change-002-review')
await mkdir(outputDirectory, { recursive: true })

const viewports = [
  { name: 'mobile-320', width: 320, height: 900 },
  { name: 'mobile-390', width: 390, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'intermediate-1024', width: 1024, height: 900 },
  { name: 'laptop-1280', width: 1280, height: 900 },
  { name: 'desktop-wide-1920', width: 1920, height: 1080 },
]

const expectedPmiLabels = [
  'Project Office',
  'Portafolio de proyectos',
  'Project Managers',
  'Proyecto exitoso',
  'Requerimientos',
  'Tiempo',
  'Costo',
  'Calidad',
  'Personal capacitado',
  'Herramientas',
  'Conocimiento',
  'Experiencia',
]

const expectedTalentLabels = [
  'Necesidad de capacidad',
  'Incorporación de talento',
  'Capacitación y desarrollo',
  'Talento preparado / Capacity',
  'Generamos talento de manera continua para responder al crecimiento de nuestros clientes.',
]

const expectedPmiTitle = 'Gestión de proyectos alineada a los lineamientos del PMI.'
const expectedPmiDescription =
  'En TESI gestionamos nuestros proyectos bajo los lineamientos y buenas prácticas del Project Management Institute (PMI), mediante una Project Office y Project Managers responsables de la planificación, seguimiento y control de cada proyecto.'

const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const page = await context.newPage()
  const consoleErrors = []
  const consoleWarnings = []
  const pageErrors = []
  const failedResponses = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
    if (message.type() === 'warning') consoleWarnings.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`)
  })

  const response = await page.goto('http://localhost:3000/nosotros', { waitUntil: 'networkidle' })
  await page.locator('main > article').waitFor({ state: 'visible' })

  await page.locator('.pmi-orbit').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2300)

  const coreDuringAnimation = await page.locator('.pmi-core').evaluate((core) => {
    const text = core.querySelector('strong')
    if (!text) return { contained: false, uncovered: false }
    const coreBox = core.getBoundingClientRect()
    const textBox = text.getBoundingClientRect()
    const topElement = document.elementFromPoint(
      textBox.x + textBox.width / 2,
      textBox.y + textBox.height / 2,
    )

    return {
      contained:
        textBox.left >= coreBox.left - 1 &&
        textBox.right <= coreBox.right + 1 &&
        textBox.top >= coreBox.top - 1 &&
        textBox.bottom <= coreBox.bottom + 1,
      uncovered: Boolean(topElement && core.contains(topElement)),
    }
  })

  await page.waitForTimeout(3300)
  await page.locator('.talent-model').scrollIntoViewIfNeeded()
  await page.waitForTimeout(5200)

  const metrics = await page.evaluate(
    ({ pmiDescriptionExpected, pmiLabels, pmiTitleExpected, talentLabels }) => {
      const root = document.documentElement
      const pageText = (document.querySelector('main')?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim()
      const talentNodes = Array.from(document.querySelectorAll('.talent-stage-node')).map((node) => {
        const box = node.getBoundingClientRect()
        const style = getComputedStyle(node)
        return {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          cssWidth: Number.parseFloat(style.width),
          backgroundColor: style.backgroundColor,
        }
      })
      const coreElement = document.querySelector('.pmi-core')
      const core = coreElement?.getBoundingClientRect()
      const coreText = coreElement?.querySelector('strong')?.getBoundingClientRect()
      const coreStyle = coreElement ? getComputedStyle(coreElement) : null
      const dimensions = Array.from(document.querySelectorAll('.pmi-dimension')).map((node) => {
        const box = node.getBoundingClientRect()
        return {
          left: box.left,
          right: box.right,
          top: box.top,
          bottom: box.bottom,
          centerX: box.x + box.width / 2,
          centerY: box.y + box.height / 2,
        }
      })
      const talentCopyStyles = Array.from(document.querySelectorAll('.talent-stage-copy')).map(
        (copy) => {
          const heading = copy.querySelector('h3')
          const paragraph = copy.querySelector('p')
          const copyStyle = getComputedStyle(copy)
          return {
            marginTop: copyStyle.marginTop,
            maxWidth: copyStyle.maxWidth,
            headingLineHeight: heading ? getComputedStyle(heading).lineHeight : '',
            paragraphMarginTop: paragraph ? getComputedStyle(paragraph).marginTop : '',
            textAlign: copyStyle.textAlign,
          }
        },
      )
      const finalMessage = document.querySelector('.talent-final-message')
      const finalMessageStyle = finalMessage ? getComputedStyle(finalMessage) : null
      const bodyFontFamily = getComputedStyle(document.body).fontFamily
      const pmiTitle = document.querySelector('#pmi-title')?.textContent?.trim()
      const pmiDescription = document
        .querySelector('.pmi-section .section-heading p')
        ?.textContent?.trim()

      const coreTextContained = Boolean(
        core &&
          coreText &&
          coreText.left >= core.left - 1 &&
          coreText.right <= core.right + 1 &&
          coreText.top >= core.top - 1 &&
          coreText.bottom <= core.bottom + 1,
      )
      const coreOverlapsDimension = Boolean(
        core &&
          dimensions.some(
            (dimension) =>
              core.left < dimension.right &&
              core.right > dimension.left &&
              core.top < dimension.bottom &&
              core.bottom > dimension.top,
          ),
      )

      return {
        sectionCount: document.querySelectorAll('main article > section').length,
        h1Count: document.querySelectorAll('main h1').length,
        horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
        oldProcessRemoved: !pageText.includes('Una forma de trabajar enfocada en resultados'),
        pmiLabelsPresent: pmiLabels.every((label) => pageText.includes(label)),
        missingPmiLabels: pmiLabels.filter((label) => !pageText.includes(label)),
        pmiCopyCorrect: pmiTitle === pmiTitleExpected && pmiDescription === pmiDescriptionExpected,
        floatingPmiLabelRemoved: document.querySelector('.pmi-ring-label') === null,
        talentLabelsPresent: talentLabels.every((label) => pageText.includes(label)),
        pmiDimensions: document.querySelectorAll('[data-pmi-dimension]').length,
        pmiStructureItems: document.querySelectorAll('.pmi-structure-item').length,
        pmiCapabilities: document.querySelectorAll('.pmi-capabilities li').length,
        talentStages: document.querySelectorAll('.talent-stage').length,
        pmiAnimationCompleted: document.querySelector('[data-pmi-section]')?.classList.contains('is-live'),
        talentAnimationCompleted: document
          .querySelector('[data-talent-section]')
          ?.classList.contains('is-live'),
        talentNodes,
        talentCopyStyles,
        pmiCoreUsesLightSystem:
          Boolean(coreStyle) &&
          coreStyle.backgroundColor !== 'rgb(8, 43, 76)' &&
          coreStyle.color === 'rgb(8, 43, 76)',
        coreTextContained,
        coreOverlapsDimension,
        finalMessageFontFamily: finalMessageStyle?.fontFamily ?? '',
        bodyFontFamily,
        finalMessageUsesSiteFont:
          Boolean(finalMessageStyle) &&
          finalMessageStyle.fontFamily === bodyFontFamily &&
          bodyFontFamily.toLowerCase().includes('manrope'),
        pmiRadial:
          Boolean(core) &&
          dimensions.length === 4 &&
          dimensions.some((node) => node.centerY < core.y) &&
          dimensions.some((node) => node.centerX > core.x + core.width) &&
          dimensions.some((node) => node.centerY > core.y + core.height) &&
          dimensions.some((node) => node.centerX < core.x),
        canvasCount: document.querySelectorAll('canvas').length,
      }
    },
    {
      pmiLabels: expectedPmiLabels,
      talentLabels: expectedTalentLabels,
      pmiTitleExpected: expectedPmiTitle,
      pmiDescriptionExpected: expectedPmiDescription,
    },
  )

  const centers = metrics.talentNodes.map((node) => ({
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  }))
  const talentDirectionCorrect =
    viewport.width <= 760
      ? centers.every((center, index) => index === 0 || center.y > centers[index - 1].y)
      : centers.every((center, index) => index === 0 || center.x > centers[index - 1].x)
  const talentNodeBaseSizesMatch =
    metrics.talentNodes.length === 4 &&
    metrics.talentNodes.every(
      (node) => Math.abs(node.cssWidth - metrics.talentNodes[0].cssWidth) < 0.5,
    )
  const resultNodeUsesLightSystem =
    metrics.talentNodes.length === 4 &&
    metrics.talentNodes[3].backgroundColor !== 'rgb(8, 43, 76)'
  const talentCopyPatternMatches =
    metrics.talentCopyStyles.length === 4 &&
    metrics.talentCopyStyles.every(
      (style) => JSON.stringify(style) === JSON.stringify(metrics.talentCopyStyles[0]),
    )

  await page.locator('.values-section').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await page.locator('.interior-cta-section').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  const screenshotPath = join(outputDirectory, `about-${viewport.name}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  results.push({
    viewport: viewport.name,
    status: response?.status(),
    ...metrics,
    coreDuringAnimation,
    talentDirectionCorrect,
    talentNodeBaseSizesMatch,
    resultNodeUsesLightSystem,
    talentCopyPatternMatches,
    consoleErrors,
    consoleWarnings,
    pageErrors,
    failedResponses,
    screenshotPath,
  })

  await context.close()
}

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 900 },
  reducedMotion: 'reduce',
})
const reducedPage = await reducedContext.newPage()
const reducedErrors = []
reducedPage.on('pageerror', (error) => reducedErrors.push(error.message))
await reducedPage.goto('http://localhost:3000/nosotros', { waitUntil: 'networkidle' })
await reducedPage.locator('.pmi-model').scrollIntoViewIfNeeded()
await reducedPage.locator('.talent-model').scrollIntoViewIfNeeded()

const reducedMotion = await reducedPage.evaluate(() => {
  const animatedSelectors = [
    '.pmi-ring-accent',
    '.pmi-core::after',
    '.talent-stage-icon',
    '.talent-stage-node::before',
  ]
  const animations = [
    getComputedStyle(document.querySelector('.pmi-ring-accent')).animationName,
    getComputedStyle(document.querySelector('.pmi-core'), '::after').animationName,
    getComputedStyle(document.querySelector('.talent-stage-icon')).animationName,
    getComputedStyle(document.querySelector('.talent-stage-node'), '::before').animationName,
  ]

  return {
    selectorsChecked: animatedSelectors,
    animations,
    animationsDisabled: animations.every((animation) => animation === 'none'),
    hiddenInformation: Array.from(
      document.querySelectorAll(
        '[data-pmi-structure], [data-pmi-core], [data-pmi-dimension], [data-pmi-capability], [data-talent-node], [data-talent-copy], [data-talent-final]',
      ),
    ).filter((element) => {
      const style = getComputedStyle(element)
      return style.visibility === 'hidden' || Number(style.opacity) === 0
    }).length,
  }
})

await reducedContext.close()
await browser.close()

const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    result.sectionCount !== 8 ||
    result.h1Count !== 1 ||
    result.horizontalOverflow ||
    !result.oldProcessRemoved ||
    !result.pmiLabelsPresent ||
    !result.pmiCopyCorrect ||
    !result.floatingPmiLabelRemoved ||
    !result.talentLabelsPresent ||
    result.pmiDimensions !== 4 ||
    result.pmiStructureItems !== 3 ||
    result.pmiCapabilities !== 4 ||
    result.talentStages !== 4 ||
    !result.pmiAnimationCompleted ||
    !result.talentAnimationCompleted ||
    !result.coreDuringAnimation.contained ||
    !result.coreDuringAnimation.uncovered ||
    !result.pmiCoreUsesLightSystem ||
    !result.coreTextContained ||
    result.coreOverlapsDimension ||
    !result.talentDirectionCorrect ||
    !result.talentNodeBaseSizesMatch ||
    !result.resultNodeUsesLightSystem ||
    !result.talentCopyPatternMatches ||
    !result.finalMessageUsesSiteFont ||
    !result.pmiRadial ||
    result.canvasCount !== 0 ||
    result.consoleErrors.length > 0 ||
    result.consoleWarnings.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedResponses.length > 0,
)

console.log(
  JSON.stringify(
    {
      checkedViewports: results.length,
      failures,
      reducedMotion: { ...reducedMotion, errors: reducedErrors },
      screenshots: results.map((result) => result.screenshotPath),
    },
    null,
    2,
  ),
)

if (
  failures.length > 0 ||
  !reducedMotion.animationsDisabled ||
  reducedMotion.hiddenInformation > 0 ||
  reducedErrors.length > 0
) {
  process.exitCode = 1
}
