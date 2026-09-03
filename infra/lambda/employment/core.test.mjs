import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MAX_CV_SIZE,
  buildEmail,
  escapeHtml,
  extractPdfAttachment,
  isPdf,
  validateApplication,
  validateUploadRequest,
} from './core.mjs'

const validApplication = {
  name: 'Persona de Prueba',
  email: 'persona@example.com',
  phone: '+52 477 123 4567',
  area: 'Desarrollo de software',
  technologies: 'Java, TypeScript',
  availability: 'Tiempo completo',
  message: 'Mensaje de prueba suficientemente largo.',
  cvKey: 'applications/18ed5d9a-39fb-4f20-8f18-62fa6ef2c64a/cv.pdf',
  uploadToken: 'db7ec680-bd90-44ee-8069-559fa4e44819',
}

function createValidPdf() {
  const stream = 'BT /F1 18 Tf 72 720 Td (TESI attachment integrity test) Tj ET'
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

test('validates upload metadata', () => {
  assert.ok(validateUploadRequest({ fileName: 'CV.pdf', fileType: 'application/pdf', fileSize: 1024 }).value)
  assert.equal(validateUploadRequest({ fileName: 'CV.txt', fileType: 'text/plain', fileSize: 10 }).error, 'El CV debe ser un archivo PDF válido.')
  assert.equal(validateUploadRequest({ fileName: 'CV.pdf', fileType: 'application/pdf', fileSize: MAX_CV_SIZE + 1 }).error, 'El CV no debe superar 5 MB.')
})

test('accepts only the two availability values', () => {
  assert.ok(validateApplication(validApplication).value)
  assert.ok(validateApplication({ ...validApplication, availability: 'Medio tiempo' }).value)
  assert.equal(validateApplication({ ...validApplication, availability: 'Remoto' }).error, 'Selecciona una disponibilidad válida.')
})

test('validates fields and secure object references', () => {
  assert.ok(validateApplication({ ...validApplication, email: 'invalid' }).error)
  assert.ok(validateApplication({ ...validApplication, cvKey: '../../secret' }).error)
  assert.ok(validateApplication({ ...validApplication, uploadToken: 'invalid' }).error)
})

test('checks the actual PDF signature', () => {
  assert.equal(isPdf(createValidPdf()), true)
  assert.equal(isPdf(Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n')), false)
  assert.equal(isPdf(Buffer.from('not a pdf')), false)
})

test('sanitizes HTML and builds a professional message with every field', () => {
  assert.equal(escapeHtml('<script>'), '&lt;script&gt;')
  const email = buildEmail({
    application: validApplication,
    sender: 'sender@example.com',
    recipient: 'recipient@example.com',
    cv: Buffer.from('%PDF-1.4 test\n%%EOF'),
    cvFileName: 'CV Persona.pdf',
    cvUrl: 'https://private.example/cv',
  }).toString('utf8')
  assert.match(email, /TESI - Empleo/)
  assert.match(email, /Reply-To: persona@example\.com/)
  assert.match(email, /Content-Type: application\/pdf/)
  assert.match(email, /filename="CV_Persona\.pdf"/)
})

test('preserves every S3 byte when the PDF is received as a MIME attachment', () => {
  const s3ObjectBytes = Buffer.concat([
    createValidPdf(),
    Buffer.from([0x00, 0xff, 0x80, 0x7f]),
  ])
  const rawMessage = buildEmail({
    application: validApplication,
    sender: 'sender@example.com',
    recipient: 'recipient@example.com',
    cv: s3ObjectBytes,
    cvFileName: 'CV Persona.pdf',
    cvUrl: 'https://private.example/cv',
  })

  const receivedAttachmentBytes = extractPdfAttachment(rawMessage)
  assert.equal(receivedAttachmentBytes.length, s3ObjectBytes.length)
  assert.deepEqual(receivedAttachmentBytes, s3ObjectBytes)
})
