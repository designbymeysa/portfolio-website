import { Link } from 'react-router-dom'
import type React from 'react'

/** A link or button with a solid disc sitting behind its last letters. Where the text
 *  crosses the disc it flips to the disc's own contrast colour; everywhere else it
 *  keeps the page's ink. The underline runs beneath both.
 *
 *  The inversion is a clipped duplicate of the label rather than a blend mode: blend
 *  modes invert against whatever is behind the link too, which turns black type on a
 *  pale page into a muddy grey. Here the second copy is clipped to exactly the disc,
 *  so the effect is confined to it and the colours are the ones you asked for.
 *
 *  Geometry is set from props, since a short word wants the disc in a different place
 *  from a long one:
 *    size  disc diameter in em, relative to the label's own type size
 *    x, y  the disc's centre, as a percentage of the label's box
 *
 *    <CircleLink to="/contact">Contact</CircleLink>
 *    <CircleLink href="/cv.pdf" size={1.5} x="82%">Resume</CircleLink>
 */
export interface CircleLinkProps {
  children: React.ReactNode
  /** router destination — renders a <Link> */
  to?: string
  /** external destination — renders an <a> */
  href?: string
  onClick?: () => void
  /** disc diameter in em (default 1.7) */
  size?: number
  /** disc centre across the label (default '84%' — over the last letter or two) */
  x?: string
  /** disc centre down the label (default '55%') */
  y?: string
  /** the disc itself (default the brand purple) */
  color?: string
  /** the label where it crosses the disc (default white) */
  onColor?: string
  /** show the disc at rest; otherwise it grows in on hover and focus */
  always?: boolean
  className?: string
}

export function CircleLink({
  children,
  to,
  href,
  onClick,
  size = 1.7,
  x = '84%',
  y = '55%',
  color = 'var(--brand-purple)',
  onColor = '#ffffff',
  always = false,
  className = '',
}: CircleLinkProps) {
  const style = {
    ['--cl-size' as string]: `${size}em`,
    ['--cl-x' as string]: x,
    ['--cl-y' as string]: y,
    ['--cl-color' as string]: color,
    ['--cl-on' as string]: onColor,
  } as React.CSSProperties

  const inner = (
    <>
      <span className="circle-link__disc" aria-hidden="true" />
      <span className="circle-link__label">{children}</span>
      {/* the same words again, in the disc's contrast colour, clipped to the disc */}
      <span className="circle-link__label circle-link__label--on" aria-hidden="true">
        {children}
      </span>
    </>
  )

  const props = {
    className: `circle-link ${always ? 'is-on' : ''} ${className}`,
    style,
    onClick,
  }

  if (to) return <Link to={to} {...props}>{inner}</Link>
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {inner}
      </a>
    )
  }
  return <button type="button" {...props}>{inner}</button>
}
