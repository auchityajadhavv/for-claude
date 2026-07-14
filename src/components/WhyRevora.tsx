import Reveal from './Reveal'
import './WhyRevora.css'

// bento benefits — sizes vary to make the grid feel composed, not templated
const CELLS = [
  {
    span: 'wide',
    stat: '2×',
    title: 'More reviews',
    body: 'Turn quiet, happy guests into public reviews — most venues roughly double their monthly count.',
  },
  {
    span: 'tall',
    stat: null,
    title: 'Catch issues privately',
    body: 'Unhappy guests are routed to a private page first, so problems reach you — not your public rating.',
  },
  {
    span: 'small',
    stat: null,
    title: 'See what guests think',
    body: 'Every answer, in one clear dashboard.',
  },
  {
    span: 'small',
    stat: '<60s',
    title: 'Live in under a minute',
    body: 'Unbox, place, tap. That’s setup.',
  },
  {
    span: 'wide',
    stat: null,
    title: 'Built for every counter',
    body: 'Restaurants, cafés, salons, hotels, gyms, clinics, retail — anywhere a guest leaves with an opinion.',
  },
]

export default function WhyRevora() {
  return (
    <section className="section wrv" id="why">
      <div className="container">
        <Reveal className="wrv__head">
          <span className="eyebrow">Why Revora</span>
          <h2 className="h2">Protect your reputation. Grow it in public.</h2>
        </Reveal>

        <div className="wrv__bento">
          {CELLS.map((c, i) => (
            <Reveal
              as="article"
              key={c.title}
              className={`wrv__cell glass wrv__cell--${c.span}`}
              delay={i * 60}
            >
              {c.stat && <span className="mono wrv__stat">{c.stat}</span>}
              <h3 className="wrv__cellTitle">{c.title}</h3>
              <p className="wrv__cellBody">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
