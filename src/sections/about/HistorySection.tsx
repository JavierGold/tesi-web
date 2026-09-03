import { aboutContent } from '../../data/about'

export function HistorySection() {
  const { history } = aboutContent

  return (
    <>
      <section className="interior-section history-section" aria-labelledby="history-title">
        <div className="container">
          <div className="editorial-heading" data-page-reveal>
            <h2 id="history-title">{history.title}</h2>
            <div className="editorial-copy">
              {history.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="timeline-section" aria-label="Línea de tiempo de TESI">
        <div className="container">
          <div className="timeline" data-page-group>
            <span className="timeline-track" aria-hidden="true">
              <span className="timeline-progress" />
            </span>
            {history.milestones.map((milestone) => (
              <article className="timeline-item" key={milestone.label}>
                <span className="timeline-marker" aria-hidden="true" />
                <strong>{milestone.label}</strong>
                <p>{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
