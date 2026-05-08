interface MoneyDisplayProps {
  value: number
  className?: string
  showSign?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm font-medium',
  md: 'text-lg font-semibold',
  lg: 'text-2xl font-bold',
  xl: 'text-4xl font-extrabold',
}

export default function MoneyDisplay({ value, className = '', showSign = true, size = 'md' }: MoneyDisplayProps) {
  const absValue = Math.abs(value)
  const isNegative = value < 0
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absValue)

  const sign = showSign ? (isNegative ? '−' : '+') : ''
  const color = isNegative ? 'text-[#E53E3E]' : 'text-[#00D5B3]'

  return (
    <span className={`money tabular-nums ${color} ${sizeClasses[size]} ${className}`}>
      {showSign ? sign : ''}{formatted}
    </span>
  )
}
