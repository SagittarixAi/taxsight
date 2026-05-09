import { Link } from 'react-router-dom'
import { Brain, DollarSign, FileCheck, ChevronRight, Upload, ClipboardList, ArrowRight, Lock, Shield, Trash2, ArrowDown, Briefcase, Zap, Building2, Home, Car, Sparkles, FileText, Star, Check } from 'lucide-react'

const testimonials = [
  {
    name: `Sarah K.`,
    role: `Freelance Designer`,
    quote: `TaxSight found $1,200 in missed deductions. The confidence meter alone is worth it.`,
    impact: `$1,200 found`,
  },
  {
    name: `Marcus T.`,
    role: `Small Business Owner`,
    quote: `TaxSight organized every 1099 and expense receipt in one place. My CPA was impressed.`,
    impact: `Saved 4+ hours`,
  },
  {
    name: `Elena R.`,
    role: `Rideshare Driver`,
    quote: `I was dreading tax season. TaxSight figured everything out in minutes. I paid less than expected.`,
    impact: `$840 saved`,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="px-6 lg:px-16 py-6 lg:py-7 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">TS</span>
          </div>
          <span className="font-display text-3xl font-extrabold text-ink tracking-tight">TaxSight</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 lg:gap-10">
          <a href="#features" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Pricing</a>
          <a href="#security" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Security</a>
          <a href="#how-it-works" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">How it works</a>
          <a href="#faq" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-ink-muted hover:text-primary transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary-dark transition-all hover:shadow-secondary hover:shadow-lg"
          >
            Get started free
          </Link>
        </div>
      </header>

      <section className="relative px-6 lg:px-16 pt-28 lg:pt-36 pb-40 lg:pb-48 max-w-7xl mx-auto w-full min-h-[75vh] lg:min-h-[85vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/30 to-transparent pointer-events-none" />
        <div className="relative w-full lg:w-5/12 animate-[fadeInUp_0.6s_ease-out]">
          <h1 className="font-display text-5xl lg:text-6xl lg:leading-[1.1] font-extrabold text-ink tracking-tighter leading-[1.05] mb-10 max-w-2xl md:text-center lg:text-left">
            {`See what you're owed.`}
          </h1>
          <p className="text-lg md:text-xl text-ink-muted max-w-lg mb-12 md:text-center lg:text-left leading-relaxed">
            {`AI-powered tax clarity that scans your documents, estimates your refund, and prepares filing-ready summaries \u2014 all in one place.`}
          </p>
          <div className="flex items-center gap-4 flex-wrap mb-8">
            <Link
              to="/register"
              className="px-9 py-4 bg-secondary text-white text-base font-semibold rounded-xl hover:bg-secondary-dark transition-all hover:shadow-secondary hover:shadow-lg inline-flex items-center gap-2"
            >
              Get my refund estimate
              <ChevronRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="px-9 py-4 bg-surface-white border border-border text-ink text-base font-medium rounded-xl hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2"
            >
              See how it works
              <ArrowDown size={18} />
            </a>
          </div>
          <p className="text-sm text-ink-muted font-medium">
            {`Trusted by 5,000+ taxpayers`}
          </p>
          <div className="mt-10 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/32?img=${i}`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-surface -mr-3"
                />
              ))}
            </div>
            <span className="text-sm text-ink-muted font-medium ml-2">+5,000 users</span>
          </div>
        </div>

        <div className="relative w-full lg:w-7/12 animate-[fadeInUp_0.6s_ease-out]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent rounded-2xl blur-3xl -z-10" />

          <div className="relative z-20">
            <div className="relative bg-surface-white border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-primary px-8 py-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                </div>
                <span className="text-white/80 text-sm font-medium ml-2">TaxSight Dashboard</span>
              </div>
              <div className="p-10 md:p-12 lg:p-14">
                <div className="bg-accent-bg rounded-xl p-10 lg:p-12 text-left border border-accent/20 mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-accent-dark" />
                    <span className="text-xs font-semibold text-accent-dark uppercase tracking-wide">Estimated Refund</span>
                  </div>
                  <div className="font-display text-5xl lg:text-6xl font-bold text-ink tracking-tight mb-3">$4,280</div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-ink-muted">{`Range: $3,800 \u2013 $4,600`}</span>
                    <span className="text-xs font-semibold text-accent-dark bg-accent-bg px-3 py-1 rounded-full border border-accent/30">92% confident</span>
                  </div>
                  <div className="w-full h-3 bg-accent/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-accent via-accent-light to-accent rounded-full animate-[shimmer_3s_linear_infinite] bg-[length:200%_100%]" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-2 text-sm text-ink-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span>Documents: 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span>Deductions: 12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span>Tax bracket: 22%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 -top-10 z-10 w-64 bg-surface-white border border-border rounded-2xl shadow-2xl p-6 hidden lg:block animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-primary" />
                <span className="text-sm font-semibold text-ink">Uploaded Docs</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-primary-bg rounded-lg px-4 py-3">
                  <div className="w-3.5 h-3.5 rounded-sm bg-primary/20" />
                  <span className="text-sm text-ink-muted">W-2_2024.pdf</span>
                </div>
                <div className="flex items-center gap-3 bg-primary-bg rounded-lg px-4 py-3">
                  <div className="w-3.5 h-3.5 rounded-sm bg-accent/20" />
                  <span className="text-sm text-ink-muted">1099-NEC.pdf</span>
                </div>
                <div className="flex items-center gap-3 bg-primary-bg rounded-lg px-4 py-3">
                  <div className="w-3.5 h-3.5 rounded-sm bg-secondary/20" />
                  <span className="text-sm text-ink-muted">receipts_Q4.pdf</span>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-16 z-30 bg-accent text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl hidden lg:flex items-center gap-2 animate-[pulse-soft_2.5s_ease-in-out_infinite]">
              <Sparkles size={16} />
              <span>8 deductions detected</span>
            </div>

            <div className="absolute right-6 bottom-20 z-25 bg-surface-white border border-border text-ink text-xs font-semibold px-5 py-3 rounded-xl shadow-2xl hidden lg:flex items-center gap-2 animate-[float_5s_ease-in-out_infinite] translate-x-4 -translate-y-2">
              <DollarSign size={16} className="text-accent" />
              <span>{`Possible deduction: Home Office \u2014 $1,500`}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto w-full">
        <p className="text-sm text-ink-muted text-center tracking-wide uppercase font-medium">
          Built for W-2 employees, 1099 workers, landlords, drivers, and small business owners
        </p>
      </section>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section id="features" className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
          Stop guessing. Know before you file.
        </h2>
        <p className="text-lg text-ink-muted max-w-2xl mb-16 leading-relaxed">
          No spreadsheets. No confusion. Just clear numbers you can act on.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Brain,
              bg: 'bg-accent-bg',
              iconColor: 'text-accent-dark',
              title: `AI Document Scanning`,
              desc: `Upload W-2s, 1099s, and receipts. Our AI extracts every relevant detail automatically \u2014 no manual entry required.`,
            },
            {
              icon: DollarSign,
              bg: 'bg-secondary-bg',
              iconColor: 'text-secondary-dark',
              title: `Smart Refund Estimates`,
              desc: `See hidden deductions instantly. Get real-time refund estimates with a confidence range so you know exactly what to expect.`,
            },
            {
              icon: FileCheck,
              bg: 'bg-primary-bg',
              iconColor: 'text-primary-dark',
              title: `Organized Tax Reports`,
              desc: `Generate filing-ready summaries with bracket breakdowns and deduction comparisons for you or your tax preparer.`,
            },
          ].map(({ icon: Icon, bg, iconColor, title, desc }) => (
            <div
              key={title}
              className="group p-10 lg:p-12 rounded-xl border border-border bg-surface-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
            >
              <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                <Icon size={24} className={iconColor} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-4">{title}</h3>
              <p className="text-ink-muted leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full bg-white">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-lg text-ink-muted max-w-xl mb-16 leading-relaxed">
          Three simple steps to tax clarity.
        </p>
        <div className="flex flex-col md:flex-row gap-20 lg:gap-24">
          {[
            {
              step: `1`,
              icon: Upload,
              bg: 'bg-primary-bg',
              iconColor: 'text-primary',
              badgeBg: 'bg-primary',
              title: `Upload your documents`,
              desc: `Drag and drop your W-2s, 1099s, receipts, and other tax forms. We support all common formats.`,
            },
            {
              step: `2`,
              icon: ClipboardList,
              bg: 'bg-accent-bg',
              iconColor: 'text-accent-dark',
              badgeBg: 'bg-accent',
              title: `AI scans and organizes`,
              desc: `TaxSight extracts every relevant detail and automatically organizes your data \u2014 no manual typing.`,
            },
            {
              step: `3`,
              icon: FileCheck,
              bg: 'bg-secondary-bg',
              iconColor: 'text-secondary-dark',
              badgeBg: 'bg-secondary',
              title: `Review and export`,
              desc: `Review your estimates and generate organized tax reports for you or your preparer in one click.`,
            },
          ].map(({ step, icon: Icon, bg, iconColor, badgeBg, title, desc }) => (
            <div key={step} className="flex-1 flex items-start gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-20 h-20 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={32} className={iconColor} />
                </div>
                <div className={`w-10 h-10 ${badgeBg} rounded-full flex items-center justify-center -mt-4 relative z-10 border-2 border-white`}>
                  <span className="text-white text-sm font-bold">{step}</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold text-ink text-lg mb-4">{title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
          Who it&apos;s for
        </h2>
        <p className="text-lg text-ink-muted max-w-xl mb-16 leading-relaxed">
          Built for anyone tired of tax confusion &mdash; no matter how you earn.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {[
            { icon: Briefcase, title: `W-2 Employees`, desc: `Estimate your refund before filing.` },
            { icon: Zap, title: `Gig Workers`, desc: `Automatically organize multiple income streams.` },
            { icon: Building2, title: `Small Business`, desc: `Deductions and write-offs made simple.` },
            { icon: Home, title: `Landlords`, desc: `Track rental deductions in one place.` },
            { icon: Car, title: `Drivers`, desc: `Capture mileage and vehicle write-offs automatically.` },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-10 lg:p-12 rounded-xl border border-border bg-surface-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
            >
              <div className="w-12 h-12 bg-primary-bg rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon size={24} className="text-primary" />
              </div>
              <h4 className="font-medium text-ink mb-2">{title}</h4>
              <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
            Trusted by modern taxpayers
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Real people. Real results. No tax jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {testimonials.map(({ name, role, quote, impact }) => (
            <div
              key={name}
              className="p-10 lg:p-12 rounded-xl border border-border/50 bg-surface-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <span className="text-xs font-medium text-secondary-dark bg-secondary-bg/60 px-3 py-0.5 rounded-full">{impact}</span>
              </div>
              <blockquote className="text-lg text-ink-muted leading-relaxed mb-8">&ldquo;{quote}&rdquo;</blockquote>
              <div>
                <p className="font-semibold text-ink text-sm">{name}</p>
                <p className="text-xs text-ink-muted">{role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-24 max-w-4xl mx-auto py-24">
          {[
            { value: `5,000+`, label: `Documents processed` },
            { value: `97%`, label: `User satisfaction` },
            { value: `$3,200`, label: `Avg. uncovered deductions` },
          ].map(({ value, label }) => (
            <div key={label} className="text-center animate-[fadeInUp_0.8s_ease-out]">
              <p className="font-display text-6xl font-bold text-ink mb-3">{value}</p>
              <p className="font-medium text-lg text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section id="pricing" className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto mb-10">
            Start free. Upgrade when you're ready to file.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-10 lg:p-12 rounded-xl border border-border bg-surface-white hover:shadow-lg transition-all flex flex-col">
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-ink mb-2">Free</h3>
              <p className="text-5xl font-bold text-ink mb-1">$0</p>
              <p className="text-sm text-ink-muted mb-6">per tax season</p>
              <ul className="space-y-4 text-sm text-ink-muted mb-10">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  10 document uploads
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  AI document scanning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Basic refund estimate
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Confidence meter
                </li>
              </ul>
            </div>
            <Link to="/register" className="block w-full text-center px-6 py-4 bg-surface-white border border-border text-ink font-semibold rounded-xl hover:border-primary hover:text-primary transition-all">Get started free</Link>
          </div>
          <div className="p-10 lg:p-12 rounded-xl border-2 border-primary bg-surface-white hover:shadow-lg transition-all relative flex flex-col">
            <div className="absolute -top-4 left-6 bg-secondary text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-lg">Most popular</div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-ink mb-2">Pro</h3>
              <p className="text-5xl font-bold text-ink mb-1">$39</p>
              <p className="text-sm text-ink-muted mb-6">
                per tax season
                <span className="block text-xs text-accent-dark font-medium mt-0.5">or $48/year (save 20%)</span>
              </p>
              <ul className="space-y-4 text-sm text-ink-muted mb-10">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Unlimited document uploads
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Multi-year comparison
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  AI deduction suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Export reports (PDF, CSV, JSON)
                </li>
              </ul>
            </div>
            <Link to="/register" className="block w-full text-center px-6 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-all">Get started</Link>
          </div>
          <div className="p-10 lg:p-12 rounded-xl border border-border bg-surface-white hover:shadow-lg transition-all flex flex-col">
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-ink mb-2">Business</h3>
              <p className="text-5xl font-bold text-ink mb-1">$99</p>
              <p className="text-sm text-ink-muted mb-6">
                per tax season
                <span className="block text-xs text-accent-dark font-medium mt-0.5">or $120/year (save 20%)</span>
              </p>
              <ul className="space-y-4 text-sm text-ink-muted mb-10">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Multi-user access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  CPA-ready export packages
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-bg flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-accent-dark" />
                  </span>
                  Priority support
                </li>
              </ul>
            </div>
            <Link to="/register" className="block w-full text-center px-6 py-4 bg-surface-white border border-border text-ink font-semibold rounded-xl hover:border-primary hover:text-primary transition-all">Get started</Link>
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-sm text-ink-muted">
            <Sparkles size={14} className="inline mr-1 text-primary" />
            <strong className="text-ink">Founding member offer:</strong> First 500 beta users lock in Pro at <strong className="text-primary">$39/year</strong> — forever.
          </p>
        </div>
      </section>

      <section id="security" className="bg-ink py-36 lg:py-48">
        <div className="px-6 lg:px-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={32} className="text-accent" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Your data stays yours.
            </h2>
          </div>
          <p className="text-lg text-white/60 max-w-2xl mb-16 leading-relaxed">
            {`Enterprise-grade security. Full transparency. We never sell your data \u2014 period.`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {[
              { icon: Lock, title: `AES-256 Encryption`, desc: `Encrypted at rest and in transit.` },
              { icon: Shield, title: `Secure Infrastructure`, desc: `Multi-factor authentication built in.` },
              { icon: Trash2, title: `Full Data Control`, desc: `Delete your data anytime, permanently.` },
              { icon: Lock, title: `We Never Sell Your Data`, desc: `No selling, no sharing, no exceptions.` },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-5 p-10 lg:p-12 rounded-xl bg-white/[0.08] border border-white/10 transition-all duration-300 hover:bg-white/[0.10]">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80 inline-flex items-center gap-2">
              <Sparkles size={12} />
              SOC 2 Pathway
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80">
              AES-256 Encryption
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80">
              GDPR &amp; CCPA Ready
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80">
              Third-Party Audits
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-ink tracking-tight mb-4">
          Know your numbers before tax season surprises you.
        </h2>
        <p className="text-lg md:text-xl text-ink-muted max-w-xl mx-auto mb-16 leading-relaxed">
          Upload your documents and get a clear, personalized estimate in minutes. No commitment. No credit card.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-12 py-5 bg-secondary text-white text-xl font-semibold rounded-xl hover:bg-secondary-dark transition-all hover:shadow-secondary hover:shadow-lg inline-flex items-center gap-2"
          >
            Get my refund estimate
            <ArrowRight size={20} />
          </Link>
          <a
            href="#how-it-works"
            className="px-12 py-5 bg-surface-white border border-border text-ink text-xl font-medium rounded-xl hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2"
          >
            See how it works
            <ArrowDown size={20} />
          </a>
        </div>
      </section>

      <section id="faq" className="px-6 lg:px-16 py-28 lg:py-36 max-w-7xl mx-auto w-full bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4 text-center">
            Frequently asked questions
          </h2>
          <p className="text-lg text-ink-muted text-center mb-16 leading-relaxed">
            Everything you need to know before getting started.
          </p>
          <div className="space-y-6 mb-16">
            {[
              { q: `Is my tax data safe?`, a: `Absolutely. All documents are encrypted with AES-256 at rest and in transit. We\u2019re on a SOC 2 Pathway and never sell or share your data.` },
              { q: `Do I need to be a tax expert?`, a: `Not at all. TaxSight is designed for everyday taxpayers. Upload your documents and we\u2019ll handle the analysis \u2014 no tax knowledge required.` },
              { q: `Is my refund estimate guaranteed?`, a: `Your estimate is based on the documents and information you provide. It\u2019s highly accurate but not a guarantee \u2014 always review with a tax professional before filing.` },
              { q: `What documents do I need?`, a: `W-2s, 1099s, receipts for deductions, and any other tax-related documents. We support PDF, images, and most common formats.` },
            ].map(({ q, a }) => (
              <details key={q} className="group py-8 px-10 lg:py-10 lg:px-12 rounded-xl border border-border bg-surface-white transition-all duration-300 hover:bg-surface hover:border-primary/30">
                <summary className="font-semibold text-ink cursor-pointer list-none flex items-center justify-between gap-4 select-none">
                  <span className="text-lg">{q}</span>
                  <ChevronRight size={20} className="text-ink-muted transition-transform duration-300 group-open:rotate-90 flex-shrink-0" />
                </summary>
                <div className="mt-6 text-sm text-ink-muted leading-relaxed max-w-2xl">{a}</div>
              </details>
            ))}
          </div>
          <div className="text-center p-10 lg:p-12 rounded-xl border border-border bg-surface-white">
            <p className="text-ink font-semibold mb-2">Still have questions?</p>
            <p className="text-sm text-ink-muted mb-5 leading-relaxed">We usually respond within 24 hours.</p>
            <a
              href="mailto:hello@taxsight.ai"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all hover:shadow-primary"
            >
              Contact us
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-primary-dark pt-24 lg:pt-28 pb-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-24 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TS</span>
                </div>
                <span className="font-display text-3xl font-extrabold text-white tracking-tight">TaxSight</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">AI-powered tax clarity for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-5">Product</h4>
              <div className="flex flex-col gap-4">
                <Link to="#features" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Features</Link>
                <Link to="#how-it-works" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">How it works</Link>
                <Link to="#pricing" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Pricing</Link>
                <Link to="#faq" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-5">Company</h4>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">About</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Blog</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Careers</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-5">Legal</h4>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="text-sm leading-6 text-white/50 hover:text-white transition-colors">Data Processing</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-12">
            <p className="text-xs leading-relaxed text-white/25 max-w-5xl mb-6">
              TaxSight provides estimates and document organization tools. It is not legal, financial, or tax advice. Final filing decisions should be reviewed by a qualified tax professional. Results are estimates based on the information you provide and may differ from your actual filing outcome.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-white/25">&copy; {new Date().getFullYear()} TaxSight.ai. All rights reserved.</p>
              <p className="text-xs text-white/25">Built with care in the United States.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
