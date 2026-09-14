/** The six wellbeing dimensions the heuristic evaluation scored, as a radar: four rings
 *  of a hexagon with one filled shape per app. Drawn inline rather than dropped in as
 *  an image so the grid and labels take the page's own ink in both themes, and the
 *  three shapes keep their exact traced outlines. The legend is content — the diagram
 *  block carries it, so it sits in the text column rather than inside the drawing. */
const AXES: { label: string[]; x: number; y: number }[] = [
  { label: ['Cognitive Load'],                    x: 315.4, y: 17  },
  { label: ['Restricted', 'User', 'Autonomy'],    x: 590,   y: 148 },
  { label: ['Technostress'],                      x: 590,   y: 407 },
  { label: ['Feature Density'],                   x: 315.4, y: 555 },
  { label: ['System', 'Friction'],                x: 48,    y: 398 },
  { label: ['Weight of', 'Productivity'],         x: 48,    y: 148 },
]

// the hexagon's six vertices at the outer ring, clockwise from the top; the inner rings
// are the same shape scaled toward the centre
const CX = 315.389
const CY = 276.494
const OUTER = [
  [315.387, 30.4697], [527.583, 153.482], [527.583, 399.506],
  [315.387, 522.518], [103.191, 399.506], [103.191, 153.482],
]
const ring = (k: number) =>
  OUTER.map(([x, y]) => `${CX + (x - CX) * k},${CY + (y - CY) * k}`).join(' ')

const SHAPES = [
  { app: 'Todoist',         color: '#EA7374', d: 'M316.886 125.971L433.955 208.16L503.716 384.967L316.886 460.741L210.641 339.262L179.369 195.731L316.886 125.971Z' },
  { app: 'TickTick',        color: '#10959E', d: 'M316.485 60.2188L421.927 217.781L476.854 366.925L316.485 522.884L183.779 352.892L154.512 182.901L316.485 60.2188Z' },
  { app: 'Microsoft To Do', color: '#2E53A4', d: 'M315.728 215.777L476.05 184.104L367.801 307.589L315.728 396.193L155.713 368.529L263.16 244.243L315.728 215.777Z' },
]

export function WellbeingRadar({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 641 559" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
        <g fill="none" stroke="var(--line)" strokeWidth="1">
          {[0.25, 0.5, 0.75, 1].map(k => (
            <polygon key={k} points={ring(k)} strokeWidth={k === 1 ? 2 : 1} />
          ))}
          {OUTER.map(([x, y]) => (
            <line key={`${x}${y}`} x1={CX} y1={CY} x2={x} y2={y} />
          ))}
        </g>

        {SHAPES.map(s => (
          <path key={s.color} d={s.d} fill={s.color} fillOpacity="0.35" stroke={s.color} strokeWidth="2" />
        ))}

        <g
          fill="var(--ink-body)"
          fontFamily="'Open Sans', sans-serif"
          fontSize="14"
          textAnchor="middle"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {AXES.map(a => (
            <text key={a.label.join(' ')} x={a.x} y={a.y}>
              {a.label.map((line, i) => (
                <tspan key={line} x={a.x} dy={i === 0 ? 0 : 22}>{line}</tspan>
              ))}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
