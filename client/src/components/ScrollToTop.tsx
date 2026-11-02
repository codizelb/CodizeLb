import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
/** Floating button that fades in once the visitor scrolls past the hero, scrolls smoothly to top. */
export function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-brand-line bg-brand-surface text-brand-mint shadow-glow transition-all duration-400 ease-out hover:-translate-y-1 hover:border-brand-mint/50 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp size={18} />
    </button>
  )
}
