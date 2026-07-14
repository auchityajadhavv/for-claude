import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './AmbientField.css'

function softTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, '#fff')
  gr.addColorStop(0.25, 'rgba(255,255,255,0.75)')
  gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.Texture(c)
  t.needsUpdate = true
  return t
}

/** Orbit rings echoing the REVORA mark + a glowing dot travelling each ring. */
function Orbits({ tex, reduced }: { tex: THREE.Texture; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const dots = useRef<THREE.Sprite[]>([])

  const rings = useMemo(
    () => [
      { r: 2.6, rot: [1.35, 0.2, 0.1], color: '#7c3aed', speed: 0.5, phase: 0 },
      { r: 3.5, rot: [1.1, -0.5, 0.3], color: '#8b5cf6', speed: -0.38, phase: 2 },
      { r: 4.5, rot: [1.5, 0.4, -0.2], color: '#9a7fd6', speed: 0.28, phase: 4 },
    ],
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current && !reduced) {
      group.current.rotation.y = Math.sin(t * 0.08) * 0.15
      group.current.rotation.x = Math.cos(t * 0.06) * 0.08
    }
    // travel each dot around its ring
    rings.forEach((ring, i) => {
      const dot = dots.current[i]
      if (!dot) return
      const a = reduced ? ring.phase : t * ring.speed + ring.phase
      dot.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0)
    })
  })

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <group key={i} rotation={ring.rot as [number, number, number]}>
          <mesh>
            <torusGeometry args={[ring.r, 0.008, 8, 128]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.5} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
          <sprite
            ref={(el) => el && (dots.current[i] = el)}
            scale={[0.42, 0.42, 0.42]}
          >
            <spriteMaterial map={tex} color="#e9deff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        </group>
      ))}
    </group>
  )
}

function Motes({ tex, reduced }: { tex: THREE.Texture; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => {
    const N = 260
    const positions = new Float32Array(N * 3)
    const colors = new Float32Array(N * 3)
    const pal = [
      [0.55, 0.45, 0.85],
      [0.7, 0.62, 0.92],
      [0.9, 0.86, 1],
    ]
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = -Math.random() * 10 - 1
      const c = pal[(Math.random() * pal.length) | 0]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (ref.current && !reduced) ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexColors opacity={0.9} sizeAttenuation />
    </points>
  )
}

function Rig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (reduced) return
    const p = pointer
    target.current.x += (p.x - target.current.x) * 0.05
    target.current.y += (p.y - target.current.y) * 0.05
    camera.position.x += (target.current.x * 1.1 - camera.position.x) * 0.05
    camera.position.y += (-target.current.y * 0.7 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

// module-level pointer, fed by window listeners (set once)
const pointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
  })
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return
    pointer.x = Math.max(-1, Math.min(1, e.gamma / 30))
    pointer.y = Math.max(-1, Math.min(1, ((e.beta ?? 45) - 45) / 30))
  })
}

export default function AmbientField() {
  const reduced = useReducedMotion()
  const tex = useMemo(() => softTexture(), [])

  return (
    <div className="ambient" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 46 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Orbits tex={tex} reduced={reduced} />
        <Motes tex={tex} reduced={reduced} />
        <Rig reduced={reduced} />
        {/* big soft glow behind */}
        <sprite position={[2.5, 0.5, -6]} scale={[16, 16, 1]}>
          <spriteMaterial map={tex} color="#4a2f8f" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </sprite>
      </Canvas>
    </div>
  )
}
