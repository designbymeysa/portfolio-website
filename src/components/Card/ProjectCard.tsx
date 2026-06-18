import { useState, useRef } from 'react'
import { Tag } from '../Tag/Tag'
import { TextCTA } from '../Button/TextCTA'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  year?: string
  href?: string
  imageBg?: string
}

export function ProjectCard({ title, description, tags, year, href = '#', imageBg }: ProjectCardProps) {
  const [pill, setPill] = useState({ visible: false, x: 0, y: 0 })
  const cardRef = useRef<HTMLElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setPill({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  function handleMouseLeave() {
    setPill((p) => ({ ...p, visible: false }))
  }

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        w-full rounded-[16px] bg-white overflow-hidden
        flex flex-row relative
        transition-shadow duration-medium ease-standard
        hover:shadow-md
      "
      style={{ minHeight: '240px' }}
    >
      {pill.visible && (
        <div
          className="pointer-events-none absolute z-50 flex items-center justify-center"
          style={{
            left: pill.x,
            top: pill.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span
            className="bg-primary text-white font-sans font-semibold text-[12px] tracking-widest uppercase px-4 py-2 rounded-full select-none shadow-md"
            style={{ letterSpacing: '0.15em' }}
          >
            VIEW
          </span>
        </div>
      )}

      {imageBg && (
        <div
          className="w-[320px] shrink-0"
          style={{ background: imageBg }}
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col justify-between p-xl flex-1">
        <div>
          <div className="flex items-center gap-sm mb-md">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <h3 className="font-display text-display-title text-primary mb-sm">{title}</h3>
          <p className="font-sans text-body text-ink-600 max-w-[480px]">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-xl">
          <TextCTA label="View project" href={href} />
          {year && (
            <span className="font-sans text-body-sm text-ink-400">{year}</span>
          )}
        </div>
      </div>
    </article>
  )
}
