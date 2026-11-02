import { Section } from './Section'
import { Reveal } from './Reveal'
import { useContent } from '../content'
export default function Technologies() {
  const { tech } = useContent()
  return (
    <Section id="tech">
      <div className="mt-10 grid gap-8">
        {tech.map(g => (
          <Reveal key={g.group}>
            <h3 className="mb-3.5 font-mono text-[13px] font-semibold uppercase tracking-[.16em] text-brand-muted">{g.group}</h3>
            {/* Auto-scrolling strip: the item list is repeated 4x (not just once) so even a
                short group — three or four pills — still has enough width to loop seamlessly
                instead of running out of content partway through. Pauses on hover. */}
            <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className="flex w-max animate-marquee gap-2.5 group-hover:[animation-play-state:paused]">
                {[...g.items, ...g.items, ...g.items, ...g.items].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-brand-line bg-brand-surface2/50 px-[18px] py-3 font-medium transition duration-300 hover:-translate-y-1 hover:border-brand-mint hover:text-brand-mint">
                    <i className="h-2 w-2 rounded-full bg-brand-grad" />{t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
