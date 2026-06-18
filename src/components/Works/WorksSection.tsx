import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../../hooks/useInView'
import { projects as allProjects } from '../../data/projects'
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack'
import type React from 'react'

const featured = allProjects.slice(0, 3)

function TagDimmed({ label }: { label: string }) {
  return (
    <div className="bg-[#f6f7f9] border border-[#eceef2] flex items-center justify-center px-2 py-1 rounded-full h-6 shrink-0">
      <span
        className="font-['Open_Sans'] font-normal text-[12px] text-[#6b6f7a] tracking-[0.7px] uppercase whitespace-nowrap"
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        {label}
      </span>
    </div>
  )
}

function WorkCard({ project }: { project: typeof allProjects[0] }) {
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })
  const innerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={innerRef}
      className="bg-[#F6F7F9] flex flex-col md:flex-row md:items-center overflow-hidden rounded-[16px] w-full relative shadow-[0_4px_24px_rgba(0,0,0,0.07)] h-auto md:h-[480px]"
      style={{ cursor: pill.visible ? 'none' : 'default' }}
      onMouseMove={e => {
        const rect = innerRef.current?.getBoundingClientRect()
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
          <span className="bg-[#1c1c1e] text-white font-['Open_Sans'] font-semibold text-[12px] uppercase tracking-[0.18em] inline-flex items-center justify-center px-6 py-3 rounded-full select-none shadow-lg whitespace-nowrap">
            VIEW
          </span>
        </div>
      )}

      {/* image */}
      <div
        className="relative flex-shrink-0 w-full h-[220px] md:w-1/2 md:h-full border-b md:border-b-0 md:border-r border-[#dcdfe5]"
        style={{ background: '#e0d1cc' }}
      />

      {/* text */}
      <Link
        to={project.href}
        className="group flex flex-col justify-between flex-1 no-underline px-6 py-8 md:px-[48px] md:py-[48px] h-full"
        style={{ cursor: 'inherit' }}
      >
        <div className="flex flex-col gap-[16px]">
          {project.subtitle && (
            <p className="font-['Open_Sans'] font-normal text-[12px] text-[#8a8f9b] uppercase tracking-[0.12em]"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              {project.subtitle}
            </p>
          )}
          <p className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-black leading-[1.2] tracking-[-0.8px]">
            {project.title}
          </p>
          <p className="font-['Open_Sans'] font-light text-[16px] text-[#4b4f58] leading-[26px]"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[8px] flex-wrap">
            {project.tags.map(tag => <TagDimmed key={tag} label={tag} />)}
          </div>
          <div className="w-fit">
            <span className="relative inline-block font-['Open_Sans'] font-semibold text-[16px] text-[#0f0f0f] group-hover:text-[#422bd9] transition-colors duration-[150ms] after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
              View project →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function WorksSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="work"
      className={`pt-[80px] ${inView ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px]">

        {/* header */}
        <div className="flex items-center justify-between mb-[20px]">
          <span className="font-['Open_Sans'] text-[12px] text-[#737373] uppercase tracking-[0.08em]"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            PROJECTS
          </span>
          <Link
            to="/projects"
            className="font-['Open_Sans'] text-[12px] text-[#737373] uppercase tracking-[0.08em] flex items-center gap-1 hover:text-[#422bd9] transition-colors duration-[150ms]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            VIEW ALL →
          </Link>
        </div>

        <h2 className="font-['Libre_Caslon_Text'] font-normal text-[32px] text-black leading-[1.2] tracking-[-0.8px] mb-[64px]">
          Selected Case Studies
        </h2>

        <ScrollStack
          useWindowScroll
          className="works-scroll-stack"
          itemDistance={180}
          baseScale={0.96}
          itemScale={0.015}
          itemStackDistance={20}
          stackPosition="22%"
          scaleEndPosition="8%"
        >
          {featured.map(project => (
            <ScrollStackItem key={project.id}>
              <WorkCard project={project} />
            </ScrollStackItem>
          ))}
        </ScrollStack>

      </div>
    </section>
  )
}
