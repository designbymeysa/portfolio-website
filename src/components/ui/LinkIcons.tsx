/** The two arrows used across the site, drawn to one spec — 24-unit box, 2px round
 *  stroke, currentColor — so a "goes onward" arrow and a "leaves the page" arrow read
 *  as the same family rather than one being a glyph from the typeface. */

const SHARED = {
  'aria-hidden': true as const,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** onward — follows a label into the thing it names */
export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  )
}

/** back — the onward arrow, reflected */
export function BackIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <line x1="20" y1="12" x2="5" y2="12" />
      <polyline points="11 6 5 12 11 18" />
    </svg>
  )
}

/** up — the onward arrow turned a quarter left: returns to the top */
export function UpIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <line x1="12" y1="20" x2="12" y2="5" />
      <polyline points="6 11 12 5 18 11" />
    </svg>
  )
}

/** either way — the onward arrow and its reflection on one line: something slides */
export function SlideIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
    </svg>
  )
}

/** open — a chevron for anything that folds out; rotate it to close */
export function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/** away — the same stroke, turned out of the corner: opens elsewhere */
export function LeaveIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...SHARED} className={`h-[13px] w-[13px] shrink-0 ${className}`}>
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="9 5 19 5 19 15" />
    </svg>
  )
}
