// import { useState } from "react"
// import emailjs from '@emailjs/browser'


const Contact = () =>{

    
}

export default Contact


// const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    // const [submitted, setSubmitted] = useState(false)

    // const handleFormChange = (e) => {
    //     const { name, value } = e.target
    //     setFormData(prev => ({ ...prev, [name]: value }))
    // }


    // const handleFormSubmit = async (e) => {
    // e.preventDefault()

    // try {
    //     const templateParams = {
    //     from_name: formData.name,
    //     from_email: formData.email,
    //     message: formData.message,
    //     to_email: 'insaffinser@gmail.com'
    //     }

    //     await emailjs.send(
    //     'service_twdhslq',
    //     'template_p4ang6o',
    //     templateParams,
    //     '_-Jjujg3TZi-lHVXt'
    //     )

    //     setSubmitted(true)

    //     setFormData({
    //     name: '',
    //     email: '',
    //     message: ''
    //     })

    //     setTimeout(() => {
    //     setSubmitted(false)
    //     }, 3000)

    // } catch (error) {
    //     console.error(error)
    //     alert('Failed to send message')
    // }
    // }

    // return(
    //     <section id="contact" className="flex min-h-screen flex-col items-center justify-start overflow-hidden bg-transparent px-8 py-20">

    //     <div className="relative w-full  pb-3 flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-neutral-500">
    //                 <span className="font-semibold text-neutral-800">03</span>
    //                 <div className="w-6 h-px bg-neutral-400"></div>
    //                 <span>Get In Touch</span>
    //     </div>

    //       <h2 className="mb-8 text-[2rem] tracking-tight text-accent md:text-[3rem]">Let's Connect</h2>
    //       <p className="mb-8 text-[#a0aec0]" style={{ marginBottom: '2rem', color: '#a0aec0' }}>Have a project in mind? Let's discuss how we can create something great together.</p>
    //       <form className="relative z-10 w-full max-w-150" onSubmit={handleFormSubmit}>
    //         <div className="mb-6">
    //           <label className="mb-2 block font-semibold text-text-primary" htmlFor="name">Name</label>
    //           <input
    //             className="w-full rounded-lg border border-gold/20 bg-bg-secondary/50 p-3.5 font-sans text-base text-text-primary backdrop-blur-sm transition-all duration-300 placeholder:text-text-secondary focus:border-accent focus:bg-bg-secondary/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] focus:outline-none"
    //             type="text"
    //             id="name"
    //             name="name"
    //             value={formData.name}
    //             onChange={handleFormChange}
    //             placeholder="Your name"
    //             required
    //           />
    //         </div>
    //         <div className="mb-6">
    //           <label className="mb-2 block font-semibold text-text-primary" htmlFor="email">Email</label>
    //           <input
    //             className="w-full rounded-lg border border-gold/20 bg-bg-secondary/50 p-3.5 font-sans text-base text-text-primary backdrop-blur-sm transition-all duration-300 placeholder:text-text-secondary focus:border-accent focus:bg-bg-secondary/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] focus:outline-none"
    //             type="email"
    //             id="email"
    //             name="email"
    //             value={formData.email}
    //             onChange={handleFormChange}
    //             placeholder="your@email.com"
    //             required
    //           />
    //         </div>
    //         <div className="mb-6">
    //           <label className="mb-2 block font-semibold text-text-primary" htmlFor="message">Message</label>
    //           <textarea
    //             className="w-full rounded-lg border border-gold/20 bg-bg-secondary/50 p-3.5 font-sans text-base text-text-primary backdrop-blur-sm transition-all duration-300 placeholder:text-text-secondary focus:border-accent focus:bg-bg-secondary/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] focus:outline-none min-h-35 resize-y"
    //             id="message"
    //             name="message"
    //             value={formData.message}
    //             onChange={handleFormChange}
    //             placeholder="Tell me about your project..."
    //             required
    //           ></textarea>
    //         </div>
    //         <button className="inline-block w-full cursor-pointer rounded-full border-2 border-accent bg-accent px-10 py-3.5 text-base font-bold tracking-wide text-bg-dark no-underline transition-all duration-300 md:w-auto" type="submit">Send Message</button>
    //         {submitted && <p className="mt-4 font-semibold text-[#06b6d4]" style={{ color: '#06b6d4', marginTop: '1rem', fontWeight: 600 }}>✓ Message sent successfully! I'll get back to you soon.</p>}
    //       </form>
          
    //     </section>
    // )