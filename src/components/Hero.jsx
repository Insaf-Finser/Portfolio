import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { projects } from '../../constants'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero v4 on your cream / ink palette. No gradient, no drawing.
 *
 *  1. Inverting cursor: a circle that flips the colors under it (ink text
 *     turns light, the cream background turns dark). It is a small dot by
 *     default, grows over the name and the text, and becomes an accent
 *     "View" disc over project cards. Hidden on touch screens.
 *  2. Rotating word: "I build things that learn / ship / scale / last."
 *  3. Split exit: "Insaf" slides left and "Finser" right as you scroll away.
 *  4. Magnetic buttons, one project ribbon.
 *
 * Props
 *  start  boolean, default true. Pass false while the splash is showing and
 *         flip it to true in the splash's onExited so the intro plays after
 *         the screen splits open.
 *
 * Edit PROJECTS: set `img` to a screenshot (e.g. '/assets/muse.png') and
 * `href` to the project's link or section anchor. Edit WORDS for the tagline.
 * GlobalCursor handles cursor tracking and text-hover sizing across the site.
 */

const PROJECTS = [
  { name: 'Muse', tag: 'AI inspiration card generator', href: '#projects', img: '' },
  { name: 'PromptLLM', tag: 'Tool for evaluating prompts', href: '#projects', img: '' },
  { name: 'Sketchbook Zero', tag: 'Drawing course in one file, 38 lessons', href: '#projects', img: '' },
  { name: 'Collab Draw', tag: 'Shared whiteboard, live', href: '#projects', img: '' },
]

const WORDS = ['learn', 'ship', 'scale', 'last']

const NAME_LINES = ['Insaf', 'Finser']

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const UAE_TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

const formatUaeTime = () => UAE_TIME_FORMATTER.format(new Date())

const styles = `
/* Rotating word: only the first word shows unless the roll is running */
.hero-word + .hero-word { visibility: hidden; }

/* Project ribbon */
@keyframes hero-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.hero-track {
  display: flex;
  width: max-content;
  animation: hero-marquee 50s linear infinite;
}
.hero-track:hover,
.hero-track:focus-within { animation-play-state: paused; }
.hero-set { display: flex; gap: 16px; padding-right: 16px; }

@media (prefers-reduced-motion: reduce) {
  .hero-track { animation: none; }
  .hero-marquee { overflow-x: auto; }
}
`

/* Button that leans toward the cursor while it is nearby */
const MagneticLink = ({ className, children, ...props }) => {
  const wrapRef = useRef(null)
  const linkRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const link = linkRef.current
    if (!wrap || !link) return
    if (!window.matchMedia(FINE_POINTER).matches || window.matchMedia(REDUCED_MOTION).matches) return

    const xTo = gsap.quickTo(link, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(link, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const r = link.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      gsap.set(link, { x: 0, y: 0 })
    }
  }, [])

  // The padded wrapper gives the magnet a wider catch area than the button itself.
  return (
    <span ref={wrapRef} className="-m-4 inline-block p-4">
      <a ref={linkRef} className={className} {...props}>
        {children}
      </a>
    </span>
  )
}

const ProjectCard = memo(({ project, hidden }) => (
  <a
    href={project.href}
    data-project
    tabIndex={hidden ? -1 : undefined}
    className="group relative block aspect-20/10 w-[clamp(220px,26vw,340px)] shrink-0 overflow-hidden rounded-xl border border-ink/15 bg-ink/5 transition-colors duration-300 hover:border-ink/40"
  >
    {project.img && (
      <>
        <img
          src={project.img}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-cream/90 via-cream/20 to-transparent" />
      </>
    )}
    <div className="absolute inset-x-0 bottom-0 p-4">
      <p className="font-gasoek text-[clamp(20px,2.2vw,30px)] leading-tight text-ink/80">{project.title}</p>
      <p className="mt-1 font-geist text-[clamp(12px,1vw,14px)] text-ink/70">{project.shortdescription}</p>
    </div>
  </a>
))

