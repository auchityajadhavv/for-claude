import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Reveal from '../components/Reveal'
import './MumbaiMap.css'

const MUMBAI: [number, number] = [72.8777, 19.076]

// hard-coded placeholder venues across Mumbai (Phase 1) — one is the live Revora venue
const PINS: { lng: number; lat: number; live?: boolean }[] = [
  { lng: 72.8777, lat: 19.076, live: true },
  { lng: 72.8296, lat: 18.922 }, // Colaba
  { lng: 72.8347, lat: 18.9548 }, // Fort
  { lng: 72.8258, lat: 19.0176 }, // Dadar
  { lng: 72.8479, lat: 19.0176 },
  { lng: 72.8656, lat: 19.0596 }, // Bandra
  { lng: 72.8377, lat: 19.1136 }, // Andheri
  { lng: 72.8697, lat: 19.1197 },
  { lng: 72.8265, lat: 19.0455 }, // Worli
  { lng: 72.8895, lat: 19.0896 }, // Powai
  { lng: 72.8547, lat: 19.0330 },
  { lng: 72.8106, lat: 18.9388 }, // Marine Lines
]

export default function MumbaiMap() {
  const [boxRef, inView] = useInView<HTMLDivElement>({ rootMargin: '150px' })
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const reduced = useReducedMotion()

  // lazy-init only when scrolled into view
  useEffect(() => {
    if (!inView || mapRef.current || !mapEl.current) return

    const map = new maplibregl.Map({
      container: mapEl.current,
      style: 'https://tiles.openfreemap.org/styles/dark', // free, no API key
      center: MUMBAI,
      zoom: 11,
      pitch: 55,
      bearing: -18,
      attributionControl: false,
      interactive: true,
    })
    mapRef.current = map

    map.on('load', () => {
      map.resize()

      // greyscale 3D buildings via fill-extrusion
      try {
        map.addLayer({
          id: 'revora-buildings',
          type: 'fill-extrusion',
          source: 'openmaptiles',
          'source-layer': 'building',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#26242c',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 12],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': 0.85,
          },
        })
      } catch {
        /* source-layer name varies by style; safe to skip if absent */
      }

      // add pins as DOM markers so we control the pulse + colour (UI purple)
      PINS.forEach((p) => {
        const el = document.createElement('div')
        el.className = `mm-pin ${p.live ? 'mm-pin--live' : ''}`
        if (!reduced) el.classList.add('mm-pin--pulse')
        new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map)
      })

      // slow auto-rotate bearing (skipped for reduced motion)
      if (!reduced) {
        let raf = 0
        const spin = () => {
          if (!mapRef.current) return
          map.setBearing(map.getBearing() + 0.02)
          raf = requestAnimationFrame(spin)
        }
        raf = requestAnimationFrame(spin)
        map.once('remove', () => cancelAnimationFrame(raf))
      }
    })

    const onResize = () => map.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      map.remove()
      mapRef.current = null
    }
  }, [inView, reduced])

  return (
    <section className="section mm" id="map">
      <div className="container">
        <Reveal className="mm__head">
          <span className="eyebrow">On the map</span>
          <h2 className="h2">Venues going live across Mumbai.</h2>
        </Reveal>

        <Reveal className="mm__box" delay={80}>
          <div className="mm__inner" ref={boxRef}>
            <div className="mm__canvas" ref={mapEl} aria-label="Map of Revora venues across Mumbai" />
            <div className="mm__badge glass">
              <span className="mm__badgeDot" />
              <span>Active in Mumbai</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
