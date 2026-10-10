import gsap from 'gsap'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * 404 page in the same language as the hero (cream / ink / accent).
 *
 *  - The zero in 404 is an eye. The pupil follows your cursor (it wanders on
 *    its own on touch screens) and the eye blinks every few seconds.
 *  - The 4s sweep in like the hero's name.
 *  - "Try one of these" links, so a lost visitor has somewhere to go.
 *
 * Edit LINKS to match your section ids.
 */

const LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
]

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Per-letter boxes for the entrance fill. Screen readers get plain text. */
const Letters = ({ text, srText = true }) => {
  const words = text.split(' ')
  return (
    <>
      {srText && <span className="sr-only">{text}</span>}
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => (
                <span key={ci} className="inline-block">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </>
  )
}

/** A "4": outline underneath, solid layer on top that sweeps in and flips on hover. */
const Four = () => (
  <span className="relative block">
    <span className="block text-transparent [-webkit-text-stroke:2px_rgba(24,24,23,0.4)]">
      <Letters text="4" srText={false} />
    </span>
    <span className="nf-fill absolute inset-0 text-ink">
      <Letters text="4" srText={false} />
    </span>
  </span>
)

const NotFound = () => {
  const rootRef = useRef(null)
  const eyeRef = useRef(null)
  const pupilRef = useRef(null)
  const [reduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Page Not Found | Insaf Finser'

    return () => {
      document.title = previousTitle
    }
  }, [])

  // Intro: the 4s sweep in, the eye pops open, the rest fades up.
  useLayoutEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.set('.nf-fill', { clipPath: 'inset(-5% 100% -5% 0%)' })
      gsap.set('.nf-eye', { scale: 0 })
      gsap.set('.nf-fade', { opacity: 0, y: 16 })

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to('.nf-fill', { clipPath: 'inset(-5% 0% -5% 0%)', duration: 0.9, stagger: 0.25 }, 0)
        .to('.nf-eye', { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 0.35)
        .to('.nf-fade', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.6)
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  // The eye: pupil follows the cursor (or wanders on touch), blinks now and then.
  useEffect(() => {
    const eye = eyeRef.current
    const pupil = pupilRef.current
    if (!eye || !pupil || reduced) return

    const fine = window.matchMedia(FINE_POINTER).matches
    const xTo = gsap.quickTo(pupil, 'x', { duration: 0.3, ease: 'power3.out' })
    const yTo = gsap.quickTo(pupil, 'y', { duration: 0.3, ease: 'power3.out' })

    const lookAt = (x, y) => {
      const r = eye.getBoundingClientRect()
      const dx = x - (r.left + r.width / 2)
      const dy = y - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const travel = r.width * 0.12 * Math.min(1, dist / 280)
      xTo((dx / dist) * travel)
      yTo((dy / dist) * travel)
    }

    const onMove = (e) => lookAt(e.clientX, e.clientY)
    let wander
    if (fine) {
      window.addEventListener('pointermove', onMove)
    } else {
      wander = () => {
        const t = performance.now() / 1000
        const r = eye.getBoundingClientRect()
        lookAt(r.left + r.width / 2 + Math.sin(t * 0.8) * 300, r.top + r.height / 2 + Math.cos(t * 0.6) * 200)
      }
      gsap.ticker.add(wander)
    }

    const blink = setInterval(() => {
      gsap.fromTo(
        eye,
        { scaleY: 1 },
        { scaleY: 0.08, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' },
      )
    }, 4500)

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (wander) gsap.ticker.remove(wander)
      clearInterval(blink)
      gsap.killTweensOf([eye, pupil])
    }
  }, [reduced])

  return (
    <main
      ref={rootRef}
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-cream px-[clamp(20px,6vw,88px)] py-8 text-ink"
    >
      <header className="nf-fade flex items-center justify-between border-b border-ink/15 pb-4 font-geist text-sm text-ink/60">
        <a href="/" className="font-semibold text-ink no-underline">
          Insaf Finser
        </a>
        <span>Page not found</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-12">
        <p className="nf-fade mb-6 flex items-center gap-3 font-geist text-sm text-ink/60">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Error 404
        </p>

        {/* the number: 4, an eye, 4 */}
        <h1 className="sr-only">404, page not found</h1>
        <div
          aria-hidden="true"
          className="flex select-none items-end gap-[0.03em] font-gasoek text-[clamp(100px,28vw,360px)] leading-[0.78] tracking-tight"
        >
          <Four />
          <span
            ref={eyeRef}
            className="nf-eye grid h-[0.74em] w-[0.7em] place-items-center rounded-full border-[0.17em] border-ink bg-cream"
          >
            <span ref={pupilRef} className="size-[0.2em] rounded-full bg-accent" />
          </span>
          <Four />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div className="nf-fade max-w-xl">
            <h2 className="m-0 font-interserif text-[clamp(32px,5vw,56px)] leading-tight">
              <Letters text="This page took a wrong turn." />
            </h2>
            <p className="mb-0 mt-3 max-w-lg font-grotesk text-base leading-relaxed text-ink/70 sm:text-lg">
              The page you’re looking for doesn’t exist or may have moved. Pick a way back below.
            </p>
            <a
              href="/#home"
              className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-accent px-6 py-3 font-geist text-sm font-medium text-cream no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Back to home
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <nav aria-label="Other places to go" className="nf-fade w-full max-w-md md:justify-self-end">
            <p className="mb-3 font-geist text-sm text-ink/60">Or try one of these</p>
            <ul className="m-0 list-none p-0">
              {LINKS.map((link) => (
                <li key={link.label} className="border-t border-ink/15 last:border-b">
                  <a
                    href={link.href}
                    className="flex items-center justify-between py-3 font-gasoek text-[clamp(26px,3.4vw,44px)] leading-none text-ink no-underline"
                  >
                    <Letters text={link.label} />
                    <span
                      aria-hidden="true"
                      className="font-geist text-lg"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <footer className="nf-fade flex items-center justify-between border-t border-ink/15 pt-4 font-geist text-xs text-ink/50 sm:text-sm">
        <span>Insaf Finser</span>
        <span>Full-stack developer</span>
      </footer>
    </main>
  )
}

export default NotFound