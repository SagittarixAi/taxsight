# TaxSight Landing Page — v4 Implementation

Complete rewrite based on the UX deep-dive. Fix all 10 major issues.

## Palette (KEEP AS-IS from v2)
- Primary: Navy #1E3A5F
- CTA: Amber #FF6B35 (keep but use more intentionally)
- Accent: Teal #0EA5A0
- Ink: #1A1523, Muted: #8B8599, Surface: #F8F7FA

## 10 UX Fixes to Implement

### 1. LEFT-ALIGNED content (CRITICAL)
- Hero stays centered
- EVERYTHING else: left-aligned
- Feature cards left-aligned
- Process steps left-aligned  
- Security section left-aligned
- No more center-aligning everything

### 2. Typography hierarchy
- Hero: MASSIVE bold (font-display, 5xl-7xl)
- Section titles: medium-bold, uppercase or large
- Supporting text: muted gray (ink-muted)
- Card titles: smaller bold
- Card body: light readable gray
- Each level must feel DISTINCTLY different

### 3. Aggressive vertical spacing
- 80-120px between major sections (py-20 lg:py-28)
- 32px between section title and content (mb-8)
- 24px+ card padding minimum
- Nothing should feel cramped

### 4. Unified icon system
- ALL icons: same lucide-react style (outlined)
- Same container size (w-12 h-12)
- Same background size
- Same stroke width
- No mixing visual weights

### 5. Product mockup/visual anchor (CRITICAL)
- Add a large hero visual below CTAs
- NOT a real screenshot (we don't have one) — use a clean mockup frame
- Something that communicates "dashboard preview"
- Can be a styled div with animated placeholder content
- Could show: a mock dashboard card, estimated refund display, uploaded document indicator

### 6. Orange CTA refinement
- Orange #FF6B35 stays as primary CTA (Henry chose this)
- But introduce a secondary deep blue CTA option
- Orange should feel INTENTIONAL, not "coupon"
- Use it sparingly — orange CTA buttons but NOT orange backgrounds everywhere

### 7. "Who it's for" → segmented cards
- W-2 Employees: icon + "Auto-detect deductions from your W-2"
- Gig Workers: icon + "1099s, side income, multiple streams"
- Small Business Owners: icon + "Business expenses & write-offs"
- Landlords: icon + "Rental income & property deductions"
- Each: small icon, one benefit statement, card format

### 8. Security section — STRONG
- Dark background section (bg-ink or bg-primary-dark)
- Encryption badges / privacy highlights
- "We never sell your data" highlight
- Compliance roadmap mention
- Enterprise-grade feel

### 9. Real footer
- Logo + "TaxSight by SagittarixAi"
- Privacy, Terms, Support links
- Full disclaimer
- Copyright
- Contact info

### 10. Emotional persuasion copy
- Emotional headlines woven into sections
- "Stop guessing what your refund will be."
- "Know before you file."
- "No spreadsheets. No confusion."
- "See hidden deductions instantly."

## Section Order (updated)
1. NAV: Logo + "Get started free" CTA
2. HERO: Headline + subheadline + CTAs + product mockup visual
3. TRUST BAR: "Built for W-2, 1099, landlords, drivers, small business"
4. FEATURES: 3 premium left-aligned cards (no center)
5. HOW IT WORKS: 3 steps, left-aligned, with step connectors
6. AUDIENCE: Segmented audience cards (5 types)
7. SECURITY: Dark section, strong trust language
8. FINAL CTA: Large conversion close
9. FOOTER: Full professional footer with disclaimer

## Files to modify
- ONLY: `ui/src/pages/Landing.tsx`

Use Tailwind v4 semantic classes: bg-primary, bg-secondary, bg-accent, bg-surface, bg-ink, bg-primary-dark, text-ink, text-ink-muted, text-white, font-display, shadow-primary, shadow-secondary, shadow-accent, border-border.
