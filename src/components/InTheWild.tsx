import Reveal from './Reveal'
import './InTheWild.css'

export default function InTheWild() {
  return (
    <section className="itw" id="wild">
      <div className="itw__media">
        <img
          src="/assets/revora-lifestyle.png"
          alt="A REVORA stand on a dark marble table in a candlelit restaurant"
          loading="lazy"
        />
        <div className="itw__scrim" />
      </div>
      <div className="container itw__inner">
        <Reveal className="itw__copy">
          <span className="eyebrow">See it in the wild</span>
          <h2 className="h2 itw__h2">
            It looks like it belongs on the table.
          </h2>
          <p className="lead">
            Brushed gold and black acrylic, weighted to sit exactly where your best
            guests are already looking. No plastic, no clutter — just an invitation
            to be heard.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
