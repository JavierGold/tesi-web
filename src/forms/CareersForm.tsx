import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, FileCheck2, Send, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useController, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { employmentContent } from '../data/employment'
import { submitEmploymentApplication } from '../services/employment'

const maxCvSize = 5 * 1024 * 1024
const namePattern = /^[\p{L}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}][\p{L}\p{M}'’.-]*)*$/u
const phonePattern = /^(?=(?:\D*\d){7,15}\D*$)\+?[\d\s().-]+$/

const careersSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre completo.').regex(namePattern, 'Escribe un nombre válido.'),
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
  phone: z.string().trim().regex(phonePattern, 'Escribe un teléfono válido.'),
  area: z.string().min(1, 'Selecciona un área de interés.'),
  technologies: z.string().trim().min(2, 'Indica las tecnologías que dominas.'),
  availability: z.enum(['Tiempo completo', 'Medio tiempo'], {
    error: 'Selecciona tu disponibilidad.',
  }),
  message: z.string().trim().min(10, 'Escribe un mensaje de al menos 10 caracteres.'),
  cv: z
    .custom<FileList>(
      (files) => files instanceof FileList && files.length === 1,
      'Adjunta tu CV en PDF.',
    )
    .refine((files) => files[0]?.type === 'application/pdf', 'El CV debe ser un archivo PDF.')
    .refine((files) => files[0]?.size <= maxCvSize, 'El CV no debe superar 5 MB.'),
})

type CareersFormValues = z.infer<typeof careersSchema>

