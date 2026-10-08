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

        
        
      </main>

      
    </>
  )
}

export default App
