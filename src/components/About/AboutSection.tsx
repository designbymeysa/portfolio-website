import { useInView } from '../../hooks/useInView'
import Stack from '../Stack/Stack'
import { AppsTicker } from '../Ticker/AppsTicker'
import type React from 'react'

const EXPERIENCE = [
  { role: 'Design Intern',      note: 'Wearable health devices',    org: 'Empatica · Milan',              period: '2025 — Present', logo: '/logos/empatica.svg' },
  { role: 'Research Assistant', note: 'Sustainable design research', org: 'LeNS Lab, Politecnico di Milano', period: '2024 — 2025',    logo: '/logos/polimi.svg' },
  { role: 'MSc in Design',      note: "Master's degree",            org: 'Politecnico di Milano',         period: '2023 — 2025',    logo: '/logos/polimi.svg' },
]

const photoCards = [
  <div key="back" className="w-full h-full bg-[#c6caf6]" />,
  <div key="front" className="w-full h-full bg-[#eceef2] flex items-center justify-center">
    <span className="font-['Open_Sans'] text-[12px] text-[#9ca1ad] uppercase tracking-[0.2em]">
      Your Photo
    </span>
  </div>,
]

export function AboutSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="about"
      className={`pt-[80px] pb-[96px] ${inView ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">

        {/* ── ABOUT — intro + photo ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-[56px] lg:gap-[96px]">
          <div className="flex-1">
            <span
              className="font-['Open_Sans'] font-semibold text-[12px] text-[#9ca1ad] uppercase tracking-[0.22em] block mb-[20px]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              About
            </span>

            <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-[#0f0f0f] leading-[1.2] tracking-[-0.8px] mb-[32px]">
              A Few Things About Me
            </h2>

            <div className="flex flex-col gap-[24px] max-w-[520px]">
              <p
                className="font-['Open_Sans'] font-light text-[17px] text-[#4b4f58] leading-[1.6]"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                I&apos;m a product designer based in Milan with an MSc in Design from
                Politecnico di Milano. My work sits at the intersection of design and
                health — making complex tools feel approachable for the people who
                depend on them.
              </p>
              <p
                className="font-['Open_Sans'] font-light text-[17px] text-[#4b4f58] leading-[1.6]"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Right now I&apos;m at Empatica designing for wearable health devices,
                working across research, UX, and UI. Before that, I researched
                sustainable design practices at LeNS Lab.
              </p>
            </div>
          </div>

          {/* stacked photo card */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end">
            <div className="w-[320px] h-[400px] sm:w-[360px] sm:h-[450px]">
              <Stack randomRotation sensitivity={140} sendToBackOnClick mobileClickOnly cards={photoCards} />
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLS — apps I work with ─────────────────────────── */}
      <div className="mt-[112px] lg:mt-[160px]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">
          <span
            className="font-['Open_Sans'] font-semibold text-[12px] text-[#9ca1ad] uppercase tracking-[0.22em] block mb-[24px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Skills
          </span>
        </div>
        <AppsTicker />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">

        {/* ── EXPERIENCE — where I've worked ───────────────────── */}
        <div className="mt-[56px] lg:mt-[80px]">
          <span
            className="font-['Open_Sans'] font-semibold text-[12px] text-[#9ca1ad] uppercase tracking-[0.22em] block mb-[20px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Experience
          </span>

          <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-[#0f0f0f] leading-[1.2] tracking-[-0.8px] mb-[40px]">
            Journey so far
          </h2>

          <div className="border-t border-[#e5e7ec]">
            {EXPERIENCE.map((e) => (
              <div
                key={e.role}
                className="group grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_0.8fr] gap-y-[8px] md:gap-x-[40px] items-baseline py-[28px] px-[16px] rounded-[2px] border-b border-[#e5e7ec] transition-colors duration-[200ms] hover:bg-[#F1F0F6]"
              >
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[14px]">
                    <span className="font-['Open_Sans'] font-semibold text-[20px] text-[#0f0f0f] leading-[1.2] transition-colors duration-[200ms] group-hover:text-[#422bd9]" style={{ fontVariationSettings: '"wdth" 100' }}>
                      {e.role}
                    </span>
                    <img
                      src={e.logo}
                      alt={e.org}
                      className="h-[26px] w-auto max-w-[120px] object-contain opacity-0 -translate-x-2 transition-all duration-[200ms] group-hover:opacity-100 group-hover:translate-x-0"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <span className="font-['Open_Sans'] font-light text-[15px] text-[#9ca1ad]" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {e.note}
                  </span>
                </div>
                <span className="font-['Open_Sans'] font-normal text-[16px] text-[#4b4f58] transition-colors duration-[200ms] group-hover:text-[#422bd9]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  {e.org}
                </span>
                <span className="font-['Open_Sans'] font-normal text-[14px] text-[#9ca1ad] md:text-right transition-colors duration-[200ms] group-hover:text-[#6b6f7a]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  {e.period}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
