import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { useReducedMotion } from '../lib/useReducedMotion'

// The spot sweeps across the sentence: each word comes out of the dark as you read.
export function Statement() {
  const { t, lang } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.fromTo(
        '.statement-word',
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 72%', end: 'center center', scrub: true },
        },
      )
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section className="statement section" data-chapter="statement" ref={root}>
      <p className="statement-text">
        {t.statement.split(' ').map((w, i) => (
          <span className="statement-word" key={`${w}-${i}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
