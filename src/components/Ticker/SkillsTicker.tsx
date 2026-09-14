import about from '../../content/about.json'

const skills = about.skills.items

// The loop translates the track by -50%, so it only tiles seamlessly while one half is
// at least as wide as the viewport — otherwise blank ground opens at the end of the run
// and snaps. Six short words are roughly 1150px, which ran out on any desktop; each half
// repeats the list REPS times to cover a wide screen.
const REPS = 3

// -50% of a REPS-long half covers REPS times the distance, so the duration scales with
// it — otherwise widening the track would silently multiply the speed. 30s per copy is
// the pace this row was set to.
const SECONDS_PER_COPY = 30

export function SkillsTicker() {
  const half = Array.from({ length: REPS }, () => skills).flat()
  const doubled = [...half, ...half]

  return (
    <div className="w-full overflow-hidden py-[40px]">
      <div
        className="flex w-max animate-ticker"
        style={{ animationDuration: `${REPS * SECONDS_PER_COPY}s` }}
      >
        {doubled.map((skill, i) => (
          <div key={i} className="flex items-center gap-[28px] px-[28px] shrink-0">
            <span
              className="font-['Open_Sans'] font-normal text-[18px] text-[color:var(--ink-strong)] whitespace-nowrap leading-[1.2]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {skill}
            </span>
            <span className="font-['Open_Sans'] italic text-[12px] text-[color:var(--ink-muted)] shrink-0" aria-hidden="true">&amp;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
