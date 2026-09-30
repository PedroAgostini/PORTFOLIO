import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ArrowUpRight, Words } from './Icons'

const TS_LOGO = `${import.meta.env.BASE_URL}logos/web/TS.svg`

// The spec sheet: every site, the company behind it, one click from open.
export function ProjectIndex() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(-1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })

  useGSAP(
    () => {
      if (reduced) return
      gsap.from('.index-title .w > span', {
        yPercent: 108,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      gsap.from('.index-row', {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '.index-list', start: 'top 80%' },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const onMove = (e) => {
    const r = root.current.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section id="index" className="index section" data-chapter="index" ref={root} onPointerMove={onMove}>
      <h2 className="index-title">
        <Words text={t.index.title} />
      </h2>

      <div className="index-head mono" aria-hidden="true">
        <span>{t.index.cols.name}</span>
        <span>{t.index.cols.company}</span>
        <span>{t.index.cols.category}</span>
        <span>{t.index.cols.domain}</span>
      </div>

      <ul className="index-list" onPointerLeave={() => setHover(-1)}>
        {projects.map((p, i) => (
          <li key={p.slug}>
            <a
              className="index-row"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
              data-dim={hover !== -1 && hover !== i ? '' : undefined}
            >
              <span className="index-name">
                <img src={p.wordmark} alt={p.name} className={`index-logo index-logo--${p.slug}`} loading="lazy" decoding="async" />
              </span>
              <span className="index-company">
                <img
                  src={TS_LOGO}
                  alt="Trajetória do Sucesso"
                  width="62"
                  height="48"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="index-cat">{p.category[lang]}</span>
              <span className="index-domain mono">
                <span className="live-dot" aria-hidden="true" />
                <span className="index-domain-text">{p.label}</span>
                <ArrowUpRight className="index-arrow" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {hover !== -1 && (
          <motion.div
            className="index-preview"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.86, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={projects[hover].slug}
                src={projects[hover].thumb}
                alt=""
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
