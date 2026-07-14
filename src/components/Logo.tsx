import { useReducedMotion } from '../hooks/useReducedMotion'
import './Logo.css'

/**
 * REVORA mark: two thin rings forming a 3D orbit (one upright, one tilted),
 * with a glowing white dot that travels continuously around the tilted ring —
 * like an electron. The rings stay still; only the dot orbits (~4s).
 * Reduced-motion: the dot rests, static.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion()

  return (
    <a href="#top" className="logo" aria-label="REVORA — home">
      <span className={`logo__mark ${reduced ? 'is-static' : ''}`} aria-hidden="true">
        <span className="logo__ring" />
        <span className="logo__ring logo__ring--tilt" />
        <span className="logo__orbit">
          <span className="logo__dot" />
        </span>
      </span>
      {!compact && (
        <img className="logo__wordmark" src="/assets/revora-logo.png" alt="REVORA" width="118" height="24" />
      )}
    </a>
  )
}
