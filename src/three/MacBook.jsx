import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { stage, range, smooth } from '../lib/stage'

// Proportions of a 14" laptop, in scene units.
const W = 3.0
const D = 2.08
const BASE_H = 0.07
const LID_H = 0.034
const HINGE_Y = BASE_H + 0.003
const HINGE_Z = -D / 2 + 0.035
const LID_D = D - 0.03
const SCREEN_W = 2.8
const SCREEN_H = SCREEN_W / 1.6
const OPEN_ANGLE = THREE.MathUtils.degToRad(104)
const TAU = Math.PI * 2

// Keyboard layout: [keys in row, key height, special widths by index]
const ROWS = [
  { n: 14, h: 0.07 },
  { n: 14, h: 0.135 },
  { n: 14, h: 0.135, wide: { 0: 1.45 } },
  { n: 13, h: 0.135, wide: { 0: 1.75, 12: 1.75 } },
  { n: 12, h: 0.135, wide: { 0: 2.25, 11: 2.25 } },
  { n: 10, h: 0.135, wide: { 4: 5.2 } },
]
const WELL_W = 2.62
const WELL_D = 1.02
const GAP = 0.018

/** Individual keycaps in one draw call. */
function Keys() {
  const ref = useRef()
  const layout = useMemo(() => {
    const keys = []
    let z = -WELL_D / 2 + 0.03
    for (const row of ROWS) {
      const units = Array.from({ length: row.n }, (_, i) => row.wide?.[i] ?? 1)
      const total = units.reduce((a, b) => a + b, 0)
      const unitW = (WELL_W - 0.06 - GAP * (row.n - 1)) / total
      let x = -WELL_W / 2 + 0.03
      units.forEach((u) => {
        const w = u * unitW + (u - 1) * GAP * 0
        keys.push({ x: x + w / 2, z: z + row.h / 2, w, d: row.h })
        x += w + GAP
      })
      z += row.h + GAP
    }
    return keys
  }, [])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    layout.forEach((k, i) => {
      m.compose(new THREE.Vector3(k.x, 0.006, k.z), new THREE.Quaternion(), new THREE.Vector3(k.w, 0.012, k.d))
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [layout])

  return (
    <instancedMesh ref={ref} args={[null, null, layout.length]} position={[0, BASE_H - 0.004, -0.3]}>
      <boxGeometry />
      <meshStandardMaterial color="#121315" roughness={0.62} metalness={0.05} />
    </instancedMesh>
  )
}

/** Keeps only the current and next screen textures alive on the GPU. */
function useScreenTextures(projects, small) {
  const gl = useThree((s) => s.gl)
  const cache = useRef(new Map())
  const loader = useMemo(() => new THREE.TextureLoader(), [])

  const ensure = (i) => {
    if (i < 0 || i >= projects.length || cache.current.has(i)) return
    const entry = { tex: null, aspect: 1 }
    cache.current.set(i, entry)
    const src = small ? projects[i].image.replace('.webp', '-sm.webp') : projects[i].image
    loader.load(src, (tex) => {
      if (cache.current.get(i) !== entry) return tex.dispose()
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
      entry.aspect = tex.image.width / tex.image.height
      entry.tex = tex
    })
  }

  const keepOnly = (keep) => {
    for (const [i, entry] of cache.current) {
      if (!keep.includes(i)) {
        entry.tex?.dispose()
        cache.current.delete(i)
      }
    }
  }

  useEffect(
    () => () => {
      for (const entry of cache.current.values()) entry.tex?.dispose()
      cache.current.clear()
    },
    [],
  )

  return { cache, ensure, keepOnly }
}

// Screen autoplay: rest at the top, glide down the page, rest, glide back.
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
function autoScroll(t, frac) {
  const screens = 1 / Math.max(frac, 0.05)
  const down = THREE.MathUtils.clamp(screens * 2.1, 7, 20)
  const up = 2.2
  const restTop = 1.4
  const restBottom = 1.6
  const cycle = restTop + down + restBottom + up
  const k = t % cycle
  if (k < restTop) return 0
  if (k < restTop + down) return easeInOut((k - restTop) / down)
  if (k < restTop + down + restBottom) return 1
  return 1 - easeInOut((k - restTop - down - restBottom) / up)
}

function radialTexture(stops) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  stops.forEach(([o, col]) => grd.addColorStop(o, col))
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

export function MacBook({ projects }) {
  const size = useThree((s) => s.size)
  const small = size.width < 700
  const { cache, ensure, keepOnly } = useScreenTextures(projects, small)

  const rig = useRef()
  const body = useRef()
  const hinge = useRef()
  const screenMat = useRef()
  const shadow = useRef()
  const floor = useRef()

  const st = useRef({ idx: -1, shownIdx: -1, play: 0, power: 0, rotY: -0.5 })

  // Bead-blasted, lightly brushed aluminium: anisotropy stretches the spot into a long streak.
  const aluminium = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#d3d6db',
        metalness: 1,
        roughness: 0.27,
        anisotropy: 0.55,
        envMapIntensity: 1.25,
        clearcoat: 0.12,
        clearcoatRoughness: 0.35,
      }),
    [],
  )
  // The lid top faces the key light head-on: darker albedo and a touch rougher so it reads
  // as silver aluminium under the spot instead of blowing out to white.
  const lidMetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#a9adb3',
        metalness: 1,
        roughness: 0.36,
        anisotropy: 0.55,
        envMapIntensity: 0.85,
      }),
    [],
  )
  // A polished, unbranded mark: the mirror finish catches the spot as the machine turns.
  const mark = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#e9ebee', metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }),
    [],
  )
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#030304', roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04 }),
    [],
  )
  const shadowTex = useMemo(
    () => radialTexture([[0, 'rgba(0,0,0,0.9)'], [0.5, 'rgba(0,0,0,0.45)'], [1, 'rgba(0,0,0,0)']]),
    [],
  )
  // Floor alpha: solid in the middle, gone well before the edge, so the stage floor never shows a rim.
  const floorAlpha = useMemo(
    () => radialTexture([[0, '#fff'], [0.45, '#fff'], [0.8, '#555'], [1, '#000']]),
    [],
  )

  useFrame((three, rawDelta) => {
    // A long first frame (or a return from a background tab) must not teleport the choreography.
    const delta = Math.min(rawDelta, 1 / 20)
    const s = st.current
    const { pointer } = three
    const v = three.viewport.getCurrentViewport(three.camera, [0, 0, 0])
    const desktop = three.size.width >= 900
    const n = projects.length

    // ── which project is on stage
    const w = stage.work * n
    const idx = Math.min(n - 1, Math.floor(w))
    const local = stage.work >= 1 ? 1 : w - idx
    ensure(idx)
    ensure(idx + 1)
    if (idx !== s.idx) {
      s.idx = idx
      keepOnly([idx, idx + 1, idx - 1])
    }

    // ── choreography, all damped: nothing snaps
    const intro = smooth(stage.intro)
    const exit = smooth(stage.exit)
    const inWork = stage.work > 0.0005
    const open = inWork ? smooth(range(local, 0.02, 0.22)) * (1 - smooth(range(local, 0.8, 0.95))) : 0
    const spin = inWork ? smooth(range(local, 0.86, 1)) : 0

    // Fit rule: the machine's widest 3/4 silhouette (~1.25 × W) stays inside the gutters.
    const workScale = desktop
      ? THREE.MathUtils.clamp((v.width * 0.37) / W, 0.55, 1.2)
      : THREE.MathUtils.clamp((v.width * 0.56) / W, 0.3, 1.05)
    const scale = workScale * THREE.MathUtils.lerp(0.85, 1, intro)

    // The opening belongs to the shader: the machine waits below the fold, already
    // lined up with its work position, and rises into view as the hero scrolls away.
    const workX = desktop ? v.width * 0.19 : 0
    const parkedX = workX
    const parkedY = -v.height / 2 - 2.4
    const workY = desktop ? -0.66 * workScale : v.height * 0.12 - 0.5 * workScale
    const x = THREE.MathUtils.lerp(parkedX, workX, intro)
    const y = THREE.MathUtils.lerp(parkedY, workY, intro) - exit * v.height * 0.9
    const tilt = THREE.MathUtils.lerp(0.42, desktop ? 0.12 : 0.06, intro)

    easing.damp3(rig.current.position, [x, y, 0], 0.28, delta)
    easing.damp3(rig.current.scale, [scale, scale, scale], 0.3, delta)
    easing.damp(rig.current.rotation, 'x', tilt + pointer.y * 0.04, 0.35, delta)
    stage.rig.set(rig.current.position.x, rig.current.position.y, 0)

    const settle = desktop ? -0.4 : -0.22
    const targetRot = THREE.MathUtils.lerp(-0.55, settle, intro) + TAU * (idx + spin) * (inWork ? 1 : 0) + pointer.x * 0.08
    if (Math.abs(targetRot - s.rotY) > TAU) s.rotY = targetRot - Math.sign(targetRot - s.rotY) * TAU
    s.rotY = THREE.MathUtils.damp(s.rotY, targetRot, 5.5, delta)
    body.current.rotation.y = s.rotY

    easing.damp(hinge.current.rotation, 'x', -open * OPEN_ANGLE, 0.18, delta)

    // ── the screen: swap while closed, power on as it opens, then play the site
    const lidAngle = -hinge.current.rotation.x
    // Swap only while nobody can see it: lid nearly shut, or the screen still dark.
    if (s.shownIdx !== idx && (lidAngle < 0.25 || s.power < 0.05)) {
      s.shownIdx = idx
      s.play = 0
    }
    const entry = cache.current.get(s.shownIdx)
    const mat = screenMat.current
    if (entry?.tex && mat.map !== entry.tex) {
      mat.map = entry.tex
      mat.needsUpdate = true
    }
    const poweredTarget = entry?.tex && lidAngle > 0.9 ? 1 : 0
    s.power = THREE.MathUtils.damp(s.power, poweredTarget, poweredTarget ? 3.2 : 9, delta)
    mat.color.setScalar(s.power)
    if (entry?.tex) {
      const frac = Math.min(1, entry.aspect / 1.6)
      if (s.power > 0.6) s.play += delta
      const pos = autoScroll(s.play, frac)
      entry.tex.repeat.set(1, frac)
      entry.tex.offset.set(0, (1 - frac) * (1 - pos))
    }

    shadow.current.material.opacity = 0.85 * (1 - exit)
    // Phones: the narrow beam keeps the pool small, so the floor can stay; soften it a little behind the caption.
    floor.current.material.opacity = desktop ? 1 : 0.75
  })

  return (
    <group ref={rig}>
      {/* the stage floor: #141414 boards under the #1a1a1a air, lit by the spot above */}
      <mesh ref={floor} rotation-x={-Math.PI / 2} position={[0, -0.006, 0.4]}>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#141414" roughness={0.78} metalness={0.1} alphaMap={floorAlpha} transparent depthWrite={false} />
      </mesh>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} position={[0, -0.002, 0.05]} scale={[W * 1.45, D * 1.4, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.85} />
      </mesh>

      <group ref={body}>
        {/* unibody */}
        <RoundedBox args={[W, BASE_H, D]} radius={0.03} smoothness={6} position={[0, BASE_H / 2, 0]} material={aluminium} />
        {/* keyboard well + keycaps */}
        <mesh rotation-x={-Math.PI / 2} position={[0, BASE_H + 0.0006, -0.3]}>
          <planeGeometry args={[WELL_W, WELL_D]} />
          <meshStandardMaterial color="#0a0a0b" roughness={0.8} />
        </mesh>
        <Keys />
        {/* trackpad: same aluminium, a hair smoother, with its machined edge */}
        <mesh rotation-x={-Math.PI / 2} position={[0, BASE_H + 0.0005, 0.62]}>
          <planeGeometry args={[1.32, 0.8]} />
          <meshPhysicalMaterial color="#8e9196" metalness={1} roughness={0.35} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, BASE_H + 0.001, 0.62]}>
          <planeGeometry args={[1.3, 0.78]} />
          <meshPhysicalMaterial color="#d6d9de" metalness={1} roughness={0.18} anisotropy={0.3} envMapIntensity={1.2} />
        </mesh>
        {/* hinge barrel */}
        <mesh rotation-z={Math.PI / 2} position={[0, HINGE_Y - 0.004, HINGE_Z - 0.012]}>
          <cylinderGeometry args={[0.03, 0.03, W - 0.62, 24]} />
          <meshPhysicalMaterial color="#26272a" metalness={0.9} roughness={0.38} />
        </mesh>

        {/* lid, pivoting on the hinge */}
        <group ref={hinge} position={[0, HINGE_Y, HINGE_Z]}>
          {/* RoundedBox radius must stay under half its height or the lid inflates */}
          <RoundedBox args={[W, LID_H, LID_D]} radius={0.014} smoothness={6} position={[0, LID_H / 2, LID_D / 2]} material={lidMetal} />
          <mesh rotation-x={-Math.PI / 2} position={[0, LID_H + 0.0008, LID_D / 2]} material={mark}>
            <circleGeometry args={[0.15, 48]} />
          </mesh>
          {/* black glass runs edge to edge */}
          <mesh rotation-x={Math.PI / 2} position={[0, -0.0008, LID_D / 2]} material={glass}>
            <planeGeometry args={[W - 0.03, LID_D - 0.03]} />
          </mesh>
          <mesh rotation-x={Math.PI / 2} position={[0, -0.0016, LID_D / 2 + 0.05]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <meshBasicMaterial ref={screenMat} color="black" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
