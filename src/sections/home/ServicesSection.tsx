import { Code2, Database, Search, Wrench, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { homeContent } from '../../data/home'

const icons: LucideIcon[] = [Search, Code2, Database, Wrench]

export function ServicesSection() {
  const { services } = homeContent

  return (
    <section
      className="home-section services-section"
      id="servicios"
      aria-labelledby="services-title"
    >
      <div className="container">
        <SectionHeading
          id="services-title"
          title={services.title}
          description={services.description}
        />

        <div className="services-grid" data-reveal-group>
          {services.items.map((service, index) => {
            const Icon = icons[index]
            return (
              <article className="service-card" key={service.title}>
                <div className="service-card-top">
                  <span className="service-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="card-icon card-icon--dark">
                    <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
