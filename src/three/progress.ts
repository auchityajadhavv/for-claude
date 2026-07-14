import { createContext } from 'react'

/** Shared mutable scroll-story progress (0..1). Mutated by GSAP, read in useFrame
 *  — deliberately outside React state so it never triggers re-renders per frame. */
export type ProgressStore = { p: number }

export const ProgressContext = createContext<ProgressStore>({ p: 0 })

// smoothstep + range remap helpers for the choreography
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
export const smoothstep = (x: number) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}
/** remap p from [a,b] → smoothstepped 0..1 */
export const seg = (p: number, a: number, b: number) => smoothstep((p - a) / (b - a))
