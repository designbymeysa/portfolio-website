import { useEffect, useId, useRef, useState } from 'react'

/** Drawn in the same 1600×1200 frame as the other covers; the SVG scales it to the card.
 *  The two handsets are the app's own mockups on transparency, so the ground and the orb
 *  behind them are drawn here and can move. */
const MEDIA = '/media/demos/cover'

// both phones share the mockup's shape, 620×1267
const PHONE_W = 390
const PHONE_H = PHONE_W * (1267 / 620)
const INTRO = { x: 400, y: 250 }
const CHAT = { x: 820, y: 150 }

// Dèmos's orb, as it glows on the intro screen, grown large behind both phones
const ORB = { cx: 800, cy: 600, r: 380 }

/** The cover for Dèmos: the intro screen and the chat side by side, floating out of step
 *  with each other, while the orb breathes behind them.
 *
 *  Everything moves only while the cover is on screen — `dm-on` is what starts the
 *  animations — and under reduced motion it all holds still. */
export function DemosPhones({ className = '' }: { className?: string; bare?: boolean }) {
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
    <div ref={ref} className={`relative overflow-hidden ${visible ? 'dm-on' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`dm-ground-${id}`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#02040F" />
            <stop offset="0.55" stopColor="#0A1438" />
            <stop offset="1" stopColor="#22388A" />
          </linearGradient>
          <radialGradient id={`dm-orb-${id}`} cx="0.45" cy="0.35" r="0.65">
            <stop offset="0" stopColor="#E6ECF7" />
            <stop offset="0.45" stopColor="#6B9BEB" />
            <stop offset="1" stopColor="#2A55C9" stopOpacity="0" />
          </radialGradient>
          <filter id={`dm-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>

        <rect width="1600" height="1200" fill={`url(#dm-ground-${id})`} />

        <circle
          className="dm-orb"
          cx={ORB.cx} cy={ORB.cy} r={ORB.r}
          fill={`url(#dm-orb-${id})`}
          filter={`url(#dm-blur-${id})`}
        />

        <g className="dm-float dm-float-a">
          <image href={`${MEDIA}/phone-intro.webp`} x={INTRO.x} y={INTRO.y} width={PHONE_W} height={PHONE_H} />
        </g>
        <g className="dm-float dm-float-b">
          <image href={`${MEDIA}/phone-chat.webp`} x={CHAT.x} y={CHAT.y} width={PHONE_W} height={PHONE_H} />
        </g>
      </svg>
    </div>
  )
}
