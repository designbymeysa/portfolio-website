import { useEffect, useRef } from 'react'
import type { Project } from '../../data/projects'
import { coverFor } from '../Covers'
import site from '../../content/site.json'

/** Scroll-driven state shared with the pinned section: `i` is the outgoing
 *  project index, `t` the 0→1 crossfade progress toward project `i + 1`. */
export interface MediaState {
  i: number
  t: number
}

interface ProjectMediaProps {
  projects: Project[]
  /** live scroll state — read inside the draw loop so React never re-renders per frame */
  stateRef: React.MutableRefObject<MediaState>
  className?: string
}

/** What fills a project's frame: a drawn cover where the project names one, its
 *  photograph otherwise, and the project's own colour where it has neither. */
function Cover({ project }: { project: Project }) {
  const Drawn = coverFor(project.cover)
  if (Drawn) return <Drawn className="w-full h-full" />
  if (!project.image) return null
  return (
    <img
      src={project.image}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="w-full h-full object-cover"
    />
  )
}

/** One layer per project, stacked and crossfaded by the pinned section's scroll.
 *  Opacity is written straight to the DOM so scrolling never triggers a render. */
export function ProjectMedia({ projects, stateRef, className }: ProjectMediaProps) {
  const layers = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let rafId = 0
    const frame = () => {
      const { i, t } = stateRef.current
      layers.current.forEach((el, idx) => {
        if (!el) return
        el.style.opacity = idx === i ? String(1 - t) : idx === i + 1 ? String(t) : '0'
      })
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [stateRef])

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {projects.map((project, idx) => (
        <div
          key={project.id}
          ref={el => { layers.current[idx] = el }}
          className="absolute inset-0"
          style={{ background: project.bg, opacity: idx === 0 ? 1 : 0 }}
        >
          <Cover project={project} />
        </div>
      ))}
    </div>
  )
}

/** The still version, for the cards on the homepage and /projects. A project that is
 *  still on its way sits under a shade with the "Coming soon" label on it — the cover
 *  only, so the card's copy stays readable. On hover the cursor pill takes the words
 *  over: the shade lifts a little and its label eases out and up, so "Coming soon" is
 *  never said twice. */
export function ProjectStill({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ background: project.bg }}
    >
      <Cover project={project} />
      {project.comingSoon && (
        <div className="coming-soon-shade absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="coming-soon-label font-heading font-normal text-[13px] lg:text-[14px] uppercase tracking-[2.6px] text-white"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            {site.workPage.comingSoonLabel}
          </span>
        </div>
      )}
    </div>
  )
}
