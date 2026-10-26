import { useEffect, useRef, useState, type ReactNode } from 'react'
import type React from 'react'
import type { Block, Figure } from '../../data/caseStudies'
import { Tag } from '../Tag/Tag'
import { ArrowIcon, ChevronIcon } from '../ui/LinkIcons'
import { coverFor } from '../Covers'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import { useInView } from '../../hooks/useInView'

// ── shared type ──
// Every block sets its running copy the way the case study's own paragraphs are set,
// so a block reads as part of the page rather than a widget dropped into it.
const BODY  = "font-sans font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)]"
const LABEL = "font-heading font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-muted)]"
// a heading within a section, one step down from the section's own serif heading.
// Set in the sans rather than the serif so the two levels read as different kinds of
// thing — the serif names the section, this names a part of it
const SUBHEAD = "font-heading font-semibold text-[17px] lg:text-[18px] text-[color:var(--ink-strong)] leading-[1.3]"
const WDTH  = { fontVariationSettings: '"wdth" 100' } as const
/** the caption under every picture and diagram, set against the frame's right edge —
 *  the same place the slider puts its own, so the page reads consistently */
const CAPTION = "font-sans text-[13px] text-[color:var(--ink-muted)] text-right mt-[10px]"

/** `**like this**` in content is set as plain text: the markers are dropped and the run
 *  keeps the paragraph's own weight and ink, so each text style reads as one. */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <span key={i}>{part.slice(2, -2)}</span>
          : <span key={i}>{part}</span>,
      )}
    </>
  )
}

function lightness(hex: string) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return 255
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// ── motion ──

/** Fades a piece of the study up into place the first time it scrolls into view; any
 *  row inside marked `cs-stagger` follows one item after another, and pictures settle
 *  from a slight zoom. The motion itself is in globals.css, and only runs for readers
 *  who have not asked for less of it. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.12)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`cs-reveal ${inView ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  )
}

/** the place in a staggered row, read by the CSS as a delay */
const nth = (i: number) => ({ '--i': i }) as React.CSSProperties

/** A headline number that counts up from zero the first time it is seen, keeping its
 *  decimals and whatever it carries around the digits ("70%", "4.33"). A value with
 *  no number in it, or a reader who prefers less motion, gets the value as written. */
function CountUp({ value }: { value: string }) {
  const { ref, inView } = useInView(0.5)
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
  const places = match?.[2].split(/[.,]/)[1]?.length ?? 0
  const [shown, setShown] = useState(match ? `${match[1]}${(0).toFixed(places)}${match[3]}` : value)

  useEffect(() => {
    if (!match || !inView) return
    const [, before, digits, after] = match
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return }
    const target = parseFloat(digits.replace(',', '.'))
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(`${before}${(target * eased).toFixed(places)}${after}`)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value])

  return <span ref={ref as React.RefObject<HTMLSpanElement>} aria-label={value}>{shown}</span>
}

/** A picture, or a captioned frame holding its place until the picture exists. */
export function FigureBlock({ figure, tint, uncaptioned }: { figure: Figure; tint: string; uncaptioned?: boolean }) {
  // the tile is the project's own colour, which may be pale or dark — the caption
  // picks the side that reads against it rather than assuming a light ground
  const onDark = lightness(tint) < 140
  const label = onDark ? 'text-white/45' : 'text-black/40'
  const caption = onDark ? 'text-white/70' : 'text-black/55'
  return (
    <figure className={figure.span === 'half' || figure.span === 'third' ? '' : 'w-full'}>
    <div
      className={`rounded-[2px] overflow-hidden w-full${figure.src && figure.darkBg ? ' dark:bg-[color:var(--figure-dark-bg)]' : ''}`}
      style={{
        aspectRatio: figure.ratio ?? '16 / 9',
        background: figure.src ? undefined : tint,
        ...(figure.darkBg && { '--figure-dark-bg': figure.darkBg }),
      } as React.CSSProperties}
    >
      {figure.src ? (
        <img
          src={figure.src}
          alt={figure.caption}
          loading="lazy"
          decoding="async"
          className={figure.contain ? 'w-full h-full object-contain p-[8%]' : 'w-full h-full object-cover'}
        />
      ) : (
        // no asset yet: the frame still holds its place, and says what belongs in it
        <div className="w-full h-full flex flex-col items-center justify-center gap-[6px] px-6 text-center">
          <span className={`font-heading font-semibold text-[10px] uppercase tracking-[0.18em] ${label}`}>
            Image
          </span>
          <span className={`font-sans text-[14px] lg:text-[13px] ${caption}`}>{figure.caption}</span>
        </div>
      )}
    </div>
    {figure.src && !uncaptioned && (
      <figcaption className={CAPTION} style={WDTH}>{figure.caption}</figcaption>
    )}
    </figure>
  )
}

