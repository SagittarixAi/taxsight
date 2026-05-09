# TaxSight Landing Page — v9 ART DIRECTION

**Goal**: From "assembled" → "art directed." Calm, confident, expensive, clear.

**No new sections.** Refine composition, spacing, scaling, hierarchy, rhythm, restraint.

---

## 5 Refinements

### 8. Testimonials — polish
- Current: cramped cards, small type, crowded badges
- Fix: p-10 lg:p-12 cards, text-lg italic quotes, softer borders (border-border/50), more gap between cards (gap-8)
- Ratings: bigger stars (text-secondary fill)
- Impact badges: cleaner, less dense

### 9. Stats row — BIG trust anchors
- Current: underpowered, visually minimized
- Fix: text-6xl font-bold numerals, text-lg font-medium labels, gap-20 between items
- Add subtle animate-[fadeInUp] on stats
- Numbers: 5,000+ / 97% / $3,200 (avg uncovered)
- Should FEEL like trust anchors, not footnotes

### 10. Security — more premium, less compressed
- Dark section needs to breathe: py-32 lg:py-40 (was 28/36)
- Cards: softer glow (shadow-accent/5), p-8 lg:p-10
- Less text density: one line per card max
- Badge spacing: gap-4 between pill badges, more generous padding
- Compliance badges row: gap-6, wrap properly

### 11. CTA section — more visual importance
- Currently feels buried
- Fix: py-32 lg:py-40 (was 24/28)
- CTA button: px-12 py-5 text-xl (was px-10 py-4 text-lg)
- Secondary CTA: same size, proper secondary styling
- More air above and below

### 12. Footer — spacing + hierarchy
- Footer padding: pt-32 pb-16 (was pt-28 pb-12)
- Column gap: gap-20 lg:gap-24 (was gap-16)
- Link text: text-sm leading-6 (better line height)
- Disclaimer: max-w-5xl, leading-relaxed, text-xs
- Copyright: text-xs text-white/25

---

## Files to modify
- ONLY: `ui/src/pages/Landing.tsx`

## After editing
Run: npx tsc --noEmit && npx vite build
