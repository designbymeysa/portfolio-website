const skills = [
  'Interaction Design', 'Visual Design', 'Branding',
  'UI Design', 'UX Research', 'Prototyping', 'Design Systems',
]

export function SkillsTicker() {
  const doubled = [...skills, ...skills]

  return (
    <div className="w-full h-16 bg-[#1a1a1a] overflow-hidden flex items-center">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-[53px] px-[53px]">
            <span className="font-['Open_Sans'] font-normal text-[17px] text-[#f6f7f9] leading-[1.2]"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              {skill}
            </span>
            <span className="text-[#f6f7f9] text-[17px]" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
