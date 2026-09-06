import { useEffect, useRef } from 'react'
import type { Project } from '../../data/projects'

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
          {project.image && (
            <img
              src={project.image}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  )
}

/** The still version, for the grid on /projects. */
export function ProjectStill({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ background: project.bg }}
    >
      {project.image && (
        <img
          src={project.image}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}
