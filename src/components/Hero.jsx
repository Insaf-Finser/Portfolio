import gsap from "gsap"
import { useEffect, useState } from "react"
import { socialLinks } from "../../constants"

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
        <section id="home" className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden bg-transparent px-8 py-20">
          <div className="relative z-10 mx-auto flex max-w-[80vw] animate-fade-in-up items-center justify-center gap-8 px-4 text-center ml-5">
            {/* Placeholder for social media icons or contact links */}
            <div className="flex justify-center gap-2">
              
                <div className="mb-2 mt-2 flex items-center justify-center gap-2">
                  <ul className=" list-none items-center justify-center">
                    {socialLinks.map((link)=>{
                        return(
                            <ul className="group relative flex p-[0.3rem]">
                      <a href={link.link} target="_blank" rel="noopener noreferrer" title={link.name} aria-label={link.name} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-accent no-underline transition-all duration-300 hover:-translate-y-1 hover:rotate-15 hover:border-accent hover:bg-gold/20 hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]">
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
              
              
              
            </div>
            <div className="relative z-10 mx-auto max-w-225 animate-fade-in-up pb-[4vw] pl-0 pt-[2vh] text-center md:pl-[14vw]">
              <div>
                <span className='mr-2 text-[3.5rem] font-light tracking-wide text-text-secondary' >I'm </span>
                <span className="animate-slide-in-down text-[2.5rem] font-black tracking-[-2px] text-accent md:text-[4.2rem]">Insaf Finser</span>
              </div>
              
              <p className="animate-slide-in-up text-[1.2rem] font-light tracking-wide text-text-primary [animation-delay:200ms] mt-0 mb-8">Software Developer</p>
              <p className="mx-auto mb-10 max-w-150 animate-fade-in text-[1.1rem] text-text-secondary [animation-delay:400ms]">Building intelligent apps, immersive experiences, and scalable solutions.</p>
              <div className="flex animate-fade-in flex-col flex-wrap justify-center gap-6 [animation-delay:600ms] md:flex-row">
                <button onClick={handleProjectsClick} className="inline-block w-full cursor-pointer rounded-full border-2 border-accent bg-accent px-10 py-3.5 text-base font-bold tracking-wide text-bg-dark no-underline transition-all duration-300 md:w-auto">
                  View My Work
                </button>

                <button
                  className="inline-block w-full cursor-pointer rounded-full border-2 border-accent bg-transparent px-10 py-3.5 text-base font-bold tracking-wide text-accent no-underline transition-all duration-300 hover:bg-gold/10 hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] md:w-auto"
                  onClick={downloadResume}
                >
                  Download Resume
                </button>
              </div>
            </div>
            <div className="relative left-[10vw] hidden aspect-4/5 w-[min(55vh,40vw)] animate-fade-in-up overflow-hidden rounded-[18px] transition-transform duration-300 [animation-delay:800ms] hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] md:block">
              <img src="https://res.cloudinary.com/dwvzfckyd/image/upload/v1780301606/my_pic_tue4tl.jpg" className='block h-full w-full object-cover' />
            </div>
          </div>
          <div className="absolute bottom-25 left-[0.5%] hidden items-center gap-2 transform-[rotate(-90deg)] transition-opacity duration-200 ease-linear md:flex" style={{ '--scroll-opacity': scrollIndicatorOpacity }}>
            <icon className="text-base text-accent">← </icon>
            <span className="text-[0.86rem] tracking-[2px] text-text-secondary">Scroll Down</span>
          </div>
          
        </section>
    )
}

export default Hero