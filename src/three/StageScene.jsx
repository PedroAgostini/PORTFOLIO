import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, SpotLight } from '@react-three/drei'
import * as THREE from 'three'
import { MacBook } from './MacBook'
import { stage } from '../lib/stage'

const AIR = '#1a1a1a'

// Lets scroll code pause the render loop when the stage is off screen.
function FrameloopBridge() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const get = useThree((s) => s.get)
  useEffect(() => {
    if (import.meta.env.DEV) window.__three = get
    stage.setFrameloop = setFrameloop
    setFrameloop(stage.visible ? 'always' : 'never')
    return () => {
      stage.setFrameloop = null
    }
  }, [setFrameloop, get])
  return null
}

// One hard key light from the rig. House lights come up with a flicker, then it tracks the machine.
function KeyLight() {
  const spot = useRef()
  // Phones get a narrow beam: one light on a black stage, never a full-frame fog.
  const narrow = useThree((s) => s.size.width < 900)
  const born = useRef(0)
  const target = useRef(new THREE.Object3D())
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const t = target.current
    scene.add(t)
    spot.current.target = t
    return () => scene.remove(t)
  }, [scene])

  useFrame((three, delta) => {
    born.current += delta
    const haze = three.size.width >= 900 ? 1 : 0.55
    const t = born.current
    const flicker = t < 0.35 ? 0 : t < 0.42 ? 0.7 : t < 0.52 ? 0.12 : t < 0.6 ? 0.9 : t < 0.66 ? 0.4 : 1
    const tgt = target.current.position
    tgt.x = THREE.MathUtils.damp(tgt.x, stage.rig.x, 5, delta)
    tgt.y = THREE.MathUtils.damp(tgt.y, stage.rig.y, 5, delta)
    spot.current.position.x = THREE.MathUtils.damp(spot.current.position.x, stage.rig.x * 0.85, 5, delta)
    spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, 95 * flicker * (1 - stage.exit * 0.7), 12, delta)
    const cone = spot.current.children[0]?.material
    if (cone) cone.opacity = flicker * 0.44 * haze * (1 - stage.exit)
  })

  return (
    <SpotLight
      ref={spot}
      position={[0, 6.4, 0.8]}
      angle={narrow ? 0.2 : 0.34}
      penumbra={0.32}
      decay={1.4}
      distance={14}
      attenuation={10}
      anglePower={2.2}
      intensity={0}
      color="#fff4ee"
      volumetric
      radiusTop={0.06}
      radiusBottom={narrow ? 1.2 : 2.5}
      opacity={0.62}
    />
  )
}

function Rig({ projects }) {
  return (
    <>
      <fog attach="fog" args={[AIR, 10, 24]} />
      <ambientLight intensity={0.08} />
      <KeyLight />
      <directionalLight position={[-5, 2.5, 4]} intensity={0.25} color="#dfe6ff" />
      <Environment resolution={512} frames={1}>
        {/* the long strip that draws the specular streak along the aluminium */}
        <Lightformer form="rect" intensity={5} position={[0, 4, 3.5]} scale={[16, 0.35, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -1.5]} scale={[10, 1.2, 1]} />
        {/* big soft box up and behind: what the deck and trackpad mirror from the audience's eye line */}
        <Lightformer form="rect" intensity={1.6} position={[0, 7, -7]} scale={[18, 8, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 1.2, 1]} scale={[2.2, 6, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[6, 1.2, 1]} scale={[2.2, 6, 1]} />
        <Lightformer form="rect" intensity={0.35} position={[0, 0.5, 8]} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#e60039" position={[0, -2, -6]} scale={2.5} />
      </Environment>
      <MacBook projects={projects} />
      <FrameloopBridge />
    </>
  )
}

export default function StageScene({ projects, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.25, 8.2], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1
        gl.setClearColor(AIR, 1)
        camera.lookAt(0, 0, 0)
        onReady?.()
      }}
      aria-hidden="true"
    >
      <Rig projects={projects} />
    </Canvas>
  )
}
