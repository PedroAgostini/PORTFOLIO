import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Odometer count-up in the light DOM: each digit is a column that rolls into place,
 * like NumberFlow, but rendered as plain text so it inherits the headline's font,
 * weight and baseline in every engine (NumberFlow's shadow DOM drifts in Safari).
 *
 * A hidden "ghost" digit keeps the real baseline and width; the rolling column sits on
 * top of it and is clipped with clip-path (overflow would move the baseline).
 */
export function CountUp({ value, className }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setOn(true)
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const digits = String(value).split('').map(Number)
  const n = digits.length

  return (
    <span ref={ref} className={`odo ${className ?? ''}${on || reduced ? ' is-on' : ''}`}>
      <span className="odo-digits" aria-hidden="true">
        {digits.map((d, i) => {
          // Ticks this column passes from 0 to `value` (units spin most, like a real counter).
          const place = n - 1 - i
          const steps = Math.floor(value / 10 ** place)
          const column = Array.from({ length: steps + 1 }, (_, s) => s % 10)
          return (
            <span className="odo-digit" key={i} style={{ '--steps': steps, '--rows': steps + 1 }}>
              <span className="odo-ghost">{d}</span>
              <span className="odo-col">
                {column.map((c, s) => (
                  // Leading zeros of the higher columns stay blank, so it reads "0", not "00".
                  <span key={s}>{s === 0 && place > 0 ? ' ' : c}</span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
