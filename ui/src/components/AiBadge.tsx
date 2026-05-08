import { Sparkles } from 'lucide-react'

export default function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full tracking-wide">
      <Sparkles size={12} />
      AI
    </span>
  )
}
