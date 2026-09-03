import { useRef } from 'react'
import { useAboutModelAnimations } from '../animations/useAboutModelAnimations'
import { usePageAnimations } from '../animations/usePageAnimations'
import { InteriorCta } from '../components/ui/InteriorCta'
import { InteriorHero } from '../components/ui/InteriorHero'
import { aboutContent } from '../data/about'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { DifferentiatorsSection } from '../sections/about/DifferentiatorsSection'
import { HistorySection } from '../sections/about/HistorySection'
import { PmiModelSection } from '../sections/about/PmiModelSection'
import { TalentCapacitySection } from '../sections/about/TalentCapacitySection'
import { ValuesSection } from '../sections/about/ValuesSection'
import '../styles/interior.css'
import '../styles/about.css'

export function AboutPage() {
  const pageRef = useRef<HTMLElement>(null)
  usePageAnimations(pageRef)
  useAboutModelAnimations(pageRef)
  usePageMetadata('Sobre nosotros | TESI', aboutContent.intro.description)

  return (
    <article className="interior-page about-page" ref={pageRef}>
      <InteriorHero
        title={aboutContent.intro.title}
        description={aboutContent.intro.description}
        variant="about"
      />
      <HistorySection />
      <DifferentiatorsSection />
      <PmiModelSection />
      <TalentCapacitySection />
      <ValuesSection />
      <InteriorCta {...aboutContent.finalCta} />
    </article>
  )
}
