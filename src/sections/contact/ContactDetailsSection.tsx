import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { contactContent } from '../../data/contact'

export function ContactDetailsSection() {
  const { details } = contactContent

  return (
    <section className="interior-section contact-details-section" aria-labelledby="contact-details-title">
      <div className="container">
        <header className="standalone-heading" data-page-reveal>
          <h2 id="contact-details-title">Información de contacto</h2>
        </header>
        <div className="contact-details-grid" data-page-group>
          <article className="contact-detail">
            <Mail size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Correo</h3>
            <a href={`mailto:${details.email}`}>{details.email}</a>
          </article>
          <article className="contact-detail">
            <Phone size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Teléfono</h3>
            <a href={`tel:+52${details.phone}`}>{details.phone}</a>
          </article>
          <article className="contact-detail">
            <MapPin size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Dirección</h3>
            <p>{details.address}</p>
          </article>
          <article className="contact-detail">
            <Clock3 size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Horario</h3>
            <p>{details.schedule}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
