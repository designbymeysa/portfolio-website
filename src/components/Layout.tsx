import { useEffect, useRef, useState } from 'react'
import { NavBar } from './Navigation/NavBar'
import { HomeFooter } from './Footer/HomeFooter'
import { CustomCursor } from './Cursor/CustomCursor'

interface LayoutProps {
  children: React.ReactNode
  /** rendered behind the scrolling page — the home hero pins itself there */
  hero?: React.ReactNode
}

export function Layout({ children, hero }: LayoutProps) {
  // Layout is mounted per route, so plain state reset the theme on every navigation —
  // toggle to dark, open a case study, and you were back in light. The choice lives in
  // storage instead. Light is the default: the system preference is deliberately not
  // consulted, so the site opens light for everyone until they say otherwise.
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { return false }
  })
  const washRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light') } catch { /* private mode */ }
  }, [isDark])

  // Over the last screen of the page the whole viewport washes purple, not just the
  // footer panel — the sections above are transparent, so a fixed layer under the
  // footer's own z-index carries the colour across everything still on screen.
  useEffect(() => {
    const el = washRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let queued  = false
    let target  = 0      // where the scroll position says the wash should be
    let current = 0      // where it actually is, chasing the target
    let easing  = false
    let rafId   = 0

    // the browser's own bars take their colour from this, so it travels with the wash
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    // read the ground off the theme rather than hard-coding it, so the wash starts
    // from the right colour in either mode
    const styles = getComputedStyle(document.documentElement)
    const read = (token: string, fallback: [number, number, number]): [number, number, number] => {
      const hex = styles.getPropertyValue(token).trim().replace('#', '')
      return hex.length === 6
        ? [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
        : fallback
    }
    const PAGE = read('--page-top', [0xFB, 0xFB, 0xFE])
    const PURPLE = read('--footer-purple', [0x5B, 0x3F, 0xD4])

    const apply = () => {
      queued = false
      const vh = window.innerHeight
      const doc = document.documentElement
      const y = window.scrollY

      // The wash starts the moment the last experience row clears the top of the
      // screen and finishes at the foot of the page. Off the home page — or before
      // that block exists — fall back to the closing screen and a half.
      const marker = document.getElementById('experience-end')
      let raw: number
      if (marker) {
        const start = marker.getBoundingClientRect().bottom + y
        const end   = Math.max(start + 1, doc.scrollHeight - vh)
        raw = Math.min(1, Math.max(0, (y - start) / (end - start)))
      } else {
        const remaining = doc.scrollHeight - (y + vh)
        raw = Math.min(1, Math.max(0, 1 - remaining / (vh * 1.5)))
      }
      // seventh-order smootherstep: velocity, acceleration and jerk all vanish at both
      // ends, so there is no frame at which the colour visibly begins or settles
      target = raw * raw * raw * raw * (35 + raw * (-84 + raw * (70 - raw * 20)))
      ease()
    }

    // Scroll arrives in jumps — coarse wheel steps, iOS momentum — and painting the
    // curve straight from them shows those steps. The value chases its target on its
    // own frames instead, so what lands on screen is continuous whatever the input.
    const paint = (p: number) => {
      // The layer travels along the colour itself rather than fading a finished purple
      // in over the page: it takes the ground's own tint and walks it to purple, going
      // opaque by the halfway mark. A translucent purple over a pale ground greys out
      // through the middle — this passes through real lavenders instead.
      const mix = `rgb(${PAGE.map((c, i) => Math.round(c + (PURPLE[i] - c) * p)).join(',')})`
      el.style.background = mix
      el.style.opacity = Math.min(1, p * 2).toFixed(3)

      // theme-color drives the bars on newer iOS; the document background drives them
      // on older versions and paints the overscroll area on every one. Set both.
      themeMeta?.setAttribute('content', mix)
      document.documentElement.style.backgroundColor = mix
      // the cursor stops inverting once the ground is mostly purple — difference
      // against a saturated colour reads as its complement, which is green here
      document.documentElement.classList.toggle('wash-strong', p > 0.25)
    }

    const tick = () => {
      current += (target - current) * 0.075
      if (Math.abs(target - current) < 0.0005) {
        current = target
        easing = false
      } else {
        rafId = requestAnimationFrame(tick)
      }
      paint(current)
    }

    const ease = () => {
      if (easing) return
      easing = true
      rafId = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }

    apply()
    current = target
    paint(current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isDark])

  return (
    <div>
      {/* subtle page-wide gradient tint, fixed behind all content */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'var(--page-grad)' }}
      />
      <CustomCursor />

      <NavBar isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
      {hero}
      {/* the page proper: it scrolls up over the pinned hero, so with a hero present
          it carries its own opaque ground rather than letting the hero show through */}
      {/* A phone-only hold: this scrolls past transparently, so the pinned hero stays
          whole for another half screen and there is room to draw on it before the
          page proper slides up. Nothing sits in it — the hero shows through. */}
      {hero && <div aria-hidden="true" className="h-[50vh] md:hidden" />}

      <div className={`relative z-10 ${hero ? 'page-ground' : ''}`}>
        {/* The wash has to live inside this wrapper, not beside it: `z-10` here makes
            a stacking context, so the footer's own z-index is scoped to it and could
            never climb over a sibling layer. Fixed still resolves to the viewport —
            nothing on this branch carries a transform. */}
        <div
          ref={washRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-20"
          style={{
            opacity: 0,
            background: 'var(--footer-purple)',
          }}
        />

        {children}
        <HomeFooter />

      </div>
    </div>
  )
}
