interface TagProps {
  label: string
  className?: string
}

/** The one tag chip used across the site — home cards, the projects grid, anywhere else. */
export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center justify-center h-6 px-2 shrink-0 rounded-full bg-transparent border border-[color:var(--line)] font-heading font-normal text-[11px] text-[color:var(--ink-muted)] uppercase tracking-[0.7px] whitespace-nowrap ${className}`}
      style={{ fontVariationSettings: '"wdth" 100' }}
    >
      {label}
    </span>
  )
}
