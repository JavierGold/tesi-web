import { Landmark, RefreshCw, Server, SlidersHorizontal } from 'lucide-react'
import { aboutContent } from '../../data/about'

const icons = [Landmark, Server, RefreshCw, SlidersHorizontal]

export function DifferentiatorsSection() {
  const { differentiators } = aboutContent

  return (
    <section className="interior-section differentiators-section" aria-labelledby="differentiators-title">
      <div className="container">
        <header className="standalone-heading" data-page-reveal>
          <h2 id="differentiators-title">{differentiators.title}</h2>
        </header>
        <div className="differentiators-grid" data-page-group>
          {differentiators.items.map((item, index) => {
            const Icon = icons[index]
            return (
              <article className="differentiator-card" key={item.title}>
                <div className="differentiator-icon">
                  <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
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
