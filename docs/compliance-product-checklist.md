# TaxSight Pre-Launch Compliance & Product Checklist

> **Living document** — Last updated: 2026-05-10
> Source of research: External tax API analysis (2026-05-09), Henry + Hank discussion (2026-05-10)
> This list will evolve as we do more research. Items are not in strict priority order — grouped by domain.

---

## 🏛 1. Business Entity & Legal Structure

- [ ] **Form LLC** — liability separation for tax data handling
- [ ] **Register for ERO status** — required for transmitting tax returns (PTIN + fingerprinting + surety bond)
- [ ] **Determine state licensing requirements** — each state has separate tax preparer registration
- [ ] **Draft Operating Agreement** — clarifies ownership, profit distribution, decision rights
- [ ] **Secure E&O insurance** — errors and omissions for tax software
- [ ] **Review Circular 230 compliance** — ensure no "advice" crossing the line into tax prep

---

## ⚖️ 2. Terms of Service & Legal Agreements

- [ ] **Terms of Service** — mandatory acceptance before any data input
  - User acknowledges: TaxSight is a tool, not a tax preparer
  - User is solely responsible for all selections and submissions
  - No refund guarantee for tax calculations (user controls all inputs)
  - Data retention policy stated
  - Limitation of liability clause
  - Dispute resolution / arbitration clause
- [ ] **Privacy Policy** — GDPR / CCPA compliant
- [ ] **Cookie Consent** — if analytics or tracking used
- [ ] **Versioned terms** — users must re-accept if ToS changes
- [ ] **Acceptance tracking** — per-user, timestamped, which version they accepted

---

## 📝 3. Disclaimers & Wording Audit

- [ ] **Full-page disclaimer on every calculation/suggestion screen**
  - "TaxSight provides suggestions based on IRS publications. You are responsible for confirming accuracy."
- [ ] **Footer disclaimer on all pages**
  - "Not tax advice. Consult a qualified professional."
- [ ] **Circular 230 disclosure** on any page dealing with tax positions
- [ ] **Audit banner** before filing: "By filing, you certify all information is true and accurate."
- [ ] **SEO-liability wording review per page:**
  - Landing page → focus on "tools," "insights," "options" — NOT "preparation," "advice," "guaranteed"
  - Upload page → "Extract what you uploaded" — NOT "we find everything for you"
  - Calculations page → "Your potential deductions" — NOT "your refund"
  - FAQ page → "What users can do with TaxSight" — NOT "what TaxSight does for you"
- [ ] **Word audit checklist** — scan every headline, CTA, label for:
  - ❌ "We calculate your taxes" → ✅ "See your options"
  - ❌ "Maximize your refund" → ✅ "Explore what you may qualify for"
  - ❌ "Tax preparation" → ✅ "Tax document organizer"
  - ❌ "Our AI knows taxes" → ✅ "Powered by IRS publication data"

---

## 🛡️ 4. Security & Data Protection

- [ ] **Encryption at rest** — PostgreSQL `pgcrypto` or Supabase built-in encryption
- [ ] **Encryption in transit** — ✅ DONE via Traefik HTTPS
- [ ] **Row-level security** — every query scoped to authenticated user
- [ ] **Immutable audit log** — all user actions: logins, uploads, selections, confirmations, filings
- [ ] **Data retention policy**
  - Raw documents: deleted 30 days post-filing
  - Extracted data: retained for seasonal reuse (user can delete anytime)
  - Audit logs: retained for 3 years (legal requirement)
- [ ] **Access controls** — admin access requires 2FA, logged
- [ ] **SOC 2 readiness** — architecture decisions documented for future audit
- [ ] **Supabase evaluation** — built-in auth, RLS, encryption, real-time
  - [ ] Decide: full migration vs hybrid (Supabase auth + our API)
  - [ ] If migrate: rewrite API from FastAPI/SQLAlchemy to Supabase SDK
  - [ ] Edge Functions for document processing (if going serverless)

---

## 💳 5. Pricing & Submission Model

- [ ] **Submission as add-on purchase** — users prepare for free, pay only to file
  - Free: upload, extract, explore deductions (no transmission)
  - Pro ($39/season): file federal + state via TaxBandits
  - Business ($99/season): multi-return, priority support
