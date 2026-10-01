import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { EMAIL, GITHUB, LINKEDIN, whatsappLink } from '../i18n/strings'
import { useLenis, useScrollTo } from '../lib/SmoothScroll'
import { ArrowUpRight, GitHub, LinkedIn, Mail, WhatsApp } from './Icons'
import { LiquidMetal } from './LiquidMetal'

const spring = { type: 'spring', stiffness: 420, damping: 34 }
const BRAND_LOGO = `${import.meta.env.BASE_URL}logos/web/devagostini-logo-header.png`

function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang glass" role="group" aria-label={t.nav.langLabel}>
      {['en', 'pt'].map((code) => (
        <button
          key={code}
          type="button"
          className="lang-opt"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          lang={code === 'pt' ? 'pt-BR' : 'en'}
        >
          {lang === code && <motion.span layoutId="lang-pill" className="lang-pill" transition={spring} />}
          <span className="lang-label">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

/** Which section is under the reader's eye, for the nav's moving indicator. */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const triggers = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActive(el.id)
            else setActive((cur) => (cur === el.id ? null : cur))
          },
        }),
      )
    return () => triggers.forEach((tr) => tr.kill())
  }, [ids])
  return active
}

const SECTIONS = ['work', 'about', 'contact']
const ease = [0.16, 1, 0.3, 1]

/**
 * Phones: the nav pill does not fit, so a full-screen sheet carries the sections,
 * the socials and the primary action, all within thumb reach at the bottom half.
 */
function MobileMenu({ open, onClose, active, labels, onGo }) {
  const { t } = useLang()
  const lenis = useLenis()
  const sheet = useRef(null)

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    // Focus the dialog itself: screen readers land in it, and touch gets no stray focus ring.
    sheet.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // Keep keyboard focus inside the sheet while it is open.
      if (e.key === 'Tab' && sheet.current) {
        const f = [...sheet.current.querySelectorAll('a, button')]
        const i = f.indexOf(document.activeElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenis, onClose])

  const socials = [
    { href: LINKEDIN, label: 'LinkedIn', icon: <LinkedIn />, ext: true },
    { href: GITHUB, label: 'GitHub', icon: <GitHub />, ext: true },
    { href: `mailto:${EMAIL}`, label: 'E-mail', icon: <Mail /> },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={sheet}
          className="msheet"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          tabIndex={-1}
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 0 0 28px 28px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 0 0 0px 0px)' }}
          exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 0 0 28px 28px)', transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] } }}
          transition={{ duration: 0.6, ease }}
        >
          <nav className="msheet-nav" aria-label="Primary">
            {SECTIONS.map((id, i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                className="msheet-link"
                aria-current={active === id ? 'true' : undefined}
                onClick={onGo(`#${id}`)}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.12 + i * 0.06 }}
              >
                {labels[id]}
                <ArrowUpRight />
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="msheet-foot"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.34 }}
          >
            <p className="msheet-label">{t.nav.elsewhere}</p>
            <div className="msheet-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} {...(s.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {s.icon}
                </a>
              ))}
            </div>
            <LiquidMetal className="msheet-cta" href={whatsappLink(t.hero.whatsappText)} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {t.nav.talk}
            </LiquidMetal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TopBar() {
  const { t } = useLang()
  const lenis = useLenis()
  const scrollTo = useScrollTo()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtn = useRef(null)
  const active = useActiveSection(SECTIONS)

  const closeMenu = () => {
    setMenuOpen(false)
    requestAnimationFrame(() => menuBtn.current?.focus({ preventScroll: true }))
  }

  // Steps aside while reading down, returns on the way back up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (Math.abs(y - last) < 6) return
      setHidden(y > last && y > 240)
      last = y
    }
    if (lenis) lenis.on('scroll', onScroll)
    else window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (lenis) lenis.off('scroll', onScroll)
      else window.removeEventListener('scroll', onScroll)
    }
  }, [lenis])

  const go = (id) => (e) => {
    e.preventDefault()
    scrollTo(id)
  }
  // From the sheet: close first (which restarts smooth scroll), then travel.
  const goFromMenu = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    setTimeout(() => scrollTo(id), 60)
  }

  const labels = { work: t.nav.work, about: t.nav.about, contact: t.nav.contact }

  return (
    <>
    <MobileMenu open={menuOpen} onClose={closeMenu} active={active} labels={labels} onGo={goFromMenu} />
    <motion.header
      className={`topbar${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu' : ''}`}
      animate={{ y: hidden && !menuOpen ? '-130%' : '0%' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#top" className="wordmark" onClick={go('#top')}>
        <img className="wordmark-logo" src={BRAND_LOGO} alt="DevAgostini" width="2082" height="269" />
      </a>

      <nav className="navpill glass" aria-label="Primary">
        {SECTIONS.map((id) => (
          <a key={id} href={`#${id}`} onClick={go(`#${id}`)} className="navpill-link" aria-current={active === id ? 'true' : undefined}>
            {active === id && <motion.span layoutId="nav-active" className="navpill-active" transition={spring} />}
            <span className="navpill-label">{labels[id]}</span>
          </a>
        ))}
      </nav>

      <div className="topbar-end">
        <LangToggle />
        <LiquidMetal size="sm" className="topbar-cta" href={whatsappLink(t.hero.whatsappText)} target="_blank" rel="noopener noreferrer" aria-label={t.nav.talk}>
          <WhatsApp />
          <span className="btn-sm-label">{t.nav.talk}</span>
        </LiquidMetal>
        <button
          ref={menuBtn}
          type="button"
          className={`menu-btn glass${menuOpen ? ' is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu}
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          <span className="menu-btn-line" />
          <span className="menu-btn-line" />
        </button>
      </div>
    </motion.header>
    </>
  )
}
