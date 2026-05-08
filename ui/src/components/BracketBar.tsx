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

export default function BracketBar({ brackets, totalIncome }: BracketBarProps) {
  const formattedIncome = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalIncome)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1A1523]">Marginal Tax Rate Breakdown</h3>
        <span className="text-xs text-[#8B8599]">Income: <span className="tabular-nums font-medium text-[#1A1523]">{formattedIncome}</span></span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-[#F0EFF3] mb-3">
        {brackets.map((bracket, i) => (
          <div
            key={i}
            className="h-full transition-all duration-500"
            style={{
              width: `${bracket.width}%`,
              backgroundColor: ['#8B6CE8', '#6C3CE1', '#5528B8', '#3D1A8A', '#2C0F66'][i] || '#6C3CE1',
            }}
            title={`${bracket.label}: ${bracket.rate}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {brackets.map((bracket, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: ['#8B6CE8', '#6C3CE1', '#5528B8', '#3D1A8A', '#2C0F66'][i] || '#6C3CE1' }}
            />
            <span className="text-xs text-[#8B8599]">
              {bracket.label} <span className="font-medium text-[#1A1523]">{bracket.rate}</span>
              {bracket.incomeInBracket > 0 && (
                <span className="ml-1 text-[#3D364A] tabular-nums">
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
