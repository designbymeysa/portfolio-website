import { useEffect, useState } from 'react'
import { CopyIcon, CheckIcon } from './LinkIcons'

/** /today: the email address with a copy mark beside it, as one unit.
 *
 *  A mailto: link only works for someone with a mail app set up — on webmail it opens
 *  nothing, or the wrong thing — so the address can be copied instead. The two never
 *  part onto separate lines; the hover line is drawn under the address only, so it
 *  ends where the address does and never runs on under the mark. The mark is only there when it is
 *  wanted: it arrives with the pointer or the keyboard, stays while it shows its tick,
 *  and on a touch screen, where nothing can hover, it is simply always there.
 *
 *  `tone` is the ground it sits on: the footer's dark panel, or the phone menu's sheet. */
const TONES = {
  footer: { line: 'after:bg-white', icon: 'text-white/80 hover:text-white', done: 'text-white' },
  sheet: {
    line: 'after:bg-[color:var(--ink-strong)]',
    icon: 'text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]',
    done: 'text-[color:var(--ink-strong)]',
  },
}

export function EmailCopy({ email, linkClass, tone }: { email: string; linkClass: string; tone: keyof typeof TONES }) {
  const [copied, setCopied] = useState(false)
  const t = TONES[tone]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // no clipboard API, or the browser refused it (an insecure origin, a permissions
      // policy): the older route, through a selection, still works in most of those
      const field = document.createElement('textarea')
      field.value = email
      field.setAttribute('readonly', '')
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(field)
      field.select()
      let ok = false
      try { ok = document.execCommand('copy') } catch { /* nothing more to try */ }
      field.remove()
      if (ok) setCopied(true)
    }
  }

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <span
      className="group/mail inline-flex flex-nowrap items-center gap-[8px] whitespace-nowrap"
    >
      {/* the address itself copies: no mail app is opened */}
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className={`relative cursor-pointer text-left after:pointer-events-none after:absolute after:left-0 after:-bottom-[2px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover/mail:after:scale-x-100 focus-visible:after:scale-x-100 ${t.line} ${linkClass}`}
        style={{ fontVariationSettings: '"wdth" 100' }}>
        {email}
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={copy}
        /* the padding is a finger-sized target, given back as margin so the row keeps
           its height */
        className={`inline-flex items-center justify-center p-[10px] -m-[10px] rounded-full transition-[opacity,color] duration-[200ms] focus-visible:opacity-100 group-hover/mail:opacity-100 [@media(hover:none)]:opacity-100 ${t.icon} ${copied ? 'opacity-100' : 'opacity-0'}`}
      >
        {copied
          ? <CheckIcon className={`h-[14px] w-[14px] ${t.done}`} />
          : <CopyIcon className="h-[14px] w-[14px]" />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </span>
  )
}
