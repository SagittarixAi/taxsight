import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
  color: 'teal' | 'amber' | 'navy'
  children?: ReactNode
}

const colorConfig = {
  teal: { bg: 'bg-accent-bg', text: 'text-accent-dark', border: 'border-accent/20' },
  amber: { bg: 'bg-secondary-bg', text: 'text-secondary-dark', border: 'border-secondary/20' },
  navy: { bg: 'bg-primary-bg', text: 'text-primary-dark', border: 'border-primary/20' },
}

export default function KpiCard({ title, value, subtitle, trend, trendValue, icon, color, children }: KpiCardProps) {
  const c = colorConfig[color]

  return (
    <div className={`card p-8 border-t-2 ${c.border} flex flex-col gap-4 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-muted tracking-widest uppercase">{title}</span>
        {icon && <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>{icon}</div>}
      </div>
      <div className="text-4xl font-bold text-ink tabular-nums tracking-tight leading-none">{value}</div>
      {subtitle && (
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp size={14} className={c.text} />}
          {trend === 'down' && <TrendingDown size={14} className={c.text} />}
          <span className="text-sm text-ink-muted">{subtitle}</span>
          {trendValue && (
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-accent-dark' : trend === 'down' ? 'text-error' : 'text-ink-muted'}`}>
              {trendValue}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
