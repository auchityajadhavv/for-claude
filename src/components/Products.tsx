import Reveal from './Reveal'
import './Products.css'

const PRODUCTS = [
  {
    line: 'The card',
    name: 'NFC Card',
    body: 'Black acrylic with a gold-trimmed edge. Tap-to-open on any modern phone, printed QR for everyone else.',
    spec: ['NFC + QR', 'Detachable', 'Your branding'],
  },
  {
    line: 'The base',
    name: 'Acrylic Stand',
    body: 'A weighted, brushed-gold holder that seats the card at the perfect angle — and lets it lift out in one clean pull.',
    spec: ['Brushed gold', 'Magnetic', 'Engraved'],
  },
  {
    line: 'Made yours',
    name: 'Custom Branding',
    body: 'Your logo and colours on the card face, your venue engraved into the gold. It reads as yours, not ours.',
    spec: ['Logo print', 'Colour match', 'Venue name'],
  },
]

export default function Products() {
  return (
    <section className="section prod" id="products">
      <div className="container">
        <Reveal className="prod__head">
          <span className="eyebrow">Products</span>
          <h2 className="h2">One stand. Three considered parts.</h2>
        </Reveal>

        <div className="prod__grid">
          {PRODUCTS.map((p, i) => (
            <Reveal as="article" key={p.name} className="prod__card glass" delay={i * 70}>
              <span className="mono prod__line">{p.line}</span>
              <h3 className="prod__name">{p.name}</h3>
              <p className="prod__desc">{p.body}</p>
              <ul className="prod__spec">
                {p.spec.map((s) => (
                  <li key={s} className="prod__specItem">{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
