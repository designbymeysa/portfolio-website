// Tools / apps marquee. Icons are served from the simple-icons CDN
// (https://cdn.simpleicons.org/<slug>/<hex>) so no local assets are needed.
const apps = [
  { name: 'Figma',          slug: 'figma',              color: 'F24E1E' },
  { name: 'Photoshop',      slug: 'adobephotoshop',     color: '31A8FF' },
  { name: 'Illustrator',    slug: 'adobeillustrator',   color: 'FF9A00' },
  { name: 'InDesign',       slug: 'adobeindesign',      color: 'FF3366' },
  { name: 'After Effects',  slug: 'adobeaftereffects',  color: '9999FF' },
  { name: 'Premiere Pro',   slug: 'adobepremierepro',   color: '9999FF' },
  { name: 'Creative Cloud', slug: 'adobecreativecloud', color: 'DA1F26' },
  { name: 'Framer',         slug: 'framer',             color: '0055FF' },
  { name: 'ProtoPie',       slug: 'protopie',           color: '24343C' },
  { name: 'Blender',        slug: 'blender',            color: 'E87D0D' },
  { name: 'Notion',         slug: 'notion',             color: '0F0F0F' },
  { name: 'Miro',           slug: 'miro',               color: 'FFC100' },
  { name: 'HTML',           slug: 'html5',              color: 'E34F26' },
  { name: 'CSS',            slug: 'css',                color: '663399' },
]

export function AppsTicker() {
  const doubled = [...apps, ...apps]

  return (
    <div className="w-full overflow-hidden py-[40px]">
      <div className="flex w-max animate-ticker">
        {doubled.map((app, i) => (
          <div key={i} className="flex items-center gap-[14px] px-[28px] shrink-0">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-[14px] bg-[#f6f7f9] border border-[#eceef2]">
              <img
                src={`https://cdn.simpleicons.org/${app.slug}/${app.color}`}
                alt={app.name}
                className="w-[26px] h-[26px]"
                loading="lazy"
                draggable={false}
              />
            </span>
            <span
              className="font-['Open_Sans'] font-normal text-[18px] text-[#2f323a] whitespace-nowrap"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {app.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
