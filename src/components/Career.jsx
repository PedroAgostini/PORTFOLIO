import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { useReducedMotion } from '../lib/useReducedMotion'
import { Words } from './Icons'

// The professional path, in chronological order, leading into web development.
// The rail draws itself as you read; the seat Pedro sits in today is the only one lit.
export function Career() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()
  const c = t.career

  useGSAP(
    () => {
      if (reduced) return
      gsap.from('.career-title .w > span', {
        yPercent: 108,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      })
      gsap.from('.career-sub', {
        autoAlpha: 0,
        y: 14,
        duration: 1,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      })
      gsap.fromTo(
        '.career-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.career-list', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
        },
      )
      gsap.utils.toArray('.career-item').forEach((item) => {
        gsap.from(item.children, {
          autoAlpha: 0,
          y: 22,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: item, start: 'top 80%' },
        })
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="trajetoria" className="career section" ref={root}>
      <h2 className="career-title">
        <Words text={c.title} />
      </h2>
      <p className="career-sub">{c.sub}</p>

      <div className="career-track">
      <span className="career-rail" aria-hidden="true">
        <span className="career-rail-fill" />
      </span>
      <ol className="career-list">
        {c.items.map((item) => (
          <li key={item.years} className={`career-item${item.current ? ' is-current' : ''}`}>
            <p className="career-years mono">
              <span className="career-node" aria-hidden="true">
                {item.current && <span className="live-dot" />}
              </span>
              {item.years}
              {item.current && <span className="career-now"> {c.now}</span>}
            </p>
            <div className="career-head">
              <h3 className="career-role">{item.role}</h3>
              <p className="career-org mono">
                {item.org} · {item.place}
              </p>
            </div>
            <p className="career-text">{item.text}</p>
          </li>
        ))}
      </ol>
      </div>
    </section>
  )
}
