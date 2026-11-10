export interface Project {
  id: string
  title: string
  /** the small tracked line over the card's headline, for a project with no case study
   *  to name one yet; a case study's own eyebrow wins over it */
  eyebrow?: string
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
  /** kept in the content but left off the site — every list, the next-project link and
   *  its own URL, which falls back to /projects */
  hidden?: boolean
  /** shown on /projects under a "Coming soon" shade, but not a link: no case study
   *  page, no next-project link, no homepage feature */
  comingSoon?: boolean
}

/** The work itself lives in `src/content/projects.json` — plain data, editable without
 *  touching a component. The cast is what gives it the shape above: TypeScript widens a
 *  JSON literal (every string is just `string`), so the interface is applied here once
 *  and every consumer gets it for free.
 *
 *  Order here is the order of the case study pages' "next" links. The homepage picks its
 *  own three, by id, in `site.json` → works.featured; /projects sorts by year. */
import data from '../content/projects.json'
import site from '../content/site.json'

export const projects = (data as Project[]).filter(p => !p.hidden)

/** the projects that have a case study page to open */
export const caseStudyProjects = projects.filter(p => !p.comingSoon)

/** newest first, for /projects. A range like "2025 — 2026" counts by its first year;
 *  the sort is stable, so projects from the same year keep their order in the JSON */
const startYear = (p: Project) => parseInt(p.year, 10) || 0
export const projectsByYear = [...projects].sort((a, b) => startYear(b) - startYear(a))

/** the homepage's cards, in the order site.json names them; an unknown id is skipped */
export const featuredProjects = site.works.featured
  .map(id => projects.find(p => p.id === id))
  .filter((p): p is Project => !!p)
