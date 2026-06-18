import { useEffect, useState } from 'react'

interface TypewriterProps {
  text: string[]
  speed?: number
  deleteSpeed?: number
  waitTime?: number
  className?: string
  onIndexChange?: (index: number) => void
}

export default function Typewriter({
  text,
  speed = 70,
  deleteSpeed = 40,
  waitTime = 1500,
  className = '',
  onIndexChange,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex]         = useState(0)
  const [phase, setPhase]         = useState<'typing' | 'waiting' | 'deleting'>('typing')
  const [charPos, setCharPos]     = useState(0)

  useEffect(() => {
    const current = text[index]

    if (phase === 'typing') {
      if (charPos < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charPos + 1))
          setCharPos(p => p + 1)
        }, speed)
        return () => clearTimeout(t)
      } else {
        setPhase('waiting')
      }
    }

    if (phase === 'waiting') {
      const t = setTimeout(() => setPhase('deleting'), waitTime)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (charPos > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charPos - 1))
          setCharPos(p => p - 1)
        }, deleteSpeed)
        return () => clearTimeout(t)
      } else {
        const next = (index + 1) % text.length
        setIndex(next)
        onIndexChange?.(next)
        setPhase('typing')
      }
    }
  }, [phase, charPos, index, text, speed, deleteSpeed, waitTime])

  return (
    <span className={className}>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '0.85em',
          background: 'currentColor',
          marginLeft: '6px',
          verticalAlign: 'middle',
          borderRadius: '1px',
          animation: phase === 'waiting' ? 'tw-blink 0.8s step-end infinite' : 'none',
          opacity: phase === 'deleting' ? 0.4 : 1,
        }}
      />
      <style>{`
        @keyframes tw-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
