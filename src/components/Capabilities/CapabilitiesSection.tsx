import Gravity, { MatterBody } from '../fancy/physics/gravity'
import { useInView } from '../../hooks/useInView'
import type React from 'react'

const capabilities = [
  { label: 'UX Research',        bg: '#3D52FF', color: '#fff'    },
  { label: 'UI Design',          bg: '#5B3FD4', color: '#fff'    },
  { label: 'Product Design',     bg: '#7B5CF5', color: '#fff'    },
  { label: 'Branding',           bg: '#C4B5FD', color: '#1a1c22' },
  { label: 'Interaction Design', bg: '#1F30B8', color: '#fff'    },
  { label: 'Prototyping',        bg: '#8694FF', color: '#1a1c22' },
  { label: 'Design Systems',     bg: '#B5BEFF', color: '#1a1c22' },
  { label: 'Visual Design',      bg: '#E8DDD7', color: '#1a1c22' },
  { label: 'User Testing',       bg: '#2A3FE6', color: '#fff'    },
  { label: 'Figma',              bg: '#111A5C', color: '#C4B5FD' },
]

// stagger starting positions so they all fall at different times
const positions = [
  { x: '8%',  y: '-5%'  },
  { x: '22%', y: '-15%' },
  { x: '38%', y: '-8%'  },
  { x: '52%', y: '-18%' },
  { x: '67%', y: '-6%'  },
  { x: '80%', y: '-12%' },
  { x: '15%', y: '-25%' },
  { x: '45%', y: '-28%' },
  { x: '61%', y: '-22%' },
  { x: '30%', y: '-20%' },
]

export function CapabilitiesSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative overflow-hidden ${inView ? 'section-visible' : 'section-hidden'}`}
      style={{
        background: 'linear-gradient(180deg, #F6F4FE 0%, #FBF6F4 100%)',
      }}
    >
      {/* grid overlay matching hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180,170,230,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,170,230,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[80px] lg:pt-[128px]">
        <span className="font-['Open_Sans'] text-[12px] text-[#737373] uppercase tracking-[0.08em] block mb-[16px]">
          CAPABILITIES
        </span>
        <p
          className="font-['Libre_Caslon_Text'] font-normal text-black leading-[1.1] mb-0"
          style={{ fontSize: 'clamp(32px, 4vw, 64px)', letterSpacing: '-0.02em' }}
        >
          What I bring to the table
        </p>
      </div>

      {/* only mount physics once section is visible so pills always drop fresh */}
      {inView && (
        <Gravity gravity={{ x: 0, y: 1.5 }} className="w-full" style={{ height: '480px' }}>
          {capabilities.map((cap, i) => (
            <MatterBody
              key={cap.label}
              x={positions[i].x}
              y={positions[i].y}
              matterBodyOptions={{ friction: 0.4, restitution: 0.4 }}
            >
              <div
                className="px-5 py-2 rounded-full font-['Open_Sans'] font-normal text-[12px] uppercase tracking-[0.08em] whitespace-nowrap cursor-grab active:cursor-grabbing select-none"
                style={{ background: cap.bg, color: cap.color, fontVariationSettings: '"wdth" 100' }}
              >
                {cap.label}
              </div>
            </MatterBody>
          ))}
        </Gravity>
      )}
    </section>
  )
}
