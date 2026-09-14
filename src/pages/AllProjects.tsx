import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { projects } from '../data/projects'
import site from '../content/site.json'
import { useInView } from '../hooks/useInView'
import { useTouchReveal } from '../hooks/useTouchReveal'
import { ProjectStill } from '../components/Works/ProjectMedia'
import { Tag } from '../components/Tag/Tag'
import { SectionLabel } from '../components/ui/SectionLabel'
import { CardBadge } from '../components/ui/CardBadge'

// chips shown per card before collapsing into a "+N" — keeps every card's tag row one line
const VISIBLE_TAGS = 2
import type React from 'react'

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  const imageRef = useRef<HTMLDivElement>(null)
  // where there is no hover, the card lights as it passes the middle of the screen
  const active = useTouchReveal(imageRef)

  return (
    <Link
      to={project.href}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      data-active={active || undefined}
      className={`works-card group flex flex-col no-underline rounded-[2px] p-[16px] sm:p-[20px] ${
        inView ? 'section-visible' : 'section-hidden'
      }`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div
        ref={imageRef}
        /* negative margins cancel the card's padding, so the cover runs to its edges
           and only its top corners are rounded — the card's own radius carries them */
        className="-mx-[16px] -mt-[16px] sm:-mx-[20px] sm:-mt-[20px] rounded-t-[2px] overflow-hidden relative mb-[20px]"
        style={{ aspectRatio: '4/3' }}
      >
        <ProjectStill project={project} className="w-full h-full" />
      </div>

      {project.subtitle && (
        <p className="font-['Open_Sans'] font-normal text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.12em] mb-[10px]"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          {project.subtitle}
        </p>
      )}

      <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-[color:var(--ink-strong)] leading-[1.2] tracking-[-0.5px] mb-[12px]">
        {project.title}
      </h2>

      <p className="font-['Open_Sans'] font-normal text-[16px] lg:text-[14px] text-[color:var(--ink-body)] leading-[24px] lg:leading-[22px] mb-[20px] flex-1"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        {project.description}
      </p>

      {/* the foot of the card: tags on the left, the mark on the right. mt-auto holds
          it to the bottom so it lines up across a row of uneven descriptions. The chips
          wrap rather than clip: at the three-column width two long tags and the mark
          need more than the card has, and a capped row was hiding the second tag. */}
      <div className="flex items-end justify-between gap-[12px] mt-auto">
        <div className="flex flex-wrap items-center gap-[8px]">
          {project.tags.slice(0, VISIBLE_TAGS).map(tag => <Tag key={tag} label={tag} />)}
          {project.tags.length > VISIBLE_TAGS && (
            <Tag label={`+${project.tags.length - VISIBLE_TAGS}`} />
          )}
        </div>
        <CardBadge />
      </div>

    </Link>
  )
}

// the filters come from the work itself, so a chip can never name a tag no project
// carries — and a new tag on a project turns up here on its own
const ALL = site.workPage.allFilterLabel
const FILTERS = [ALL, ...Array.from(new Set(projects.flatMap(p => p.tags)))]

export default function AllProjects() {
  const { ref, inView } = useInView(0.05)

  // The filter lives in the URL rather than in state: a chip on a case study page can
  // link straight to ?tag=…, the view is shareable, and Back steps through filters.
  // An unknown or missing tag falls back to showing everything.
  const [params, setParams] = useSearchParams()
  const requested = params.get('tag')
  const filter = requested && FILTERS.includes(requested) ? requested : ALL
  const setFilter = (f: string) =>
    setParams(f === ALL ? {} : { tag: f }, { preventScrollReset: true })

  const shown = filter === ALL ? projects : projects.filter(p => p.tags.includes(filter))

  return (
    <div className="min-h-screen bg-[color:var(--surface)]">
      <main className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[96px] pb-[calc(var(--section-gap)*3.2)]">

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`mb-[56px] ${inView ? 'section-visible' : 'section-hidden'}`}
        >
          <SectionLabel className="mb-[18px]">{site.workPage.label}</SectionLabel>
          <h1
            className="font-['Libre_Caslon_Text'] font-normal text-[color:var(--ink-strong)] leading-[1.1]"
            style={{ fontSize: 'clamp(34px, 4.4vw, 64px)', letterSpacing: '-0.02em' }}
          >
            {site.workPage.heading}
          </h1>
        </div>

        {/* filter row */}
        <div className="flex items-center gap-[8px] mb-[64px] flex-wrap">
          {FILTERS.map(f => {
            const on = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={on}
                className={`h-8 px-4 rounded-full font-['Open_Sans'] font-normal text-[12px] uppercase tracking-[0.7px] transition-colors duration-[150ms] border ${
                  on
                    ? 'bg-[color:var(--pill-bg)] text-[color:var(--pill-fg)] border-[color:var(--pill-bg)]'
                    : 'bg-transparent text-[color:var(--ink-muted)] border-[color:var(--line)] hover:border-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]'
                }`}
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px] gap-y-[80px]">
          {shown.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </main>
    </div>
  )
}
