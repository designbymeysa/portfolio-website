import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Projects', id: 'work' },
  { label: 'About',    id: 'about' },
  { label: 'Contact',  id: 'contact' },
]

interface NavBarProps {
  isDark: boolean
  onToggleDark: () => void
}

export function NavBar({ isDark, onToggleDark }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible]   = useState(false)
  const [glassy, setGlassy]     = useState(false)
  const [activeSection, setActiveSection] = useState('')
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

      // glass background only once scrolled past the hero; off-home it's always on
      setGlassy(!inHero)

      // always visible in the hero; below it, hide while scrolling down, show on scroll up
      if (inHero)                       setVisible(true)
      else if (y > 4 && dir === 'down') setVisible(false)
      else                              setVisible(true)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) setVisible(true)
    }

    // initial state
    setVisible(true)
    setGlassy(!isHome || window.scrollY >= window.innerHeight - 48)

    window.addEventListener('scroll',    update,      { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('scroll',    update)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isHome])

  // scroll-spy: highlight the nav item for the section currently in view
  useEffect(() => {
    if (!isHome) {
      // off-home, the Projects page maps to the "Projects" (work) item
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

  const linkClass = "relative inline-block uppercase tracking-[2px] font-['Open_Sans'] text-[12px] leading-[1.2] font-normal text-[#737373] hover:text-[#422bd9] transition-colors duration-[150ms] after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 h-[48px] transition-all duration-500 ${glassy ? 'backdrop-blur-[10px] bg-white/10' : 'bg-transparent'} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className={`absolute inset-0 transition-colors duration-500 ${glassy ? 'bg-white/10' : 'bg-transparent'}`} />
        <nav className="relative h-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] flex items-center justify-between">

          <Link to="/" className="font-['Open_Sans'] font-semibold text-[12px] text-[#0f0f0f] tracking-[2px] leading-[1.2] whitespace-nowrap uppercase">
            DESIGNBYMEYSA
          </Link>

          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center gap-[32px] list-none">
              {navItems.map(({ label, id }) => (
                <li key={label}>
                  <button
                    onClick={() => goToSection(id)}
                    className={`${linkClass} ${activeSection === id ? '!text-[#422bd9] after:!scale-x-100' : ''}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              aria-label="Toggle dark mode"
              onClick={onToggleDark}
              className={`
                hidden md:block relative w-[56px] h-[28px] rounded-full border border-[#dcdfe5]
                transition-colors duration-[250ms]
                ${isDark ? 'bg-[#1a1c22]' : 'bg-[#eceef2]'}
              `}
            >
              <span
                className={`
                  absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white
                  shadow-[0px_1px_1px_rgba(9,20,50,0.04)]
                  transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  flex items-center justify-center text-[10px]
                  ${isDark ? 'translate-x-[29px]' : 'translate-x-[2px]'}
                `}
              >
                {isDark ? '☽' : '✦'}
              </span>
            </button>

            <button
              className="md:hidden relative w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {/* closed: all three bars drawn from ONE element (center bar + two box-shadow copies)
                  so they share a single paint pass and are guaranteed the same weight.
                  open: shadows drop and it rotates into one diagonal of the X. */}
              <span
                className="absolute left-[6px] top-[16px] block w-5 h-[1px] bg-[#0f0f0f] transition-all duration-300"
                style={{
                  boxShadow: menuOpen ? '0 0 0 0 transparent' : '0 -6px 0 0 #0f0f0f, 0 6px 0 0 #0f0f0f',
                  transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              />
              {/* second diagonal of the X — hidden until open */}
              <span
                className={`absolute left-[6px] top-[16px] block w-5 h-[1px] bg-[#0f0f0f] transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-[-45deg]' : 'opacity-0'}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* full-screen mobile menu */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden flex flex-col
          bg-white/80 backdrop-blur-[24px] transition-all duration-500 ease-[cubic-bezier(0,0,0.2,1)]
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col justify-between h-full px-8 pt-[80px] pb-12">
          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, id }, i) => (
              <button
                key={label}
                onClick={() => { setMenuOpen(false); goToSection(id) }}
                className={`${linkClass} text-left`}
                style={{
                  fontSize: '22px',
                  fontVariationSettings: '"wdth" 100',
                  transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                  transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.4s cubic-bezier(0,0,0.2,1) ${i * 60}ms, opacity 0.4s ease ${i * 60}ms, color 150ms`,
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a href="mailto:designbymeysa@gmail.com" className="font-['Open_Sans'] text-[13px] text-[#737373]">
              designbymeysa@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
