import './index.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import BackgroundTextMotion from './components/BackgroundTextMotion'
import ProjectShowcase from './components/ProjectShowcase'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import NavMenu from './components/NavMenu'
import { socialLinks } from '../constants'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    const updateLenis = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* <BackgroundTextMotion/> */}

      <NavMenu/>

      

      <main>
        {/* Hero Section */}
        <Hero/>
        

        {/* About Section */}
        <About/>
        

        {/* Projects Section */}
        <ProjectShowcase/>

        

        {/* Contact Section */}
        <Contact/>

        <footer className='flex border-t border-black/20 bg-cream/30 px-4 py-2 gap-auto justify-between '>
                <p className='  flex max-w-300 flex-col items-center justify-center'>&copy; 2026 Insaf Finser. All rights reserved. | Crafted with passion and code.</p>
                <div className="mb-2 mt-2 flex items-center justify-start gap-2">
                          <ul className=" list-none items-end justify-baseline flex text-accent">
                            {socialLinks.map((link,index)=>{
                                return(
                                    <ul key={index} className="group relative flex p-[0.3rem]">
                              <a href={link.link} target="_blank" rel="noopener noreferrer" title={link.name} aria-label={link.name} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-black/70 no-underline transition-all duration-300 hover:-translate-y-1 hover:rotate-15 hover:border-accent hover:bg-gold/20 hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]">
                                <svg width="24" height={link.name === 'LinkedIn' ? '20' : '24'} viewBox="0 0 24 24" fill="currentColor">
                                  <path d={link.svg}/>
                                </svg>
                              </a>
                              <span className="absolute pl-12 pt-2 ml-2 hidden text-base text-text-secondary " style={{ marginLeft: '0'}}>{link.name}</span>
                            </ul>
                                )
                                
                            })}
                          </ul>
                        </div>
              </footer>
        
      </main>

      
    </>
  )
}

export default App
