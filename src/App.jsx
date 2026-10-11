import './index.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ProjectShowcase from './components/ProjectShowcase'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import NavMenu from './components/NavMenu'
import SplashScreen from './components/SplashScreen'
import GlobalCursor from './components/GlobalCursor'
import NotFound from './components/NotFound'
import Privacy from './components/Privacy'

gsap.registerPlugin(ScrollTrigger)

const navigationEntry = window.performance.getEntriesByType('navigation')[0]
const isReloadNavigation = navigationEntry?.type === 'reload'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

if (isReloadNavigation) {
  if (window.location.hash) {
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`,
    )
  }
  window.scrollTo(0, 0)
}

const PortfolioApp = () => {
  const [splashVisible, setSplashVisible] = useState(true)
  const [splashReady, setSplashReady] = useState(false)
  const [heroStarted, setHeroStarted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
    })
    let frameId
    let resetTimer
    if (isReloadNavigation) {
      const resetScroll = () => {
        lenis.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
      }
      resetScroll()
      frameId = requestAnimationFrame(resetScroll)
      resetTimer = window.setTimeout(resetScroll, 100)
    }

    const updateScrollTrigger = () => ScrollTrigger.update()
    const updateLenis = (time) => lenis.raf(time * 1000)
    const handleSectionNavigation = (event) => {
      const link = event.target instanceof Element
        ? event.target.closest('.menu-item[href^="#"]')
        : null
      if (!link) return

      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return

      event.preventDefault()
      const hash = link.getAttribute('href')
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash)
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      lenis.scrollTo(target, {
        duration: reducedMotion ? 0 : 1.5,
        immediate: reducedMotion,
        force: true,
      })
    }

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)
    document.addEventListener('click', handleSectionNavigation)

    if (!isReloadNavigation && window.location.hash) {
      const initialTarget = document.querySelector(window.location.hash)
      if (initialTarget) {
        const scrollToInitialSection = () => {
          lenis.scrollTo(initialTarget, { immediate: true, force: true })
        }
        frameId = requestAnimationFrame(() => {
          scrollToInitialSection()
          frameId = requestAnimationFrame(scrollToInitialSection)
        })
      }
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      if (resetTimer) window.clearTimeout(resetTimer)
      document.removeEventListener('click', handleSectionNavigation)
      lenis.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let finished = false
    let readinessScheduled = false
    let completionTimer
    const startedAt = performance.now()
    const minimumDisplayTime = 250
    const showReady = () => {
      if (cancelled || finished || readinessScheduled) return
      readinessScheduled = true
      setLoadingProgress(100)
      const remainingDisplayTime = Math.max(0, minimumDisplayTime - (performance.now() - startedAt))
      completionTimer = window.setTimeout(() => {
        if (cancelled || finished) return
        finished = true
        window.clearTimeout(fontFallbackTimer)
        setSplashReady(true)
      }, remainingDisplayTime)
    }
    const fontFallbackTimer = window.setTimeout(showReady, 700)

    Promise.resolve(document.fonts?.ready)
      .catch((error) => {
        console.warn('Splash preload could not wait for document fonts.', error)
      })
      .then(showReady)

    return () => {
      cancelled = true
      window.clearTimeout(fontFallbackTimer)
      window.clearTimeout(completionTimer)
    }
  }, [])

  return (
    <>
      <GlobalCursor />
      {splashVisible && (
        <SplashScreen
          progress={loadingProgress}
          ready={splashReady}
          onExited={() => {
            setSplashVisible(false)
            setHeroStarted(true)
          }}
        />
      )}
      <NavMenu/>

      

      <main>
        {/* Hero Section */}
        <Hero start={heroStarted} />
        

        {/* About Section */}
        <About/>
        

        {/* Projects Section */}
        <ProjectShowcase/>

        

        {/* Contact Section */}
        <Contact />

        
        
      </main>

      <Analytics />
    </>
  )
}

const App = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isPortfolioPath = pathname === '/' || pathname === '/index.html'

  if (isPortfolioPath) return <PortfolioApp />
  if (pathname === '/privacy') return <Privacy />
  return <NotFound />
}

export default App
