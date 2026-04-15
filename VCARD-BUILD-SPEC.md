# V Card Feature - Build Spec

## Location: /dashboard/vcard (inside jeff-cline.com)

## What It Is
A retail lead generation platform inside the jeff-cline.com dashboard. Users manage retail "pages" (product/category listings) with "Click to Site" CTA buttons. Every click costs 10 credits from the existing jeff-cline.com credit system. Yellow theme.

## Color: YELLOW (#EAB308 primary, #F59E0B accent)

## Nav Entry Already Added
DashboardNav.tsx already has: { label: "🟡 V Card", href: "/dashboard/vcard" }

## Existing Credit System (USE THIS -- do NOT create a new one)
- /api/agency/credits/use (POST) -- deducts credits, needs agency_session JWT cookie
- /api/agency/credits/status (GET) -- checks balance
- /api/agency/admin/credit-config -- admin config
- Users have credits in the "users" collection (jeff-cline MongoDB)
- Superadmin (jeff.cline@me.com) has unlimited credits

## Existing Auth (USE THIS)
- NextAuth session via useSession()
- User role in session: (session.user as any).role
- Superadmin check: role === 'superadmin'

## Database: Use existing jeff-cline MongoDB
- New collections: vcard_pages, vcard_clicks
- Do NOT create new user collection -- use existing "users"

## Pages to Create

### /dashboard/vcard/page.tsx (Main V Card Dashboard)
- Yellow-themed header
- Stats: Total pages, Total clicks, Credits remaining, Active pages
- Quick actions: Add new page, View click reports
- Recent activity feed
- For superadmin: shows all users' data; for regular users: only their own

### /dashboard/vcard/SubNav.tsx
- Sub-navigation tabs: My Pages | Add Page | Click Reports | (Admin: All Pages | Users | Credits)
- Yellow active state

### /dashboard/vcard/pages/page.tsx (My Pages)
- List all user's pages (or all pages for superadmin)
- Each row: Title, Category/Silo, CTA URL, Clicks count, Status, Edit button
- Filter by silo/category
- Superadmin can filter by user

### /dashboard/vcard/add/page.tsx (Add New Page)
- Form: Title, Slug, Category (dropdown from silo list), Description, CTA URL, Keywords
- Category options: Prescription Sunglasses, Safety Glasses, Ski Goggles, Eyeglasses, Sports, Rx Lenses, Ammo, Survival Gear, Lifestyle, Accessories
- Auto-generates slug from title
- On submit: creates page in vcard_pages with ownerId = current user

### /dashboard/vcard/reports/page.tsx (Click Reports)
- Click dashboard with stats
- Clicks per day chart (simple bar chart with divs, no external chart lib)
- Top pages by clicks
- Filter by date range
- For user: only their pages; for superadmin: all
- Export to CSV button

### /dashboard/vcard/admin/page.tsx (Superadmin Only)
- All pages across all users with bulk actions
- CTA URL manager: edit any page's CTA URL
- Control by: individual page, by user account, by silo/category
- User credit management: grant credits to users
- Page approval (approve/reject new pages from users)

## API Routes to Create

### /api/vcard/pages/route.ts
- GET: list pages (filtered by user unless superadmin)
- POST: create new page (associates with current user)

### /api/vcard/pages/[id]/route.ts
- GET: single page
- PUT: update page (only owner or superadmin)
- DELETE: soft-delete page

### /api/vcard/clicks/route.ts
- GET: click reports (filtered by user unless superadmin)
- POST: record a click (deducts 10 credits via existing credit system)

### /api/vcard/admin/route.ts
- GET: all pages, all users stats (superadmin only)
- PUT: bulk update CTAs, approve/reject pages
- POST: grant credits to user

## vcard_pages Collection Schema
```
{
  _id: ObjectId,
  title: string,
  slug: string,
  silo: string, // category
  description: string,
  keywords: string[],
  ctaUrl: string, // the "Click to Site" destination
  ctaLabel: string, // default "Click to Site"
  ownerId: ObjectId, // from users collection
  ownerEmail: string,
  status: 'active' | 'pending' | 'disabled',
  clicks: number, // denormalized count
  createdAt: Date,
  updatedAt: Date,
}
```

## vcard_clicks Collection Schema
```
{
  _id: ObjectId,
  pageId: ObjectId,
  pageSlug: string,
  destinationUrl: string,
  ownerId: ObjectId,
  ipHash: string,
  referrer: string,
  userAgent: string,
  creditsDeducted: 10,
  timestamp: Date,
}
```

## Lead Sync
Every click also sends to CRM:
POST http://127.0.0.1:3000/api/todo/webhook/lead-ingest
Header: X-CRM-Key: jc-crm-2024
Body: { source: 'vcard', type: 'click', page: slug, data: { destinationUrl, ipHash } }

## The Standalone Retail Site (adseyewear.com)
The standalone retail-site at /workspace/retail-site/ still serves as the PUBLIC-FACING retail site that users' pages appear on. V Card in jeff-cline.com is the MANAGEMENT INTERFACE. The adseyewear.com site reads from the same vcard_pages collection and displays the retail pages to the public. Clicks on adseyewear.com hit the click tracking API.

## Important
- Follow the same patterns as soft-circle (SubNav, DashboardNav, session checks)
- Yellow theme throughout (#EAB308)
- Use existing credit system -- do NOT create a new one
- Use existing auth -- do NOT create new login
- Superadmin sees everything, regular users see only their own data
