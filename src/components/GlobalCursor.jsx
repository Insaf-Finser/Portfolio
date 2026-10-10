import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const getTextNodeAtPoint = (x, y) => {
  if (document.caretPositionFromPoint) {
    return document.caretPositionFromPoint(x, y)
  }

  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y)
    return range ? { offsetNode: range.startContainer, offset: range.startOffset } : null
  }

  return null
}

const isOverText = (x, y, target) => {
  if (target instanceof Element && target.closest('.about-p')) return true

  const caret = getTextNodeAtPoint(x, y)
  const node = caret?.offsetNode

  if (node?.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (text.length) {
      let offset = Math.min(caret.offset, text.length - 1)
      if (/\s/.test(text[offset]) && offset > 0) offset -= 1
      if (!/\s/.test(text[offset])) {
        const range = document.createRange()
        range.setStart(node, offset)
        range.setEnd(node, offset + 1)
        const overCharacter = Array.from(range.getClientRects()).some(
          (rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
        )
        if (overCharacter) return true
      }
    }
  }

  const splitAboutWord = target instanceof Element
    ? target.closest('.about-p [aria-hidden="true"]')
    : null
  if (!splitAboutWord) return false

  const wordRect = splitAboutWord.getBoundingClientRect()
  return x >= wordRect.left && x <= wordRect.right && y >= wordRect.top && y <= wordRect.bottom
}

const isOverVisualMedia = (target) => {
  const media = target?.closest('img, video, canvas, svg, picture')
  if (media) return true

  let element = target
  while (element && element !== document.documentElement) {
    if (window.getComputedStyle(element).backgroundImage !== 'none') return true
    element = element.parentElement
  }

  return false
}

const GlobalCursor = () => {
  const cursorRef = useRef(null)
  const stateTimerRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const pointerQuery = window.matchMedia(FINE_POINTER)
    const motionQuery = window.matchMedia(REDUCED_MOTION)
    const updateEnabled = () => setEnabled(pointerQuery.matches && !motionQuery.matches)

    updateEnabled()
    pointerQuery.addEventListener('change', updateEnabled)
    motionQuery.addEventListener('change', updateEnabled)
    return () => {
      pointerQuery.removeEventListener('change', updateEnabled)
      motionQuery.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!enabled || !cursor) return undefined

    document.documentElement.classList.add('global-custom-cursor')
    gsap.set(cursor, { x: -100, y: -100 })
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' })
    let placed = false

    const setCursorState = (state) => {
      window.clearTimeout(stateTimerRef.current)
      if (cursor.dataset.state !== state) cursor.dataset.state = state
    }

    const onMove = (event) => {
      if (!placed) {
        gsap.set(cursor, { x: event.clientX, y: event.clientY })
        cursor.toggleAttribute('data-show', true)
        placed = true
      }

      xTo(event.clientX)
      yTo(event.clientY)

      const target = document.elementFromPoint(event.clientX, event.clientY)
      if (target?.closest('button, a:not([data-project]), [data-cursor="tag"]')) {
        setCursorState('dot')
        return
      }

      if (isOverText(event.clientX, event.clientY, target)) {
        const state = target?.closest('[data-cursor="name"]')
          ? 'name'
          : target?.closest('[data-project]')
            ? 'project'
            : target?.closest('a, button')
              ? 'link'
              : 'text'
        setCursorState(state)
      } else if (isOverVisualMedia(target) && !target?.closest('[data-project]')) {
        setCursorState('image')
      } else if (cursor.dataset.state !== 'idle' && cursor.dataset.state !== 'image') {
        window.clearTimeout(stateTimerRef.current)
        stateTimerRef.current = window.setTimeout(() => setCursorState('idle'), 90)
      } else {
        setCursorState('idle')
      }
    }

    const onLeave = () => {
      window.clearTimeout(stateTimerRef.current)
      cursor.toggleAttribute('data-show', false)
      placed = false
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('global-custom-cursor')
      window.clearTimeout(stateTimerRef.current)
      gsap.killTweensOf(cursor)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <style>{`
        html.global-custom-cursor,
        html.global-custom-cursor * {
          cursor: none !important;
        }
        .global-inverting-cursor {
          backdrop-filter: invert(1) hue-rotate(180deg);
          -webkit-backdrop-filter: invert(1) hue-rotate(180deg);
        }
        .global-inverting-cursor[data-state='project'] {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .global-inverting-cursor[data-state='image'] {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .global-inverting-cursor[data-state='dot'] {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      `}</style>
      <div
        ref={cursorRef}
        aria-hidden="true"
        data-state="idle"
        className="global-inverting-cursor group pointer-events-none fixed left-0 top-0 z-1999 -m-2.75 grid size-5.5 place-items-center rounded-full opacity-0 transition-[width,height,margin,background-color,opacity] duration-300 data-show:opacity-100 data-[state=text]:-m-[50px] data-[state=text]:size-[100px] data-[state=name]:-m-30 data-[state=name]:size-60 data-[state=link]:-m-8 data-[state=link]:size-16 data-[state=project]:-m-10.5 data-[state=project]:size-21 data-[state=project]:bg-accent data-[state=image]:border data-[state=image]:border-ink/40 data-[state=image]:bg-cream/90 data-[state=dot]:-m-1 data-[state=dot]:size-2 data-[state=dot]:bg-ink/70"
      >
        <span className="font-geist text-sm font-medium text-cream opacity-0 transition-opacity duration-200 group-data-[state=project]:opacity-100">
          View
        </span>
      </div>
    </>
  )
}

export default GlobalCursor
