import { useRef } from 'react'
import { useHomeAnimations } from '../animations/useHomeAnimations'
import { CapabilitiesSection } from '../sections/home/CapabilitiesSection'
import { ExperienceSection } from '../sections/home/ExperienceSection'
import { FinalCtaSection } from '../sections/home/FinalCtaSection'
import { HeroSection } from '../sections/home/HeroSection'
import { ServicesSection } from '../sections/home/ServicesSection'
import { TechnologiesSection } from '../sections/home/TechnologiesSection'
import '../styles/home.css'

export function HomePage() {
  const homeRef = useRef<HTMLElement>(null)
  useHomeAnimations(homeRef)

  return (
    <article className="home" ref={homeRef}>
      <HeroSection />
      <CapabilitiesSection />
      <TechnologiesSection />
      <ServicesSection />
      <ExperienceSection />
      <FinalCtaSection />
    </article>
  )
}
