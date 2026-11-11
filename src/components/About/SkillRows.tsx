import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import about from '../../content/about.json'

// two lines: the thinking on one, the making on the other
const ROWS = about.skills.groups.map(g => g.items)

// how hard the rows chase the scroll — enough give that they glide rather than tick
const SCROLL_SPRING = { stiffness: 120, damping: 28, mass: 0.35 }

/** /today's skills: two lines of display type, far wider than the screen, that slide
 *  past each other as the page scrolls — the scroll is the only thing moving them, so
 *  they stop when it does. Every other word steps back to the muted ink, a pointer
 *  lights the word it is over in the accent, and under reduced motion the lines sit
 *  still and wrap. */
export function SkillRows() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // progress across the block, from its top meeting the bottom of the screen to its
  // bottom leaving the top, smoothed
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, SCROLL_SPRING)
  const left  = useTransform(progress, [0, 1], ['-2%', '-15%'])
  const right = useTransform(progress, [0, 1], ['-15%', '-2%'])

  return (
    <div ref={ref} className="overflow-x-clip py-[20px] lg:py-[28px]">
      {ROWS.map((items, r) => (
        <motion.ul
          key={r}
          className="flex w-max items-center list-none will-change-transform"
          style={reduced ? { flexWrap: 'wrap', width: 'auto', paddingInline: 24 } : { x: r === 0 ? left : right }}
        >
          {/* each line is its list three times over, so there is always type past both
              edges of the screen however far the scroll has carried it */}
          {(reduced ? items : [...items, ...items, ...items]).map((skill, i) => (
            <li
              key={i}
              /* the repeats are there to fill the screen, not to be read twice */
              aria-hidden={i >= items.length || undefined}
              /* bold, to match the footer's line */
              className="flex items-center font-heading font-bold whitespace-nowrap leading-[1.16]"
              style={{ fontSize: 'clamp(26px, 3.6vw, 52px)', letterSpacing: '-0.03em' }}
            >
              {/* every skill is legible: the quiet ones are the muted ink, not a tint */}
              <span
                className={`transition-colors duration-[250ms] hover:text-[color:var(--accent)] ${
                  (i + r) % 2 ? 'text-[color:var(--ink-muted)]' : 'text-[color:var(--ink-strong)]'
                }`}
              >
                {skill}
              </span>
              <span aria-hidden="true" className="mx-[0.32em] inline-block w-[0.12em] h-[0.12em] rounded-full bg-[color:var(--accent)]" />
            </li>
          ))}
        </motion.ul>
      ))}
    </div>
  )
}
