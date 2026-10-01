import { useState } from 'react'
import { LanguageProvider, useLang } from './i18n/LanguageContext'
import { EMAIL, GITHUB, LINKEDIN } from './i18n/strings'
import { SmoothScroll, useScrollTo } from './lib/SmoothScroll'
import { hasWebGL, useReducedMotion } from './lib/useReducedMotion'
import { TopBar } from './components/TopBar'
import { Hero } from './components/Hero'
import { Work } from './components/WorkStage'
import { ShaderBackground } from './components/ShaderBackground'
import { Statement } from './components/Statement'
import { ProjectIndex } from './components/ProjectIndex'
import { Education } from './components/Education'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { GitHub, LinkedIn, Mail } from './components/Icons'

const BRAND_LOGO = `${import.meta.env.BASE_URL}logos/web/devagostini-logo-header.webp`

function Footer() {
  const { t } = useLang()
  const scrollTo = useScrollTo()
  const go = (target) => (event) => {
    event.preventDefault()
    scrollTo(target)
  }

  return (
    <footer className="footer section">
      <div className="footer-inner">
        <a className="footer-brand" href="#top" onClick={go('#top')} aria-label={t.footer.home}>
          <img
            src={BRAND_LOGO}
            alt="DevAgostini"
            width="640"
            height="83"
            loading="lazy"
            decoding="async"
          />
        </a>

        <nav className="footer-nav" aria-label={t.footer.navigation}>
          <a href="#top" onClick={go('#top')}>{t.footer.home}</a>
          <a href="#work" onClick={go('#work')}>{t.nav.work}</a>
          <a href="#about" onClick={go('#about')}>{t.nav.about}</a>
          <a href="#contact" onClick={go('#contact')}>{t.nav.contact}</a>
        </nav>

        <nav className="footer-socials" aria-label={t.footer.social}>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedIn />
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitHub />
          </a>
          <a href={`mailto:${EMAIL}`} aria-label={t.footer.email}>
            <Mail />
          </a>
        </nav>

        <div className="footer-meta">
          <p className="mono">© {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}

function Show() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const staged = webgl && !reduced

  return (
    <>
      <a className="skip-link" href="#work">
        {t.skip}
      </a>
      <TopBar />
      <main className="show">
        {/* One flow field behind the whole site: a single continuous surface from hero to footer. */}
        <div className="flow-zone">
          <div className="flow-bg" aria-hidden="true">
            <ShaderBackground className="flow-shader" reduced={reduced} />
          </div>
          <Hero staged={staged} />
          <Work />
          <Statement />
          <div className="house">
            <Education />
            <ProjectIndex />
            <About />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <SmoothScroll>
        <Show />
      </SmoothScroll>
    </LanguageProvider>
  )
}
