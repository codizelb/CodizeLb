import { useState, type FormEvent } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Reveal } from './Reveal'
import { Toast } from './Toast'
import { api } from '../api'
import { useContent } from '../content'
export default function Contact() {
  const { site, sections } = useContent()
  const sec = sections.find(s => s.id === 'contact')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [err, setErr] = useState('')
  const [toast, setToast] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget, v = new FormData(form)
    setStatus('sending')
    try {
      await api.send({ name: String(v.get('name')), email: String(v.get('email')), phone: String(v.get('phone')), company: String(v.get('company')), type: String(v.get('type')), message: String(v.get('message')) })
      setStatus('idle'); form.reset(); setToast(true)
    } catch (x) { setErr((x as Error).message); setStatus('err') }
  }
  const info = [{ i: Mail, l: 'Email', v: site.email }, { i: Phone, l: 'Phone', v: site.phone }, { i: MapPin, l: 'Location', v: site.location }]
  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="grid gap-12 rounded-[28px] border border-brand-line bg-[radial-gradient(circle_at_90%_0,rgba(16,185,129,.25),transparent_50%),linear-gradient(160deg,#0f3323,#081e15)] p-6 sm:p-12 lg:grid-cols-2">
            <div>
              <div className="eyebrow">{sec?.eyebrow}</div>
              <h2 className="my-3.5 text-[clamp(28px,4.4vw,46px)] font-bold leading-[1.1] tracking-tight">{sec?.title} <span className="grad-text">{sec?.highlight}</span></h2>
              <p className="max-w-md text-brand-muted">{sec?.sub}</p>
              <div className="mt-7 grid gap-4">{info.map(x => <div key={x.l} className="flex items-center gap-3.5 text-brand-muted"><span className="grid h-10 w-10 place-items-center rounded-[10px] border border-brand-line text-brand-mint"><x.i size={18} /></span><span><b className="block font-mono text-[11px] uppercase tracking-[.14em] text-brand-mint">{x.l}</b>{x.v}</span></div>)}</div>
            </div>
            <form onSubmit={submit} className="grid gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="grid gap-1.5 text-[13px] text-brand-muted">Name<input className="input" name="name" required autoComplete="name" /></label>
                <label className="grid gap-1.5 text-[13px] text-brand-muted">Email<input className="input" name="email" type="email" required autoComplete="email" /></label>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="grid gap-1.5 text-[13px] text-brand-muted">Phone<input className="input" name="phone" type="tel" autoComplete="tel" placeholder="Optional" /></label>
                <label className="grid gap-1.5 text-[13px] text-brand-muted">Company<input className="input" name="company" autoComplete="organization" /></label>
              </div>
              <label className="grid gap-1.5 text-[13px] text-brand-muted">Project type<select className="input" name="type">{['Website', 'Web application', 'E-commerce', 'UI/UX design', 'Maintenance'].map(o => <option key={o}>{o}</option>)}</select></label>
              <label className="grid gap-1.5 text-[13px] text-brand-muted">Message<textarea className="input" name="message" rows={4} required /></label>
              <button className="btn btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : <>Send Message <Send size={16} /></>}</button>
              {status === 'err' && <p role="alert" className="text-sm text-red-300">{err}</p>}
            </form>
          </div>
        </Reveal>
      </div>
      <Toast show={toast} message="Thanks! We'll be in touch soon." onClose={() => setToast(false)} />
    </section>
  )
}
