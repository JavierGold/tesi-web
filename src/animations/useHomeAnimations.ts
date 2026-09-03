import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useHomeAnimations(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!scope.current) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const heroElements = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]')

        gsap.from(heroElements, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          clearProps: 'opacity,visibility,transform',
        })

        const revealElements = gsap.utils.toArray<HTMLElement>('[data-reveal]')

        revealElements.forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 32,
            duration: 0.75,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          })
        })

        const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]')

        groups.forEach((group) => {
          const children = Array.from(group.children)
          gsap.from(children, {
            autoAlpha: 0,
            y: 30,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.09,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: group,
              start: 'top 86%',
              once: true,
            },
          })
        })

        const counters = gsap.utils.toArray<HTMLElement>('[data-count]')

        counters.forEach((counter) => {
          const target = Number(counter.dataset.count)
          const state = { value: 0 }

          ScrollTrigger.create({
            trigger: counter,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(state, {
                value: target,
                duration: 1.45,
                ease: 'power2.out',
                snap: { value: 1 },
                onUpdate: () => {
                  counter.textContent = `${Math.round(state.value).toLocaleString('en-US')}+`
                },
              })
            },
          })
        })
      })
    }, scope)

    return () => {
      media.revert()
      context.revert()
    }
  }, [scope])
}