/** how much of the six-column figure row each picture takes, from 640px up */
const FIGURE_SPAN = { full: 'sm:col-span-6', half: 'sm:col-span-3', third: 'sm:col-span-2' } as const

/** A section's pictures on one grid. With a `caption`, the row takes that one line
 *  beneath it and each picture keeps its own only as alt text. */
export function FigureRow({ figures, caption, tint }: { figures: Figure[]; caption?: string; tint: string }) {
  return (
    <figure className="mt-[28px]">
      <div className="cs-stagger grid grid-cols-1 sm:grid-cols-6 gap-[20px]">
        {figures.map((f, i) => (
          <div key={f.caption} className={FIGURE_SPAN[f.span ?? 'full']} style={nth(i)}>
            <FigureBlock figure={f} tint={tint} uncaptioned={!!caption} />
          </div>
        ))}
      </div>
      {caption && <figcaption className={CAPTION} style={WDTH}>{caption}</figcaption>}
    </figure>
  )
}

/** Two versions of a row of screens in the same place, split by one divider that starts
 *  halfway. The right row lies over the left and is clipped to the divider's right, so
 *  moving it trades one for the other across every screen at once. A drag anywhere in
 *  the frame moves it, from one edge of the frame to the other, and a range input over
 *  the frame carries it for the keyboard and for a screen reader.
 *
 *  Until someone touches it, the divider sways out and back now and then while it is on
 *  screen, so it reads as something to drag. Not under reduced motion. */
const NUDGE_EVERY_MS = 5000
const NUDGE_MS = 1600

