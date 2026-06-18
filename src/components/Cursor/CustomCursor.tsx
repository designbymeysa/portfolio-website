import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let raf: number

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[9999] top-0 left-0"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: '#4B4F58',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
