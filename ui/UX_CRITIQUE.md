# TaxSight UI — UX Critique Implementation (v3)

Implement ALL 12 items from the ChatGPT UX critique. Full rewrite of Landing.tsx.

## Palette (already done from v2 pass)
- Primary: Navy #1E3A5F
- Secondary/CTA: Amber #FF6B35
- Accent: Teal #0EA5A0
- Ink: #1A1523, Muted: #8B8599, Surface: #F8F7FA

## 1. Layout Fix — No empty space below footer
- Landing must fill viewport cleanly
- Add sections to fill: Testimonials, How It Works (3 steps), Security/Trust, Who It's For, Final CTA
- No dead white space at the bottom

## 2. Hero breathing room
- Hero headline: large, centered, max-w-4xl
- Subheadline below
- CTA row below that
- Feature cards below CTA
- Clear spacing hierarchy, no crowding

## 3. CTA copy change
- Top nav: "Get started free" (keep small)
- Hero CTA: "Get my refund estimate" (primary amber button)
- Hero secondary: "See how it works" (ghost/link button)
- "Get started free" is generic — "Get my refund estimate" connects to the promise

## 4. Wording fix — No "filing" claims
- Replace "simplifies filing" → "prepare filing-ready summaries"
- Replace "export ready-to-file reports" → "generate organized tax reports for you or your preparer"
- Be precise — don't imply IRS filing capability unless it exists

## 5. Security section with specifics
- Add dedicated security/trust section:
  - Encrypted document storage
  - Secure login
  - Data deletion controls
  - No selling tax data
  - SOC 2 roadmap mention

## 6. Card depth
- Increase card padding
- Subtle shadows
- Stronger border contrast
- Consistent icon containers

## 7. Footer anchored properly
- Footer at the very bottom after all content
- Not mid-page
- Dark ink bg with white text

## 8. Brand hierarchy
- Move "Powered by SagittarixAi" from above hero to bottom of page or footer
- Users should remember TaxSight first

## 9. How it works — 3 steps
Add section:
1. Upload your tax documents
2. TaxSight scans and organizes your data
3. Review estimates and export a filing-ready report

## 10. Audience targeting section
Add "Who it's for" section:
"Built for W-2 employees, 1099 workers, small business owners, drivers, landlords, and anyone tired of tax confusion."

## 11. Plain language
- Replace "confidence intervals" → "estimated refund range"
- Replace technical jargon with plain language throughout

## 12. Disclaimer
Add at bottom:
"TaxSight provides estimates and document organization tools. It is not legal or tax advice. Final filing decisions should be reviewed by a qualified tax professional."

## Section Order
1. Navigation header (logo + CTA)
2. Hero (headline + subheadline + CTA buttons)
3. Feature cards (3 cards: Scan, Estimate, Export)
4. How it works (3 steps)
5. Who it's for (audience targeting)
6. Security/Trust (specifics: encryption, privacy, data controls)
7. Final CTA
8. Footer with disclaimer

## Files to modify
- `ui/src/pages/Landing.tsx` — full rewrite
- `ui/src/styles/taxsight.css` — minor additions if needed
- `ui/src/components/KpiCard.tsx` — already updated
- `ui/src/components/BracketBar.tsx` — already updated
- `ui/src/components/Sidebar.tsx` — already updated
- `ui/src/components/Header.tsx` — already updated
- `ui/src/components/AiBadge.tsx` — already updated
- `ui/src/pages/Login.tsx` — already updated
- `ui/src/pages/Register.tsx` — already updated

Do NOT touch any other files. Focus only on Landing.tsx.
