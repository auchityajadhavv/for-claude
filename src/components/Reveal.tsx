import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Reveal.css'

type Props = {
  children: ReactNode
  className?: string
  /** stagger delay in ms when several Reveals sit together */
  delay?: number
  as?: keyof JSX.IntrinsicElements
}

/**
 * Disciplined scroll reveal — Subtle tier (fade + 12px rise, power1.out-ish).
 * One quiet moment per element; the bold motion is reserved for the hero.
 * Reduced-motion: content is simply visible, no transform.
 */
export default function Reveal({ children, className = '', delay = 0, as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const Tag = as as any

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`
            el.classList.add('is-in')
            obs.unobserve(el)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced, delay])

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
