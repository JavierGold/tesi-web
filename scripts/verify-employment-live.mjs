import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const apiUrl = process.env.EMPLOYMENT_API_URL?.replace(/\/$/, '')

if (!apiUrl) throw new Error('Define EMPLOYMENT_API_URL antes de ejecutar esta verificación.')

function createTestPdf() {
  const stream = 'BT /F1 18 Tf 72 720 Td (TESI CAMBIO-005 - Prueba de integracion AWS) Tj ET'
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += object
  }
  const xrefOffset = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf)
}

async function request(path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:3000',
    },
    body: JSON.stringify(body),
  })
  let result = {}
  try { result = await response.json() } catch { /* The status remains authoritative. */ }
  if (!response.ok) throw new Error(`${path} returned ${response.status}: ${result.message || 'Unknown error'}`)
  return { status: response.status, result }
}

const suppliedPdfPath = process.env.EMPLOYMENT_TEST_PDF
const pdf = suppliedPdfPath ? fs.readFileSync(suppliedPdfPath) : createTestPdf()
const fileName = suppliedPdfPath ? path.basename(suppliedPdfPath) : 'CV-Prueba-CAMBIO-005.pdf'
const pdfSha256 = crypto.createHash('sha256').update(pdf).digest('hex')
const authorization = await request('/employment/upload', {
  fileName,
  fileType: 'application/pdf',
  fileSize: pdf.length,
})

const uploadData = new FormData()
for (const [name, value] of Object.entries(authorization.result.upload.fields)) {
  uploadData.append(name, value)
}
uploadData.append('file', new Blob([pdf], { type: 'application/pdf' }), fileName)
const uploadResponse = await fetch(authorization.result.upload.url, {
  method: 'POST',
  body: uploadData,
})
if (!uploadResponse.ok) throw new Error(`S3 upload returned ${uploadResponse.status}`)

const submission = await request('/employment/submit', {
  name: 'Prueba Integración TESI',
  email: '567498jav@gmail.com',
  phone: '+52 477 181 5045',
  area: 'Desarrollo de software',
  technologies: 'Prueba automatizada de integración AWS',
  availability: 'Tiempo completo',
  message: 'Candidatura de prueba controlada para verificar CAMBIO-005. No corresponde a una persona real.',
  cvKey: authorization.result.key,
  uploadToken: authorization.result.uploadToken,
})

console.log(JSON.stringify({
  authorizationStatus: authorization.status,
  uploadStatus: uploadResponse.status,
  submissionStatus: submission.status,
  submissionMessage: submission.result.message,
  pdfBytes: pdf.length,
  pdfSha256,
}, null, 2))
