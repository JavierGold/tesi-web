import crypto from 'node:crypto'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses'
import {
  MAX_CV_SIZE,
  buildEmail,
  extractPdfAttachment,
  isPdf,
  validateApplication,
  validateUploadRequest,
} from './core.mjs'

const region = process.env.AWS_REGION
const bucket = process.env.CV_BUCKET
const sender = process.env.SES_SENDER
const recipient = process.env.SES_RECIPIENT
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean))
const s3 = new S3Client({ region })
const ses = new SESClient({ region })

const response = (statusCode, message, extra = {}) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ message, ...extra }),
})

const hmac = (key, value, encoding) => crypto.createHmac('sha256', key).update(value).digest(encoding)
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const amzDate = (date) => date.toISOString().replace(/[:-]|\.\d{3}/g, '')
const dateStamp = (date) => amzDate(date).slice(0, 8)
const uriEncode = (value) => encodeURIComponent(value).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)

function signingKey(secret, date, service) {
  const dateKey = hmac(`AWS4${secret}`, date)
  const regionKey = hmac(dateKey, region)
  const serviceKey = hmac(regionKey, service)
  return hmac(serviceKey, 'aws4_request')
}

function createPresignedPost({ key, uploadToken, originalFileName }) {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  }
  if (!credentials.accessKeyId || !credentials.secretAccessKey) throw new Error('AWS credentials unavailable')

  const now = new Date()
  const shortDate = dateStamp(now)
  const timestamp = amzDate(now)
  const credential = `${credentials.accessKeyId}/${shortDate}/${region}/s3/aws4_request`
  const fields = {
    key,
    'Content-Type': 'application/pdf',
    'success_action_status': '201',
    'x-amz-meta-upload-token': uploadToken,
    'x-amz-meta-original-filename': encodeURIComponent(originalFileName),
    'x-amz-server-side-encryption': 'AES256',
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    'x-amz-credential': credential,
    'x-amz-date': timestamp,
  }
  if (credentials.sessionToken) fields['x-amz-security-token'] = credentials.sessionToken

  const conditions = [
    { bucket },
    ...Object.entries(fields).map(([name, value]) => ({ [name]: value })),
    ['content-length-range', 1, MAX_CV_SIZE + 64 * 1024],
  ]
  const policy = Buffer.from(JSON.stringify({
    expiration: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
    conditions,
  })).toString('base64')
  fields.policy = policy
  fields['x-amz-signature'] = hmac(signingKey(credentials.secretAccessKey, shortDate, 's3'), policy, 'hex')

  return { url: `https://${bucket}.s3.${region}.amazonaws.com`, fields }
}