const Hero = ({ start = true }) => {
  const rootRef = useRef(null)
  const tlRef = useRef(null)
  const [time, setTime] = useState(formatUaeTime)

  const [reduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches)

  useEffect(() => {
    const id = setInterval(() => setTime(formatUaeTime()), 1000)
    return () => clearInterval(id)
  }, [])

  // Intro timeline (paused until `start`) and the split-on-scroll exit.
  useLayoutEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.set('.hero-pop', { opacity: 0.2, scale: 0.62,xPercent:-10, transformOrigin: '50% 50%' })
      gsap.set('.hero-fade', { opacity: 0.4 })
      gsap.utils.toArray('.hero-word').forEach((el, i) => {
        gsap.set(el, { yPercent: i === 0 ? 0 : 100, visibility: 'visible' })
      })

      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to('.hero-pop', {
          opacity: 1,
          scale: 1,
          xPercent:0,
          duration: 0.18,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        })
        .to('.hero-fade', { opacity: 1, duration: 0.25, stagger: 0.08 }, 0)

      const scrollOut = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-line-0', { xPercent: -10, ease: 'none', scrollTrigger: scrollOut })
      gsap.to('.hero-line-1', { xPercent: 10, ease: 'none', scrollTrigger: scrollOut })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    if (start) tlRef.current?.play()
  }, [start])

  // Rotating word in the tagline, rolling upward every couple of seconds.
  useEffect(() => {
    if (!start || reduced) return
    const words = gsap.utils.toArray('.hero-word', rootRef.current)
    if (words.length < 2) return

    let i = 0
    const id = setInterval(() => {
      const current = words[i]
      i = (i + 1) % words.length
      const next = words[i]
      gsap.fromTo(next, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'power3.out' })
      gsap.to(current, { yPercent: -100, duration: 0.6, ease: 'power3.out' })
    }, 2400)

    return () => clearInterval(id)
  }, [start, reduced])

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-cream text-ink px-[clamp(20px,4vw,48px)] pb-6 pt-24"
    >
      <style>{styles}</style>

      {/* status row */}
      <div className="hero-fade relative flex items-center justify-between font-geist text-[clamp(13px,1.1vw,15px)]">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-3 py-1 text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-green-400" />
          </span>
          Open to work
        </span>
        <span className="tabular-nums text-ink/70">UAE time {time}</span>
      </div>

      {/* name as the stage */}
      <div className="relative flex flex-1 flex-col justify-end py-8">
        <h1 className="sr-only">Insaf Finser</h1>
        <div
          aria-hidden="true"
          className="hero-pop select-none font-gasoek text-[clamp(96px,14.5vw,250px)] leading-[0.9] tracking-tight"
        >
          {NAME_LINES.map((word, i) => (
            <span
              key={word}
              className={`hero-line-${i} relative block w-fit ${i === 1 ? 'ml-[clamp(24px,8vw,140px)]' : ''}`}
            >
              <span data-cursor="name" className="block text-ink [-webkit-text-stroke:2px_rgba(24,24,23,0.4)]">
                {word}
              </span>
              <span data-cursor="name" className="hero-fill absolute inset-0 text-ink">{word}</span>
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="hero-pop max-w-[34rem]">
            <p className="font-grotesk text-[clamp(22px,2.8vw,40px)] leading-tight text-ink">
              <span className="sr-only">I build things that learn and things that ship.</span>
              <span aria-hidden="true">
                I build things that{' '}
                <span className="inline-grid overflow-hidden align-bottom">
                  {WORDS.map((word) => (
                    <span
                      key={word}
                      className="hero-word text-transparent [-webkit-text-stroke:1px_rgba(24,24,23,0.95)] [grid-area:1/1]"
                    >
                      {word}.
                    </span>
                  ))}
                </span>
              </span>
            </p>
            <p className="mt-3 font-grotesk text-[clamp(15px,1.4vw,19px)] leading-relaxed text-ink/75">
              AI models, full-stack apps, and the occasional mobile app. Recent CS grad, but I was
              shipping to production long before the diploma showed up.
            </p>
          </div>

          <div className="hero-pop flex flex-wrap gap-3 font-geist text-[clamp(14px,1.2vw,16px)] font-medium">
            <MagneticLink
              href="#projects"
              className="inline-block rounded-full bg-accent px-6 py-3 text-cream"
            >
              View projects
            </MagneticLink>
            <MagneticLink
              href="/resume.pdf"
              download
              className="inline-block rounded-full border border-ink/40 px-6 py-3 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink/5"
            >
              Download résumé
            </MagneticLink>
          </div>
        </div>
      </div>

      {/* project ribbon */}
      <div
        role="region"
        className="hero-fade hero-marquee relative -mx-[clamp(20px,4vw,48px)] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        aria-label="Selected projects"
      >
        <div className="hero-track">
          <div className="hero-set">
            {projects.map((p) => (
              <ProjectCard key={p} project={p} />
            ))}
          </div>
          <div className="hero-set" aria-hidden="true">
            {projects.map((p) => (
              <ProjectCard key={`${p}-copy`} project={p} hidden />
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero