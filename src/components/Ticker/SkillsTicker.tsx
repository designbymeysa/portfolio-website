const skills = [
  'UX Design', 'UI Design', 'User Research',
  'Prototyping', 'Design Systems', 'Branding',
]

export function SkillsTicker() {
  const doubled = [...skills, ...skills]

  return (
    <div className="w-full overflow-hidden py-[40px]">
      <div className="flex w-max animate-ticker">
        {doubled.map((skill, i) => (
          <div key={i} className="flex items-center gap-[28px] px-[28px] shrink-0">
            <span
              className="font-['Open_Sans'] font-normal text-[18px] text-[#2f323a] whitespace-nowrap leading-[1.2]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {skill}
            </span>
            <span className="font-['Open_Sans'] italic text-[12px] text-[#c7ccd6] shrink-0" aria-hidden="true">&amp;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
