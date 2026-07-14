import { Suspense, lazy } from 'react'
import Starfield from './components/Starfield'
import Nav from './components/Nav'
import HeroStory from './components/HeroStory'
import HowItWorks from './components/HowItWorks'
import WhyReviews from './components/WhyReviews'
import InTheWild from './components/InTheWild'
import WhyRevora from './components/WhyRevora'
import Products from './components/Products'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import Cta from './components/Cta'
import Footer from './components/Footer'

// map pulls in maplibre-gl (~200kb gzip) and lives below the fold → code-split it
const MumbaiMap = lazy(() => import('./map/MumbaiMap'))

export default function App() {
  return (
    <>
      <Starfield />
      <Nav />
      <main>
        <HeroStory />
        <HowItWorks />
        <WhyReviews />
        <InTheWild />
        <WhyRevora />
        <Suspense fallback={<div style={{ minHeight: '70vh' }} />}>
          <MumbaiMap />
        </Suspense>
        <Products />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
