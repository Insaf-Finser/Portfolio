import gsap from "gsap"
import { useEffect, useState } from "react"

const Hero = () =>{

    const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1)

    useEffect(() => {
    window.scrollTo(0, 0)
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = 300
      const opacity = Math.max(0, 1 - scrolled / maxScroll)
      setScrollIndicatorOpacity(opacity)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



    const scrollToProjects = () => {
        document.getElementById('projects')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
        })
    }

    const downloadResume = () => {
    const link = document.createElement('a')
    link.href = 'https://res.cloudinary.com/dwvzfckyd/image/upload/v1780302192/Insaf_Finser_Resume_CS_qjhqfy.jpg'
    link.download = 'Insaf_Finser_Resume.pdf'
    link.click()
    }

    const handleProjectsClick = (e) => {
        gsap.fromTo(
        e.currentTarget,
        { scale: 1 },
        {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        }
        )

        scrollToProjects()
    }

    return(
        <section id="home" className="hero">
          <div className="hero-container">
            {/* Placeholder for social media icons or contact links */}
            <div className="hero-contacts">
              
                <div className="hero-social-links">
                  <ul className="social-links-list">
                    <ul>
                      <a href="https://github.com/Insaf-Finser" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0'}}>Github</span>
                    </ul>
                    <ul>
                      <a href="https://www.linkedin.com/in/insaf-finser/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.453h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 9.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 10.019h-3.555v-11.453h3.555v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0'}}>LinkedIn</span>
                    </ul>
                    <ul>
                      <a
                        href="https://instagram.com/__insaffinser_"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Instagram"
                        aria-label="Instagram"
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.75 1a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0' }}>Instagram</span>
                    </ul>
                    <ul>
                      <a href="mailto:insaffinser@gmail.com" title="Email" aria-label="Email">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0' }}>Email</span>
                    </ul>
                    <ul>
                      <a href="/assets/Latest_Resume.pdf" target="_blank" rel="noopener noreferrer" title="Resume" aria-label="Resume">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <polyline points="14 2 14 8 20 8" style={{fill: 'none', stroke: 'currentColor', strokeWidth: 2}}/>
                          <line x1="12" y1="13" x2="8" y2="13" style={{stroke: 'currentColor', strokeWidth: 2}}/>
                          <line x1="12" y1="17" x2="8" y2="17" style={{stroke: 'currentColor', strokeWidth: 2}}/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0' }}>Resume</span>
                    </ul>
                    
                  </ul>
                </div>
              
              
              
            </div>
            <div className="hero-content">
              <div>
                <span className='hero-title-prefix' >I'm </span>
                <span className="hero-title">Insaf Finser</span>
              </div>
              
              <p className="hero-subtitle">Software Developer</p>
              <p className="hero-description">Building intelligent apps, immersive experiences, and scalable solutions.</p>
              <div className="hero-buttons">
                <button onClick={handleProjectsClick}>
                  View My Work
                </button>

                <button
                  className="secondary"
                  onClick={downloadResume}
                >
                  Download Resume
                </button>
              </div>
            </div>
            <div className="hero-image-container">
              <img src="https://res.cloudinary.com/dwvzfckyd/image/upload/v1780301606/my_pic_tue4tl.jpg" className='hero-image' />
            </div>
          </div>
          <div className="scroll-down-indicator" style={{ '--scroll-opacity': scrollIndicatorOpacity }}>
            <icon className="scroll-left">← </icon>
            <span className="scroll-down-text">Scroll Down</span>
          </div>
          
        </section>
    )
}

export default Hero