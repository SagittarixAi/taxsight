import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Wallet, Brain, Upload, ChevronRight, ChartBar, Calculator } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import api from '../api/client'
import KpiCard from '../components/KpiCard'
import BracketBar from '../components/BracketBar'
import EmptyState from '../components/EmptyState'


const sparkData = [{ v: 2100 }, { v: 2250 }, { v: 2180 }, { v: 2400 }, { v: 2350 }, { v: 2500 }, { v: 2450 }]

const placeholderBrackets = [
  { label: '10%', min: 0, max: 11600, rate: '10%', width: 32, incomeInBracket: 0 },
  { label: '12%', min: 11601, max: 47150, rate: '12%', width: 38, incomeInBracket: 0 },
  { label: '22%', min: 47151, max: 100525, rate: '22%', width: 22, incomeInBracket: 0 },
  { label: '24%', min: 100526, max: 191950, rate: '24%', width: 8, incomeInBracket: 0 },
]

const recentActivity = [
  { date: 'Apr 12, 2026', description: 'W-2 uploaded', status: 'complete' },
  { date: 'Apr 11, 2026', description: '1099-NEC processed', status: 'complete' },
  { date: 'Apr 10, 2026', description: 'Review prepared', status: 'complete' },
  { date: 'Apr 08, 2026', description: 'Account created', status: 'complete' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [hasData, setHasData] = useState<boolean | null>(null)
  const [calculations, setCalculations] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    api.get('/calculations/list')
      .then((res) => {
        setCalculations(res.data)
        setHasData(res.data.length > 0)
      })
      .catch(() => {
        setHasData(false)
      })
  }, [navigate])

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

  if (!hasData || calculations.length === 0) {
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

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(n))

  return (
    <div className="space-y-8 fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Your tax overview at a glance</p>
        </div>
        <span className="text-xs text-ink-muted bg-surface-white rounded-lg px-3 py-1.5 border border-border shadow-sm">
          Last updated: just now
        </span>
      </div>

      {calculations[0]?.refund_or_owed != null ? null : (
        <div className="card p-6 bg-gradient-to-r from-primary-bg to-accent-bg border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink">Documents uploaded — ready for calculation</p>
              <p className="text-xs text-ink-muted mt-0.5">Run a review to see your potential tax picture</p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/calculations')}>
              <Calculator size={16} />
              Run Calculation
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KpiCard
          title="Refund Estimate"
          value={calculations[0]?.refund_or_owed != null ? fmt(calculations[0].refund_or_owed) : '—'}
          subtitle={calculations[0]?.refund_or_owed != null ? '±$200 estimated range' : 'Ready to review'}
          trend="up"
          trendValue={calculations[0]?.refund_or_owed != null ? '+$320 from last year' : undefined}
          icon={<DollarSign size={20} />}
          color="teal"
        >
          {calculations[0]?.refund_or_owed != null && (
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
          title="Amount Owed"
          value={calculations[0]?.total_tax != null ? fmt(calculations[0].total_tax) : '$0'}
          subtitle={calculations[0]?.total_tax != null ? 'Tax liability calculated' : 'No tax liability detected'}
          trend="neutral"
          icon={<Wallet size={20} />}
          color="amber"
        />

        <KpiCard
          title="AI Status"
          value={calculations[0]?.refund_or_owed != null ? 'Complete' : 'Ready'}
          subtitle={calculations[0]?.refund_or_owed != null ? 'All documents processed' : `${calculations[0] ? 'Awaiting calculation' : 'No documents yet'}`}
          icon={<Brain size={20} />}
          color="navy"
        />
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary-bg flex items-center justify-center text-primary">
            <ChartBar size={16} />
          </div>
          <h3 className="font-semibold text-ink">Tax Bracket Breakdown</h3>
        </div>
        <BracketBar brackets={placeholderBrackets} totalIncome={85000} />
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-ink">Recent Activity</h3>
          <button className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Activity</th>
                <th className="text-right py-3 px-4 text-ink-muted font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, i) => (
                <tr key={i} className="border-b border-border-light last:border-0 hover:bg-surface transition-colors duration-150">
                  <td className="py-3.5 px-4 text-ink-muted tabular-nums">{item.date}</td>
                  <td className="py-3.5 px-4 text-ink font-medium">{item.description}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6FAF6] text-[#00A88F] text-xs font-semibold">
                      Complete
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
