# TaxSight Landing Page — v6 PREMIUM FINAL

**Goal**: 8.1/10 → 9+/10. From "competent" to "memorable."

**Target feel**: Mercury, Ramp, Linear — premium fintech SaaS, alive and polished.

---

## 12 Improvements

### 1. Navigation — mature fintech nav
- Taller nav (py-5 → py-6)
- Add nav links: Features, Security, Pricing, FAQ
- CTA button: "Get started free"
- Fintech SaaS legitimacy from mature navigation

### 2. Spacing — final breathing room pass
- Hero → next section: 120px
- Section → section: 100px
- Section heading → content: 40px (was 32px)
- Card internal padding: 36px (was 32px)
- Footer sections: 48px gap between columns
- Footer disclaimer: less dense, generous line-height

### 3. Typography — premium rhythm
- Hero: font-display, 5.5rem, font-bold (not extrabold), tracking-tighter
- Section titles: 3xl md:4xl, font-bold
- Card titles: xl, font-semibold
- Body: text-base, leading-relaxed, text-ink-muted
- Footer headings: uppercase tracking-wider font-semibold text-sm
- NO extrabold anywhere except hero. Medium/bold for hierarchy.

### 4. Hero mockup — MORE depth + motion
- Layered cards (already done: z-20 main, z-10 docs, z-30 badge)
- Add: animated elements via CSS animation classes
- Floating sparkle icons that pulse
- Confidence meter that animates width
- Make the "8 deductions detected" badge pulse gently
- Use CSS keyframes: `@keyframes float` for floating elements

### 5. Feature cards — interaction + lift
- Already have hover lift. Ensure ALL cards have it.
- Add: group hover on entire card, icon transitions
- Icon group: group-hover:scale-110 group-hover:rotate-3

### 6. CTA emotional copy — resolve uncertainty
- Replace "Ready to see your refund?" with:
  - "Know your numbers before tax season surprises you." (strongest option)
  - Or: "Stop wondering what your refund will be."
- Subtext: "Upload your documents and get a clear, personalized estimate in minutes. No commitment. No credit card."
- Primary CTA: "Get my refund estimate" (same)
- Secondary: "Compare plans" or "See how it works" (scroll anchor)

### 7. Security badges — PROPER PILL BADGES
- Premium pill-shaped badges: rounded-full, px-4 py-1.5
- Styled as: SOC 2 Pathway | AES-256 Encryption | GDPR & CCPA Ready | Third-Party Audits
- Use proper pill style: bg-white/10 text-white/80 border border-white/10

### 8. Social proof section — CRITICAL addition
Add a testimonials / trust metrics section between Security and Final CTA:
- "Trusted by modern taxpayers" heading
- 2-3 testimonial cards: name, role, quote
- Stats row: "5,000+ documents processed" / "92% average satisfaction" / "85% see deductions they missed"
- Even if early-stage, this builds the trust narrative

### 9. Motion — subtle animations
- Dashboard counter: animated number (use CSS for now)
- Scroll reveals: add `animate-fadeIn` or `animate-slideUp` classes
- Confidence bar: animated width
- Floating elements: CSS keyframe float animation
- Add to index.css or tailwind config:
  ```
  @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  ```
- Use `animate-[float_3s_ease-in-out_infinite]` on floating elements

### 10. Color refinement — make orange intentional
- Keep orange (#FF6B35) as CTA BUTTONS ONLY
- No orange backgrounds, no orange cards
- Orange used sparingly = intentional premium accent
- CTA buttons: `bg-secondary` (amber) → `hover:bg-secondary-dark`
- Everything else: navy primary, teal accent, cool neutral
- This makes orange feel purposeful, not "coupon-ish"

### 11. Footer — clean up density
- Larger column gap: gap-16 (was gap-12)
- Footer headings: uppercase, tracking-wider, font-semibold
- Links: text-sm text-white/50 with hover:text-white
- Disclaimer: max-w-4xl, text-xs, text-white/25
- Copyright line: flex row, space-between

### 12. "Wow" moment — hero visualization
The hero mockup IS the wow moment. Make it pop:
- Add subtle inner shadow inside mockup
- Confidence bar with animated gradient on fill
- Floating document cards with subtle shadow depth
- "8 deductions detected" badge with Sparkles icon and gentle pulse

---

## Files to modify
- `ui/src/pages/Landing.tsx` — full rewrite
- `ui/src/index.css` — add @keyframes animations (float, fadeInUp, pulse-soft)

## Section order
1. NAV (mature: Features, Security, Pricing, FAQ + CTA)
2. HERO (centered, layered mockup with motion)
3. TRUST BAR
4. FEATURES (left-aligned, hover interactions)
5. HOW IT WORKS (left-aligned)
6. AUDIENCE (left-aligned, benefit language)
7. TESTIMONIALS/SOCIAL PROOF (NEW)
8. SECURITY (dark bg, pill badges)
9. FINAL CTA (emotional copy)
10. FOOTER (clean, 4-column)

## PALETTE (KEEP)
- Primary: Navy #1E3A5F (bg-primary, text-primary)
- CTA: Amber #FF6B35 (bg-secondary, text-secondary) — buttons only
- Accent: Teal #0EA5A0 (bg-accent, text-accent)
- Ink: #1A1523 (text-ink), Muted: #8B8599 (text-ink-muted)
- Surface: #F8F7FA (bg-surface), White (bg-surface-white)
- Dark: bg-ink, bg-primary-dark

## After editing
Run: npx tsc --noEmit && npx vite build
Both must pass zero errors.
