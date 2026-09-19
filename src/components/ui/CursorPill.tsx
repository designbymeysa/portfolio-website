import { useState } from 'react'
import { createPortal } from 'react-dom'
import type React from 'react'

// The pill follows a cursor, and a touch screen has none: iOS fires one synthetic
// mousemove on tap and never a mouseleave, so the pill would appear at the tap and stay
// there for the rest of the session. Only show it where there is a real pointer.
export const FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** A small labelled pill that stands in for the cursor over a surface — VIEW over a
 *  work card. The surface spreads `bind` on itself (it claims the ring with
 *  `data-cursor="hide"` and reports the pointer), and renders `pill` anywhere inside:
 *  it is portalled to the body, so the surface's own overflow can never crop it. */
export function useCursorPill(label: string) {
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })

  const bind = {
    'data-cursor': 'hide',
    // viewport coordinates, not surface-relative — the pill is fixed to the body
    onMouseMove: (e: React.MouseEvent) => {
      if (!FINE_POINTER) return
      setPill({ visible: true, x: e.clientX, y: e.clientY })
    },
    onMouseLeave: () => setPill(p => ({ ...p, visible: false })),
  }

  const node = (pill.x > 0 || pill.y > 0) && createPortal(
    <span
      aria-hidden="true"
      data-on={pill.visible || undefined}
      className="cursor-pill pointer-events-none fixed z-[9999] inline-flex items-center justify-center bg-[color:var(--cursor-pill-bg)] text-[color:var(--cursor-pill-fg)] font-['Open_Sans'] font-semibold text-[12px] tracking-[0.02em] px-6 py-3 rounded-full select-none shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
      style={{ left: pill.x, top: pill.y }}
    >
      {label}
    </span>,
    document.body,
  )

  return { bind, pill: node }
}
