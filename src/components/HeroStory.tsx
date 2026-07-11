import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from '../three/Scene'
import type { ProgressStore } from '../three/progress'
import { clamp01 } from '../three/progress'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './HeroStory.css'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { big: '2×', label: 'Google reviews' },
  { big: '60s', label: 'to go live' },
  { big: '1 tap', label: 'for guests' },
]

const BEATS = [
  { a: 0.0, b: 0.14, text: 'Experiences that matter.' },
  { a: 0.14, b: 0.36, text: 'It starts with one tap.' },
  { a: 0.36, b: 0.6, text: 'Private feedback, in seconds.' },
  { a: 0.6, b: 0.82, text: 'Magnetic. Detachable.' },
  { a: 0.82, b: 1.0, text: 'Then it clicks right back.' },
]

export default function HeroStory() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const storeRef = useRef<ProgressStore>({ p: 0 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(true)

  // pause R3F when the hero stage scrolls fully offscreen
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { threshold: 0.01 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const store = storeRef.current
    store.p = 0

    const setBeats = (p: number) => {
      BEATS.forEach((beat, i) => {
        const node = beatRefs.current[i]
        if (!node) return
        // triangular fade in/out across the beat's range
        const mid = (beat.a + beat.b) / 2
        const half = (beat.b - beat.a) / 2
        const o = clamp01(1 - Math.abs(p - mid) / (half * 1.15))
        node.style.opacity = String(o)
        node.style.transform = `translateY(${(1 - o) * 14}px)`
      })
    }

    // the pinned scroll story only exists on desktop with motion allowed;
    // on mobile / reduced-motion the stand stays docked (p = 0).
    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          // first ~16% of the wrap is the hero screen (stand docked), then the story
          const p = clamp01((self.progress - 0.16) / 0.84)
          store.p = p
          setBeats(p)
        },
      })
      setBeats(0)
      return () => st.kill()
    })

    return () => mm.revert()
  }, [reduced])

  return (
    <section
      className={`hero-wrap ${reduced ? 'is-reduced' : ''}`}
      id="top"
      ref={wrapRef}
    >
      {/* sticky 3D stage spans the hero + the story scroll */}
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-stage__canvas">
          <Scene store={storeRef.current} interactive frameloop={active ? 'always' : 'never'} />
        </div>

        {/* cinematic beat text (over the story portion) */}
        {!reduced && (
          <div className="hero-beats" aria-hidden="true">
            {BEATS.map((beat, i) => (
              <div
                key={i}
                className="hero-beat"
                ref={(n) => (beatRefs.current[i] = n)}
              >
                {beat.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* hero copy — sits on the first screen, left column */}
      <div className="hero-copy container">
        <div className="hero-copy__inner">
          <span className="eyebrow">Feedback that becomes reputation</span>
          <h1 className="hero-h1">
            Experiences that <span className="text-purple">matter.</span>
          </h1>
          <p className="lead hero-sub">
            The premium way your guests tell you how it really went — one tap,
            private feedback, then a Google review.
          </p>
          <div className="hero-actions">
            <a href="#cta" className="btn btn-primary">
              Book a demo
            </a>
            <a href="#how" className="btn btn-ghost">
              See how it works
            </a>
          </div>
          <dl className="hero-stats">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <dt className="mono hero-stat__big">{s.big}</dt>
                <dd className="mono hero-stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hero-scrollcue" aria-hidden="true">
          <span className="mono">Scroll</span>
          <span className="hero-scrollcue__line" />
        </div>
      </div>

      {/* reduced-motion static story list */}
      {reduced && (
        <div className="hero-story-static container">
          {BEATS.map((b) => (
            <p key={b.text} className="hero-story-static__line">
              {b.text}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
