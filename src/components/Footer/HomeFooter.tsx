import { useInView } from '../../hooks/useInView'
import { LeaveIcon } from '../ui/LinkIcons'
import type React from 'react'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/khoshbazan/', download: false },
  // opens on Drive rather than downloading, so it is a new tab, not a file
  { label: 'CV', href: 'https://drive.google.com/file/d/1_N65Jsf7chdvHpVkT5p1fiKGRQNrqK0J/view?usp=sharing', download: false },
]

// the closing purple lives in CSS now (--footer-purple), so it can sit deeper in dark
// mode; Layout reads the same token when it interpolates the wash

// every link in the footer reads the same — the email is just another one of them.
// The underline lives on the label rather than the anchor, so on the links that carry
// an icon it runs under the words only.
const LINK_CLASS = "group/link inline-flex items-center gap-[6px] font-['Open_Sans'] font-normal text-[14px] sm:text-[15px] text-white/80 hover:text-white transition-colors duration-[150ms]"
const LINK_TEXT = "relative inline-block after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover/link:after:scale-x-100"

export function HomeFooter() {
  const { ref, inView } = useInView()

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      data-cursor="plain"
      className={`relative z-30 overflow-hidden ${inView ? 'section-visible' : 'section-hidden'}`}
    >
      {/* The ground is a layer of its own rather than the footer's background, so its
          top can fade without taking the content with it. The fade ends exactly where
          the top padding does — every text run still lands on solid colour. */}
      <div
        aria-hidden="true"
        className="footer-ground absolute inset-0 -z-10"
        style={{ background: 'var(--footer-purple)' }}
      />
      <div className="reveal-stagger relative flex flex-col min-h-[100vh] max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[var(--section-gap)] pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-[calc(32px+env(safe-area-inset-bottom))]">

        {/* the line itself — two copies drifting left on a loop, so it never runs out */}
        <h2 className="sr-only">Let&apos;s keep in touch</h2>
        {/* the line leads the footer; the slack falls below the info under it */}
        <div className="mt-auto py-[14px] mb-[clamp(28px,4vw,48px)] -mx-6 sm:-mx-10 lg:-mx-[80px] overflow-hidden" aria-hidden="true">
          <div className="footer-marquee flex w-max">
            {[0, 1].map(i => (
              <span
                key={i}
                className="font-['Libre_Caslon_Text'] font-normal text-white leading-[0.95] tracking-[-0.015em] whitespace-nowrap pr-[0.28em]"
                /* Libre Caslon Text ships only 400 and 700 — a hairline stroke on the
                   400 thickens the stems into the medium that sits between them */
                style={{ fontSize: 'clamp(92px, 13.2vw, 260px)', WebkitTextStroke: '0.005em currentColor' }}
              >
                Let&apos;s keep in touch
              </span>
            ))}
          </div>
        </div>

        {/* the direct line on the left, the elsewheres on the right */}
        <div className="flex flex-col gap-[24px] sm:flex-row sm:items-baseline sm:justify-between">
          <a
            href="mailto:designbymeysa@gmail.com"
            className={LINK_CLASS}
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            <span className={LINK_TEXT}>designbymeysa@gmail.com</span>
          </a>

          <div className="flex items-center gap-[40px]">
            {links.map(({ label, href, download }) => (
              <a
                key={label}
                href={href}
                {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                className={LINK_CLASS}
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <span className={LINK_TEXT}>{label}</span>
                <LeaveIcon className="h-[13px] w-[13px] opacity-0 transition-opacity duration-[200ms] group-hover/link:opacity-100" />
                <span className="sr-only">
                  {download ? '(downloads a file)' : '(opens in a new tab)'}
                </span>
              </a>
            ))}
          </div>
        </div>
        {/* bottom meta, under a rule of its own */}
        <div className="mt-[36px] pt-[20px] border-t border-white/20 flex items-center justify-between">
          <p className="font-['Open_Sans'] text-[13px] text-white/70 leading-[1.2]">
            Designed &amp; built with care by Meysa
          </p>
          <p className="font-['Open_Sans'] text-[13px] text-white/70 leading-[1.2]">
            ©2026
          </p>
        </div>
      </div>
    </footer>
  )
}
