import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from '../../hooks/useInView'
import Stack from '../Stack/Stack'
import { SkillsTicker } from '../Ticker/SkillsTicker'
import type React from 'react'

const EXPERIENCE = [
  { role: 'Design Intern',      note: 'Biotechnology Research',      org: 'Empatica',                      period: '2025 — Present', logo: '/logos/empatica_logo.jpeg' },
  { role: 'Research Assistant', note: 'Sustainable design research', org: 'LeNS Lab, Politecnico di Milano', period: '2024',           logo: '/logos/lenslab_polimi_logo.jpeg' },
  { role: 'Digital and Interaction Design', note: "Master's degree",   org: 'Politecnico di Milano',         period: '2023 — 2025',    logo: '/logos/polimi_logo.jpeg' },
]

// Photos for the About stack — drop your images in public/about/ with these names.
// Add or remove entries here to match how many photos you have.
const photos = [
  '/about/photo_1.png',
  '/about/photo_2.png',
  '/about/photo_3.png',
]

const photoCards = photos.map((src, i) => (
  <img
    key={src}
    src={src}
    alt={`Meysa — photo ${i + 1}`}
    className="w-full h-full object-cover"
    draggable={false}
  />
))

export function AboutSection() {
  const { ref, inView } = useInView()
  const [cursorLogo, setCursorLogo] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="about"
      className={`pt-[80px] pb-[96px] ${inView ? 'section-visible' : 'section-hidden'}`}
    >
      {cursorLogo && createPortal(
        <img
          src={cursorLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-[9999] hidden md:block h-[48px] w-[48px] object-cover rounded-[12px] -translate-x-1/2 -translate-y-1/2"
          style={{ left: cursorPos.x, top: cursorPos.y }}
          draggable={false}
        />,
        document.body
      )}

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
        <SkillsTicker />
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
                onMouseEnter={() => setCursorLogo(e.logo)}
                onMouseLeave={() => setCursorLogo(null)}
                onMouseMove={(ev) => setCursorPos({ x: ev.clientX, y: ev.clientY })}
                className="group grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-x-[20px] gap-y-[8px] md:gap-x-[40px] items-center md:items-baseline py-[28px] px-[16px] rounded-none border-b border-[#e5e7ec] transition-colors duration-[200ms] hover:bg-[#f3f4f6] md:hover:cursor-none"
              >
                <div className="flex flex-col gap-[6px]">
                  <span className="font-['Open_Sans'] font-semibold text-[20px] text-[#0f0f0f] leading-[1.2] transition-colors duration-[200ms] group-hover:text-[#4b4f58]" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {e.role}
                  </span>
                  <span className="font-['Open_Sans'] font-normal text-[16px] text-[#4b4f58] transition-colors duration-[200ms] group-hover:text-[#6b6f7a]" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {e.org}
                  </span>
                </div>
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
