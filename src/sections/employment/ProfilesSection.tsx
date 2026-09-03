import { Code2, Database, Globe2, Server, ShieldCheck, Terminal, Waypoints } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { employmentContent } from '../../data/employment'

const icons = [Code2, Globe2, Waypoints, Server, Database, Terminal, ShieldCheck]

export function ProfilesSection() {
  const { profiles } = employmentContent

  return (
    <section className="interior-section profiles-section" aria-labelledby="profiles-title">
      <div className="container">
        <SectionHeading
          id="profiles-title"
          title={profiles.title}
          description={profiles.description}
          theme="dark"
        />
        <ul className="profile-areas" data-page-group>
          {profiles.areas.map((area, index) => {
            const Icon = icons[index]
            return (
              <li key={area}>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                <span>{area}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
