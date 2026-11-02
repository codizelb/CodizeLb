import { useState } from 'react'
import { Plus, Mail } from 'lucide-react'
import { Section } from './Section'
import { Reveal } from './Reveal'
import { useContent } from '../content'
export default function FAQ() {
  const { faq, site } = useContent()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq">
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-brand-line bg-brand-surface/60 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-mint/10 text-brand-mint"><Mail size={18} /></div>
            <p className="mb-1 font-medium">Still have questions?</p>
            <p className="mb-4 text-sm text-brand-muted">We're happy to walk you through anything not covered here.</p>
            <a href={`mailto:${site.email}`} className="text-sm font-medium text-brand-mint hover:underline">Email us →</a>
          </div>
        </Reveal>

        <div className="overflow-hidden rounded-xl border border-brand-line">
          {faq.map((f, i) => (
            <div key={i} className={`border-b border-brand-line last:border-b-0 transition-colors duration-300 ${open === i ? 'bg-brand-surface' : 'bg-brand-surface/40'}`}>
              <button className="flex min-h-[56px] w-full items-center gap-4 px-6 py-5 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs transition-colors duration-300 ${open === i ? 'bg-brand-mint text-[#04140d]' : 'bg-brand-mint/10 text-brand-mint'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 font-medium">{f.q}</span>
                <Plus size={20} className={`shrink-0 text-brand-mint transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden"><p className="px-6 pb-5 pl-[4.25rem] text-brand-muted">{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
