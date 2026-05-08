import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
  color: 'teal' | 'amber' | 'purple'
  children?: ReactNode
}

const colorConfig = {
  teal: { bg: 'bg-[#E6FAF6]', text: 'text-[#00A88F]', border: 'border-[#00D5B3]/20' },
  amber: { bg: 'bg-[#FFF3ED]', text: 'text-[#E55A25]', border: 'border-[#FF6B35]/20' },
  purple: { bg: 'bg-[#F4F0FC]', text: 'text-[#5528B8]', border: 'border-[#6C3CE1]/20' },
}

export default function KpiCard({ title, value, subtitle, trend, trendValue, icon, color, children }: KpiCardProps) {
  const c = colorConfig[color]

  return (
    <div className={`card p-6 border-t-2 ${c.border} flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#8B8599] tracking-wide uppercase">{title}</span>
        {icon && <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>{icon}</div>}
      </div>
      <div className="text-3xl font-extrabold text-[#1A1523] tabular-nums tracking-tight">{value}</div>
      {subtitle && (
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp size={14} className={c.text} />}
          {trend === 'down' && <TrendingDown size={14} className={c.text} />}
          <span className="text-sm text-[#8B8599]">{subtitle}</span>
          {trendValue && (
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-[#00A88F]' : trend === 'down' ? 'text-[#E53E3E]' : 'text-[#8B8599]'}`}>
              {trendValue}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
