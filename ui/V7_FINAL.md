# TaxSight Landing Page — v7 FINAL REFINEMENT

**Goal**: 8.7/10 → 9.5+/10. Premium fintech execution. Memorable, not just credible.

**Target feel**: Stripe, Linear, Ramp — beautiful, alive, authoritative.

---

## 12 Refinements

### 1. SPACING — +40-60% more vertical breathing room
- Hero bottom: py-36 lg:py-40 (was 32)
- Section→section: py-28 lg:py-36 (was 20/24)
- Section heading→content: mb-14 (was 10)
- Card padding: p-10 (was p-9)
- Footer top: pt-24 (was pt-16)
- Footer column gap: gap-16 lg:gap-20
- Stats row: py-16 gap-16
- Testimonial card padding: p-10
- FAQ items: py-6 px-8

### 2. HERO REDESIGN — tall, layered, premium
- Hero section: min-h-[90vh] on large screens
- Mockup: make it TALLER and more DOMINANT
- Overlapping cards with real depth (shadow-2xl)
- "Uploaded Docs" card: more prominent, peek further
- "8 deductions detected" badge: larger, more visible
- Confidence meter: gradient on fill bar
- Add floating tax deduction insight card:
  - "Possible deduction: Home Office — $1,500"
  - Small pill badge peeking from side
- Animated elements: float, pulse-soft, shimmer all active

### 3. TYPOGRAPHY — reduce bold further, increase breathing
- Section headings: font-bold (not extrabold)
- Card titles: font-medium (not semibold)
- Stat numbers: font-bold text-5xl
- Stat labels: font-medium text-lg
- Body text: leading-relaxed with mb-4 paragraph spacing
- Testimonial quote: font-medium italic text-lg
- Footer headings: font-semibold text-xs uppercase tracking-widest

### 4. TESTIMONIALS — more polish, add dollar impact
- Larger padding (p-10)
- Quote: font-medium italic text-lg leading-relaxed
- Stars: use ★★★★★ styled elements
- Add: "Found $1,200 in missed deductions." — high-conversion copy
- Stronger persona identification
- Hover: slight lift

### 5. STATS ROW — larger, bolder, animated feel
- Numbers: text-5xl font-bold
- Labels: font-medium text-base text-ink-muted
- Center aligned
- Gap: gap-16
- Use: "Documents processed" / "User satisfaction" / "Avg. uncovered deductions"
- Animate: pulse opacity on mount (CSS only)

### 6. FAQ — more premium accordion feel
- Larger click area (py-6 px-8)
- Hover: bg-surface transition
- Smooth border transition
- Add "Still have questions? Contact us" CTA below FAQ
- summary font-medium text-ink, details text-ink-muted leading-relaxed

### 7. SECURITY — simplify text, premium pill badges
- Cards: larger padding (p-8), less text per card
- Title: font-semibold text-white
- Desc: ONE LINE max. "Your documents are encrypted at rest and in transit."
- Compliance badges: true pill style with generous spacing
- Each badge: rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-white/80

### 8. FOOTER — more space, less density
- Column gap: gap-16 lg:gap-20
- Link rows: gap-4 (was gap-3)
- Disclaimer: text-xs leading-relaxed text-white/25 max-w-4xl
- Copyright row: flex justify-between items-center
- Logo: make it BIGGER — use w-10 h-10 for icon, text-2xl for name

### 9. LOGO — MORE PROMINENT
- Nav logo: w-10 h-10 icon (was w-9), text-2xl font-extrabold name (was text-xl)
- Footer logo: same bigger size
- Logo should lead the brand identity

### 10. CTA COLOR — warm amber not orange
- Keep bg-secondary (#FF6B35) but shift perception:
  - Use warmer amber tone if available
  - OR add subtle glow/shadow to make it feel intentional
  - Primary CTAs: bg-secondary with hover:shadow-secondary-lg
  - Ensure NO orange backgrounds elsewhere
  - Consider: deep blue as primary CTA, amber as accent only

### 11. MOTION SYSTEM — subtle life
- Hero mockup elements: animate-[float_4s_ease-in-out_infinite]
- Floating badges: animate-[pulse-soft_2.5s_ease-in-out_infinite]
- Confidence bar: bg-gradient-to-r from-accent to-accent-dark + animate-[shimmer_3s_linear_infinite]
- Cards: hover:-translate-y-1 hover:shadow-xl transition-all duration-300
- Icons inside cards: group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300
- FAQ: transition-all on details/summary

### 12. ASYMMETRY & DEPTH — break the grid
- Hero mockup container: relative with overlapping children
- Floating insight card offset to side (translate-x-4 -translate-y-2)
- Background subtle gradient in hero: bg-gradient-to-b from-primary-bg/30 to-transparent
- Cards: use shadow-xl for premium depth
- Testimonial cards: slight rotation/offset for organic feel (rotate-1 or -1)

---

## Files to modify
- ONLY: `ui/src/pages/Landing.tsx`
- `ui/src/index.css` — animations already added in v6, keep as-is

## Section order (KEEP — correct)
1. NAV
2. HERO — tall, layered, dominant
3. TRUST BAR
4. FEATURES — hover interactions
5. HOW IT WORKS
6. AUDIENCE — benefit language
7. TESTIMONIALS — dollar impact copy
8. SECURITY — simplified text, pill badges
9. FAQ — premium accordion + contact CTA
10. FINAL CTA — emotional "Know your numbers"
11. FOOTER — spacious, prominent logo

## After editing
Run: npx tsc --noEmit && npx vite build
Both must pass zero errors.
