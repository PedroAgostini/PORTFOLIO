import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { EMAIL, GITHUB, LINKEDIN, whatsappLink } from '../i18n/strings'
import { projects } from '../data/projects'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ShaderBackground } from './ShaderBackground'
import { ArrowUpRight, GitHub, LinkedIn, Mail, WhatsApp, Words } from './Icons'

const ease = [0.16, 1, 0.3, 1]

/* ─── Menu bar ─── */
function MenuClock() {
  const ref = useRef(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit' })
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date()).replace('.', '')
    }
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref} className="mb-clock" />
}

function MenuBar({ title, openName }) {
  return (
    <div className="desk-menubar" aria-hidden="true">
      <span className="mb-left">
        <span className="mb-mark">P</span>
        <strong>{openName ?? 'Pedro de Agostini'}</strong>
        <span className="mb-item">{title}</span>
      </span>
      <span className="mb-right">
        <svg viewBox="0 0 24 24" className="mb-glyph">
          <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="19.5" r="1.4" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 30 14" className="mb-glyph mb-battery">
          <rect x="1" y="1" width="24" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="3" y="3" width="17" height="8" rx="2" fill="currentColor" />
          <rect x="26.5" y="5" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
        <MenuClock />
      </span>
    </div>
  )
}

/* ─── App icon ─── */
function AppIcon({ project, active, onOpen, iconRef, lang }) {
  const full = project.tile === 'full'
  return (
    <li className="desk-app">
      <button ref={iconRef} type="button" className={`app-btn${active ? ' is-open' : ''}`} onClick={(e) => onOpen(project, e.currentTarget)} aria-label={`${project.name} — ${project.category[lang]}`}>
        <span className={`app-tile${full ? ' app-tile--full' : ''}`} style={full ? undefined : { background: project.tile }}>
          <img src={project.logo} alt="" loading="lazy" draggable="false" />
        </span>
        <span className="app-name">{project.name}</span>
        <span className="app-running" aria-hidden="true" />
      </button>
    </li>
  )
}

/* ─── Browser window with the live site ─── */
function BrowserWindow({ project, origin, onClose }) {
  const { t } = useLang()
  const box = useRef(null)
  const closeRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [max, setMax] = useState(false)
  const [frame, setFrame] = useState({ base: 1280, s: 1, h: 800 })

  // The site renders at a real viewport width (desktop 1280, phone 390) and is scaled to fit.
  useEffect(() => {
    const el = box.current
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const base = w < 520 ? 390 : 1280
      const s = w / base
      setFrame({ base, s, h: h / s })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.div
      className={`browser${max ? ' is-max' : ''}`}
      role="region"
      aria-label={project.name}
      style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
      initial={{ opacity: 0, scale: 0.06, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.06, filter: 'blur(8px)', transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
      transition={{ duration: 0.55, ease }}
      layout
    >
      <div className="browser-bar">
        <span className="traffic">
          <button ref={closeRef} type="button" className="light light--close" onClick={onClose} aria-label={t.work.close} />
          <button type="button" className="light light--min" onClick={onClose} aria-label={t.work.close} tabIndex={-1} />
          <button type="button" className="light light--max" onClick={() => setMax((m) => !m)} aria-label={t.work.maximize} />
        </span>
        <span className="browser-url">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {project.domain}
        </span>
        <a className="browser-open" href={project.url} target="_blank" rel="noopener noreferrer" title={t.work.openTab}>
          <span className="sr-only">{t.work.openTab}</span>
          <ArrowUpRight />
        </a>
      </div>
      <div className="browser-view" ref={box}>
        {!loaded && (
          <div className="browser-loading" role="status">
            <img src={project.thumb} alt="" />
            <span className="browser-progress" />
            <span className="sr-only">{t.work.loading}</span>
          </div>
        )}
        <iframe
          title={project.name}
          src={project.url}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          style={{ width: frame.base, height: frame.h, transform: `scale(${frame.s})` }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Dock: the real ways to reach Pedro ─── */
function Dock({ label, talk }) {
  const items = [
    { href: whatsappLink(talk), label: 'WhatsApp', icon: <WhatsApp />, ext: true },
    { href: `mailto:${EMAIL}`, label: 'E-mail', icon: <Mail /> },
    { href: LINKEDIN, label: 'LinkedIn', icon: <LinkedIn />, ext: true },
    { href: GITHUB, label: 'GitHub', icon: <GitHub />, ext: true },
  ]
  return (
    <nav className="desk-dock" aria-label={label}>
      {items.map((it) => (
        <a key={it.label} className="dock-item" href={it.href} {...(it.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {it.icon}
          <span className="dock-tip">{it.label}</span>
        </a>
      ))}
    </nav>
  )
}

/* ─── The section ─── */
export function ProjectsDesktop() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const root = useRef(null)
  const screenRef = useRef(null)
  const iconRefs = useRef({})
  const [open, setOpen] = useState(null)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  const openProject = useCallback((project, btn) => {
    const s = screenRef.current.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    setOrigin({
      x: ((b.left + b.width / 2 - s.left) / s.width) * 100,
      y: ((b.top + b.height / 2 - s.top) / s.height) * 100,
    })
    setOpen(project)
  }, [])

  const close = useCallback(() => {
    setOpen((cur) => {
      if (cur) requestAnimationFrame(() => iconRefs.current[cur.slug]?.focus({ preventScroll: true }))
      return null
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useGSAP(
    () => {
      if (reduced) return
      gsap.from('.desk-info-head .w > span', {
        yPercent: 108,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 55%' },
      })
      gsap.from('.desk-app', {
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'back.out(1.8)',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 45%' },
      })
      gsap.from('.desk-dock', {
        yPercent: 140,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 35%' },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  // The whole section is the MacBook's screen: menu bar and notch on top, the hero's
  // flow field as wallpaper, an info widget on the left, the apps (or the open browser) on the right.
  return (
    <section id="work" className="work-desk" ref={root}>
      <div className="desk" ref={screenRef}>
        <ShaderBackground className="desk-wallpaper" reduced={reduced} />
        <MenuBar title={t.work.desktop} openName={open?.name} />
        <span className="mbp-notch" aria-hidden="true" />

        <div className="desk-info" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div key={open.slug} className="desk-info-inner" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
                <h3 className="desk-info-title">{open.name}</h3>
                <p className="mono desk-info-spec">
                  {open.category[lang]} · {open.place}
                </p>
                <p className="desk-info-desc">{open.line[lang]}</p>
                <a className="text-link" href={open.url} target="_blank" rel="noopener noreferrer">
                  {t.work.visit}
                  <ArrowUpRight />
                </a>
              </motion.div>
            ) : (
              <motion.div key="intro" className="desk-info-inner" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
                <h2 className="desk-info-title desk-info-head">
                  <Words text={t.work.intro} />
                </h2>
                <p className="desk-info-desc">{t.work.introSub}</p>
                <p className="desk-hint">
                  <span className="live-dot" aria-hidden="true" />
                  {t.work.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ul className="desk-apps" aria-label={t.work.desktop}>
          {projects.map((p) => (
            <AppIcon key={p.slug} project={p} lang={lang} active={open?.slug === p.slug} onOpen={openProject} iconRef={(el) => (iconRefs.current[p.slug] = el)} />
          ))}
        </ul>

        <AnimatePresence>{open && <BrowserWindow key={open.slug} project={open} origin={origin} onClose={close} />}</AnimatePresence>

        <Dock label={t.work.dockLabel} talk={t.hero.whatsappText} />
      </div>
    </section>
  )
}