- [ ] **Stripe Checkout integration** — need publishable + secret keys
- [ ] **TaxBandits pricing** — ~$0.68–$5.00 per form (federal + state)
  - Calculate margin: $39 Pro - TaxBandits fee - Stripe fee = net per user
  - Evaluate: do we charge filing fee separately vs include in subscription?

---

## 📄 6. FAQ Page (NEW — Dedicated Page)

- [ ] **Design a standalone FAQ page** — not hidden in footer, accessible from nav
- [ ] **Tone**: transparent, cautious, helpful — not salesy
- [ ] **Must-answer questions** (SEO + legal protection):
  - "Is TaxSight a tax preparer?" → No, we are a document organization tool
  - "Who is responsible for my tax return?" → You are, entirely
  - "Does TaxSight guarantee a refund?" → No, we surface possibilities
  - "How is my data protected?" → Encryption, access controls, deletion policy
  - "Do I still need a CPA?" → We recommend consulting one for complex situations
  - "What forms do you support?" → W-2, 1099-NEC, 1099-MISC, receipts (expanding)
  - "Can I file state taxes?" → Yes, via TaxBandits
  - "What happens to my documents after filing?" → Auto-deleted after 30 days
- [ ] **SEO strategy for FAQ** — rank for "tax document organizer," "deduction finder," "free tax tool" — NOT "tax preparation" or "file taxes online"

---

## 🧰 7. Product UX Changes

- [ ] **Confirmation checkbox on every deduction** — user must explicitly select
- [ ] **Editable amounts** — user can override extracted values
- [ ] **Audit trail display** — "You confirmed this on [date] at [time]" shown on every item
- [ ] **Submission as separate flow** — disconnected from preparation UX (add-on purchase screen)
- [ ] **Terms acceptance gate** — modal before first upload, version-tracked
- [ ] **Disclaimer banner** — fixed bottom bar on all authenticated pages
- [ ] **Data deletion self-service** — user can delete all their data with one click

---

## 🔄 8. Filing Backend Evaluation

- [ ] **TaxBandits**
  - [ ] Sign up for sandbox account
  - [ ] Test 1040 transmission with dummy data
  - [ ] Understand pricing model
  - [ ] Verify state filing support (all 50 states?)
  - [ ] Check for 1099/W-2 transmission (if expanding to business)
- [ ] **Column Tax**
  - [ ] Request pricing quote
  - [ ] Evaluate white-label UI quality
  - [ ] Check if their "max refund guarantee" conflicts with our liability position
- [ ] **April**
  - [ ] Request pricing quote
  - [ ] Same evaluation as Column Tax

---

## 🧪 9. Development Backlog (Inferred)

- [ ] Plaid integration for bank transaction import
- [ ] Deduction suggestion engine (LLM + IRS Pub 17 rules)
- [ ] Checkbox confirmation UI component
- [ ] Audit logging middleware
- [ ] FAQ page (frontend + copy)
- [ ] Terms of Service acceptance flow
- [ ] Disclaimer banner component
- [ ] Data deletion endpoint
- [ ] Submission add-on purchase flow (Stripe)
- [ ] TaxBandits API integration
- [ ] Migration path: Supabase evaluation → decision → implementation

---

## 📋 10. Launch Readiness Gates

- [ ] ✅ LLC formed
- [ ] ✅ ERO registered
- [ ] ✅ Attorney-reviewed disclaimers deployed on every page
- [ ] ✅ Terms of Service + Privacy Policy live
- [ ] ✅ All wording audited and compliant
- [ ] ✅ Encryption at rest + in transit
- [ ] ✅ Row-level security enforced
- [ ] ✅ Audit logging operational
- [ ] ✅ TaxBandits sandbox tested end-to-end
- [ ] ✅ Stripe Checkout working
- [ ] ✅ Submission add-on flow complete
- [ ] ✅ FAQ page live with approved copy
- [ ] ✅ E&O insurance in place
- [ ] ✅ Internal test: user creates account, uploads documents, explores deductions, files (via TaxBandits sandbox), deletes data

---

## Notes

- This document should be re-reviewed after every new piece of tax industry research
- Legal review by a qualified attorney is mandatory before launch — this checklist identifies what needs review, not how to implement it
- Some items may be out of scope for v1.0 — mark them as v1.1+ and move on
- Henry and Hank to work through this together, prioritizing based on launch timeline
