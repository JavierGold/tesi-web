import { BriefcaseBusiness, GraduationCap, Scale, TrendingUp, Users } from 'lucide-react'
import { employmentContent } from '../../data/employment'

const icons = [BriefcaseBusiness, GraduationCap, TrendingUp, Users, Scale]

export function ReasonsSection() {
  const { reasons } = employmentContent

  return (
    <section className="interior-section reasons-section" aria-labelledby="reasons-title">
      <div className="container">
        <header className="standalone-heading" data-page-reveal>
          <h2 id="reasons-title">{reasons.title}</h2>
        </header>
        <div className="reasons-grid" data-page-group>
          {reasons.items.map((reason, index) => {
            const Icon = icons[index]
            return (
              <article className="reason-card" key={reason.title}>
                <div className="reason-card-top">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
