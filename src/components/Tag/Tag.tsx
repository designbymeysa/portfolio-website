interface TagProps {
  label: string
  className?: string
  /** `compact` holds 12px at every width, for rows that have to stay on one line in a
   *  narrow card; the default grows to 13px on a desktop */
  size?: 'default' | 'compact'
}

const SIZES = {
  default: 'h-6 lg:h-7 px-2.5 text-[12px] lg:text-[13px]',
  compact: 'h-6 px-2 text-[12px]',
}

/** The one tag chip used across the site — home cards, the projects grid, anywhere else. */
export function Tag({ label, className = '', size = 'default' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${SIZES[size]} shrink-0 rounded-full bg-transparent border border-[color:var(--line)] font-heading font-normal text-[color:var(--ink-muted)] uppercase tracking-[0.7px] whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  )
}
