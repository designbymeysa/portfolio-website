import { useRef, useEffect, ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  /** how much of the cursor's offset the button follows, at the centre of the field */
  pull?: number
  /** px from the button's centre where the lean starts */
  radius?: number
  /** degrees of tilt at full pull */
  tilt?: number
  className?: string
}

/** Wraps a control so it leans toward the cursor — a small translate plus a
 *  perspective tilt, both easing off to nothing at `radius`. */
export function MagneticButton({
  children,
  pull   = 0.28,
  radius = 170,
  tilt   = 7,
  className = '',
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // current vs. target offset, eased toward each other every frame
    let x = 0, y = 0, tx = 0, ty = 0
    let rafId = 0

    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18

      const settled = Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05
      if (settled) { x = tx; y = ty }

      const rx = (-y / radius) * tilt
      const ry = ( x / radius) * tilt
      inner.style.transform =
        `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`

      // idle at rest instead of burning a frame budget on a stationary button
      if (settled && tx === 0 && ty === 0) { rafId = 0; return }
      rafId = requestAnimationFrame(tick)
    }

    const wake = () => { if (!rafId) rafId = requestAnimationFrame(tick) }

    const onMove = (e: MouseEvent) => {
      const r    = wrap.getBoundingClientRect()
      const dx   = e.clientX - (r.left + r.width  / 2)
      const dy   = e.clientY - (r.top  + r.height / 2)
      const dist = Math.hypot(dx, dy)
      // linear falloff, squared so the lean stays gentle until the cursor is close
      const k = dist >= radius ? 0 : (1 - dist / radius) ** 2
      tx = dx * pull * k
      ty = dy * pull * k
      wake()
    }

    const onLeave = () => { tx = 0; ty = 0; wake() }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [pull, radius, tilt])

  return (
    <span ref={wrapRef} className={`inline-block ${className}`} style={{ perspective: '520px' }}>
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  )
}
