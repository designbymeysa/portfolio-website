import { useRef, useEffect } from 'react'

const CELL = 28

// blob definitions: [cx, cy] as 0–1 fractions, rx/ry as fraction of screen, color rgba, and animation params
// blue / violet corner-wash palette — saturated accents kept at low alpha so the center stays bright
const BLOB_DEFS = [
  // #DADFFF light lavender-blue — top-left
  { cx: 0.02, cy: 0.05, rx: 0.60, ry: 0.62, r: 218, g: 223, b: 255, a: 0.55, ax:  0.04, ay:  0.04, period: 12 },
  // #5C6EFF bright blue — top-right
  { cx: 0.98, cy: 0.04, rx: 0.55, ry: 0.60, r:  92, g: 110, b: 255, a: 0.30, ax: -0.04, ay:  0.05, period: 13 },
  // #C4B5FD light violet — bottom-left
  { cx: 0.06, cy: 0.96, rx: 0.58, ry: 0.55, r: 196, g: 181, b: 253, a: 0.48, ax:  0.05, ay: -0.04, period: 14 },
  // #E8DDD7 warm cream — bottom-right
  { cx: 0.98, cy: 0.92, rx: 0.55, ry: 0.58, r: 232, g: 221, b: 215, a: 0.50, ax: -0.05, ay: -0.04, period: 13 },
  // #7B5CF5 violet — center-bottom for subtle depth
  { cx: 0.48, cy: 1.08, rx: 0.50, ry: 0.46, r: 123, g:  92, b: 245, a: 0.26, ax:  0.04, ay: -0.04, period: 15 },
  // #2A3FE6 deep blue — right edge mid
  { cx: 1.06, cy: 0.50, rx: 0.42, ry: 0.58, r:  42, g:  63, b: 230, a: 0.28, ax: -0.04, ay:  0.05, period: 14 },
  // #5B3FD4 deep violet — left edge mid
  { cx: -0.06, cy: 0.55, rx: 0.42, ry: 0.55, r:  91, g:  63, b: 212, a: 0.28, ax:  0.04, ay:  0.04, period: 15 },
  // #1F30B8 dark indigo — top-center for faint depth
  { cx: 0.50, cy: -0.06, rx: 0.46, ry: 0.44, r:  31, g:  48, b: 184, a: 0.22, ax: -0.03, ay:  0.04, period: 16 },
]

// cursor-trail palette — cells cycle through these as the trail moves
const TRAIL_COLORS = [
  [ 61,  82, 255], // #3D52FF — dark
  [244, 196, 164], // #F4C4A4 — light
  [ 91,  63, 212], // #5B3FD4 — dark
  [223, 214, 255], // #DFD6FF — light
  [123,  92, 245], // #7B5CF5 — dark
  [218, 223, 255], // #DADFFF — light
  [ 92, 110, 255], // #5C6EFF — dark
  [196, 181, 253], // #C4B5FD — light
  [134, 148, 255], // #8694FF — light
]
// phase in [0,1) cycles smoothly through the palette, looping back to the start
function trailColor(phase: number): [number, number, number] {
  const n      = TRAIL_COLORS.length
  const scaled = (phase - Math.floor(phase)) * n
  const i      = Math.floor(scaled) % n
  const j      = (i + 1) % n
  const f      = scaled - Math.floor(scaled)
  const a      = TRAIL_COLORS[i]
  const b      = TRAIL_COLORS[j]
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ]
}

