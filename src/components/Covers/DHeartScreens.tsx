import { useEffect, useId, useRef, useState } from 'react'

/** The cover is layered rather than exported whole, because two things in it move and
 *  everything else holds still. Coordinates are in the 1600×1200 frame the base was
 *  exported at; the SVG scales the lot to whatever box the card gives it.
 *
 *  - `base.jpg`      the ground and the device, with the dotted ring painted out
 *  - `ring-mask.png` where the ring may show — black over the device, so the drawn ring
 *                    passes behind it as it did in Figma
 *  - `phone.webp`    the handset, on transparency, so it sits over the ring
 *  - `screen-N.webp` the phone's screen, cut from each Figma phone group at the same rect */
const MEDIA = '/media/d-heart/cover'

const PHONE = { x: 292.5, y: 287.1, w: 306.1, h: 625.7 }
const SCREENS = [`${MEDIA}/screen-1.webp`, `${MEDIA}/screen-2.webp`, `${MEDIA}/screen-3.webp`]
const SCREEN = { x: 305.8, y: 296.3, w: 279.8, h: 606.5 }

// the ring, measured off the export: centred in the frame, 56 round-capped dashes
const RING = { cx: 800, cy: 600, r: 373.5, width: 9 }
const DASH = 8
const GAP = (2 * Math.PI * RING.r) / 56 - DASH
const MASK = { x: 410, y: 210, w: 780, h: 780 }

const HOLD_MS = 2800 // how long each screen stays before the next fades in
const FADE_MS = 900

/** The cover for D-HEART: the phone steps through three onboarding screens while the
 *  dotted ring turns slowly around it.
 *
 *  The screens only advance while the cover is on screen — an offscreen card should not
 *  keep a timer running — and under reduced motion the first screen stays and the ring
 *  holds still. */
export function DHeartScreens({ className = '' }: { className?: string; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const maskId = `dh-mask-${useId().replace(/:/g, '')}`
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  // a screen that fails to load is dropped from the cycle rather than shown blank
  const [screens, setScreens] = useState(SCREENS)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || screens.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex(i => (i + 1) % screens.length), HOLD_MS + FADE_MS)
    return () => window.clearInterval(id)
  }, [visible, screens.length])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1600 1200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={MASK.x} y={MASK.y} width={MASK.w} height={MASK.h}>
            <image href={`${MEDIA}/ring-mask.png`} x={MASK.x} y={MASK.y} width={MASK.w} height={MASK.h} />
          </mask>
        </defs>

        <image href={`${MEDIA}/base.jpg`} x="0" y="0" width="1600" height="1200" />

        <g mask={`url(#${maskId})`}>
          <circle
            className={visible ? 'dh-ring dh-ring-on' : 'dh-ring'}
            cx={RING.cx} cy={RING.cy} r={RING.r}
            fill="none"
            stroke="#FF993D"
            strokeWidth={RING.width}
            strokeLinecap="round"
            strokeDasharray={`${DASH} ${GAP.toFixed(2)}`}
          />
        </g>

        <image href={`${MEDIA}/phone.webp`} x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} />

        {screens.map((src, i) => (
          <image
            key={src}
            href={src}
            x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h}
            onError={() => setScreens(s => s.filter(x => x !== src))}
            style={{
              opacity: i === index % screens.length ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
