import { useState, } from 'react'
import './index.css'
import BackgroundTextMotion from './components/BackgroundTextMotion'
import ProjectShowcase from './components/ProjectShowcase'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'

const App = () => {
  
  const [navOpen, setNavOpen] = useState(false)



  

  const toggleNav = () => setNavOpen(prev => !prev)
  const closeNav = () => setNavOpen(false)

  
  
  

  
  

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
        <Hero/>
        

        {/* About Section */}
        <About/>
        

        {/* Projects Section */}
        <ProjectShowcase/>

        

        {/* Contact Section */}
        <Contact/>
        
      </main>

      <footer>
        <p>&copy; 2026 Insaf Finser. All rights reserved. | Crafted with passion and code.</p>
      </footer>
    </>
  )
}

export default App
