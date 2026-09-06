import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** On a touch device there is no hover, so every affordance tied to `:hover`
 *  never shows. This lights an element while it sits in the middle band of the
 *  screen instead, so scrolling past reveals what a pointer would have.
 *
 *  Returns false on anything with a real pointer — there, `:hover` does the work. */
export function useTouchReveal(ref: RefObject<HTMLElement | null>): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: none)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // a band across the middle of the viewport — items light as they pass through
      { threshold: 0, rootMargin: '-35% 0px -35% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return active
}
