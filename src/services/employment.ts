const employmentApiUrl = import.meta.env.VITE_EMPLOYMENT_API_URL?.replace(/\/$/, '')

type UploadAuthorization = {
  key: string
  uploadToken: string
  upload: {
    url: string
    fields: Record<string, string>
  }
}

type EmploymentApplication = {
  name: string
  email: string
  phone: string
  area: string
  technologies: string
  availability: 'Tiempo completo' | 'Medio tiempo'
  message: string
  cv: File
}

async function readResponse(response: Response) {
  try {
    return (await response.json()) as { message?: string }
  } catch {
    return {}
  }
}

export async function submitEmploymentApplication(application: EmploymentApplication) {
  if (!employmentApiUrl) {
    throw new Error('El formulario de empleo no está configurado para realizar envíos.')
  }

  const authorizationResponse = await fetch(`${employmentApiUrl}/employment/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: application.cv.name,
      fileSize: application.cv.size,
      fileType: application.cv.type,
    }),
  })
  const authorization = (await readResponse(authorizationResponse)) as Partial<UploadAuthorization> & {
    message?: string
  }

  if (
    !authorizationResponse.ok ||
    !authorization.key ||
    !authorization.uploadToken ||
    !authorization.upload?.url ||
    !authorization.upload.fields
  ) {
    throw new Error(authorization.message || 'No fue posible preparar el envío del CV.')
  }

  const uploadData = new FormData()
  Object.entries(authorization.upload.fields).forEach(([name, value]) => uploadData.append(name, value))
  uploadData.append('file', application.cv)

  const uploadResponse = await fetch(authorization.upload.url, {
    method: 'POST',
    body: uploadData,
  })

  if (!uploadResponse.ok) {
    throw new Error('No fue posible subir el CV. Inténtalo de nuevo.')
  }

  const submitResponse = await fetch(`${employmentApiUrl}/employment/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: application.name,
      email: application.email,
      phone: application.phone,
      area: application.area,
      technologies: application.technologies,
      availability: application.availability,
      message: application.message,
      cvKey: authorization.key,
      uploadToken: authorization.uploadToken,
    }),
  })
  const result = await readResponse(submitResponse)

  if (!submitResponse.ok) {
    throw new Error(result.message || 'No fue posible enviar tu solicitud. Inténtalo de nuevo.')
  }
}
