import { Section } from './Section'
import { Reveal } from './Reveal'
import { getIcon } from './icons'
import { useContent } from '../content'
const DUOTONES = ['from-brand-emerald/30', 'from-brand-mint/25', 'from-brand-moss/60']
export default function Projects() {
  const { projects } = useContent()
  return (
    <Section id="projects">
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => { const Icon = getIcon(p.icon); return (
          <Reveal key={i} delay={i * 50}>
            <article className="h-full overflow-hidden rounded-xl border border-brand-line bg-brand-surface transition duration-300 hover:border-brand-mint/40">
              <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${DUOTONES[i % 3]} to-transparent`}>
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <Icon size={34} className="text-brand-text/70" />}
              </div>
              <div className="p-5">
                <p className="text-xs text-brand-muted">{p.category}</p>
                <h3 className="mb-2 mt-1 text-lg font-medium">{p.name}</h3>
                <p className="mb-3 text-sm text-brand-muted">{p.description}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">{p.tech.map(t => <span key={t} className="rounded border border-brand-line px-2 py-0.5 text-xs text-brand-muted">{t}</span>)}</div>
                <a href={p.url || '#contact'} className="text-sm font-medium text-brand-mint hover:underline">View project</a>
              </div>
            </article>
          </Reveal>) })}
      </div>
    </Section>
  )
}
