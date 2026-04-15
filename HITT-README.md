# HITT (High Intent Targeted Tier) System

## Overview
The HITT system provides a ranked work list of high-value leads based on estimated net worth, integrated with SJSC cruise directory profiles.

## Components Built

### 1. Seed Script: `scripts/seed-hitt.js`
- Reads `/tmp/sjsc_hitt_ranked.json` (64 ranked leads)
- Cross-references with `sjsc_directory` MongoDB collection
- Merges ranking data with profile data (photos, bios, social links)
- Creates `sjsc_hitt` MongoDB collection
- **Usage:** `node scripts/seed-hitt.js`

### 2. API Route: `/api/sjsc/hitt`
- **Endpoint:** GET `/api/sjsc/hitt`
- **Query Params:** `?tier=1|2|3|4` (optional filter)
- Returns leads sorted by rank with all merged data
- Follows existing API patterns using `getTodoDb()`

### 3. HITT Work List Page: `/sjsc/hitt`
- Dark theme matching jeff-cline.com aesthetic
- Tier filtering buttons with color coding:
  - **TIER 1** ($10M+): Neon Green (#39FF14)
  - **TIER 2** ($1M-$10M): Orange (#FF8900)
  - **TIER 3** ($250K-$1M): Gold (#D4A843)
  - **TIER 4** (Unknown): Gray (#666)
- Expandable lead rows showing:
  - **Collapsed:** Rank, photo, name, company, net worth, tier badge, confidence, key facts, email
  - **Expanded:** Full bio, expertise, looking for, social links, SJSC rating, profile match status

### 4. Navigation Integration
- **SJSC Page:** Added prominent "🎯 View HITT Work List" button
- **Vault Sidebar:** Added "HITT List" link under Directories section

## Data Structure
Each HITT lead contains:
- **Ranking Data:** rank, estimatedNetWorth, tier, confidence, keyFacts
- **Contact Info:** name, email, company, title, phone
- **SJSC Profile Data:** photo, bio, expertise, lookingFor, social links, rating, notes
- **Metadata:** hasProfileMatch, sjscProfileId, timestamps

## Tier Color System
- Visual hierarchy with distinct colors for each tier
- Left border accents and background tints for tier separation
- Consistent color usage across badges, filters, and net worth display

## Mobile Responsive
- Responsive grid layout
- Touch-friendly expanded views
- Mobile-optimized typography and spacing

## Next Steps
1. **Start MongoDB** and run the seed script to populate data
2. **Test functionality** with live data
3. **Optional enhancements:**
   - Search functionality
   - Export features
   - Lead action tracking
   - Integration with CRM workflows

## Files Created/Modified
- ✅ `scripts/seed-hitt.js` - Data seeding script
- ✅ `src/app/api/sjsc/hitt/route.ts` - API endpoint
- ✅ `src/app/sjsc/hitt/page.tsx` - Main HITT page component
- ✅ `src/app/sjsc/page.tsx` - Added HITT button
- ✅ `src/app/todo/VaultApp.tsx` - Added sidebar link

**Build Status:** ✅ Compilation successful, ready for deployment!