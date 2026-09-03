import { GraduationCap, TrendingUp, UserPlus, UsersRound } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { aboutContent } from '../../data/about'

const stageIcons = [TrendingUp, UserPlus, GraduationCap, UsersRound]

export function TalentCapacitySection() {
  const { talentModel } = aboutContent

  return (
    <section
      className="interior-section talent-section"
      aria-labelledby="talent-title"
      data-talent-section
    >
      <div className="container">
        <div data-page-reveal>
          <SectionHeading
            id="talent-title"
            title={talentModel.title}
            description={talentModel.description}
          />
        </div>

        <figure className="talent-model" aria-describedby="talent-model-caption">
          <figcaption className="sr-only" id="talent-model-caption">
            Proceso continuo mediante el cual una necesidad de capacidad conduce a la
            incorporación, capacitación y desarrollo de talento preparado para los proyectos.
          </figcaption>

          <ol className="talent-flow">
            {talentModel.stages.map((stage, index) => {
              const Icon = stageIcons[index]
              const isFinal = index === talentModel.stages.length - 1

              return (
                <li className={`talent-stage${isFinal ? ' talent-stage--result' : ''}`} key={stage.title}>
                  <div className="talent-stage-node" data-talent-node>
                    <span className="talent-stage-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="talent-stage-icon" aria-hidden="true">
                      <Icon size={24} strokeWidth={1.55} />
                    </span>
                  </div>
                  <div className="talent-stage-copy" data-talent-copy>
                    <h3>{stage.title}</h3>
                    <p>{stage.message}</p>
                  </div>
                  {!isFinal && (
                    <span className="talent-connector" data-talent-connector aria-hidden="true">
                      <span />
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          <p className="talent-final-message" data-talent-final>
            {talentModel.finalMessage}
          </p>
        </figure>
      </div>
    </section>
  )
}
