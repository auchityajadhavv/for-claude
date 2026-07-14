import { useReducedMotion } from '../hooks/useReducedMotion'
import './Logo.css'

/**
 * REVORA mark (matches the reference file): two thin rings forming a 3D sphere —
 * one upright, one tilted — slowly tumbling on the Y axis, with a glowing dot
 * that rides the tilted ring so it visibly orbits. Reduced-motion: still.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion()

  return (
    <a href="#top" className="logo" aria-label="REVORA — home">
      <span className={`logo__mark ${reduced ? 'is-static' : ''}`} aria-hidden="true">
        <span className="logo__sphere">
          <i className="logo__ring" />
          <i className="logo__ring logo__ring--tilt" />
          <span className="logo__dotWrap">
            <b className="logo__dot" />
          </span>
        </span>
      </span>
      {!compact && (
        <img className="logo__wordmark" src="/assets/revora-logo.png" alt="REVORA" width="118" height="24" />
      )}
    </a>
  )
}
