import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './RatingsDemo.css'

const RATINGS = [
  { label: 'Food', value: 5.0 },
  { label: 'Service', value: 4.9 },
  { label: 'Ambience', value: 5.0 },
  { label: 'Value', value: 4.7 },
]

const REVIEW =
  'Genuinely one of the best dinners we’ve had this year. The tasting menu was faultless and the staff made us feel looked after all night. Already planning our next visit.'

export default function RatingsDemo() {
  const [wrapRef, inView] = useInView<HTMLDivElement>({ rootMargin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [fill, setFill] = useState(reduced ? 1 : 0)
  const [typed, setTyped] = useState('')
  const rafRef = useRef(0)

  // animate the bars filling, then type the review out
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setFill(1)
      setTyped(REVIEW)
      return
    }
    const start = performance.now()
    const dur = 900
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setFill(p)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, reduced])

  useEffect(() => {
    if (!inView || reduced) return
    let i = 0
    const started = window.setTimeout(function tick() {
      i += 1
      setTyped(REVIEW.slice(0, i))
      if (i < REVIEW.length) window.setTimeout(tick, 16)
    }, 900)
    return () => window.clearTimeout(started)
  }, [inView, reduced])

  const overall = (
    RATINGS.reduce((a, r) => a + r.value, 0) / RATINGS.length
  ).toFixed(1)

  return (
    <div className="rdemo" ref={wrapRef}>
      <div className="rdemo__left glass">
        <span className="eyebrow">The private page</span>
        <div className="rdemo__bars">
          {RATINGS.map((r) => (
            <div className="rdemo__row" key={r.label}>
              <span className="rdemo__label">{r.label}</span>
              <span className="rdemo__track">
                <span
                  className="rdemo__fill"
                  style={{ width: `${(r.value / 5) * 100 * fill}%` }}
                />
              </span>
              {/* ratings as numbers, never star glyphs */}
              <span className="mono rdemo__num">{(r.value * fill).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rdemo__arrow" aria-hidden="true">
        <span className="mono">drafts</span>
        <svg width="46" height="12" viewBox="0 0 46 12" fill="none">
          <path d="M0 6h42m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>

      <div className="rdemo__right glass">
        <div className="rdemo__gcard">
          <div className="rdemo__ghead">
            <span className="rdemo__gdot" />
            <div>
              <p className="rdemo__gname">Suggested Google review</p>
              <p className="mono rdemo__gmeta">{overall} · from your answers</p>
            </div>
          </div>
          <p className="rdemo__gbody">
            {typed}
            {typed.length < REVIEW.length && !reduced && (
              <span className="rdemo__caret" />
            )}
          </p>
          <button className="btn btn-primary rdemo__post" type="button">
            Post to Google
          </button>
        </div>
      </div>
    </div>
  )
}
