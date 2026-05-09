# TaxSight Landing Page — v8 BALANCE & AUTHORITY

**Goal**: Fix the left-heavy layout imbalance. Shift from "80% text / 20% product" to "45% text / 55% product." Make the mockup the star.

---

## 7 Critical Fixes

### 1. Hero layout — true 2-column balance (CRITICAL)
- Current: hero is flex-row but left side dominates (80/20 split)
- Fix: 
  - LEFT (lg:w-[45%] or lg:w-5/12): headline SMALLER, sub, CTAs, trust bar
  - RIGHT (lg:w-[55%] or lg:w-7/12): MUCH larger dashboard mockup
- Headline size: REDUCE by 10-20%. From 5.5rem → 4.5rem lg:text-6xl max
- Mockup: make it the STAR. Larger, taller, more prominent
- Vertical center the whole hero section

### 2. Logo + navbar — 25-40% larger
- Logo icon: w-12 h-12 (was w-10), rounded-xl
- Logo text: text-3xl font-extrabold (was text-2xl)
- Nav height: py-6 lg:py-7 (was py-6)
- Nav link spacing: gap-8 lg:gap-10 (was gap-6 or less)
- CTA button: px-6 py-3 (was px-5 py-2.5)

### 3. Container constraints — max-width discipline
- All sections: max-w-7xl mx-auto px-6 lg:px-16 (was px-12)
- Hero section: use max-w-7xl + wider side padding
- No content should feel floaty or disconnected

### 4. Vertical centering of hero
- Hero: use flex items-center (not items-start or default stretch)
- Content vertically centered in viewport
- Nav + some top padding, then hero content centered, then trust bar

### 5. Headline size reduction
- Current: text-5xl lg:text-[5.5rem] (88px)
- New: text-5xl lg:text-6xl lg:leading-[1.1] (64px, down ~27%)
- This is intentional — the mockup needs to be the star

### 6. Mockup refinement — larger, animated, premium
- Right side: w-full lg:w-7/12
- Mockup container: larger padding, bigger stats
- Refund number: text-5xl lg:text-6xl (was 5xl)
- Confidence bar: animated gradient
- Floating cards: all visible with proper z-index layering
- Deduction insight pill: prominent
- "Uploaded Docs" card: larger, more visible

### 7. Global spacing refinement
- Hero bottom: py-32 lg:py-36
- Section→section: py-24 lg:py-28
- Card padding: p-10 lg:p-12
- Testimonial cards: p-10 lg:p-12
- FAQ items: py-8 px-10 lg:py-10 lg:px-12
- Footer: pt-28, column gap-20

---

## Files to modify
- ONLY: `ui/src/pages/Landing.tsx`

## Section order (KEEP)
1. NAV — larger logo, wider spacing, taller
2. HERO — balanced 45/55 split, smaller headline, dominating mockup
3. TRUST BAR
4. FEATURES
5. HOW IT WORKS
6. AUDIENCE
7. TESTIMONIALS
8. SECURITY
9. FAQ
10. FINAL CTA
11. FOOTER

## After editing
Run: npx tsc --noEmit && npx vite build
Both must pass zero errors.
