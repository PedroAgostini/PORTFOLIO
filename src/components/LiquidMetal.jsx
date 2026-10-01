import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

// Chrome with a faint warm cast (colour-burn tint), so the metal belongs to the crimson palette.
const BASE_UNIFORMS = {
  u_colorBack: [0, 0, 0, 0],
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  // As in the reference: an oversized circle, so the chrome bump wraps the whole pill.
  u_isImage: false,
  u_scale: 8,
  u_rotation: 0,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
  u_imageAspectRatio: 1,
}

const REST = 0.6
const HOVER = 1
const BURST = 2.4

const supportsAnimatedRim = () => {
  const connection = navigator.connection
  const memory = navigator.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  return (
    !window.matchMedia('(pointer: coarse)').matches &&
    !connection?.saveData &&
    memory > 4 &&
    cores > 4
  )
}

/**
 * Liquid-metal button: an animated chrome rim (paper-design LiquidMetal shader)
 * around a solid core. Hover speeds the metal up, a click bursts it and leaves a ripple.
 * Pauses off screen, freezes under reduced motion, falls back to a CSS rim without WebGL.
 */
// Colour-burn tints. "ember" pulls the chrome toward the hero's red flow field.
const TINTS = {
  live: [1, 0.86, 0.88, 1],
  dark: [1, 0.86, 0.88, 1],
  ember: [1, 0.42, 0.5, 1],
  ivory: [1, 0.42, 0.5, 1],
}

export function LiquidMetal({ as: Tag = 'a', size = 'md', tone = 'ember', className = '', children, onClick, ...rest }) {
  const rimRef = useRef(null)
  const rootRef = useRef(null)
  const mount = useRef(null)
  const hovered = useRef(false)
  const reduced = useReducedMotion()
  const [fallback, setFallback] = useState(true)
  const [shaderRequested, setShaderRequested] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState([])
  const rippleId = useRef(0)

  useEffect(() => {
    if (!shaderRequested || reduced || !supportsAnimatedRim()) {
      setFallback(true)
      return undefined
    }

    let cancelled = false
    let io

    import('@paper-design/shaders')
      .then(({ ShaderMount, liquidMetalFragmentShader, LiquidMetalShapes, ShaderFitOptions }) => {
        if (cancelled || !rimRef.current || !rootRef.current) return
        const uniforms = {
          ...BASE_UNIFORMS,
          u_colorTint: TINTS[tone] ?? TINTS.live,
          u_shape: LiquidMetalShapes.circle,
          u_fit: ShaderFitOptions.contain,
        }
        const instance = new ShaderMount(
          rimRef.current,
          liquidMetalFragmentShader,
          uniforms,
          { alpha: true, premultipliedAlpha: false },
          hovered.current ? HOVER : REST,
          12000,
        )
        if (cancelled) {
          instance.dispose()
          return
        }
        mount.current = instance
        setFallback(false)

        // Rest while scrolled away: a button nobody can see does not need to shimmer.
        io = new IntersectionObserver(([entry]) => {
          instance.setSpeed(entry.isIntersecting ? (hovered.current ? HOVER : REST) : 0)
        })
        io.observe(rootRef.current)
      })
      .catch((err) => {
        if (!cancelled) console.warn('[LiquidMetal] WebGL unavailable, using CSS rim', err)
      })

    return () => {
      cancelled = true
      io?.disconnect()
      mount.current?.dispose()
      mount.current = null
    }
  }, [reduced, shaderRequested, tone])

  const setSpeed = (s) => {
    if (!reduced) mount.current?.setSpeed(s)
  }

  const handleClick = (e) => {
    setSpeed(BURST)
    setTimeout(() => setSpeed(hovered.current ? HOVER : REST), 300)
    const r = rootRef.current.getBoundingClientRect()
    const id = rippleId.current++
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples((list) => list.filter((p) => p.id !== id)), 650)
    onClick?.(e)
  }

  return (
    <Tag
      ref={rootRef}
      className={`lm lm--${size} lm--${tone}${pressed ? ' is-pressed' : ''}${fallback ? ' lm--fallback' : ''} ${className}`}
      onPointerEnter={() => {
        hovered.current = true
        if (!reduced && supportsAnimatedRim()) setShaderRequested(true)
        setSpeed(HOVER)
      }}
      onPointerLeave={() => {
        hovered.current = false
        setPressed(false)
        setSpeed(REST)
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onFocus={() => {
        hovered.current = true
        if (!reduced && supportsAnimatedRim()) setShaderRequested(true)
        setSpeed(HOVER)
      }}
      onBlur={() => {
        hovered.current = false
        setSpeed(REST)
      }}
      onClick={handleClick}
      {...rest}
    >
      <span className="lm-rim" ref={rimRef} aria-hidden="true" />
      <span className="lm-core" aria-hidden="true" />
      <span className="lm-label">{children}</span>
      {ripples.map((p) => (
        <span key={p.id} className="lm-ripple" style={{ left: p.x, top: p.y }} aria-hidden="true" />
      ))}
    </Tag>
  )
}
