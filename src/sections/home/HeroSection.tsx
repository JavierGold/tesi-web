import { Database, Server, ShieldCheck } from 'lucide-react'
import { ActionLink } from '../../components/ui/ActionLink'
import { homeContent } from '../../data/home'

export function HeroSection() {
  const { hero } = homeContent

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container home-hero-grid">
        <div className="home-hero-copy">
          <h1 id="home-hero-title" data-hero-reveal>
            {hero.title}
          </h1>
          <p data-hero-reveal>{hero.description}</p>
          <div className="home-hero-actions" data-hero-reveal>
            <ActionLink to="#servicios">{hero.primaryAction}</ActionLink>
            <ActionLink to="/contacto" variant="secondary">
              {hero.secondaryAction}
            </ActionLink>
          </div>
        </div>

        <div
          className="hero-system-visual"
          data-hero-reveal
          data-three-slot="hero"
          aria-hidden="true"
        >
          <div className="hero-orbit hero-orbit--outer" />
          <div className="hero-orbit hero-orbit--inner" />
          <div className="hero-core">
            <Server size={34} strokeWidth={1.5} />
          </div>
          <div className="hero-node hero-node--data">
            <Database size={22} strokeWidth={1.6} />
          </div>
          <div className="hero-node hero-node--security">
            <ShieldCheck size={22} strokeWidth={1.6} />
          </div>
          <span className="hero-pulse hero-pulse--one" />
          <span className="hero-pulse hero-pulse--two" />
          <span className="hero-pulse hero-pulse--three" />
        </div>
      </div>
    </section>
  )
}