function Compare({ left, right, ratio, caption }: Extract<Block, { kind: 'compare' }>) {
  const screen = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(50)
  const dragging = useRef(false)
  const touched = useRef(false)
  const { ref: seen, inView } = useInView(0.5)

  const moveTo = (clientX: number) => {
    const r = screen.current?.getBoundingClientRect()
    if (!r) return
    setAt(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  // the nudge: 50 → 35 → 65 → 50 on one smooth wave, once on arrival and then every
  // few seconds, until the reader takes the divider themselves
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const sway = () => {
      if (touched.current) return
      const start = performance.now()
      const tick = (now: number) => {
        if (touched.current) return
        const t = Math.min(1, (now - start) / NUDGE_MS)
        setAt(50 - 15 * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const first = window.setTimeout(sway, 400)
    const every = window.setInterval(sway, NUDGE_EVERY_MS)
    return () => { window.clearTimeout(first); window.clearInterval(every); cancelAnimationFrame(frame) }
  }, [inView])

  return (
    <figure className="w-full">
      <div
        ref={seen as React.RefObject<HTMLDivElement>}
        onPointerDown={e => { touched.current = true; dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX) }}
        onPointerMove={e => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
        data-cursor="slide"
        className="relative rounded-[2px] overflow-hidden w-full bg-[color:var(--surface)] flex items-center justify-center select-none py-[4%]"
        style={{ aspectRatio: '16 / 9', touchAction: 'pan-y' }}
      >
        <div ref={screen} className="group/cmp relative h-full w-full">
          {/* the two rows share one layout, centred across the whole frame, so each
              right screen sits exactly over its left one and the divider can travel
              edge to edge */}
          {[left, right].map((side, s) => (
            <div
              key={side.label}
              className={`flex h-full justify-center gap-[24px] ${s ? 'absolute inset-0' : ''}`}
              style={s ? { clipPath: `inset(0 0 0 ${at}%)` } : undefined}
            >
              {side.images.map(im => (
                <img
                  key={im.src}
                  src={im.src}
                  alt={im.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full object-contain"
                  style={{ aspectRatio: ratio }}
                />
              ))}
            </div>
          ))}

          {/* the divider: a hairline in the accent, with a round grip at its middle. It
              overshoots the phones and the frame's overflow trims it, so it runs the
              frame's full height */}
          <div aria-hidden="true" className="absolute -top-[50%] -bottom-[50%] w-[2px] -ml-[1px] bg-[color:var(--study-accent,var(--accent))]" style={{ left: `${at}%` }}>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[32px] w-[32px] rounded-full bg-[color:var(--study-accent,var(--accent))] flex items-center justify-center gap-[2px] text-white shadow-[0_2px_8px_rgb(0_0_0/0.15)] group-has-[:focus-visible]/cmp:ring-2 group-has-[:focus-visible]/cmp:ring-offset-2 group-has-[:focus-visible]/cmp:ring-[color:var(--study-accent,var(--accent))]">
              <ChevronIcon className="rotate-90" />
              <ChevronIcon className="-rotate-90" />
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(at)}
            onChange={e => { touched.current = true; setAt(Number(e.target.value)) }}
            aria-label={`Compare ${left.label.toLowerCase()} and ${right.label.toLowerCase()}`}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          />
        </div>
      </div>
      {caption && <figcaption className={CAPTION} style={WDTH}>{caption}</figcaption>}
    </figure>
  )
}

// ── the blocks ──

/** A small bordered rectangle of quieter type, for the things a reader should know
 *  before going on. `[text](url)` in the copy becomes a link. */
/** the takeaway a section lands on: a filled box, set off from the page by its ground
 *  rather than a border, at body size */
function Highlight({ text }: { text: string }) {
  return (
    <aside className="rounded-[2px] bg-[color:var(--surface-2)] px-[16px] py-[12px]">
      <p className={BODY} style={WDTH}>
        {text}
      </p>
    </aside>
  )
}

function Note({ body }: { body: string }) {
  const parts = body.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <aside className="rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)] px-[16px] py-[12px]">
      <p className="font-sans text-[13px] leading-[1.6] text-[color:var(--ink-muted)]" style={WDTH}>
        {parts.map((part, i) => {
          const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
          return m
            ? (
              <a
                key={i}
                href={m[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-[3px] decoration-[1px] decoration-[color:var(--line)] hover:decoration-[color:var(--ink-muted)] transition-colors duration-[150ms]"
              >
                {m[1]}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )
            : <span key={i}>{part}</span>
        })}
      </p>
    </aside>
  )
}

/** A subheading opens a new run inside the section, so it stands a line clear of
 *  whatever came before it — on top of the gap every block already gets. */
function Subheading({ text }: { text: string }) {
  return (
    <h3 className={`${SUBHEAD} mt-[24px]`} style={WDTH}>
      {text}
    </h3>
  )
}

function Lead({ lead, body, number }: { lead: string; body: string; number?: string }) {
  // a numbered lead opens a method of its own: its name is set at the subheading size,
  // the number beside it in the accent, and the body runs beneath. It stands a line
  // clear of whatever came before it — the previous method's images, or the section's
  // opening paragraph.
  if (number) {
    return (
      <div className="mt-[24px]">
        <h3 className={`${SUBHEAD} flex items-baseline gap-[12px] mb-[8px]`} style={WDTH}>
          <span className="shrink-0 font-heading font-bold tabular-nums text-[color:var(--study-accent,var(--accent))]">
            {number}
          </span>
          <span>{lead}</span>
        </h3>
        <p className={BODY} style={WDTH}><Emphasis text={body} /></p>
      </div>
    )
  }
  return (
    <p className={`${BODY} flex gap-[12px]`} style={WDTH}>
      <span aria-hidden="true" className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--study-accent,var(--accent))]" />
      <span>
        {lead && <><strong className="font-semibold">{lead}</strong>{' '}</>}{body}
      </span>
    </p>
  )
}

function Chips({ groups }: { groups: { label: string; items: string[] }[] }) {
  return (
    <div className="flex flex-col gap-[16px] pl-[17px]">
      {groups.map(g => (
        <div key={g.label}>
          <span className={`${LABEL} block mb-[8px]`}>{g.label}</span>
          <div className="flex flex-wrap gap-[8px]">
            {g.items.map(item => <Tag key={item} label={item} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Three columns of numbered steps, read left to right. The arrows between them are
 *  the site's own onward arrow; on a phone the columns stack and the arrows turn to
 *  point down the page. */
function Phases({ phases }: { phases: { label: string; steps: string[] }[] }) {
  return (
    // one column per phase with an arrow track between each, so any count sits on one row
    <div
      className="cs-stagger grid grid-cols-1 md:[grid-template-columns:var(--phase-cols)] gap-[16px] md:gap-[12px] items-stretch"
      style={{ '--phase-cols': phases.map(() => 'minmax(0,1fr)').join(' auto ') } as React.CSSProperties}
    >
      {phases.map((ph, i) => (
        <div key={ph.label} className="contents">
          <div className="rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)] p-[16px]" style={nth(i * 2)}>
            <span className={`${LABEL} block mb-[12px]`}>
              Phase {i + 1} · {ph.label}
            </span>
            <ol className="flex flex-col gap-[8px]">
              {ph.steps.map((step, j) => (
                <li key={step} className="flex gap-[10px] font-sans text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>
                  <span className="shrink-0 font-semibold tabular-nums text-[color:var(--study-accent,var(--accent))]">{j + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {i < phases.length - 1 && (
            <div className="flex justify-center md:self-center text-[color:var(--study-accent,var(--accent))]" style={nth(i * 2 + 1)} aria-hidden="true">
              <ArrowIcon className="h-[14px] w-[14px] rotate-90 md:rotate-0" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** One item of an accordion: a full-width button that reveals its bullets. The reveal
 *  animates the row from 0fr to 1fr — a grid track, not a height, so nothing has to
 *  be measured — and the state is on the button, where a screen reader looks for it. */
function AccordionItem({
  index, numbered, title, body, bullets, open, onToggle,
}: {
  index: number
  numbered?: boolean
  title: string
  body?: string
  bullets?: string[]
  open: boolean
  onToggle: () => void
}) {
  const panel = `acc-${title.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div>
      {/* the rule sits under the title, not over it — so an open item reads as
          title / rule / its points, and a closed one as title / rule / next title */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panel}
        className="group/acc w-full flex items-center justify-between gap-[16px] py-[18px] text-left border-b border-[color:var(--line)]"
      >
        <span className="flex items-baseline gap-[14px]">
          {numbered && (
            <span className="font-heading font-bold text-[15px] lg:text-[16px] tabular-nums leading-[1.3] text-[color:var(--study-accent,var(--accent))]">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          {/* the row title is the serif in the study's accent — it is the thing you open,
              and reads as a heading for what folds out beneath it */}
          <span className="font-heading font-bold text-[15px] lg:text-[16px] text-[color:var(--study-accent,var(--accent))] leading-[1.3]">
            {title}
          </span>
        </span>
        <ChevronIcon
          className={`text-[color:var(--study-accent,var(--accent))] transition-transform duration-[250ms] ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={panel}
        className="grid transition-[grid-template-rows] duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className={`pt-[16px] pb-[22px] ${numbered ? 'pl-[34px]' : ''}`}>
            {body && <p className={`${BODY} mb-[10px]`} style={WDTH}><Emphasis text={body} /></p>}
            {bullets && (
              <ul className="flex flex-col gap-[8px]">
                {bullets.map(b => (
                  <li key={b} className={`${BODY} flex gap-[12px]`} style={WDTH}>
                    <span aria-hidden="true" className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--study-accent,var(--accent))]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Accordion({
  eyebrow, title, intro, numbered, items,
}: Extract<Block, { kind: 'accordion' }>) {
  // Items toggle independently: they sit in two columns, and a single-open rule
  // across columns would close something the reader is still looking at.
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  // Two columns from md up, and each one is its own stack. A grid would share rows
  // across the columns, so opening an item on the left stretched its row and left a
  // hole under the item beside it; here a column only ever moves for its own items.
  // Items alternate left, right, left — the same order a grid would have shown them
  // in, so the numbering still reads across. Decided here rather than in CSS because
  // the split changes with the width: below md there is one column, in list order.
  const twoColumns = useMatchMedia('(min-width: 900px)')
  const indexed = items.map((item, i) => ({ item, i }))
  const columns = twoColumns
    ? [indexed.filter(({ i }) => i % 2 === 0), indexed.filter(({ i }) => i % 2 === 1)]
    : [indexed]

  return (
    <div>
      {eyebrow && <span className={`${LABEL} block mb-[10px]`}>{eyebrow}</span>}
      {title && (
        <h3 className={`${SUBHEAD} mb-[10px]`} style={WDTH}>
          {title}
        </h3>
      )}
      {intro && <p className={`${BODY} mb-[24px]`} style={WDTH}><Emphasis text={intro} /></p>}

      {/* every title carries 18px above it for rhythm between rows — the negative
          margin swallows that on the first row so the list starts where the intro ends */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-[40px] items-start ${intro ? '-mt-[18px]' : 'mt-[8px]'}`}>
        {columns.map((column, c) => (
          <div key={c} className="flex flex-col">
            {column.map(({ item, i }) => (
              <AccordionItem
                key={item.title}
                index={i}
                numbered={numbered}
                {...item}
                open={open.has(i)}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** The three phases of today's loop, side by side. Each says what it does, where it
 *  gives way, and — pulled out at the foot in the accent — the assumption it rests on,
 *  which is the thing the synthesis goes on to question. */
function Cards({ cards }: { cards: { title: string; works: string[]; breaks: string; assumption: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
      {cards.map(c => (
        <div key={c.title} className="flex flex-col rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)] p-[20px]">
          <h4 className="font-heading font-semibold text-[15px] text-[color:var(--ink-strong)] leading-[1.3] mb-[16px]" style={WDTH}>
            {c.title}
          </h4>

          <span className={`${LABEL} block mb-[8px]`}>What works</span>
          <ul className="flex flex-col gap-[4px] mb-[16px]">
            {c.works.map(w => (
              <li key={w} className="font-sans text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>{w}</li>
            ))}
          </ul>

          <span className={`${LABEL} block mb-[8px]`}>Where it breaks</span>
          <p className="font-sans text-[13px] leading-[1.5] text-[color:var(--ink-body)] mb-[20px]" style={WDTH}>{c.breaks}</p>

          <div className="mt-auto pt-[14px] border-t border-[color:var(--line)]">
            <span className={`${LABEL} block mb-[6px]`}>System assumption</span>
            <p className="font-sans italic text-[13.5px] leading-[1.5] text-[color:var(--study-accent,var(--accent))]" style={WDTH}>
              “{c.assumption}”
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Stats({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    // one column per number, so however many there are they fill the row
    <div
      className="cs-stagger grid grid-cols-1 sm:[grid-template-columns:var(--stat-cols)] gap-[16px]"
      style={{ '--stat-cols': `repeat(${items.length}, minmax(0, 1fr))` } as React.CSSProperties}
    >
      {items.map((s, i) => (
        <div key={s.note ?? s.value} className="rounded-[2px] border border-[color:var(--line)] p-[20px]" style={nth(i)}>
          <div className="flex items-baseline gap-[8px]">
            <span className="font-heading font-medium text-[40px] leading-none text-[color:var(--study-accent,var(--accent))] tabular-nums">
              <CountUp value={s.value} />
            </span>
            <span className="font-sans text-[13px] text-[color:var(--ink-muted)]" style={WDTH}>{s.label}</span>
          </div>
          {s.note && <span className={`${LABEL} block mt-[12px]`}>{s.note}</span>}
        </div>
      ))}
    </div>
  )
}

function Findings({ items }: { items: { label: string; body: string }[] }) {
  return (
    <ol className="cs-stagger flex flex-col divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
      {items.map((f, i) => (
        <li key={f.label} style={nth(i)} className="grid grid-cols-[32px_1fr] sm:grid-cols-[32px_260px_1fr] gap-x-[16px] gap-y-[4px] py-[18px] items-baseline">
          <span className="font-heading text-[12px] font-semibold tabular-nums text-[color:var(--study-accent,var(--accent))]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-heading font-semibold text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-strong)] leading-[1.4]" style={WDTH}>
            {f.label}
          </span>
          <p className={`${BODY} col-start-2 sm:col-start-3`} style={WDTH}>{f.body}</p>
        </li>
      ))}
    </ol>
  )
}

/** Takeaways set side by side: each a serif label in the study's accent over the
 *  site's own rule, and a line or two of body grey beneath. On a phone they stack. */
function Columns({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className={`cs-stagger grid grid-cols-1 ${items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-[24px] mt-[8px]`}>
      {items.map((c, i) => (
        <div key={c.label} className="flex flex-col" style={nth(i)}>
          {/* the same serif-in-accent as the accordion rows, over a rule */}
          <span className="font-heading font-bold text-[15px] lg:text-[16px] leading-[1.3] text-[color:var(--study-accent,var(--accent))] pb-[8px] mb-[12px] border-b border-[color:var(--line)]">
            {c.label}
          </span>
          <p className="font-sans text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>
            {c.body}
          </p>
        </div>
      ))}
    </div>
  )
}

/** A carousel: one slide in view, a counter and dashes beneath, the caption to their
 *  right. The strip is positioned with a transform, not scrolled — a native scroll
 *  container picked up the sideways drift of a trackpad page-scroll, nudged the slide
 *  a few pixels and snapped it back, and the image edge read as a crop that kept
 *  changing. Nothing moves this except a drag, a dash, or a click on either half.
 *  `touch-action: pan-y` on the frame keeps vertical page-scrolling native on a phone
 *  while a sideways swipe is taken here, so both work at once.
 *
 *  It loops: the strip carries a copy of the last slide before the first and of the
 *  first after the last, so stepping off either end slides onto the copy, and once
 *  that lands the strip is re-placed on the real slide with no transition — the eye
 *  never sees the jump. */
function Slider({ slides, caption, ratio = '16 / 9' }: { slides: { src: string; alt: string }[]; caption?: string; ratio?: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  // the strip's current translate, in px — the one place the position lives
  const pos = useRef(0)
  const drag = useRef<{ x: number; from: number } | null>(null)
  // set when the strip is travelling onto a copy: the re-place to run once it lands
  const settle = useRef<(() => void) | null>(null)
  const count = slides.length

  const width = () => frame.current?.clientWidth ?? 1
  const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Writes the position, and settles every slide by how far it is from it: the one
  // leaving dims and draws in a touch, the one arriving opens to full. Straight to
  // the nodes — a drag never re-renders.
  const render = (px: number, animate: boolean) => {
    const st = strip.current
    if (!st) return
    const ease = animate && !still() ? '420ms cubic-bezier(0.22, 1, 0.36, 1)' : '0ms'
    st.style.transition = `transform ${ease}`
    st.style.transform = `translate3d(${px}px, 0, 0)`
    const w = width()
    Array.from(st.children).forEach((child, i) => {
      const slide = child as HTMLElement
      const d = still() ? 0 : Math.min(1, Math.abs(i * w + px) / w)
      slide.style.transition = `opacity ${ease}, transform ${ease}`
      slide.style.opacity = String(1 - d * 0.45)
      slide.style.transform = `scale(${1 - d * 0.06})`
    })
  }

  // `n` may be -1 or `count`: those are the copies, and the strip travels onto them
  // before being re-placed on the slide they stand for
  const go = (n: number, animate = true) => {
    const real = ((n % count) + count) % count
    setIndex(real)
    pos.current = -(n + 1) * width()
    render(pos.current, animate)
    if (n === real) { settle.current = null; return }
    const place = () => { pos.current = -(real + 1) * width(); render(pos.current, false) }
    if (animate && !still()) settle.current = place
    else place()
  }
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== strip.current || e.propertyName !== 'transform' || !settle.current) return
    const place = settle.current
    settle.current = null
    place()
  }

  // the frame's width sets everything; re-place on resize so the slide stays whole
  useEffect(() => {
    const onResize = () => go(index, false)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // caught mid-travel onto a copy: re-place now, so the drag starts from the real slide
    if (settle.current) { const place = settle.current; settle.current = null; place() }
    frame.current?.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, from: pos.current }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    let dx = e.clientX - drag.current.x
    const w = width()
    const at = drag.current.from + dx
    // the copies are as far as a drag can reach; past them the strip gives only a little
    const over = at > 0 ? at : at < -(count + 1) * w ? at + (count + 1) * w : 0
    if (over) dx -= over * 0.7
    pos.current = drag.current.from + dx
    render(pos.current, false)
  }
  // which half of the frame the pointer is over — a click on the left goes back, on
  // the right goes on
  const side = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = frame.current?.getBoundingClientRect()
    return r && e.clientX - r.left < r.width / 2 ? -1 : 1
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const moved = pos.current - drag.current.from
    const start = drag.current.x
    drag.current = null
    // a fifth of the width is a decision; less than that is a nudge, and it returns.
    // A few pixels at most is a click, and it steps by the half of the frame it landed in.
    const w = width()
    if (e.type === 'pointerup' && Math.abs(e.clientX - start) < 6) return go(index + side(e))
    go(moved < -w * 0.2 ? index + 1 : moved > w * 0.2 ? index - 1 : index)
  }

  return (
    <figure className="w-full">
      <div
        ref={frame}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* the cursor grows into a badge with a two-way arrow over the frame */
        data-cursor="slide"
        className="overflow-hidden select-none rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)]"
        style={{ aspectRatio: ratio, touchAction: 'pan-y' }}
        aria-roledescription="carousel"
      >
        <div ref={strip} onTransitionEnd={onTransitionEnd} className="flex h-full will-change-transform">
          {/* the copies at either end are presentation only: hidden from readers, and
              their images are the same files, so nothing loads twice */}
          {[slides[count - 1], ...slides, slides[0]].map((sl, i) => {
            const copy = i === 0 || i === count + 1
            const k = i - 1
            return (
              <div
                key={copy ? `copy-${i}` : sl.src}
                className="w-full h-full shrink-0 origin-center"
                role={copy ? 'presentation' : 'group'}
                aria-roledescription={copy ? undefined : 'slide'}
                aria-label={copy ? undefined : `${k + 1} of ${count}`}
                aria-hidden={copy || k !== index || undefined}
              >
                <img src={sl.src} alt={copy ? '' : sl.alt} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable={false} />
              </div>
            )
          })}
        </div>
      </div>

      {/* the same controls as the homepage's pinned card: a counter and a dash per
          slide, each dash a 28×16 target around a 2px mark. The active mark takes the
          study's accent, which is what "active" is on this page. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-[8px] mt-[14px]">
        <div className="flex items-center gap-3">
        <span
          className="font-heading text-[12px] text-[color:var(--ink-muted)] tracking-[0.08em] tabular-nums"
          style={WDTH}
        >
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {slides.map((sl, i) => (
            <button
              key={sl.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index || undefined}
              className="group/dash h-4 w-[28px] flex items-center"
            >
              <span
                className={`block h-[2px] w-full transition-colors duration-300 ${
                  i === index
                    ? 'bg-[color:var(--study-accent,var(--accent))]'
                    : 'bg-[color:var(--line)] group-hover/dash:bg-[color:var(--ink-muted)]'
                }`}
              />
            </button>
          ))}
        </div>
        </div>

        {/* the caption takes the right of the same row — where the homepage's card
            puts its way out — rather than a line of its own beneath */}
        {caption && (
          <figcaption className="font-sans text-[13px] text-[color:var(--ink-muted)] text-right ml-auto min-w-0" style={WDTH}>
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  )
}

/** A clickable prototype. The screens sit stacked in one frame and cross-fade; each
 *  carries buttons laid over its own drawn controls. A tap that misses them flashes
 *  every one there is, the way a Figma prototype shows its hotspots. The steps beside
 *  the screen jump straight to any of them.
 *
 *  Left alone, it plays itself: every few seconds the control that leads on lights up
 *  as if tapped, and the next screen fades in. Any touch hands it over to the reader,
 *  and it only picks up again once they have left it for a while. It plays only while
 *  on screen, and not at all under reduced motion. */
const AUTO_STEP_MS = 3200
const AUTO_TAP_MS = 600
const AUTO_IDLE_MS = 8000

function Prototype({ screens, ratio, caption }: Extract<Block, { kind: 'prototype' }>) {
  const frame = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [flash, setFlash] = useState(false)
  // the control the autoplay is pressing, drawn as if under a finger
  const [tapping, setTapping] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const timer = useRef<number>()
  const lastTouch = useRef(0)
  const at = useRef(0)
  at.current = index
  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let press: number | undefined
    const id = window.setInterval(() => {
      if (Date.now() - lastTouch.current < AUTO_IDLE_MS) return
      const from = at.current
      const next = (from + 1) % screens.length
      const control = screens[from].hotspots.find(h => h.to === next)
      setTapping(control?.label ?? null)
      press = window.setTimeout(() => { setTapping(null); setIndex(next) }, control ? AUTO_TAP_MS : 0)
    }, AUTO_STEP_MS)
    return () => { window.clearInterval(id); window.clearTimeout(press); setTapping(null) }
  }, [visible, screens])

  const touch = () => { lastTouch.current = Date.now(); setTapping(null) }

  const showHotspots = () => {
    setFlash(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setFlash(false), 900)
  }

  return (
    <figure className="w-full">
      <div
        ref={frame}
        onPointerDownCapture={touch}
        onKeyDownCapture={touch}
        className="rounded-[2px] bg-[color:var(--surface)] flex flex-col md:flex-row items-center justify-center gap-[24px] md:gap-[48px] px-[16px] py-[24px] md:py-[40px]"
      >
        <div
          onPointerDown={e => { if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') showHotspots() }}
          className="relative h-[420px] md:h-[520px] max-w-full select-none"
          style={{ aspectRatio: ratio }}
        >
          {screens.map((s, i) => (
            <div
              key={s.src}
              aria-hidden={i !== index || undefined}
              className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img src={s.src} alt={s.alt} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-contain" />
              {s.hotspots.map(h => (
                <button
                  key={h.label}
                  type="button"
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => { setFlash(false); setIndex(h.to) }}
                  aria-label={h.label}
                  className={`absolute rounded-[14px] outline-none transition-[box-shadow,background-color] duration-200 hover:bg-white/10 hover:shadow-[0_0_0_2px_var(--study-accent,var(--accent))] focus-visible:shadow-[0_0_0_2px_var(--study-accent,var(--accent))] ${flash || (i === index && tapping === h.label) ? 'bg-white/10 shadow-[0_0_0_2px_var(--study-accent,var(--accent))]' : ''}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* the flow as a list of steps: where you are, and a way to any of them */}
        <ol className="flex md:flex-col flex-wrap justify-center gap-x-[16px] gap-y-[10px]">
          {screens.map((s, i) => (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? 'step' : undefined}
                className={`flex items-center gap-[10px] font-heading text-[13px] transition-colors ${i === index ? 'text-[color:var(--ink-strong)] font-semibold' : 'text-[color:var(--ink-muted)] hover:text-[color:var(--ink-body)]'}`}
                style={WDTH}
              >
                <span className={`h-[2px] w-[16px] transition-colors ${i === index ? 'bg-[color:var(--study-accent,var(--accent))]' : 'bg-[color:var(--line)]'}`} />
                {String(i + 1).padStart(2, '0')} {s.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      {caption && <figcaption className={CAPTION} style={WDTH}>{caption}</figcaption>}
    </figure>
  )
}

/** The cover drawn inline. It runs its own reveal when it scrolls into view, so the
 *  loop assembles itself here just as it does on the card. */
function Diagram({ name, caption, ratio = '16 / 9', legend, description }: { name: string; caption?: string; ratio?: string; legend?: { label: string; color: string }[]; description?: string }) {
  const Drawn = coverFor(name)
  if (!Drawn) return null
  return (
    <figure>
      {/* drawn bare: in the body of the study the diagram sits on the page's own ground */}
      <div className="w-full rounded-[2px] overflow-hidden" style={{ aspectRatio: ratio }}>
        <Drawn className="w-full h-full" bare />
      </div>
      {/* the drawing is aria-hidden; this is what a reader hears in its place */}
      {description && <p className="sr-only">{description}</p>}
      {/* the row beneath: a legend on the left, in line with the text column, and the
          caption on the right — the same split as the slider's controls */}
      {(legend || caption) && (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-[8px] mt-[10px]">
          {legend && (
            <ul className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
              {legend.map(l => (
                <li key={l.label} className="flex items-center gap-[8px] font-heading text-[13px] text-[color:var(--ink-muted)]" style={WDTH}>
                  <span
                    aria-hidden="true"
                    className="h-[10px] w-[10px] rounded-[2px] border"
                    style={{ borderColor: l.color, background: `${l.color}59` }}
                  />
                  {l.label}
                </li>
              ))}
            </ul>
          )}
          {caption && (
            <figcaption className={`${CAPTION} mt-0 ml-auto min-w-0`} style={WDTH}>
              {caption}
            </figcaption>
          )}
        </div>
      )}
    </figure>
  )
}

/** A YouTube player in a figure's frame — privacy-enhanced host, no related videos
 *  from other channels at the end. The id is pulled from whichever link shape the
 *  content carries (watch?v=, youtu.be/, embed/). */
function Video({ url, title, caption, ratio = '16 / 9' }: { url: string; title: string; caption?: string; ratio?: string }) {
  const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
  if (!id) return null
  return (
    <figure className="w-full">
      <div className="rounded-[2px] overflow-hidden w-full bg-black" style={{ aspectRatio: ratio }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
      {caption && <figcaption className={CAPTION} style={WDTH}>{caption}</figcaption>}
    </figure>
  )
}

/** Renders a section's blocks in order. `tint` is the project colour the figure
 *  placeholders take. */
export function Blocks({ blocks, tint }: { blocks: Block[]; tint: string }) {
  return (
    <div className="flex flex-col gap-[20px]">
      {blocks.map((b, i) => <Reveal key={i}>{block(b, tint)}</Reveal>)}
    </div>
  )
}

/** the one renderer each kind of block has */
function block(b: Block, tint: string): ReactNode {
  switch (b.kind) {
    case 'text':       return <p className={BODY} style={WDTH}><Emphasis text={b.body} /></p>
    case 'note':       return <Note body={b.body} />
    case 'subheading': return <Subheading text={b.text} />
    case 'highlight':  return <Highlight text={b.text} />
    case 'lead':       return <Lead lead={b.lead} body={b.body} number={b.number} />
    case 'chips':      return <Chips groups={b.groups} />
    case 'phases':     return <Phases phases={b.phases} />
    case 'accordion':  return <Accordion {...b} />
    case 'cards':      return <Cards cards={b.cards} />
    case 'stats':      return <Stats items={b.items} />
    case 'findings':   return <Findings items={b.items} />
    case 'columns':    return <Columns items={b.items} />
    case 'slider':     return <Slider slides={b.slides} caption={b.caption} ratio={b.ratio} />
    case 'diagram':    return <Diagram name={b.name} caption={b.caption} ratio={b.ratio} legend={b.legend} description={b.description} />
    case 'figure':     return <FigureBlock figure={b.figure} tint={tint} />
    case 'compare':    return <Compare {...b} />
    case 'video':      return <Video url={b.url} title={b.title} caption={b.caption} ratio={b.ratio} />
    case 'prototype':  return <Prototype {...b} />
  }
}
