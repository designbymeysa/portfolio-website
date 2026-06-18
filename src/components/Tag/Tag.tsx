interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-md- py-[3px] rounded-xsmall
        bg-tag-bg text-tag-text
        font-sans text-[12px] uppercase tracking-widest
        ${className}
      `}
    >
      {label}
    </span>
  )
}
