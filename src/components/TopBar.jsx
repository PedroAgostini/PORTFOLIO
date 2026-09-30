import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { whatsappLink } from '../i18n/strings'
import { useLenis, useScrollTo } from '../lib/SmoothScroll'
import { WhatsApp } from './Icons'
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

export function TopBar() {
  const { t } = useLang()
  const lenis = useLenis()
  const scrollTo = useScrollTo()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(SECTIONS)

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

  const labels = { work: t.nav.work, about: t.nav.about, contact: t.nav.contact }

  return (
    <motion.header
      className={`topbar${scrolled ? ' is-scrolled' : ''}`}
      animate={{ y: hidden ? '-130%' : '0%' }}
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
      </div>
    </motion.header>
  )
}
