# TaxSight Landing v7.5 — Stripe-inspired Asymmetric Hero

**Single change**: Restructure the hero section to a Stripe-style split layout.

## Reference layout
```
┌─────────────────────────┬──────────────────────┐
│                         │                      │
│   Big bold headline     │    Dashboard         │
│   (~5.5rem, left)       │    mockup            │
│                         │    (polished,        │
│   Short sub line        │    layered,          │
│   (1-2 lines)           │    prominent)        │
│                         │                      │
│   [CTA] [Secondary]     │                      │
│                         │                      │
│   Trust bar / logo row  │                      │
│                         │                      │
└─────────────────────────┴──────────────────────┘
```

## Changes to implement

### Hero layout
- Hero section: `flex flex-col lg:flex-row items-center gap-12 lg:gap-16`
- LEFT SIDE (w-full lg:w-1/2): 
  - Headline left-aligned (not centered): `text-left` 
  - ~5.5rem, font-extrabold, tracking-tighter, leading-[1.05]
  - Subhead: text-left, max-w-lg, text-lg
  - CTAs: left-aligned
- RIGHT SIDE (w-full lg:w-1/2):
  - Dashboard mockup, taller and more prominent
  - Same layered card design from v7 but FULL HEIGHT
  - Use: shadow-2xl, relative overflow-hidden
  - Keep: refund estimate card, confidence bar, document status
  - Add: subtle background gradient or glow behind it

### Trust bar
- After CTAs but above the mockup on mobile / below hero on desktop:
  - Small text: "Trusted by 5,000+ taxpayers" 
  - Or logo bar: small logos/brands

### Everything else STAYS THE SAME
- Do NOT touch Features, How It Works, Audience, Testimonials, Security, FAQ, CTA, Footer
- Only modify the hero section (nav needs no changes either)

## Palette (KEEP)
- bg-primary (#1E3A5F), bg-secondary (#FF6B35), bg-accent (#0EA5A0)
- text-ink, text-ink-muted, bg-surface, bg-surface-white

## After editing
Run: npx tsc --noEmit && npx vite build
Both must pass zero errors.
