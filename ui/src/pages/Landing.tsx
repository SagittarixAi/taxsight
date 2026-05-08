import { Link } from 'react-router-dom'
import { Brain, DollarSign, FileCheck, ChevronRight, BarChart3, Shield } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8F7FA]">
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#6C3CE1] rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-base">TS</span>
          </div>
          <span className="text-xl font-extrabold text-[#1A1523] tracking-tight">TaxSight</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[#3D364A] hover:text-[#6C3CE1] transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-lg hover:bg-[#E55A25] transition-all hover:shadow-lg hover:shadow-[#FF6B35]/25"
          >
            Get started free
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-12 pt-20 pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F0FC] rounded-full text-xs font-semibold text-[#6C3CE1] mb-8">
          <Brain size={14} />
          Powered by SaggitarixAI
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#1A1523] tracking-tight leading-[1.05] mb-6">
          See what you're owed.
        </h1>
        <p className="text-lg md:text-xl text-[#8B8599] max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered tax clarity that scans your documents, estimates your refund, and simplifies filing — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-[#FF6B35] text-white text-base font-semibold rounded-xl hover:bg-[#E55A25] transition-all hover:shadow-lg hover:shadow-[#FF6B35]/25 inline-flex items-center gap-2"
          >
            Get started free
            <ChevronRight size={18} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 bg-white border border-[#E5E4E7] text-[#1A1523] text-base font-semibold rounded-xl hover:border-[#6C3CE1] hover:text-[#6C3CE1] transition-all"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-interactive p-8 rounded-xl">
            <div className="w-12 h-12 bg-[#E6FAF6] rounded-xl flex items-center justify-center text-[#00A88F] mb-5">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1523] mb-3">AI Document Scanning</h3>
            <p className="text-[#8B8599] leading-relaxed text-sm">
              Upload W-2s, 1099s, and receipts. Our AI extracts every relevant detail automatically — no manual entry.
            </p>
          </div>
          <div className="card-interactive p-8 rounded-xl">
            <div className="w-12 h-12 bg-[#FFF3ED] rounded-xl flex items-center justify-center text-[#E55A25] mb-5">
              <DollarSign size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1523] mb-3">Smart Refund Estimates</h3>
            <p className="text-[#8B8599] leading-relaxed text-sm">
              Get real-time refund estimates with confidence intervals. Know exactly what to expect before you file.
            </p>
          </div>
          <div className="card-interactive p-8 rounded-xl">
            <div className="w-12 h-12 bg-[#F4F0FC] rounded-xl flex items-center justify-center text-[#5528B8] mb-5">
              <FileCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1523] mb-3">Simple Filing</h3>
            <p className="text-[#8B8599] leading-relaxed text-sm">
              Export ready-to-file reports with bracket breakdowns and deduction comparisons. Tax filing made easy.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-28 max-w-7xl mx-auto">
        <div className="card p-10 rounded-2xl bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1523] tracking-tight mb-4">Why TaxSight?</h2>
            <p className="text-[#8B8599] max-w-xl mx-auto">Built on advanced AI models to give you clarity and confidence at tax time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#F4F0FC] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={24} className="text-[#6C3CE1]" />
              </div>
              <h4 className="font-bold text-[#1A1523] mb-2">Real-Time Estimates</h4>
              <p className="text-sm text-[#8B8599]">See your projected refund update as you add documents and data.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#E6FAF6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-[#00A88F]" />
              </div>
              <h4 className="font-bold text-[#1A1523] mb-2">Bank-Level Security</h4>
              <p className="text-sm text-[#8B8599]">Your tax data is encrypted end-to-end. Privacy is built into our core.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FFF3ED] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign size={24} className="text-[#E55A25]" />
              </div>
              <h4 className="font-bold text-[#1A1523] mb-2">Maximize Your Return</h4>
              <p className="text-sm text-[#8B8599]">AI finds every deduction and credit you qualify for.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E4E7] py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8B8599]">TaxSight by <span className="font-semibold text-[#1A1523]">SaggitarixAI</span></p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#8B8599]">Privacy Policy</span>
            <span className="text-xs text-[#8B8599]">Terms of Service</span>
            <span className="text-xs text-[#8B8599]">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
