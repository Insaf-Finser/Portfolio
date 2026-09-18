import { useRef, useState } from "react"
import { projects } from "../../constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/all"
import { useMediaQuery } from "react-responsive"


gsap.registerPlugin(ScrollTrigger)

const ProjectShowcase = () =>{

    const isMobile = useMediaQuery({ maxWidth: 767 })


    const [hovered, setHovered] = useState(null)

    const rowRef = useRef(null)

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
    <section id="projects" className="flex min-h-screen w-full h-full flex-col items-center justify-start overflow-hidden bg-project-bg px-8 py-10 gap-16 ">

      <div className="relative w-full  pb-3 flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-neutral-500">
        <span className="font-semibold text-accent">02</span>
        <div className="w-6 h-px bg-neutral-400"></div>
        <span>Selected Artifacts</span>
      </div>

      <div className="flex flex-col text-left p-0 m-0 justify-start items-start text-white">
        <h1 className="project-h text-[clamp(36px,10vw,64px)] m-0 font-interserif">Featured Projects </h1>
        <div className="w-[55%]">
          <p className="text-[16px] font-geist text-white/50">An curated index of specialized systems, distributed tools, and web experiments engineered for high runtime performance and clean structural composition.</p>
        </div>
      </div>
      <div ref={rowRef} className="flex flex-col md:flex-row gap-1 md:gap-3 w-[95%] md:h-125 overflow-y-clip items-center justify-center  " style={{ perspective: '1000px' }}>
        {projects.map((project, idx) => {
          const isHovered = hovered === idx
          const anyHovered = hovered !== null
 
          return (
            <div
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseMove={handleTilt}
              onMouseLeave={(e) => { resetTilt(); handleMouseLeaveCard(e) }}
              className="project-card rounded-[10px] active:scale-[0.98]  min-h-10 p-4 relative md:rotate-3 md:h-145 flex flex-col items-start justify-center gap-4 bg-cream text-black px-8 text-center overflow-hidden w-full cursor-pointer transition-[flex-grow] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform "
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