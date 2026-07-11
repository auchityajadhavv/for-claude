import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, AdaptiveDpr, ContactShadows } from '@react-three/drei'
import Stand from './Stand'
import { ProgressContext, type ProgressStore } from './progress'
import './Scene.css'

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

type Props = {
  store: ProgressStore
  interactive?: boolean
  /** pause the render loop when the hero is scrolled fully offscreen */
  frameloop?: 'always' | 'demand' | 'never'
}

/**
 * The hero 3D stage. Warm/neutral studio lighting built entirely in-memory via
 * drei Lightformers, so gold reads as gold and nothing depends on a remote HDR.
 * No purple light ever hits the product.
 */
export default function Scene({ store, interactive = true, frameloop = 'always' }: Props) {
  const webgl = useMemo(() => hasWebGL(), [])

  if (!webgl) {
    return (
      <div className="scene scene--fallback">
        <img src="/assets/revora-product-hero-marble.jpg" alt="REVORA stand on dark marble" />
      </div>
    )
  }

  return (
    <div className="scene">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 2]} /* cap DPR at 2 */
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 7.2], fov: 32 }}
      >
        <AdaptiveDpr pixelated={false} />
        <color attach="background" args={['#00000000']} />

        {/* warm/neutral key + fill so gold reads gold. NO purple. */}
        <ambientLight intensity={0.35} color="#fff4e2" />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff1d6" castShadow />
        <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#ffe9c9" />
        <pointLight position={[0, -1, 4]} intensity={0.5} color="#ffedcf" />

        <Suspense fallback={null}>
          <ProgressContext.Provider value={store}>
            <Stand interactive={interactive} />
          </ProgressContext.Provider>

          {/* in-memory studio environment for metallic reflections (warm, neutral) */}
          <Environment resolution={256}>
            <Lightformer intensity={2.2} position={[0, 3, 4]} scale={[6, 6, 1]} color="#fff2d8" />
            <Lightformer intensity={1.1} position={[-4, 1, 2]} scale={[4, 6, 1]} color="#ffe6c0" />
            <Lightformer intensity={1.4} position={[4, 0, 3]} scale={[3, 6, 1]} color="#fffaf0" />
            <Lightformer intensity={0.6} position={[0, -3, 2]} scale={[6, 3, 1]} color="#d9cbb0" />
          </Environment>

          <ContactShadows
            position={[0, -2.15, 0]}
            opacity={0.5}
            scale={9}
            blur={2.6}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
