import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { contactContent } from '../data/contact'
import { submitToWeb3Forms } from '../services/web3forms'

const namePattern = /^[\p{L}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}][\p{L}\p{M}'’.-]*)*$/u
const phonePattern = /^(?=(?:\D*\d){7,15}\D*$)\+?[\d\s().-]+$/

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.').regex(namePattern, 'Escribe un nombre válido.'),
  company: z.string().trim().min(2, 'Escribe el nombre de tu empresa.'),
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
  phone: z.string().trim().regex(phonePattern, 'Escribe un teléfono válido.'),
  need: z.string().min(1, 'Selecciona un servicio o necesidad.'),
  message: z.string().trim().min(10, 'Escribe un mensaje de al menos 10 caracteres.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const { form } = contactContent
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null)

    const formData = new FormData()
    formData.append('name', values.name.trim())
    formData.append('company', values.company.trim())
    formData.append('email', values.email.trim())
    formData.append('phone', values.phone.trim())
    formData.append('need', values.need)
    formData.append('message', values.message.trim())
    formData.append('subject', 'TESI - Contacto')
    formData.append('from_name', 'TESI - Contacto')

    try {
      await submitToWeb3Forms(formData)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No fue posible enviar el formulario. Inténtalo de nuevo.',
      )
    }
  }

  const errorProps = (field: keyof ContactFormValues) => ({
    'aria-invalid': errors[field] ? ('true' as const) : ('false' as const),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  })

  if (submitted) {
    return (
      <div className="form-confirmation" role="status">
        <span className="form-confirmation-icon" aria-hidden="true">
          <CheckCircle2 size={30} strokeWidth={1.7} />
        </span>
        <p>Gracias por tu mensaje, nos pondremos en contacto</p>
      </div>
    )
  }

  return (
    <form className="form-panel" noValidate onSubmit={handleSubmit(onSubmit)}>
      {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="contact-name">{form.fields.name}</label>
          <input id="contact-name" autoComplete="name" {...register('name')} {...errorProps('name')} />
          {errors.name && <span className="form-error" id="contact-name-error">{errors.name.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-company">{form.fields.company}</label>
          <input id="contact-company" autoComplete="organization" {...register('company')} {...errorProps('company')} />
          {errors.company && <span className="form-error" id="contact-company-error">{errors.company.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">{form.fields.email}</label>
          <input id="contact-email" type="email" autoComplete="email" {...register('email')} {...errorProps('email')} />
          {errors.email && <span className="form-error" id="contact-email-error">{errors.email.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-phone">{form.fields.phone}</label>
          <input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" {...register('phone')} {...errorProps('phone')} />
          {errors.phone && <span className="form-error" id="contact-phone-error">{errors.phone.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="contact-need">{form.fields.need}</label>
          <select id="contact-need" defaultValue="" {...register('need')} {...errorProps('need')}>
            <option value="" disabled>Selecciona una opción</option>
            {form.needs.map((need) => <option key={need} value={need}>{need}</option>)}
          </select>
          {errors.need && <span className="form-error" id="contact-need-error">{errors.need.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="contact-message">{form.fields.message}</label>
          <textarea id="contact-message" rows={6} {...register('message')} {...errorProps('message')} />
          {errors.message && <span className="form-error" id="contact-message-error">{errors.message.message}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button className="form-submit" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Enviando mensaje…' : form.action}</span>
          <Send size={18} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
