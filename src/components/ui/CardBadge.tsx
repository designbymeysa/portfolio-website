import { ArrowIcon } from './LinkIcons'

/** The round mark in the corner of a project card: dark disc, arrow pointing on.
 *  Held at zero opacity until the card is hovered, focused, or — on a touch screen —
 *  lit by scrolling past it, so it reads as the card's affordance rather than chrome.
 *  Not a link itself: the whole card is the link. */
export function CardBadge({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`w-[40px] h-[40px] shrink-0 rounded-full bg-[color:var(--pill-bg)] text-[color:var(--pill-fg)] flex items-center justify-center opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-[250ms] ${className}`}
    >
      <ArrowIcon className="h-[16px] w-[16px]" />
    </span>
  )
}
