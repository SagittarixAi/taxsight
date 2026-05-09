import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center fade-in">
      {icon && (
        <div className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-bg to-accent-bg border border-border flex items-center justify-center text-ink-muted">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      {description && <p className="text-ink-muted text-sm max-w-md mb-8 leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}
