import { useEffect, useState } from 'react'

/** Whether a media query currently matches, kept live as the viewport changes. For the
 *  few layouts that have to be decided in markup rather than CSS — splitting a list
 *  into columns, say, where the split itself depends on the width. */
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}
