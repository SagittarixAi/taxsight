# TaxSight UI — Build Spec

Build a complete, professional single-page React SPA for TaxSight (AI-powered tax clarity app).

## Brand
- Primary: #6C3CE1 (purple), Secondary: #FF6B35 (amber), Accent: #00D5B3 (teal)
- Text: #1A1523 (ink), Background: #F8F7FA, Muted: #8B8599
- Font: Inter (Google Fonts)
- Tagline: "See what you're owed."

## Tech
- React 19 + TypeScript + Vite
- @radix-ui/themes for UI primitives
- recharts for charts
- react-hook-form + zod for forms
- axios for API calls
- lucide-react for icons
- Tailwind CSS for styling (comes with Vite template)

## Pages to Build

### 1. Landing Page (`/`)
- Hero section: "See what you're owed." as huge heading, subtext "AI-powered tax clarity"
- CTA: "Get started free" (amber button) → links to /register
- 3 feature cards in a row: "AI Document Scanning", "Smart Refund Estimates", "Simple Filing"
- Clean footer with "TaxSight by SaggitarixAI"
- Professional, modern SaaS landing

### 2. Login Page (`/login`)
- Centered card layout
- Email + password fields
- "Sign in" submit button (purple)
- "Don't have an account? Sign up" link to /register
- Error state styling
- On success: store JWT in localStorage, redirect to /dashboard

### 3. Register Page (`/register`)
- Email + password + full name fields
- "Create account" button
- "Already have an account? Sign in" link
- On success: store JWT, redirect to /dashboard

### 4. Dashboard (`/dashboard`)
- Layout with sidebar nav (collapsible on mobile):
  - Dashboard icon, Upload icon, Calculations icon, History icon
- Top header: TaxSight logo + amber "AI" badge + profile icon
- Main content area with 3 KPI cards in a row:
  - **Refund Estimate** (teal themed): "$2,450", ±$200 confidence, sparkline chart
  - **Amount Owed** (amber themed): "$0" or actual amount, with status
  - **AI Status** (purple themed): "Ready to analyze" or "Upload documents"
- Below KPIs: Tax bracket visualization (horizontal gradient bar) showing where income falls
- Below that: Recent activity table (placeholder data)
- Empty state when no data: "Upload your first document to get started" with CTA

### 5. Upload Page (`/upload`)
- Drag-and-drop zone with teal dashed border
- Supports: W-2, 1099, Receipts (show icons for each)
- File upload progress indicator
- Uploaded files list with status badges (processing/complete/error)
- "Run Calculation" CTA when documents are processed

### 6. Calculations/Results Page (`/calculations`)
- Summary card: refund or owed amount with year-over-year comparison
- Marginal bracket breakdown: horizontal gradient bar showing tax bracket allocation
- Deductions comparison: standard vs itemized side-by-side
- Export buttons: "Download PDF" (purple) + "Save Report" (secondary)
- Empty state: "No calculations yet. Upload documents and run a calculation."

## API Integration
- Base URL: `http://srv1526817:8001/api` (but use env var VITE_API_URL)
- The API already exists — build the UI to consume it
- Endpoints:
  - POST /api/auth/register {email, password, full_name} → {access_token}
  - POST /api/auth/login {email, password} → {access_token}
  - POST /api/calculations/ {tax_year, gross_income, total_deductions, filing_status} → calculation result
  - GET /api/calculations/ → list of calculations
  - POST /api/documents/upload (multipart) → document object
  - GET /api/documents/ → list of documents

## Design Requirements
- Professional, clean, modern — should look like a real fintech product
- Mobile responsive (single column on mobile, multi-column on desktop)
- Smooth transitions and micro-interactions
- Loading skeletons for data fetches (not spinners)
- Empty states for every data-driven page
- Error states for failed API calls
- All components use the brand color palette
- Cards should have subtle shadows and hover elevation
- Sidebar active state should be purple
- Use tabular-nums for all financial figures ($1,234.56)
- Dark mode: NOT required for now (keep light mode)

## File Structure to Build
```
ui/src/
├── main.tsx (already exists — add Radix Theme wrapper + CSS imports)
├── App.tsx (routing)
├── api/
│   └── client.ts (axios instance with JWT interceptor)
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Upload.tsx
│   └── Calculations.tsx
├── components/
│   ├── Layout.tsx (sidebar + header layout)
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── KpiCard.tsx
│   ├── UploadZone.tsx
│   ├── BracketBar.tsx
│   ├── MoneyDisplay.tsx
│   ├── AiBadge.tsx
│   ├── StatusBadge.tsx
│   └── EmptyState.tsx
├── styles/
│   └── taxsight.css (brand tokens + component styles)
```

## CSS
Use the brand tokens from the TaxSight brand guide:
- Import Inter from Google Fonts
- All colors as CSS variables
- tabular-nums for money displays
- Smooth transitions (250ms ease)
- Card styling with border, shadow, rounded corners
- Responsive breakpoints: 640px, 1024px

Start building. Create all files. Make it look professional and polished — like a real production fintech app.
