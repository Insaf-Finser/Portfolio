import { useState, } from 'react'
import './index.css'
import BackgroundTextMotion from './components/BackgroundTextMotion'
import ProjectShowcase from './components/ProjectShowcase'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import { navLinks, socialLinks } from '../constants'

const App = () => {
  
  const [navOpen, setNavOpen] = useState(false)



  

  const toggleNav = () => setNavOpen(prev => !prev)
  const closeNav = () => setNavOpen(false)

  
  
  

  
  

  return (
    <>
      <BackgroundTextMotion/>

      <nav className="fixed inset-x-0 top-0 z-1000 flex items-center justify-between gap-4 px-8 py-4">
        <button
          className={`relative  z-1002 flex h-10 w-10 flex-col justify-between border-0 bg-none p-2.5 cursor-pointer ${navOpen ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
        >
          <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-transform duration-300 ease-in-out ${navOpen ? 'bg-cream translate-y-2.5 rotate-45' : ''}`}/>
          <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-opacity duration-300 ease-in-out ${navOpen ? 'opacity-0' : ''}`}/>
          <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-transform duration-300 ease-in-out ${navOpen ? 'bg-cream -translate-y-1.75 -rotate-45' : ''}`}/>
        </button>
        <ul
          className={`${navOpen ? 'flex' : 'hidden'} fixed inset-0 z-1001 m-0 min-h-screen list-none flex-col items-center justify-start gap-0 overflow-y-auto overflow-x-hidden bg-black/95 p-0 pt-25`}
          onClick={(e) => e.target.tagName === 'A' && closeNav()}
        >
          {navLinks.map((link)=>{
            return(
              <li className='w-full py-6 text-center'><a className='relative block text-[2.2rem] font-semibold uppercase tracking-wide text-text-secondary no-underline transition-colors duration-300 text-cream/40 hover:text-cream' href={link.href} onClick={closeNav}>{link.name}</a></li>
            )
            
          })}
        </ul>
        {navOpen && <div className="fixed inset-0 z-1000 cursor-pointer" onClick={closeNav} />}
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

      <footer className='border-t border-black/20 bg-cream/30 px-8 py-4 text-center text-text-secondary'>
        <p className='mx-auto flex max-w-300 flex-col items-center gap-6'>&copy; 2026 Insaf Finser. All rights reserved. | Crafted with passion and code.</p>
        <div className="mb-2 mt-2 flex items-center justify-center gap-2">
                  <ul className=" list-none items-center justify-center flex">
                    {socialLinks.map((link)=>{
                        return(
                            <ul className="group relative flex p-[0.3rem]">
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
    </>
  )
}

export default App
