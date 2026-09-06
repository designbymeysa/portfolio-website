import { useEffect, useRef } from 'react'

/** Drifts an element against the page as it crosses the viewport, so layers in
 *  the same section travel at different rates and read as sitting at different
 *  depths. Positive `strength` lags behind the scroll, negative leads it.
 *
 *  The transform is written straight to the node on an animation frame, so this
 *  never re-renders. Sits out entirely under reduced motion. */
export function useParallax<T extends HTMLElement>(strength = 0.06) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let queued = false

    const apply = () => {
      queued = false
      const rect = el.getBoundingClientRect()
      // how far the element's centre sits from the middle of the screen
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-offset * strength).toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength])

  return ref
}
