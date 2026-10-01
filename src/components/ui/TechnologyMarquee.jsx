import { useEffect, useId, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

const AUTO_LAP_SECONDS = 42
const RESUME_DELAY_MS = 900
const MAX_RELEASE_SPEED = 1800
const KEYBOARD_STEP = 96

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function wrapOffset(value, width) {
  if (!width) return value
  let wrapped = value % width
  if (wrapped > 0) wrapped -= width
  return wrapped
}

const TECH_ASSETS = {
  React: { src: '/logos/tech/react-seeklogo.png' },
  'Next.js': { src: '/logos/tech/next-js-seeklogo.svg', tone: 'light' },
  TypeScript: { src: '/logos/tech/Typescript.webp' },
  JavaScript: { src: '/logos/tech/javascript.png' },
  'Node.js': { src: '/logos/tech/nodejs.svg', shape: 'wide' },
  'Tailwind CSS': { src: '/logos/tech/tailwind-css-logo-vector.svg', shape: 'wide', tone: 'light' },
  WordPress: { src: '/logos/tech/WordPress_blue_logo.webp' },
  PHP: { src: '/logos/tech/PHP-logo.webp', shape: 'wide' },
  Laravel: { src: '/logos/tech/Laravel.webp', shape: 'wide' },
  MySQL: { src: '/logos/tech/mysql-official.svg', shape: 'wide' },
  Oracle: { src: '/logos/tech/Oracle_logo.webp', shape: 'wide' },
  Python: { src: '/logos/tech/Python-logo-notext.webp' },
  'Power BI': { src: '/logos/tech/microsoft-power-bi.webp' },
  'C++': { src: '/logos/tech/c++.webp' },
  Claude: { src: '/logos/tech/claude-ai-icon.webp' },
  Codex: { src: '/logos/tech/codex-icon.webp' },
}

function TechnologySet({ technologies, duplicate = false }) {
  return (
    <ul className="tech-marquee-set" aria-hidden={duplicate || undefined}>
      {technologies.map((name) => {
        const asset = TECH_ASSETS[name]

        if (!asset) return null

        const logoClass = [
          'tech-marquee-logo',
          asset.shape === 'wide' ? 'tech-marquee-logo--wide' : '',
          asset.tone === 'light' ? 'tech-marquee-logo--light' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <li className="tech-marquee-item" key={`${duplicate ? 'copy-' : ''}${name}`}>
            <span className="tech-marquee-mark">
              <img
                className={logoClass}
                src={asset.src}
                alt={duplicate ? '' : name}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function TechnologyMarquee({ label, hint, technologies, showLabel = true }) {
  const root = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  const reduced = useReducedMotion()
  const instructionsId = useId()

  useEffect(() => {
    const rootElement = root.current
    const viewportElement = viewport.current
    const trackElement = track.current
    const firstSet = trackElement?.firstElementChild
    if (!rootElement || !viewportElement || !trackElement || !firstSet) return undefined

    const motion = {
      dragging: false,
      focused: false,
      hovered: false,
      inView: false,
      lastFrame: 0,
      lastPointerTime: 0,
      lastPointerX: 0,
      offset: 0,
      pointerId: null,
      resumeAt: 0,
      setWidth: firstSet.getBoundingClientRect().width,
      velocity: 0,
    }
    let frame = 0

    const paint = () => {
      motion.offset = wrapOffset(motion.offset, motion.setWidth)
      trackElement.style.transform = `translate3d(${motion.offset}px, 0, 0)`
    }

    const shouldAnimate = () =>
      motion.inView &&
      !document.hidden &&
      !reduced &&
      (Math.abs(motion.velocity) > 1 || (!motion.dragging && !motion.hovered && !motion.focused))

    const schedule = () => {
      if (!frame && shouldAnimate()) frame = requestAnimationFrame(tick)
    }

    const tick = (time) => {
      frame = 0
      const delta = motion.lastFrame ? Math.min((time - motion.lastFrame) / 1000, 0.05) : 0
      motion.lastFrame = time

      if (!motion.dragging && delta) {
        if (Math.abs(motion.velocity) > 1) {
          motion.offset += motion.velocity * delta
          motion.velocity *= Math.exp(-5.5 * delta)
        } else {
          motion.velocity = 0
        }

        if (!motion.hovered && !motion.focused && time >= motion.resumeAt) {
          motion.offset -= (motion.setWidth / AUTO_LAP_SECONDS) * delta
        }
        paint()
      }

      if (shouldAnimate()) frame = requestAnimationFrame(tick)
    }

    const updateWidth = () => {
      const previousWidth = motion.setWidth
      motion.setWidth = firstSet.getBoundingClientRect().width
      if (previousWidth && motion.setWidth) {
        motion.offset = (motion.offset / previousWidth) * motion.setWidth
      }
      paint()
    }

    const finishDrag = (event, cancelled = false) => {
      if (!motion.dragging || event.pointerId !== motion.pointerId) return
      motion.dragging = false
      motion.pointerId = null
      motion.resumeAt = performance.now() + RESUME_DELAY_MS
      if (cancelled || reduced) motion.velocity = 0
      rootElement.classList.remove('is-dragging')
      if (viewportElement.hasPointerCapture?.(event.pointerId)) {
        viewportElement.releasePointerCapture(event.pointerId)
      }
      motion.lastFrame = 0
      schedule()
    }

    const onPointerDown = (event) => {
      if (motion.dragging || (event.pointerType === 'mouse' && event.button !== 0)) return
      if (event.pointerType === 'mouse') event.preventDefault()
      motion.dragging = true
      motion.pointerId = event.pointerId
      motion.lastPointerX = event.clientX
      motion.lastPointerTime = performance.now()
      motion.velocity = 0
      rootElement.classList.add('is-dragging')
      viewportElement.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event) => {
      if (!motion.dragging || event.pointerId !== motion.pointerId) return
      const now = performance.now()
      const deltaX = event.clientX - motion.lastPointerX
      const deltaTime = Math.max(now - motion.lastPointerTime, 8)
      const instantaneousSpeed = (deltaX / deltaTime) * 1000

      motion.offset += deltaX
      motion.velocity = clamp(
        motion.velocity * 0.65 + instantaneousSpeed * 0.35,
        -MAX_RELEASE_SPEED,
        MAX_RELEASE_SPEED,
      )
      motion.lastPointerX = event.clientX
      motion.lastPointerTime = now
      paint()
    }

    const onPointerCancel = (event) => finishDrag(event, true)
    const onKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      motion.offset += event.key === 'ArrowLeft' ? KEYBOARD_STEP : -KEYBOARD_STEP
      motion.velocity = 0
      motion.resumeAt = performance.now() + RESUME_DELAY_MS
      paint()
      motion.lastFrame = 0
      schedule()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        motion.inView = entry.isIntersecting
        motion.lastFrame = 0
        schedule()
      },
      { rootMargin: '12% 0px' },
    )
    const resizeObserver = new ResizeObserver(updateWidth)
    const onVisibilityChange = () => {
      motion.lastFrame = 0
      schedule()
    }
    const onPointerEnter = (event) => {
      motion.hovered = event.pointerType !== 'touch'
    }
    const onPointerLeave = () => {
      motion.hovered = false
      motion.resumeAt = performance.now() + RESUME_DELAY_MS
      motion.lastFrame = 0
      schedule()
    }
    const onFocus = () => {
      motion.focused = true
    }
    const onBlur = () => {
      motion.focused = false
      motion.resumeAt = performance.now() + RESUME_DELAY_MS
      motion.lastFrame = 0
      schedule()
    }

    paint()
    observer.observe(rootElement)
    resizeObserver.observe(firstSet)
    viewportElement.addEventListener('pointerdown', onPointerDown)
    viewportElement.addEventListener('pointermove', onPointerMove)
    viewportElement.addEventListener('pointerup', finishDrag)
    viewportElement.addEventListener('pointercancel', onPointerCancel)
    viewportElement.addEventListener('pointerenter', onPointerEnter)
    viewportElement.addEventListener('pointerleave', onPointerLeave)
    viewportElement.addEventListener('keydown', onKeyDown)
    viewportElement.addEventListener('focus', onFocus)
    viewportElement.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      viewportElement.removeEventListener('pointerdown', onPointerDown)
      viewportElement.removeEventListener('pointermove', onPointerMove)
      viewportElement.removeEventListener('pointerup', finishDrag)
      viewportElement.removeEventListener('pointercancel', onPointerCancel)
      viewportElement.removeEventListener('pointerenter', onPointerEnter)
      viewportElement.removeEventListener('pointerleave', onPointerLeave)
      viewportElement.removeEventListener('keydown', onKeyDown)
      viewportElement.removeEventListener('focus', onFocus)
      viewportElement.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [reduced])

  return (
    <div className="tech-marquee" ref={root}>
      {showLabel && (
        <div className="tech-marquee-head">
          <h3>{label}</h3>
        </div>
      )}
      <span className="sr-only" id={instructionsId}>
        {hint}
      </span>
      <div
        className="tech-marquee-viewport"
        ref={viewport}
        role="region"
        aria-label={label}
        aria-describedby={instructionsId}
        tabIndex={0}
      >
        <div className="tech-marquee-track" ref={track}>
          <TechnologySet technologies={technologies} />
          <TechnologySet technologies={technologies} duplicate />
        </div>
      </div>
    </div>
  )
}
