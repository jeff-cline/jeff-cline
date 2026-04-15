# Jeff-Cline.com - Remaining Build Tasks

## CONTEXT
This is a Next.js 16 site (App Router, React 19, Tailwind v4, NextAuth v5, MongoDB).
Brand: FIREHORSE theme - dark #111, orange #FF8900, red #DC2626.
Brand Promise: PROFIT AT SCALE
Tagline: "Every Industry is a GEEK away from being UBERIZED"

5 Silos: Business, Entrepreneur, Start-Ups, Investors, Family Offices

Each silo addresses 3 problems with INCREASE and DECREASE framework:
INCREASE: Scalable Demand Engine, Highly Efficient Sales Teams, IP & Technology to increase IP Value and Exit Multiples
DECREASE: Reduction in Cost, Reduction in Risk, Reduction in Operational Strain
All using predictive analytics, big data, proprietary technology.

## PHASE 1: Missing Pages
- [ ] /portfolio - "Portfolio Companies Hero" page - ecosystem showcase, #ArtLab mention, "A Rising Tide Lifts All Boats" motto, each portfolio company gets a card with title, brief description, brand promise. Include a mechanism to add new projects as they launch.
- [ ] /about - Jeff's bio page. 30+ years enterprise executive, tech visionary. Exciting, rockish, confident, contagious kick-ass energy. FIREHORSE #GIDDYUP vibe. Target audience: executives, enterprise leaders, the god between 30 years of value at scale.
- [ ] /blog - Blog shell with category support, SEO-optimized post structure, interlinking to silo pages
- [ ] /privacy - Privacy policy page
- [ ] /terms - Terms of service page  
- [ ] Custom 404 page (src/app/not-found.tsx)

## PHASE 2: SEO / AEO (CRITICAL - Jeff's standing standard for ALL projects)
- [ ] Add metadata exports to EVERY page (title, description, openGraph, twitter cards)
- [ ] Create sitemap.xml (src/app/sitemap.ts - dynamic)
- [ ] Create robots.txt (src/app/robots.ts)
- [ ] Add JSON-LD structured data to all pages (Organization, WebSite, BreadcrumbList, FAQPage where applicable)
- [ ] Rich snippets for silo pages
- [ ] Keyword tier structure - HIGH VALUE keywords in H1/H2, supporting keywords in content
- [ ] AEO optimization - structure content as Q&A, FAQ sections on silo pages so Claude/ChatGPT/LLMs can extract answers (zero-click optimization)
- [ ] Meta descriptions optimized for both Google snippets and LLM extraction

## PHASE 3: Silo Content Rewrite
- [ ] Rewrite all 5 silo landing pages with full Increase/Decrease framework
- [ ] Rewrite all 25 sub-pages with deep keyword-optimized content
- [ ] Add FAQ sections to each silo page (AEO)
- [ ] Ensure every sub-page links back to parent silo and cross-links to related sub-pages
- [ ] Each silo's CTA leads to either /contact or a silo-specific quiz

## PHASE 4: Footer Nav Overhaul
- [ ] All 25 keyword sub-pages listed in footer nav, organized by silo
- [ ] Interlink all pages properly
- [ ] Add Portfolio Companies link
- [ ] Add Blog link
- [ ] Add Privacy/Terms links

## PHASE 5: Dashboard Expansion (Agency-Style at /dashboard)
- [ ] Lead gen funnel reporting (quiz submissions, conversions, source tracking)
- [ ] Real-time expense tracking / ad spend monitoring
- [ ] Tracking pixel management (add/remove pixels)
- [ ] Downloadable reports (PDF/CSV)
- [ ] Per-silo analytics breakdown
- [ ] Custom onboarding quiz per silo (not just one generic quiz)

## PHASE 6: Marketing Integrations
- [ ] Email marketing integration points (Klaviyo/Mailchimp - admin configurable API keys already exist)
- [ ] Social media management hooks
- [ ] Retargeting pixel setup (Meta, Google)
- [ ] Notification system for lead capture events
- [ ] Discord feed integration

## PHASE 7: Favicon & Easter Egg
- [ ] Replace current favicon with JC-444 favicon from /Users/jeffcline/.openclaw/workspace/tools/JEFF-CLINE-444/
- [ ] Add tiny "JC" easter egg link in footer (6px, opacity 0.08) linking to https://jeff-cline.com
