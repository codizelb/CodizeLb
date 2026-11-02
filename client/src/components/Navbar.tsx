import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useContent } from '../content'
export default function Navbar() {
  const { site, nav, hero, sections } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  // A nav link to "#services" hides itself when the "services" section is turned off in the
  // admin. Links with no matching section id (e.g. "#home") always show.
  const visible = nav.filter(n => {
    const id = n.href.startsWith('#') ? n.href.slice(1) : null
    const sec = id ? sections.find(s => s.id === id) : null
    return !sec || sec.enabled
  })
  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition duration-300 ${scrolled || open ? 'border-brand-line bg-brand-bg/80 backdrop-blur-xl' : 'border-transparent'}`}>
      <div className="wrap flex h-[72px] items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <img src={site.logo} alt={`${site.name} logo`} className="h-9 w-9 rounded-[10px]" />{site.name}
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {visible.map(n => (
            <a key={n.href} href={n.href} className="group relative text-sm text-brand-muted transition hover:text-brand-mint">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-mint transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href="/admin" className="text-sm text-brand-muted transition hover:text-brand-mint">Admin</a>
          <a href="#contact" className="btn btn-primary !min-h-[42px] !py-2.5">{hero.primaryCta}</a>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-[10px] border border-brand-line md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className={`overflow-hidden transition-[max-height] duration-500 md:hidden ${open ? 'max-h-[480px]' : 'max-h-0'}`}>
        {visible.map(n => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-t border-brand-line px-5 py-3.5 text-brand-muted">{n.label}</a>)}
        <a href="/admin" onClick={() => setOpen(false)} className="block border-t border-brand-line px-5 py-3.5 text-brand-muted">Admin login</a>
        <a href="#contact" onClick={() => setOpen(false)} className="block border-t border-brand-line px-5 py-3.5 font-semibold text-brand-mint">{hero.primaryCta}</a>
      </div>
    </header>
  )
}
