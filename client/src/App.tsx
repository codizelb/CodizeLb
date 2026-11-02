import type { ReactElement } from 'react'
import { ContentProvider, useContent } from './content'
import { ScrollProgress } from './components/ScrollProgress'
import { ScrollToTop } from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Technologies from './components/Technologies'
import Process from './components/Process'
import Projects from './components/Projects'
import About from './components/About'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './admin/Admin'
const registry: Record<string, ReactElement> = { services: <Services />, why: <WhyChooseUs />, tech: <Technologies />, process: <Process />, projects: <Projects />, about: <About />, testimonials: <Testimonials />, faq: <FAQ />, contact: <Contact /> }
/** Section order and visibility come from the backend (admin → Sections). */
function Site() {
  const { sections } = useContent()
  return (<><ScrollProgress /><Navbar /><main><Hero />{sections.filter(s => s.enabled).map(s => <div key={s.id}>{registry[s.id]}</div>)}</main><Footer /><ScrollToTop /></>)
}
export default function App() {
  if (window.location.pathname.startsWith('/admin')) return <Admin />
  return <ContentProvider><Site /></ContentProvider>
}
