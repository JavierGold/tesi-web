import { BriefcaseBusiness, CircleUserRound, Database, MessagesSquare, Network, ShieldCheck } from 'lucide-react'

interface InteriorHeroProps {
  description: string | readonly string[]
  title: string
  variant: 'about' | 'employment' | 'contact'
}

const visualIcons = {
  about: [Network, Database, ShieldCheck],
  employment: [CircleUserRound, BriefcaseBusiness, Network],
  contact: [MessagesSquare, Network, ShieldCheck],
} as const

export function InteriorHero({ description, title, variant }: InteriorHeroProps) {
  const descriptions = Array.isArray(description) ? description : [description]
  const [PrimaryIcon, SecondaryIcon, TertiaryIcon] = visualIcons[variant]

  return (
    <section className={`interior-hero interior-hero--${variant}`} aria-labelledby={`${variant}-title`}>
      <div className="container interior-hero-grid">
        <div className="interior-hero-copy">
          <h1 id={`${variant}-title`} data-page-hero>
            {title}
          </h1>
          <div className="interior-hero-description" data-page-hero>
            {descriptions.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="interior-visual" data-page-hero data-three-slot={variant} aria-hidden="true">
          <span className="interior-visual-ring interior-visual-ring--outer" />
          <span className="interior-visual-ring interior-visual-ring--inner" />
          <span className="interior-visual-line interior-visual-line--one" />
          <span className="interior-visual-line interior-visual-line--two" />
          <span className="interior-visual-node interior-visual-node--primary">
            <PrimaryIcon size={30} strokeWidth={1.5} />
          </span>
          <span className="interior-visual-node interior-visual-node--secondary">
            <SecondaryIcon size={20} strokeWidth={1.6} />
          </span>
          <span className="interior-visual-node interior-visual-node--tertiary">
            <TertiaryIcon size={19} strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </section>
  )
}
