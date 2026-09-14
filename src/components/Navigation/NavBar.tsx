import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import site from '../../content/site.json'

const navItems = site.nav

// the wordmark and the nav items share one type setting so they read as a set —
// family, size, tracking and case are identical, only the colour differs
const NAV_TYPE = "nav-type font-['Open_Sans'] text-[12px] leading-[1.2] font-semibold uppercase tracking-[2px]"

// The sheet lists exactly what the bar lists — one set of destinations, so the phone
// and the desktop never disagree about what the site is made of.
// The sheet's own items. Not built from NAV_TYPE: that is 12px semibold caps for a
// 48px bar, and a full screen wants the opposite — the display serif the rest of the
// site sets its headings in, at the size a heading would take, tracking pulled back in
// as it grows. No sliding underline either: a tap has nowhere to hover, so the accent
// lands on the current section instead.
const MOBILE_LINK_CLASS =
  "text-left font-['Libre_Caslon_Text'] font-normal text-[clamp(38px,11vw,52px)] leading-[1.12] tracking-[-0.015em] transition-colors duration-[150ms]"

interface NavBarProps {
  isDark: boolean
  onToggleDark: () => void
}

export function NavBar({ isDark, onToggleDark }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible]   = useState(false)
  const [solid,  setSolid]      = useState(false)
  const [activeSection, setActiveSection] = useState('')
  // the footer is its own full-screen thing — the bar stays out of it
  const inFooterRef = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome   = location.pathname === '/'

  const goToSection = (id: string) => {
    const scroll = () => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (location.pathname !== '/') {
      navigate('/')
      // wait for the homepage to mount before scrolling
      setTimeout(scroll, 80)
    } else {
      scroll()
    }
  }

  useEffect(() => {
    let lastY = window.scrollY

    const update = () => {
      const y   = window.scrollY
      const dir = y > lastY ? 'down' : 'up'
      lastY = y

      const inHero = isHome && y < window.innerHeight - 48

      // solid background only once scrolled past the hero; off-home it's always on
      setSolid(!inHero)

      // once the footer has reached the top of the screen the bar stays hidden —
      // its dark type has nothing to sit on there, and the footer carries the links
      const footer = document.getElementById('contact')
      const inFooter = !!footer && footer.getBoundingClientRect().top <= 64
      inFooterRef.current = inFooter

      // always visible in the hero; below it, hide while scrolling down, show on scroll up
      if (inFooter)                     setVisible(false)
      else if (inHero)                  setVisible(true)
      else if (y > 4 && dir === 'down') setVisible(false)
      else                              setVisible(true)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80 && !inFooterRef.current) setVisible(true)
    }

    // initial state
    setVisible(true)
    setSolid(!isHome || window.scrollY >= window.innerHeight - 48)

    window.addEventListener('scroll',    update,      { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('scroll',    update)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isHome])

  // ── while the sheet is up ──
  // The page went on scrolling behind it, and the only way out was the button that
  // opened it. Both are undone the moment it closes, and the lock records what it
  // replaced rather than assuming — `body` carries `overflow-x: clip` from the
  // stylesheet, which has to come back exactly as it was.
  useEffect(() => {
    if (!menuOpen) return

    const body = document.body.style.overflow
    const root = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    // the sheet is the ground now, so the bar stops following the hero's trail —
    // white type over a near-white sheet is a close button nobody can see
    document.documentElement.classList.add('menu-open')

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      // focus would otherwise be left on a sheet that is no longer there
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = body
      document.documentElement.style.overflow = root
      document.documentElement.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // scroll-spy: highlight the nav item for the section currently in view
  useEffect(() => {
    if (!isHome) {
      // off-home, the case studies page maps to the "Case studies" (work) item
      setActiveSection(location.pathname === '/projects' ? 'work' : '')
      return
    }
    const ids = navItems.map(n => n.id)
    const update = () => {
      const line = window.innerHeight * 0.3
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line) { current = id; break }
      }
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isHome, location.pathname])

  // the same switch is needed in the header and inside the mobile sheet, where the
  // header's copy is hidden — one definition so the two can never drift apart
  const darkToggle = (extra: string) => (
    <button
      aria-label="Toggle dark mode"
      onClick={onToggleDark}
      className={`
        relative shrink-0 w-[56px] h-[28px] rounded-full border border-[color:var(--line)]
        transition-colors duration-[250ms]
        bg-[color:var(--surface-2)]
        ${extra}
      `}
    >
      <span
        className={`
          absolute top-[3px] w-[22px] h-[22px] rounded-full bg-[color:var(--switch-knob)]
          shadow-[0px_1px_1px_rgba(9,20,50,0.04)]
          transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          flex items-center justify-center text-[10px]
          ${isDark ? 'translate-x-[29px]' : 'translate-x-[2px]'}
        `}
      >
        {isDark ? '☽' : '✦'}
      </span>
    </button>
  )

  const linkClass = `relative inline-block ${NAV_TYPE} text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)] transition-colors duration-[150ms] after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 h-[48px] transition-all duration-500 ${solid ? 'bg-[color:var(--nav-veil)]' : 'bg-transparent'} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <nav className="relative h-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] flex items-center justify-between">

          <Link
            to="/"
            /* the sheet carries the page's own ground, so the bar over it needs no
               open-state colour of its own — the wordmark stays ink either way */
            className={`${NAV_TYPE} whitespace-nowrap text-[color:var(--ink-strong)]`}
          >
            DESIGNBYMEYSA
          </Link>

          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center gap-[32px] list-none">
              {navItems.map(({ label, id }) => (
                <li key={label}>
                  <button
                    onClick={() => goToSection(id)}
                    className={`${linkClass} ${activeSection === id ? '!text-[color:var(--accent)] after:!scale-x-100' : ''}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {darkToggle('hidden md:block')}

            <button
              ref={menuButtonRef}
              className="md:hidden relative w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {/* closed: all three bars drawn from ONE element (center bar + two box-shadow copies)
                  so they share a single paint pass and are guaranteed the same weight.
                  open: shadows drop and it rotates into one diagonal of the X. */}
              <span
                className="nav-bar-line absolute left-[6px] top-[16px] block w-5 h-[1px] transition-all duration-300 text-[color:var(--ink-strong)] bg-[color:var(--ink-strong)]"
                style={{
                  boxShadow: menuOpen ? '0 0 0 0 transparent' : '0 -6px 0 0 currentColor, 0 6px 0 0 currentColor',
                  transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              />
              {/* second diagonal of the X — hidden until open */}
              <span
                className={`nav-bar-line absolute left-[6px] top-[16px] block w-5 h-[1px] bg-[color:var(--ink-strong)] transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-[-45deg]' : 'opacity-0'
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* full-screen mobile menu.

          `pointer-events-none` alone left the closed sheet in the tab order: it stops
          the mouse, not the keyboard, and below `md` this element is still displayed.
          Tabbing a phone page walked into three invisible links and a second theme
          toggle. `visibility: hidden` takes the whole subtree out of the tab order and
          the accessibility tree at once — and, transitioned with a delay that matches
          the fade, only after the sheet has finished going. */}
      <div
        id="mobile-menu"
        className={`
          fixed inset-0 z-40 md:hidden flex flex-col
          bg-[color:var(--sheet)]
          ${menuOpen ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: menuOpen
            ? 'opacity 500ms cubic-bezier(0,0,0.2,1)'
            : 'opacity 500ms cubic-bezier(0,0,0.2,1), visibility 0s 500ms',
        }}
      >
        {/* the same gutter the header uses, so the items start on the wordmark's edge.
            The top pad clears the bar, which stays over the sheet and carries the close. */}
        <div className="flex flex-col justify-between h-full px-6 sm:px-10 pt-[132px] pb-12">
          <nav className="flex flex-col gap-[10px]">
            {navItems.map(({ label, id }, i) => (
              <button
                key={label}
                onClick={() => { setMenuOpen(false); goToSection(id) }}
                className={`${MOBILE_LINK_CLASS} ${
                  isHome && activeSection === id
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--ink-strong)]'
                }`}
                style={{
                  transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.4s cubic-bezier(0,0,0.2,1) ${i * 60}ms, opacity 0.4s ease ${i * 60}ms, color 150ms`,
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex">
            {darkToggle('')}
          </div>
        </div>
      </div>
    </>
  )
}
