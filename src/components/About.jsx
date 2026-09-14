import { skills,courses } from "../../constants"

const About=()=>{
    return(
        <section id="about" className="flex min-h-screen flex-col items-center justify-start overflow-hidden px-8 py-20 bg-cream-alt ">
          <div className="relative z-10 flex max-w-[90vw] flex-col items-center rounded-[25px] border border-accent text-center md:max-w-[81vw] md:max-h-[70vh] md:flex-row" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" >
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
          </div>
          
        </section>
    )
}

export default About