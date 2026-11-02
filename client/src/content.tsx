import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import type { Content } from './types'
const Ctx = createContext<Content | null>(null)
export const useContent = (): Content => { const c = useContext(Ctx); if (!c) throw new Error('Content not loaded'); return c }
/** All site content comes from the backend API (MySQL). No static fallback content. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [c, setC] = useState<Content | null>(null)
  const [err, setErr] = useState(false)
  const load = () => { setErr(false); api.content().then(d => { if (!d.site || !d.hero) throw new Error('empty'); setC(d as Content) }).catch(() => setErr(true)) }
  useEffect(load, [])
  useEffect(() => {
    if (!c) return
    document.title = c.seo.title
    const meta = (sel: string, attr: string, val: string) => document.querySelector(sel)?.setAttribute(attr, val)
    meta('meta[name="description"]', 'content', c.seo.description); meta('meta[property="og:title"]', 'content', c.seo.title)
    meta('meta[property="og:description"]', 'content', c.seo.description); meta('link[rel="icon"]', 'href', c.site.logo)
  }, [c])
  if (err) return <div className="grid min-h-screen place-items-center px-6 text-center"><div><p className="mb-4 text-brand-muted">The site is temporarily unavailable.</p><button className="btn btn-primary" onClick={load}>Retry</button></div></div>
  if (!c) return <div className="grid min-h-screen place-items-center"><img src="/logo.png" alt="" className="h-16 w-16 animate-pulse rounded-2xl" /></div>
  return <Ctx.Provider value={c}>{children}</Ctx.Provider>
}
