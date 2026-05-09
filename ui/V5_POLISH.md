# TaxSight Landing Page — v5 FINAL POLISH

Based on Henry B's v4 review. The page is directionally correct. Now it needs premium refinement.

**Goal**: "well-structured AI startup" → "serious financial platform"

**Target feel**: Mercury, Ramp, modern fintech SaaS, AI-native consumer finance UX

---

## 6 Improvements to Implement

### 1. Vertical spacing — BREATHE
This is the single most important fix. The page is still too compressed.

- Hero → next section: **100px** (was py-20/py-24)
- Section → section: **96px** (was py-24)
- Section heading → cards: **32px** (was mb-16)
- Card internal padding: **28–36px** (was p-8/p-10)
- Footer top padding: **64px** (was pt-20)

No crowded sections. Whitespace = calm, confidence, professionalism.
Tax UX should reduce anxiety. Compressed = cognitive stress.

### 2. Hero — more visual sophistication
The refund mockup is the BEST improvement so far. But it still looks flat/wireframe-ish.

Make the hero mockup ASYMMETRICAL and layered:
- Large refund card (main)
- Overlapping floating insight cards
- Uploaded document preview (small card peeking from behind)
- Deduction detection popup (floating badge)
- Smooth typography, layered depth

Stripe/Ramp/Linear all do depth + layering + visual movement.

### 3. Typography — reduce bold weight
Too many bold elements fighting for importance.

- Use **bold** only for hierarchy anchors (hero, section titles)
- Use **font-medium** or **font-semibold** for card titles, subheadings
- Increase body text line-height: **1.5–1.7** leading-relaxed on paragraphs
- ~30% less bold overall

### 4. Feature cards — interaction design
Cards feel static. Need to feel tactile.

- **Hover**: slight lift (-translate-y-0.5), soft shadow
- **Border transition**: subtle color shift on hover
- Keep smooth, not gaudy

### 5. Audience cards — benefit language, not categories
Each audience card needs a BENEFIT statement, not just a category.

- W-2 Employees: "Estimate your refund before filing."
- Gig Workers: "Automatically organize multiple income streams."
- Small Business: "Deductions and write-offs made simple."
- Landlords: "Track rental deductions in one place."
- Drivers: "Capture mileage and vehicle write-offs automatically."

### 6. Security section — hierarchy cleanup
Dark section is strong. Cards feel crowded.

- Larger internal padding (p-7+)
- Less text per card
- Stronger icon emphasis
- Premium trust badges:
  - SOC 2 Pathway
  - AES-256 Encryption
  - GDPR & CCPA Ready
  - Third-Party Security Audits

---

## Files to modify
- ONLY: `ui/src/pages/Landing.tsx`

## Palette (KEEP AS-IS)
- Primary: Navy #1E3A5F (bg-primary, text-primary)
- CTA: Amber #FF6B35 (bg-secondary, text-secondary) — intentional, keep
- Accent: Teal #0EA5A0 (bg-accent, text-accent)
- Ink: #1A1523 (text-ink), Muted: #8B8599 (text-ink-muted)
- Surface: #F8F7FA (bg-surface), White (bg-surface-white)
- Dark: bg-ink, bg-primary-dark

## Section order (KEEP)
1. NAV
2. HERO (centered) — with layered/overlapping product mockup
3. TRUST BAR
4. FEATURES (left-aligned) — with hover interaction
5. HOW IT WORKS (left-aligned)
6. AUDIENCE (left-aligned) — benefit-based descriptions
7. SECURITY (dark bg, left-aligned) — premium badges, less text
8. FINAL CTA (centered)
9. FOOTER

## After editing
Run: npx tsc --noEmit && npx vite build
Both must pass with zero errors.
