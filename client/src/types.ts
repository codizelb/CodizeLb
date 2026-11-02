export interface Social { label: string; url: string; title: string }
export interface Site { name: string; blurb: string; email: string; phone: string; location: string; logo: string; social: Social[] }
export interface Seo { title: string; description: string }
export interface Hero { eyebrow: string; title: string; highlight: string; subtitle: string; primaryCta: string; secondaryCta: string; secondaryHref: string; tags: string[]; chips: string[] }
export interface SectionCfg { id: string; enabled: boolean; eyebrow: string; title: string; highlight: string; sub: string }
export interface NavItem { label: string; href: string }
export interface Pillar { icon: string; title: string; description: string }
export interface Service { icon: string; title: string; description: string }
export interface Project { name: string; category: string; description: string; tech: string[]; icon: string; image: string; url: string }
export interface Testimonial { quote: string; name: string; position: string; company: string }
export interface Faq { q: string; a: string }
export interface Stat { value: number; suffix: string; label: string }
export interface Step { title: string; description: string }
export interface Why { title: string; detail: string }
export interface TechGroup { group: string; items: string[] }
/** Everything here is stored in MySQL and edited from /admin. Nothing is hardcoded in the UI. */
export interface Content { site: Site; seo: Seo; hero: Hero; nav: NavItem[]; sections: SectionCfg[]; pillars: Pillar[]; stats: Stat[]; services: Service[]; why: Why[]; tech: TechGroup[]; process: Step[]; projects: Project[]; testimonials: Testimonial[]; faq: Faq[] }