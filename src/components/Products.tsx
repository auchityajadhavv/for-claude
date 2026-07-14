import Reveal from './Reveal'
import './Products.css'

const PRODUCTS = [
  {
    name: 'NFC Card',
    line: 'The black acrylic card',
    body: 'Tap-to-open on any modern phone, with a printed QR for everyone else. The piece your guests actually touch.',
    img: '/assets/revora-product-3view.png',
  },
  {
    name: 'Acrylic Stand',
    line: 'The brushed-gold base',
    body: 'A weighted magnetic holder that seats the card at the perfect angle — and lets it detach in one clean lift.',
    img: '/assets/revora-product-hero-marble.jpg',
  },
  {
    name: 'Custom Branding',
    line: 'Your name, engraved',
    body: 'Your logo and colours on the card face, your venue engraved in the gold. It reads as yours, not ours.',
    img: '/assets/revora-lifestyle.png',
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
              <div className="prod__media">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <div className="prod__body">
                <span className="mono prod__line">{p.line}</span>
                <h3 className="prod__name">{p.name}</h3>
                <p className="prod__desc">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
