/** The small tracked capital that titles a section — PROJECTS, ABOUT, SKILLS,
 *  EXPERIENCE. One definition so every section's eyebrow is set identically. */
export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`block font-['Open_Sans'] font-semibold text-[12px] text-[color:var(--ink-muted)] uppercase tracking-[0.22em] ${className}`}
      style={{ fontVariationSettings: '"wdth" 100' }}
    >
      {children}
    </span>
  )
}
