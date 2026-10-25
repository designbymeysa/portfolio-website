import { useEffect, useRef, useState } from 'react'

/** Drawn in the same 1600×1200 frame as the other covers; the SVG scales it to the card.
 *  The paintings are the stand's own cards, title and year already set on them. */
const MEDIA = '/media/art/cover'

// the paintings scattered loosely with black between them, large enough that those near
// the edges run off the frame and are cut, as if the wall carried on past it
const CARDS = [
  { src: 'bass-bottle',  x: -60,  y: 20,  w: 330, h: 535 },
  { src: 'modigliani',   x: 1330, y: -40, w: 300, h: 497 },
  { src: 'elasticita',   x: 520,  y: 120, w: 470, h: 465 },
  { src: 'fourth-state', x: -80,  y: 700, w: 560, h: 302 },
  { src: 'kandinsky',    x: 1180, y: 640, w: 500, h: 343 },
  { src: 'lighthouse',   x: 600,  y: 760, w: 340, h: 389 },
]

// the order the highlight moves through, so it hops across the wall rather than along it
const PICK_ORDER = [2, 4, 0, 5, 1, 3]
const HOLD_MS = 2400

/** The cover for Art Beyond Dimension: the stand's paintings on black, still, while one
 *  at a time lifts into focus as if a visitor had just picked it and the rest dim
 *  around it.
 *
 *  The pick only advances while the cover is on screen, and under reduced motion nothing
 *  is picked. */
export function ArtWall({ className = '' }: { className?: string; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setStep(s => (s + 1) % PICK_ORDER.length), HOLD_MS)
    return () => window.clearInterval(id)
  }, [visible])

  const picked = step < 0 ? -1 : PICK_ORDER[step]

  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#0B0C0F] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        {CARDS.map((c, i) => (
          <image
            key={c.src}
            href={`${MEDIA}/${c.src}.webp`}
            x={c.x} y={c.y} width={c.w} height={c.h}
            className="aw-card"
            style={{
              opacity: picked < 0 || picked === i ? 1 : 0.55,
              transform: picked === i ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ))}
      </svg>
    </div>
  )
}
