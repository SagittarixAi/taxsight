import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Wallet, Brain, Upload, ChevronRight } from 'lucide-react'
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
  { date: 'Apr 10, 2026', description: 'Refund estimate generated', status: 'complete' },
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
    api.get('/calculations/')
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-9 w-40" />
              <div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
        <div className="card p-6 space-y-3">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!hasData || calculations.length === 0) {
    return (
      <EmptyState
        icon={<Upload size={48} />}
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

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1523] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#8B8599] mt-1">Your tax overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Refund Estimate"
          value="$2,450"
          subtitle="±$200 confidence interval"
          trend="up"
          trendValue="+$320 from last year"
          icon={<DollarSign size={18} />}
          color="teal"
        >
          <div className="h-10 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey="v" stroke="#00D5B3" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </KpiCard>

        <KpiCard
          title="Amount Owed"
          value="$0"
          subtitle="No tax liability detected"
          trend="neutral"
          icon={<Wallet size={18} />}
          color="amber"
        />

        <KpiCard
          title="AI Status"
          value="Ready"
          subtitle="All documents processed"
          icon={<Brain size={18} />}
          color="purple"
        />
      </div>

      <div className="card p-6">
        <BracketBar brackets={placeholderBrackets} totalIncome={85000} />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1A1523]">Recent Activity</h3>
          <button className="text-xs font-medium text-[#6C3CE1] hover:text-[#5528B8] flex items-center gap-1 transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E4E7]">
                <th className="text-left py-3 px-3 text-[#8B8599] font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-3 text-[#8B8599] font-medium text-xs uppercase tracking-wider">Activity</th>
                <th className="text-right py-3 px-3 text-[#8B8599] font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, i) => (
                <tr key={i} className="border-b border-[#F0EFF3] last:border-0 hover:bg-[#F8F7FA] transition-colors">
                  <td className="py-3 px-3 text-[#8B8599] tabular-nums">{item.date}</td>
                  <td className="py-3 px-3 text-[#1A1523] font-medium">{item.description}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6FAF6] text-[#00A88F] text-xs font-medium">
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
