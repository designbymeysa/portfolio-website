import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../../hooks/useInView'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import { projects as allProjects } from '../../data/projects'
import { headlineFor, eyebrowFor } from '../../data/caseStudies'
import { ProjectStill } from './ProjectMedia'
import type { Project } from '../../data/projects'
import { Tag } from '../Tag/Tag'
import { SectionLabel } from '../ui/SectionLabel'
import { ArrowIcon } from '../ui/LinkIcons'
import { CardBadge } from '../ui/CardBadge'
import { useCursorPill } from '../ui/CursorPill'
import { useTouchReveal } from '../../hooks/useTouchReveal'
import site from '../../content/site.json'
import { HERO_PEEK } from '../Hero/peek'
import type React from 'react'

const featured = allProjects.slice(0, 3)

const REDUCED = '(prefers-reduced-motion: reduce)'

/** One project card. Its own component because the cursor pill and the touch reveal
 *  are hooks, and there is now one card per project rather than one card for all. */
function WorkCard({ project, index, count }: { project: Project; index: number; count: number }) {
  const view = useCursorPill('View')
  const cardRef = useRef<HTMLAnchorElement>(null)
  // no hover on touch: the card lights while it holds the screen
  const touchActive = useTouchReveal(cardRef)

  return (
    <Link
      to={project.href}
      ref={cardRef}
      data-active={touchActive || undefined}
      /* row-reverse rather than reordering the markup: the image still comes first in
         the DOM, so it is read before the copy it belongs to */
      className="works-card works-stack-card group no-underline flex flex-col-reverse lg:flex-row-reverse lg:items-center overflow-hidden rounded-[2px] w-full relative h-full lg:h-[480px]"
      /* the VIEW pill is this card's cursor */
      {...view.bind}
    >
      {view.pill}

      {/* image */}
      <ProjectStill
        project={project}
        className="w-full flex-1 min-h-[168px] sm:min-h-[240px] md:min-h-[300px] lg:flex-none lg:flex-shrink-0 lg:min-h-0 lg:w-1/2 lg:h-full"
      />

      {/* text */}
      <div className="flex flex-col justify-between flex-none lg:flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-[48px] lg:py-[48px] h-auto lg:h-full">
        <div className="flex flex-col gap-[10px] lg:gap-[16px]">
          {/* which project of the set this is — a small numeral in the face of the
              headline, so it reads as a folio rather than a control — and under it the
              kind of project, the eyebrow its case study opens with */}
          <div className="flex flex-col items-start gap-[16px] lg:gap-[24px]">
            {/* the card's own number leads at size; the total trails it, small */}
            <span className="font-heading font-medium leading-none tabular-nums text-[color:var(--ink-muted)]">
              <span className="text-[32px] lg:text-[40px] text-[color:var(--ink-strong)]">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-[14px] lg:text-[16px] ml-[6px]">/ {String(count).padStart(2, '0')}</span>
            </span>
            <span
              className="font-heading font-semibold text-[10px] uppercase tracking-[0.18em] leading-none text-[color:var(--ink-muted)]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {eyebrowFor(project)}
            </span>
          </div>
          {/* the headline the case study opens with */}
          <p className="font-heading font-medium text-[24px] sm:text-[28px] lg:text-[32px] text-[color:var(--ink-strong)] leading-[1.2] tracking-[-0.8px]">
            {headlineFor(project)}
          </p>
          <p className="font-sans font-normal text-[16px] text-[color:var(--ink-body)] leading-[24px] lg:leading-[26px] line-clamp-3 sm:line-clamp-5 lg:line-clamp-none"
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

      {/* the dim that settles over a card as the next one covers it — a layer whose
          opacity follows --stack-p, so only opacity ever changes */}
      <span aria-hidden="true" className="works-stack-scrim" />
    </Link>
  )
}

export function WorksSection() {
  const { ref, inView } = useInView()
  const items = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useMatchMedia(REDUCED)
  // with the first card peeking into the hero, the section is on screen from the first
  // frame — the in-view threshold is a share of the whole stack and would never trip,
  // so it rises in on load instead, one frame after mount so the transition runs
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (!HERO_PEEK) return
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  const visible = inView || mounted

  // Scroll drives the stack. Every card is sticky at the same spot, so DOM order alone
  // makes each one ride up over the last; this only adds the depth — how far the cards
  // above have covered a card is written to it as --stack-p, and the CSS turns that
  // into a scale and a dim. Reads all come before writes, so layout is never thrashed,
  // and the values are only written when they move.
  useEffect(() => {
    if (reduced) return
    const els = items.current.filter((el): el is HTMLDivElement => el !== null)
    if (els.length < 2) return

    // where each card pins — the sticky `top`, read once and again on resize
    let tops: number[] = []
    const last: number[] = els.map(() => -1)
    let rafId = 0
    let queued = false

    const measure = () => {
      tops = els.map(el => parseFloat(getComputedStyle(el).top) || 0)
    }

    const update = () => {
      queued = false
      const vh = window.innerHeight

      // read: how far each card after the first has travelled from the bottom of the
      // screen to its pinned spot
      const rects = els.map(el => el.getBoundingClientRect())
      const arrival = els.map((_, k) => {
        if (k === 0) return 0
        const run = vh - tops[k]
        if (run <= 0) return 0
        return Math.min(1, Math.max(0, (vh - rects[k].top) / run))
      })

      // write: a card's cover is the sum of the arrivals of everything above it, so
      // deeper cards sit smaller and dimmer than the one just under the top
      let cover = 0
      for (let k = els.length - 1; k >= 0; k--) {
        if (Math.abs(cover - last[k]) > 0.001) {
          els[k].style.setProperty('--stack-p', cover.toFixed(3))
          last[k] = cover
        }
        cover += arrival[k]
      }
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      rafId = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      els.forEach(el => el.style.removeProperty('--stack-p'))
    }
  }, [reduced])

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="work"
      className={`pt-[72px] md:pt-[88px] ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:px-[80px]">
        {/* the stack — a row for the label, then one per project, each a screen tall
            so every card gets a full scroll to arrive; the last row is only as tall as
            its card, so the page moves on the moment the final card has landed. In
            reduced motion the rows are dropped and everything sits in a column. */}
        <div
          className="works-stack"
          style={reduced || featured.length < 2 ? undefined : { gridTemplateRows: `auto repeat(${featured.length - 1}, var(--stack-step)) auto` }}
        >
          {/* the label is in the grid so it can pin too — it holds under the nav for
              the whole run of cards, and the section lands looking exactly as it
              holds, whether you scroll here or jump from another page */}
          <div className="works-stack-label">
            <SectionLabel>{site.works.label}</SectionLabel>
          </div>

          {featured.map((project, idx) => (
            <div
              key={project.id}
              ref={el => { items.current[idx] = el }}
              className="works-stack-item"
              /* each card pins a little lower than the one before, so the covered
                 cards show as edges above it — a deck, not a swap */
              style={{ '--i': idx } as React.CSSProperties}
            >
              <WorkCard project={project} index={idx} count={featured.length} />
            </div>
          ))}
        </div>

        {/* the way out, under the stack */}
        <div className="flex justify-end mt-[24px]">
          <Link
            to="/projects"
            className="font-heading font-semibold text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.22em] flex items-center gap-1 shrink-0"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            {site.works.viewAll} <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
