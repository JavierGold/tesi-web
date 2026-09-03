import { ActionLink } from '../../components/ui/ActionLink'
import { homeContent } from '../../data/home'

export function FinalCtaSection() {
  const { finalCta } = homeContent

  return (
    <section className="home-section final-cta-section" aria-labelledby="final-cta-title">
      <div className="container final-cta-panel" data-reveal>
        <div className="final-cta-copy">
          <h2 id="final-cta-title">{finalCta.title}</h2>
          <p>{finalCta.description}</p>
        </div>
        <ActionLink to="/contacto" variant="light">
          {finalCta.action}
        </ActionLink>
        <div className="final-cta-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
