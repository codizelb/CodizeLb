import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  LayoutDashboard, Settings, Sparkles, ListTree, Menu as MenuIcon, Briefcase, ThumbsUp, BarChart3,
  Cpu, GitBranch, FolderKanban, Layers, MessageSquareQuote, HelpCircle, Inbox, Lock, LogOut, ExternalLink, Star, Check, X,
} from 'lucide-react'
import { api, type Message, type TestimonialSubmission } from '../api'
import type { Content } from '../types'

type Kind = 'text' | 'area' | 'list' | 'number' | 'bool' | 'image' | 'readonly'
interface F { name: string; label: string; kind?: Kind }
type Row = Record<string, any>

const SITE: F[] = [{ name: 'name', label: 'Company name' }, { name: 'logo', label: 'Logo (also used as favicon)', kind: 'image' }, { name: 'blurb', label: 'Footer description', kind: 'area' }, { name: 'email', label: 'Email' }, { name: 'phone', label: 'Phone' }, { name: 'location', label: 'Location' }]
const SEO: F[] = [{ name: 'title', label: 'Page title' }, { name: 'description', label: 'Meta description', kind: 'area' }]
const SOCIAL: F[] = [{ name: 'label', label: 'Icon (linkedin, github, twitter, instagram)' }, { name: 'title', label: 'Title' }, { name: 'url', label: 'URL' }]
const HERO: F[] = [{ name: 'eyebrow', label: 'Small label' }, { name: 'title', label: 'Headline' }, { name: 'highlight', label: 'Headline (highlighted part)' }, { name: 'subtitle', label: 'Subtitle', kind: 'area' }, { name: 'primaryCta', label: 'Primary button' }, { name: 'secondaryCta', label: 'Secondary button' }, { name: 'secondaryHref', label: 'Secondary button link (e.g. #projects, #testimonials, #contact)' }, { name: 'tags', label: 'Tag line items (comma separated)', kind: 'list' }, { name: 'chips', label: 'Floating chips (comma separated, max 2)', kind: 'list' }]
const ICON = 'Icon key (code, app, cart, design, server, wrench, bag, boxes, globe, chart, calendar, dashboard, rocket, shield, zap, database, mobile, palette, compass, cpu)'
const LISTS: Record<string, { title: string; fields: F[]; fixed?: boolean }> = {
  sections: { title: 'Sections', fixed: true, fields: [{ name: 'id', label: 'Section', kind: 'readonly' }, { name: 'enabled', label: 'Visible on website', kind: 'bool' }, { name: 'eyebrow', label: 'Small label' }, { name: 'title', label: 'Title' }, { name: 'highlight', label: 'Title (highlighted part)' }, { name: 'sub', label: 'Subtitle / paragraph', kind: 'area' }] },
  nav: { title: 'Navigation', fields: [{ name: 'label', label: 'Label' }, { name: 'href', label: 'Link (#services or https://…)' }] },
  services: { title: 'Services', fields: [{ name: 'icon', label: ICON }, { name: 'title', label: 'Title' }, { name: 'description', label: 'Description', kind: 'area' }] },
  why: { title: 'Why choose us', fields: [{ name: 'title', label: 'Title' }, { name: 'detail', label: 'Detail' }] },
  stats: { title: 'Statistics', fields: [{ name: 'value', label: 'Value', kind: 'number' }, { name: 'suffix', label: 'Suffix (+ % /7)' }, { name: 'label', label: 'Label' }] },
  tech: { title: 'Technologies', fields: [{ name: 'group', label: 'Group name' }, { name: 'items', label: 'Items (comma separated)', kind: 'list' }] },
  process: { title: 'Process', fields: [{ name: 'title', label: 'Title' }, { name: 'description', label: 'Description', kind: 'area' }] },
  projects: { title: 'Projects', fields: [{ name: 'name', label: 'Name' }, { name: 'category', label: 'Category' }, { name: 'description', label: 'Description', kind: 'area' }, { name: 'tech', label: 'Technologies (comma separated)', kind: 'list' }, { name: 'image', label: 'Project image (optional)', kind: 'image' }, { name: 'icon', label: ICON + ' — used when no image' }, { name: 'url', label: 'Link URL' }] },
  pillars: { title: 'About pillars', fields: [{ name: 'icon', label: ICON }, { name: 'title', label: 'Title' }, { name: 'description', label: 'Description' }] },
  testimonials: { title: 'Testimonials', fields: [{ name: 'quote', label: 'Quote', kind: 'area' }, { name: 'name', label: 'Name' }, { name: 'position', label: 'Position' }, { name: 'company', label: 'Company' }] },
  faq: { title: 'FAQ', fields: [{ name: 'q', label: 'Question' }, { name: 'a', label: 'Answer', kind: 'area' }] },
}
// Sidebar structure: groups of nav items. Icons are purely navigational — unrelated to the
// content "icon key" fields used inside services/projects/pillars above.
const NAV_GROUPS: { label: string; items: { id: string; t: string; icon: typeof Settings }[] }[] = [
  { label: 'Overview', items: [{ id: 'overview', t: 'Overview', icon: LayoutDashboard }] },
  { label: 'Site', items: [
    { id: 'general', t: 'General', icon: Settings },
    { id: 'hero', t: 'Hero', icon: Sparkles },
    { id: 'sections', t: 'Sections', icon: ListTree },
    { id: 'nav', t: 'Navigation', icon: MenuIcon },
  ] },
  { label: 'Content', items: [
    { id: 'services', t: 'Services', icon: Briefcase },
    { id: 'why', t: 'Why choose us', icon: ThumbsUp },
    { id: 'stats', t: 'Statistics', icon: BarChart3 },
    { id: 'tech', t: 'Technologies', icon: Cpu },
    { id: 'process', t: 'Process', icon: GitBranch },
    { id: 'projects', t: 'Projects', icon: FolderKanban },
    { id: 'pillars', t: 'About pillars', icon: Layers },
    { id: 'testimonials', t: 'Testimonials', icon: MessageSquareQuote },
    { id: 'faq', t: 'FAQ', icon: HelpCircle },
  ] },
  { label: 'Inbox', items: [
    { id: 'messages', t: 'Messages', icon: Inbox },
    { id: 'testimonial-requests', t: 'Testimonial requests', icon: Star },
  ] },
  { label: 'Account', items: [{ id: 'password', t: 'Password', icon: Lock }] },
]
const FLAT_TABS = NAV_GROUPS.flatMap(g => g.items)

function ListInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const joined = value.join(', ')
  const [text, setText] = useState(joined)
  useEffect(() => setText(joined), [joined])
  return <input className="input" value={text} onChange={e => setText(e.target.value)} onBlur={() => onChange(text.split(',').map(s => s.trim()).filter(Boolean))} />
}
function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const pick = (file?: File) => {
    if (!file) return
    setBusy(true); setErr('')
    const r = new FileReader()
    r.onload = async () => { try { onChange((await api.upload(String(r.result))).url) } catch (x) { setErr((x as Error).message) } setBusy(false) }
    r.readAsDataURL(file)
  }
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-14 w-14 rounded-lg border border-brand-line object-cover" />}
        <input className="input" value={value ?? ''} placeholder="/uploads/… or https://…" onChange={e => onChange(e.target.value)} />
      </div>
      <div className="flex items-center gap-3 text-sm"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy} onChange={e => pick(e.target.files?.[0])} />{busy && <span className="text-brand-mint">Uploading…</span>}<span className="text-red-300">{err}</span></div>
    </div>
  )
}
function Field({ f, value, onChange }: { f: F; value: any; onChange: (v: any) => void }) {
  if (f.kind === 'bool') return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> {f.label}</label>
  return (
    <label className="grid gap-1 text-xs text-brand-muted">{f.label}
      {f.kind === 'area' ? <textarea className="input" rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} />
        : f.kind === 'list' ? <ListInput value={value ?? []} onChange={onChange} />
        : f.kind === 'image' ? <ImageInput value={value ?? ''} onChange={onChange} />
        : f.kind === 'readonly' ? <b className="text-sm capitalize text-brand-mint">{value}</b>
        : <input className="input" type={f.kind === 'number' ? 'number' : 'text'} value={value ?? ''} onChange={e => onChange(f.kind === 'number' ? Number(e.target.value) : e.target.value)} />}
    </label>
  )
}
const box = 'rounded-xl border border-brand-line bg-brand-surface/60 mb-4 grid gap-3 p-5'
function ObjEditor({ obj, fields, onChange }: { obj: Row; fields: F[]; onChange: (v: Row) => void }) {
  return <div className={box}>{fields.map(f => <Field key={f.name} f={f} value={obj[f.name]} onChange={v => onChange({ ...obj, [f.name]: v })} />)}</div>
}
function ListEditor({ items, fields, fixed, onChange }: { items: Row[]; fields: F[]; fixed?: boolean; onChange: (v: Row[]) => void }) {
  const set = (i: number, n: string, v: any) => onChange(items.map((r, j) => (j === i ? { ...r, [n]: v } : r)))
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= items.length) return; const c = [...items];[c[i], c[j]] = [c[j], c[i]]; onChange(c) }
  const add = () => onChange([...items, Object.fromEntries(fields.map(f => [f.name, f.kind === 'list' ? [] : f.kind === 'number' ? 0 : f.kind === 'bool' ? true : '']))])
  const b = 'rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm hover:border-brand-mint'
  return (
    <div>
      {items.map((r, i) => (
        <div key={i} className={box}>
          {fields.map(f => <Field key={f.name} f={f} value={r[f.name]} onChange={v => set(i, f.name, v)} />)}
          <div className="flex gap-2"><button className={b} onClick={() => move(i, -1)}>↑ Up</button><button className={b} onClick={() => move(i, 1)}>↓ Down</button>{!fixed && <button className={b} onClick={() => confirm('Delete this item?') && onChange(items.filter((_, j) => j !== i))}>Delete</button>}</div>
        </div>
      ))}
      {!fixed && <button className="btn btn-ghost !min-h-[40px]" onClick={add}>+ Add item</button>}
    </div>
  )
}
function Messages({ onChange }: { onChange?: (n: number) => void }) {
  const [list, setList] = useState<Message[]>([])
  const load = () => api.messages().then(l => { setList(l); onChange?.(l.length) }).catch(() => {})
  useEffect(() => { load() }, [])
  if (!list.length) return <p className="text-brand-muted">No messages yet.</p>
  return <div>{list.map(m => (
    <div key={m.id} className={box}>
      <b>{m.name} — <a className="text-brand-mint" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <> · <a className="text-brand-mint" href={`tel:${m.phone}`}>{m.phone}</a></>}</b>
      <small className="text-brand-muted">{new Date(m.date).toLocaleString()} · {m.company || 'No company'} · {m.type}</small>
      <div className="whitespace-pre-wrap">{m.message}</div>
      <div><button className="rounded-lg border border-brand-line px-3 py-1.5 text-sm hover:border-brand-mint" onClick={async () => { await api.deleteMessage(m.id); load() }}>Delete</button></div>
    </div>))}</div>
}
function TestimonialRequests({ onChange }: { onChange?: (n: number) => void }) {
  const [list, setList] = useState<TestimonialSubmission[]>([])
  const [busy, setBusy] = useState<number | null>(null)
  const load = () => api.testimonialSubmissions().then(l => { setList(l); onChange?.(l.length) }).catch(() => {})
  useEffect(() => { load() }, [])
  if (!list.length) return <p className="text-brand-muted">No testimonial requests yet.</p>
  return <div>{list.map(t => (
    <div key={t.id} className={box}>
      <p className="text-brand-text">“{t.quote}”</p>
      <small className="text-brand-muted">{t.name}{t.position && `, ${t.position}`}{t.company && ` — ${t.company}`} · {new Date(t.date).toLocaleString()}</small>
      <div className="flex gap-2">
        <button disabled={busy === t.id} className="flex items-center gap-1.5 rounded-lg border border-brand-mint/40 bg-brand-mint/10 px-3 py-1.5 text-sm text-brand-mint hover:bg-brand-mint/20" onClick={async () => { setBusy(t.id); await api.approveTestimonial(t.id); setBusy(null); load() }}><Check size={15} />Approve &amp; publish</button>
        <button disabled={busy === t.id} className="flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-1.5 text-sm hover:border-brand-mint" onClick={async () => { setBusy(t.id); await api.rejectTestimonial(t.id); setBusy(null); load() }}><X size={15} />Dismiss</button>
      </div>
    </div>))}</div>
}
function Password() {
  const [cur, setCur] = useState(''), [nw, setNw] = useState(''), [m, setM] = useState('')
  return (
    <form className={box} onSubmit={async e => { e.preventDefault(); try { await api.password(cur, nw); setM('Password changed ✓'); setCur(''); setNw('') } catch (x) { setM((x as Error).message) } }}>
      <input className="input" type="password" placeholder="Current password" autoComplete="current-password" value={cur} onChange={e => setCur(e.target.value)} />
      <input className="input" type="password" placeholder="New password (min 8 characters)" autoComplete="new-password" value={nw} onChange={e => setNw(e.target.value)} />
      <div className="flex items-center gap-3"><button className="btn btn-primary">Change password</button><span className="text-sm text-brand-mint" role="status">{m}</span></div>
    </form>
  )
}
function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try { const r = await api.login(pw); localStorage.setItem('tk', r.token); onDone() }
    catch (x) { setErr((x as Error).message) }
    setBusy(false)
  }
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-brand-line bg-brand-surface p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo.png" alt="Codize logo" className="mb-4 h-14 w-14" />
          <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-brand-muted">Manage your website's content</p>
        </div>
        <label className="grid gap-1.5 text-xs text-brand-muted">Password
          <input className="input" type="password" placeholder="Enter your password" autoComplete="current-password" autoFocus value={pw} onChange={e => setPw(e.target.value)} />
        </label>
        {err && <p className="mt-3 text-sm text-red-300" role="alert">{err}</p>}
        <button className="btn btn-primary mt-5 w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a href="/" className="mt-4 block text-center text-sm text-brand-muted hover:text-brand-mint">← Back to website</a>
      </form>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, onClick }: { label: string; value: number; icon: typeof Settings; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-brand-line bg-brand-surface/60 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-mint/40">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-brand-mint/10 text-brand-mint"><Icon size={18} /></div>
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-sm text-brand-muted">{label}</div>
    </button>
  )
}
function Overview({ data, goTo }: { data: Content; goTo: (id: string) => void }) {
  const [msgCount, setMsgCount] = useState<number | null>(null)
  const [reqCount, setReqCount] = useState<number | null>(null)
  useEffect(() => { api.messages().then(l => setMsgCount(l.length)).catch(() => setMsgCount(0)) }, [])
  useEffect(() => { api.testimonialSubmissions().then(l => setReqCount(l.length)).catch(() => setReqCount(0)) }, [])
  const cards = [
    { label: 'Services', value: data.services.length, icon: Briefcase, id: 'services' },
    { label: 'Projects', value: data.projects.length, icon: FolderKanban, id: 'projects' },
    { label: 'Testimonials', value: data.testimonials.length, icon: MessageSquareQuote, id: 'testimonials' },
    { label: 'FAQ entries', value: data.faq.length, icon: HelpCircle, id: 'faq' },
    { label: 'New messages', value: msgCount ?? 0, icon: Inbox, id: 'messages' },
    { label: 'Testimonial requests', value: reqCount ?? 0, icon: Star, id: 'testimonial-requests' },
  ]
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => <StatCard key={c.id} label={c.label} value={c.value} icon={c.icon} onClick={() => goTo(c.id)} />)}
      </div>
      <div className="mt-8 rounded-xl border border-brand-line bg-brand-surface/60 p-6">
        <p className="mb-1 font-medium">Welcome back</p>
        <p className="text-sm text-brand-muted">Pick a section from the sidebar to edit your website's content. Changes go live as soon as you save.</p>
      </div>
    </div>
  )
}

