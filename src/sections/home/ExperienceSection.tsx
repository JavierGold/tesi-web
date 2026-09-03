import { SectionHeading } from '../../components/ui/SectionHeading'
import { homeContent } from '../../data/home'

export function ExperienceSection() {
  const { experience } = homeContent

  return (
    <section className="home-section experience-section" aria-labelledby="experience-title">
      <div className="container experience-layout">
        <SectionHeading
          id="experience-title"
          title={experience.title}
          description={experience.description}
          theme="dark"
        />

        <div className="metrics-grid" data-reveal-group>
          {experience.metrics.map((metric) => (
            <article className="metric" key={metric.description}>
              <strong data-count={metric.value}>{metric.display}</strong>
              <span>{metric.description}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
