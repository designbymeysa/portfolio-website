import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useInView } from '../../hooks/useInView'
import { projects as allProjects } from '../../data/projects'
import { ProjectMedia, type MediaState } from './ProjectMedia'
import { Tag } from '../Tag/Tag'
import { SectionLabel } from '../ui/SectionLabel'
import { ArrowIcon } from '../ui/LinkIcons'
import { CardBadge } from '../ui/CardBadge'
import { useTouchReveal } from '../../hooks/useTouchReveal'
import type React from 'react'

// The VIEW label follows a cursor, and a touch screen has none: iOS fires one synthetic
// mousemove on tap and never a mouseleave, so the pill would appear at the tap and stay
// there for the rest of the session. Only show it where there is a real pointer.
const FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

const featured = allProjects.slice(0, 3)

// fraction of each scroll segment spent holding a project still before it dissolves
const HOLD = 0.42

export function WorksSection() {
  const { ref, inView } = useInView()
  const trackRef   = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const centerRef  = useRef<HTMLDivElement>(null)
  const blockRef   = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const mediaState = useRef<MediaState>({ i: 0, t: 0 })

  // the project whose copy is currently rendered — flips at the midpoint of a dissolve
  const [active, setActive] = useState(0)
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)
  // no hover on touch: the pinned card lights while it holds the screen
  const touchActive = useTouchReveal(cardRef)

  // scroll drives the crossfade: the card stays pinned while the image swaps projects
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const segments = Math.max(1, featured.length - 1)
    let rafId = 0
    let queued = false

    const update = () => {
      queued = false
      const rect  = track.getBoundingClientRect()
      const span  = rect.height - window.innerHeight
      const p     = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0

      const raw = p * segments
      const i   = Math.min(segments - 1, Math.floor(raw))
      const f   = raw - i
      const t   = f <= HOLD ? 0 : Math.min(1, (f - HOLD) / (1 - HOLD))

      mediaState.current = { i, t }

      if (textRef.current) {
        // copy fades out as the image crossfades, then back in on the new project
        const away = 1 - Math.abs(t - 0.5) * 2
        textRef.current.style.opacity   = String(Math.max(0, 1 - away * 1.35))
        textRef.current.style.transform = `translateY(${away * 14}px)`
      }
      setActive(t < 0.5 ? i : i + 1)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // the card is centred in the space under the header, which leaves slack beneath it —
  // pull the track up by that slack so the gap to About is just --section-gap
  useEffect(() => {
    const track = trackRef.current
    const center = centerRef.current
    const block = blockRef.current
    if (!track || !center || !block) return

    const apply = () => {
      const slack = (center.offsetHeight - block.offsetHeight) / 2
      track.style.marginBottom = `${-Math.max(0, Math.round(slack))}px`
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(center)
    observer.observe(block)
    return () => observer.disconnect()
  }, [])

  // Each dash jumps to where that project holds still. The track is one screen per
  // handover plus one for the panel, so a project's resting point is its index plus a
  // little of the hold — far enough in that the crossfade has finished.
  const goTo = (idx: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const span = rect.height - window.innerHeight
    if (span <= 0) return
    const p = Math.min(1, (idx + HOLD * 0.5) / Math.max(1, featured.length))
    window.scrollTo({ top: rect.top + window.scrollY + p * span, behavior: 'smooth' })
  }

  const project = featured[Math.min(active, featured.length - 1)]

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="work"
      className={inView ? 'section-visible' : 'section-hidden'}
    >
      {/* scroll track — one screen per project; header and card are pinned together */}
      <div ref={trackRef} style={{ height: `${featured.length * 100}svh` }} className="relative">
        {/* dvh, not svh: the pinned screen has to match what is actually visible. In svh
            it stays the height of the screen *with* the browser bars showing, so the
            moment they retract a strip of bare page opens along the bottom. dvh tracks
            the viewport as they come and go. The track below stays in svh — scroll
            length should not change underfoot. */}
        <div ref={stickyRef} className="sticky top-0 h-[100dvh] flex flex-col pt-[72px] pb-[20px] md:pt-[88px] lg:pb-0">

          {/* header — stays in view for the whole run of projects */}
          <div className="shrink-0 max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:px-[80px] mb-[16px] md:mb-0">
            <SectionLabel>Case studies</SectionLabel>
          </div>

          {/* the card fills whatever the header leaves on a phone, and is centred in it
              from lg up, where it has a height of its own */}
          <div ref={centerRef} className="flex-1 min-h-0 flex items-stretch lg:items-center">
            <div ref={blockRef} className="flex flex-col min-h-0 max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:block lg:px-[80px]">

            <div className="relative flex-1 min-h-0 lg:flex-none">
            {/* the card */}
            <Link
              to={project.href}
              ref={cardRef}
              data-active={touchActive || undefined}
              /* row-reverse rather than reordering the markup: the image still comes
                 first in the DOM, so it is read before the copy it belongs to */
              className="works-card group no-underline flex flex-col-reverse lg:flex-row-reverse lg:items-center overflow-hidden rounded-[2px] w-full relative h-full lg:h-[480px]"
              style={{
                // each card carries its own project's colour for the wash
                ['--card-tint' as string]: project.bg,
              } as React.CSSProperties}
              /* the VIEW pill is this card's cursor, so the ring stands down */
              data-cursor="hide"
              /* viewport coordinates, not card-relative: the pill is portalled to the
                 body so the card's overflow-hidden cannot crop it */
              onMouseMove={e => {
                if (!FINE_POINTER) return
                setPill({ visible: true, x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setPill(p => ({ ...p, visible: false }))}
            >
              {(pill.x > 0 || pill.y > 0) && createPortal(
                <span
                  aria-hidden="true"
                  data-on={pill.visible || undefined}
                  className="cursor-pill pointer-events-none fixed z-[9999] inline-flex items-center justify-center bg-[color:var(--cursor-pill-bg)] text-[color:var(--cursor-pill-fg)] font-['Open_Sans'] font-semibold text-[12px] tracking-[0.02em] px-6 py-3 rounded-full select-none shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pill.x, top: pill.y }}
                >
                  View
                </span>,
                document.body,
              )}

              {/* image — crossfades between projects on scroll */}
              <ProjectMedia
                projects={featured}
                stateRef={mediaState}
                className="w-full flex-1 min-h-[168px] sm:min-h-[240px] md:min-h-[300px] lg:flex-none lg:flex-shrink-0 lg:min-h-0 lg:w-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-[color:var(--line)]"
              />

              {/* text */}
              <div className="flex flex-col justify-between flex-none lg:flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-[48px] lg:py-[48px] h-auto lg:h-full">
                <div ref={textRef} className="flex flex-col justify-between h-auto lg:h-full">
                  <div className="flex flex-col gap-[10px] lg:gap-[16px]">
                    {project.subtitle && (
                      <p className="font-['Open_Sans'] font-normal text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.12em]"
                        style={{ fontVariationSettings: '"wdth" 100' }}>
                        {project.subtitle}
                      </p>
                    )}
                    <p className="font-['Libre_Caslon_Text'] font-normal text-[24px] sm:text-[28px] lg:text-[32px] text-[color:var(--ink-strong)] leading-[1.2] tracking-[-0.8px]">
                      {project.title}
                    </p>
                    <p className="font-['Open_Sans'] font-light text-[14px] lg:text-[16px] text-[color:var(--ink-body)] leading-[21px] lg:leading-[26px] line-clamp-3 sm:line-clamp-5 lg:line-clamp-none"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-[18px] sm:mt-[26px] lg:mt-0">
                    <div className="flex gap-[8px] flex-wrap">
                      {project.tags.map(tag => <Tag key={tag} label={tag} />)}
                    </div>
                    <CardBadge />
                  </div>
                </div>
              </div>
            </Link>

            </div>

            {/* which project of the set is showing — it fades out with the card */}
            <div className="flex items-center justify-between gap-4 mt-[24px]">
              <div className="flex items-center gap-3">
              <span className="font-['Open_Sans'] text-[12px] text-[color:var(--ink-muted)] tracking-[0.08em] tabular-nums"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                {String(active + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                {featured.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-label={`Go to ${p.title}`}
                    aria-current={idx === active || undefined}
                    /* the target is 28×16 while the mark stays 2px — a hairline is far
                       too small to hit */
                    className="group/dash h-4 w-[28px] flex items-center"
                  >
                    <span
                      className={`block h-[2px] w-full transition-colors duration-300 ${
                        idx === active
                          ? 'bg-[color:var(--ink-strong)]'
                          : 'bg-[color:var(--line)] group-hover/dash:bg-[color:var(--ink-muted)]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              </div>

              {/* the way out, under the cards */}
              <Link
                to="/projects"
                className="font-['Open_Sans'] font-semibold text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.22em] flex items-center gap-1 shrink-0"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                VIEW ALL <ArrowIcon />
              </Link>
            </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
