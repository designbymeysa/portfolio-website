import { useEffect, useRef, useState, type ReactNode } from 'react'
import type React from 'react'
import type { Block, Figure } from '../../data/caseStudies'
import { Tag } from '../Tag/Tag'
import { ArrowIcon, ChevronIcon } from '../ui/LinkIcons'
import { coverFor } from '../Covers'
import { useMatchMedia } from '../../hooks/useMatchMedia'

// ── shared type ──
// Every block sets its running copy the way the case study's own paragraphs are set,
// so a block reads as part of the page rather than a widget dropped into it.
const BODY  = "font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] leading-[1.85] text-[color:var(--ink-body)]"
const LABEL = "font-['Open_Sans'] font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-muted)]"
// a heading within a section, one step down from the section's own serif heading.
// Set in the sans rather than the serif so the two levels read as different kinds of
// thing — the serif names the section, this names a part of it
const SUBHEAD = "font-['Open_Sans'] font-semibold text-[17px] lg:text-[18px] text-[color:var(--ink-strong)] leading-[1.3]"
const WDTH  = { fontVariationSettings: '"wdth" 100' } as const
/** the caption under every picture and diagram, set against the frame's right edge —
 *  the same place the slider puts its own, so the page reads consistently */
const CAPTION = "font-['Open_Sans'] text-[13px] text-[color:var(--ink-muted)] text-right mt-[10px]"

/** `**like this**` in content becomes a strong run in the heading ink. The copy files
 *  are plain JSON, so this is the one piece of inline markup they get. The run keeps
 *  the paragraph's own weight and is marked by ink alone — lifted from the body grey to
 *  the strong ink — which is as much emphasis as the copy wants. */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-normal text-[color:var(--ink-strong)]">{part.slice(2, -2)}</strong>
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

/** A picture, or a captioned frame holding its place until the picture exists. */
export function FigureBlock({ figure, tint }: { figure: Figure; tint: string }) {
  // the tile is the project's own colour, which may be pale or dark — the caption
  // picks the side that reads against it rather than assuming a light ground
  const onDark = lightness(tint) < 140
  const label = onDark ? 'text-white/45' : 'text-black/40'
  const caption = onDark ? 'text-white/70' : 'text-black/55'
  return (
    <figure className={figure.span === 'half' ? '' : 'w-full'}>
    <div
      className="rounded-[2px] overflow-hidden w-full"
      style={{ aspectRatio: '16 / 9', background: figure.src ? undefined : tint }}
    >
      {figure.src ? (
        <img
          src={figure.src}
          alt={figure.caption}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      ) : (
        // no asset yet: the frame still holds its place, and says what belongs in it
        <div className="w-full h-full flex flex-col items-center justify-center gap-[6px] px-6 text-center">
          <span className={`font-['Open_Sans'] font-semibold text-[10px] uppercase tracking-[0.18em] ${label}`}>
            Image
          </span>
          <span className={`font-['Open_Sans'] text-[14px] lg:text-[13px] ${caption}`}>{figure.caption}</span>
        </div>
      )}
    </div>
    {figure.src && (
      <figcaption className={CAPTION} style={WDTH}>{figure.caption}</figcaption>
    )}
    </figure>
  )
}

// ── the blocks ──

/** A small bordered rectangle of quieter type, for the things a reader should know
 *  before going on. `[text](url)` in the copy becomes a link. */
