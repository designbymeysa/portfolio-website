import { WellbeingLoop } from './WellbeingLoop'
import { WellbeingRadar } from './WellbeingRadar'

/** Covers that are drawn rather than photographed. A project opts in by naming one in
 *  `cover` in content/projects.json; anything not listed here falls back to `image`.
 *  Keeping the lookup here means the content file stays plain data — a key, not code. */
export const COVERS: Record<string, (props: { className?: string; bare?: boolean }) => JSX.Element> = {
  'wellbeing-loop': WellbeingLoop,
  'wellbeing-radar': WellbeingRadar,
}

export function coverFor(key?: string) {
  return key ? COVERS[key] : undefined
}
