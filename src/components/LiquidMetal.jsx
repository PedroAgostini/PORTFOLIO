import { useEffect, useRef, useState } from 'react'
import { ShaderMount, liquidMetalFragmentShader, LiquidMetalShapes, ShaderFitOptions } from '@paper-design/shaders'
import { useReducedMotion } from '../lib/useReducedMotion'

// Chrome with a faint warm cast (colour-burn tint), so the metal belongs to the crimson palette.
const UNIFORMS = {
  u_colorBack: [0, 0, 0, 0],
  u_colorTint: [1, 0.86, 0.88, 1],
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  // As in the reference: an oversized circle, so the chrome bump wraps the whole pill.
  u_shape: LiquidMetalShapes.circle,
  u_isImage: false,
  u_fit: ShaderFitOptions.contain,
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
  const [fallback, setFallback] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState([])
  const rippleId = useRef(0)

  useEffect(() => {
    let io
    try {
      const uniforms = { ...UNIFORMS, u_colorTint: TINTS[tone] ?? TINTS.live }
      mount.current = new ShaderMount(rimRef.current, liquidMetalFragmentShader, uniforms, { alpha: true, premultipliedAlpha: false }, reduced ? 0 : REST, 12000)
      // Rest while scrolled away: a button nobody can see does not need to shimmer.
      io = new IntersectionObserver(([entry]) => {
        mount.current?.setSpeed(entry.isIntersecting && !reduced ? (hovered.current ? HOVER : REST) : 0)
      })
      io.observe(rootRef.current)
    } catch (err) {
      console.warn('[LiquidMetal] WebGL unavailable, using CSS rim', err)
      setFallback(true)
    }
    return () => {
      io?.disconnect()
      mount.current?.dispose()
      mount.current = null
    }
  }, [reduced, tone])

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
        setSpeed(HOVER)
      }}
      onPointerLeave={() => {
        hovered.current = false
        setPressed(false)
        setSpeed(REST)
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
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
