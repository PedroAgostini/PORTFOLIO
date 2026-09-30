import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { GITHUB, LINKEDIN } from '../i18n/strings'
import { useReducedMotion } from '../lib/useReducedMotion'
import { GitHub, LinkedIn, Words } from './Icons'

const ABOUT_CARD = `${import.meta.env.BASE_URL}img/pedro-card.webp`

// The presenter enters with the copy, directly over the site background.
export function About() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.set('.about-card--main', {
        autoAlpha: 0.68,
        filter: 'brightness(0.06) contrast(1.7) saturate(0.25)',
      })
      gsap.set('.about-card--echo', { autoAlpha: 0 })

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 72%',
          once: true,
        },
      })

      cardTl
        .set('.about-card-shell, .about-card', { willChange: 'transform, filter, clip-path, opacity' })
        .to('.about-card--main', { autoAlpha: 0.82, x: 9, filter: 'brightness(0.26) contrast(1.8) saturate(0.5)', duration: 0.08, ease: 'none' }, 0.16)
        .to('.about-card--main', { autoAlpha: 0.7, x: -8, filter: 'brightness(0.1) contrast(1.9) saturate(0.3)', duration: 0.1, ease: 'none' }, 0.25)
        .to('.about-card--main', { autoAlpha: 0.88, x: 5, filter: 'brightness(0.42) contrast(1.65) saturate(0.68)', duration: 0.1, ease: 'none' }, 0.5)
        .to('.about-card--main', { autoAlpha: 0.74, x: -5, filter: 'brightness(0.16) contrast(1.85) saturate(0.38)', duration: 0.14, ease: 'none' }, 0.62)
        .to('.about-card--main', { autoAlpha: 0.92, x: 6, filter: 'brightness(0.58) contrast(1.5) saturate(0.82)', duration: 0.12, ease: 'none' }, 0.94)
        .to('.about-card--main', { autoAlpha: 0.78, x: -3, filter: 'brightness(0.24) contrast(1.72) saturate(0.48)', duration: 0.14, ease: 'none' }, 1.08)
        .to('.about-card--main', { autoAlpha: 1, x: 2, filter: 'brightness(0.78) contrast(1.25) saturate(0.92)', duration: 0.16, ease: 'none' }, 1.38)
        .to('.about-card--main', { x: 0, filter: 'brightness(1) contrast(1) saturate(1)', duration: 0.78, ease: 'expo.out' }, 1.62)
        .to('.about-card--echo-red', { autoAlpha: 0.88, x: 17, clipPath: 'inset(10% 0 70% 0)', duration: 0.1, ease: 'none' }, 0.06)
        .to('.about-card--echo-red', { autoAlpha: 0, x: -11, clipPath: 'inset(52% 0 26% 0)', duration: 0.12, ease: 'none' }, 0.18)
        .to('.about-card--echo-red', { autoAlpha: 0.76, x: 13, clipPath: 'inset(66% 0 12% 0)', duration: 0.11, ease: 'none' }, 0.42)
        .to('.about-card--echo-red', { autoAlpha: 0.16, x: -9, clipPath: 'inset(24% 0 56% 0)', duration: 0.16, ease: 'none' }, 0.56)
        .to('.about-card--echo-red', { autoAlpha: 0.7, x: 11, clipPath: 'inset(44% 0 34% 0)', duration: 0.12, ease: 'none' }, 0.88)
        .to('.about-card--echo-red', { autoAlpha: 0.22, x: -6, clipPath: 'inset(16% 0 64% 0)', duration: 0.14, ease: 'none' }, 1.02)
        .to('.about-card--echo-red', { autoAlpha: 0.58, x: 8, clipPath: 'inset(72% 0 8% 0)', duration: 0.12, ease: 'none' }, 1.3)
        .to('.about-card--echo-red', { autoAlpha: 0, x: 0, duration: 0.34, ease: 'expo.out' }, 1.7)
        .to('.about-card--echo-light', { autoAlpha: 0.7, x: -14, clipPath: 'inset(62% 0 18% 0)', duration: 0.1, ease: 'none' }, 0.12)
        .to('.about-card--echo-light', { autoAlpha: 0.08, x: 10, clipPath: 'inset(18% 0 62% 0)', duration: 0.14, ease: 'none' }, 0.26)
        .to('.about-card--echo-light', { autoAlpha: 0.62, x: -12, clipPath: 'inset(34% 0 46% 0)', duration: 0.12, ease: 'none' }, 0.7)
        .to('.about-card--echo-light', { autoAlpha: 0.14, x: 7, clipPath: 'inset(70% 0 12% 0)', duration: 0.16, ease: 'none' }, 0.84)
        .to('.about-card--echo-light', { autoAlpha: 0.54, x: -8, clipPath: 'inset(26% 0 54% 0)', duration: 0.12, ease: 'none' }, 1.18)
        .to('.about-card--echo-light', { autoAlpha: 0, x: 0, duration: 0.38, ease: 'expo.out' }, 1.62)
        .set('.about-card-shell, .about-card', { clearProps: 'willChange,filter,transform,clipPath,opacity,visibility' }, 2.42)

      const copyTl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 72%' } })
      copyTl
        .from('.about-title .w > span', { yPercent: 108, duration: 1.2, ease: 'expo.out', stagger: 0.06 })
        .from('.about-body > p, .about-motto', { autoAlpha: 0, y: 16, duration: 1, ease: 'expo.out', stagger: 0.12 }, 0.24)
        .from('.about-links > *', { autoAlpha: 0, y: 10, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, 0.52)
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="about" className="about section" data-chapter="about" ref={root}>
      <figure className="about-portrait">
        <div className="about-card-shell">
          <img
            className="about-card about-card--main"
            src={ABOUT_CARD}
            alt={t.about.portraitAlt}
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
          />
          <img
            className="about-card about-card--echo about-card--echo-red"
            src={ABOUT_CARD}
            alt=""
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
          <img
            className="about-card about-card--echo about-card--echo-light"
            src={ABOUT_CARD}
            alt=""
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        </div>
      </figure>
      <div className="about-copy">
        <h2 className="about-title">
          <Words text={t.about.title} />
        </h2>
        <div className="about-body">
          {t.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <blockquote className="about-motto matrix-frame">
            <p className="about-motto-text">
              {t.about.motto.parts.map((part, index) =>
                part.strong ? <strong key={`${part.text}-${index}`}>{part.text}</strong> : <span key={`${part.text}-${index}`}>{part.text}</span>,
              )}
            </p>
            <span className="matrix-frame-corner matrix-frame-corner--tl" aria-hidden="true" />
            <span className="matrix-frame-corner matrix-frame-corner--tr" aria-hidden="true" />
            <span className="matrix-frame-corner matrix-frame-corner--bl" aria-hidden="true" />
            <span className="matrix-frame-corner matrix-frame-corner--br" aria-hidden="true" />
          </blockquote>
        </div>
        <div className="about-links">
          <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <LinkedIn />
            LinkedIn
          </a>
          <a className="btn btn-ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
            <GitHub />
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
