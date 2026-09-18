    import gsap from "gsap";
    import { ScrollTrigger,SplitText } from "gsap/all";
    import { useLayoutEffect, useRef } from "react";
    import { useMediaQuery } from "react-responsive"


    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);

    const About=()=>{

        const isMobile = useMediaQuery({maxWidth:767});

        const sectionRef = useRef(null)

        useLayoutEffect(() => {
            const ctx = gsap.context(() => {

                const startsec = isMobile ? '15% top':'top top';
            
            const section = sectionRef.current;

            const mainpic = section?.querySelector('#mainpic');
            const gradpic = section?.querySelector('#gradpic');
            const aboutText = section?.querySelectorAll('.about-text');
            const eduText = section?.querySelector('.edu-text');
            const aboutH = section?.querySelector(".about-h");
            const aboutP = section?.querySelector(".about-p");
            const eduH = section?.querySelector(".edu-h");
            const eduP = section?.querySelector(".edu-p");

                    
            const h_abt_split = new SplitText(aboutH,{type:'words'});
            const p_abt_split = new SplitText(aboutP,{type:'words'});
            if (!section || !mainpic || !gradpic || !aboutText || !eduText || !aboutH || !aboutP || !eduH || !eduP) {
                    console.warn('About animation: missing target element(s)', { mainpic, gradpic, aboutText, eduText });
                    return;
                }

            // const h_edu_split = new SplitText(eduH, { type: 'chars' });
            // const p_edu_split = new SplitText(eduP, { type: 'words' });
            // gsap.set([...h_edu_split.chars, ...p_edu_split.words], { opacity: 0 });

                // distance from mainpic's resting position to gradpic's resting position
                const startBox = mainpic.getBoundingClientRect();
                const endBox = gradpic.getBoundingClientRect();
                const travelX = endBox.left - startBox.left;

                gsap.timeline({scrollTrigger:{
                    trigger:section,
                    start:isMobile ? 'top 20%':'top 50%',
                    end:'top top',
                    scrub:true,

                }}).from(mainpic, {opacity:0, xPercent:-100, duration: 6 },isMobile?0:'')
                    .from(h_abt_split.words,{opacity:0,y:40,duration:2,stagger:2},0)
                    .from(p_abt_split.words,{opacity:0.2,duration:3,stagger:0.15},0);

                
                const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } ,scrollTrigger:{
                trigger: section,
                    start: startsec,
                    end: '+=200%',
                    pin: true,
                    scrub: true,
                    delay:1
                }});
                tl
                .to(section,{duration:0.15})
                .to(aboutText, { opacity: 0,x: 20, duration: 0.3 },'one')
                .to(mainpic, { x: travelX, duration: 0.5 ,opacity:0},'one')
                .fromTo(gradpic, { x: -travelX }, { x: 0, opacity: 1, duration: 0.5}, 'one')
                .to(eduText, { opacity: 1, duration: 0.5,}, 'one+=0.1')
                .to(section,{duration:0.15});
                
            }, sectionRef);

            return () => ctx.revert();
        }, [isMobile]);

        return(
            <section ref={sectionRef} id="about" className="relative flex min-h-screen w-full h-full flex-col items-center justify-start overflow-hidden px-8 py-20 bg-cream-alt gap-20">
            

                <div className="relative w-full  pb-3 flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-neutral-500">
                    <span className="font-semibold text-neutral-800">01</span>
                    <div className="w-6 h-px bg-neutral-400"></div>
                    <span>About & Practice</span>
                </div>
                <div className="relative w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
                    <div className="about-panel absolute inset-0 flex flex-col md:flex-row items-center md:items-start justify-center gap-20 py-0 md:px-20 font-grotesk text-black opacity-100">
                        <img src="/assets/my-pic.png" alt="my pic" id="mainpic" className="w-48 h-60 z-10 md:w-100 md:h-125 object-cover shrink-0"/>
                        <div className="about-text flex flex-col self-start text-left gap-4.5 h-full  ">
                            <h1 className="about-h text-[clamp(36px,10vw,98px)] m-0 font-interserif">About Me</h1>
                            <p className="about-p text-[clamp(20px,2vw,30px)] text-black text-justify ">I'm a passionate Full-Stack Developer and AI enthusiast focused on building intelligent, interactive, and user-centered digital experiences. I specialize in React, Flutter, Node.js, and Python, with experience creating AI-powered applications, secure communication systems, and immersive web platforms. I enjoy transforming complex ideas into clean, scalable, and visually engaging products that solve real-world problems.</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-start  justify-between  gap-20 py-10 pt-0    md:px-20 font-grotesk text-black ">
                        <img
                                id="gradpic"
                                src="/assets/GradPic.jpeg"
                                alt="graduation photo"
                                className="order-1 md:order-2 w-48 h-60 z-10 md:w-100 md:h-125 object-cover shrink-0 opacity-0"
                            />
                        <div className="edu-text order-2 md:order-1 flex flex-col  self-start text-left gap-4.5 h-full opacity-0 ">
                            <h1 className="edu-h text-[clamp(36px,10vw,98px)] m-0 font-interserif">Education</h1>
                            <p className="edu-p text-[clamp(20px,2vw,30px)] text-black/60 leading-snug md:p-10 font-geist">
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





    {/* <div className="relative z-10 flex max-w-[90vw] flex-col items-center rounded-[25px] border border-accent text-center md:max-w-[81vw] md:max-h-[70vh] md:flex-row" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" >
                <img src="https://res.cloudinary.com/dwvzfckyd/image/upload/v1780301941/GradPic_va6lgz.jpg" alt="Background" className="relative -z-10 h-full w-55 object-fill p-10 pr-0" />
                <div>
                <h2 className="mt-8 pb-0 pl-10 text-left text-[2rem] tracking-tight text-accent md:text-[3rem]">About Me</h2>
                <p className="mb-6 px-10 pt-0 text-justify text-[1.15rem] leading-[1.8] text-text-secondary">I’m a passionate Full-Stack Developer and AI enthusiast focused on building intelligent, interactive, and user-centered digital experiences. I specialize in React, Flutter, Node.js, and Python, with experience creating AI-powered applications, secure communication systems, and immersive web platforms. I enjoy transforming complex ideas into clean, scalable, and visually engaging products that solve real-world problems.
                </p>
                </div>
                
            </div>
            <div className="mt-10 flex gap-2   flex-col items-center justify-center  text-left lg:flex-row lg:items-start" >
                <div className="w-[85vw] rounded-[25px] border border-accent text-left md:w-[40vw]  p-8">
                <h2 className="pb-5 pl-5 pt-5 text-2xl text-accent" >Education</h2>
                <p className="mb-4 px-5"><span className="text-[1.8rem] text-accent">BTech in Computer Science and Engineering,</span> <br></br><span className="pl-5 text-text-secondary">Amal Jyothi College of Engineering, Kottayam, Kerala</span><br></br><span className="pl-5 font-extrabold text-[#b5ae9e]">(2022-2026)</span>  </p>
                <p className="px-5 text-text-secondary">Relevant Coursework: </p>
                <div className="m-6 mr-2.5 mt-0 grid max-w-full grid-cols-2 items-start gap-2.5 pb-6 sm:grid-cols-3" >
                    {courses.map((course, idx) => (
                    <div key={idx} className="flex max-h-12.5 max-w-75 items-center gap-2 rounded-xl border border-gold/20 bg-bg-secondary/60 px-4 py-2 text-center text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)]">
                        {course}
                    </div>
                    ))}
                </div>
                </div>
                
                <div className="w-[85vw] max-h-fit rounded-[25px] border border-accent p-8 md:w-[40vw] md:max-h-[70vh]" >
                <h2 className="pb-5 pl-5 text-2xl text-accent">Skills</h2>
                <div className="grid w-full max-w-225 grid-cols-2 gap-4 sm:grid-cols-3">
                {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-center rounded-xl border border-gold/20 bg-bg-secondary/60 px-2 py-2 text-center font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-bg-secondary/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)]">
                    {skill}
                    </div>
                ))}
                </div>
                
                </div>
            </div> */}