import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { sectionsFor, projectById, headlineFor, accentFor, caseStudies } from '../data/caseStudies'
import { coverFor } from '../components/Covers'
import { Blocks, Emphasis, FigureBlock } from '../components/CaseStudy/Blocks'
import { Button } from '../components/Button/Button'
import { projects } from '../data/projects'
import { Tag } from '../components/Tag/Tag'
import { ArrowIcon, BackIcon, LeaveIcon } from '../components/ui/LinkIcons'
import type React from 'react'

/** the small tracked capital used for the eyebrow and the meta labels */
const META_LABEL =
  "font-['Open_Sans'] font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-muted)]"

export default function ProjectPage() {
  const { id } = useParams()
  const project = projectById(id)
  const navigate = useNavigate()
  const location = useLocation()

  // Back means back — to the homepage's work section, the grid, or wherever else the
  // reader came from. A 'default' key means this page is the first entry in the
  // session's history (opened cold from a link), where there is nothing to return to
  // and the grid is the sensible home.
  const canGoBack = location.key !== 'default'
  const { ref, inView } = useInView(0.03)
  const [active, setActive] = useState('')

  // a fresh array every render would re-subscribe the scroll listener below on every
  // one of them — and `setActive` fires from that listener while scrolling
  const sections = useMemo(() => (project ? sectionsFor(project) : []), [project])

  // which section the reader is in, for the sidebar
  useEffect(() => {
    if (!sections.length) return
    const update = () => {
      const line = window.innerHeight * 0.3
      let current = sections[0].id
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) current = s.id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  if (!project) return <Navigate to="/projects" replace />

  const [before, accent, after] = headlineFor(project)
  const Drawn = coverFor(project.cover)
  const study = caseStudies[project.id]
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  // the study's own line wins; explicitly null means none; otherwise the project's
  const subtitle = study?.subtitle === undefined ? project.subtitle : study.subtitle
  // the case study can name its own credits — a thesis has a supervisor, not a team
  const meta = study?.meta ?? [
    { label: 'Role', value: project.role },
    { label: 'Team', value: project.team },
    { label: 'Industry', value: project.industry },
  ].filter((m): m is { label: string; value: string } => !!m.value)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[112px] pb-[calc(var(--section-gap)*3.2)] ${
        inView ? 'section-visible' : 'section-hidden'
      }`}
    >
      <div className="grid lg:grid-cols-[190px_minmax(0,1fr)] gap-[40px] lg:gap-[80px]">

        {/* sidebar — the way back, and the way through */}
        <aside className="lg:sticky lg:top-[112px] lg:self-start">
          <Link
            to="/projects"
            onClick={e => {
              // still a real link, so opening it in a new tab lands on the grid
              if (canGoBack && !e.metaKey && !e.ctrlKey && e.button === 0) {
                e.preventDefault()
                navigate(-1)
              }
            }}
            className="inline-flex items-center gap-[10px] font-['Open_Sans'] text-[14px] text-[color:var(--ink-strong)] hover:text-[color:var(--ink-strong)] transition-colors duration-[150ms] mb-[28px] lg:mb-[36px]"
          >
            <BackIcon />
            Back
          </Link>

          <nav className="hidden lg:flex flex-col gap-[16px]">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`font-['Open_Sans'] text-[14px] transition-colors duration-[150ms] hover:text-[color:var(--ink-strong)] ${
                  active === s.id
                    ? 'text-[color:var(--ink-strong)] font-semibold'
                    : 'text-[color:var(--ink-muted)]'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* the case study itself. Where the study names an ink accent, the pair is set
            here as custom properties and globals.css picks one per theme; every accent
            mark inside falls back to the site's own when they are absent. */}
        <article
          className={`min-w-0 ${study?.inkAccent ? 'study-accent' : ''}`}
          style={study?.inkAccent ? {
            ['--study-accent-light' as string]: study.inkAccent.light,
            ['--study-accent-dark'  as string]: study.inkAccent.dark,
          } as React.CSSProperties : undefined}
        >
          <div className="flex items-center justify-between gap-4 mb-[28px]">
            {/* the eyebrow takes the study's accent where it has one — the first mark
                of the page's colour, before any of the content that carries it */}
            <span className={`${META_LABEL} ${study?.inkAccent ? 'text-[color:var(--study-accent)]' : ''}`}>
              {study?.eyebrow ?? project.title}
            </span>

            {/* the way back out to the set, level with the project's own name */}
            <Link
              to="/projects"
              className={`${META_LABEL} flex items-center gap-[6px] shrink-0 hover:text-[color:var(--ink-strong)] transition-colors duration-[150ms]`}
            >
              View all <ArrowIcon className="h-[11px] w-[11px]" />
            </Link>
          </div>

          <h1
            className="font-['Libre_Caslon_Text'] font-normal text-[color:var(--ink-strong)] leading-[1.14] tracking-[-0.015em] mb-[20px]"
            style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
          >
            {before}
            <em className="italic">{accent}</em>
            {after}
          </h1>

          {subtitle && (
            <p className="font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)] mb-[48px]">
              {subtitle}
            </p>
          )}

          {/* the opening image — unless the study reuses its cover further down */}
          {!study?.hideBanner && (
          <div
            className="w-full rounded-[2px] overflow-hidden mb-[28px]"
            style={{ aspectRatio: '16 / 9', background: accentFor(project) }}
          >
            {Drawn ? (
              <Drawn className="w-full h-full" />
            ) : (project.heroImage ?? project.image) ? (
              <img
                src={project.heroImage ?? project.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          )}

          {/* credits */}
          {meta.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] sm:gap-[40px] pb-[36px] border-b border-[color:var(--line)] mb-[56px] lg:mb-[64px]">
              {meta.map(m => (
                <div key={m.label}>
                  <span className={`${META_LABEL} block mb-[8px]`}>{m.label}</span>
                  <p className="font-['Open_Sans'] text-[14px] lg:text-[13px] leading-[1.5] text-[color:var(--ink-body)]">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-[var(--section-gap)]">
            {sections.map(s => (
              <section key={s.id} id={s.id} className="scroll-mt-[100px]">
                <h2 className="font-['Libre_Caslon_Text'] font-normal text-[clamp(22px,2.4vw,30px)] text-[color:var(--ink-strong)] leading-[1.25] mb-[24px]">
                  {s.heading}
                </h2>

                {s.body && (
                  <p className="font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)]">
                    <Emphasis text={s.body} />
                  </p>
                )}

                {s.blocks && (
                  <div className="mt-[20px]">
                    <Blocks blocks={s.blocks} tint={project.bg} />
                  </div>
                )}

                {s.figuresFirst && s.figures && (
                  <div className="mt-[28px] grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    {s.figures.map(f => (
                      <div key={f.caption} className={f.span === 'half' ? '' : 'sm:col-span-2'}>
                        <FigureBlock figure={f} tint={project.bg} />
                      </div>
                    ))}
                  </div>
                )}

                {s.bullets && (
                  <ul className="flex flex-col gap-[10px] mt-[20px] list-none">
                    {s.bullets.map(b => (
                      <li key={b} className="flex items-start gap-[12px]">
                        <span
                          aria-hidden="true"
                          className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--study-accent,var(--accent))]"
                        />
                        <span className="font-['Open_Sans'] text-[16px] lg:text-[14px] leading-[1.6] text-[color:var(--ink-body)]">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.highlight && (
                  <p className="font-['Open_Sans'] font-semibold text-[14px] text-[color:var(--study-accent,var(--accent))] mt-[20px]">
                    {s.highlight}
                  </p>
                )}

                {!s.figuresFirst && s.figures && (
                  <div className="mt-[28px] grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    {s.figures.map(f => (
                      <div key={f.caption} className={f.span === 'half' ? '' : 'sm:col-span-2'}>
                        <FigureBlock figure={f} tint={project.bg} />
                      </div>
                    ))}
                  </div>
                )}

                {s.outro && (
                  <p className="font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)] mt-[20px]">
                    {s.outro}
                  </p>
                )}

                {s.action && (
                  <div className="mt-[28px]">
                    {s.action.lead && (
                      <p className="font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)] mb-[16px]">
                        {s.action.lead}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[12px]">
                      <a
                        href={s.action.href}
                        {...(s.action.download
                          ? { download: true }
                          : { target: '_blank', rel: 'noopener noreferrer' })}
                      >
                        <Button variant="primary">
                          <span className="inline-flex items-center gap-[8px]">
                            {s.action.label}
                            {/* a download or an external site both take the reader out —
                                the turned arrow, not the onward one */}
                            <LeaveIcon />
                          </span>
                        </Button>
                      </a>
                      {s.action.aside && (
                        <a
                          href={s.action.aside.href}
                          className="font-['Open_Sans'] text-[15px] text-[color:var(--ink-strong)] underline underline-offset-[4px] decoration-[color:var(--line)] hover:decoration-[color:var(--ink-strong)] transition-colors duration-[150ms]"
                        >
                          {s.action.aside.label}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-[var(--section-gap)] pt-[20px] border-t border-[color:var(--line)] flex flex-col gap-[28px] sm:flex-row sm:items-center sm:justify-between">
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {project.tags.map(t => (
                  <Link
                    key={t}
                    to={`/projects?tag=${encodeURIComponent(t)}`}
                    aria-label={`See all case studies tagged ${t}`}
                    className="rounded-full transition-opacity duration-[150ms] hover:opacity-70"
                  >
                    <Tag label={t} />
                  </Link>
                ))}
              </div>
            )}

            {/* the way on, once the reader reaches the end: the next study in the set,
                wrapping back to the first after the last */}
            {next && (
              <Link
                to={next.href}
                className={`${META_LABEL} flex items-center gap-[6px] shrink-0 hover:text-[color:var(--ink-strong)] transition-colors duration-[150ms]`}
              >
                Next case study <ArrowIcon className="h-[11px] w-[11px]" />
              </Link>
            )}
          </div>

        </article>
      </div>
    </div>
  )
}
