import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { GITHUB } from '../i18n/strings'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ArrowUpRight, GitHub, Words } from './Icons'
import { LiquidMetal } from './LiquidMetal'
import { Magnetic } from './Magnetic'
import { TechnologyMarquee } from './ui/TechnologyMarquee'

// A keynote spec sheet for the academic foundation: each degree drawn on its own rule.
export function Education() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()
  const e = t.education

  useGSAP(
    () => {
      if (reduced) return
      gsap.from('.edu-title .w > span', {
        yPercent: 108,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      })
      gsap.utils.toArray('.spec-row').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 84%' } })
        tl.from(row.querySelector('.spec-rule'), { scaleX: 0, duration: 1.4, ease: 'expo.out' })
          .from(row.querySelector('.spec-k'), { autoAlpha: 0, y: 10, duration: 0.9, ease: 'expo.out' }, '-=1.15')
          .from(row.querySelector('.spec-v'), { yPercent: 40, autoAlpha: 0, duration: 1, ease: 'expo.out' }, '-=0.9')
          .from(row.querySelector('.spec-meta'), { autoAlpha: 0, duration: 0.8, ease: 'expo.out' }, '-=0.7')
      })
      gsap.from('.edu-extra > *', {
        autoAlpha: 0,
        y: 14,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.edu-extra', start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section className="education section" ref={root}>
      <h2 className="edu-title">
        <Words text={e.title} />
      </h2>
      <ul className="spec">
        {e.items.map((item) => (
          <li className="spec-row" key={item.v}>
            <span className="spec-rule" aria-hidden="true" />
            <p className="spec-k">{item.k}</p>
            <h3 className="spec-v">{item.v}</h3>
            <p className="spec-meta mono">
              {item.org} · {item.years}
            </p>
          </li>
        ))}
      </ul>

      <div className="edu-extra">
        <TechnologyMarquee label={e.stackLabel} hint={e.stackHint} technologies={e.stack} showLabel={false} />
        <Magnetic className="edu-github">
          <LiquidMetal href={GITHUB} target="_blank" rel="noopener noreferrer">
            <GitHub className="edu-github-icon" />
            {e.code}
            <ArrowUpRight />
          </LiquidMetal>
        </Magnetic>
      </div>
    </section>
  )
}
