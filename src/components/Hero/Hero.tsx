import { useRef, useEffect, useState } from 'react'
import Typewriter from '../fancy/text/typewriter'

// the accent word in the headline types itself in and out through these
const ACCENT_WORDS = ['Digital', 'Visual', 'Product']

// grid pitch for the background rule lines, in px
const CELL = 28

// cursor-trail palette — the trail cycles through these as it moves.
// all mid-to-deep tones: the pale tints this used to carry all but vanished
// against the near-white ground once the stamps were blurred.
const TRAIL_COLORS = [
  [ 61,  82, 255], // #3D52FF — blue
  [228, 158, 110], // #E49E6E — warm apricot, the one break in the blues
  [ 91,  63, 212], // #5B3FD4 — deep violet
  [154, 133, 255], // #9A85FF — light violet
  [123,  92, 245], // #7B5CF5 — violet
  [ 92, 110, 255], // #5C6EFF — bright blue
  [ 42,  63, 230], // #2A3FE6 — deep blue
  [168, 141, 250], // #A88DFA — soft violet
  [134, 148, 255], // #8694FF — periwinkle
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

// ── cursor trail ──
// the trail is a stack of soft circular brush stamps laid down along the pointer
// path, into a half-res buffer that the CSS blur below smooths into smoke.
const TRAIL_SCALE  = 0.5    // buffer resolution relative to layout px
const TRAIL_RADIUS = 132    // brush radius in layout px, before the speed stretch
const TRAIL_ALPHA  = 0.2    // peak alpha of a single stamp — overlaps build the body
const TRAIL_FADE   = 0.009  // alpha lifted off the whole buffer each frame — halves the trail every ~1.3s
const TRAIL_IDLE_CLEAR = 900 // frames of a parked pointer before the buffer is wiped outright
const TRAIL_MIN_MOVE = 0.15 // buffer px below which the pointer counts as parked
const TRAIL_CYCLE  = 1500   // ms for one pass through the palette
const TRAIL_SPREAD = 190    // ms of extra palette phase across a single frame's stroke
const TRAIL_DRIFT_WAIT = 1600 // ms after a touch before the trail resumes drifting itself
const TRAIL_DARK_FADE = 2.6  // how much harder the trail decays on a dark ground
// a phone screen is a fraction of a desktop's, so the same brush reads as a dot on it
const TRAIL_TOUCH_SCALE = 2.2
const TRAIL_TOUCH_OPACITY = 0.4
// the drift and the palette both run slower on a phone — a big soft blob moving at
// desktop pace reads as restless on a small screen
const TRAIL_TOUCH_SLOW = 0.45

// How much ink may sit behind the copy before it flips to white, and how far it has to
// clear before it flips back. The gap between the two is what stops it flickering when
// the trail hovers around the line.
const COPY_ON_COLOR  = 0.34
const COPY_OFF_COLOR = 0.22
// The trail's own tail lingers for seconds after the blob has moved on. The copy should
// not wait that out — the model is faded faster than the canvas so the type comes back
// as soon as what is left behind it is thin enough for black to read again.
const COPY_RELEASE = 2.4
// where along the header bar the ink is measured, as fractions of its width
const NAV_SAMPLE_X = [0.06, 0.16, 0.5, 0.74, 0.84, 0.93]

const TAU = Math.PI * 2

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const fgCanvasRef  = useRef<HTMLCanvasElement>(null)
  const gridRef      = useRef<HTMLDivElement>(null)
  const cueRef       = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)
  // true while the trail sits heavy enough behind the copy that black would sink in
  const [onColor, setOnColor] = useState(false)
  const [cueOnColor, setCueOnColor] = useState(false)
  const copyRef = useRef<HTMLDivElement>(null)

  // the headline settles on one word rather than cycling when motion is dialled down
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)

    const pointer = window.matchMedia('(hover: none)')
    setCoarsePointer(pointer.matches)
    const onPointer = () => setCoarsePointer(pointer.matches)
    pointer.addEventListener('change', onPointer)

    return () => {
      mq.removeEventListener('change', onChange)
      pointer.removeEventListener('change', onPointer)
    }
  }, [])

  // cursor trail — round soft-edged stamps along the pointer path, dissolving like smoke
  useEffect(() => {
    const canvas    = fgCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')!
    let rafId = 0
    // A touch screen still fires synthetic mouse events — including for taps and
    // scrolls nowhere near the hero — which drop blobs the user never asked for.
    // Where there is no real pointer, listen only for actual touches.
    const finePointer = !window.matchMedia('(hover: none)').matches

    // The fade is multiplicative, so it leaves a floor of alpha it can never quite
    // reach past. On a light ground that residue is invisible; on a dark one the same
    // pixels read as a grey film, because a faint colour over near-black is grey.
    // Dark mode therefore decays harder and wipes sooner.
    let dark = document.documentElement.classList.contains('dark')
    const themeWatch = new MutationObserver(() => {
      dark = document.documentElement.classList.contains('dark')
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const brush = TRAIL_RADIUS * (finePointer ? 1 : TRAIL_TOUCH_SCALE)
    const cycle = TRAIL_CYCLE / (finePointer ? 1 : TRAIL_TOUCH_SLOW)

    // Rather than reading pixels back off the canvas — a GPU stall every frame — the
    // ink over the copy is modelled on the CPU: each stamp adds to the sample points it
    // covers, and every point decays on the same curve the canvas fades on.
    type Group = 'copy' | 'nav' | 'cue'
    type Sample = { x: number; y: number; ink: number; group: Group }
    let samples: Sample[] = []
    let lit = false
    let navLit = false
    let cueLit = false

    const buildSamples = () => {
      const copy = copyRef.current
      if (!copy) { samples = []; return }
      const c = container.getBoundingClientRect()
      const r = copy.getBoundingClientRect()
      const cols = 5
      const rows = 3
      const next: Sample[] = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          next.push({
            x: (r.left - c.left + (r.width  * (i + 0.5)) / cols) * TRAIL_SCALE,
            y: (r.top  - c.top  + (r.height * (j + 0.5)) / rows) * TRAIL_SCALE,
            ink: 0,
            group: 'copy',
          })
        }
      }

      // the SCROLL cue, sampled across its own box
      const cue = cueRef.current
      if (cue) {
        const q = cue.getBoundingClientRect()
        for (const f of [0.2, 0.5, 0.8]) {
          next.push({
            x: (q.left - c.left + q.width * f) * TRAIL_SCALE,
            y: (q.top  - c.top  + q.height / 2) * TRAIL_SCALE,
            ink: 0,
            group: 'cue',
          })
        }
      }
      // and the header's own strip: the wordmark on the left, the links or the menu
      // button on the right, sampled along the middle of the 48px bar
      for (const f of NAV_SAMPLE_X) {
        next.push({ x: c.width * f * TRAIL_SCALE, y: 24 * TRAIL_SCALE, ink: 0, group: 'nav' })
      }
      samples = next
    }

    const resize = () => {
      canvas.width  = Math.max(1, Math.round(container.offsetWidth  * TRAIL_SCALE))
      canvas.height = Math.max(1, Math.round(container.offsetHeight * TRAIL_SCALE))
      buildSamples()
    }
    resize()
    window.addEventListener('resize', resize)

    // pointer and last-stamped point, both in buffer space
    let x = 0, y = 0, lastX = 0, lastY = 0
    let speed = 0            // eased pointer speed, drives how far the brush swells
    let seen  = false        // no stamps until the pointer has been somewhere
    let idle  = 0            // frames since the last stamp
    let wiped = false        // whether the idle wipe has already run for this pause
    let touching = false     // a real touch has been seen; ignore the synthetic mouse
    let markNow  = false     // lay one stamp on the next frame, wherever the point is
    let lastTouch = -1e9     // when the last touch happened, for handing back to drift
    let rejoin = true        // jump the brush on the next drift frame instead of drawing to it

    // put the point somewhere without drawing a line to it from wherever it was
    const jumpTo = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect()
      x = (clientX - r.left) * TRAIL_SCALE
      y = (clientY - r.top)  * TRAIL_SCALE
      lastX = x
      lastY = y
      seen = true
    }

    const onMove = (e: MouseEvent) => {
      // a tap makes the browser synthesise a mousemove at the finger, which would
      // streak a line across from wherever the pointer last was
      if (touching) return
      const r = container.getBoundingClientRect()
      x = (e.clientX - r.left) * TRAIL_SCALE
      y = (e.clientY - r.top)  * TRAIL_SCALE
      if (!seen) { lastX = x; lastY = y; seen = true }
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      touching = true
      lastTouch = performance.now()
      rejoin = true
      jumpTo(t.clientX, t.clientY)
      // a tap on its own covers no distance, so mark the spot explicitly
      markNow = true
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      lastTouch = performance.now()
      const r = container.getBoundingClientRect()
      x = (t.clientX - r.left) * TRAIL_SCALE
      y = (t.clientY - r.top)  * TRAIL_SCALE
    }

    const onTouchEnd = () => {
      touching = false
      lastTouch = performance.now()
    }

    // A touch screen still fires synthetic mouse events — including for taps and
    // scrolls that happen nowhere near the hero — which drop blobs the user never
    // asked for. Where there is no real pointer, listen only for actual touches.
    if (finePointer) window.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd, { passive: true })
    container.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // one round stamp: a radial gradient with no hard edge anywhere in it
    const stamp = (sx: number, sy: number, radius: number, alpha: number, rgb: string) => {
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius)
      grad.addColorStop(0,    `rgba(${rgb},${alpha})`)
      grad.addColorStop(0.42, `rgba(${rgb},${alpha * 0.68})`)
      grad.addColorStop(0.72, `rgba(${rgb},${alpha * 0.26})`)
      grad.addColorStop(1,    `rgba(${rgb},0)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(sx, sy, radius, 0, TAU)
      ctx.fill()

      for (const smp of samples) {
        const d = Math.hypot(smp.x - sx, smp.y - sy)
        if (d >= radius) continue
        const falloff = 1 - d / radius
        smp.ink = Math.min(1, smp.ink + alpha * falloff * falloff)
      }
    }

    const frame = (t: number) => {
      // The fade is multiplicative — destination-out scales the buffer's alpha rather
      // than subtracting from it — so the last few units of alpha round to themselves
      // and a faint haze can sit there indefinitely. Once the pointer has been parked
      // long enough for the trail to be well past visible, wipe the buffer outright.
      const fade = TRAIL_FADE * (dark ? TRAIL_DARK_FADE : 1)

      if (idle > TRAIL_IDLE_CLEAR * (dark ? 0.4 : 1)) {
        if (!wiped) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          wiped = true
        }
      } else {
        // lift a sliver of alpha off the whole buffer — an even, edge-free decay
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = `rgba(0,0,0,${fade})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
      }

      idle++

      // With no pointer to follow, the colour would only ever appear once someone
      // thought to touch. Instead the brush walks a slow figure of its own, hands
      // over the moment a finger lands, and picks the walk back up shortly after.
      if (!finePointer && !touching && t - lastTouch > TRAIL_DRIFT_WAIT) {
        const secs = (t / 1000) * TRAIL_TOUCH_SLOW
        const dx = (0.5 + 0.32 * Math.sin(secs * 0.9))        * canvas.width
        const dy = (0.5 + 0.24 * Math.sin(secs * 1.35 + 1.1)) * canvas.height
        // rejoining after a touch, start from where the walk is rather than drawing to it
        if (rejoin) { lastX = dx; lastY = dy; rejoin = false }
        x = dx
        y = dy
        seen = true
      }

      if (seen) {
        const dx   = x - lastX
        const dy   = y - lastY
        const dist = Math.hypot(dx, dy)
        speed += (dist - speed) * 0.16

        if (markNow) {
          const [r, g, b] = trailColor(t / cycle)
          stamp(x, y, brush * TRAIL_SCALE, TRAIL_ALPHA * 1.4, `${r},${g},${b}`)
          markNow = false
          idle = 0
          wiped = false
        }

        if (dist >= TRAIL_MIN_MOVE) {
          // faster strokes lay a wider, slightly lighter band
          const swell  = Math.min(1, speed / 34)
          const radius = brush * TRAIL_SCALE * (0.85 + swell * 0.55)
          const alpha  = TRAIL_ALPHA * (1 - swell * 0.16)
          // space the stamps closely enough that the path reads as one stroke
          const steps  = Math.max(1, Math.ceil(dist / (radius * 0.2)))
          for (let i = 1; i <= steps; i++) {
            const f = i / steps
            // the palette advances along the stroke as well as over time, so a single
            // sweep carries several colours rather than one flat wash
            const [r, g, b] = trailColor((t + f * TRAIL_SPREAD) / cycle)
            stamp(lastX + dx * f, lastY + dy * f, radius, alpha, `${r},${g},${b}`)
          }
          lastX = x
          lastY = y
          idle  = 0
          wiped = false
        }
      }

      const ink: Record<Group, number> = { copy: 0, nav: 0, cue: 0 }
      const n:   Record<Group, number> = { copy: 0, nav: 0, cue: 0 }
      for (const smp of samples) {
        smp.ink *= 1 - fade * COPY_RELEASE
        ink[smp.group] += smp.ink
        n[smp.group]++
      }
      // the canvas is dialled back on a phone, so the same ink reads lighter there
      const shown = finePointer ? 1 : TRAIL_TOUCH_OPACITY
      const coverOf = (g: Group) => (n[g] ? (ink[g] / n[g]) * shown : 0)

      const cover = coverOf('copy')
      if (!lit && cover > COPY_ON_COLOR)      { lit = true;  setOnColor(true) }
      else if (lit && cover < COPY_OFF_COLOR) { lit = false; setOnColor(false) }

      const cueCover = coverOf('cue')
      if (!cueLit && cueCover > COPY_ON_COLOR)      { cueLit = true;  setCueOnColor(true) }
      else if (cueLit && cueCover < COPY_OFF_COLOR) { cueLit = false; setCueOnColor(false) }

      // the header is fixed and outlives this section, so it only follows the trail
      // while the hero still holds the top of the screen
      const overHero = container.getBoundingClientRect().bottom > window.innerHeight * 0.5
      const navCover = overHero ? coverOf('nav') : 0
      if (!navLit && navCover > COPY_ON_COLOR) {
        navLit = true
        document.documentElement.classList.add('nav-on-color')
      } else if (navLit && navCover < COPY_OFF_COLOR) {
        navLit = false
        document.documentElement.classList.remove('nav-on-color')
      }

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      themeWatch.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
      container.removeEventListener('touchcancel', onTouchEnd)
      document.documentElement.classList.remove('nav-on-color')
    }
  }, [])

  // scroll: the hero pulls away rather than simply scrolling off — the type rises
  // faster than the page and shrinks slightly, the ground behind it dissolves, and
  // the cue is the first thing to go. Read on scroll, written on the next frame.
  useEffect(() => {
    let queued = false
    const coarse = window.matchMedia('(hover: none)')

    const apply = () => {
      queued = false
      // on a phone the first half screen is the hold below the hero — it stays whole
      // through that, and only starts leaving once the page is actually on its way
      const hold = coarse.matches ? window.innerHeight * 0.5 : 0
      const p = Math.min(1, Math.max(0, (window.scrollY - hold) / (window.innerHeight * 0.8)))

      if (contentRef.current) {
        contentRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.35))
        // negative Y: it leaves upward ahead of the scroll, which reads as receding
        contentRef.current.style.transform = `translateY(${-p * 90}px) scale(${1 - p * 0.07})`
      }
      // the grid and the trail hold on a little longer, so the type leads the exit
      const groundOpacity = String(Math.max(0, 1 - p * 1.15))
      if (gridRef.current)      gridRef.current.style.opacity      = groundOpacity
      if (fgCanvasRef.current)  fgCanvasRef.current.style.opacity  = groundOpacity
      if (cueRef.current) {
        cueRef.current.style.opacity   = String(Math.max(0, 1 - p * 3.2))
        cueRef.current.style.transform = `translate(-50%, ${p * 24}px)`
      }
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      /* sticky, so the page slides up over it instead of pushing it off */
      className="sticky top-0 z-0 w-full overflow-hidden"
      /* no ground of its own — the page-wide gradient in Layout shows through */
      /* 100vh, not dvh: on iOS vh is the large viewport, so the section runs behind
         Safari's bars instead of stopping short of them */
      style={{ height: '100vh', minHeight: '600px', background: 'transparent' }}
    >

      {/* cursor trail — blurred in CSS so the half-res buffer reads as smoke */}
      <canvas
        ref={fgCanvasRef}
        className="pointer-events-none absolute inset-0"
        /* at the size the brush runs on a phone, full strength sits heavy behind the
           headline — this is declared here, not set from the effect, so a re-render
           cannot put it back to 1 */
        style={{
          width: '100%',
          height: '100%',
          filter: 'blur(20px) saturate(1.45)',
          opacity: coarsePointer ? TRAIL_TOUCH_OPACITY : 1,
        }}
      />

      {/* grid lines — rendered above the trail so they stay visible through it */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL}px ${CELL}px`,
          // fully hide the grid across the center (behind text + buttons), then fade back in toward the edges
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, transparent 28%, rgba(0,0,0,0.35) 55%, black 85%)',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, transparent 28%, rgba(0,0,0,0.35) 55%, black 85%)',
        }}
      />

      <div ref={contentRef} className="relative h-full max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:px-[80px] flex flex-col justify-center items-center text-center pt-[48px] will-change-transform">
        <div ref={copyRef} className={`flex flex-col items-center ${onColor ? 'hero-on-color' : ''}`}>
        <h1
          className="hero-copy font-['Libre_Caslon_Text'] font-normal text-[color:var(--ink-strong)] leading-[1.06] mb-[clamp(24px,3vw,40px)]"
          style={{ fontSize: 'clamp(38px, 6.4vw, 92px)', letterSpacing: '-0.018em' }}
        >
          <span aria-hidden="true">
            Hi! I'm Meysa,
            <br />
            a{' '}
            <em className="hero-accent inline-block italic text-[color:var(--brand-purple)] whitespace-nowrap">
              {reducedMotion
                ? ACCENT_WORDS[0]
                : <Typewriter text={ACCENT_WORDS} speed={95} deleteSpeed={45} waitTime={2100} />}
            </em>{' '}
            Designer
          </span>
          <span className="sr-only">Hi! I'm Meysa, a digital designer</span>
        </h1>

        <p
          className="hero-copy hero-sub font-['Open_Sans'] font-normal text-[color:var(--ink-muted)] leading-[1.45] max-w-[620px]"
          style={{ fontSize: 'clamp(15px, 1.35vw, 19px)', fontVariationSettings: '"wdth" 100' }}
        >
          Shaping products and experiences that put{' '}
          <span className="hero-copy font-semibold text-[color:var(--ink-strong)]">people's wellbeing</span> first.
        </p>
        </div>
      </div>

      {/* scroll cue — the first thing to leave once the page moves */}
      <div ref={cueRef} className="absolute bottom-[76px] md:bottom-[19px] left-1/2" style={{ transform: 'translate(-50%, 0)' }}>
        <button
          type="button"
          onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to the work"
          className={`hero-cue font-['Open_Sans'] text-[11px] text-[color:var(--ink-muted)] tracking-[0.18em] scroll-cue cursor-pointer ${cueOnColor ? 'hero-cue-on-color' : ''}`}
        >
          SCROLL
        </button>
      </div>
    </section>
  )
}
