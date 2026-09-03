import {
  BadgeCheck,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FolderKanban,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { aboutContent } from '../../data/about'

const dimensionIcons = [ClipboardCheck, Clock3, CircleDollarSign, ShieldCheck]
const dimensionClasses = ['requirements', 'time', 'cost', 'quality']
const structureIcons = [Building2, FolderKanban, UsersRound]

export function PmiModelSection() {
  const { pmiModel } = aboutContent

  return (
    <section
      className="interior-section pmi-section"
      aria-labelledby="pmi-title"
      data-pmi-section
    >
      <div className="container">
        <div data-page-reveal>
          <SectionHeading
            id="pmi-title"
            title={pmiModel.title}
            description={pmiModel.description}
          />
        </div>

        <figure className="pmi-model" aria-describedby="pmi-model-caption">
          <figcaption className="sr-only" id="pmi-model-caption">
            Los lineamientos PMI guían a la Project Office, el portafolio de proyectos y
            los Project Managers para dar seguimiento y control a requerimientos, tiempo,
            costo y calidad, apoyados por personal capacitado, herramientas, conocimiento y
            experiencia.
          </figcaption>

          <div className="pmi-orbit">
            <span className="pmi-depth-disc" aria-hidden="true" />
            <svg
              className="pmi-orbit-geometry"
              viewBox="0 0 700 700"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="pmi-line-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--color-blue)" />
                  <stop offset="0.55" stopColor="var(--color-cyan)" />
                  <stop offset="1" stopColor="var(--color-violet)" />
                </linearGradient>
              </defs>
              <circle className="pmi-guide-ring" cx="350" cy="350" r="226" />
              <circle
                className="pmi-ring-stroke"
                cx="350"
                cy="350"
                r="286"
                pathLength="1"
              />
              <circle
                className="pmi-ring-accent"
                cx="350"
                cy="350"
                r="286"
                pathLength="1"
              />
              <line className="pmi-connector" x1="350" y1="350" x2="350" y2="120" pathLength="1" />
              <line className="pmi-connector" x1="350" y1="350" x2="580" y2="350" pathLength="1" />
              <line className="pmi-connector" x1="350" y1="350" x2="350" y2="580" pathLength="1" />
              <line className="pmi-connector" x1="350" y1="350" x2="120" y2="350" pathLength="1" />
            </svg>

            <div className="pmi-core" data-pmi-core>
              <span className="pmi-core-icon" aria-hidden="true">
                <BadgeCheck size={24} strokeWidth={1.65} />
              </span>
              <strong>{pmiModel.core}</strong>
            </div>

            {pmiModel.dimensions.map((dimension, index) => {
              const Icon = dimensionIcons[index]
              return (
                <div
                  className={`pmi-dimension pmi-dimension--${dimensionClasses[index]}`}
                  data-pmi-dimension
                  key={dimension}
                >
                  <span className="pmi-dimension-icon" aria-hidden="true">
                    <Icon size={21} strokeWidth={1.65} />
                  </span>
                  <strong>{dimension}</strong>
                </div>
              )
            })}
          </div>

          <div className="pmi-structure">
            <span className="pmi-structure-label" data-pmi-structure>
              {pmiModel.structureLabel}
            </span>
            <div className="pmi-structure-rail">
              {pmiModel.structure.map((item, index) => {
                const Icon = structureIcons[index]
                return (
                  <div className="pmi-structure-item" data-pmi-structure key={item}>
                    <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pmi-capabilities" aria-label={pmiModel.capabilitiesLabel}>
            <span className="pmi-capabilities-label" data-pmi-capability>
              {pmiModel.capabilitiesLabel}
            </span>
            <ul>
              {pmiModel.capabilities.map((capability) => (
                <li data-pmi-capability key={capability}>
                  <span aria-hidden="true" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </figure>
      </div>
    </section>
  )
}
