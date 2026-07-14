import Reveal from './Reveal'
import { openDemo } from '../lib/openDemo'
import './Cta.css'

export default function Cta() {
  return (
    <section className="section cta" id="cta">
      <div className="container">
        <Reveal className="cta__panel">
          <div className="cta__glow" aria-hidden="true" />
          <span className="eyebrow">Get started</span>
          <h2 className="cta__h2">Ready to grow your reputation?</h2>
          <p className="lead cta__lead">
            Place your first Revora stand this week and watch the reviews follow.
          </p>
          <div className="cta__actions">
            <button className="btn btn-primary cta__primary" onClick={() => openDemo()}>
              Book a demo
            </button>
            <a href="#pricing" className="btn btn-ghost">
              See pricing
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
