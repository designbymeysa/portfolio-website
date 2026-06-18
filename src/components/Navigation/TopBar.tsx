interface NavLink {
  label: string
  href: string
}

interface TopBarProps {
  links?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { label: 'Work',    href: '#work' },
  { label: 'About',  href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function TopBar({ links = defaultLinks }: TopBarProps) {
  return (
    <nav className="w-full h-14 bg-surface-base border-b border-ink-100 flex items-center px-12">
      <div className="flex-1 flex items-center justify-between max-w-[1280px] mx-auto w-full">
        <span className="font-sans text-ui-logo text-primary uppercase tracking-[2px]">
          DESIGNBYMEYSA
        </span>
        <ul className="flex items-center gap-xl list-none">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-sans text-body text-ink-600 hover:text-primary transition-colors duration-short ease-standard"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
