import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

const TECH_ASSETS = {
  React: { src: '/logos/tech/react-seeklogo.png' },
  'Next.js': { src: '/logos/tech/next-js-seeklogo.svg', tone: 'light' },
  TypeScript: { src: '/logos/tech/Typescript.webp' },
  JavaScript: { src: '/logos/tech/javascript.png' },
  'Node.js': { src: '/logos/tech/nodejs.svg', shape: 'wide' },
  'Tailwind CSS': { src: '/logos/tech/tailwind-css-logo-vector.svg', shape: 'wide', tone: 'light' },
  WordPress: { src: '/logos/tech/WordPress_blue_logo.webp' },
  PHP: { src: '/logos/tech/PHP-logo.webp', shape: 'wide' },
  Laravel: { src: '/logos/tech/Laravel.webp', shape: 'wide' },
  MySQL: { src: '/logos/tech/mysql-official.svg', shape: 'wide' },
  Oracle: { src: '/logos/tech/Oracle_logo.webp', shape: 'wide' },
  Python: { src: '/logos/tech/Python-logo-notext.webp' },
  'Power BI': { src: '/logos/tech/microsoft-power-bi.webp' },
  'C++': { src: '/logos/tech/c++.webp' },
  Claude: { src: '/logos/tech/claude-ai-icon.webp' },
  Codex: { src: '/logos/tech/codex-icon.webp' },
}

function TechnologySet({ technologies, duplicate = false }) {
  return (
    <ul className="tech-marquee-set" aria-hidden={duplicate || undefined}>
      {technologies.map((name) => {
        const asset = TECH_ASSETS[name]

        if (!asset) return null

        const logoClass = [
          'tech-marquee-logo',
          asset.shape === 'wide' ? 'tech-marquee-logo--wide' : '',
          asset.tone === 'light' ? 'tech-marquee-logo--light' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <li className="tech-marquee-item" key={`${duplicate ? 'copy-' : ''}${name}`}>
            <span className="tech-marquee-mark">
              <img className={logoClass} src={asset.src} alt={duplicate ? '' : name} loading="lazy" decoding="async" />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function TechnologyMarquee({ label, technologies, showLabel = true }) {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (reduced) return undefined

    const element = root.current
    if (!element) return undefined

    let inView = false
    const sync = () => setRunning(inView && !document.hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { rootMargin: '12% 0px' },
    )

    observer.observe(element)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reduced])

  return (
    <div className={`tech-marquee${running ? ' is-running' : ''}`} ref={root} aria-label={label}>
      {showLabel && (
        <div className="tech-marquee-head">
          <h3>{label}</h3>
        </div>
      )}
      <div className="tech-marquee-viewport">
        <div className="tech-marquee-track">
          <TechnologySet technologies={technologies} />
          <TechnologySet technologies={technologies} duplicate />
        </div>
      </div>
    </div>
  )
}
