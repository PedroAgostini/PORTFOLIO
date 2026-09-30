import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { whatsappLink } from '../i18n/strings'
import { useReducedMotion } from '../lib/useReducedMotion'
import { WhatsApp, Words } from './Icons'
import { LiquidMetal } from './LiquidMetal'
import { Magnetic } from './Magnetic'

export function Contact() {
  const { t } = useLang()
  const root = useRef(null)
  const reduced = useReducedMotion()

  // "One more thing." The line lands directly over the moving field.
  useGSAP(
    () => {
      if (reduced) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%' } })
      tl.from('.contact-title .w > span', { yPercent: 108, duration: 1.2, ease: 'expo.out', stagger: 0.09 })
        .from('.contact-lead .w > span', { yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.03 }, 0.4)
        .from('.contact-primary', { autoAlpha: 0, y: 16, duration: 1, ease: 'expo.out' }, 0.65)
    },
    { scope: root, dependencies: [t], revertOnUpdate: true },
  )

  return (
    <section id="contact" className="contact section" data-chapter="contact" ref={root}>
      <div className="contact-intro matrix-frame">
        <h2 className="contact-title">
          <Words text={t.contact.kicker} />
        </h2>
        <p className="contact-lead">
          <Words text={t.contact.title} />
        </p>
        <div className="contact-primary">
          <Magnetic>
            <LiquidMetal href={whatsappLink(t.hero.whatsappText)} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {t.contact.whatsapp}
            </LiquidMetal>
          </Magnetic>
          <p className="contact-hint">{t.contact.whatsappHint}</p>
        </div>
        <span className="matrix-frame-corner matrix-frame-corner--tl" aria-hidden="true" />
        <span className="matrix-frame-corner matrix-frame-corner--tr" aria-hidden="true" />
        <span className="matrix-frame-corner matrix-frame-corner--bl" aria-hidden="true" />
        <span className="matrix-frame-corner matrix-frame-corner--br" aria-hidden="true" />
      </div>
    </section>
  )
}
