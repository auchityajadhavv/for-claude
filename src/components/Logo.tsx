import { useReducedMotion } from '../hooks/useReducedMotion'
import './Logo.css'

/**
 * REVORA lockup: the orbit-ring mark + the wordmark.
 * Two rings (one upright, one tilted for 3D feel). The rings stay still;
 * a glowing white/lilac dot orbits the tilted ring (~4s) with a fading trail.
 * Reduced-motion: the dot is static.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion()

  return (
    <a href="#top" className="logo" aria-label="REVORA — home">
      <span className={`logo__mark ${reduced ? 'is-static' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 48 48" width="34" height="34">
          <defs>
            <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#eee6ff" />
              <stop offset="100%" stopColor="#c4a6ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* upright ring */}
          <circle cx="24" cy="24" r="15" className="logo__ring" />
          {/* tilted ring (the dot rides this one) */}
          <ellipse cx="24" cy="24" rx="15" ry="6.4" className="logo__ring logo__ring--tilt" />
          {/* nucleus */}
          <circle cx="24" cy="24" r="2.6" className="logo__nucleus" />
          {/* orbiting dot on the tilted ring */}
          <g className="logo__orbit">
            <circle cx="39" cy="24" r="4.4" fill="url(#dotGlow)" className="logo__dotGlow" />
            <circle cx="39" cy="24" r="1.9" className="logo__dot" />
          </g>
        </svg>
      </span>
      {!compact && (
        <img
          className="logo__wordmark"
          src="/assets/revora-logo.png"
          alt="REVORA"
          width="120"
          height="26"
        />
      )}
    </a>
  )
}
