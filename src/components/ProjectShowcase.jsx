import { projects } from "../../constants"

const ProjectShowcase = () =>{
  return(
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
  )
}

export default ProjectShowcase