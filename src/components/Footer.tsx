import Logo from './Logo'
import './Footer.css'

const COLS = [
  {
    title: 'Product',
    links: ['How it works', 'Why Revora', 'Products', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Blog'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Data & security'],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <hr className="hairline footer__rule" />
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__tag">Experiences that matter.</p>
          </div>
          <div className="footer__cols">
            {COLS.map((c) => (
              <nav className="footer__col" key={c.title} aria-label={c.title}>
                <span className="mono footer__colTitle">{c.title}</span>
                {c.links.map((l) => (
                  <a key={l} href="#top" className="footer__link">
                    {l}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="footer__bottom">
          <span className="mono footer__copy">© 2026 Revora · Made in Mumbai</span>
          <span className="mono footer__built">Reputation, one tap at a time</span>
        </div>
      </div>
    </footer>
  )
}
