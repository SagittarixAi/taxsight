type Status = 'processing' | 'complete' | 'error' | 'pending' | 'ready'

const statusConfig: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  processing: { label: 'Processing', bg: 'bg-[#F4F0FC]', text: 'text-[#6C3CE1]', dot: 'bg-[#6C3CE1] animate-pulse' },
  complete: { label: 'Complete', bg: 'bg-[#E6FAF6]', text: 'text-[#00A88F]', dot: 'bg-[#00D5B3]' },
  error: { label: 'Error', bg: 'bg-[#FFF5F5]', text: 'text-[#E53E3E]', dot: 'bg-[#E53E3E]' },
  pending: { label: 'Pending', bg: 'bg-[#FFF3ED]', text: 'text-[#E55A25]', dot: 'bg-[#FF6B35]' },
  ready: { label: 'Ready', bg: 'bg-[#E6FAF6]', text: 'text-[#00A88F]', dot: 'bg-[#00D5B3]' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
