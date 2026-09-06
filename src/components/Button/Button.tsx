import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'icon-arrow'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  label?: string
}

export function Button({ variant = 'primary', label, children, className = '', ...props }: ButtonProps) {
  if (variant === 'icon-arrow') {
    return (
      <button
        className={`
          inline-flex items-center justify-center
          w-8 h-8 rounded-full
          border border-[color:var(--ink-strong)] text-[color:var(--ink-strong)]
          transition-all duration-medium ease-standard
          hover:bg-[color:var(--btn-bg)] hover:text-[color:var(--btn-fg)] hover:border-[color:var(--btn-bg)]
          ${className}
        `}
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }

  const base = `
    inline-flex items-center justify-center origin-center will-change-transform
    h-10 px-lg rounded-full
    font-sans text-ui-button
    transition-all duration-medium ease-standard
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
  `

  // no hover grey and no shrink: the cursor is the feedback now
  const variants: Record<'primary' | 'secondary', string> = {
    primary:   'bg-[color:var(--btn-bg)] text-[color:var(--btn-fg)]',
    secondary: 'bg-transparent text-[color:var(--ink-strong)] border border-[color:var(--btn-bg)] hover:bg-[color:var(--btn-bg)] hover:text-[color:var(--btn-fg)]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {label ?? children}
    </button>
  )
}
