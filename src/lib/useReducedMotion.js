import { useEffect, useState } from 'react'

// Touch devices and constrained hardware favor immediate, static presentation.
// This keeps the same content and styling while avoiding expensive reveal loops,
// smooth-scroll interception and WebGL effects where they are most likely to jank.
const MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const QUERY = `${MOTION_QUERY}, (pointer: coarse)`

const shouldReduce = () =>
  window.matchMedia(QUERY).matches ||
  navigator.connection?.saveData ||
  (navigator.deviceMemory ?? 8) <= 4 ||
  (navigator.hardwareConcurrency ?? 8) <= 4

export function useReducedMotion() {
  const [reduced, setReduced] = useState(shouldReduce)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const connection = navigator.connection
    const onChange = () => setReduced(shouldReduce())
    mq.addEventListener('change', onChange)
    connection?.addEventListener?.('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      connection?.removeEventListener?.('change', onChange)
    }
  }, [])
  return reduced
}

/** Accessibility preference only, for effects that provide their own low-cost mobile mode. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(MOTION_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOTION_QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** WebGL is optional: the stage falls back to a static set without it. */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
