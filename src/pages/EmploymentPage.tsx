import { useRef } from 'react'
import { usePageAnimations } from '../animations/usePageAnimations'
import { InteriorHero } from '../components/ui/InteriorHero'
import { employmentContent } from '../data/employment'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { CareersFormSection } from '../sections/employment/CareersFormSection'
import { ProfilesSection } from '../sections/employment/ProfilesSection'
import { ReasonsSection } from '../sections/employment/ReasonsSection'
import '../styles/interior.css'
import '../styles/employment.css'

export function EmploymentPage() {
  const pageRef = useRef<HTMLElement>(null)
  usePageAnimations(pageRef)
  usePageMetadata('Empleo | TESI', employmentContent.intro.description.join(' '))

  return (
    <article className="interior-page employment-page" ref={pageRef}>
      <InteriorHero
        title={employmentContent.intro.title}
        description={employmentContent.intro.description}
        variant="employment"
      />
      <ReasonsSection />
      <ProfilesSection />
      <CareersFormSection />
    </article>
  )
}
