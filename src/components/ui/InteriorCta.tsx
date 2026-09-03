import { ActionLink } from './ActionLink'

interface InteriorCtaProps {
  action: string
  description: string
  title: string
}

export function InteriorCta({ action, description, title }: InteriorCtaProps) {
  return (
    <section className="interior-section interior-cta-section" aria-labelledby="interior-cta-title">
      <div className="container interior-cta" data-page-reveal>
        <div>
          <h2 id="interior-cta-title">{title}</h2>
          <p>{description}</p>
        </div>
        <ActionLink to="/contacto" variant="light">
          {action}
        </ActionLink>
        <span className="interior-cta-accent" aria-hidden="true" />
      </div>
    </section>
  )
}
