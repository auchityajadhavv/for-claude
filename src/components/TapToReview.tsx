import Reveal from './Reveal'
import ReviewPhone from './ReviewPhone'
import './TapToReview.css'

const STEPS = [
  { n: '01', t: 'Tap the card', b: 'A guest taps their phone — or scans the QR. No app, no sign-up.' },
  { n: '02', t: 'Private feedback', b: 'A quiet page opens. Only you see the honest answers.' },
  { n: '03', t: 'AI drafts the review', b: 'Revora turns their answers into a warm Google review — in seconds.' },
  { n: '04', t: 'Posted in one tap', b: 'Happy guests post it instantly. Your public rating grows.' },
]

export default function TapToReview() {
  return (
    <section className="section flow" id="flow">
      <div className="container">
        <Reveal className="flow__head">
          <span className="eyebrow">How it works</span>
          <h2 className="h2">One tap, and the review writes itself.</h2>
          <p className="lead flow__lead">
            Watch what a guest sees — from the tap on the table to a posted Google
            review, in about sixty seconds.
          </p>
        </Reveal>

        <div className="flow__stage">
          {/* the tap */}
          <Reveal className="flow__tap">
            <div className="flow__tapMedia">
              <span className="flow__ripple" aria-hidden="true" />
              <span className="flow__ripple flow__ripple--2" aria-hidden="true" />
              <video
                src="/assets/revora-tap.mp4"
                poster="/assets/revora-product-hero-marble.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="A hand tapping the REVORA card"
              />
              <span className="flow__tapTag mono">NFC · tap to open</span>
            </div>
          </Reveal>

          {/* the flow connector */}
          <div className="flow__link" aria-hidden="true">
            <span className="flow__linkLabel mono">opens</span>
            <svg viewBox="0 0 80 16" className="flow__linkArrow" preserveAspectRatio="none">
              <path d="M0 8h72m0 0-7-6m7 6-7 6" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
          </div>

          {/* the review page, live */}
          <Reveal className="flow__phone" delay={120}>
            <ReviewPhone />
          </Reveal>
        </div>

        <ol className="flow__steps">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} className="flow__step" delay={i * 60}>
              <span className="mono flow__stepNo">{s.n}</span>
              <h3 className="flow__stepTitle">{s.t}</h3>
              <p className="flow__stepBody">{s.b}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
