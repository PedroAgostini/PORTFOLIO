import { Fragment, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import { useScrollTo } from '../lib/SmoothScroll'
import { useReducedMotion } from '../lib/useReducedMotion'
import { MacbookPro } from './ui/macbook-pro'
import { ArrowUpRight, Words } from './Icons'
import { LiquidMetal } from './LiquidMetal'
import { CountUp } from './ui/number-flow'

gsap.registerPlugin(ScrollTrigger)

const ease = [0.16, 1, 0.3, 1]

function ProjectCaption({ project }) {
  const { t, lang } = useLang()
  const rise = {
    hidden: { y: '105%' },
    show: (i) => ({ y: '0%', transition: { duration: 0.9, ease, delay: 0.06 * i } }),
    exit: { y: '-105%', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } },
  }
  const Line = ({ i, className, children }) => (
    <span className={`cap-mask ${className ?? ''}`}>
      <motion.span className="cap-line" variants={rise} custom={i}>
        {children}
      </motion.span>
    </span>
  )
  return (
    <motion.div className="caption" initial="hidden" animate="show" exit="exit">
      <h3 className="cap-name cap-logo">
        <Line i={1}>
          <img
            src={project.wordmark}
            alt={project.name}
            className={`cap-logo-img cap-logo--${project.slug}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </Line>
      </h3>
      <Line i={2} className="mono cap-spec">
        {project.category[lang]} · {project.place}
      </Line>
      <Line i={3} className="cap-desc">
        {project.line[lang]}
      </Line>
      <Line i={4} className="cap-cta">
        <LiquidMetal href={project.url} target="_blank" rel="noopener noreferrer">
          {t.work.visit}
          <ArrowUpRight />
        </LiquidMetal>
      </Line>
    </motion.div>
  )
}

/**
 * Progress rail: one hairline that fills with the scroll (--total, written by ScrollTrigger),
 * a stop per project. Passed stops turn ink, the current one glows crimson; hover names it.
 */
function ProgressRail({ active, trackRef }) {
  const scrollTo = useScrollTo()
  const { t } = useLang()
  const jump = (i) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    scrollTo(top + span * ((i + 0.45) / projects.length))
  }
  return (
    <nav className="rail" aria-label={t.chapters.work}>
      <span className="rail-track" aria-hidden="true">
        <span className="rail-fill" />
      </span>
      <ol className="rail-stops">
        {projects.map((p, i) => (
          <li key={p.slug} style={{ '--at': `${(i / (projects.length - 1)) * 100}%` }}>
            <button
              type="button"
              className={`rail-stop${i < active ? ' is-past' : ''}${i === active ? ' is-current' : ''}`}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => jump(i)}
            >
              <span className="rail-dot" aria-hidden="true" />
              <span className="rail-label">{p.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Screen is 501.22 × 323.85 in the SVG. A constant reading pace: every screenful of the
// page takes the same time, so long sites scroll as gently as short ones.
const SCREEN_ASPECT = 501.22 / 323.85
const SECONDS_PER_SCREEN = 6
const setReadingPace = (e) => {
  const img = e.currentTarget
  const screens = (img.naturalHeight / img.naturalWidth) * SCREEN_ASPECT
  const travel = Math.max(1, screens - 1) * SECONDS_PER_SCREEN
  // The keyframes spend 95.5% moving: a near-instant start and a short rest at the foot.
  img.style.setProperty('--scroll-dur', `${Math.max(20, travel / 0.955).toFixed(1)}s`)
}

/** The MacBook Pro (SVG) with the live site's capture scrolling by itself on its screen. */
function Laptop({ project }) {
  const reduced = useReducedMotion()
  return (
    <div className="wm">
      <MacbookPro className="wm-frame" aria-hidden="true" focusable="false" />
      <div className="wm-screen">
        <AnimatePresence initial={false}>
          <motion.div
            key={project.slug}
            className="wm-page"
            initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.7, ease }}
          >
            <img
              className={`wm-shot${reduced ? '' : ' is-playing'}`}
              onLoad={setReadingPace}
              src={project.image}
              srcSet={`${project.image.replace('.webp', '-sm.webp')} 640w, ${project.image} 1024w`}
              sizes="(max-width: 899px) 90vw, 45vw"
              alt={`${project.name} — ${project.domain}`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </motion.div>
        </AnimatePresence>
        <span className="wm-glare" aria-hidden="true" />
        <span className="wm-notch" aria-hidden="true" />
      </div>
    </div>
  )
}

/** A headline line with the project count rolling in place of `{count}`; the words keep their build-in. */
function CountLine({ line, count }) {
  const words = line.split(' ')
  return words.map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="w">
        <span>{w === '{count}' ? <CountUp value={count} className="intro-count" /> : w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ))
}

/** The pinned sequence: one project per scroll step, its site playing on the MacBook. */
export function Work() {
  const { t, lang } = useLang()
  const intro = useRef(null)
  const track = useRef(null)
  const sticky = useRef(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const n = projects.length
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const w = self.progress * n
          const idx = Math.min(n - 1, Math.floor(w))
          sticky.current?.style.setProperty('--p', (w - idx).toFixed(3))
          // Rail fill: 0 at the first stop, 1 at the last, easing between stops with the scroll.
          sticky.current?.style.setProperty('--total', Math.min(1, Math.max(0, (w - 0.45) / (n - 1))).toFixed(4))
          setActive((cur) => (cur === idx ? cur : idx))
        },
      })
      if (reduced) return
      gsap.from('.work-intro .w > span', {
        yPercent: 108,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: intro.current, start: 'top 70%' },
      })
      // The machine rises into place as the sequence begins.
      gsap.from('.wm', {
        yPercent: 18,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: track.current, start: 'top 80%' },
      })
    },
    { dependencies: [lang, reduced], revertOnUpdate: true },
  )

  return (
    <section id="work" className="work" data-chapter="work">
      {/* The hero's three-column grid, pinned behind the sequence (the flow field lives in App). */}
      <div className="work-bg" aria-hidden="true">
        <div className="hero-grid">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="hero-grid-line" style={{ '--i': i }} />
          ))}
        </div>
      </div>

      <div className="work-intro section" ref={intro}>
        <h2 className="work-intro-title">
          {t.work.introLines.map((line) => (
            <span className="work-intro-line" key={line}>
              {line.includes('{count}') ? <CountLine line={line} count={t.work.projectCount} /> : <Words text={line} />}
            </span>
          ))}
        </h2>
      </div>

      <div className="work-track" ref={track} style={{ '--n': projects.length }}>
        <div className="work-sticky section" ref={sticky}>
          <div className="work-layout">
            <div className="work-left">
              <AnimatePresence mode="wait">
                <ProjectCaption key={`${projects[active].slug}-${lang}`} project={projects[active]} />
              </AnimatePresence>
              <ProgressRail active={active} trackRef={track} />
            </div>
            <Laptop project={projects[active]} />
          </div>
        </div>
      </div>
    </section>
  )
}
