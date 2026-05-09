interface Bracket {
  label: string
  min: number
  max: number | null
  rate: string
  width: number
  incomeInBracket: number
}

interface BracketBarProps {
  brackets: Bracket[]
  totalIncome: number
}

const navyShades = ['#3D6A8E', '#1E3A5F', '#1A2F4D', '#132A47', '#0D1F33']

export default function BracketBar({ brackets, totalIncome }: BracketBarProps) {
  const formattedIncome = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalIncome)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-muted uppercase tracking-widest font-semibold">Taxable Income</span>
        <span className="text-sm tabular-nums font-bold text-ink">{formattedIncome}</span>
      </div>
      <div className="flex h-4 rounded-full overflow-hidden bg-border-light mb-4 shadow-inner">
        {brackets.map((bracket, i) => (
          <div
            key={i}
            className="h-full transition-all duration-500"
            style={{
              width: `${bracket.width}%`,
              backgroundColor: navyShades[i] || navyShades[1],
            }}
            title={`${bracket.label}: ${bracket.rate}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {brackets.map((bracket, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: navyShades[i] || navyShades[1] }}
            />
            <span className="text-xs text-ink-muted">
              {bracket.label}{' '}
              <span className="font-semibold text-ink">{bracket.rate}</span>
              {bracket.incomeInBracket > 0 && (
                <span className="ml-1 text-ink-light tabular-nums">
                  (${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(bracket.incomeInBracket)})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
