import { useEffect, useRef } from 'react'
import { useContent } from '../content'
export default function Hero() {
  const { site, hero } = useContent()
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)
  const emblem = useRef<HTMLDivElement>(null)
  // Subtle parallax: background orbs and the logo drift at different speeds as the hero scrolls
  // out of view. Disabled for folks who've asked their OS/browser to reduce motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (orb1.current) orb1.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`
        if (orb2.current) orb2.current.style.transform = `translate3d(0, ${y * -0.18}px, 0)`
        if (emblem.current) emblem.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-32">
      <div ref={orb1} className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] animate-float rounded-full bg-brand-emerald/25 blur-[100px]" />
      <div ref={orb2} className="pointer-events-none absolute -bottom-20 -left-14 h-80 w-80 animate-float rounded-full bg-brand-mint/20 blur-[100px] [animation-delay:-6s]" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
        <div className="animate-in">
          <p className="kicker">{hero.eyebrow}</p>
          <h1 className="mt-3 max-w-xl text-[clamp(34px,5.6vw,60px)] font-semibold leading-[1.08] tracking-tight">
            {hero.title} <span className="text-brand-mint">{hero.highlight}</span>
          </h1>
          <p className="mb-8 mt-5 max-w-md text-[17px] text-brand-muted">{hero.subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="btn btn-primary">{hero.primaryCta}</a>
            <a href={hero.secondaryHref || '#projects'} className="btn btn-ghost">{hero.secondaryCta}</a>
          </div>
        </div>
        <div ref={emblem} className="relative mx-auto w-44 animate-float sm:w-60 lg:w-full lg:max-w-[320px] [animation-delay:.4s]">
          <img src={site.logo} alt={`${site.name} brand mark`} className="aspect-square w-full rounded-[18%] object-cover shadow-glow ring-1 ring-brand-line" />
          {hero.chips[0] && <span className="absolute -left-[14%] top-[10%] hidden rounded-full border border-brand-line bg-brand-surface/90 px-3.5 py-2 text-xs text-brand-mint backdrop-blur lg:block">{hero.chips[0]}</span>}
          {hero.chips[1] && <span className="absolute -right-[10%] bottom-[14%] hidden rounded-full border border-brand-line bg-brand-surface/90 px-3.5 py-2 text-xs text-brand-mint backdrop-blur lg:block">{hero.chips[1]}</span>}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center sm:flex">
        <div className="animate-bounce-slow h-9 w-5 rounded-full border border-brand-line">
          <div className="mx-auto mt-1.5 h-2 w-1 rounded-full bg-brand-mint" />
        </div>
      </div>
    </section>
  )
}
