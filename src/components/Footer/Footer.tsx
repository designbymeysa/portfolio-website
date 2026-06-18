export function Footer() {
  return (
    <footer className="w-full bg-surface-footer text-ink-300" style={{ minHeight: '220px' }}>
      <div className="max-w-[1280px] mx-auto px-12 py-2xl flex flex-col justify-between h-full gap-xl">
        <div className="flex items-start justify-between">
          <span className="font-sans text-ui-logo text-ink-0 uppercase tracking-[2px]">
            DESIGNBYMEYSA
          </span>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-xl list-none">
              {['Work', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="font-sans text-body text-ink-400 hover:text-ink-0 transition-colors duration-short ease-standard"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-between border-t border-ink-700 pt-lg">
          <p className="font-sans text-body-sm text-ink-500">
            SELECTED WORKS · 2025 · Designed and built by Meysa
          </p>
          <p className="font-sans text-body-sm text-ink-500">
            v1.0 · 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
