import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from '../../hooks/useInView'
import { useTouchReveal } from '../../hooks/useTouchReveal'
import { useParallax } from '../../hooks/useParallax'
import { SectionLabel } from '../ui/SectionLabel'
import { LeaveIcon } from '../ui/LinkIcons'
import Stack from '../Stack/Stack'
import { SkillsTicker } from '../Ticker/SkillsTicker'
import about from '../../content/about.json'
import type React from 'react'

// Every word and every path in this section comes from `src/content/about.json`.
// Photos: drop the files in public/about/ and list them there; each carries the caption
// its cursor pill shows while that photo is the one on top. Add or remove entries to
// match how many you have — nothing here counts them.
const EXPERIENCE = about.experience.items
const photos = about.photos

// Stack paints the last card on top, so reverse — photo_1 is the one on show by default.
// Stack numbers cards 1..n by their position in this deck, so a card's id indexes it.
const photoDeck = [...photos].reverse()

// one weight and one ink across the whole block — no phrase is set apart
const ABOUT_COPY = about.copy

/** `*like this*` in the copy becomes an italic run — the one piece of inline markup the
 *  JSON gets, so an aside can be set in the voice of an aside. */
function Italics({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*')
          ? <em key={i}>{part.slice(1, -1)}</em>
          : <span key={i}>{part}</span>,
      )}
    </>
  )
}

// same pitch as the hero's grid, so the two sections rule to one another
const CELL = 28

// a pared-back polaroid: white ground, a thin margin on three sides and the deeper
// chin along the bottom. No caption in the chin — the cursor pill carries that.
// A caption that follows a cursor needs a cursor. On touch there is none — iOS fires
// one synthetic mousemove on tap and no mouseleave — so the label would appear at the
// tap and ride along as the reader scrolls away. There it is pinned to the photo
// instead, landing somewhere different each time the deck turns over.
const FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** a spot inside the photo, kept clear of the edges and the corner it is tilted from */
function randomSpot() {
  return { left: 24 + Math.random() * 46, top: 22 + Math.random() * 44 }
}

const photoCards = photoDeck.map(({ src }, i) => (
  <div key={src} className="w-full h-full bg-[color:var(--frame)] p-[10px] pb-[40px] flex select-none">
    <img
      src={src}
      alt={`Meysa — photo ${photoDeck.length - i}`}
      className="w-full h-full object-cover"
      draggable={false}
    />
  </div>
))

