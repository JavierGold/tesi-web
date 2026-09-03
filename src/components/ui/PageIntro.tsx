interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="page-intro" aria-labelledby="page-title">
      <div className="container page-intro-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p className="page-intro-description">{description}</p>
      </div>
    </section>
  )
}
