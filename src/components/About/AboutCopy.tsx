import { useEffect, useRef } from 'react'

/** The About paragraphs, read as one block.
 *
 *  Scroll: as the block rises through the screen its words fill in from a faint ink to
 *  full, front to back across both paragraphs, so the eye is led along as it reads.
 *  `*like this*` is an italic run; an emoji is set a size up, on the line with the
 *  words around it, and gives a little wave on hover. A reader who asked for less
 *  motion gets the text at full ink, still. */
const EMOJI = /((?:\p{Regional_Indicator}{2}|\p{Extended_Pictographic}️?)+)/u
const FAINT = 0.22
const LEAD = 4 // how many words are mid-fill at once

function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) => {
        if (!part) return null
        const italic = part.startsWith('*') && part.endsWith('*')
        const body = italic ? part.slice(1, -1) : part
        const bits = body.split(/(\s+)/).flatMap(word => word.split(EMOJI)).map((bit, j) => {
          if (!bit) return null
          if (/^\s+$/.test(bit)) return bit
          return EMOJI.test(bit)
            ? <span key={j} data-w className="about-emoji">{bit}</span>
            : <span key={j} data-w>{bit}</span>
        })
        return italic ? <em key={i}>{bits}</em> : <span key={i}>{bits}</span>
      })}
    </>
  )
}

export function AboutCopy({ paragraphs, className, style }: { paragraphs: string[]; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = [...el.querySelectorAll<HTMLElement>('[data-w]')]
    const n = words.length
    let queued = false

    const apply = () => {
      queued = false
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      // one sweep across both paragraphs: it starts as the block's top clears 92% of
      // the screen and is done by the time its lower half has come up past the middle
      const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.3 + r.height * 0.7)))
      const head = p * (n + LEAD)
      words.forEach((w, i) => {
        const f = Math.min(1, Math.max(0, (head - i) / LEAD))
        w.style.opacity = String(FAINT + (1 - FAINT) * f)
      })
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={style}>
      {paragraphs.map(text => <p key={text.slice(0, 32)}><Line text={text} /></p>)}
    </div>
  )
}
