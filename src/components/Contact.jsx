import { lazy, Suspense, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useMediaQuery } from 'react-responsive'
import { socialLinks } from '../../constants'

const DeskScene = lazy(() => import('./contact/DeskScene'))

const inputClass =
  'w-full rounded-xl border border-accent/25 bg-cream px-3.5 py-3 font-geist text-sm text-ink placeholder:text-muted transition-shadow duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

const Contact = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const reducedMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' })

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [formFocused, setFormFocused] = useState(false)
  const [screenDelivered, setScreenDelivered] = useState(false)
  const nameRef = useRef(null)

  const focusForm = () => {
    nameRef.current?.focus()
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    try {
      await emailjs.send(
        'service_twdhslq',
        'template_p4ang6o',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'insaffinser@gmail.com',
        },
        '_-Jjujg3TZi-lHVXt',
      )

      setSubmitted(true)
      setMessageSent(true)
      setScreenDelivered(false)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => {
        setSubmitted(false)
        setScreenDelivered(false)
      }, 4200)
    } catch (err) {
      console.error(err)
      setError('Could not send just now — try email instead.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="flex min-h-screen w-full flex-col items-center justify-start bg-cream px-4 pt-16 sm:px-6 md:px-8 md:pt-20"
    >
      <div className="relative mb-8 flex w-full items-center gap-3 pb-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
        <span className="font-semibold text-neutral-800">03</span>
        <div className="h-px w-6 bg-neutral-400" />
        <span>Get In Touch</span>
      </div>

      <div className="mb-8 flex w-full flex-col gap-3 md:mb-10">
        <h2 className="m-0 font-interserif text-[clamp(36px,8vw,64px)] leading-none text-ink">
          Let&apos;s Connect
        </h2>
        <div className="flex max-w-xl flex-col gap-2 font-geist text-[clamp(14px,1.4vw,16px)] text-muted">
          <p>Have a project in mind? Share a few details and I&apos;ll get back to you.</p>
          
          <p className="text-sm">Hover the desk — click the laptop or envelope to explore.</p>
        </div>
      </div>

      <div className="grid w-full max-w-350 grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <form
          className="relative z-10 flex w-full min-w-0 flex-col justify-center rounded-[30px] bg-cream-alt p-6 shadow-[0_20px_60px_rgba(24,24,23,0.08)] md:p-8"
          onSubmit={handleFormSubmit}
          onFocus={() => setFormFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFormFocused(false)
          }}
        >
            {messageSent ? (
              <div className="flex flex-col items-start gap-4" role="status" aria-live="polite">
                <div>
                  <h3 className="font-interserif text-3xl text-ink">Thanks for reaching out!</h3>
                  <p className="mt-2 font-geist text-sm text-muted">
                    Your message is on its way. I aim to reply within two business days.
                  </p>
                </div>
                <button
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border-2 border-accent px-8 py-3.5 font-geist text-sm font-semibold tracking-wide text-ink transition-colors duration-200 hover:bg-accent/10 md:w-auto"
                  type="button"
                  onClick={() => {
                    setMessageSent(false)
                    setSubmitted(false)
                    setScreenDelivered(false)
                    setError('')
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <label className="mb-5 block">
                  <span className="mb-2 block font-geist text-xs uppercase tracking-widest text-muted">Name</span>
                  <input
                    className={inputClass}
                    type="text"
                    id="name"
                    name="name"
                    ref={nameRef}
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </label>

                <label className="mb-5 block">
                  <span className="mb-2 block font-geist text-xs uppercase tracking-widest text-muted">Email</span>
                  <input
                    className={inputClass}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="mb-6 block">
                  <span className="mb-2 block font-geist text-xs uppercase tracking-widest text-muted">Message</span>
                  <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell me about your project..."
                    required
                  />
                </label>

                <button
                  className="inline-flex w-full cursor-pointer items-center justify-center self-stretch rounded-full border-2 border-accent bg-accent px-10 py-3.5 font-geist text-sm font-semibold tracking-wide text-cream transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60 md:w-auto md:self-start"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </>
            )}
            {error && <p className="mt-4 font-geist text-sm text-red-800">{error}</p>}
        </form>
        <div className="relative h-80 w-full min-w-0 overflow-hidden rounded-[30px] bg-hero-div shadow-2xl sm:h-105 md:h-[min(560px,70vh)]">
          <Suspense fallback={<div className="h-full w-full bg-[#141412]" />}>
            <DeskScene
              formData={formData}
              submitted={submitted}
              screenSubmitted={screenDelivered}
              sending={sending}
              orbitEnabled={!isMobile && !formFocused && !reducedMotion}
              reducedMotion={reducedMotion}
              onDelivered={() => setScreenDelivered(true)}
              onFocusForm={focusForm}
            />
          </Suspense>
        </div>
      </div>

      <footer className="mt-4 md:mt-16 flex w-full flex-col items-center justify-between gap-5 border-t border-black/20 bg-cream/30 px-1 py-5 text-center md:flex-row md:gap-4 md:text-left">
        <div className="flex min-w-0 flex-col justify-center">
          <h1 className="font-interserif text-3xl font-light">Insaf Finser</h1>
          <p className="max-w-xl wrap-break-word font-geist text-xs text-muted sm:text-sm">
            &copy; 2026 Insaf Finser. All rights reserved. | Crafted with passion and code.
          </p>
        </div>
        <ul className="flex max-w-full list-none flex-wrap items-center justify-center gap-1 p-0 text-accent md:justify-end">
          {socialLinks.map((link) => (
            <li key={link.name} className="relative flex shrink-0 p-[0.3rem]">
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                aria-label={link.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-black/70 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent/20"
              >
                <svg width="24" height={link.name === 'LinkedIn' ? '20' : '24'} viewBox="0 0 24 24" fill="currentColor">
                  <path d={link.svg} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  )
}

export default Contact
