# Jeff Cline Platform — Full Build Documentation

## What Was Built

### 🔐 Authentication System
- **Login** (`/login`) — Email/password with "Remember Me", error handling
- **Signup** (`/signup`) — Full registration with silo selection, password validation
- **Forgot Password** (`/forgot-password`) — Token-based reset flow (email integration TODO)
- **NextAuth.js v5** with JWT strategy and MongoDB adapter
- **SessionProvider** wrapping the entire app
- **Protected routes** via middleware (dashboard, admin, API routes)

### 📊 User Dashboard
- **Main Dashboard** (`/dashboard`) — Stats, silo paths, quiz results, recommended resources, CTA
- **Silo Dashboards** (`/dashboard/[silo]`) — Per-silo tools, resources, deep dives, progress tracking

### 🛠️ Tools & Resources
- **Tools Directory** (`/tools`) — Featured quiz, categorized tools by silo
- **Resources Library** (`/resources`) — Filterable by silo and type
- **Silo Resources** (`/resources/[silo]`) — Per-silo resource pages with featured items
- **25 seed resources** across all 5 silos (auto-seeded on first load)

### 👑 Admin Portal (`/admin`)
- **Overview** — Total users, quiz submissions, resources, 7-day activity, silo distribution chart
- **User Management** — Table with name, email, silo, role, quiz count, join date
- **Quiz Results** — All submissions with silo, industry, date
- **Resource Management** — Add/view resources with silo and type
- **API Key Management** — Add/view masked API keys for GHL, OpenAI, Stripe, etc.
- **Role-protected** — Only users with `role: "admin"` can access

### 🔗 GoHighLevel Integration
- **Quiz webhook** — Quiz submissions auto-push to GHL webhook if configured
- **Contact push** (`/api/ghl/contact`) — Push contacts to GHL REST API
- **Incoming webhook** (`/api/ghl/webhook`) — Receive GHL events, store, and sync
- **Admin-configurable** — API keys set via admin portal, stored in MongoDB

### 🗄️ API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |
| `/api/auth/register` | POST | User registration |
| `/api/auth/forgot-password` | POST | Password reset token |
| `/api/users` | GET/PUT | User CRUD (admin list, self-update) |
| `/api/quiz` | GET/POST | Quiz submission & retrieval |
| `/api/admin/users` | GET | Admin user list with quiz data |
| `/api/admin/resources` | GET/POST/DELETE | Resource CRUD |
| `/api/admin/api-keys` | GET/POST/DELETE | API key management |
| `/api/admin/analytics` | GET | Dashboard analytics |
| `/api/ghl/webhook` | POST | GHL incoming webhook |
| `/api/ghl/contact` | POST | Push contact to GHL |

### 🗃️ Database Schema (MongoDB)
- **users** — email, password (bcrypt), name, phone, company, siloInterest, role, createdAt
- **quizResults** — email, name, silo, answers[], industry, painPoints, createdAt
- **resources** — title, silo, type, description, featured, createdAt
- **apiKeys** — service, key, createdBy, createdAt
- **passwordResets** — email, token, expires (TTL index)
- **ghlWebhookEvents** — raw webhook payloads

### 🎨 UI/Design
- FIREHORSE theme: dark #111, orange #FF8900, red #DC2626
- Responsive mobile-first design
- Header shows auth state (Sign In / Dashboard / Admin / Sign Out)
- Consistent card-hover, btn-primary, btn-secondary, gradient-text styles
- Animations: fade-in-up, pulse-glow

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Quick Start
```bash
# Install deps
npm install

# Set environment variables
cp .env.local.example .env.local  # Edit with your values

# Seed admin user (requires MongoDB running)
npx tsx scripts/seed.ts

# Run dev server
npm run dev
```

### Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/jeff-cline
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GHL_API_KEY=optional
GHL_WEBHOOK_URL=optional
GHL_LOCATION_ID=optional
```

### Default Admin Login
- Email: `jeff.cline@me.com`
- Password: `profit-at-scale-2024`

## Tech Stack
- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **NextAuth.js v5** (Auth.js)
- **MongoDB** (native driver + Auth adapter)
- **bcryptjs** (password hashing)
- **TypeScript**

## Notes
- Next.js 16 shows a middleware deprecation warning (recommends "proxy" convention) — this is cosmetic and doesn't affect functionality
- Resources auto-seed on first GET if the collection is empty
- Quiz submissions automatically push to GHL if webhook URL is configured
- Admin portal is fully functional but API keys are stored as-is (add encryption for production)
