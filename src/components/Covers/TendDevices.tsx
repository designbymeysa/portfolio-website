import { useEffect, useId, useRef, useState } from 'react'

/** Drawn in the Figma cover's own frame, 1221×916 ("Cover", node 27:3667 in
 *  Designbymeysa), so every position below reads straight off the design file. The
 *  open fold in its hardware frame, the phone and the logo are exported at 2x on transparency,
 *  drop shadow and side buttons included — which is why the fold's image starts 30px
 *  up and left of the device — and the ground and its glows are drawn here so they
 *  can move. */
const MEDIA = '/media/tend/cover'
const W = 1221.32
const H = 916
// how far the cover zooms out: room added each side, in the frame's own units
const PAD = 70

const FOLD = { x: 68, y: 86, w: 841, h: 618 }
// the iPhone 17 with Today on it, frame and screen as one layer
const PHONE = { x: 807, y: 186, w: 327, h: 662 }
const LOGO = { x: 532, y: 703, w: 130.5, h: 155 }
// the sprout sits in the logo's top 95px, the wordmark under it; the sprout sways from
// the foot of its stem
const MARK_H = 95
const STEM_FOOT = { x: LOGO.x + 64.5, y: LOGO.y + 74 }

// the three glows from the Figma cover, in its group colours: lilac in the middle,
// mint to the left, butter to the right
const GLOWS = [
  { key: 'mint', cx: 226, cy: 387, r: 513, color: '#DCF5E9', alpha: 1, cls: 'tn-glow-a' },
  { key: 'butter', cx: 814, cy: 418, r: 513, color: '#FDF4CA', alpha: 1, cls: 'tn-glow-b' },
  { key: 'lilac', cx: 572, cy: 443, r: 695, color: '#A99BF5', alpha: 0.5, cls: 'tn-glow-c' },
]

/** The cover for Tend: the open fold and the phone float out of step over a soft
 *  pastel wash whose three glows drift slowly, and the sprout in the logo sways.
 *
 *  Everything moves only while the cover is on screen — `tn-on` is what starts the
 *  animations — and under reduced motion it all holds still. */
export function TendDevices({ className = '' }: { className?: string; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden bg-white ${visible ? 'tn-on' : ''} ${className}`} aria-hidden="true">
      {/* fitted, not filled, with a margin round the frame: the homepage card is wider
          than 4:3 and would otherwise crop the devices. The ground and the glows run
          past the frame, so the extra room the fit leaves is still covered */}
      <svg
        viewBox={`${-PAD} ${-PAD * (H / W)} ${W + PAD * 2} ${H + PAD * 2 * (H / W)}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {GLOWS.map(g => (
            <radialGradient key={g.key} id={`tn-${g.key}-${id}`}>
              <stop offset="0" stopColor={g.color} stopOpacity={g.alpha} />
              <stop offset="1" stopColor={g.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <clipPath id={`tn-mark-${id}`}>
            <rect x={LOGO.x} y={LOGO.y} width={LOGO.w} height={MARK_H} />
          </clipPath>
          <clipPath id={`tn-word-${id}`}>
            <rect x={LOGO.x} y={LOGO.y + MARK_H} width={LOGO.w} height={LOGO.h - MARK_H} />
          </clipPath>
        </defs>

        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#FFFFFF" />

        {GLOWS.map(g => (
          <circle key={g.key} className={`tn-glow ${g.cls}`} cx={g.cx} cy={g.cy} r={g.r} fill={`url(#tn-${g.key}-${id})`} />
        ))}

        <g className="tn-float tn-float-a">
          <image href={`${MEDIA}/fold.webp`} x={FOLD.x} y={FOLD.y} width={FOLD.w} height={FOLD.h} />
        </g>

        <image
          href={`${MEDIA}/sprout.webp`}
          x={LOGO.x} y={LOGO.y} width={LOGO.w} height={LOGO.h}
          clipPath={`url(#tn-word-${id})`}
        />
        <g className="tn-sprout" style={{ transformOrigin: `${STEM_FOOT.x}px ${STEM_FOOT.y}px` }}>
          <image
            href={`${MEDIA}/sprout.webp`}
            x={LOGO.x} y={LOGO.y} width={LOGO.w} height={LOGO.h}
            clipPath={`url(#tn-mark-${id})`}
          />
        </g>

        {/* over the logo, as in Figma */}
        <g className="tn-float tn-float-b">
          <image href={`${MEDIA}/phone.webp`} x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} />
        </g>
      </svg>
    </div>
  )
}
