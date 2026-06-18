import { useRef, useState } from 'react'
import { projects } from '../data/projects'
import { useInView } from '../hooks/useInView'
import type React from 'react'

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-[#f6f7f9] border border-[#eceef2] font-['Open_Sans'] font-normal text-[12px] text-[#6b6f7a] uppercase tracking-[0.7px] whitespace-nowrap"
      style={{ fontVariationSettings: '"wdth" 100' }}>
      {label}
    </span>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`group flex flex-col ${inView ? 'section-visible' : 'section-hidden'}`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* image area */}
      <div
        ref={imageRef}
        className="w-full rounded-[8px] overflow-hidden mb-[24px] relative"
        style={{ aspectRatio: '4/3', background: project.bg, cursor: pill.visible ? 'none' : 'default' }}
        onMouseMove={e => {
          const rect = imageRef.current?.getBoundingClientRect()
          if (!rect) return
          setPill({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setPill(p => ({ ...p, visible: false }))}
      >
        {pill.visible && (
          <div
            className="pointer-events-none absolute z-50"
            style={{ left: pill.x, top: pill.y, transform: 'translate(-50%, -50%)' }}
          >
            <span className="bg-[#1c1c1e] text-white font-['Open_Sans'] font-semibold text-[12px] uppercase tracking-[0.15em] px-4 py-2 rounded-full select-none shadow-md">
              VIEW
            </span>
          </div>
        )}
        <a
          href={project.href}
          className="absolute bottom-[16px] right-[16px] w-[40px] h-[40px] bg-[#0e1014] rounded-[8px] flex items-center justify-center text-white text-[16px] leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
        >
          ↗
        </a>
      </div>

      {/* meta */}
      <div className="flex items-center justify-between mb-[12px]">
        <div className="flex items-center gap-[8px] flex-wrap">
          {project.tags.map(tag => <Tag key={tag} label={tag} />)}
        </div>
        <span className="font-['Open_Sans'] text-[12px] text-[#8a8f9b]">{project.year}</span>
      </div>

      {/* title */}
      <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-black leading-[1.2] tracking-[-0.5px] mb-[12px]">
        {project.title}
      </h2>

      {/* description */}
      <p className="font-['Open_Sans'] font-light text-[14px] text-[#4b4f58] leading-[22px] mb-[16px] flex-1"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-['Open_Sans'] text-[12px] text-[#8a8f9b] uppercase tracking-[0.08em]">
          {project.role}
        </span>
        <a
          href={project.href}
          className="font-['Open_Sans'] font-semibold text-[16px] text-[#0f0f0f] border-b border-[#4e34fa] pb-[2px] hover:opacity-60 transition-opacity duration-[150ms]"
        >
          View case study →
        </a>
      </div>
    </article>
  )
}

export default function AllProjects() {
  const { ref, inView } = useInView(0.05)

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[96px] pb-[80px] lg:pb-[128px]">

        {/* header */}
        <section
          ref={ref as React.RefObject<HTMLElement>}
          className={`mb-[96px] ${inView ? 'section-visible' : 'section-hidden'}`}
        >
          <span className="font-['Open_Sans'] text-[12px] text-[#737373] uppercase tracking-[0.08em] block mb-[16px]">
            ALL WORKS
          </span>
          <h1
            className="font-['Libre_Caslon_Text'] font-normal text-black leading-[1.1] max-w-[720px]"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)', letterSpacing: '-0.02em' }}
          >
            Every project, every story.
          </h1>
        </section>

        {/* filter row */}
        <div className="flex items-center gap-[8px] mb-[64px] flex-wrap">
          {['All', 'UX Research', 'UI Design', 'Branding', 'Design Systems', 'Fintech', 'Healthcare'].map((f, i) => (
            <button
              key={f}
              className={`h-8 px-4 rounded-full font-['Open_Sans'] font-normal text-[12px] uppercase tracking-[0.7px] transition-colors duration-[150ms] border ${
                i === 0
                  ? 'bg-[#1a1c22] text-white border-[#1a1c22]'
                  : 'bg-transparent text-[#6b6f7a] border-[#eceef2] hover:border-[#1a1c22] hover:text-[#1a1c22]'
              }`}
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[48px] gap-y-[80px]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </main>
    </div>
  )
}
