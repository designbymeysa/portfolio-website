import { useEffect } from 'react'
import site from '../content/site.json'

/** The tab title and description for the page in view. The build writes the same tags
 *  into a static copy of each page for link previews (see vite.config.ts), since the
 *  crawlers behind LinkedIn and Slack never run this; this keeps them right in the tab
 *  and for anyone moving around the site. The title is used as given; without one the
 *  site's own is used. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ?? site.seo.homeTitle
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description ?? site.seo.description)
  }, [title, description])
}
