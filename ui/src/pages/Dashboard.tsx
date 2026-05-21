import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Wallet, Brain, Upload, ChartBar, Calculator } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import api from '../api/client'
import KpiCard from '../components/KpiCard'
import BracketBar from '../components/BracketBar'
import EmptyState from '../components/EmptyState'

interface TaxSummary {
  id: number
  user_id: number
  tax_year: number
  gross_income: number
  total_deductions: number
  estimated_tax: number
  estimated_refund: number
  status: string
  created_at: string
}

function computeEffectiveRate(grossIncome: number, tax: number): number {
  if (!grossIncome || grossIncome === 0) return 0
  return (tax / grossIncome) * 100
}

function computeMarginalRate(grossIncome: number): number {
  if (!grossIncome) return 0
  if (grossIncome <= 11600) return 10
  if (grossIncome <= 47150) return 12
  if (grossIncome <= 100525) return 22
  if (grossIncome <= 191950) return 24
  if (grossIncome <= 243725) return 32
  if (grossIncome <= 609350) return 35
  return 37
}

function buildBrackets(summary: TaxSummary) {
  const income = summary.gross_income
  const brackets = [
    { label: '10%', min: 0, max: 11600, rate: '10%' },
    { label: '12%', min: 11601, max: 47150, rate: '12%' },
    { label: '22%', min: 47151, max: 100525, rate: '22%' },
    { label: '24%', min: 100526, max: 191950, rate: '24%' },
    { label: '32%', min: 191951, max: 243725, rate: '32%' },
    { label: '35%', min: 243726, max: 609350, rate: '35%' },
    { label: '37%', min: 609351, max: Infinity, rate: '37%' },
  ]

  const lastApplicable = brackets.findIndex(b => income <= b.max)
  const applicableBrackets = lastApplicable >= 0 ? brackets.slice(0, lastApplicable + 1) : brackets

  return applicableBrackets.map((b) => {
    const incomeIn = Math.max(0, Math.min(income, b.max) - b.min)
    const width = income > 0 ? (incomeIn / income) * 100 : 0
    return { ...b, incomeInBracket: incomeIn, width: Math.max(5, Math.round(width)) }
  })
}

// Build a 7-point sparkline from a single summary
function buildSparkline(summary: TaxSummary) {
  const v = summary.estimated_refund || summary.estimated_tax || 0
  return Array.from({ length: 7 }, (_, i) => ({
    v: v + (i - 3) * (v * 0.05),
  }))
}

export default function Dashboard({ refreshToggle }: { refreshToggle?: number }) {
  const navigate = useNavigate()
  const [hasData, setHasData] = useState<boolean | null>(null)
  const [summaries, setSummaries] = useState<TaxSummary[]>([])
  const [brackets, setBrackets] = useState<ReturnType<typeof buildBrackets> | null>(null)

  const load = () => {
    api.get('/calculations/list')
      .then((res) => {
        const list: TaxSummary[] = res.data?.summaries ?? res.data ?? []
        setSummaries(list)
        setHasData(list.length > 0)
        if (list.length > 0) {
          setBrackets(buildBrackets(list[0]))
        }
      })
      .catch(() => {
        setHasData(false)
      })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    load()
  }, [navigate, refreshToggle])

  const latest = summaries[0]
  const effectiveRate = latest ? computeEffectiveRate(latest.gross_income, latest.estimated_tax) : 0
  const marginalRate = latest ? computeMarginalRate(latest.gross_income) : 0
  const sparkData = latest ? buildSparkline(latest) : []

  if (hasData === null) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-9 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-8 space-y-4">
              <div className="skeleton h-3 w-24 rounded-sm" />
              <div className="skeleton h-10 w-44 rounded-md" />
              <div className="skeleton h-4 w-32 rounded-sm" />
            </div>
          ))}
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
        icon={<Upload size={32} />}
        title="Upload your first document to get started"
        description="Upload W-2s, 1099s, or receipts and let our AI analyze your tax situation."
        action={
          <button className="btn-primary" onClick={() => navigate('/upload')}>
            <Upload size={16} />
            Upload documents
          </button>
        }
      />
    )
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(Math.abs(n))

  const owedAmount = latest.estimated_tax - latest.estimated_refund
  const isRefund = latest.estimated_refund > 0 && owedAmount <= 0

  return (
    <div className="space-y-8 fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Your tax overview at a glance</p>
        </div>
        <span className="text-xs text-ink-muted bg-surface-white rounded-lg px-3 py-1.5 border border-border shadow-sm">
          <span className="tabular-nums">{latest.tax_year}</span> tax year
        </span>
      </div>

      <div className="card p-6 bg-gradient-to-r from-primary-bg to-accent-bg border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink">
              {isRefund
                ? `Estimated refund of ${fmt(latest.estimated_refund)}`
                : `Estimated tax of ${fmt(latest.estimated_tax)}`}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              {effectiveRate.toFixed(1)}% effective · {marginalRate}% marginal bracket
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/calculations')}>
            <Calculator size={16} />
            Full Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KpiCard
          title={isRefund ? 'Refund Estimate' : 'Tax Owed'}
          value={isRefund ? fmt(latest.estimated_refund) : fmt(owedAmount)}
          subtitle={`${latest.tax_year} tax year`}
          trend={isRefund ? 'up' : 'neutral'}
          icon={<DollarSign size={20} />}
          color="teal"
        >
          {sparkData.length > 0 && (
            <div className="h-12 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="v" stroke="#00D5B3" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </KpiCard>

        <KpiCard
          title="Total Deductions"
          value={fmt(latest.total_deductions)}
          subtitle="Claimed this year"
          trend="neutral"
          icon={<Wallet size={20} />}
          color="amber"
        />

        <KpiCard
          title="AI Status"
          value="Complete"
          subtitle={`${summaries.length} calculation${summaries.length > 1 ? 's' : ''} on file`}
          icon={<Brain size={20} />}
          color="navy"
        />
      </div>

      {brackets && brackets.length > 0 && (
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary-bg flex items-center justify-center text-primary">
              <ChartBar size={16} />
            </div>
            <h3 className="font-semibold text-ink">Tax Bracket Breakdown</h3>
          </div>
          <BracketBar brackets={brackets} totalIncome={latest.gross_income} />
        </div>
      )}

      <div className="card p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-ink">Saved Calculations</h3>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Year</th>
                <th className="text-left py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Gross Income</th>
                <th className="text-left py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Deductions</th>
                <th className="text-right py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Tax</th>
                <th className="text-right py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((s) => (
                <tr key={s.id} className="border-b border-border-light last:border-0 hover:bg-surface transition-colors duration-150">
                  <td className="py-3.5 px-4 text-ink-muted tabular-nums">{s.tax_year}</td>
                  <td className="py-3.5 px-4 text-ink font-medium">{fmt(s.gross_income)}</td>
                  <td className="py-3.5 px-4 text-ink font-medium">{fmt(s.total_deductions)}</td>
                  <td className="py-3.5 px-4 text-right text-ink font-medium">{fmt(s.estimated_tax)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6FAF6] text-[#00A88F] text-xs font-semibold">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
