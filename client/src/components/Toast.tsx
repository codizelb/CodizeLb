import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

/** A small success popup, fixed to the viewport corner. Auto-dismisses after 5s or on click. */
export function Toast({ show, message, onClose }: { show: boolean; message: string; onClose: () => void }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [show, onClose])
  return (
    <div
      role="status" aria-live="polite"
      className={`fixed inset-x-4 bottom-6 z-[100] mx-auto flex max-w-sm items-start gap-3 rounded-xl border border-brand-mint/30 bg-brand-surface p-4 shadow-glow transition-all duration-500 ease-out sm:inset-x-auto sm:right-6 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
    >
      <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={20} />
      <p className="flex-1 text-sm text-brand-text">{message}</p>
      <button onClick={onClose} aria-label="Dismiss" className="text-brand-muted transition hover:text-brand-text"><X size={16} /></button>
    </div>
  )
}
