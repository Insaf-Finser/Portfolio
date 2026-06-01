import { useState, useEffect } from 'react'
import './index.css'
import BackgroundTextMotion from './components/BackgroundTextMotion'
import gsap from 'gsap'
import emailjs from '@emailjs/browser'

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


const handleFormSubmit = async (e) => {
  e.preventDefault()

  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'insaffinser@gmail.com'
    }

    await emailjs.send(
      'service_twdhslq',
      'template_p4ang6o',
      templateParams,
      '_-Jjujg3TZi-lHVXt'
    )

    setSubmitted(true)

    setFormData({
      name: '',
      email: '',
      message: ''
    })

    setTimeout(() => {
      setSubmitted(false)
    }, 3000)

  } catch (error) {
    console.error(error)
    alert('Failed to send message')
  }
}

  const toggleNav = () => setNavOpen(prev => !prev)
  const closeNav = () => setNavOpen(false)

  const projects = [
  {
    title: 'Questora',
    description:
      'An AI-powered interactive storytelling platform where user choices dynamically shape the narrative, creating unique adventures with generated story paths and immersive experiences.',
    tags: ['Flutter', 'Node.js', 'MongoDB', 'AI APIs']
  },
  {
    title: 'Hidden Spots',
    description:
      'A location-based community platform for discovering meaningful hidden places through stories, ratings, maps, and user-generated experiences.',
    tags: ['React Native', 'MongoDB', 'Maps API', 'Node.js']
  },
  {
    title: 'Secure Messaging App',
    description:
      'A decentralized offline messaging application using Bluetooth mesh networking and hybrid RSA-AES encryption for secure communication without internet access.',
    tags: ['Flutter', 'Dart', 'RSA', 'AES']
  },
  {
    title: 'Elegance',
    description:
      'A modern tailoring service platform that enables online bookings, custom measurements, order tracking, and seamless customer-tailor interactions.',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB']
  },
  {
    title: 'OMR Sheet Reader',
    description:
      'An AI-powered Optical Mark Recognition system that automatically detects, analyzes, and evaluates marked answer sheets from uploaded images using computer vision techniques.',
    tags: ['Python', 'OpenCV', 'Computer Vision', 'React'],
    theme: '#ef4444',
    visual: 'scanner'
  },
  {
    title: 'GitHub Repo Scanner & README Generator',
    description:
      'A developer productivity tool that analyzes GitHub repositories and automatically generates professional README files with project insights and documentation.',
    tags: ['React', 'TypeScript', 'GitHub API', 'AI']
  }
];

  const skills = ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'AWS', 'GraphQL', 'REST API', 'Tailwind CSS', 'Next.js', 'Python']

  const courses = ['DSA', 'AI', 'ML', 'Web Development', 'DBMS']
  
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
                      <a
  href="https://instagram.com"
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
                      <a href="https://res.cloudinary.com/dwvzfckyd/image/upload/v1780302192/Insaf_Finser_Resume_CS_qjhqfy.jpg" target="_blank" rel="noopener noreferrer" title="Resume" aria-label="Resume">
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

        {/* About Section */}
        <section id="about" className="about">
          <div className="about-content" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" style={{display:'flex'}}>
            <img src="https://res.cloudinary.com/dwvzfckyd/image/upload/v1780301941/GradPic_va6lgz.jpg" alt="Background" className="about-background" />
            <div>
              <h2>About Me</h2>
              <p>I’m a passionate Full-Stack Developer and AI enthusiast focused on building intelligent, interactive, and user-centered digital experiences. I specialize in React, Flutter, Node.js, and Python, with experience creating AI-powered applications, secure communication systems, and immersive web platforms. I enjoy transforming complex ideas into clean, scalable, and visually engaging products that solve real-world problems.
              </p>
            </div>
            
          </div>
          <div className="ab" style={{display:'flex' , gap:'0' , marginRight:'0'}}>
            <div className="about-education">
              <h2 style={{padding:'0',margin:'0',paddingLeft:'20px',paddingBottom:'20px'}}>Education</h2>
              <p style={{marginBottom:'1rem'}}><span style={{color:'#eee3c0', fontSize:'1.8rem'}}>BTech in Computer Science and Engineering,</span> <br></br><span style={{paddingLeft:'20px'}}>Amal Jyothi College of Engineering, Kottayam, Kerala</span><br></br><span style={{paddingLeft:'20px' , fontWeight:'800' ,color:'#b5ae9e'}}>(2022-2026)</span>  </p>
              <p>Relevant Coursework: </p>
              <div className="skills-grid" style={{gap:'0.6rem',margin:'30px',marginRight:'10px', marginTop:'0',alignItems:'start', maxWidth:'32vw'}}>
                {courses.map((course, idx) => (
                  <div key={idx} className="skill-item" style={{fontSize:'0.9rem' , padding:'1rem 1rem' ,maxWidth:'300px' ,maxHeight:'50px',gap:'0.5rem',margin:'0' ,display:'flex',alignItems:'center'}}>
                    {course}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="about-skills" >
              <h2 style={{padding:'0',margin:'0',paddingLeft:'20px',paddingBottom:'20px'}}>Skills</h2>
            <div className="skills-grid">
              {skills.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  {skill}
                </div>
              ))}
            </div>
            
            </div>
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
