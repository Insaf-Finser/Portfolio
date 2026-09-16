import './index.css'
import BackgroundTextMotion from './components/BackgroundTextMotion'
import ProjectShowcase from './components/ProjectShowcase'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import NavMenu from './components/NavMenu'


const App = () => {
  
 

  return (
    <>
      <BackgroundTextMotion/>

      <NavMenu/>

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

      
    </>
  )
}

export default App
