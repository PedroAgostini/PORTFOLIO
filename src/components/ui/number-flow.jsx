import { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'

/**
 * NumberFlow (number-flow.barvian.me) that counts from 0 to `value` the first time it
 * scrolls into view. Digits roll in place, so the surrounding words never shift.
 * Reduced motion: NumberFlow skips the roll and shows the final value.
 */
export function CountUp({ value, className }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(value)
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={shown}
        trend={1}
        transformTiming={{ duration: 1600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        spinTiming={{ duration: 1600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden="true"
      />
      {/* Screen readers get the final number straight away, not the rolling digits. */}
      <span className="sr-only">{value}</span>
    </span>
  )
}
