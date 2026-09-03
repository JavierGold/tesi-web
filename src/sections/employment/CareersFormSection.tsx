import { CareersForm } from '../../forms/CareersForm'
import { employmentContent } from '../../data/employment'

export function CareersFormSection() {
  const { form } = employmentContent

  return (
    <section className="interior-section form-section" aria-labelledby="careers-form-title">
      <div className="container form-layout">
        <header className="form-intro" data-page-reveal>
          <h2 id="careers-form-title">{form.title}</h2>
          <p>{form.description}</p>
        </header>
        <div data-page-reveal>
          <CareersForm />
        </div>
      </div>
    </section>
  )
}