function Note({ body }: { body: string }) {
  const parts = body.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <aside className="rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)] px-[16px] py-[12px]">
      <p className="font-['Open_Sans'] text-[13px] leading-[1.6] text-[color:var(--ink-muted)]" style={WDTH}>
        {parts.map((part, i) => {
          const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
          return m
            ? (
              <a
                key={i}
                href={m[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--ink-body)] underline underline-offset-[3px] decoration-[1px] decoration-[color:var(--line)] hover:text-[color:var(--ink-strong)] hover:decoration-[color:var(--ink-strong)] transition-colors duration-[150ms]"
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
          <span className="shrink-0 font-['Libre_Caslon_Text'] font-bold tabular-nums text-[color:var(--study-accent,var(--accent))]">
            {number}
          </span>
          <span>{lead}</span>
        </h3>
        <p className={BODY} style={WDTH}>{body}</p>
      </div>
    )
  }
  return (
    <p className={`${BODY} flex gap-[12px]`} style={WDTH}>
      <span aria-hidden="true" className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--study-accent,var(--accent))]" />
      <span>
        <strong className="font-semibold text-[color:var(--ink-strong)]">{lead}</strong> {body}
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
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-[16px] md:gap-[12px] items-stretch">
      {phases.map((ph, i) => (
        <div key={ph.label} className="contents">
          <div className="rounded-[2px] border border-[color:var(--line)] bg-[color:var(--surface)] p-[16px]">
            <span className={`${LABEL} block mb-[12px]`}>
              Phase {i + 1} · {ph.label}
            </span>
            <ol className="flex flex-col gap-[8px]">
              {ph.steps.map((step, j) => (
                <li key={step} className="flex gap-[10px] font-['Open_Sans'] text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>
                  <span className="shrink-0 font-semibold tabular-nums text-[color:var(--study-accent,var(--accent))]">{j + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {i < phases.length - 1 && (
            <div className="flex justify-center md:self-center text-[color:var(--study-accent,var(--accent))]" aria-hidden="true">
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
            <span className="font-['Libre_Caslon_Text'] font-bold text-[15px] lg:text-[16px] tabular-nums leading-[1.3] text-[color:var(--study-accent,var(--accent))]">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          {/* the row title is the serif in the study's accent — it is the thing you open,
              and reads as a heading for what folds out beneath it */}
          <span className="font-['Libre_Caslon_Text'] font-bold text-[15px] lg:text-[16px] text-[color:var(--study-accent,var(--accent))] leading-[1.3]">
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
          <h4 className="font-['Open_Sans'] font-semibold text-[15px] text-[color:var(--ink-strong)] leading-[1.3] mb-[16px]" style={WDTH}>
            {c.title}
          </h4>

          <span className={`${LABEL} block mb-[8px]`}>What works</span>
          <ul className="flex flex-col gap-[4px] mb-[16px]">
            {c.works.map(w => (
              <li key={w} className="font-['Open_Sans'] text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>{w}</li>
            ))}
          </ul>

          <span className={`${LABEL} block mb-[8px]`}>Where it breaks</span>
          <p className="font-['Open_Sans'] text-[13px] leading-[1.5] text-[color:var(--ink-body)] mb-[20px]" style={WDTH}>{c.breaks}</p>

          <div className="mt-auto pt-[14px] border-t border-[color:var(--line)]">
            <span className={`${LABEL} block mb-[6px]`}>System assumption</span>
            <p className="font-['Open_Sans'] italic text-[13.5px] leading-[1.5] text-[color:var(--study-accent,var(--accent))]" style={WDTH}>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
      {items.map(s => (
        <div key={s.note ?? s.value} className="rounded-[2px] border border-[color:var(--line)] p-[20px]">
          <div className="flex items-baseline gap-[8px]">
            <span className="font-['Libre_Caslon_Text'] font-normal text-[40px] leading-none text-[color:var(--study-accent,var(--accent))] tabular-nums">
              {s.value}
            </span>
            <span className="font-['Open_Sans'] text-[13px] text-[color:var(--ink-muted)]" style={WDTH}>{s.label}</span>
          </div>
          {s.note && <span className={`${LABEL} block mt-[12px]`}>{s.note}</span>}
        </div>
      ))}
    </div>
  )
}

function Findings({ items }: { items: { label: string; body: string }[] }) {
  return (
    <ol className="flex flex-col divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
      {items.map((f, i) => (
        <li key={f.label} className="grid grid-cols-[32px_1fr] sm:grid-cols-[32px_260px_1fr] gap-x-[16px] gap-y-[4px] py-[18px] items-baseline">
          <span className="font-['Open_Sans'] text-[12px] font-semibold tabular-nums text-[color:var(--study-accent,var(--accent))]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-['Open_Sans'] font-semibold text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-strong)] leading-[1.4]" style={WDTH}>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px] mt-[8px]">
      {items.map(c => (
        <div key={c.label} className="flex flex-col">
          {/* the same serif-in-accent as the accordion rows, over a rule */}
          <span className="font-['Libre_Caslon_Text'] font-bold text-[15px] lg:text-[16px] leading-[1.3] text-[color:var(--study-accent,var(--accent))] pb-[8px] mb-[12px] border-b border-[color:var(--line)]">
            {c.label}
          </span>
          <p className="font-['Open_Sans'] text-[13px] leading-[1.5] text-[color:var(--ink-body)]" style={WDTH}>
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
          className="font-['Open_Sans'] text-[12px] text-[color:var(--ink-muted)] tracking-[0.08em] tabular-nums"
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
          <figcaption className="font-['Open_Sans'] text-[13px] text-[color:var(--ink-muted)] text-right ml-auto min-w-0" style={WDTH}>
            {caption}
          </figcaption>
        )}
      </div>
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
                <li key={l.label} className="flex items-center gap-[8px] font-['Open_Sans'] text-[13px] text-[color:var(--ink-muted)]" style={WDTH}>
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
      {blocks.map((b, i): ReactNode => {
        switch (b.kind) {
          case 'text':       return <p key={i} className={BODY} style={WDTH}><Emphasis text={b.body} /></p>
          case 'note':       return <Note key={i} body={b.body} />
          case 'subheading': return <Subheading key={i} text={b.text} />
          case 'lead':       return <Lead key={i} lead={b.lead} body={b.body} number={b.number} />
          case 'chips':      return <Chips key={i} groups={b.groups} />
          case 'phases':     return <Phases key={i} phases={b.phases} />
          case 'accordion':  return <Accordion key={i} {...b} />
          case 'cards':      return <Cards key={i} cards={b.cards} />
          case 'stats':      return <Stats key={i} items={b.items} />
          case 'findings':   return <Findings key={i} items={b.items} />
          case 'columns':    return <Columns key={i} items={b.items} />
          case 'slider':     return <Slider key={i} slides={b.slides} caption={b.caption} ratio={b.ratio} />
          case 'diagram':    return <Diagram key={i} name={b.name} caption={b.caption} ratio={b.ratio} legend={b.legend} description={b.description} />
          case 'figure':     return <FigureBlock key={i} figure={b.figure} tint={tint} />
          case 'video':      return <Video key={i} url={b.url} title={b.title} caption={b.caption} ratio={b.ratio} />
        }
      })}
    </div>
  )
}
