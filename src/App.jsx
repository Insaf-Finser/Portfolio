import { useState, useEffect } from 'react'
import './index.css'
import BackgroundTextMotion from './components/BackgroundTextMotion'

const App = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
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

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const toggleNav = () => setNavOpen(prev => !prev)
  const closeNav = () => setNavOpen(false)

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with real-time inventory management and seamless checkout experience.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe']
    },
    {
      title: 'Real-Time Chat App',
      description: 'Modern chat application with WebSocket integration, user authentication, and message notifications.',
      tags: ['React', 'Firebase', 'WebSocket', 'Tailwind']
    },
    {
      title: 'Analytics Dashboard',
      description: 'Interactive dashboard displaying real-time data visualization with advanced filtering and reporting.',
      tags: ['Vue.js', 'Chart.js', 'Express', 'PostgreSQL']
    },
    {
      title: 'AI Content Generator',
      description: 'AI-powered content generation tool with NLP integration and customizable templates.',
      tags: ['React', 'Python', 'OpenAI API', 'FastAPI']
    }
  ]

  const skills = ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase', 'Docker', 'AWS', 'GraphQL', 'REST API', 'Tailwind CSS', 'Next.js', 'Python']

  
  

  return (
    <>
      <BackgroundTextMotion/>

      <nav className="navbar">
        <button
          className={`nav-toggle ${navOpen ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={`nav-links ${navOpen ? 'open' : ''}`}
          onClick={(e) => e.target.tagName === 'A' && closeNav()}
        >
          <li><a href="#home" onClick={closeNav}>Home</a></li>
          <li><a href="#about" onClick={closeNav}>About</a></li>
          <li><a href="#projects" onClick={closeNav}>Projects</a></li>
          <li><a href="#skills" onClick={closeNav}>Skills</a></li>
          <li><a href="#contact" onClick={closeNav}>Contact</a></li>
        </ul>
        {navOpen && <div className="menu-overlay" onClick={closeNav} />}
      </nav>

      <main>
        {/* Hero Section */}
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
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" aria-label="Twitter">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-10 5.5"/>
                        </svg>
                      </a>
                      <span style={{ marginLeft: '0' }}>Twitter</span>
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
                      <a href="./src/assets/Resume.pdf" target="_blank" rel="noopener noreferrer" title="Resume" aria-label="Resume">
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
                <button>View My Work</button>
                <button className="secondary">Get In Touch</button>
              </div>
            </div>
            <div className="hero-image-container">
              <img src="./src/assets/mypic.jpg" className='hero-image' />
            </div>
          </div>
          <div className="scroll-down-indicator" style={{ '--scroll-opacity': scrollIndicatorOpacity }}>
            <icon className="scroll-left">← </icon>
            <span className="scroll-down-text">Scroll Down</span>
          </div>
          
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="about-content">
            <h2>About Me</h2>
           
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, idx) => (
              <div key={idx} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills">
          <h2>Skills & Technologies</h2>
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-item">
                {skill}
              </div>
            ))}
          </div>
        </section>

        

        {/* Contact Section */}
        <section id="contact" className="contact">
          <h2>Let's Connect</h2>
          <p style={{ marginBottom: '2rem', color: '#a0aec0' }}>Have a project in mind? Let's discuss how we can create something great together.</p>
          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
            {submitted && <p style={{ color: '#06b6d4', marginTop: '1rem', fontWeight: 600 }}>✓ Message sent successfully! I'll get back to you soon.</p>}
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Insaf Finser. All rights reserved. | Crafted with passion and code.</p>
      </footer>
    </>
  )
}

export default App
