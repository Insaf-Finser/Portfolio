// import { useEffect, useState } from "react"

const Hero = () =>{



//     const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1)

//     useEffect(() => {
//     window.scrollTo(0, 0)
//     const handleScroll = () => {
//       const scrolled = window.scrollY
//       const maxScroll = 300
//       const opacity = Math.max(0, 1 - scrolled / maxScroll)
//       setScrollIndicatorOpacity(opacity)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])


    


    

    return(
        <section id="home" className="relative flex min-h-screen m-auto justify-center">
          {/* <div className="relative z-10 mx-auto flex max-w-[80vw] animate-fade-in-up items-center justify-center gap-8 px-4 text-center ml-5">
            
            
            <div className="relative z-10 mx-auto max-w-225 animate-fade-in-up pb-[4vw] pl-0 pt-[2vh] text-center md:pl-[14vw]">
              <div>
                <span className='mr-2 text-[3.5rem] font-light tracking-wide text-text-secondary' >I'm </span>
                <span className="animate-slide-in-down text-[7.875rem] font-black  text-accent md:text-[4.2rem] font-gasoek ">Insaf Finser</span>
              </div>
              
              <p className="animate-slide-in-up text-[1.2rem] font-light tracking-wide text-text-primary [animation-delay:200ms] mt-0 mb-8">Software Developer</p>
              <p className="mx-auto mb-10 max-w-150 animate-fade-in text-[1.1rem] text-text-secondary [animation-delay:400ms]">Building intelligent apps, immersive experiences, and scalable solutions.</p>
              
            </div>
          </div>
          <div className="absolute bottom-25 left-[0.5%] hidden items-center gap-2 transform-[rotate(-90deg)] transition-opacity duration-200 ease-linear md:flex" style={{ '--scroll-opacity': scrollIndicatorOpacity }}>
            <icon className="text-base text-accent">← </icon>
            <span className="text-[0.86rem] tracking-[2px] text-text-secondary">Scroll Down</span>
          </div> */}

            <div className="absolute inset-0 m-auto bg-hero-div/93 w-[92%] h-[85%] md:h-[80%] sm:w-[88.5%] min-h-[75.8%] py-8 flex flex-col justify-center items-center rounded-[30px] gap-5 overflow-y-auto">
    <div className="w-[90%] sm:w-4/5 flex flex-col text-center items-center justify-center bg-transparent gap-2 m-auto">
        {/* SUBHEADING */}
        <p className="font-geist text-accent/70 text-[clamp(14px,1.2vw,16px)] font-bold">BASED IN UAE</p>

        <div>
            <div className="relative inline-block">
                {/* MAIN HEADING */}
                <h1 className="font-gasoek text-transparent whitespace-nowrap text-[clamp(36px,10vw,126px)] leading-none m-0 [-webkit-text-stroke:1px_rgba(236,239,230,0.5)] md:[-webkit-text-stroke:2px_#ecefe6]"> 
                    Insaf Finser
                </h1>
                
                {/* ARROW IMAGE */}
                <img
                    src="/assets/hero-arrow.png"
                    alt="arrow"
                    className="w-[clamp(32px,5vw,64px)] h-[clamp(32px,5vw,64px)] rotate-[-70.34deg] absolute -right-10 -top-5 sm:-right-15 sm:-top-6 md:-right-25 md:-top-5 opacity-60"
                />
                
                {/* BADGE TEXT */}
                <p className="absolute text-cream text-[clamp(12px,1.5vw,20px)] font-gloria whitespace-nowrap -right-1 -top-10 sm:-top-10 sm:-right-10 md:-top-10 md:-right-15 translate-x-[85%] opacity-60 rotate-33">
                    Open to work
                </p>
            </div>
        </div>

        {/* BIO TITLES */}
        <p className="font-geist text-cream/50 font-light text-[clamp(14px,1.2vw,16px)]">Aspiring Software Developer / Creative</p>
        <p className="font-grotesk text-cream/80 text-[clamp(16px,2vw,30px)] leading-relaxed w-full sm:w-4/5">
            I build things that learn and things that ship — AI models, full-stack apps, and the occasional mobile app in between. Recent CS grad, but I've been shipping to production long before the diploma showed up.
        </p>
    </div>

    {/* TERMINAL WIDGET */}
    <div className="flex justify-center sm:justify-end items-baseline w-full px-7">
        <div className="bg-cream/98 p-2 rounded-2xl w-full sm:w-[55%] md:w-[30%]">
            <img src="/assets/hero-terminal-dot.png" alt="dots" className="pl-0 p-1 w-16 sm:w-auto" />
            <div className="w-full sm:w-4/5">
                <p className="font-geist text-[clamp(10px,1vw,11px)] wrap-break-word"><span className="text-accent">insaf@finser ~ %</span> npm run portfolio --status</p>
                <p className="font-geist text-[clamp(10px,1vw,11px)] wrap-break-word"><span className="text-green-900">✔ System online.</span> Building AI-powered apps, mobile experiences, and full-stack products.</p>
            </div>
        </div>
    </div>
</div>


          
        </section>
    )
}

export default Hero