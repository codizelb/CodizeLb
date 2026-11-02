import { Section } from './Section'
import { Reveal } from './Reveal'
import { getIcon } from './icons'
import { useContent } from '../content'
export default function About() {
  const { pillars } = useContent()
  return (
    <Section id="about">
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {pillars.map((p, i) => { const I = getIcon(p.icon); return (
          <Reveal key={i} delay={i * 80}>
            <div>
              <I className="mb-3 text-brand-mint" size={22} />
              <div className="font-medium">{p.title}</div>
              <small className="text-brand-muted">{p.description}</small>
            </div>
          </Reveal>) })}
      </div>
    </Section>
  )
}
