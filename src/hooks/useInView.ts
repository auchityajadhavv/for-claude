import { useEffect, useRef, useState } from 'react'

/** Returns [ref, inView]. Fires once when the element scrolls into view — used to lazy-init heavy widgets (map, R3F). */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { rootMargin: '200px' },
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true)
        obs.disconnect()
      }
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return [ref, inView]
}
