import { getSocialIcon } from './icons'
import { useContent } from '../content'
export default function Footer() {
  const { site, services, nav } = useContent()
  const h = 'mb-3.5 text-sm font-semibold', l = 'text-sm text-brand-muted transition hover:text-brand-mint'
  return (
    <footer className="border-t border-brand-line bg-[#04100b] pb-7 pt-16">
      <div className="wrap">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#home" className="flex items-center gap-2.5 font-display text-lg font-semibold"><img src={site.logo} alt={`${site.name} logo`} className="h-9 w-9 rounded-[10px]" />{site.name}</a>
            <p className="mt-3.5 max-w-xs text-sm text-brand-muted">{site.blurb}</p>
            <div className="mt-4 flex gap-2.5">{site.social.map(s => { const I = getSocialIcon(s.label); return <a key={s.title} href={s.url} aria-label={s.title} className="grid h-10 w-10 place-items-center rounded-[10px] border border-brand-line text-brand-muted transition hover:border-brand-mint hover:text-brand-mint"><I size={17} /></a> })}</div>
          </div>
          <div><h4 className={h}>Navigate</h4><ul className="grid gap-2.5">{nav.map(n => <li key={n.href}><a className={l} href={n.href}>{n.label}</a></li>)}</ul></div>
          <div><h4 className={h}>Services</h4><ul className="grid gap-2.5">{services.map(s => <li key={s.title}><a className={l} href="#services">{s.title}</a></li>)}</ul></div>
          <div><h4 className={h}>Contact</h4><ul className="grid gap-2.5 text-sm text-brand-muted"><li>{site.email}</li><li>{site.phone}</li><li>{site.location}</li></ul></div>
        </div>
        <div className="mt-11 border-t border-brand-line pt-5 text-center text-[13px] text-brand-muted">© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
      </div>
    </footer>
  )
}
