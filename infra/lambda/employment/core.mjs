export const MAX_CV_SIZE = 5 * 1024 * 1024
export const AVAILABILITIES = ['Tiempo completo', 'Medio tiempo']
export const AREAS = [
  'Desarrollo de software',
  'Desarrollo web',
  'Sistemas empresariales',
  'Mainframe',
  'Bases de datos',
  'Análisis de datos',
  'Seguridad informática',
]

const namePattern = /^[\p{L}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}][\p{L}\p{M}'’.-]*)*$/u
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^(?=(?:\D*\d){7,15}\D*$)\+?[\d\s().-]+$/
const cvKeyPattern = /^applications\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/cv\.pdf$/i
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const cleanText = (value) => typeof value === 'string' ? value.trim() : ''

export function validateUploadRequest(input) {
  const fileName = cleanText(input?.fileName)
  const fileType = cleanText(input?.fileType)
  const fileSize = Number(input?.fileSize)

  if (!fileName || fileName.length > 160 || !fileName.toLowerCase().endsWith('.pdf')) {
    return { error: 'El CV debe ser un archivo PDF válido.' }
  }
  if (fileType !== 'application/pdf') {
    return { error: 'El CV debe ser un archivo PDF válido.' }
  }
  if (!Number.isInteger(fileSize) || fileSize < 1 || fileSize > MAX_CV_SIZE) {
    return { error: 'El CV no debe superar 5 MB.' }
  }

  return { value: { fileName, fileType, fileSize } }
}

export function validateApplication(input) {
  const value = {
    name: cleanText(input?.name),
    email: cleanText(input?.email).toLowerCase(),
    phone: cleanText(input?.phone),
    area: cleanText(input?.area),
    technologies: cleanText(input?.technologies),
    availability: cleanText(input?.availability),
    message: cleanText(input?.message),
    cvKey: cleanText(input?.cvKey),
    uploadToken: cleanText(input?.uploadToken),
  }

  if (value.name.length < 2 || value.name.length > 120 || !namePattern.test(value.name)) {
    return { error: 'Revisa el nombre proporcionado.' }
  }
  if (value.email.length > 254 || !emailPattern.test(value.email)) {
    return { error: 'Revisa el correo electrónico proporcionado.' }
  }
  if (!phonePattern.test(value.phone)) {
    return { error: 'Revisa el teléfono proporcionado.' }
  }
  if (!AREAS.includes(value.area)) {
    return { error: 'Selecciona un área de interés válida.' }
  }
  if (value.technologies.length < 2 || value.technologies.length > 1000) {
    return { error: 'Revisa las tecnologías proporcionadas.' }
  }
  if (!AVAILABILITIES.includes(value.availability)) {
    return { error: 'Selecciona una disponibilidad válida.' }
  }
  if (value.message.length < 10 || value.message.length > 4000) {
    return { error: 'Revisa el mensaje proporcionado.' }
  }
  if (!cvKeyPattern.test(value.cvKey) || !uuidPattern.test(value.uploadToken)) {
    return { error: 'La referencia del CV no es válida.' }
  }

  return { value }
}

export function isPdf(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 64) return false
  const header = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('latin1')
  const trailer = buffer.subarray(Math.max(0, buffer.length - 2048)).toString('latin1')
  return header.includes('%PDF-') && trailer.includes('startxref') && trailer.includes('%%EOF')
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const wrapBase64 = (value) => value.match(/.{1,76}/g)?.join('\r\n') || ''
const encodeHeader = (value) => `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`

export function extractPdfAttachment(rawMessage) {
  const message = Buffer.isBuffer(rawMessage)
    ? rawMessage.toString('ascii')
    : Buffer.from(rawMessage).toString('ascii')
  const attachmentHeader = 'Content-Type: application/pdf;'
  const headerStart = message.indexOf(attachmentHeader)
  const bodyStart = message.indexOf('\r\n\r\n', headerStart) + 4
  const bodyEnd = message.indexOf('\r\n--', bodyStart)

  if (headerStart < 0 || bodyStart < 4 || bodyEnd < bodyStart) {
    throw new Error('PDF attachment not found in MIME message')
  }

  const encoded = message.slice(bodyStart, bodyEnd).replaceAll('\r\n', '')
  if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new Error('PDF attachment contains invalid base64')
  }

  return Buffer.from(encoded, 'base64')
}

export function buildEmail({ application, sender, recipient, cv, cvFileName, cvUrl }) {
  const boundary = `tesi-mixed-${crypto.randomUUID()}`
  const alternativeBoundary = `tesi-alt-${crypto.randomUUID()}`
  const safe = Object.fromEntries(
    Object.entries(application).map(([key, value]) => [key, escapeHtml(value)]),
  )
  const safeUrl = escapeHtml(cvUrl)
  const fields = [
    ['Nombre', safe.name],
    ['Correo electrónico', safe.email],
    ['Teléfono', safe.phone],
    ['Área de interés', safe.area],
    ['Tecnologías que domina', safe.technologies],
    ['Disponibilidad', safe.availability],
    ['Mensaje', safe.message],
  ]
  const rows = fields.map(([label, value]) => `
    <tr>
      <td style="padding:12px 16px;color:#667085;font-size:13px;font-weight:600;vertical-align:top;border-bottom:1px solid #e7edf3">${label}</td>
      <td style="padding:12px 16px;color:#082b4c;font-size:14px;line-height:1.55;border-bottom:1px solid #e7edf3;white-space:pre-wrap">${value}</td>
    </tr>`).join('')
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f4f7fa;font-family:Arial,sans-serif;color:#082b4c"><div style="padding:32px 16px"><div style="max-width:680px;margin:auto;background:#fff;border:1px solid #dfe7ef;border-radius:14px;overflow:hidden"><div style="padding:28px 30px;background:#082b4c;color:#fff"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#22c7f2;font-weight:700">TESI - Empleo</div><h1 style="margin:10px 0 0;font-size:26px;line-height:1.2">Nueva solicitud de empleo</h1></div><div style="padding:24px 14px"><table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table><div style="padding:22px 16px 6px"><a href="${safeUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700">Ver CV de forma segura</a><p style="margin:12px 0 0;color:#667085;font-size:12px;line-height:1.5">El enlace es privado y temporal. El CV también se adjunta a este correo.</p></div></div></div></div></body></html>`
  const text = `TESI - Empleo\n\nNueva solicitud de empleo\n\n${fields.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nCV (enlace privado temporal): ${cvUrl}`
  const safeFileName = cvFileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'CV.pdf'

  return Buffer.from([
    `From: TESI - Empleo <${sender}>`,
    `To: ${recipient}`,
    `Reply-To: ${application.email}`,
    `Subject: ${encodeHeader(`Nueva solicitud de empleo - ${application.name}`)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
    '',
    `--${alternativeBoundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(text, 'utf8').toString('base64')),
    `--${alternativeBoundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(html, 'utf8').toString('base64')),
    `--${alternativeBoundary}--`,
    '',
    `--${boundary}`,
    `Content-Type: application/pdf; name="${safeFileName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${safeFileName}"`,
    '',
    wrapBase64(cv.toString('base64')),
    `--${boundary}--`,
    '',
  ].join('\r\n'))
}
