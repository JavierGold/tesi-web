interface SectionHeadingProps {
  id: string
  title: string
  description: string
  theme?: 'light' | 'dark'
}

export function SectionHeading({
  id,
  title,
  description,
  theme = 'light',
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${theme}`} data-reveal>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </header>
  )
}
