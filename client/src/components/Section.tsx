import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { useContent } from '../content'
/** Left-aligned header: a sentence-case kicker (not tracked caps) and a heading that only
    highlights a trailing clause, not a single word mid-sentence. */
export function Section({ id, className = '', children }: { id: string; className?: string; children: ReactNode }) {
  const s = useContent().sections.find(x => x.id === id)
  return (
    <section id={id} className={`relative py-20 sm:py-24 ${className}`}>
      <div className="wrap">
        <Reveal>
          <p className="kicker">{s?.eyebrow}</p>
          <h2 className="mb-4 mt-2 max-w-2xl text-[clamp(26px,4vw,42px)] font-semibold leading-[1.15] tracking-tight">
            {s?.title}{s?.highlight && <> <span className="text-brand-mint">{s.highlight}</span></>}
          </h2>
          {s?.sub && <p className="max-w-lg text-brand-muted">{s.sub}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