function Sidebar({ tab, setTab, onLogout, mobile }: { tab: string; setTab: (t: string) => void; onLogout: () => void; mobile?: boolean }) {
  const Item = ({ id, t, icon: Icon }: { id: string; t: string; icon: typeof Settings }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${tab === id ? 'bg-brand-mint/10 text-brand-mint' : 'text-brand-muted hover:bg-white/5 hover:text-brand-text'}`}
    >
      <Icon size={17} className="shrink-0" />{t}
    </button>
  )
  return (
    <div className={mobile ? '' : 'flex h-full flex-col'}>
      {!mobile && (
        <div className="flex items-center gap-2.5 px-2 pb-6">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-lg" />
          <div><div className="font-display text-sm font-semibold leading-tight">Codize</div><div className="text-xs text-brand-muted leading-tight">Admin</div></div>
        </div>
      )}
      <nav className={mobile ? 'grid gap-1' : 'flex-1 space-y-5 overflow-y-auto'}>
        {NAV_GROUPS.map(g => (
          <div key={g.label}>
            <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-brand-muted/70">{g.label}</p>
            <div className="space-y-0.5">{g.items.map(i => <Item key={i.id} {...i} />)}</div>
          </div>
        ))}
      </nav>
      {!mobile && (
        <div className="space-y-1 border-t border-brand-line pt-4">
          <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-muted hover:bg-white/5 hover:text-brand-text"><ExternalLink size={17} />View site</a>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-brand-muted hover:bg-white/5 hover:text-brand-text"><LogOut size={17} />Log out</button>
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false), [checked, setChecked] = useState(false)
  const [data, setData] = useState<Content | null>(null), [tab, setTab] = useState('overview'), [msg, setMsg] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const boot = async () => {
    try { await api.messages(); setData((await api.content()) as Content); setAuthed(true) } catch { setAuthed(false) }
    setChecked(true)
  }
  useEffect(() => { boot() }, [])
  if (!checked) return null
  if (!authed || !data) return <Login onDone={boot} />
  const upd = <K extends keyof Content>(k: K, v: Content[K]) => setData({ ...data, [k]: v })
  const save = async (keys: (keyof Content)[]) => {
    try { for (const k of keys) await api.save(k, data[k]); setMsg('Saved ✓ — live on the website now') } catch { setMsg('Save failed — you may need to log in again') }
    setTimeout(() => setMsg(''), 3500)
  }
  const logout = () => { localStorage.removeItem('tk'); setAuthed(false) }
  const goTo = (id: string) => { setTab(id); setMobileNavOpen(false) }
  const keys: (keyof Content)[] = tab === 'general' ? ['site', 'seo'] : [tab as keyof Content]
  const list = LISTS[tab]
  const current = FLAT_TABS.find(t => t.id === tab)
  const showSaveBar = tab !== 'messages' && tab !== 'testimonial-requests' && tab !== 'overview' && tab !== 'password'

  let body: ReactNode
  if (tab === 'overview') body = <Overview data={data} goTo={goTo} />
  else if (tab === 'messages') body = <Messages />
  else if (tab === 'testimonial-requests') body = <TestimonialRequests />
  else if (tab === 'password') body = <Password />
  else body = (
    <>
      {tab === 'general' && <>
        <ObjEditor obj={data.site} fields={SITE} onChange={v => upd('site', v as Content['site'])} />
        <h2 className="mb-3 font-semibold">Social links</h2>
        <ListEditor items={data.site.social} fields={SOCIAL} onChange={v => upd('site', { ...data.site, social: v as Content['site']['social'] })} />
        <h2 className="mb-3 mt-6 font-semibold">SEO</h2>
        <ObjEditor obj={data.seo} fields={SEO} onChange={v => upd('seo', v as Content['seo'])} />
      </>}
      {tab === 'hero' && <ObjEditor obj={data.hero} fields={HERO} onChange={v => upd('hero', v as Content['hero'])} />}
      {list && <ListEditor items={data[tab as keyof Content] as Row[]} fields={list.fields} fixed={list.fixed} onChange={v => upd(tab as keyof Content, v as never)} />}
    </>
  )

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-brand-line bg-brand-surface/60 p-4 md:block">
        <div className="sticky top-4"><Sidebar tab={tab} setTab={goTo} onLogout={logout} /></div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Top bar (all sizes) */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-brand-line bg-brand-bg/90 px-4 py-3.5 backdrop-blur md:px-8">
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-brand-line md:hidden" onClick={() => setMobileNavOpen(v => !v)} aria-label="Menu"><MenuIcon size={18} /></button>
          <h1 className="font-display text-lg font-semibold">{current?.t}</h1>
          {showSaveBar && (
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm text-brand-mint sm:inline" role="status">{msg}</span>
              <button className="btn btn-primary !min-h-[38px] !py-2" onClick={() => save(keys)}>Save changes</button>
            </div>
          )}
          <a href="/" className="ml-auto text-sm text-brand-muted hover:text-brand-mint md:hidden">View site</a>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="border-b border-brand-line bg-brand-surface px-4 py-4 md:hidden">
            <Sidebar tab={tab} setTab={goTo} onLogout={logout} mobile />
            <button onClick={logout} className="mt-4 flex w-full items-center gap-2 rounded-lg border border-brand-line px-3 py-2.5 text-sm text-brand-muted"><LogOut size={16} />Log out</button>
          </div>
        )}

        <main className="mx-auto max-w-3xl px-4 py-6 md:px-8">
          {body}
          {showSaveBar && (
            <div className="mt-6 flex items-center gap-3 sm:hidden"><button className="btn btn-primary" onClick={() => save(keys)}>Save changes</button><span className="text-sm text-brand-mint" role="status">{msg}</span></div>
          )}
        </main>
      </div>
    </div>
  )
}
