import { useEffect, useState } from 'react'
import Logo from './Logo'
import './Nav.css'

const LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Why Revora', href: '#why' },
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner container">
        <Logo />

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href="#cta" className="btn btn-primary nav__cta">
            Book a demo
          </a>
          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      <div className={`nav__sheet ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <div className="nav__sheetInner" onClick={(e) => e.stopPropagation()}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__sheetLink" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#cta" className="btn btn-primary nav__sheetCta" onClick={() => setOpen(false)}>
            Book a demo
          </a>
        </div>
      </div>
    </header>
  )
}
