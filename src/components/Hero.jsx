import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { whatsappLink } from '../i18n/strings'
import { useScrollTo } from '../lib/SmoothScroll'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ArrowDown, WhatsApp, Words } from './Icons'
import { Magnetic } from './Magnetic'
import { LiquidMetal } from './LiquidMetal'

const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0')

/** Local time in Itapuí, ticking. Writes straight to the DOM: no re-render per second. */
function LocalClock() {
  const ref = useRef(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref} className="hud-num" />
}

/** Cursor coordinates, the way a design tool shows them. rAF-throttled, DOM-direct. */
function CursorReadout() {
  const xRef = useRef(null)
  const yRef = useRef(null)
  useEffect(() => {
    let frame = 0
    let px = 0
    let py = 0
    const paint = () => {
      frame = 0
      if (xRef.current) xRef.current.textContent = pad4(px)
      if (yRef.current) yRef.current.textContent = pad4(py)
    }
    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      if (!frame) frame = requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <span className="hud-cursor">
      <span ref={xRef} className="hud-num">0000</span> X <span ref={yRef} className="hud-num">0000</span> Y
    </span>
  )
}

export function Hero({ staged }) {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()
  const h = t.hero

  // The grid draws in, the three columns settle, then the headline builds word by word.
  useGSAP(
    () => {
      if (reduced) return
      const tl = gsap.timeline({ delay: staged ? 0.6 : 0.15, defaults: { ease: 'expo.out' } })
      tl.from('.hero-grid-line', { scaleY: 0, duration: 1.4, stagger: 0.06, transformOrigin: 'top' })
        .from('.hero-rule', { scaleX: 0, duration: 1.4, transformOrigin: 'left' }, 0.1)
        .from('.hero-top > .hero-col', { autoAlpha: 0, y: 12, duration: 1, stagger: 0.08 }, 0.35)
        .from('.hero-title .w > span', { yPercent: 108, duration: 1.3, stagger: 0.06 }, 0.5)
        .from('.hero-sub--mobile', { autoAlpha: 0, y: 14, duration: 1 }, '-=0.9')
        .from('.hero-actions > *', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.08 }, '-=0.8')
        .from('.hero-hud > .hud-cell', { autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.6')
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="top" className="hero" data-chapter="opening" ref={root}>

      {/* the visible system: three columns, two rules, a cross at every meeting point */}
      <div className="hero-grid" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="hero-grid-line" style={{ '--i': i }} />
        ))}
      </div>

      <div className="hero-top section">
        <p className="hero-col">
          <span className="hero-role">{h.role}</span>
          <span className="hero-place">{h.place}</span>
        </p>
        <ul className="hero-col hero-focus" aria-label={h.role}>
          {h.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="hero-col hero-sub">{h.sub}</p>
        <span className="hero-rule" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className="cross" style={{ '--i': i }} />
          ))}
        </span>
      </div>

      <div className="hero-main section">
        <h1 className="hero-title">
          {h.lines.map((line, i) => (
            <span className={`hero-line hero-line-${i}`} key={line}>
              <Words text={line} />
            </span>
          ))}
        </h1>
        {/* Phones read top to bottom: the headline first, then this line (the column copy is hidden there). */}
        <p className="hero-sub hero-sub--mobile">{h.sub}</p>
        <div className="hero-actions">
          <Magnetic>
            <LiquidMetal href={whatsappLink(h.whatsappText)} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {h.cta}
            </LiquidMetal>
          </Magnetic>
          <a
            className="link-cta"
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#work')
            }}
          >
            <span className="link-cta-text">{h.secondary}</span>
            <LiquidMetal as="span" size="icon" aria-hidden="true">
              <ArrowDown />
            </LiquidMetal>
          </a>
        </div>
      </div>

      <div className="hero-hud section">
        <span className="hero-rule hero-rule-hud" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className="cross" style={{ '--i': i }} />
          ))}
        </span>
        <p className="hud-cell">
          <span className="live-dot" aria-hidden="true" />
          <span className="hud-label">{h.localTime}</span>
          <LocalClock /> BRT
        </p>
        <p className="hud-cell hud-mid" aria-hidden="true">
          <CursorReadout />
        </p>
        <p className="hud-cell hud-end hero-cue" aria-hidden="true">
          {h.scroll}
          <span className="hero-cue-line" />
        </p>
      </div>
    </section>
  )
}
