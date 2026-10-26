import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import site from './src/content/site.json'
import projectData from './src/content/projects.json'

const { seo } = site
const projects = (projectData as { id: string; title: string; description: string; href: string; hidden?: boolean }[])
  .filter(p => !p.hidden)

interface PageMeta { path: string; title: string; description: string; image: string }

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function headTags({ path: url, title, description, image }: PageMeta): string {
  const href = `${seo.url}${url}`
  const img = `${seo.url}${image}`
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${href}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escape(seo.siteName)}" />`,
    `<meta property="og:url" content="${href}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join('\n    ')
}

const home: PageMeta = { path: '/', title: seo.homeTitle, description: seo.description, image: seo.image }

/** Every page this site has, with what a link preview should say about it. A case study
 *  without its own image in public/og falls back to the site's. */
const pages: PageMeta[] = [
  home,
  { path: '/projects', title: `${site.workPage.heading} | ${seo.siteName}`, description: seo.description, image: seo.image },
  ...projects.map(p => ({
    path: p.href,
    title: p.title,
    description: p.description,
    image: fs.existsSync(`public/og/${p.id}.png`) ? `/og/${p.id}.png` : seo.image,
  })),
]

/** The site is one page that React fills in, but the crawlers behind LinkedIn, Slack
 *  and search engines read the HTML as served and never run it. So each route gets its
 *  own copy of index.html with its own tags — projects/demos.html for /projects/demos,
 *  which Netlify serves ahead of the catch-all in _redirects — plus a sitemap. */
function seoPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    configResolved(config) { outDir = config.build.outDir },
    transformIndexHtml: html => html.replace('<!--seo-->', headTags(home)),
    closeBundle() {
      const index = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const homeTags = headTags(home)
      for (const page of pages.slice(1)) {
        const file = path.join(outDir, `${page.path}.html`)
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, index.replace(homeTags, headTags(page)))
      }
      const urls = pages.map(p => `  <url><loc>${seo.url}${p.path}</loc></url>`).join('\n')
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${seo.url}/sitemap.xml\n`)
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPages()],
})
