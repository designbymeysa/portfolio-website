import { useState } from 'react'
import { NavBar } from './Navigation/NavBar'
import { HomeFooter } from './Footer/HomeFooter'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isDark, setIsDark] = useState(false)
  return (
    <div className={isDark ? 'dark' : ''}>
      {/* subtle page-wide gradient tint, fixed behind all content */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, #F3F2FF 0%, #FBFBFE 48%, #FBF5F1 100%)' }}
      />
      <NavBar isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
      {children}
      <HomeFooter />
    </div>
  )
}
