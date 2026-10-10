    import gsap from "gsap";
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { SplitText } from 'gsap/SplitText';    
    import { useLayoutEffect, useRef } from "react";


    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);

    const About=()=>{

        const sectionRef = useRef(null)

        useLayoutEffect(() => {
            const section = sectionRef.current;
            const mm = gsap.matchMedia();
            const splitTextInstances = [];
            const ctx = gsap.context(() => {

            const mainpic = section?.querySelector('#mainpic');
            const gradpic = section?.querySelector('#gradpic');
            const aboutText = section?.querySelectorAll('.about-text');
            const eduText = section?.querySelector('.edu-text');
            const aboutH = section?.querySelector(".about-h");
            const aboutP = section?.querySelector(".about-p");
            const eduH = section?.querySelector(".edu-h");
            const eduP = section?.querySelector(".edu-p");

            if (!section || !mainpic || !gradpic || !aboutText || !eduText || !aboutH || !aboutP || !eduH || !eduP) {
                    console.warn('About animation: missing target element(s)', { mainpic, gradpic, aboutText, eduText });
                    return;
                }

            const h_abt_split = new SplitText(aboutH,{type:'words',aria: 'none'});
            const p_abt_split = new SplitText(aboutP,{type:'words',aria: 'none'});
            const h_edu_split = new SplitText(eduH,{type:'words',aria: 'none'});
            const p_edu_split = new SplitText(eduP,{type:'words',aria: 'none'});
            splitTextInstances.push(h_abt_split, p_abt_split, h_edu_split, p_edu_split);

            gsap.set([mainpic, gradpic], { force3D: true });

            const getTravelX = () => {
                const aX = Number(gsap.getProperty(mainpic, 'x')) || 0;
                const bX = Number(gsap.getProperty(gradpic, 'x')) || 0;
                return (gradpic.getBoundingClientRect().left - bX) - (mainpic.getBoundingClientRect().left - aX);
            };
            gsap.set(gradpic,getTravelX)

            const scrub = 1.2;
            gsap.set(h_abt_split.words, { opacity: 0, y: 32 });
            gsap.set(p_abt_split.words, { opacity: 0.1 });

            mm.add({
                isMobile: '(max-width: 767px)',
                isDesktop: '(min-width: 768px)',
            }, (context) => {
                const { isMobile } = context.conditions;

                const intro = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: section,
                        start: isMobile ? 'top 25%' : 'top 50%',
                        end: 'top top',
                        
                        invalidateOnRefresh: true,
                    },
                })
                const intro1 = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: section,
                        start: isMobile ? 'top 25%' : 'top 50%',
                        end: 'top top',
                        scrub,
                        invalidateOnRefresh: true,
                    },
                })
                if (!isMobile) {
                    intro1.from(mainpic, { opacity: 0, xPercent: -100 }, 0);
                }
                intro
                .fromTo(h_abt_split.words,
                    { opacity: 0, y: 32 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: { amount: 0.4 }, immediateRender: true },
                    0);
                intro1.fromTo(p_abt_split.words,
                    { opacity: 0.1, y: isMobile ? 12 : 0 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: { amount: 0.8 }, immediateRender: true },
                    0);
                if (isMobile) return;

                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => `+=${Math.round(window.innerHeight * 2)}`,
                        pin: true,
                        pinSpacing: true,
                        anticipatePin: 1,
                        scrub,
                        invalidateOnRefresh: true,
                    },
                });

                tl.to({}, { duration: 0.12 })
                    .to(aboutText, { opacity: 0, x: 20, duration: 0.3 }, 'one')
                    .to(mainpic, { x: () => getTravelX(), opacity: 0, duration: 0.5 }, 'one')
                    .fromTo(
                        gradpic,
                        { x: () => -getTravelX() },
                        { x: 0, opacity: 1, duration: 0.5, immediateRender: false },
                        'one'
                    )
                    .to(eduText, { opacity: 1, duration: 0.5 }, 'one+=0.1')
                    .to({}, { duration: 0.12 });
            });
                
            }, sectionRef);

            const refresh = () => ScrollTrigger.refresh();
            const images = section?.querySelectorAll('img') ?? [];
            images.forEach((img) => {
                if (!img.complete) img.addEventListener('load', refresh, { once: true });
            });
            document.fonts?.ready?.then(refresh);

            return () => {
                images.forEach((img) => img.removeEventListener('load', refresh));
                mm.revert();
                ctx.revert();
                splitTextInstances.forEach((split) => split.revert());
            };
        }, []);

        return(
            <section ref={sectionRef} id="about" className="relative flex min-h-dvh w-full h-full flex-col items-center justify-start overflow-x-hidden px-4 py-20 bg-cream-alt gap-20 sm:px-6 md:px-8">
            

                <div className="relative w-full  pb-3 flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-neutral-500">
                    <span className="font-semibold text-neutral-800">01</span>
                    <div className="w-6 h-px bg-neutral-400"></div>
                    <span>About & Practice</span>
                </div>
                <div className="relative isolate flex w-full flex-col gap-12 md:block md:h-[calc(100dvh-8rem)]">
                    <div className="about-panel relative flex w-full flex-col items-center justify-center gap-8 py-0 font-grotesk text-black md:absolute md:inset-0 md:flex-row md:items-start md:gap-10 md:px-6 lg:gap-20 lg:px-20">
                        <img src="/assets/my-pic.png" alt="my pic" id="mainpic" loading="lazy" decoding="async" className="relative z-20 order-1 h-60 w-48 shrink-0 object-cover will-change-transform md:order-none md:h-80 md:w-64 lg:h-125 lg:w-100"/>
                        <div className="about-text relative z-0 order-2 flex h-full min-w-0 w-full flex-1 flex-col self-start gap-4.5 text-left md:order-none md:w-auto">
                            <h2 className="about-h text-[clamp(36px,10vw,98px)] m-0 font-interserif">About Me</h2>
                            <p className="about-p text-[clamp(16px,4vw,20px)] md:text-[clamp(20px,2vw,30px)] text-black text-justify ">I'm a passionate Full-Stack Developer and AI enthusiast focused on building intelligent, interactive, and user-centered digital experiences. I specialize in React, Flutter, Node.js, and Python, with experience creating AI-powered applications, secure communication systems, and immersive web platforms. I enjoy transforming complex ideas into clean, scalable, and visually engaging products that solve real-world problems.</p>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-between gap-8 py-0 font-grotesk text-black md:absolute md:inset-0 md:flex-row md:items-start md:gap-10 md:py-10 md:pt-0 md:px-6 lg:gap-20 lg:px-20">
                        <img
                                id="gradpic"
                                src="/assets/GradPic.jpeg"
                                alt="graduation photo"
                                loading="lazy"
                                decoding="async"
                                className="relative -z-20 order-1 h-60 w-48 shrink-0 object-cover will-change-transform md:order-2 md:h-80 md:w-64 md:opacity-0 lg:h-125 lg:w-100"
                            />
                        <div className="edu-text relative z-0 order-2 flex h-full min-w-0 w-full flex-1 flex-col self-start gap-4.5 text-left md:order-1 md:w-auto md:opacity-0">
                            <h2 className="edu-h text-[clamp(36px,10vw,98px)] m-0 font-interserif">Education</h2>
                            <p className="edu-p text-[clamp(16px,4vw,20px)] md:text-[clamp(20px,2vw,30px)] text-black/60 leading-snug md:p-10 font-geist">
                                <span className="block text-black/90 ">BTech in Computer Science and Engineering</span>
                                <span className="block">Amal Jyothi College of Engineering, </span><span className="block">Kottayam, Kerala, India.</span>
                                <span className="block font-medium  ">2022 – 2026</span>
                            </p>
                        </div>
                        
                    </div>
                </div>

            </section>
        )
    }

    export default About
