# Content

Every word on the site lives in this folder. Edit these four files and the site
updates — you never need to open a `.tsx` file to change copy.

The dev server reloads on save. `npm run build` fails loudly if a file is malformed,
so a typo can't ship silently.

| File | What's in it |
| --- | --- |
| `projects.json` | The projects. Cards, covers, tags, credits. |
| `case-studies.json` | The long-form page for a project — sections, figures, links. |
| `about.json` | The About section: copy, photos, skills, experience. |
| `site.json` | Everything else: hero, nav, footer, the 404 page. |

---

## projects.json

An array. **Order matters** — the homepage Works section features the first three,
in this order. The rest still appear on `/projects`.

```json
{
  "id": "demos",                        // the URL slug — must match `href` below
  "title": "Dèmos",
  "description": "…",                   // the card, 2–3 lines
  "fullDescription": "…",               // opens the case study page
  "problem": "…",                       // optional — becomes a "Challenges" section
  "outcomes": ["…"],                    // optional — becomes an "Impact" section
  "tags": ["UX Research"],              // these become the filter chips on /projects
  "year": "2024",
  "role": "…",
  "team": "…",                          // optional — omit for solo work
  "industry": "…",
  "discipline": "…",
  "timeline": "…",
  "bg": "#242424",                      // tints the card and the figure placeholders
  "image": "/media/covers/…png",        // the 4:3 card cover
  "heroImage": "/media/…png",           // the 16:9 banner on the case study page
  "href": "/projects/demos",            // must be /projects/<id>
  "externalHref": "https://…"           // optional — adds a "Full Case study" link
}
```

**Only `id`, `title`, `description`, `fullDescription`, `tags`, `year`, `role`, `bg`
and `href` are required.** Leave anything else out and the site adapts — an absent
`team` drops that credit, an absent `image` shows the `bg` colour instead.

Adding a tag no project has used before creates a new filter chip automatically.

### Images

Put files in `public/media/` and reference them as `/media/…`.

Two rules worth knowing:

- **Never put them under `public/projects/`.** That path collides with the site's own
  `/projects/…` routes and the folder wins, so the case study never loads.
- **Spaces must be written `%20`** — `/media/demos/AI%20System.png`.

---

## case-studies.json

Keyed by the project's `id`. A project with no entry here still gets a page, built
from its `fullDescription`, `outcomes` and `problem`.

```json
"demos": {
  "headline": "Dèmos",                                            // the big title, on the page and the cards
  "accent": "#7B5CF5",
  "sections": [
    {
      "id": "introduction",          // anchor + sidebar key, lowercase, no spaces
      "label": "Introduction",       // how it reads in the sidebar
      "heading": "Introduction",
      "body": "…",
      "bullets": ["…"],              // optional
      "highlight": "…",              // optional — one line pulled out in the accent colour
      "outro": "…",                  // optional — a closing paragraph after the list
      "figuresFirst": true,          // optional — pictures before the list, not after
      "figures": [
        { "caption": "…", "src": "/media/…png" },
        { "caption": "…", "src": "/media/…png", "span": "half" }
      ],
      "action": { "label": "…", "href": "https://…" }             // optional button
    }
  ]
}
```

**Figures.** `span: "half"` pairs two on one row; anything else runs full width. Both
are 16:9 frames and images are cropped to fill, so use 16:9 exports.

**A figure with no `src` is fine** — it renders as a captioned placeholder at the right
size, so you can write the page before the picture exists. Two are placeholders today.

---

## about.json

- `copy` — an array; each entry is a paragraph.
- `photos` — the draggable stack. Add or remove entries freely, nothing counts them.
  The **first** photo is the one showing on top. Each `caption` appears in the pill
  that follows the cursor over that photo.
- `skills.items` — the scrolling row. It repeats itself to fill the screen, so adding
  or removing words is safe.
- `experience.items` — newest first. `logo` points at `public/logos/`.

---

## site.json

- `hero.accentWords` — the words that type themselves in and out. Any number.
  The first one is what shows when someone has reduced motion turned on.
- `hero.subtitle` is split into `before` / `emphasis` / `after` because the middle run
  is set bold. Keep the spaces at the ends of `before` and the start of `after`.
- `hero.screenReaderHeadline` — what a screen reader reads instead of the animating
  headline. **Update it if you change the headline.**
- `nav` — each `id` must match a section `id` on the homepage (`work`, `about`,
  `contact`), or the link scrolls nowhere.
- `footer.links` — `"download": true` serves the file; `false` opens a new tab.
- `workPage.allFilterLabel` — renaming this renames the chip *and* the filter it drives.
