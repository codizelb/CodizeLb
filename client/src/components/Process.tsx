import { Section } from './Section'
import { Reveal } from './Reveal'
import { useContent } from '../content'
export default function Process() {
  const { process } = useContent()
  return (
    <Section id="process">
      <div className="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-5">
        <div className="absolute left-[28px] top-0 h-full w-0.5 bg-gradient-to-b from-brand-teal to-transparent opacity-50 lg:left-[5%] lg:right-[5%] lg:top-7 lg:h-0.5 lg:w-auto lg:bg-gradient-to-r lg:from-transparent lg:via-brand-emerald lg:to-transparent" />
        {process.map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="relative flex gap-5 lg:block lg:text-center">
              <div className="relative z-10 grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-2 border-brand-emerald bg-brand-bg font-mono font-bold text-brand-mint shadow-[0_0_0_6px_#06140f] lg:mx-auto lg:mb-5">{String(i + 1).padStart(2, '0')}</div>
              <div><h3 className="mb-1.5 text-lg font-semibold">{s.title}</h3><p className="text-sm text-brand-muted">{s.description}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