function ExperienceRow({ e }: { e: typeof EXPERIENCE[number] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  // on a touch screen the row lights as it passes the middle of the screen instead
  const active = useTouchReveal(rowRef)

  return (
    <div
      ref={rowRef}
      data-active={active || undefined}
      className="group grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-x-[20px] gap-y-[8px] md:gap-x-[40px] items-center py-[28px] px-[16px] rounded-none border-b border-[color:var(--line)] transition-colors duration-[200ms] hover:bg-[color:var(--surface-2)] data-[active]:bg-[color:var(--surface-2)]"
    >
      {/* logo leads the row — the slot is zero-width at rest and opens to
          48px + gap on hover, so the text only moves while the logo is up.
          max-w-none keeps preflight's `img { max-width: 100% }` from
          collapsing the image to nothing inside the closed slot. */}
      <div className="flex items-center">
        <div className="shrink-0 w-0 overflow-hidden transition-[width] duration-[250ms] ease-out group-hover:w-[68px] group-data-[active]:w-[68px]">
          <img
            src={e.logo}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-[48px] w-[48px] max-w-none mr-[20px] object-cover rounded-[2px] opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100 group-data-[active]:opacity-100"
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="font-['Open_Sans'] font-semibold text-[20px] text-[color:var(--ink-strong)] leading-[1.2] transition-colors duration-[200ms] group-hover:text-[color:var(--ink-strong)]" style={{ fontVariationSettings: '"wdth" 100' }}>
            {e.role}
          </span>
          {/* named group so the underline lands on the text only — an
              underline on the anchor would run beneath the icon too */}
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-[6px] w-fit font-['Open_Sans'] font-normal text-[16px] text-[color:var(--ink-body)] no-underline transition-colors duration-[200ms] group-hover:text-[color:var(--ink-strong)] group-data-[active]:text-[color:var(--ink-strong)]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            <span className="underline-offset-[3px] decoration-[1px] group-hover/link:underline">
              {e.org}
            </span>
            <LeaveIcon className="opacity-0 transition-opacity duration-[200ms] group-hover/link:opacity-100 group-data-[active]:opacity-60" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
      <span className="font-['Open_Sans'] font-normal text-[14px] text-[color:var(--ink-muted)] md:text-right transition-colors duration-[200ms] group-hover:text-[color:var(--ink-body)] group-data-[active]:text-[color:var(--ink-body)]" style={{ fontVariationSettings: '"wdth" 100' }}>
        {e.period}
      </span>
    </div>
  )
}

export function AboutSection() {
  const { ref, inView } = useInView()
  // the copy leads the scroll a touch, the photos lag behind it — the two rates
  // are what give the row depth as it passes
  const introRef = useParallax<HTMLDivElement>(-0.025)
  const photoRef = useParallax<HTMLDivElement>(0.07)
  const gridRef   = useParallax<HTMLDivElement>(0)
  const skillsRef = useRef<HTMLDivElement>(null)
  const expRef    = useRef<HTMLDivElement>(null)

  // The grid's mask is a percentage ramp down the section, so the bands to clear have
  // to be measured rather than guessed — both blocks move with the copy above them.
  // Recomputed whenever any of the boxes changes size.
  useEffect(() => {
    const grid    = gridRef.current
    const section = grid?.parentElement
    const blocks  = [skillsRef.current, expRef.current].filter(Boolean) as HTMLElement[]
    if (!grid || !section || !blocks.length) return

    const apply = () => {
      const s = section.getBoundingClientRect()
      if (!s.height) return

      const pct = (v: number) => Math.min(100, Math.max(0, ((v - s.top) / s.height) * 100))
      const measured = blocks
        .map(el => el.getBoundingClientRect())
        .map(b => ({ top: pct(b.top), bottom: pct(b.bottom) }))
        .sort((a, b) => a.top - b.top)

      // two blocks close together are treated as one: the strip of grid that would
      // otherwise reappear in the gap between them is narrower than its own fade
      const MERGE_GAP = 15
      const bands: { top: number; bottom: number }[] = []
      for (const band of measured) {
        const prev = bands[bands.length - 1]
        if (prev && band.top - prev.bottom < MERGE_GAP) prev.bottom = Math.max(prev.bottom, band.bottom)
        else bands.push({ ...band })
      }

      // stops have to climb, so each one is held at or above the one before it
      let last = 0
      const at = (v: number) => { last = Math.min(100, Math.max(last, v)); return `${last.toFixed(2)}%` }

      const stops = [`transparent ${at(0)}`, `black ${at(14)}`]
      bands.forEach((band, i) => {
        // the grid dies out a little before each block rather than stopping against it
        stops.push(`black ${at(band.top - 5)}`, `transparent ${at(band.top - 1)}`)
        // after the last block it stays gone — that stretch is where the purple
        // arrives, and ruled lines under a rising colour field read as noise
        if (i < bands.length - 1) {
          stops.push(`transparent ${at(band.bottom + 1)}`, `black ${at(band.bottom + 5)}`)
        }
      })
      stops.push(`transparent ${at(100)}`)

      const mask = `linear-gradient(to bottom, ${stops.join(', ')})`
      grid.style.webkitMaskImage = mask
      grid.style.maskImage = mask
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(section)
    blocks.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const [photoPill, setPhotoPill] = useState({ visible: false, x: 0, y: 0 })
  // the deck starts with the last card on top; Stack confirms it on mount
  const [topPhotoId, setTopPhotoId] = useState(photoDeck.length)
  const [pillSpot, setPillSpot] = useState(randomSpot)
  const photoCaption = photoDeck[topPhotoId - 1]?.caption ?? photos[0].caption

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="about"
      className={`relative pt-[var(--section-gap)] pb-[calc(var(--section-gap)*1.8)] ${inView ? 'section-visible' : 'section-hidden'}`}
    >
      {/* grid lines, carried over from the hero — behind the content, and fading out
          at the top and bottom so it never ends on a hard edge */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL}px ${CELL}px`,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)',
        }}
      />
      {/* same pill as the project cards' VIEW cursor, over the photo stack */}
      {(photoPill.x > 0 || photoPill.y > 0) && createPortal(
        <span
          aria-hidden="true"
          data-on={photoPill.visible || undefined}
          className="cursor-pill pointer-events-none fixed z-[9999] inline-flex items-center justify-center bg-[color:var(--cursor-pill-bg)] text-[color:var(--cursor-pill-fg)] font-['Open_Sans'] font-semibold text-[12px] tracking-[0.02em] px-6 py-3 rounded-full select-none shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
          style={{ left: photoPill.x, top: photoPill.y }}
        >
          {photoCaption}
        </span>,
        document.body
      )}

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">

        {/* ── ABOUT — intro + photo ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-[56px] lg:gap-[96px]">
          <div ref={introRef} className="flex-1">
            <SectionLabel className="mb-[20px]">{about.label}</SectionLabel>

            <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-[color:var(--ink-strong)] leading-[1.2] tracking-[-0.8px] mb-[32px]">
              {about.heading}
            </h2>

            <div className="flex flex-col gap-[24px] max-w-[520px]">
              {ABOUT_COPY.map(para => (
                <p
                  key={para.slice(0, 32)}
                  className="font-['Open_Sans'] font-normal text-[17px] text-[color:var(--ink-body)] leading-[1.6]"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  <Italics text={para} />
                </p>
              ))}
            </div>
          </div>

          {/* stacked photo card */}
          <div ref={photoRef} className="flex-shrink-0 flex justify-center lg:justify-end">
            <div
              data-cursor="hide"
              className="about-photo-stack relative w-[280px] h-[350px] sm:w-[360px] sm:h-[450px]"
              onMouseMove={e => {
                if (!FINE_POINTER) return
                setPhotoPill({ visible: true, x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setPhotoPill(p => ({ ...p, visible: false }))}
            >
              <Stack
                randomRotation
                sensitivity={140}
                sendToBackOnClick
                mobileClickOnly
                cards={photoCards}
                onTopCardChange={id => {
                  setTopPhotoId(id ?? photoDeck.length)
                  // a new photo, a new place for its caption to sit
                  setPillSpot(randomSpot())
                }}
              />

              {!FINE_POINTER && (
                <span
                  className="cursor-pill pointer-events-none absolute z-20 inline-flex items-center justify-center bg-[color:var(--cursor-pill-bg)] text-[color:var(--cursor-pill-fg)] font-['Open_Sans'] text-ui px-6 py-3 rounded-full select-none shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
                  data-on="true"
                  style={{ left: `${pillSpot.left}%`, top: `${pillSpot.top}%` }}
                >
                  {photoCaption}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLS — apps I work with ─────────────────────────── */}
      <div ref={skillsRef} className="mt-[112px] lg:mt-[160px]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">
          <SectionLabel className="mb-[24px]">{about.skills.label}</SectionLabel>
        </div>
        <SkillsTicker />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">

        {/* ── EXPERIENCE — where I've worked ───────────────────── */}
        <div ref={expRef} id="experience-end" className="mt-[56px] lg:mt-[80px] pb-[56px] lg:pb-[80px]">
          <SectionLabel className="mb-[20px]">{about.experience.label}</SectionLabel>

          <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-[color:var(--ink-strong)] leading-[1.2] tracking-[-0.8px] mb-[40px]">
            {about.experience.heading}
          </h2>

          <div className="border-t border-[color:var(--line)]">
            {EXPERIENCE.map((e) => (
              <ExperienceRow key={e.role} e={e} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
