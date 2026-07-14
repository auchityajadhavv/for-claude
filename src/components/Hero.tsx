import AmbientField from '../three/AmbientField'
import TryDemo from './TryDemo'
import { openDemo } from '../lib/openDemo'
import './Hero.css'

const STATS = [
  { big: '2×', label: 'Google reviews' },
  { big: '60s', label: 'to go live' },
  { big: '1 tap', label: 'for guests' },
]

export default function Hero() {
  return (
    <section className="hero" id="top">
      <AmbientField />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="eyebrow">Feedback that becomes reputation</span>
        <h1 className="hero__h1">
          Experiences that <span className="text-purple">matter.</span>
        </h1>
        <p className="lead hero__sub">
          The premium way your guests tell you how it really went — one tap,
          private feedback, then a Google review.
        </p>
        <div className="hero__actions">
          <button className="btn btn-primary" onClick={() => openDemo()}>Book a demo</button>
          <TryDemo label="Try it yourself" variant="ghost" />
          <a href="#flow" className="hero__link">See how it works →</a>
        </div>
        <dl className="hero__stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero__stat">
              <dt className="mono hero__statBig">{s.big}</dt>
              <dd className="mono hero__statLabel">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#flow" className="hero__cue" aria-label="Scroll to see how it works">
        <span className="mono">Scroll</span>
        <span className="hero__cueLine" />
      </a>
    </section>
  )
}
