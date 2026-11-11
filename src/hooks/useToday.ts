import { useLocation } from 'react-router-dom'

/** The landing page's refinements. They were tried out at /today, on top of the page as
 *  it then was, and have since been promoted: `/` is the refined page now, and /today
 *  only redirects to it (App.tsx).
 *
 *  Each component still asks this hook and takes the refined branch when it answers
 *  true, so the earlier design is one line away — return false here to see it again.
 *  The other pages (/projects and the case studies) are not the landing page and keep
 *  the unrefined branches. */
export const HOME_PATH = '/'

export function useToday(): boolean {
  const { pathname } = useLocation()
  return pathname === HOME_PATH
}
