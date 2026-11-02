import { useEffect, useState } from 'react'
/** Thin gradient bar across the very top of the viewport, filling as the visitor scrolls down the page. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (scrolled / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="fixed left-0 top-0 z-[60] h-[3px] bg-brand-grad transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
}
