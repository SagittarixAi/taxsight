import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center fade-in">
      {icon && <div className="text-[#8B8599] mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-[#1A1523] mb-2">{title}</h3>
      {description && <p className="text-[#8B8599] text-sm max-w-md mb-6">{description}</p>}
      {action}
    </div>
  )
}