function createPresignedGetUrl(key) {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  }
  if (!credentials.accessKeyId || !credentials.secretAccessKey) throw new Error('AWS credentials unavailable')

  const now = new Date()
  const shortDate = dateStamp(now)
  const timestamp = amzDate(now)
  const host = `${bucket}.s3.${region}.amazonaws.com`
  const scope = `${shortDate}/${region}/s3/aws4_request`
  const query = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${credentials.accessKeyId}/${scope}`,
    'X-Amz-Date': timestamp,
    'X-Amz-Expires': '43200',
    'X-Amz-SignedHeaders': 'host',
  }
  if (credentials.sessionToken) query['X-Amz-Security-Token'] = credentials.sessionToken
  const canonicalQuery = Object.entries(query)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([name, value]) => `${uriEncode(name)}=${uriEncode(value)}`)
    .join('&')
  const canonicalUri = `/${key.split('/').map(uriEncode).join('/')}`
  const canonicalRequest = `GET\n${canonicalUri}\n${canonicalQuery}\nhost:${host}\n\nhost\nUNSIGNED-PAYLOAD`
  const stringToSign = `AWS4-HMAC-SHA256\n${timestamp}\n${scope}\n${sha256(canonicalRequest)}`
  const signature = hmac(signingKey(credentials.secretAccessKey, shortDate, 's3'), stringToSign, 'hex')
  return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
}

async function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '{}'
  return JSON.parse(raw)
}

async function authorizeUpload(event) {
  const validation = validateUploadRequest(await parseBody(event))
  if (validation.error) return response(400, validation.error)

  const applicationId = crypto.randomUUID()
  const uploadToken = crypto.randomUUID()
  const key = `applications/${applicationId}/cv.pdf`
  const upload = createPresignedPost({
    key,
    uploadToken,
    originalFileName: validation.value.fileName,
  })
  return response(200, 'Carga autorizada.', { key, uploadToken, upload })
}

async function submitApplication(event) {
  const validation = validateApplication(await parseBody(event))
  if (validation.error) return response(400, validation.error)
  const application = validation.value
  const applicationId = application.cvKey.split('/')[1]
  const lockKey = `locks/${applicationId}`
  let locked = false

  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: application.cvKey }))
    if (
      head.ContentType !== 'application/pdf' ||
      !head.ContentLength ||
      head.ContentLength > MAX_CV_SIZE ||
      head.Metadata?.['upload-token'] !== application.uploadToken
    ) {
      return response(400, 'El CV almacenado no es válido.')
    }

    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: application.cvKey }))
    const cv = Buffer.from(await object.Body.transformToByteArray())
    if (cv.length !== head.ContentLength || !isPdf(cv)) {
      return response(400, 'El CV almacenado no es un PDF válido.')
    }

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: lockKey,
      Body: JSON.stringify({ createdAt: new Date().toISOString() }),
      ContentType: 'application/json',
      IfNoneMatch: '*',
      ServerSideEncryption: 'AES256',
    }))
    locked = true

    const originalFileName = decodeURIComponent(head.Metadata?.['original-filename'] || 'CV.pdf')
    const cvUrl = createPresignedGetUrl(application.cvKey)
    const rawMessage = buildEmail({
      application,
      sender,
      recipient,
      cv,
      cvFileName: originalFileName,
      cvUrl,
    })
    const mimeAttachment = extractPdfAttachment(rawMessage)
    if (!mimeAttachment.equals(cv)) throw new Error('MIME attachment integrity check failed')
    const cvSha256 = sha256(cv)
    await ses.send(new SendRawEmailCommand({
      Source: sender,
      Destinations: [recipient],
      RawMessage: { Data: rawMessage },
    }))

    console.info(JSON.stringify({
      event: 'employment_application_sent',
      requestId: event.requestContext?.requestId,
      cvBytes: cv.length,
      cvSha256,
    }))
    return response(200, 'Solicitud enviada correctamente.')
  } catch (error) {
    if (locked) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: lockKey }))
      } catch {
        console.error(JSON.stringify({ event: 'employment_lock_cleanup_failed', requestId: event.requestContext?.requestId }))
      }
    }
    if (error?.name === 'PreconditionFailed') return response(409, 'Esta solicitud ya fue procesada.')
    console.error(JSON.stringify({ event: 'employment_application_failed', requestId: event.requestContext?.requestId, error: error?.name || 'Error' }))
    return response(500, 'No fue posible procesar tu solicitud. Inténtalo de nuevo.')
  }
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin
  if (origin && !allowedOrigins.has(origin)) return response(403, 'Origen no permitido.')
  if (event.requestContext?.http?.method !== 'POST') return response(405, 'Método no permitido.')

  try {
    if (event.rawPath === '/employment/upload') return await authorizeUpload(event)
    if (event.rawPath === '/employment/submit') return await submitApplication(event)
    return response(404, 'Ruta no encontrada.')
  } catch (error) {
    console.error(JSON.stringify({ event: 'employment_request_failed', requestId: event.requestContext?.requestId, error: error?.name || 'Error' }))
    return response(error instanceof SyntaxError ? 400 : 500, error instanceof SyntaxError ? 'La solicitud no contiene JSON válido.' : 'No fue posible procesar la solicitud.')
  }
}
