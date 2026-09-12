import { useState } from "react"
import emailjs from '@emailjs/browser'


const Contact = () =>{

    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }


    const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
        const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'insaffinser@gmail.com'
        }

        await emailjs.send(
        'service_twdhslq',
        'template_p4ang6o',
        templateParams,
        '_-Jjujg3TZi-lHVXt'
        )

        setSubmitted(true)

        setFormData({
        name: '',
        email: '',
        message: ''
        })

        setTimeout(() => {
        setSubmitted(false)
        }, 3000)

    } catch (error) {
        console.error(error)
        alert('Failed to send message')
    }
    }

    return(
        <section id="contact" className="contact">
          <h2>Let's Connect</h2>
          <p style={{ marginBottom: '2rem', color: '#a0aec0' }}>Have a project in mind? Let's discuss how we can create something great together.</p>
          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
            {submitted && <p style={{ color: '#06b6d4', marginTop: '1rem', fontWeight: 600 }}>✓ Message sent successfully! I'll get back to you soon.</p>}
          </form>
        </section>
    )
}

export default Contact