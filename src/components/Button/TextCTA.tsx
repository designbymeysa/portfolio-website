import { AnchorHTMLAttributes } from 'react'

interface TextCTAProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
}

export function TextCTA({ label, className = '', ...props }: TextCTAProps) {
  return (
    <a
      className={`
        inline-flex items-center gap-1
        font-sans text-ui-button text-primary
        underline underline-offset-2
        transition-opacity duration-medium ease-standard
        hover:opacity-60
        ${className}
      `}
      {...props}
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  )
}
