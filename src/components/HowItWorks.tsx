import Reveal from './Reveal'
import RatingsDemo from './RatingsDemo'
import './HowItWorks.css'

// a real, ordered sequence → numbering carries meaning here (frontend-design: structure is information)
const STEPS = [
  {
    n: '01',
    title: 'Tap the card',
    body: 'A guest taps their phone on the stand, or scans the QR. No app, no sign-up.',
  },
  {
    n: '02',
    title: 'Private feedback',
    body: 'They answer a few quick questions on a private page. Only you see the honest ones.',
  },
  {
    n: '03',
    title: 'Suggested review',
    body: 'Revora drafts a warm, specific Google review from their answers — ready in seconds.',
  },
  {
    n: '04',
    title: 'Google review',
    body: 'Happy guests post it in one tap. Your public rating grows; issues stay private.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <Reveal className="how__head">
          <span className="eyebrow">How it works</span>
          <h2 className="h2">Four steps, about sixty seconds.</h2>
        </Reveal>

        <div className="how__grid">
          {/* step 1 gets the tap video as its visual */}
          <Reveal className="how__tap">
            <video
              src="/assets/revora-tap.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/assets/revora-product-hero-marble.jpg"
              aria-label="A hand tapping the REVORA card"
            />
            <div className="how__tapLabel">
              <span className="mono how__stepNo">01</span>
              <span>Tap the card</span>
            </div>
          </Reveal>

          <ol className="how__steps">
            {STEPS.slice(1).map((s, i) => (
              <Reveal as="li" key={s.n} className="how__step" delay={i * 70}>
                <span className="mono how__stepNo">{s.n}</span>
                <div>
                  <h3 className="how__stepTitle">{s.title}</h3>
                  <p className="how__stepBody">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <hr className="hairline how__rule" />

        <Reveal className="how__demoWrap">
          <RatingsDemo />
        </Reveal>
      </div>
    </section>
  )
}
