import { Section } from './Section'
import { Reveal } from './Reveal'
import { getIcon } from './icons'
import { useContent } from '../content'
export default function Services() {
  const { services } = useContent()
  return (
    <Section id="services">
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => { const Icon = getIcon(s.icon); return (
          <Reveal key={i} delay={i * 50}>
            <article className="group h-full rounded-xl border border-brand-line bg-brand-surface/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-mint/40 hover:bg-brand-surface">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg border border-brand-line bg-brand-mint/10 text-brand-mint transition duration-300 group-hover:bg-brand-grad group-hover:text-[#04140d]">
                <Icon size={22} />
              </div>
              <h3 className="mb-2 text-lg font-medium">{s.title}</h3>
              <p className="text-[15px] text-brand-muted">{s.description}</p>
            </article>
          </Reveal>) })}
      </div>
    </Section>
  )
}
