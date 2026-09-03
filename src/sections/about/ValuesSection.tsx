import { BadgeCheck, Handshake, Scale, Target, Users } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { aboutContent } from '../../data/about'

const icons = [Target, Users, Scale, BadgeCheck, Handshake]

export function ValuesSection() {
  const { values } = aboutContent

  return (
    <section className="interior-section values-section" aria-labelledby="values-title">
      <div className="container">
        <SectionHeading
          id="values-title"
          title={values.title}
          description={values.description}
          theme="dark"
        />
        <div className="values-grid" data-page-group>
          {values.items.map((value, index) => {
            const Icon = icons[index]
            return (
              <article className="value-card" key={value.name}>
                <div className="value-card-top">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{value.name}</h3>
                <p>{value.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
