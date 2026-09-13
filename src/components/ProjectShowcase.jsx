import { projects } from "../../constants"

const ProjectShowcase = () =>{
  return(
    <section id="projects" className="flex min-h-screen flex-col items-center justify-start overflow-hidden bg-transparent px-8 py-20">
      <h2 className="mb-12 text-[2rem] tracking-tight text-accent md:text-[3rem]">Featured Projects</h2>
      <div className="relative z-10 w-full max-w-300 grid-cols-1 gap-8 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] flex">
        {projects.map((project, idx) => (
          <div key={idx} className="h-[60vh]  group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-bg-secondary/80 p-8 backdrop-blur-md transition-all duration-400 hover:-translate-y-3 hover:border-accent hover:bg-bg-secondary/90 hover:shadow-[0_30px_60px_rgba(212,175,55,0.15)]">
            <h3 className="relative z-10 mb-2 text-2xl text-accent">{project.title}</h3>
            <p className="relative z-10 mb-6 text-text-secondary">{project.description}</p>
            <div className="relative z-10 flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span key={i} className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-accent transition-all duration-300 hover:border-accent hover:bg-gold/20">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectShowcase