import { useEffect, useRef, useState } from 'react'

/**
 * Privacy page, same wording as before, easier to read and use:
 *  - "At a glance" summary (built only from what the policy already says)
 *  - sticky contents list on desktop, scrolling chip row on mobile, with the
 *    current section highlighted
 *  - numbered sections that anchor correctly under the top edge
 *  - thin scroll-progress line, "Copy email address" button, back-to-top
 *  - print-friendly (controls hidden when printing)
 */

const EMAIL = 'insaffinser@gmail.com'
const UPDATED = 'October 11, 2026'

const GLANCE = [
  {
    label: 'What I collect',
    value: 'Your name, email and message, only if you use the contact form.',
  },
  {
    label: 'Who handles data',
    value: 'EmailJS delivers messages, Vercel hosts the site and Google Fonts serves the fonts.',
  },
  {
    label: 'Tracking',
    value: 'No advertising or analytics tools at present.',
  },
  {
    label: 'Your choices',
    value: 'Ask about, correct or request deletion of what you have sent.',
  },
]

const CopyEmail = () => {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // Older browsers or blocked clipboard: fall back to a hidden textarea.
      const ta = document.createElement('textarea')
      ta.value = EMAIL
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* nothing more to try */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 print:hidden">
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-ink/40 px-4 py-1.5 font-geist text-sm text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {copied ? 'Copied' : 'Copy email address'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </div>
  )
}

const SECTIONS = [
  {
    id: 'information-you-provide',
    title: 'Information you provide',
    body: (
      <p>
        If you use the contact form, I receive the name, email address, and message you
        submit. Please avoid including sensitive personal information in your message.
      </p>
    ),
  },
  {
    id: 'how-information-is-used',
    title: 'How information is used',
    body: (
      <p>
        Contact details and messages are used to respond to your enquiry and maintain
        relevant business correspondence. The site does not currently use advertising or
        analytics tools.
      </p>
    ),
  },
  {
    id: 'service-providers',
    title: 'Service providers',
    body: (
      <p>
        The contact form uses EmailJS to deliver messages. The website is hosted by Vercel,
        and fonts are loaded from Google Fonts. These providers may process technical
        information, such as your IP address and browser details, when your browser
        connects to their services. Their handling of that information is governed by their
        own privacy terms.
      </p>
    ),
  },
  {
    id: 'cookies-and-storage',
    title: 'Cookies and storage',
    body: (
      <p>
        This site does not currently use analytics or advertising tracking cookies. Your
        browser may use temporary or essential storage needed to load and operate the site.
      </p>
    ),
  },
  {
    id: 'retention-and-your-choices',
    title: 'Retention and your choices',
    body: (
      <p>
        Messages are kept only as long as needed to respond and maintain relevant business
        records. You can ask about, correct, or request deletion of information you have
        sent, subject to any applicable record-keeping requirements.
      </p>
    ),
  },
  {
    id: 'contact-and-updates',
    title: 'Contact and updates',
    body: (
      <>
        <p>
          For privacy questions or a request about your information, email{' '}
          <a href={`mailto:${EMAIL}`} className="text-ink underline underline-offset-4">
            {EMAIL}
          </a>
          . This policy may be updated from time to time; the date above shows when it was
          last revised.
        </p>
        <CopyEmail />
      </>
    ),
  },
]

const Privacy = () => {
  const barRef = useRef(null)
  const [active, setActive] = useState(SECTIONS[0].id)

  // Title and description for this page; restored when leaving it.
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')

    document.title = 'Privacy Policy | Insaf Finser'
    description?.setAttribute(
      'content',
      'Privacy policy for the Insaf Finser portfolio website and contact form.',
    )

    return () => {
      document.title = previousTitle
      if (previousDescription != null) {
        description?.setAttribute('content', previousDescription)
      }
    }
  }, [])

  // Scroll-progress line.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Highlight the section currently near the top of the viewport.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const goTo = (id) => (e) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <main className="min-h-dvh bg-cream px-5 py-8 text-ink sm:px-8 md:px-12">
      <div
        ref={barRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left scale-x-0 bg-accent print:hidden"
      />

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-ink/15 pb-4 font-geist text-sm">
          <a href="/" className="font-semibold text-ink no-underline">
            Insaf Finser
          </a>
          <a
            href="/#home"
            className="text-ink/65 underline underline-offset-4 transition-colors hover:text-ink print:hidden"
          >
            Back to portfolio
          </a>
        </header>

        <div className="flex-1 py-12 sm:py-16">
          {/* title block */}
          <p className="mb-4 flex items-center gap-3 font-geist text-sm text-ink/70">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Last updated {UPDATED}
          </p>
          <h1 className="mb-5 font-interserif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Privacy policy
          </h1>
          <p className="mb-10 max-w-2xl font-grotesk text-base leading-relaxed text-ink/70 sm:text-lg">
            This policy explains what information this portfolio website handles, why it is
            used, and how you can contact me about it.
          </p>

          {/* at a glance */}
          <section
            aria-labelledby="glance-heading"
            className="mb-12 rounded-2xl border border-ink/15 bg-ink/5 p-5 sm:p-7"
          >
            <h2 id="glance-heading" className="mb-5 font-interserif text-2xl">
              At a glance
            </h2>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {GLANCE.map((item) => (
                <div key={item.label}>
                  <dt className="mb-1 font-geist text-sm text-ink/70">{item.label}</dt>
                  <dd className="m-0 font-grotesk text-base leading-snug text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-0 mt-5 font-geist text-sm text-ink/70">
              This summary is for convenience. The full policy below is what applies.
            </p>
          </section>

          <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
            {/* contents: chip row on mobile, sticky list on desktop */}
            <nav
              aria-label="On this page"
              className="mb-10 lg:mb-0 print:hidden"
            >
              <p className="mb-3 hidden font-geist text-sm text-ink/70 lg:block">On this page</p>
              <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-2 lg:sticky lg:top-8 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
                {SECTIONS.map((s, i) => {
                  const on = active === s.id
                  return (
                    <li key={s.id} className="shrink-0">
                      <a
                        href={`#${s.id}`}
                        onClick={goTo(s.id)}
                        aria-current={on ? 'true' : undefined}
                        className={`block whitespace-nowrap rounded-full border px-3 py-1.5 font-geist text-sm no-underline transition-colors lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-2 ${
                          on
                            ? 'border-ink bg-ink text-cream lg:border-accent lg:bg-transparent lg:font-medium lg:text-ink'
                            : 'border-ink/25 text-ink/70 hover:text-ink lg:border-ink/15'
                        }`}
                      >
                        <span className="mr-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        {s.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* policy text */}
            <article className="max-w-2xl space-y-10 font-grotesk text-base leading-relaxed text-ink/80 sm:text-lg">
              {SECTIONS.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-24 border-t border-ink/15 pt-6"
                >
                  <div className="mb-3 flex items-baseline gap-4">
                    <span className="font-geist text-sm tabular-nums text-ink/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 id={`${s.id}-title`} className="m-0 font-interserif text-2xl text-ink sm:text-3xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="sm:pl-10">{s.body}</div>
                </section>
              ))}
            </article>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-ink/15 pt-4 font-geist text-xs text-ink/70 sm:text-sm">
          <span>&copy; 2026 Insaf Finser</span>
          <button
            type="button"
            onClick={toTop}
            className="underline underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent print:hidden"
          >
            Back to top
          </button>
        </footer>
      </div>
    </main>
  )
}

export default Privacy