import {
  ClipboardCheck,
  MessagesSquare,
  RefreshCw,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { homeContent } from '../../data/home'

const icons: LucideIcon[] = [Server, ClipboardCheck, RefreshCw, MessagesSquare]

export function CapabilitiesSection() {
  const { capabilities } = homeContent

  return (
    <section className="home-section capabilities-section" aria-labelledby="capabilities-title">
      <div className="container">
        <SectionHeading
          id="capabilities-title"
          title={capabilities.title}
          description={capabilities.description}
        />

        <div className="capabilities-grid" data-reveal-group>
          {capabilities.items.map((item, index) => {
            const Icon = icons[index]
            return (
              <article className="capability-card" key={item.title}>
                <div className="card-icon">
                  <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
