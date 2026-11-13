import variants from './imageVariants.json'

/** Pictures that have a 900px-wide twin beside them (`name-900.webp`, and `name-1400.webp` for the largest), with each full-size
 *  file's own width. Phones are served the twin; wider screens keep the full-size file.
 *  The list is generated alongside the twins — an image that isn't in it is simply served
 *  as it is. */
const WIDTHS = variants as Record<string, number>

const twin = (src: string, w: number) => src.replace(/(\.[a-z]+)$/i, `-${w}$1`)
const enc = (src: string) => src.split('/').map(encodeURIComponent).join('/')

/** `srcSet` and `sizes` for an <img>, or nothing when the picture has no smaller twin.
 *  `sizes` says how wide the picture sits on a large screen (default: the 850px column);
 *  below 1024px it takes the full width of the screen. */
export function responsive(src: string | undefined, wide = '850px') {
  if (!src) return {}
  let path: string
  try { path = decodeURIComponent(src) } catch { path = src }
  const full = WIDTHS[path]
  if (!full) return {}
  return {
    srcSet: [
      `${enc(twin(path, 900))} 900w`,
      // the middle step is for 3× phone screens, which want about 1000px
      ...(full > 1700 ? [`${enc(twin(path, 1400))} 1400w`] : []),
      `${enc(path)} ${full}w`,
    ].join(', '),
    sizes: `(min-width: 1024px) ${wide}, 100vw`,
  }
}
