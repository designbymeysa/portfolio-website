import { projects } from './projects'
import type { Project } from './projects'

/** A picture in a case study. Until real assets land, a figure with no `src` renders
 *  as a captioned placeholder at the right size, so the page reads correctly now. */
export interface Figure {
  caption: string
  src?: string
  /** 'half' pairs two figures on one row; anything else runs full width */
  span?: 'full' | 'half'
}

/** The richer pieces a section can carry, in the order they appear. Each `kind` has one
 *  renderer in components/CaseStudy/Blocks.tsx; the shapes here are the whole contract
 *  between content and code, so a new kind is a case added in both places. */
export type Block =
  /** a paragraph; `**bold**` runs are set in the strong ink */
  | { kind: 'text'; body: string }
  /** a heading within the section, one step down from the section's own */
  | { kind: 'subheading'; text: string }
  /** a bullet that opens with a bold lead — "Benchmarking: comparative analysis of…".
   *  `number` replaces the dot with a marker like "01" */
  | { kind: 'lead'; lead: string; body: string; number?: string }
  /** rows of small labelled chips — the tools a study covered, say */
  | { kind: 'chips'; groups: { label: string; items: string[] }[] }
  /** a left-to-right process: each phase is a labelled column of numbered steps */
  | { kind: 'phases'; phases: { label: string; steps: string[] }[] }
  /** one of the two dropdowns. Each item opens to its bullets; `numbered` prefixes
   *  the titles 1. 2. 3. as the design principles are */
  | {
      kind: 'accordion'
      eyebrow?: string
      title?: string
      intro?: string
      numbered?: boolean
      items: { title: string; body?: string; bullets?: string[] }[]
    }
  /** the three phases of the loop as it stands today, each with what it does, where it
   *  fails, and the assumption underneath that failure */
  | { kind: 'cards'; cards: { title: string; works: string[]; breaks: string; assumption: string }[] }
  /** a row of headline numbers — the sentiment counts */
  | { kind: 'stats'; items: { value: string; label: string; note?: string }[] }
  /** the numbered findings a synthesis lands on */
  | { kind: 'findings'; items: { label: string; body: string }[] }
  /** side-by-side takeaways: a small capital label over a rule, a line or two beneath */
  | { kind: 'columns'; items: { label: string; body: string }[] }
  /** a carousel of images, one at a time. `ratio` is the images' own width / height
   *  ("1080 / 555") — the frame takes that shape so nothing is cropped; 16:9 when unset */
  | { kind: 'slider'; slides: { src: string; alt: string }[]; caption?: string; ratio?: string }
  /** a drawn cover reused inline — the interaction model is the same loop as the cover */
  /** `description` is read in place of the drawing, which is hidden from assistive
   *  technology: say what it shows, in a sentence or two */
  | { kind: 'diagram'; name: string; caption?: string; ratio?: string; legend?: { label: string; color: string }[]; description?: string }
  /** a picture, or a captioned placeholder until it exists */
  | { kind: 'figure'; figure: Figure }

export interface CaseSection {
  /** anchor + sidebar key */
  id: string
  /** how it reads in the sidebar */
  label: string
  heading: string
  body?: string
  bullets?: string[]
  /** a single line pulled out in the accent colour — a headline number, usually */
  highlight?: string
  /** a closing paragraph, for sections that land on a thought after their list */
  outro?: string
  figures?: Figure[]
  /** put the pictures between the opening paragraph and the list, not after it */
  figuresFirst?: boolean
  /** a button at the foot of the section. `lead` is a line above it; `aside` a plain
   *  text link beside it — the other way to get the same thing */
  action?: {
    lead?: string
    label: string
    href: string
    download?: boolean
    aside?: { label: string; href: string }
  }
  /** richer content, rendered after `body` and before `bullets`/`figures` */
  blocks?: Block[]
}

export interface CaseStudy {
  /** the display headline, split so the middle run can be set in italic */
  headline?: [string, string, string]
  /** the small tracked line above the headline; the project's title when unset */
  eyebrow?: string
  /** the credits under the headline; derived from the project's role/team/industry
   *  when unset. Set explicitly where those labels do not fit — a thesis has a
   *  supervisor, not a team. */
  meta?: { label: string; value: string }[]
  /** leave out the opening image block — for a page whose cover is reused further
   *  down, so it is not shown twice */
  hideBanner?: boolean
  /** the line under the headline, where it differs from the project's own subtitle —
   *  which still serves as the card's eyebrow on /projects. `null` shows nothing. */
  subtitle?: string | null
  /** the colour the content inside takes — bullets, numbers, pulled-out lines. The
   *  site's own accent when unset. A pair, because one value cannot hold against both
   *  grounds: the light one is the colour as chosen, the dark one the same hue lifted
   *  until it reads on near-black. */
  inkAccent?: { light: string; dark: string }
  /** the saturated colour of the opening image block; the project's own `bg` is the
   *  lighter tint the figure placeholders take */
  accent?: string
  sections: CaseSection[]
}

/** Authored case studies, keyed by project id, and living in
 *  `src/content/case-studies.json`. A project without one still gets a page —
 *  `sectionsFor` below falls back to the copy already on the project itself.
 *
 *  Cast through `unknown` because a JSON literal widens: `"half"` reads as `string`,
 *  which is not assignable to `Figure['span']` on its own. The shape is the interfaces
 *  above, and the build fails here if the file drifts from them. */
import data from '../content/case-studies.json'

export const caseStudies = data as unknown as Record<string, CaseStudy>

/** The sections a project's page renders: its authored case study where one exists,
 *  otherwise built from the copy the project already carries. Sections with nothing
 *  to say are left out rather than shown empty. */
export function sectionsFor(project: Project): CaseSection[] {
  const authored = caseStudies[project.id]
  if (authored) return authored.sections

  const built: CaseSection[] = [
    { id: 'introduction', label: 'Introduction', heading: 'Introduction', body: project.fullDescription },
  ]
  if (project.outcomes?.length) {
    built.push({ id: 'impact', label: 'Impact', heading: 'Impact', bullets: project.outcomes })
  }
  if (project.problem) {
    built.push({ id: 'challenges', label: 'Challenges', heading: 'Challenges', body: project.problem })
  }
  if (project.externalHref) {
    built.push({
      id: 'full-case-study',
      label: 'Full Case study',
      heading: 'Full Case study',
      body: 'The full case study — research, concept, and final design — lives on the project site.',
      action: { label: 'Read the full case study', href: project.externalHref },
    })
  }
  return built
}

export function projectById(id?: string): Project | undefined {
  return projects.find(p => p.id === id)
}

export function headlineFor(project: Project): [string, string, string] {
  return caseStudies[project.id]?.headline ?? ['', project.title, '']
}

/** the opening image block's colour; the project's own tint is the fallback */
export function accentFor(project: Project): string {
  return caseStudies[project.id]?.accent ?? project.bg
}