export function CareersForm() {
  const { form, profiles } = employmentContent
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    resetField,
    clearErrors,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CareersFormValues>({
    resolver: zodResolver(careersSchema),
    mode: 'onBlur',
  })
  const cvInputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const [isDraggingCv, setIsDraggingCv] = useState(false)
  const { field: cvField } = useController({ control, name: 'cv' })
  const selectedCv = useWatch({ control, name: 'cv' })?.[0]
  const hasValidCv = Boolean(
    selectedCv && selectedCv.type === 'application/pdf' && selectedCv.size <= maxCvSize,
  )

  const onSubmit = async (values: CareersFormValues) => {
    setSubmitError(null)

    try {
      await submitEmploymentApplication({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        area: values.area,
        technologies: values.technologies.trim(),
        availability: values.availability,
        message: values.message.trim(),
        cv: values.cv[0],
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No fue posible enviar el formulario. Inténtalo de nuevo.',
      )
    }
  }

  const errorProps = (field: keyof CareersFormValues) => ({
    'aria-invalid': errors[field] ? ('true' as const) : ('false' as const),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  const updateCv = (files: FileList) => {
    const transferredFiles = new DataTransfer()
    Array.from(files).forEach((file) => transferredFiles.items.add(file))
    const nextFiles = transferredFiles.files
    const validation = careersSchema.shape.cv.safeParse(nextFiles)
    setSubmitted(false)
    cvField.onChange(nextFiles)
    if (validation.success) {
      clearErrors('cv')
    } else {
      setError('cv', { type: 'manual', message: validation.error.issues[0]?.message })
    }
  }

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) updateCv(event.target.files)
  }

  const openCvSelector = () => {
    if (cvInputRef.current) {
      cvInputRef.current.value = ''
      cvInputRef.current.click()
    }
  }

  const handleCvDragEnter = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDraggingCv(true)
  }

  const handleCvDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDraggingCv(false)
  }

  const handleCvDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDraggingCv(false)

    if (event.dataTransfer.files.length > 0) {
      updateCv(event.dataTransfer.files)
    }
  }

  const removeCv = () => {
    if (cvInputRef.current) cvInputRef.current.value = ''
    resetField('cv')
    clearErrors('cv')
    setSubmitted(false)
  }

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
          <label htmlFor="career-name">{form.fields.name}</label>
          <input id="career-name" autoComplete="name" {...register('name')} {...errorProps('name')} />
          {errors.name && <span className="form-error" id="name-error">{errors.name.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="career-email">{form.fields.email}</label>
          <input id="career-email" type="email" autoComplete="email" {...register('email')} {...errorProps('email')} />
          {errors.email && <span className="form-error" id="email-error">{errors.email.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="career-phone">{form.fields.phone}</label>
          <input id="career-phone" type="tel" inputMode="tel" autoComplete="tel" {...register('phone')} {...errorProps('phone')} />
          {errors.phone && <span className="form-error" id="phone-error">{errors.phone.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="career-area">{form.fields.area}</label>
          <select id="career-area" defaultValue="" {...register('area')} {...errorProps('area')}>
            <option value="" disabled>Selecciona una opción</option>
            {profiles.areas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
          {errors.area && <span className="form-error" id="area-error">{errors.area.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="career-technologies">{form.fields.technologies}</label>
          <textarea id="career-technologies" rows={3} {...register('technologies')} {...errorProps('technologies')} />
          {errors.technologies && <span className="form-error" id="technologies-error">{errors.technologies.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="career-availability">{form.fields.availability}</label>
          <select id="career-availability" defaultValue="" {...register('availability')} {...errorProps('availability')}>
            <option value="" disabled>Selecciona una opción</option>
            <option value="Tiempo completo">Tiempo completo</option>
            <option value="Medio tiempo">Medio tiempo</option>
          </select>
          {errors.availability && <span className="form-error" id="availability-error">{errors.availability.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="career-message">{form.fields.message}</label>
          <textarea id="career-message" rows={5} {...register('message')} {...errorProps('message')} />
          {errors.message && <span className="form-error" id="message-error">{errors.message.message}</span>}
        </div>

        <div className="form-field form-field--full">
          <label id="career-cv-label" htmlFor="career-cv">{form.fields.cv}</label>
          <input
            id="career-cv"
            className="cv-uploader-input"
            type="file"
            accept=".pdf,application/pdf"
            tabIndex={-1}
            {...errorProps('cv')}
            aria-describedby={errors.cv ? 'cv-hint cv-error' : 'cv-hint'}
            name={cvField.name}
            onBlur={cvField.onBlur}
            onChange={handleCvChange}
            ref={(element) => {
              cvField.ref(element)
              cvInputRef.current = element
            }}
          />
          <button
            className={`cv-uploader${isDraggingCv ? ' is-dragging' : ''}${hasValidCv ? ' is-ready' : ''}`}
            type="button"
            aria-labelledby="career-cv-label cv-uploader-primary"
            aria-describedby={errors.cv ? 'cv-hint cv-error' : 'cv-hint'}
            aria-invalid={errors.cv ? 'true' : 'false'}
            onClick={openCvSelector}
            onDragEnter={handleCvDragEnter}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={handleCvDragLeave}
            onDrop={handleCvDrop}
          >
            <span className="cv-uploader-icon" aria-hidden="true">
              {hasValidCv ? (
                <FileCheck2 size={27} strokeWidth={1.7} />
              ) : (
                <Upload size={27} strokeWidth={1.7} />
              )}
            </span>
            <span className="cv-uploader-copy" aria-live="polite">
              <strong
                className={hasValidCv ? 'cv-uploader-filename' : undefined}
                id="cv-uploader-primary"
                title={hasValidCv ? selectedCv?.name : undefined}
              >
                {hasValidCv ? selectedCv?.name : 'Adjuntar CV'}
              </strong>
              <span>
                {hasValidCv ? 'Archivo listo para enviar' : 'Selecciona o arrastra tu archivo PDF'}
              </span>
              {hasValidCv && <span className="cv-uploader-change">Cambiar archivo</span>}
            </span>
          </button>
          {hasValidCv && (
            <button className="cv-uploader-remove" type="button" onClick={removeCv}>
              <X size={15} strokeWidth={1.8} aria-hidden="true" />
              Quitar archivo
            </button>
          )}
          <span className="form-hint" id="cv-hint">PDF, máximo 5 MB.</span>
          {errors.cv && <span className="form-error" id="cv-error" role="alert">{errors.cv.message}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button className="form-submit" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Enviando CV…' : form.action}</span>
          <Send size={18} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
