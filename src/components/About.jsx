import { skills,courses } from "../../constants"

const About=()=>{
    return(
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
    )
}

export default About