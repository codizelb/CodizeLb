import { Check } from 'lucide-react'
import { Section } from './Section'
import { Reveal, CountUp } from './Reveal'
import { useContent } from '../content'
export default function WhyChooseUs() {
  const { why, stats } = useContent()
  return (
    <Section id="why" className="bg-brand-surface/40">
      <div className="mt-10 grid items-start gap-12 lg:grid-cols-2">
        <ul className="grid gap-3.5">
          {why.map((w, i) => (
            <Reveal key={i} delay={i * 40}><li className="flex gap-3 text-brand-muted"><Check className="mt-1 shrink-0 text-brand-mint" size={18} /><span><b className="text-brand-text">{w.title}</b> — {w.detail}</span></li></Reveal>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border-l-2 border-brand-mint/50 pl-4">
                <div className="font-display text-4xl font-semibold text-brand-mint"><CountUp to={s.value} />{s.suffix}</div>
                <div className="mt-1 text-sm text-brand-muted">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
