import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Download, TrendingUp, TrendingDown, FileText, ArrowRight, Upload } from 'lucide-react'
import api from '../api/client'
import BracketBar from '../components/BracketBar'
import EmptyState from '../components/EmptyState'

interface CalcResult {
  id: number
  tax_year: number
  gross_income: number
  total_deductions: number
  filing_status: string
  taxable_income?: number
  total_tax?: number
  effective_rate?: number
  marginal_rate?: number
  standard_deduction?: number
  itemized_deductions?: number
  refund_or_owed?: number
}

export default function Calculations() {
  const navigate = useNavigate()
  const [calculations, setCalculations] = useState<CalcResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    api.get('/calculations/')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data]
        setCalculations(data)
        setHasData(data.length > 0)
      })
      .catch(() => {
        setCalculations([])
        setHasData(false)
      })
      .finally(() => setIsLoading(false))
  }, [navigate])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32" />
        <div className="card p-6 space-y-3">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-10 w-64" />
        </div>
        <div className="card p-6 space-y-3">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        title="No calculations yet"
        description="Upload documents and run a calculation to see your tax breakdown."
        action={
          <Link to="/upload" className="btn-primary">
            <Upload size={16} />
            Upload documents
          </Link>
        }
      />
    )
  }

  const calc = calculations[0]
  const isRefund = (calc.refund_or_owed ?? 0) > 0
  const refundAmount = Math.abs(calc.refund_or_owed ?? 0)
  const taxableIncome = calc.taxable_income ?? calc.gross_income - (calc.total_deductions ?? 0)
  const effectiveRate = calc.effective_rate ?? ((calc.total_tax ?? 0) / Math.max(taxableIncome, 1) * 100)

  const brackets = [
    { label: '10%', min: 0, max: 11600, rate: '10%', width: 10, incomeInBracket: Math.min(taxableIncome * 0.1, 11600) },
    { label: '12%', min: 11601, max: 47150, rate: '12%', width: 40, incomeInBracket: taxableIncome > 11600 ? Math.min((taxableIncome - 11600) * 0.12, 47150 - 11600) : 0 },
    { label: '22%', min: 47151, max: 100525, rate: '22%', width: 35, incomeInBracket: taxableIncome > 47150 ? (taxableIncome - 47150) * 0.22 : 0 },
    { label: '24%', min: 100526, max: 191950, rate: '24%', width: 15, incomeInBracket: 0 },
  ]

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  const pct = (n: number) => n.toFixed(1) + '%'

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1523] tracking-tight">Calculations</h1>
        <p className="text-sm text-[#8B8599] mt-1">Tax year {calc.tax_year} · Filing {calc.filing_status}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`card p-6 border-t-2 ${isRefund ? 'border-[#00D5B3]' : 'border-[#E53E3E]'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isRefund ? <TrendingUp size={16} className="text-[#00A88F]" /> : <TrendingDown size={16} className="text-[#E53E3E]" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B8599]">
              {isRefund ? 'Estimated Refund' : 'Amount Owed'}
            </span>
          </div>
          <div className={`text-4xl font-extrabold tabular-nums tracking-tight ${isRefund ? 'text-[#00A88F]' : 'text-[#E53E3E]'}`}>
            {fmt(refundAmount)}
          </div>
          <p className="text-sm text-[#8B8599] mt-2">
            Effective rate: <span className="font-semibold text-[#1A1523]">{pct(effectiveRate)}</span>
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8599] mb-4">Income & Deduction Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8B8599]">Gross Income</span>
              <span className="text-sm font-semibold text-[#1A1523] tabular-nums">{fmt(calc.gross_income)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8B8599]">Total Deductions</span>
              <span className="text-sm font-semibold text-[#1A1523] tabular-nums">−{fmt(calc.total_deductions)}</span>
            </div>
            <div className="border-t border-[#E5E4E7] pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-[#1A1523]">Taxable Income</span>
              <span className="text-sm font-bold text-[#1A1523] tabular-nums">{fmt(taxableIncome)}</span>
            </div>
            <div className="border-t border-[#E5E4E7] pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-[#1A1523]">Total Tax</span>
              <span className="text-sm font-bold text-[#1A1523] tabular-nums">{fmt(calc.total_tax ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <BracketBar brackets={brackets} totalIncome={taxableIncome} />
        <div className="mt-4 flex items-center gap-2 text-sm text-[#8B8599]">
          <span>Marginal rate: <span className="font-semibold text-[#1A1523]">{calc.marginal_rate ? pct(calc.marginal_rate * 100) : '—'}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8599] mb-3">Standard Deduction</h3>
          <div className="text-2xl font-extrabold text-[#1A1523] tabular-nums mb-2">{fmt(calc.standard_deduction ?? 0)}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8599] mb-3">Itemized Deductions</h3>
          <div className="text-2xl font-extrabold text-[#1A1523] tabular-nums mb-2">{fmt(calc.itemized_deductions ?? 0)}</div>
          <p className="text-xs text-[#8B8599]">
            Better off with <span className="font-semibold text-[#1A1523]">
              {((calc.standard_deduction ?? 0) >= (calc.itemized_deductions ?? 0)) ? 'Standard' : 'Itemized'}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-primary">
          <Download size={16} />
          Download PDF
        </button>
        <button className="btn-outline">
          Save Report
        </button>
      </div>

      {calculations.length > 1 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#1A1523] mb-3">All Calculations</h3>
          <div className="space-y-2">
            {calculations.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F7FA]">
                <div>
                  <span className="text-sm font-medium text-[#1A1523]">{c.tax_year}</span>
                  <span className="text-xs text-[#8B8599] ml-2">{c.filing_status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold tabular-nums ${(c.refund_or_owed ?? 0) > 0 ? 'text-[#00A88F]' : 'text-[#E53E3E]'}`}>
                    {fmt(Math.abs(c.refund_or_owed ?? 0))}
                  </span>
                  <ArrowRight size={14} className="text-[#8B8599]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
