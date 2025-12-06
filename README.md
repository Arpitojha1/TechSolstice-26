# TechSolstice'26 🚀

The official web platform for TechSolstice 2026 - Manipal University's largest techno-cultural fest.

> ⚠️ **Note:** Frontend design is not final and will be updated.

---

## ✅ Working Features

### Authentication
- [x] Google OAuth login (for external guests)
- [x] Microsoft/Azure OAuth login (for Manipal students)
- [x] Auto-detection of auth provider (stored in `auth_provider` column)
- [x] Session management with Supabase Auth
- [x] Protected routes with middleware
- [x] Profile completion flow for Google users (name collection)
- [x] Auto-redirect based on user state (new user → complete profile, returning user → passes)

### User Management
- [x] Profile creation/update with upsert
- [x] Row Level Security (RLS) on profiles table
- [x] Admin role detection and routing

### Pages
- [x] Landing page with hero, events preview, and about section
- [x] Login page with Google & Microsoft options
- [x] Complete profile page (for Google users missing name)
- [x] Passes page (protected)
- [x] Admin dashboard (protected, admin-only)

---

## 📁 Project Structure

```
src/
├── middleware.ts              # Auth protection & routing logic
├── app/
│   ├── layout.tsx             # Root layout with fonts & metadata
│   ├── page.tsx               # Landing page (hero, events, about)
│   ├── globals.css            # Global styles (Tailwind)
│   ├── login/
│   │   └── page.tsx           # Login page with OAuth buttons
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts       # OAuth callback handler, creates profile
│   │   └── signout/
│   │       └── route.ts       # Sign out handler
│   ├── complete-profile/
│   │   └── page.tsx           # Name collection for Google users
│   ├── passes/
│   │   └── page.tsx           # User passes dashboard (protected)
│   └── admin-dashboard/
│       └── page.tsx           # Admin panel (protected, admin-only)
└── utils/
    └── supabase/
        ├── client.ts          # Browser Supabase client
        ├── server.ts          # Server-side Supabase client
        └── middleware.ts      # Session refresh helper
```

---

## 📄 File Descriptions

### Core Files

| File | Description |
|------|-------------|
| `src/middleware.ts` | Protects routes, redirects unauthenticated users to login, forces incomplete profiles to `/complete-profile`, restricts admin pages to admins only |
| `src/app/layout.tsx` | Root layout wrapper with HTML structure, fonts, and metadata |
| `src/app/globals.css` | Tailwind CSS imports and global style variables |

### Pages

| File | Description |
|------|-------------|
| `src/app/page.tsx` | Landing page with navigation, hero section, featured events grid, about section, and footer |
| `src/app/login/page.tsx` | Login UI with Google and Microsoft OAuth buttons |
| `src/app/complete-profile/page.tsx` | Form for Google users to enter their full name (required for pass generation) |
| `src/app/passes/page.tsx` | Protected page showing user's event passes |
| `src/app/admin-dashboard/page.tsx` | Admin-only dashboard for managing the fest |

### Auth Routes

| File | Description |
|------|-------------|
| `src/app/auth/callback/route.ts` | Handles OAuth redirect, exchanges code for session, creates/updates profile with `auth_provider`, routes user based on profile completeness |
| `src/app/auth/signout/route.ts` | Signs out user and clears session |

### Supabase Utilities

| File | Description |
|------|-------------|
| `src/utils/supabase/client.ts` | Creates Supabase client for browser/client components |
| `src/utils/supabase/server.ts` | Creates Supabase client for server components/API routes |
| `src/utils/supabase/middleware.ts` | Helper to refresh auth session in Edge middleware |

---

## 🗄️ Database Schema

### `profiles` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, matches `auth.users.id` |
| `email` | TEXT | User's email |
| `full_name` | TEXT | User's full name (required for passes) |
| `auth_provider` | TEXT | OAuth provider (`google` or `microsoft`) |

### `admins` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | References `profiles.id` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project with Google & Azure OAuth configured

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔒 Supabase RLS Policies

Run these in Supabase SQL Editor:
```sql
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

---

## 📝 TODO

- [ ] Finalize frontend design
- [ ] Add event registration
- [ ] Payment integration
- [ ] QR code pass generation
- [ ] Email notifications

---

## 📄 License

MIT
