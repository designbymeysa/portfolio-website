import { useEffect, useRef } from 'react'
import { SlideIcon } from '../ui/LinkIcons'

/** The pointer, replaced by a small circle that changes shape for what is under it.
 *
 *  Desktop only: it mounts nothing where the pointer is coarse, and the CSS that hides
 *  the native arrow is behind the same media query, so a touch device is untouched.
 *
 *  States are declared by the page, not guessed here — an element carrying
 *  `data-cursor="…"` claims the cursor while the pointer is inside it:
 *    hide   nothing, for surfaces that show their own label (the VIEW pill)
 *    plain  a solid disc that does not invert, for saturated grounds
 *    slide  the disc grown to a badge with a two-way arrow in it, for carousels
 *  A link inside a claimed surface reports as `<claim>-link`, so the disc can still
 *  react to it. Anything else gets `link` or `default`. */

const EASE = 0.22          // how hard the ring chases the pointer
const HIDE_AFTER = 'hide'

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // no pointer to replace, or the reader asked for less movement
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let px = x
    let py = y
    let raf = 0
    let visible = false

    const follow = () => {
      // the ring eases toward the pointer rather than pinning to it: a little lag is
      // what makes it read as an object rather than a redrawn arrow
      px += (x - px) * EASE
      py += (y - py) * EASE
      el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(follow)
    }
    raf = requestAnimationFrame(follow)

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        // start where the pointer is, so it does not fly in from the middle
        px = x
        py = y
        visible = true
        el.dataset.on = 'true'
      }
      const target = e.target as Element | null
      const claim = target?.closest?.('[data-cursor]')?.getAttribute('data-cursor')
      const onLink = !!target?.closest?.('a, button, [role="button"]')
      // a claimed surface still reports its links, so the disc can swell there without
      // taking the claim's blending with it — the purple footer is the case in point
      const state = claim ? (onLink ? `${claim}-link` : claim) : (onLink ? 'link' : 'default')
      if (el.dataset.state !== state) el.dataset.state = state
    }

    const onLeave = () => { visible = false; el.dataset.on = 'false' }
    const onDown  = () => { el.dataset.press = 'true' }
    const onUp    = () => { el.dataset.press = 'false' }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <div ref={ref} className="site-cursor" data-state="default" data-on="false" aria-hidden="true">
      {/* the arrow lives inside the disc the whole time and is shown only when the
          disc has grown to hold it, so the change is one shape resizing */}
      <SlideIcon className="site-cursor-icon h-[16px] w-[16px]" />
    </div>
  )
}

export { HIDE_AFTER }
