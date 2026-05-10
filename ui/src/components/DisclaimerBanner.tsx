import { X } from 'lucide-react'
import { useState } from 'react'

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-3 flex items-start justify-between gap-4">
        <p className="text-xs text-white/40 leading-relaxed max-w-4xl">
          <span className="font-semibold text-white/60">TaxSight is a document organization tool, not a tax preparer.</span>{' '}
          All suggestions are informational. You are solely responsible for confirming the accuracy of any information you submit.
          TaxSight does not provide tax, legal, or financial advice. Consult a qualified professional for advice specific to your situation.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
