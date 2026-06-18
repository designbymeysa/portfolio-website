import React, {
  createContext, useContext, useEffect, useRef, useState,
} from 'react'

interface StackCtx { scrollRatio: number; totalCards: number }
const Ctx = createContext<StackCtx>({ scrollRatio: 0, totalCards: 0 })

interface StackingCardsProps {
  totalCards: number
  scrollOptions?: { container?: React.RefObject<HTMLElement> }
  children: React.ReactNode
}

export default function StackingCards({ totalCards, scrollOptions, children }: StackingCardsProps) {
  const [scrollRatio, setScrollRatio] = useState(0)

  useEffect(() => {
    const el = scrollOptions?.container?.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      setScrollRatio(max > 0 ? el.scrollTop / max : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollOptions?.container])

  return (
    <Ctx.Provider value={{ scrollRatio, totalCards }}>
      {children}
    </Ctx.Provider>
  )
}

interface StackingCardItemProps {
  index: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function StackingCardItem({ index, className = '', style, children }: StackingCardItemProps) {
  const { scrollRatio, totalCards } = useContext(Ctx)
  const ref = useRef<HTMLDivElement>(null)

  // How far through the scroll are we when this card starts sticking?
  // Cards are evenly distributed across scroll range
  const start = index / (totalCards + 1)
  const end   = (index + 1) / (totalCards + 1)
  const local = Math.max(0, Math.min(1, (scrollRatio - start) / (end - start)))

  // Scale down by up to 4% as next card comes up over it
  const scale = 1 - Math.max(0, local - 0.8) / 0.2 * 0.04

  return (
    <div
      ref={ref}
      className={`sticky top-0 ${className}`}
      style={{
        ...style,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: 'transform 0.1s ease-out',
        zIndex: index + 1,
      }}
    >
      {children}
    </div>
  )
}