export function Hero() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const contentRef    = useRef<HTMLDivElement>(null)
  const bgCanvasRef   = useRef<HTMLCanvasElement>(null)
  const fgCanvasRef   = useRef<HTMLCanvasElement>(null)


  // pixelated gradient background — drawn at full resolution with CELL-sized rects
  useEffect(() => {
    const canvas    = bgCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')!
    let rafId: number

    function resize() {
      canvas.width  = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw(t: number) {
      const W    = canvas.width
      const H    = canvas.height
      const cols = Math.ceil(W / CELL)
      const rows = Math.ceil(H / CELL)
      const secs = t / 1000

      ctx.fillStyle = '#FBFBFE'
      ctx.fillRect(0, 0, W, H)

      // accumulate rgba per cell, then draw once per cell
      const R_buf = new Float32Array(cols * rows)
      const G_buf = new Float32Array(cols * rows)
      const B_buf = new Float32Array(cols * rows)
      const A_buf = new Float32Array(cols * rows)

      for (const b of BLOB_DEFS) {
        const px = (b.cx + b.ax * Math.sin(secs * (Math.PI * 2) / b.period)) * cols
        const py = (b.cy + b.ay * Math.cos(secs * (Math.PI * 2) / b.period)) * rows
        const rx = b.rx * cols
        const ry = b.ry * rows

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const dx   = (col + 0.5 - px) / rx
            const dy   = (row + 0.5 - py) / ry
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist >= 1) continue
            const u     = 1 - dist
            const alpha = b.a * (u * u * (3 - 2 * u))
            const idx   = row * cols + col
            // alpha-composite over existing
            const a0    = A_buf[idx]
            const a1    = alpha
            const aOut  = a0 + a1 * (1 - a0)
            if (aOut < 0.0001) continue
            R_buf[idx] = (R_buf[idx] * a0 + b.r * a1 * (1 - a0)) / aOut
            G_buf[idx] = (G_buf[idx] * a0 + b.g * a1 * (1 - a0)) / aOut
            B_buf[idx] = (B_buf[idx] * a0 + b.b * a1 * (1 - a0)) / aOut
            A_buf[idx] = aOut
          }
        }
      }

      // draw each cell as a CELL×CELL rect — perfectly aligned with grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col
          if (A_buf[idx] < 0.005) continue
          ctx.fillStyle = `rgba(${Math.round(R_buf[idx])},${Math.round(G_buf[idx])},${Math.round(B_buf[idx])},${A_buf[idx]})`
          ctx.fillRect(col * CELL, row * CELL, CELL, CELL)
        }
      }

      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // interactive cell highlight
  useEffect(() => {
    const canvas    = fgCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')!
    // current: rendered alpha, target: desired alpha
    const cells = new Map<string, { col: number; row: number; current: number; target: number; color: [number, number, number] }>()
    let rafId: number

    function resize() {
      canvas.width  = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouseMove(e: MouseEvent) {
      const rect     = container.getBoundingClientRect()
      const mouseCol = Math.floor((e.clientX - rect.left) / CELL)
      const mouseRow = Math.floor((e.clientY - rect.top)  / CELL)
      // advance through the palette over time so the moving trail shifts color
      const color    = trailColor(performance.now() / 2600)
      const R = 5
      for (let dr = -R; dr <= R; dr++) {
        for (let dc = -R; dc <= R; dc++) {
          const dist     = Math.sqrt(dr * dr + dc * dc)
          const t        = dist / R
          const strength = t >= 1 ? 0 : 1 - t * t * (3 - 2 * t)
          if (strength <= 0) continue
          const col = mouseCol + dc
          const row = mouseRow + dr
          const key = `${col},${row}`
          const existing = cells.get(key)
          if (existing) {
            existing.target = Math.max(existing.target, strength)
            existing.color  = color
          } else {
            cells.set(key, { col, row, current: 0, target: strength, color })
          }
        }
      }
    }

    container.addEventListener('mousemove', onMouseMove)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const [key, cell] of cells) {
        // ease in toward target, ease out toward 0
        if (cell.current < cell.target) {
          cell.current += (cell.target - cell.current) * 0.12  // fast ease-in
        } else {
          cell.current += (0 - cell.current) * 0.004           // slower ease-out — trail lingers and fades gradually
        }
        cell.target *= 0.992                                    // target decays gradually

        if (cell.current > 0.002) {
          const x = cell.col * CELL
          const y = cell.row * CELL
          ctx.fillStyle = `rgba(${cell.color[0]},${cell.color[1]},${cell.color[2]},${cell.current * 0.52})`
          ctx.fillRect(x, y, CELL, CELL)
          // draw the background's grid line ON TOP of the fill so the hover sits beneath the grid.
          // same gray as the background overlay (rgba(120,120,120,0.07)); fades in with the trail
          const lineAlpha = 0.07 * Math.min(1, cell.current * 4)
          ctx.fillStyle = `rgba(120,120,120,${lineAlpha})`
          ctx.fillRect(x, y, CELL, 1)  // top edge
          ctx.fillRect(x, y, 1, CELL)  // left edge
        } else {
          cells.delete(key)
        }
      }
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  // scroll parallax: content fades + rises, background drifts slower
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.75))
      if (contentRef.current) {
        contentRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.4))
        contentRef.current.style.transform = `translateY(${progress * 70}px)`
      }
      if (bgCanvasRef.current) {
        bgCanvasRef.current.style.transform = `translateY(${progress * 40}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '600px', background: '#ffffff' }}
    >

      {/* pixelated gradient blobs */}
      <canvas
        ref={bgCanvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* cell highlight canvas */}
      <canvas ref={fgCanvasRef} className="pointer-events-none absolute inset-0" />

      {/* grid lines — rendered above the highlight so they stay visible on hover */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(120,120,120,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,120,120,0.07) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL}px ${CELL}px`,
          // fully hide the grid across the center (behind text + buttons), then fade back in toward the edges
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, transparent 28%, rgba(0,0,0,0.35) 55%, black 85%)',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, transparent 28%, rgba(0,0,0,0.35) 55%, black 85%)',
        }}
      />

      <div ref={contentRef} className="relative h-full max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:px-[80px] flex flex-col justify-center items-center text-center pt-[48px]">
        <p
          className="font-['Libre_Caslon_Text'] font-normal text-black leading-[1.1] mb-[clamp(24px,3vw,40px)]"
          style={{ fontSize: 'clamp(34px, 5.2vw, 72px)', letterSpacing: '-0.013em' }}
        >
          Hi! I'm Meysa,
        </p>

        <p
          className="font-['Open_Sans'] font-medium text-[#737373] leading-[1.2] max-w-[760px] mb-[clamp(28px,4vw,48px)]"
          style={{ fontSize: 'clamp(16px, 1.7vw, 24px)', fontVariationSettings: '"wdth" 100' }}
        >
          a designer who shapes digital products and experiences
          <br />
          around <span className="font-medium text-black">people's wellbeing</span>.
        </p>

      </div>

      <div className="absolute bottom-[19px] left-1/2 -translate-x-1/2">
        <p className="font-['Open_Sans'] text-[12px] text-[#737373] tracking-[0.08em] animate-bounce">
          SCROLL
        </p>
      </div>
    </section>
  )
}
