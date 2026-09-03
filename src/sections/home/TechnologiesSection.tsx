import { Boxes, Braces, Database, Network, ShieldCheck, Workflow } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { homeContent } from '../../data/home'
import abInitioLogo from '../../../img/ab-logo.svg?url'
import cobolLogo from '../../../img/cobol.jpg?url'
import kafkaLogo from '../../../img/kafka.png?url'
import tandemLogo from '../../../img/Tandem.svg?url'
import teradataLogo from '../../../img/Teradata.png?url'
import unisysLogo from '../../../img/unisys.png?url'

const featuredLogos: Record<string, string | undefined> = {
  Unisys: unisysLogo,
  'HPE NonStop (Tandem)': tandemLogo,
  COBOL: cobolLogo,
  ALGOL: undefined,
  Teradata: teradataLogo,
  'Ab Initio': abInitioLogo,
}

const groupIcons = [Boxes, Braces, Database, Network, Workflow, ShieldCheck]

export function TechnologiesSection() {
  const { technologies } = homeContent

  return (
    <section className="home-section technologies-section" aria-labelledby="technologies-title">
      <div className="container">
        <SectionHeading
          id="technologies-title"
          title={technologies.title}
          description={technologies.description}
        />

        <div className="featured-technologies" data-reveal-group>
          {technologies.featured.map((technology) => {
            const logo = featuredLogos[technology]
            return (
              <article className="featured-technology" key={technology}>
                <div className="technology-logo-wrap">
                  {logo ? (
                    <img src={logo} alt="" className="technology-logo" />
                  ) : (
                    <span className="technology-wordmark">{technology}</span>
                  )}
                </div>
                <h3>{technology}</h3>
              </article>
            )
          })}
        </div>

        <div className="technology-groups" data-reveal-group>
          {technologies.groups.map((group, index) => {
            const Icon = groupIcons[index]
            return (
              <article className="technology-group" key={group.title}>
                <div className="technology-group-heading">
                  <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{group.title}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      {item === 'Apache Kafka' && (
                        <img className="kafka-mark" src={kafkaLogo} alt="" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
