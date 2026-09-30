import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)
if (import.meta.env.DEV) window.__ST = ScrollTrigger

const LenisContext = createContext(null)

// Damped, inertial scroll shared with ScrollTrigger. Reduced motion keeps native scroll.
export function SmoothScroll({ children }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState(null)

  // Trigger positions depend on final type metrics: re-measure once fonts land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.4 })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Scroll to an anchor, element or y offset through Lenis when present, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target) => {
    if (typeof target === 'number') {
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
      else window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}
