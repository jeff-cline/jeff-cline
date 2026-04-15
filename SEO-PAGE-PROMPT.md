# SEO Page Build Prompt

Use this prompt every time a new page is created for jeff-cline.com.

---

## THE PROMPT

```
Build a new page for jeff-cline.com at /[slug]. Before writing any code, complete this checklist in order:

---

### 1. KEYWORD RESEARCH (before writing anything)

- [ ] Hit the SEMrush/Ahrefs API (or scrape SEO data) to pull:
  - Primary keyword for this page
  - 10-15 supporting/LSI keywords
  - Search volume and keyword difficulty for each
- [ ] Identify which of the top 6 silos this page belongs to:
  1. /entrepreneur
  2. /investors
  3. /family-offices
  4. /business
  5. /resources
  6. /portfolio-companies
- [ ] Pull the top ranking keywords for the parent silo page to inform interlinking anchor text

### 2. FAQ RESEARCH (real search data only)

- [ ] Query AnswerThePublic or SEMrush "Questions" report for the primary keyword
- [ ] Select 5-8 FAQs that have verified search volume (no invented questions)
- [ ] Structure FAQs as H3s under an H2 "Frequently Asked Questions" section
- [ ] Each FAQ answer should be 2-4 sentences, written to win featured snippets (direct answer first, then expand)

### 3. ON-PAGE SEO STRUCTURE

- [ ] **Title Tag:** Primary keyword + brand. Under 60 characters. Format: "[Primary Keyword] | Jeff Cline"
- [ ] **Meta Description:** 150-155 characters. Include primary keyword, value proposition, and CTA. Compelling enough to click.
- [ ] **H1:** One per page. Contains primary keyword. Not identical to title tag but closely related.
- [ ] **H2s:** Map to silo subtopics and supporting keywords. Each H2 targets a secondary keyword cluster. Minimum 3-5 H2 sections.
- [ ] **H3s:** Used for FAQs and sub-points under H2s. Target long-tail variations.
- [ ] **Opening paragraph:** Primary keyword in first 100 words. Hook the reader. Answer the core intent immediately.
- [ ] **Word count:** Minimum 800 words for standard pages, 1500+ for pillar/silo pages.
- [ ] **Keyword density:** Primary keyword 3-5 times naturally. Supporting keywords 1-2 times each. Never forced.

### 4. SCHEMA MARKUP (structured data)

- [ ] **WebPage schema** on every page (name, description, url, isPartOf: WebSite)
- [ ] **FAQPage schema** if page has FAQs (Question + acceptedAnswer for each)
- [ ] **BreadcrumbList schema** showing hierarchy: Home > Silo > Page
- [ ] **Organization schema** on key pages (name, url, logo, contactPoint, sameAs)
- [ ] **Article schema** for blog posts (headline, author, datePublished, dateModified, image)
- [ ] **Person schema** for Jeff Cline pages (name, jobTitle, url, sameAs)
- [ ] Validate all schema at https://validator.schema.org before shipping

### 5. OPEN GRAPH & SOCIAL META

- [ ] `og:title` — Same as or similar to title tag
- [ ] `og:description` — Same as meta description
- [ ] `og:image` — 1200x630px minimum. Unique per page if possible, fallback to site default.
- [ ] `og:url` — Canonical URL of the page
- [ ] `og:type` — "website" for pages, "article" for blog posts
- [ ] `og:site_name` — "Jeff Cline"
- [ ] `twitter:card` — "summary_large_image"
- [ ] `twitter:title`, `twitter:description`, `twitter:image` — Mirror OG tags

### 6. ANSWER ENGINE OPTIMIZATION (AEO / GEO)

- [ ] Write content that directly answers "what is," "how to," "why" queries in the first 1-2 sentences of each section
- [ ] Use structured lists, tables, and definition-style formatting that LLMs can easily parse
- [ ] Include an "In Summary" or "Key Takeaways" section with bullet points (LLMs love pulling from these)
- [ ] Cite authoritative sources where relevant (builds E-E-A-T signals)
- [ ] Use clear, unambiguous language — avoid idioms or metaphors that confuse AI parsers
- [ ] Ensure the page would make sense as a standalone answer if an AI quoted any single section

### 7. INTERLINKING STRATEGY

- [ ] **Link UP to parent silo page:** At least 1-2 contextual links using keyword-rich anchor text pointing to the parent silo (e.g., "investment strategies for entrepreneurs" linking to /entrepreneur)
- [ ] **Link ACROSS to related pages:** 2-3 links to sibling pages within the same silo
- [ ] **Link to OTHER silos where relevant:** If content naturally references another silo topic, link to it (e.g., mentioning family offices from an investors page)
- [ ] **Anchor text rules:**
  - Use the target page's primary keyword as anchor text
  - Vary anchor text across pages (don't use identical anchors everywhere)
  - Never use "click here" or "learn more" as anchor text
- [ ] **Link from existing pages back to this new page:** After publishing, update 2-3 existing pages to add contextual links pointing to the new page

### 8. TECHNICAL SEO

- [ ] **Canonical URL:** Set `<link rel="canonical">` to the definitive URL
- [ ] **URL structure:** Short, lowercase, hyphenated, contains primary keyword. No dates, no IDs, no parameters.
- [ ] **Image optimization:** All images have descriptive `alt` text with keywords where natural. Use next/image for lazy loading and format optimization.
- [ ] **Internal breadcrumbs:** Visible breadcrumb navigation matching BreadcrumbList schema
- [ ] **Mobile responsive:** Test at 375px, 768px, 1024px
- [ ] **Page speed:** No render-blocking resources. Images optimized. Aim for 90+ Lighthouse performance.
- [ ] **Add to sitemap:** Verify the page appears in /sitemap.xml after deploy

### 9. E-E-A-T SIGNALS (Experience, Expertise, Authoritativeness, Trustworthiness)

- [ ] Author attribution where appropriate (Jeff Cline)
- [ ] Link to credentials, about page, or LinkedIn
- [ ] Reference real data, case studies, or verifiable claims
- [ ] Include dates (published, updated) for freshness signals
- [ ] Link to authoritative external sources (SEC, Bloomberg, etc.) where relevant

### 10. PRE-PUBLISH CHECKLIST

- [ ] Run page through an SEO audit tool or manual check
- [ ] Validate all schema markup
- [ ] Check all internal links resolve (no 404s)
- [ ] Preview OG tags with https://www.opengraph.xyz/
- [ ] Test on mobile
- [ ] Verify page is in sitemap
- [ ] Build completes without errors
- [ ] Deploy to production

---

### SILO KEYWORD MAP (update as SEO data evolves)

| Silo | Primary Keyword | Top Supporting Keywords |
|------|----------------|----------------------|
| /entrepreneur | entrepreneur consulting | startup advisor, business disruption, tech entrepreneur |
| /investors | investor strategy | investment opportunities, portfolio management, ROI |
| /family-offices | family office technology | wealth management, multi-family office, family office advisory |
| /business | business consulting | digital transformation, business strategy, scale operations |
| /resources | business resources | tools, guides, industry reports |
| /portfolio-companies | portfolio companies | venture portfolio, startup investments, company portfolio |

---

### OUTPUT FORMAT

When building the page, provide:
1. The complete page component (.tsx file)
2. Any schema JSON-LD that should be embedded
3. List of existing pages that need interlinking updates (with the exact anchor text and placement)
4. Confirmation that all 10 sections above are satisfied
```

---

## USAGE

Paste the prompt above into any session when requesting a new page. Replace `[slug]` with the target URL path. Add any page-specific context after the prompt.
