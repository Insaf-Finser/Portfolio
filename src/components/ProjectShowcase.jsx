import { useEffect, useRef, useState } from "react"
import { projects } from "../../constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/all"
import { useMediaQuery } from "react-responsive"


gsap.registerPlugin(ScrollTrigger)

const ProjectShowcase = () =>{

    const isMobile = useMediaQuery({ maxWidth: 1023 })


    const [hovered, setHovered] = useState(null)
    const [activeProject, setActiveProject] = useState(0)
    const [dragX, setDragX] = useState(0)
    const [exitDirection, setExitDirection] = useState(0)

    const rowRef = useRef(null)
    const pointerStart = useRef(null)
    const advanceTimer = useRef(null)

    useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

    const sendTopCardToBack = (direction) => {
      if (exitDirection || projects.length < 2) return

      setExitDirection(direction)
      advanceTimer.current = window.setTimeout(() => {
        setActiveProject((current) => (current + 1) % projects.length)
        setDragX(0)
        setExitDirection(0)
      }, 300)
    }

    const handlePointerDown = (e) => {
      if (e.button !== 0 || exitDirection) return
      pointerStart.current = { x: e.clientX, currentX: e.clientX }
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
      if (!pointerStart.current) return
      pointerStart.current.currentX = e.clientX
      setDragX(e.clientX - pointerStart.current.x)
    }

    const handlePointerUp = () => {
      if (!pointerStart.current) return
      const distance = pointerStart.current.currentX - pointerStart.current.x
      pointerStart.current = null

      if (Math.abs(distance) > 80) {
        sendTopCardToBack(Math.sign(distance))
      } else {
        setDragX(0)
      }
    }

    const handlePointerCancel = () => {
      pointerStart.current = null
      setDragX(0)
    }

    const deckProjects = [...projects.slice(activeProject), ...projects.slice(0, activeProject)]

    useGSAP(() => {
      gsap.from('.project-card', {
        opacity: 0,
        x: -60,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 80%',
        },
      })
    }, { scope: rowRef })

       const handleTilt = (e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.setProperty('--tilt-x', `${x * 8}deg`)
        el.style.setProperty('--tilt-y', `${-y * 8}deg`)
    }
 
    const resetTilt = () => {
        setHovered(null)
    }
 
    const handleMouseLeaveCard = (e) => {
        e.currentTarget.style.setProperty('--tilt-x', '0deg')
        e.currentTarget.style.setProperty('--tilt-y', '0deg')
    }
 


  return(
    <section id="projects" className="flex min-h-screen w-full flex-col items-center justify-start gap-10 overflow-hidden bg-project-bg px-4 py-10 sm:px-6 md:gap-16 md:px-8">

      <div className="relative w-full  pb-3 flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-neutral-500">
        <span className="font-semibold text-accent">02</span>
        <div className="w-6 h-px bg-neutral-400"></div>
        <span>Selected Artifacts</span>
      </div>

      <div className="flex w-full flex-col items-start justify-start p-0 text-left text-white">
        <h1 className="project-h text-[clamp(36px,10vw,64px)] m-0 font-interserif">Featured Projects </h1>
        <p className="w-full max-w-2xl text-[16px] font-geist text-white/50">A curated index of specialized systems, distributed tools, and web experiments engineered for high runtime performance and clean structural composition.</p>
      </div>
      {isMobile ? (
        <div className="w-full max-w-xl">
          <div
            className="relative h-[min(70vh,520px)] min-h-[400px] w-full touch-pan-y"
            aria-label="Featured projects. Swipe left or right to browse."
          >
            {deckProjects.map((project, depth) => {
              const isTopCard = depth === 0
              const isExiting = isTopCard && exitDirection !== 0
              const offsetX = isTopCard ? (isExiting ? exitDirection * 500 : dragX) : 0
              const rotation = isTopCard ? offsetX * 0.035 : 0

              return (
                <article
                  key={project.id}
                  onPointerDown={isTopCard ? handlePointerDown : undefined}
                  onPointerMove={isTopCard ? handlePointerMove : undefined}
                  onPointerUp={isTopCard ? handlePointerUp : undefined}
                  onPointerCancel={isTopCard ? handlePointerCancel : undefined}
                  className={`absolute inset-x-0 top-0 flex h-full flex-col overflow-y-auto rounded-2xl bg-cream p-6 text-black shadow-xl ${
                    isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                  }`}
                  style={{
                    zIndex: projects.length - depth,
                    transform: `translate3d(${offsetX}px, ${depth * 12}px, 0) scale(${1 - depth * 0.035}) rotate(${rotation}deg)`,
                    opacity: depth > 2 ? 0 : isExiting ? 0 : 1,
                    transition: isTopCard && !isExiting && dragX !== 0 ? 'none' : 'transform 300ms ease, opacity 300ms ease',
                    visibility: depth > 2 ? 'hidden' : 'visible',
                  }}
                  aria-hidden={!isTopCard}
                >
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-black/50">
                    {project.year} <span aria-hidden="true">/</span> {project.role}
                  </p>
                  <h2 className="mb-4 font-interserif text-3xl">{project.title}</h2>
                  <p className="font-geist text-sm leading-relaxed text-black/70">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-black/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-black/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-auto pt-6 text-center font-mono text-xs uppercase tracking-widest text-black/45">
                    Swipe either way to browse
                  </p>
                </article>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 text-cream">
            <span className="font-mono text-xs uppercase tracking-widest text-cream/60" aria-live="polite">
              {activeProject + 1} / {projects.length}
            </span>
            <button
              type="button"
              onClick={() => sendTopCardToBack(1)}
              disabled={exitDirection !== 0}
              className="rounded-full border border-cream/40 px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-cream hover:text-ink disabled:opacity-50"
              aria-label={`Show next project: ${projects[(activeProject + 1) % projects.length].title}`}
            >
              Next project →
            </button>
          </div>
        </div>
      ) : (
      <div ref={rowRef} className="flex w-[95%] items-center justify-center gap-1 overflow-y-clip lg:h-125 lg:flex-row lg:gap-3" style={{ perspective: '1000px' }}>
        {projects.map((project, idx) => {
          const isHovered = hovered === idx
          const anyHovered = hovered !== null
 
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHovered(idx)}
              onMouseMove={handleTilt}
              onMouseLeave={(e) => { resetTilt(); handleMouseLeaveCard(e) }}
              className="project-card rounded-[10px] active:scale-[0.98] min-h-10 p-4 relative md:rotate-3 md:h-145 lg:h-[110%] flex flex-col items-start justify-center gap-4 bg-cream text-black px-8 text-center overflow-hidden w-full cursor-pointer transition-[flex-grow] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform "
              style={{
                  flexGrow: isMobile ? undefined : (isHovered ? 2.2 : anyHovered ? 0.7 : 1),
                  flexBasis: isMobile ? undefined : 0,
              }}
            >
              <div className={`md:-rotate-3 flex flex-col ${isHovered ? "items-start" : "items-center"} justify-center md:gap-4 z-10 w-full `}>
                <h3 className="font-serif text-2xl md:text-3xl">{project.title}</h3>
 
                <div
                  className={`overflow-hidden transition-all duration-500 power1-out ${
                    isHovered ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-black/60 text-sm md:text-base text-left">{project.description}</p>
                  <div className="flex flex-wrap justify-start gap-2 mt-4 ">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] uppercase tracking-wide font-mono border border-black/20 rounded-full px-2 py-1 hover:bg-accent/60 hover:duration-300 hover:scale-[105%] text-black/70 z-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => {/* navigate to project detail page */}}
                    className="flex items-start mt-4 text-xs uppercase tracking-widest font-mono text-black/40 underline underline-offset-4 hover:text-black "
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}

      
    </section>
  )
}

export default ProjectShowcase


{/* <h2 className="mb-12 text-[2rem] tracking-tight text-accent md:text-[3rem]">Featured Projects</h2>
      <div className="relative z-10 w-full max-w-300 grid-cols-1 gap-8 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] flex">
        {projects.map((project, idx) => (
          <div key={idx} className="h-[60vh]  group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-bg-secondary/80 p-8 backdrop-blur-md transition-all duration-400 hover:-translate-y-3 hover:border-accent hover:bg-bg-secondary/90 hover:shadow-[0_30px_60px_rgba(212,175,55,0.15)] bg-cream">
            <h3 className="relative z-10 mb-2 text-2xl text-accent">{project.title}</h3>
            <p className="relative z-10 mb-6 text-text-secondary">{project.description}</p>
            <div className="relative z-10 flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span key={i} className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-accent transition-all duration-300 hover:border-accent hover:bg-gold/20">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div> */}