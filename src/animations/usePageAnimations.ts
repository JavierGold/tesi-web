import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function usePageAnimations(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!scope.current) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-page-hero]', {
          autoAlpha: 0,
          y: 26,
          duration: 0.78,
          ease: 'power2.out',
          stagger: 0.11,
          clearProps: 'opacity,visibility,transform',
        })

        gsap.utils.toArray<HTMLElement>('[data-page-reveal]').forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 30,
            duration: 0.72,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-page-group]').forEach((group) => {
          gsap.from(Array.from(group.children), {
            autoAlpha: 0,
            y: 28,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.08,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: group,
              start: 'top 87%',
              once: true,
            },
          })
        })

        const processProgress = scope.current?.querySelector('.process-progress')
        const processStages = scope.current?.querySelector('.process-stages')

        if (processProgress && processStages) {
          gsap.fromTo(
            processProgress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: processStages,
                start: 'top 76%',
                end: 'bottom 68%',
                scrub: 0.5,
              },
            },
          )
        }
      })

      media.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 899px)',
          desktop: '(min-width: 900px)',
        },
        (matchContext) => {
          const { reduce, mobile, desktop } = matchContext.conditions ?? {}
          if (reduce || (!mobile && !desktop)) return

          const timelineProgress = scope.current?.querySelector('.timeline-progress')
          const timeline = scope.current?.querySelector('.timeline')
          if (!timelineProgress || !timeline) return

          gsap.fromTo(
            timelineProgress,
            mobile ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 },
            {
              ...(mobile ? { scaleY: 1 } : { scaleX: 1 }),
              ease: 'none',
              scrollTrigger: {
                trigger: timeline,
                start: 'top 74%',
                end: 'bottom 68%',
                scrub: 0.5,
              },
            },
          )
        },
      )
    }, scope)

    return () => {
      media.revert()
      context.revert()
    }
  }, [scope])
}
