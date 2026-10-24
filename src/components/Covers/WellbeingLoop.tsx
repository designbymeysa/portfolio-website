import { useEffect, useId, useRef, useState } from 'react'

/** The four stages of the wellbeing loop, clockwise from the top. `a` is the angle in
 *  degrees measured from twelve o'clock, so a stage's place on the ring and the arrow
 *  that leads into it are both derived from one number. */
const NODES = [
  { a:   0, w: 104, label: ['Contextual', 'Capture'],    caption: ['Capture without', 'commitment'] },
  { a:  90, w: 108, label: ['Intentional', 'Selection'], caption: ['Choose what', 'matters now'] },
  { a: 180, w:  96, label: ['Deep', 'Execution'],        caption: ['Protected', 'attention'] },
  { a: 270, w: 104, label: ['Guilt-Free', 'Transition'], caption: ['Adapt without', 'penalty'] },
]

// A tighter frame than the reference's 620×480: the drawing is the same, but at the
// size a grid card gives it the labels were down to about 9px. Pulling the box in makes
// every glyph proportionally larger without changing the composition.
const CX = 270
const CY = 208
const R  = 132
const CIRCUMFERENCE = 2 * Math.PI * R

// One pass of the loop: the ring takes 3400ms to draw and the last arrow lands at
// ~3600ms, so the finished loop holds for a couple of seconds before it fades and the
// assembly starts over. The timings live in globals.css; only the period is here.
const PERIOD_MS = 6000
const FADE_MS = 600

// screen coordinates for an angle off twelve o'clock, going clockwise
const rad = (a: number) => (a * Math.PI) / 180
const px  = (a: number, r = R) => CX + r * Math.sin(rad(a))
const py  = (a: number, r = R) => CY - r * Math.cos(rad(a))

/** The cover for the digital-wellbeing project: the loop assembles itself a stage at a
 *  time. Drawn rather than photographed so it stays sharp from a 380px grid card up to
 *  the full-width banner on the case study, and so the reveal can be sequenced.
 *
 *  It runs on a loop while it is on screen: assemble, hold, fade, and assemble again.
 *  Each pass remounts the SVG (keyed on the pass count) so the one-shot CSS reveal
 *  replays from the start. Under reduced motion the finished state is shown outright
 *  and nothing cycles. */
/** `bare` drops the gradient ground and sets the drawing in the study's accent instead —
 *  for the case study body, where the loop sits in the text column on the page's own
 *  ground rather than in a tile of its own. */
export function WellbeingLoop({ className = '', bare = false }: { className?: string; bare?: boolean }) {
  const accent = 'var(--study-accent, var(--accent))'
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [pass, setPass] = useState(0)
  const [fading, setFading] = useState(false)
  const uid = useId().replace(/:/g, '')
  const ground = `wl-ground-${uid}`
  const reveal = `wl-reveal-${uid}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25, rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // the cycle: fade the finished loop out at the end of the pass, then start the next
  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let fade = 0
    let next = 0
    const schedule = () => {
      fade = window.setTimeout(() => setFading(true), PERIOD_MS - FADE_MS)
      next = window.setTimeout(() => {
        setFading(false)
        setPass(p => p + 1)
        schedule()
      }, PERIOD_MS)
    }
    schedule()
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(next)
      setFading(false)
    }
  }, [visible])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${visible ? 'wl-on' : ''} ${fading ? 'wl-out' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        key={pass}
        viewBox="0 0 540 420"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id={ground} cx="50%" cy="46%" r="72%">
            <stop offset="0%"   stopColor="#7AA3F5" />
            <stop offset="35%"  stopColor="#5685EE" />
            <stop offset="100%" stopColor="#2A498D" />
          </radialGradient>

          {/* The ring has to travel, not fade — but its dashes are already spending the
              dash array on the dot pattern, so `stroke-dashoffset` cannot also draw it
              on. This mask does the drawing instead: one solid arc, thick enough to
              clear the dotted stroke, whose own dashoffset runs from a full lap to
              nothing. Rotated so it starts at twelve o'clock and travels clockwise,
              the direction the stages read in. */}
          <mask id={reveal} maskUnits="userSpaceOnUse" x="0" y="0" width="540" height="420">
            <circle
              className="wl-draw"
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="#ffffff"
              strokeWidth="14"
              strokeDasharray={CIRCUMFERENCE.toFixed(1)}
              strokeDashoffset={CIRCUMFERENCE.toFixed(1)}
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          </mask>
        </defs>

        {/* the ground runs past the frame so no edge shows when the box is wider than
            the drawing and the diagram is letterboxed inside it */}
        {!bare && <rect x="-240" y="-240" width="1020" height="900" fill={`url(#${ground})`} />}

        {/* everything that assembles sits in one group, so the end of a pass can fade
            the drawing without touching the ground beneath it */}
        <g className="wl-scene">

        {/* the ring the stages sit on, revealed a quarter at a time by the mask above */}
        <circle
          className="wl-ring"
          mask={`url(#${reveal})`}
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={bare ? accent : 'rgba(255,255,255,0.5)'}
          strokeOpacity={bare ? 0.5 : undefined}
          strokeWidth="2"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />

        {/* One arrowhead per segment, tangent to the ring and sitting at the midpoint
            between the stage it leaves and the stage it leads to. Anywhere nearer a
            stage and it lands on that stage's caption — at 20° short of the node the
            lower-left one went straight through the word "penalty". */}
        {NODES.map((n, i) => {
          const a = n.a + 45
          return (
            <path
              key={`arrow-${n.a}`}
              className="wl-arrow"
              style={{ ['--i' as string]: i }}
              d="M -6 -5.5 L 6.5 0 L -6 5.5 Z"
              fill={bare ? accent : 'rgba(255,255,255,0.88)'}
              transform={`translate(${px(a).toFixed(1)} ${py(a).toFixed(1)}) rotate(${a})`}
            />
          )
        })}

        {NODES.map((n, i) => {
          const x = px(n.a)
          const y = py(n.a)
          return (
            <g key={n.a} className="wl-step" style={{ ['--i' as string]: i }}>
              <rect
                x={x - n.w / 2} y={y - 23}
                width={n.w} height={46} rx={14}
                fill="#E7EAFF"
              />
              <text
                textAnchor="middle"
                fontFamily="'Open Sans', system-ui, sans-serif"
                fontSize="15"
                fontWeight="700"
                fill={bare ? accent : '#2A498D'}
              >
                <tspan x={x} y={y - 8} dominantBaseline="middle">{n.label[0]}</tspan>
                <tspan x={x} y={y + 10} dominantBaseline="middle">{n.label[1]}</tspan>
              </text>
              <text
                textAnchor="middle"
                fontFamily="'Open Sans', system-ui, sans-serif"
                fontSize="13.5"
                fontWeight="400"
                fill={bare ? 'var(--ink-body)' : 'rgba(255,255,255,0.82)'}
              >
                <tspan x={x} y={y + 42}>{n.caption[0]}</tspan>
                <tspan x={x} y={y + 59}>{n.caption[1]}</tspan>
              </text>
            </g>
          )
        })}

        </g>
      </svg>
    </div>
  )
}
