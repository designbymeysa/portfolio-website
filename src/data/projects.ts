export interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  problem?: string
  outcomes?: string[]
  tags: string[]
  year: string
  role: string
  team?: string
  industry?: string
  discipline?: string
  timeline?: string
  bg: string
  /** shown pixelated in the pinned works card; falls back to a generated field when unset */
  image?: string
  /** names a drawn cover in components/Covers instead of a photograph. Takes precedence
   *  over `image` on the cards, and fronts the case study too unless `heroImage` is set. */
  cover?: string
  /** the 16:9 banner at the top of the case study. Falls back to the drawn cover, then
   *  to `image`, which is cut for the 4:3 card and loses its top and bottom in a wide frame. */
  heroImage?: string
  href: string
  externalHref?: string
}

/** The work itself lives in `src/content/projects.json` — plain data, editable without
 *  touching a component. The cast is what gives it the shape above: TypeScript widens a
 *  JSON literal (every string is just `string`), so the interface is applied here once
 *  and every consumer gets it for free.
 *
 *  Order matters: the homepage Works section features the first four, in this order. */
import data from '../content/projects.json'

export const projects = data as Project[]
