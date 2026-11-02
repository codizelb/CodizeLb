import { useState, type FormEvent } from 'react'
import { Send, MessageSquarePlus } from 'lucide-react'
import { Section } from './Section'
import { Reveal } from './Reveal'
import { Toast } from './Toast'
import { api } from '../api'
import { useContent } from '../content'
/** Quote blocks with a rule, not avatar-in-gradient-circle cards. */
export default function Testimonials() {
  const { testimonials } = useContent()
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [err, setErr] = useState('')
  const [toast, setToast] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget, v = new FormData(form)
    setStatus('sending')
    try {
      await api.submitTestimonial({ quote: String(v.get('quote')), name: String(v.get('name')), position: String(v.get('position')), company: String(v.get('company')) })
      setStatus('ok'); form.reset(); setToast(true)
    } catch (x) { setErr((x as Error).message); setStatus('err') }
  }
  return (
    <Section id="testimonials" className="bg-brand-surface/40">
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 60}>
            <figure className="border-l-2 border-brand-mint/50 pl-5">
              <blockquote className="text-[15px] leading-relaxed text-brand-text">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm text-brand-muted"><b className="text-brand-text">{t.name}</b> — {t.position}, {t.company}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        {status === 'ok' ? (
          <p className="mx-auto max-w-xl rounded-xl border border-brand-line bg-brand-surface/60 p-5 text-center text-sm text-brand-mint">Thanks for sharing your experience — it'll appear here once reviewed.</p>
        ) : !showForm ? (
          <div className="flex justify-center"><button onClick={() => setShowForm(true)} className="btn btn-primary !min-h-[44px]"><MessageSquarePlus size={17} />Share your experience</button></div>
        ) : (
          <form onSubmit={submit} className="grid max-w-xl gap-3.5 rounded-xl border border-brand-line bg-brand-surface/60 p-6">
            <p className="mb-1 font-medium">Share your experience</p>
            <label className="grid gap-1.5 text-[13px] text-brand-muted">Your testimonial<textarea className="input" name="quote" rows={3} required /></label>
            <div className="grid gap-3.5 sm:grid-cols-3">
              <label className="grid gap-1.5 text-[13px] text-brand-muted">Name<input className="input" name="name" required autoComplete="name" /></label>
              <label className="grid gap-1.5 text-[13px] text-brand-muted">Position<input className="input" name="position" /></label>
              <label className="grid gap-1.5 text-[13px] text-brand-muted">Company<input className="input" name="company" /></label>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-primary !min-h-[42px] !py-2.5" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : <>Submit <Send size={15} /></>}</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-brand-muted hover:text-brand-text">Cancel</button>
            </div>
            {status === 'err' && <p className="text-sm text-red-300" role="alert">{err}</p>}
          </form>
        )}
      </Reveal>
      <Toast show={toast} message="Thanks for sharing your experience!" onClose={() => setToast(false)} />
    </Section>
  )
}