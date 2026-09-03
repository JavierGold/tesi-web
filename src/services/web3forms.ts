const web3FormsEndpoint = 'https://api.web3forms.com/submit'

type Web3FormsResponse = {
  success?: boolean
  message?: string
}

export async function submitToWeb3Forms(formData: FormData) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

  if (!accessKey) {
    throw new Error('El formulario no está configurado para realizar envíos.')
  }

  formData.append('access_key', accessKey)

  const response = await fetch(web3FormsEndpoint, {
    method: 'POST',
    body: formData,
  })

  let result: Web3FormsResponse

  try {
    result = (await response.json()) as Web3FormsResponse
  } catch {
    throw new Error('No fue posible confirmar el envío. Inténtalo de nuevo.')
  }

  if (!response.ok || result.success !== true) {
    throw new Error(result.message || 'No fue posible enviar el formulario. Inténtalo de nuevo.')
  }
}
