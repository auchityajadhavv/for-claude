import { useState } from 'react'
import Reveal from './Reveal'
import './Faq.css'

const QA = [
  {
    q: 'Do my guests need an app?',
    a: 'No. They tap the card with any modern phone, or scan the QR — the feedback page opens straight in their browser. Nothing to download, nothing to sign up for.',
  },
  {
    q: 'How does Revora get more Google reviews without faking them?',
    a: 'Every review is written and posted by a real guest. Revora just removes the friction: it drafts a genuine review from their own answers, so happy guests who never would have bothered can post in one tap.',
  },
  {
    q: 'What happens when someone leaves negative feedback?',
    a: 'Unhappy guests are routed to a private page instead of Google. You hear about the problem directly and get the chance to make it right — your public rating stays protected.',
  },
  {
    q: 'How long does setup take?',
    a: 'Under a minute. Unbox the stand, place it on the counter, and tap it once to link it to your venue. That’s the whole install.',
  },
  {
    q: 'Which businesses is it for?',
    a: 'Anywhere a guest leaves with an opinion — restaurants, cafés, salons, hotels, gyms, clinics and retail all use the same stand.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section faq" id="faq">
      <div className="container faq__grid">
        <Reveal className="faq__head">
          <span className="eyebrow">FAQ</span>
          <h2 className="h2">The questions we always get.</h2>
        </Reveal>

        <Reveal className="faq__list" delay={80}>
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                <button
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div className="faq__aWrap">
                  <div className="faq__a">{item.a}</div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
