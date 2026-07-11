import { useContext, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { makeCardFaceTexture, makeWordmarkTexture } from './cardTexture'
import { ProgressContext, seg } from './progress'

const GOLD = '#c9a24b'
const GOLD_DARK = '#8f6f30'

// card dimensions (three units)
const CW = 2.0
const CH = 3.3
const CD = 0.1
const LEAN = -0.14 // slight backward lean when docked (radians)

type Props = { interactive?: boolean }

/**
 * Procedural REVORA stand: matte-black card with gold trim seated in a brushed-gold
 * base with a slot; two gold magnet cylinders at the card's bottom. Warm/neutral
 * materials only — no purple ever touches the product.
 *
 * Docked state: gentle idle float + drag-to-spin (with inertia).
 * Scroll story (progress 0..1): lift → field lines → face camera → flip to magnets → snap back.
 */
export default function Stand({ interactive = true }: Props) {
  const root = useRef<THREE.Group>(null)
  const cardPivot = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const store = useContext(ProgressContext)
  const { gl } = useThree()

  const faceTex = useMemo(() => makeCardFaceTexture(), [])
  const wordmarkTex = useMemo(() => makeWordmarkTexture(), [])

  // drag-to-rotate state (only active while docked)
  const drag = useRef({ active: false, lastX: 0, vel: 0, spin: 0 })

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 0.95,
        roughness: 0.28,
      }),
    [],
  )
  const goldRoughMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD_DARK,
        metalness: 0.9,
        roughness: 0.42,
      }),
    [],
  )
  const cardEdgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        metalness: 0.0,
        roughness: 0.55,
      }),
    [],
  )

  // pointer handlers for grab-and-spin
  const onDown = (e: any) => {
    if (!interactive) return
    drag.current.active = true
    drag.current.lastX = e.clientX ?? 0
    drag.current.vel = 0
    gl.domElement.style.cursor = 'grabbing'
  }
  const onMove = (e: any) => {
    if (!drag.current.active) return
    const x = e.clientX ?? 0
    const dx = x - drag.current.lastX
    drag.current.lastX = x
    drag.current.vel = dx * 0.01
    drag.current.spin += drag.current.vel
  }
  const onUp = () => {
    drag.current.active = false
    gl.domElement.style.cursor = interactive ? 'grab' : 'auto'
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const p = store.p
    const dt = Math.min(delta, 0.05)

    // --- choreography beats (match handoff §7B) ---
    const lift = seg(p, 0.12, 0.34) // card rises out of base
    const face = seg(p, 0.34, 0.58) // rotate to face camera + glow
    const flip = seg(p, 0.58, 0.8) // turn to show magnets
    const snap = seg(p, 0.8, 1.0) // descend + snap back

    const cardY = (lift - snap) * 1.35 // up then back down
    const faceLean = LEAN * (1 - face) // straighten as it faces camera
    const spinY = flip * Math.PI - snap * Math.PI // flip to magnets, unflip on snap

    if (cardPivot.current) {
      // idle float + drag spin only while essentially docked
      const docked = p < 0.04
      if (docked && !drag.current.active) {
        drag.current.vel *= 0.94 // inertia decay
        drag.current.spin += drag.current.vel
      }
      const idle = docked ? Math.sin(t * 0.9) * 0.03 : 0
      const idleY = docked ? Math.sin(t * 0.7) * 0.04 : 0

      cardPivot.current.position.y = cardY + idleY
      cardPivot.current.rotation.x = faceLean + idle * 0.5
      cardPivot.current.rotation.y = docked ? drag.current.spin : spinY

      // snap pulse: tiny overshoot as it clicks back
      const clickback = p > 0.94 ? Math.sin((p - 0.94) / 0.06 * Math.PI) * 0.05 : 0
      cardPivot.current.position.y += clickback
    }

    // field-line rings intensify with lift, fade as it snaps home
    if (ringsRef.current) {
      const energy = Math.max(lift * (1 - snap * 0.85), face * 0.5)
      ringsRef.current.visible = energy > 0.01
      ringsRef.current.scale.setScalar(0.6 + energy * 0.9)
      ringsRef.current.rotation.y += dt * 0.6
      ringsRef.current.children.forEach((ring, i) => {
        const m = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
        m.opacity = energy * (0.5 - i * 0.12)
      })
    }

    // subtle whole-rig breathing
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.25) * 0.05 * (p < 0.04 ? 1 : 0)
    }
  })

  return (
    <group
      ref={root}
      position={[0, -0.6, 0]}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerOver={() => interactive && (gl.domElement.style.cursor = 'grab')}
    >
      {/* ---------- GOLD BASE (holder with slot) ---------- */}
      <group position={[0, -1.55, 0]}>
        {/* main wedge body */}
        <RoundedBox args={[2.7, 0.62, 1.35]} radius={0.09} smoothness={4} position={[0, 0, 0]}>
          <primitive object={goldMat} attach="material" />
        </RoundedBox>
        {/* front bevel face carrying the engraved wordmark */}
        <mesh position={[0, 0.02, 0.681]}>
          <planeGeometry args={[1.4, 0.35]} />
          <meshBasicMaterial map={wordmarkTex} transparent toneMapped={false} />
        </mesh>
        {/* the slot the card sits in (darker recess) */}
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[2.15, 0.12, 0.34]} />
          <meshStandardMaterial color="#1a1509" metalness={0.6} roughness={0.6} />
        </mesh>
      </group>

      {/* ---------- FIELD-LINE RINGS (signature) ---------- */}
      <group ref={ringsRef} position={[0, -0.2, 0]} visible={false}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.1 + i * 0.35, 0.012, 12, 80]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* ---------- CARD (detachable) ---------- */}
      <group ref={cardPivot} position={[0, 0, 0]}>
        {/* gold trim: a slightly larger rounded frame behind the card */}
        <RoundedBox args={[CW + 0.09, CH + 0.09, CD * 0.7]} radius={0.1} smoothness={4} position={[0, 0.25, -0.015]}>
          <primitive object={goldMat} attach="material" />
        </RoundedBox>

        {/* the black card body */}
        <RoundedBox args={[CW, CH, CD]} radius={0.08} smoothness={4} position={[0, 0.25, 0]}>
          <primitive object={cardEdgeMat} attach="material" />
        </RoundedBox>

        {/* front face graphics (canvas texture) — sits just proud of the card */}
        <mesh position={[0, 0.25, CD / 2 + 0.001]}>
          <planeGeometry args={[CW - 0.05, CH - 0.05]} />
          <meshStandardMaterial map={faceTex} roughness={0.6} metalness={0.05} />
        </mesh>

        {/* ---- magnets on the card's bottom edge (revealed on flip) ---- */}
        {[-0.5, 0.5].map((x) => (
          <mesh key={x} position={[x, -1.4, -CD / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} />
            <primitive object={goldRoughMat} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
