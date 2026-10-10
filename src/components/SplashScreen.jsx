import { useEffect, useRef, useState } from 'react'

/**
 * Splash screen: the name fills in like a gauge as the site loads.
 *
 *  - "Insaf" fills over the first half of the load, "Finser" over the second.
 *  - The displayed value eases toward `progress`, so it never jumps.
 *  - When `ready` is true it runs to 100, holds a beat, then the full screen
 *    glides upward to reveal the page.
 *
 * Props
 *  progress  number 0-100, real loading progress
 *  ready     boolean, true once the app can be shown
 *  onExited  optional callback, runs after the exit animation finishes
 *            (a good place to call ScrollTrigger.refresh())
 */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const LINES = ['Insaf', 'Finser']

const styles = `
.sp-root {
  --sp-cream: var(--color-cream, #efe9dc);
  --sp-accent: var(--color-accent, #d4af37);
  --sp-ink: #11110f;
  --p1: 0%;
  --p2: 0%;
  --edge1: 0;
  --edge2: 0;
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: var(--sp-ink);
  color: var(--sp-cream);
  overflow: hidden;
}
.sp-root.sp-open {
  pointer-events: none;
  transform: translateY(-101%);
}

.sp-root {
  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.sp-stage {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(20px, 4vw, 48px);
}

.sp-meta {
  display: flex;
  justify-content: space-between;
  font-size: clamp(12px, 1.1vw, 14px);
  color: color-mix(in srgb, var(--sp-cream) 55%, transparent);
}

.sp-name {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: clamp(72px, 19vw, 260px);
  line-height: 0.88;
  letter-spacing: -0.035em;
}
.sp-line { position: relative; width: fit-content; }
.sp-line:nth-child(1) { --p: var(--p1); }
.sp-line:nth-child(2) { --p: var(--p2); margin-left: clamp(24px, 8vw, 120px); }

.sp-outline {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--sp-cream) 30%, transparent);
}
.sp-fill {
  position: absolute;
  inset: 0;
  color: var(--sp-cream);
  clip-path: inset(-5% calc(96% - var(--p)) -5% 0);
}
.sp-edge {
  position: absolute;
  top: 8%;
  bottom: 8%;
  width: 2px;
  left: var(--p);
  background: var(--sp-accent);
  opacity: var(--edge-opacity);
}
.sp-line:nth-child(1) .sp-edge { --edge-opacity: var(--edge1); }
.sp-line:nth-child(2) .sp-edge { --edge-opacity: var(--edge2); }

.sp-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.sp-status {
  font-size: clamp(14px, 1.4vw, 18px);
  color: color-mix(in srgb, var(--sp-cream) 70%, transparent);
}
.sp-count {
  font-size: clamp(56px, 10vw, 132px);
  line-height: 0.8;
  letter-spacing: -0.04em;
  font-feature-settings: 'tnum', 'lnum';
  font-variant-numeric: tabular-nums lining-nums;
}
.sp-count small {
  font-size: 0.32em;
  letter-spacing: 0;
  margin-left: 0.15em;
  color: var(--sp-accent);
}

@media (prefers-reduced-motion: reduce) {
  .sp-root { transition: opacity 400ms ease; }
  .sp-root.sp-open { transform: none; opacity: 0; }
}
`

const Stage = ({ count, ready }) => (
  <div className="sp-stage font-grotesk">
    <div className="sp-meta">
      <span>Full-stack developer</span>
      <span>Portfolio, 2026</span>
    </div>

    <div className="sp-name font-interserif">
      {LINES.map((word) => (
        <div className="sp-line" key={word}>
          <span className="sp-outline">{word}</span>
          <span className="sp-fill" aria-hidden="true">
            {word}
          </span>
          <i className="sp-edge ml-3" />
        </div>
      ))}
    </div>

    <div className="sp-foot">
      <span className="sp-status">{ready && count >= 100 ? 'Ready' : 'Loading portfolio'}</span>
      <span className="sp-count font-interserif">
        {count}
        <small>%</small>
      </span>
    </div>
  </div>
)

const SplashScreen = ({ progress = 0, ready = false, onExited }) => {
  const rootRef = useRef(null)
  const shown = useRef(0)
  const target = useRef(0)
  const displayedCount = useRef(0)
  const exitedRef = useRef(onExited)
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    exitedRef.current = onExited
  })

  // Animate only while progress is changing, then release the animation frame.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nextTarget = ready ? 100 : clamp(Number.isFinite(progress) ? progress : 0, 0, 100)
    target.current = Math.max(target.current, nextTarget)
    let raf = 0
    let last = performance.now()

    const updateCount = (value) => {
      const nextCount = Math.floor(clamp(Number.isFinite(value) ? value : 0, 0, 100) + 0.0001)
      if (nextCount === displayedCount.current) return
      displayedCount.current = nextCount
      setCount(nextCount)
    }

    const paint = (v) => {
      const el = rootRef.current
      if (!el) return
      const firstLine = clamp(v * 2, 0, 100)
      const secondLine = clamp(v * 2 - 100, 0, 100)
      el.style.setProperty('--p1', `${firstLine}%`)
      el.style.setProperty('--p2', `${secondLine}%`)
      el.style.setProperty('--edge1', String(clamp(Math.min(firstLine, 100 - firstLine) / 4, 0, 1)))
      el.style.setProperty('--edge2', String(clamp(Math.min(secondLine, 100 - secondLine) / 4, 0, 1)))
    }

    if (reduce) {
      shown.current = target.current
      paint(shown.current)
      updateCount(shown.current)
      return undefined
    }

    const tick = (now) => {
      const dt = clamp(now - last, 0, 50)
      last = now
      const gap = target.current - shown.current
      if (Math.abs(gap) < 0.05) {
        shown.current = target.current
        paint(shown.current)
        updateCount(shown.current)
        return
      }
      shown.current = clamp(shown.current + gap * (1 - Math.exp(-dt / 110)), 0, target.current)
      paint(shown.current)
      updateCount(shown.current)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, ready])

  // Once the gauge is full and the app is ready: hold a beat, then glide away.
  const full = ready && count >= 100
  useEffect(() => {
    if (!full) return
    const exitDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 650
    const holdDuration = 120
    const openTimer = setTimeout(() => setOpen(true), holdDuration)
    const doneTimer = setTimeout(() => {
      setGone(true)
      exitedRef.current?.()
    }, holdDuration + exitDuration)
    return () => {
      clearTimeout(openTimer)
      clearTimeout(doneTimer)
    }
  }, [full])

  if (gone) return null

  return (
    <>
      <style>{styles}</style>
      <div
        ref={rootRef}
        className={`sp-root${open ? ' sp-open' : ''}`}
        role="progressbar"
        aria-label="Loading portfolio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={count}
      >
        <Stage count={count} ready={ready} />
      </div>
    </>
  )
}

export default SplashScreen