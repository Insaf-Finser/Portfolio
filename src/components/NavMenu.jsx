import gsap from "gsap"
import { SplitText } from "gsap/all"
import { navLinks } from "../../constants"
import { useLayoutEffect, useRef } from "react"
// import { useState } from "react"

gsap.registerPlugin(SplitText)

const NavMenu = () =>{
    //  const [navOpen, setNavOpen] = useState(false)


    const isMenuOpenRef = useRef(false);
    const timelineRef = useRef(null);
    const componentRef = useRef(null);

    useLayoutEffect(()=>{
        let togglerCleanup;
        const ctx = gsap.context(()=>{
            const menu = document.querySelector('#menu');
            const menuBg = document.querySelector('#menu-bg');
            const menuItems = document.querySelectorAll('.menu-item');
            const navToggler = document.querySelector('#nav-toggler');

            if(!menu || !navToggler) return;

            const items = [...menuItems].map((item)=>{
                const index = item.querySelector('.item-index');
                const label = item.querySelector('.item-label');
                const divider = item.querySelector('.item-divider');

                const chars = new SplitText(label,{type:'chars',mask:'chars'}).chars;
                const [firstChar,...trailingChars] = chars;

                const trailingCharbox = document.createElement("span");
                trailingCharbox.className = 'item-body w-0 inline-block whitespace-nowrap overflow-hidden';
                trailingChars.forEach((char)=>
                    trailingCharbox.append(char.parentElement),
                );

                label.after(trailingCharbox);

                const indexWord = new SplitText(index,{type:'words' , mask:'words'}).words;

                gsap.set([indexWord,firstChar],{yPercent:100});
                gsap.set(trailingChars,{xPercent:125});
                gsap.set(trailingCharbox,{width:0});
                
                return { indexWord, firstChar, trailingCharbox, trailingChars, divider};

            });

            function flickertextTo(element,text){
                element.flickerSplit?.revert();
                element.textContent = text;
                element.flickerSplit = new SplitText(element,{type:'chars'});

                gsap.fromTo(
                    element.flickerSplit.chars,
                    {
                        opacity:0,
                    },{
                        opacity:1,
                        duration:0.03,
                        overwrite:true,
                        ease:'power2.inOut',
                        stagger:{
                            amount:0.5,
                            from:'random',  
                        }
                    }
                );

            }

            const tl = gsap.timeline(
                {
                    paused:true,
                    defaults:{
                        ease:'power3.out'
                    }
                }
            )
              .to(menuBg,{opacity:1,duration:1},0);

            timelineRef.current = tl

            const navBar = document.querySelector('#nav');

            const setMenuState = (open) => {
                isMenuOpenRef.current = open;
                navBar.classList.toggle('is-menu-open', open);
                menu.classList.toggle('is-menu-open', open);
                open ? tl.play() : tl.reverse();
                flickertextTo(navToggler, open ? 'Close' : 'Menu');
            };

            const handleToggle = () => {
                setMenuState(!isMenuOpenRef.current);
            };

            navToggler.addEventListener("click", handleToggle);

            // close on link click
            const linkCleanups = [...menuItems].map((item) => {
                const handleLinkClick = () => {
                    if (isMenuOpenRef.current) setMenuState(false);
                };
                item.addEventListener("click", handleLinkClick);
                return () => item.removeEventListener("click", handleLinkClick);
            });
            items.forEach(
                ({indexWord, firstChar, trailingCharbox, trailingChars, divider},i )=>{
                    const startTime = 0.3+i*0.15

                    tl.to([indexWord,firstChar] , {
                        yPercent:0,
                        duration:0.55,
                    },startTime)
                    .to(divider,{scaleY:1,duration:0.75,ease:'power3.out'},startTime+0.03)
                    .to(trailingCharbox,{width:trailingCharbox.scrollWidth,duration:1,ease:'power4.inOut'},startTime+0.15)
                    .to(trailingChars,{xPercent:0,duration:0.75,stagger:0.05},startTime+0.03)

                }
            )

            togglerCleanup = () => {
                navToggler.removeEventListener("click", handleToggle);
                linkCleanups.forEach((cleanup) => cleanup());
            };
        
           

        },componentRef)

        return ()=>{
            togglerCleanup?.(); 
            ctx.revert();
        }
            
    },[]);
    
//   const toggleNav = () => setNavOpen(prev => !prev)
//   const closeNav = () => setNavOpen(false)

    return(
    //     <nav className="fixed inset-x-0 top-0 z-1000 flex items-center justify-between gap-4 px-8 py-4">
    //     <button
    //       className={`relative  z-1002 flex h-10 w-10 flex-col justify-between border-0 opacity-50 hover:opacity-100 bg-none p-2.5 cursor-pointer ${navOpen ? 'active' : ''}`}
    //       onClick={toggleNav}
    //       aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
    //       aria-expanded={navOpen}
    //     >
    //       <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-transform duration-900 ease-in-out ${navOpen ? 'bg-cream translate-y-2.5 rotate-45' : ''}`}/>
    //       <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-opacity duration-900 ease-in-out ${navOpen ? 'opacity-0' : ''}`}/>
    //       <span className={`block h-[3.5px] w-full bg-black bg-text-primary transition-transform duration-900 ease-in-out ${navOpen ? 'bg-cream -translate-y-1.75 -rotate-45' : ''}`}/>
    //     </button>
    //     <ul
    //       className={`navbg hidden fixed inset-0 z-1001 m-0 min-h-screen list-none flex-col items-center justify-start gap-0 overflow-y-auto overflow-x-hidden bg-black/95 p-0 pt-25`}
    //       onClick={(e) => e.target.tagName === 'A' && closeNav()}
    //     >
    //       {navLinks.map((link)=>{
    //         return(
    //           <li className='w-full py-6 text-center'><a className='relative block text-[2.2rem] font-semibold uppercase tracking-wide text-text-secondary no-underline transition-colors duration-300 text-cream/40 hover:text-cream' href={link.href} onClick={closeNav}>{link.name}</a></li>
    //         )
            
    //       })}
    //     </ul>
    //     {navOpen && <div className="fixed inset-0 z-1000 cursor-pointer" onClick={closeNav} />}
    //   </nav>
    
    <div ref={componentRef}>
        <nav id="nav" className="fixed w-full flex  text-accent z-100 justify-end items-end  font-gloria text-[1.25rem] font-semibold p-4 [&.is-menu-open]:text-cream">
            <button id="nav-toggler" className="font-geist p-4">
                Menu
            </button>
        </nav>

        <nav id="menu" className="fixed inset-0  flex flex-col items-start justify-center gap-1 px-32 py-8 text-cream z-90 pointer-events-none  [&.is-menu-open]:pointer-events-auto">
            <div id="menu-bg" 
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl [-webkit-backdrop:blur(40px)] z-[-1] opacity-0"></div>
            {navLinks.map((link,index)=>(
                <a key={index} href={link.href} className="menu-item font-geist text-[clamp(36px,10vw,126px)]  tracking-[-0.01em] leading-tight inline-flex items-center whitespace-nowrap text-inherit cursor-pointer  ">
                    <span className="item-index self-start mt-1 mr-1 text-[0.65rem] font-500">0{index+1}</span>
                    <span className="item-label ">{link.name}</span>
                    <span className="item-divider w-1  h-3/4 mx-5 my-5 bg-cream transform-[rotate(20deg)_scaleY(0)]  origin-center will-change-transform  "></span>
                </a>
            ))}
            
        </nav>
    </div>
        
    
        

    )
}

export default NavMenu