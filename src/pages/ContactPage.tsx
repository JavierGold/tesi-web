import { useRef } from 'react'
import { usePageAnimations } from '../animations/usePageAnimations'
import { InteriorHero } from '../components/ui/InteriorHero'
import { contactContent } from '../data/contact'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { ContactDetailsSection } from '../sections/contact/ContactDetailsSection'
import { ContactFormSection } from '../sections/contact/ContactFormSection'
import '../styles/interior.css'
import '../styles/contact.css'

export function ContactPage() {
  const pageRef = useRef<HTMLElement>(null)
  usePageAnimations(pageRef)
  usePageMetadata('Contacto | TESI', contactContent.intro.description)

  return (
    <article className="interior-page contact-page" ref={pageRef}>
      <InteriorHero
        title={contactContent.intro.title}
        description={contactContent.intro.description}
        variant="contact"
      />
      <ContactFormSection />
      <ContactDetailsSection />
    </article>
  )
}
