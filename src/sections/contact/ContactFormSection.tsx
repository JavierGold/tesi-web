import { ContactForm } from '../../forms/ContactForm'

export function ContactFormSection() {
  return (
    <section className="interior-section form-section contact-form-section" aria-labelledby="contact-form-title">
      <div className="container form-layout">
        <header className="form-intro" data-page-reveal>
          <h2 id="contact-form-title">Formulario de contacto</h2>
        </header>
        <div data-page-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
