import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { usePageMeta } from '../hooks/usePageMeta'
import { BackIcon } from '../components/ui/LinkIcons'
import site from '../content/site.json'
import type React from 'react'

const LINK =
  "group/link inline-flex items-center gap-[8px] font-['Open_Sans'] text-[16px] lg:text-[15px] text-[color:var(--ink-strong)] no-underline transition-opacity duration-[150ms] hover:opacity-70"

/** Anything the router does not recognise. Reached through the `*` route, which the
 *  `_redirects` rule feeds every unmatched path on the deployed site. */
export default function NotFound() {
  const { ref, inView } = useInView(0.05)
  usePageMeta(`Page not found | ${site.seo.siteName}`)

  return (
    <div className="min-h-screen bg-[color:var(--surface)] flex items-center">
      <main className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[80px] pt-[140px] pb-[var(--section-gap)]">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center ${inView ? 'section-visible' : 'section-hidden'}`}
        >
          {/* the number is the page, and it carries the accent on its own — the copy
              below it stays in ink so the colour has only one thing to say. --accent
              rather than --brand-purple: identical in light mode, but the brand value
              sits at 2.6:1 on the dark ground where the lifted hue reaches 8.3:1.

              Leading is pulled under 1 so three digits this size do not open a gap the
              height of a screen above and below them, and the weight drops to regular:
              at this size even the medium reads heavy. */}
          <h1
            className="font-heading font-normal text-[color:var(--accent)] select-none"
            style={{
              fontSize: 'clamp(130px, 26vw, 360px)',
              lineHeight: '0.8',
              letterSpacing: '-0.03em',
            }}
          >
            {site.notFound.code}
          </h1>

          <p
            className="font-heading font-medium text-[color:var(--ink-strong)] leading-[1.2] mt-[48px] mb-[16px]"
            style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', letterSpacing: '-0.01em' }}
          >
            {site.notFound.heading}
          </p>

          <p
            className="font-['Open_Sans'] font-normal text-[16px] lg:text-[15px] text-[color:var(--ink-strong)] leading-[1.7] max-w-[520px] mx-auto mb-[36px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            {site.notFound.body}
          </p>

          <Link to="/" className={LINK} style={{ fontVariationSettings: '"wdth" 100' }}>
            <BackIcon className="transition-transform duration-[200ms] group-hover/link:-translate-x-[3px]" />
            {site.notFound.backLabel}
          </Link>
        </div>
      </main>
    </div>
  )
}
