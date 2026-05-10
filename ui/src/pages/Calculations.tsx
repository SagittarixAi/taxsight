import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Download, TrendingUp, TrendingDown, FileText, ArrowRight, Upload, FileJson } from 'lucide-react'
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
      <div className="space-y-8">
        <div className="skeleton h-9 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 space-y-4">
            <div className="skeleton h-3 w-28 rounded-sm" />
            <div className="skeleton h-10 w-48 rounded-md" />
            <div className="skeleton h-4 w-40 rounded-sm" />
          </div>
          <div className="card p-8 space-y-4">
            <div className="skeleton h-3 w-32 rounded-sm" />
            <div className="flex justify-between"><div className="skeleton h-4 w-24 rounded-sm" /><div className="skeleton h-4 w-20 rounded-sm" /></div>
            <div className="flex justify-between"><div className="skeleton h-4 w-28 rounded-sm" /><div className="skeleton h-4 w-20 rounded-sm" /></div>
            <div className="border-t pt-3"><div className="skeleton h-5 w-full" /></div>
          </div>
        </div>
        <div className="card p-8 space-y-4">
          <div className="skeleton h-4 w-48 rounded-sm" />
          <div className="skeleton h-8 w-full rounded-md" />
          <div className="skeleton h-3 w-full rounded-sm" />
          <div className="flex gap-6">
            <div className="skeleton h-3 w-20 rounded-sm" />
            <div className="skeleton h-3 w-20 rounded-sm" />
            <div className="skeleton h-3 w-20 rounded-sm" />
          </div>
        </div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <EmptyState
        icon={<FileText size={32} />}
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
    <div className="space-y-8 fade-in max-w-4xl pb-8">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Calculations</h1>
        <p className="text-sm text-ink-muted mt-1">Tax year {calc.tax_year} · Filing {calc.filing_status}</p>
      </div>

      <div className="card p-8 bg-gradient-to-r from-surface-white to-accent-bg/30 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          {isRefund ? <TrendingUp size={20} className="text-accent-dark" /> : <TrendingDown size={20} className="text-error" />}
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            {isRefund ? 'Potential Refund' : 'Amount Owed'}
          </span>
        </div>
        <div className={`text-5xl font-bold tabular-nums tracking-tight ${isRefund ? 'text-accent-dark' : 'text-error'}`}>
          {fmt(refundAmount)}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <p className="text-sm text-ink-muted">
            Effective rate: <span className="font-semibold text-ink">{pct(effectiveRate)}</span>
          </p>
          <span className="text-ink-muted/30">|</span>
          <p className="text-sm text-ink-muted">
            Marginal: <span className="font-semibold text-ink">{calc.marginal_rate ? pct(calc.marginal_rate * 100) : '—'}</span>
          </p>
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">Income & Deduction Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted">Gross Income</span>
            <span className="text-sm font-semibold text-ink tabular-nums">{fmt(calc.gross_income)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted">Total Deductions</span>
            <span className="text-sm font-semibold text-ink tabular-nums">−{fmt(calc.total_deductions)}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-ink">Taxable Income</span>
            <span className="text-sm font-bold text-ink tabular-nums">{fmt(taxableIncome)}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-ink">Total Tax</span>
            <span className="text-sm font-bold text-ink tabular-nums">{fmt(calc.total_tax ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">Marginal Tax Rate Breakdown</h3>
        <BracketBar brackets={brackets} totalIncome={taxableIncome} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">Standard Deduction</h3>
          <div className="text-2xl font-bold text-ink tabular-nums mb-2">{fmt(calc.standard_deduction ?? 0)}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">Itemized Deductions</h3>
          <div className="text-2xl font-bold text-ink tabular-nums mb-2">{fmt(calc.itemized_deductions ?? 0)}</div>
          <p className="text-xs text-ink-muted">
            Better off with{' '}
            <span className="font-semibold text-ink">
              {((calc.standard_deduction ?? 0) >= (calc.itemized_deductions ?? 0)) ? 'Standard' : 'Itemized'}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-primary">
          <Download size={16} />
          Export PDF
        </button>
        <button className="btn-outline">
          <FileJson size={16} />
          Export Data
        </button>
      </div>

      {calculations.length > 1 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Previous Calculations</h3>
          <div className="space-y-2">
            {calculations.slice(1).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-border-light transition-colors duration-150 cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-ink">{c.tax_year}</span>
                  <span className="text-xs text-ink-muted ml-2">{c.filing_status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold tabular-nums ${(c.refund_or_owed ?? 0) > 0 ? 'text-accent-dark' : 'text-error'}`}>
                    {fmt(Math.abs(c.refund_or_owed ?? 0))}
                  </span>
                  <ArrowRight size={14} className="text-ink-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
