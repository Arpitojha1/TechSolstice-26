# TechSolstice'26 🚀

The official website for **TechSolstice'26** — the annual technical fest of Manipal Institute of Technology, Bengaluru. Built with Next.js 16, featuring a modern dark theme, smooth animations, and a full event management system.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP, Framer Motion
- **3D:** Spline
- **Auth:** NextAuth.js + Supabase
- **Database:** Supabase (PostgreSQL)
- **AI Chatbot:** Google Gemini + Vector Search

---

## 📁 Project Structure

```
TechSolstice-26/
├── public/                    # Static assets (logos, images)
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components (organized by domain)
│   ├── data/                  # Static data files
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities, auth, chatbot logic
│   └── types/                 # TypeScript type definitions
├── middleware.ts              # Auth & route protection
└── package.json
```

---

## 📂 Components Structure

Components are organized into **domain-based folders** for scalability:

```
src/components/
├── admin/           # Admin dashboard components (event-form)
├── animations/      # Visual effects (GSAP scroll, patterns, grids)
│   ├── asmr-static-background.tsx
│   ├── flickering-grid.tsx
│   ├── gooey-text-morphing.tsx
│   ├── infinite-slider.tsx
│   ├── pattern-text.tsx
│   ├── scroll-path-animation.tsx
│   └── zoom-parallax.tsx
├── cards/           # Card components
│   ├── event-card.tsx
│   ├── expandable-card.tsx
│   ├── FlipCard.tsx
│   └── pixel-card.tsx
├── chat/            # AI chatbot components
│   ├── Chat.tsx
│   ├── chatbot-widget.tsx
│   └── ai-chat-ui.tsx
├── common/          # Shared layout components
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── LenisProvider.tsx
│   ├── navbar.tsx
│   ├── loading-screen.tsx
│   ├── scroll-to-top.tsx
│   └── footer.tsx
├── events/          # Event listing components
│   ├── events-client.tsx
│   ├── category-card.tsx
│   ├── category-events-client.tsx
│   └── category-page-client.tsx
├── hero/            # Homepage hero section
│   ├── hero-robot.tsx
│   ├── fest-info.tsx
│   ├── speaker-showcase.tsx
│   ├── spline-scene.tsx
│   ├── sponsors-section.tsx
│   └── trailer.tsx
├── misc/            # Miscellaneous (logo)
├── navigation/      # Navbar variants (tubelight-navbar)
├── profile/         # User profile components
├── teams/           # Team management (dashboard, registration)
└── ui/              # Base UI primitives (button, input, dialog, etc.)
```

---

## 📂 App Routes

```
src/app/
├── page.tsx                   # Homepage
├── layout.tsx                 # Root layout (providers, navbar, footer)
├── globals.css                # Global styles + Tailwind
├── events/
│   ├── page.tsx               # Events listing
│   └── [category]/page.tsx    # Category-specific events
├── profile/page.tsx           # User profile (protected)
├── passes/page.tsx            # Pass/ticket management
├── login/page.tsx             # Authentication
├── complete-profile/page.tsx  # Onboarding flow
├── help/page.tsx              # Support tickets
├── admin-dashboard/page.tsx   # Admin panel (protected)
├── chatbot/page.tsx           # Chatbot page
├── socials/page.tsx           # Social links
└── api/
    ├── auth/[...nextauth]/    # NextAuth endpoints
    ├── chat/route.ts          # AI chat API
    └── tickets/route.ts       # Support tickets API
```

---

## 📂 Lib & Utilities

```
src/lib/
├── auth.ts                    # NextAuth configuration
├── utils.ts                   # Helper functions (cn, etc.)
├── constants/categories.ts    # Event category definitions
├── chatbot/
│   ├── gemini-client.ts       # Google Gemini AI client
│   ├── vector-search.ts       # RAG vector search
│   ├── query-router.ts        # Intent routing
│   ├── cache.ts               # Response caching
│   └── rate-limiter.ts        # API rate limiting
└── hooks/useUser.ts           # User session hook
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/TechSolstice-26.git
cd TechSolstice-26

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Gemini AI
GEMINI_API_KEY=
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**TechSolstice'26** — Manipal Institute of Technology, Bengaluru
