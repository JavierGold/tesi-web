import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useAboutModelAnimations(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const scopeElement = scope.current
    if (!scopeElement) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 760px)',
        },
        (matchContext) => {
          const { motion, mobile } = matchContext.conditions ?? {}
          if (!motion) return

          const pmiSection = scopeElement.querySelector<HTMLElement>('[data-pmi-section]')
          const pmiRing = pmiSection?.querySelector<SVGCircleElement>('.pmi-ring-stroke')
          const pmiStructure = pmiSection?.querySelectorAll<HTMLElement>('[data-pmi-structure]')
          const pmiCore = pmiSection?.querySelector<HTMLElement>('[data-pmi-core]')
          const pmiDimensions = pmiSection?.querySelectorAll<HTMLElement>('[data-pmi-dimension]')
          const pmiConnectors = pmiSection?.querySelectorAll<SVGLineElement>('.pmi-connector')
          const pmiCapabilities = pmiSection?.querySelectorAll<HTMLElement>('[data-pmi-capability]')

          if (
            pmiSection &&
            pmiRing &&
            pmiStructure?.length &&
            pmiCore &&
            pmiDimensions?.length &&
            pmiConnectors?.length &&
            pmiCapabilities?.length
          ) {
            ScrollTrigger.create({
              trigger: pmiSection,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: ({ isActive }) => pmiSection.classList.toggle('is-in-view', isActive),
            })

            const pmiTimeline = gsap.timeline({
              defaults: { ease: 'power2.out' },
              scrollTrigger: {
                trigger: pmiSection.querySelector('.pmi-model'),
                start: 'top 78%',
                once: true,
              },
              onComplete: () => pmiSection.classList.add('is-live'),
            })

            pmiTimeline
              .from(
                pmiCore,
                {
                  autoAlpha: 0,
                  scale: 0.9,
                  z: -32,
                  duration: 0.22,
                  clearProps: 'all',
                },
                0,
              )
              .fromTo(
                pmiRing,
                { attr: { 'stroke-dashoffset': 1 } },
                { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power1.inOut' },
                0,
              )
              .from(
                pmiStructure,
                {
                  autoAlpha: 0,
                  y: 14,
                  z: -18,
                  duration: 0.25,
                  stagger: 0.025,
                  clearProps: 'all',
                },
                0.08,
              )

            pmiDimensions.forEach((dimension, index) => {
              const start = 0.18 + index * 0.11

              pmiTimeline
                .fromTo(
                  pmiConnectors[index],
                  { attr: { 'stroke-dashoffset': 1 } },
                  {
                    attr: { 'stroke-dashoffset': 0 },
                    duration: 0.24,
                    ease: 'power1.inOut',
                  },
                  start,
                )
                .from(
                  dimension,
                  {
                    autoAlpha: 0,
                    scale: 0.9,
                    z: -24,
                    duration: 0.28,
                    clearProps: 'all',
                  },
                  start + 0.08,
                )
            })

            pmiTimeline.from(
              pmiCapabilities,
              {
                autoAlpha: 0,
                y: 10,
                duration: 0.25,
                stagger: 0.035,
                clearProps: 'all',
              },
              0.76,
            )
          }

          const talentSection = scopeElement.querySelector<HTMLElement>('[data-talent-section]')
          const talentNodes = talentSection?.querySelectorAll<HTMLElement>('[data-talent-node]')
          const talentCopies = talentSection?.querySelectorAll<HTMLElement>('[data-talent-copy]')
          const talentConnectors = talentSection?.querySelectorAll<HTMLElement>('[data-talent-connector]')
          const talentFinal = talentSection?.querySelector<HTMLElement>('[data-talent-final]')

          if (
            talentSection &&
            talentNodes?.length &&
            talentCopies?.length &&
            talentConnectors?.length &&
            talentFinal
          ) {
            ScrollTrigger.create({
              trigger: talentSection,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: ({ isActive }) => talentSection.classList.toggle('is-in-view', isActive),
            })

            const talentTimeline = gsap.timeline({
              defaults: { ease: 'power2.out' },
              scrollTrigger: {
                trigger: talentSection.querySelector('.talent-model'),
                start: 'top 79%',
                once: true,
              },
              onComplete: () => talentSection.classList.add('is-live'),
            })

            talentTimeline
              .from(talentNodes[0], {
                autoAlpha: 0,
                scale: 0.9,
                z: -28,
                duration: 0.5,
                clearProps: 'all',
              })
              .from(
                talentCopies[0],
                { autoAlpha: 0, y: 10, duration: 0.38, clearProps: 'all' },
                '-=0.24',
              )

            talentConnectors.forEach((connector, index) => {
              talentTimeline
                .fromTo(
                  connector,
                  mobile ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 },
                  {
                    ...(mobile ? { scaleY: 1 } : { scaleX: 1 }),
                    duration: 0.42,
                    ease: 'power1.inOut',
                    clearProps: 'all',
                  },
                )
                .from(talentNodes[index + 1], {
                  autoAlpha: 0,
                  scale: 0.9,
                  z: -24 - index * 7,
                  duration: 0.5,
                  clearProps: 'all',
                })
                .from(
                  talentCopies[index + 1],
                  { autoAlpha: 0, y: 10, duration: 0.38, clearProps: 'all' },
                  '-=0.25',
                )
            })

            talentTimeline.from(talentFinal, {
              autoAlpha: 0,
              y: 12,
              duration: 0.48,
              clearProps: 'all',
            })
          }
        },
      )
    }, scopeElement)

    return () => {
      scopeElement.querySelector('[data-pmi-section]')?.classList.remove('is-in-view', 'is-live')
      scopeElement.querySelector('[data-talent-section]')?.classList.remove('is-in-view', 'is-live')
      media.revert()
      context.revert()
    }
  }, [scope])
}
