import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/** A router keeps the scroll position when the route changes, so arriving from the
 *  foot of a long page drops you at the foot of the next one. This resets it.
 *
 *  Keyed on the path alone, not the search string: the case studies grid keeps its
 *  filter in `?tag=`, and jumping to the top every time a chip is clicked would throw
 *  the reader out of the row they were reading. `instant` overrides the smooth
 *  scrolling set on `html`, which would otherwise animate the whole way down a page. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    // Going back is a return, not an arrival: the reader was somewhere, and dropping
    // them at the top of the page they came from loses their place. The browser
    // restores the position on a POP, so leave it alone and only reset on a push.
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, navigationType])

  return null
}
