# Dumpster — Visual Drop / Triage / Manage

**Date:** 2026-04-15
**Owner:** Jeff Cline (admin)
**Route:** `/dumpster`

## Goal

A visual, low-friction place for Jeff to "dump" ideas, photos, voice notes, and opportunities. A team (coordinators, EAs, company managers, service providers) then triages those raw **seeds** into the right company or project, works them as cards with priority, color, and comments. Inspired by Slack/Monday, but image-first.

## Phased delivery (the whole thing, shipped in slices)

- **MVP (this commit):** auth gate, admin seed, `/dumpster` page, intake (note + photo/file), list of seeds, status/priority, assign to company, comments. Role-aware UI (admin / coordinator / contributor / service_provider / company_*).
- **v1:** Kanban board with drag/drop lanes, color/frame-per-company visual language, nested Company → Project navigation.
- **v2:** AI triage (Claude vision) auto-suggests company/project + tags on upload.
- **v3:** Service-provider portal, JV/finance linking, Slack-style threads, sales tracking.

## Architecture

- **Framework:** Next.js 16 App Router (existing). Tailwind v4. Route handlers for API.
- **Auth:** existing NextAuth v5 + MongoDB adapter. `role` on session user.
- **DB:** MongoDB (existing `getDb()` helper). New collections: `dumpster_seeds`, `dumpster_companies`, `dumpster_projects`, `dumpster_comments`. Users collection is extended with `role` values listed below.
- **Files:** `multipart/form-data` upload to `POST /api/dumpster/upload` — MVP stores base64 in the seed doc (<1MB guard) so we ship without needing Vercel Blob env vars. v1 migrates to Vercel Blob.
- **AI:** v2 only. Not in MVP.
- **Realtime:** MVP polls every 10s. v1 adds SSE.

## Roles

- `admin` — full control; bootstrapped from env
- `coordinator` — triage + manage any company/project
- `executive_assistant` — same as coordinator (label differs)
- `company_owner` — their company tree only
- `company_management` / `company_staff` — scoped, read+comment
- `service_provider` — own submissions + linked opportunities
- `user` / `contributor` — can drop seeds, see their own

Middleware pattern mirrors existing `/admin` page check (`session.user.role`).

## Data model (MongoDB)

```ts
// dumpster_seeds
{
  _id: ObjectId,
  createdBy: userId,
  kind: "note" | "photo" | "file" | "voice",
  title: string,                // auto "Seed YYYY-MM-DD HH:MM" if missing
  note: string,                 // free text
  attachment?: {
    mime: string,
    name: string,
    dataUrl: string,            // MVP — base64 inline
    size: number,
  },
  status: "raw" | "triaging" | "assigned" | "archived",
  companyId?: ObjectId,
  projectId?: ObjectId,
  priority: "urgent" | "high" | "normal" | "low",
  color: "red" | "yellow" | "green" | "blue" | "purple" | "pink" | "gray",
  tags: string[],
  createdAt: Date,
  updatedAt: Date,
}

// dumpster_companies
{ _id, name, color, frameStyle: "solid"|"dashed"|"dotted"|"double", createdAt }

// dumpster_projects
{ _id, companyId, name, createdAt }

// dumpster_comments
{ _id, seedId, userId, userName, body, createdAt }
```

## API routes

- `GET  /api/dumpster/seeds` — list (scoped by role)
- `POST /api/dumpster/seeds` — create (any authenticated user)
- `PATCH /api/dumpster/seeds/:id` — update status/priority/color/company/project (coordinator+ or owner of seed for their own)
- `DELETE /api/dumpster/seeds/:id` — admin/coordinator
- `POST /api/dumpster/seeds/:id/comments`
- `GET  /api/dumpster/companies` — list
- `POST /api/dumpster/companies` — admin/coordinator
- `POST /api/dumpster/projects`
- `POST /api/admin/seed-bootstrap` — idempotent: creates admin user from `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` env vars.

## UI

`/dumpster` page:

- **Top bar:** "Drop something" button (opens modal with note + file + priority + color + optional company), role chip.
- **Filter row:** status, company, priority, assigned-to-me.
- **Board grid:** cards arranged by status (Raw / Triaging / Assigned / Archived). Color dot = priority. Left-border color = company. Clicking a card opens detail sheet with comments + edit.
- **Admin nav:** link on existing site header to `/dumpster` (shows only when signed in).

## Bootstrap

`scripts/seed-admin.ts` reads `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` from env, creates or upgrades the user to `role: "admin"` with bcrypt hash. Documented in `README` section. Password must not live in source; user places it in `.env.local`.

## Security

- Do not log seed content.
- Image base64 limited to 1.5MB in MVP to protect mongo doc size.
- All mutating routes require `auth()` session and role check.

## Out of scope (for MVP)

- Drag/drop between lanes (v1)
- AI triage (v2)
- Service-provider portal pages (v3)
- JV/finance tracking (v3)
- Real-time SSE (v1)
- Voice memo transcription (v2)
