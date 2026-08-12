import { useInView } from '../../hooks/useInView'
import type React from 'react'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fatemeh-khosh/', download: false },
  { label: 'Behance',  href: 'https://www.behance.net/designbymeysa',       download: false },
  { label: 'CV (PDF)', href: '/cv.pdf',                                      download: true  },
]

export function HomeFooter() {
  const { ref, inView } = useInView()

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      className={`relative ${inView ? 'section-visible' : 'section-hidden'}`}
      style={{ background: 'linear-gradient(180deg, rgba(92,110,255,0) 0%, rgba(123,118,245,0.28) 26%, rgba(110,107,240,0.7) 48%, #5C6EFF 70%, #4A34D6 100%)' }}
    >
      <div className="reveal-stagger relative flex flex-col min-h-[560px] lg:min-h-[640px] max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[150px] lg:pt-[190px] pb-[32px]">

        {/* top — heading + email */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[80px]">

          {/* left */}
          <div>
            <h2
              className="font-['Libre_Caslon_Text'] font-normal text-white leading-[1.05] tracking-[-0.02em] mb-[28px]"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Let&apos;s keep in touch!
            </h2>

            <p
              className="font-['Open_Sans'] font-normal text-[17px] text-white/75 leading-[1.5] max-w-[420px] mb-[56px]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Currently open to full-time product design roles in Italy.
              Happy to chat in English or Italian.
            </p>

            <div className="flex items-center gap-[40px]">
              {links.map(({ label, href, download }) => (
                <a
                  key={label}
                  href={href}
                  {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="relative inline-block font-['Open_Sans'] font-normal text-[16px] text-[#f6f7f9] hover:text-[#9aa6ff] transition-colors duration-[150ms] after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* right — email */}
          <div className="lg:text-right">
            <a
              href="mailto:designbymeysa@gmail.com"
              className="font-['Libre_Caslon_Text'] font-normal text-white leading-[1.1] break-all md:break-normal border-b border-white/25 hover:border-white transition-colors duration-[250ms]"
              style={{ fontSize: 'clamp(26px, 3.4vw, 48px)' }}
            >
              designbymeysa@gmail.com
            </a>
          </div>
        </div>

        {/* bottom meta */}
        <div className="flex items-center justify-between pt-[28px] mt-auto border-t border-white/20">
          <p className="font-['Open_Sans'] text-[14px] text-white/60 leading-[1.2]">
            Designed and built by Meysa · Milan, Italy
          </p>
          <p className="font-['Open_Sans'] text-[14px] text-white/60 leading-[1.2]">
            ©2026
          </p>
        </div>
      </div>
    </footer>
  )
}
