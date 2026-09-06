import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { useInView } from '../hooks/useInView'
import { useTouchReveal } from '../hooks/useTouchReveal'
import { ProjectStill } from '../components/Works/ProjectMedia'
import { Tag } from '../components/Tag/Tag'
import { SectionLabel } from '../components/ui/SectionLabel'
import { CardBadge } from '../components/ui/CardBadge'

// The VIEW label follows a cursor, and a touch screen has none: iOS fires one synthetic
// mousemove on tap and never a mouseleave, so the pill would appear at the tap and stay
// there for the rest of the session. Only show it where there is a real pointer.
const FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

// chips shown per card before collapsing into a "+N" — keeps every card's tag row one line
const VISIBLE_TAGS = 2
import type React from 'react'

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })
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
      style={{
        transitionDelay: `${(index % 3) * 80}ms`,
        // the same wash the homepage card takes, from the same project colour
        ['--card-tint' as string]: project.bg,
      } as React.CSSProperties}
    >
      <div
        ref={imageRef}
        /* negative margins cancel the card's padding, so the cover runs to its edges
           and only its top corners are rounded — the card's own radius carries them */
        className="-mx-[16px] -mt-[16px] sm:-mx-[20px] sm:-mt-[20px] rounded-t-[2px] overflow-hidden relative mb-[20px]"
        style={{ aspectRatio: '4/3' }}
        data-cursor="hide"
        /* viewport coordinates: the pill is portalled to the body, clear of the
           card's overflow-hidden */
        onMouseMove={e => {
          if (!FINE_POINTER) return
          setPill({ visible: true, x: e.clientX, y: e.clientY })
        }}
        onMouseLeave={() => setPill(p => ({ ...p, visible: false }))}
      >
        <ProjectStill project={project} className="w-full h-full" />

        {(pill.x > 0 || pill.y > 0) && createPortal(
          <span
            aria-hidden="true"
            data-on={pill.visible || undefined}
                  className="cursor-pill pointer-events-none fixed z-[9999] inline-flex items-center justify-center bg-[color:var(--cursor-pill-bg)] text-[color:var(--cursor-pill-fg)] font-['Open_Sans'] font-semibold text-[12px] tracking-[0.02em] px-4 py-2 rounded-full select-none shadow-md -translate-x-1/2 -translate-y-1/2"
            style={{ left: pill.x, top: pill.y }}
          >
            View
          </span>,
          document.body,
        )}
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

      <p className="font-['Open_Sans'] font-light text-[14px] text-[color:var(--ink-body)] leading-[22px] mb-[20px] flex-1"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        {project.description}
      </p>

      {/* the foot of the card: tags on the left, the mark on the right. mt-auto holds
          it to the bottom so it lines up across a row of uneven descriptions. The chip
          row is capped to one line for the same reason. */}
      <div className="flex items-center justify-between gap-[12px] mt-auto">
        <div className="flex items-center gap-[8px] h-6 overflow-hidden">
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
const FILTERS = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))]

export default function AllProjects() {
  const { ref, inView } = useInView(0.05)

  // The filter lives in the URL rather than in state: a chip on a case study page can
  // link straight to ?tag=…, the view is shareable, and Back steps through filters.
  // An unknown or missing tag falls back to showing everything.
  const [params, setParams] = useSearchParams()
  const requested = params.get('tag')
  const filter = requested && FILTERS.includes(requested) ? requested : 'All'
  const setFilter = (f: string) =>
    setParams(f === 'All' ? {} : { tag: f }, { preventScrollReset: true })

  const shown = filter === 'All' ? projects : projects.filter(p => p.tags.includes(filter))

  return (
    <div className="min-h-screen bg-[color:var(--surface)]">
      <main className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[96px] pb-[calc(var(--section-gap)*3.2)]">

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`mb-[56px] ${inView ? 'section-visible' : 'section-hidden'}`}
        >
          <SectionLabel className="mb-[18px]">Work</SectionLabel>
          <h1
            className="font-['Libre_Caslon_Text'] font-normal text-[color:var(--ink-strong)] leading-[1.1]"
            style={{ fontSize: 'clamp(34px, 4.4vw, 64px)', letterSpacing: '-0.02em' }}
          >
            Case studies
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
