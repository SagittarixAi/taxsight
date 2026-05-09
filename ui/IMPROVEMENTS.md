# TaxSight UI — Improvement Implementation Spec

Combine Hermes' layout feedback + MrBillups' brand feedback. One single pass.

## 1. Color Palette Swap (MrBillups)
- Primary: Navy #1E3A5F (replaces #6C3CE1)
- Secondary: Teal #0EA5A0 (replaces #00D5B3)
- CTA accent: Amber #FF6B35 (stays)
- Ink: #1A1523 (stays)
- Update ALL CSS vars in taxsight.css to match new palette
- Update all components that reference the old colors

## 2. CSS Variable System (MrBillups)
- Create a Tailwind v4 @theme block to map CSS vars to utility classes
- Replace ALL raw hex values in Landing.tsx with semantic classes
- Every `bg-[#XXX]` → `bg-surface` or `bg-primary` etc.
- Every `text-[#XXX]` → `text-ink` or `text-muted` etc.
- This enforces brand consistency and enables dark mode later

## 3. Display Font for Headings (MrBillups)
- Add Cabinet Grotesk (or Satoshi) as display font for headings
- Import via Google Fonts or @font-face
- Add `.font-display` CSS class
- Hero headline and major headings use .font-display
- Body/UI stays Inter

## 4. Branded Shadows (MrBillups)
- Each color zone gets tinted hover shadow
- Teal → teal-tinted shadow
- Purple → purple-tinted (or navy-tinted with new palette)
- Amber → amber-tinted (already exists, keep)
- Define CSS vars for each

## 5. Hero Gradient + Depth (MrBillups)
- Add subtle gradient to hero: bg-gradient-to-b from-navy/5 to-transparent
- Or from primary-bg
- Consider subtle texture/noise

## 6. Hero Headline Fix (Hermes)
- Add `max-w-4xl mx-auto` to constrain width
- Change `tracking-tight` → `tracking-tighter`
- Change `lg:text-8xl` → `lg:text-[5.5rem]`
- Change `leading-[1.05]` → `leading-[1.1]`

## 7. Feature Cards — Centered Alignment (Hermes)
- Add `text-center` to feature card containers
- Add `mx-auto` to icon wrappers
- Standardize icon size and spacing

## 8. Gradient Divider Between Sections (Hermes)
- Add `h-px bg-gradient-to-r from-transparent via-border to-transparent` between hero and features

## 9. Footer — Dark Band (Hermes)
- Change footer bg to #1A1523 (ink)
- Invert text colors to white/white-50

## 10. Sign In Button — Ghost Style (Hermes)
- Remove bg-white, border
- Demote to `text-muted hover:text-primary`
- Remove font-semibold → font-medium

## 11. Brand Name Fix (MrBillups bonus)
- Fix "SaggitarixAI" → "SagittarixAi" in Landing.tsx to match repo/org

## Files to Modify
- `ui/src/styles/taxsight.css` — CSS vars, new palette, display font, branded shadows
- `ui/src/pages/Landing.tsx` — all 10 change sets above
- `ui/src/components/KpiCard.tsx` — update color config for new palette
- `ui/src/components/BracketBar.tsx` — update gradient colors
- `ui/src/components/Sidebar.tsx` — update active state colors
- `ui/src/components/Header.tsx` — update logo/badge colors
- `ui/src/components/AiBadge.tsx` — update if needed
- `ui/src/pages/Login.tsx` — update brand references
- `ui/src/pages/Register.tsx` — update brand references
- `ui/index.html` — add display font import if needed
