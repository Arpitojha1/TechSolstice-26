# TechSolstice-26

This README contains exact two-line definitions for each file in the repository and the total project workflow.

- [eslint.config.mjs](eslint.config.mjs)
  ESLint configuration for the project using modern ESM format.  Defines linting rules and plugin settings for consistent code style.

- [LICENSE](LICENSE)
  Copyright and licensing terms for the repository.  Governs reuse and distribution of project code and assets.

- [next-env.d.ts](next-env.d.ts)
  TypeScript ambient declarations for Next.js types in this workspace.  Ensures editor/type-checker recognizes Next.js globals.

- [next.config.ts](next.config.ts)
  Next.js configuration file customizing build and runtime options.  Exports framework settings like image domains and rewrites.

- [package.json](package.json)
  NPM manifest listing scripts, dependencies, and metadata for the project.  Central entry for installing, building, and running tasks.

- [postcss.config.mjs](postcss.config.mjs)
  PostCSS configuration exporting plugins and options for CSS processing.  Controls tailwind/postcss transforms during builds.

- [README.md](README.md)
  This file: concise two-line descriptions and the project workflow.  Overwritten to contain only file definitions and workflow steps.

- [tsconfig.json](tsconfig.json)
  TypeScript compiler options and path mappings for the project.  Drives type-checking behavior for the codebase.

- [public/](public)
  Static assets served directly by Next.js at the root path.  Holds images, icons, and publicly consumable media.

- [public/logos/](public/logos)
  Directory containing brand and app logo assets in multiple formats.  Used across UI components for identity.

- [public/videos/](public/videos)
  Directory containing video assets used in the site.  Streamed or embedded in pages and components.

- [scripts/ingest-pdf.ts](scripts/ingest-pdf.ts)
  Script to ingest PDF content into the project's vector/search or content store.  Performs parsing, extraction, and indexing logic.

- [src/proxy.ts](src/proxy.ts)
  Lightweight HTTP proxy helper for server-side API routing or request forwarding.  Centralizes external API calls and header handling.

- [src/app/globals.css](src/app/globals.css)
  Global CSS entry for the Next.js application, including resets and Tailwind base styles.  Imported at the root layout to style the app.

- [src/app/layout.tsx](src/app/layout.tsx)
  Root layout component that wraps all pages with shared UI and metadata.  Configures global providers and persistent UI elements.

- [src/app/page.tsx](src/app/page.tsx)
  The site's main landing page component shown at the root path.  Composes hero, features, and primary navigation.

- [src/app/about/page.tsx](src/app/about/page.tsx)
  Static about page component describing the project or organization.  Presents team, mission, and background content.

- [src/app/admin-dashboard/page.tsx](src/app/admin-dashboard/page.tsx)
  Admin dashboard page for privileged users to manage app data.  Assembles admin UI components and data fetching logic.

- [src/app/api/auth/callback/route.ts](src/app/api/auth/callback/route.ts)
  API route handling OAuth/OpenID callback responses and session creation.  Verifies provider responses and sets cookies/tokens.

- [src/app/api/auth/signout/route.ts](src/app/api/auth/signout/route.ts)
  API route that signs users out, clears session cookies, and redirects.  Ensures server-side session termination.

- [src/app/api/chat/route.ts](src/app/api/chat/route.ts)
  Server API endpoint for chat-related requests, e.g., message send/receive.  Bridges frontend chat UI to backend/chat services.

- [src/app/api/events/route.ts](src/app/api/events/route.ts)
  API route listing and creating events in the application.  Handles GET/POST operations and basic validation.

- [src/app/api/events/[id]/route.ts](src/app/api/events/[id]/route.ts)
  Dynamic event API route for retrieving, updating, or deleting a specific event.  Uses route parameters to identify the resource.

- [src/app/api/teams/route.ts](src/app/api/teams/route.ts)
  API route to manage teams: list, create, update membership.  Encapsulates team CRUD operations and access control.

- [src/app/chatbot/page.tsx](src/app/chatbot/page.tsx)
  Page component that hosts the chatbot UI and controls.  Integrates chat widgets, handlers, and conversational state.

- [src/app/complete-profile/page.tsx](src/app/complete-profile/page.tsx)
  Page for users to finish onboarding by providing missing profile fields.  Submits data to the server to persist user info.

- [src/app/contact/page.tsx](src/app/contact/page.tsx)
  Contact page providing ways to reach the team or submit messages.  Includes forms or mailto/contact endpoints.

- [src/app/events/page.tsx](src/app/events/page.tsx)
  Client-facing events listing page showing upcoming/featured events.  Fetches events and displays them using event components.

- [src/app/login/page.tsx](src/app/login/page.tsx)
  Login page that initiates authentication flows (OAuth, email).  Presents sign-in UI and triggers auth API endpoints.

- [src/app/passes/page.tsx](src/app/passes/page.tsx)
  Page to view or manage passes/tickets for events.  Displays pass statuses and redemption flow.

- [src/app/profile/page.tsx](src/app/profile/page.tsx)
  User profile page to view and edit personal information.  Shows profile fields and preferences with save actions.

- [src/components/Chat.tsx](src/components/Chat.tsx)
  Reusable chat UI component implementing message list and input control.  Emits events for sending messages to APIs.

- [src/components/chatbot-widget.tsx](src/components/chatbot-widget.tsx)
  Compact chatbot floating widget for quick access to conversations.  Handles open/close state and minimal UI interactions.

- [src/components/client-navbar.tsx](src/components/client-navbar.tsx)
  Navigation bar component for client-facing pages.  Renders links, auth actions, and responsive layout behavior.

- [src/components/event-card.tsx](src/components/event-card.tsx)
  Visual card component that summarizes event details for lists.  Displays title, date, location, and CTA actions.

- [src/components/events-client.tsx](src/components/events-client.tsx)
  Component that fetches and renders a grid/list of event cards.  Encapsulates client-side data fetching and rendering logic.

- [src/components/footer.tsx](src/components/footer.tsx)
  Site footer with links, copyright year, and legal references.  Presented across site pages in the root layout.

- [src/components/hero-robot.tsx](src/components/hero-robot.tsx)
  Decorative hero component with animated robot or illustration.  Used on the landing page for visual interest.

- [src/components/layout.tsx](src/components/layout.tsx)
  Generic layout wrapper used by pages to provide consistent spacing and structure.  Composes header, main, and footer regions.

- [src/components/loading-screen.tsx](src/components/loading-screen.tsx)
  Full-screen loading indicator component for async page transitions.  Displayed during data loads or long operations.

- [src/components/navbar.tsx](src/components/navbar.tsx)
  Primary navigation component for the application with responsive behavior.  Integrates with auth state to show user controls.

- [src/components/starfield-bg.tsx](src/components/starfield-bg.tsx)
  Visual background component that renders a starfield animation.  Provides ambient motion behind content.

- [src/components/admin/event-form.tsx](src/components/admin/event-form.tsx)
  Admin form component for creating or editing event details.  Manages form state, validation, and submission handlers.

- [src/components/ui/asmr-background.tsx](src/components/ui/asmr-background.tsx)
  Decorative background component providing subtle motion/ASMR-style visuals.  Used by pages to enhance UX ambience.

- [src/components/ui/asmr-static-background.tsx](src/components/ui/asmr-static-background.tsx)
  Static fallback background asset for environments without animation.  Ensures consistent visuals across devices.

- [src/components/ui/badge.tsx](src/components/ui/badge.tsx)
  Small UI badge component indicating status or counts.  Reusable across lists and headers for annotations.

- [src/components/ui/button.tsx](src/components/ui/button.tsx)
  Theme-aware button component abstracting core styles and behaviors.  Accepts props for variants, sizes, and loading state.

- [src/components/ui/card.tsx](src/components/ui/card.tsx)
  Generic card component providing padding, shadow, and layout.  Serves as a container for content blocks.

- [src/components/ui/dialog.tsx](src/components/ui/dialog.tsx)
  Accessible dialog/modal component for confirmations and forms.  Manages open state, focus trap, and close actions.

- [src/components/ui/expandable-card.tsx](src/components/ui/expandable-card.tsx)
  Card component that can expand/collapse to reveal more content.  Controls animation and aria attributes for accessibility.

- [src/components/ui/flickering-grid.tsx](src/components/ui/flickering-grid.tsx)
  Visual component rendering a grid with subtle flicker animation.  Used as decorative background or header accent.

- [src/components/ui/FlipCard.tsx](src/components/ui/FlipCard.tsx)
  Interactive flip card that shows front and back faces on interaction.  Useful for feature highlights or reveals.

- [src/components/ui/floating-navbar.tsx](src/components/ui/floating-navbar.tsx)
  Compact floating navigation element for quick actions.  Stays visible while scrolling for quick access.

- [src/components/ui/icons.tsx](src/components/ui/icons.tsx)
  Centralized icon set and SVG components used by the UI.  Exposes named icon components for consistent use.

- [src/components/ui/input.tsx](src/components/ui/input.tsx)
  Styled input component wrapping native inputs with validation UI.  Supports text, email, and other common types.

- [src/components/ui/label.tsx](src/components/ui/label.tsx)
  Accessible label component paired with inputs for form semantics.  Provides consistent typography and spacing.

- [src/components/ui/scroll-expansion-video.tsx](src/components/ui/scroll-expansion-video.tsx)
  Video component that expands or animates based on scroll position.  Used for immersive media presentation.

- [src/components/ui/spline-scene.tsx](src/components/ui/spline-scene.tsx)
  3D scene component integrating Spline or similar embeddable scenes.  Renders interactive 3D assets in the UI.

- [src/components/ui/table.tsx](src/components/ui/table.tsx)
  Reusable data table component with optional sorting and pagination.  Displays tabular data consistently across pages.

- [src/components/ui/Teamregform.tsx](src/components/ui/Teamregform.tsx)
  Form component for team registration workflows.  Collects team member info and submits to registration endpoints.

- [src/components/ui/textarea.tsx](src/components/ui/textarea.tsx)
  Styled textarea component with resizing and validation support.  Used in forms for multi-line text input.

- [src/components/ui/tubelight-navbar.tsx](src/components/ui/tubelight-navbar.tsx)
  Themed navbar variation with tubelight visual effects.  Provides an alternate top navigation style.

- [src/hooks/use-media-query.ts](src/hooks/use-media-query.ts)
  Custom React hook to track CSS media query matches.  Returns boolean flags for responsive UI logic.

- [src/lib/utils.ts](src/lib/utils.ts)
  General-purpose utilities and helper functions for the app.  Contains shared logic reused across modules.

- [src/lib/chatbot/aliases.json](src/lib/chatbot/aliases.json)
  JSON file mapping chatbot command aliases or shorthand.  Used by chat routing to normalize user inputs.

- [src/lib/chatbot/cache.ts](src/lib/chatbot/cache.ts)
  In-memory or persistent caching utilities for chatbot data.  Stores recent responses, embeddings, or tokens to reduce calls.

- [src/lib/chatbot/gemini-client.ts](src/lib/chatbot/gemini-client.ts)
  Client wrapper to communicate with the Gemini model or LLM provider.  Encapsulates request/response formatting and auth.

- [src/lib/chatbot/query-router.ts](src/lib/chatbot/query-router.ts)
  Logic to route user queries to appropriate handlers or tools.  Matches intent to specific processors or retrieval methods.

- [src/lib/chatbot/rate-limiter.ts](src/lib/chatbot/rate-limiter.ts)
  Throttling utilities to limit API request rates for chatbot operations.  Protects downstream services and enforces quotas.

- [src/lib/chatbot/vector-search.ts](src/lib/chatbot/vector-search.ts)
  Implements vector-based search over embeddings for retrieval augmentation.  Provides nearest-neighbor and scoring helpers.

- [src/lib/hooks/useUser.ts](src/lib/hooks/useUser.ts)
  Hook to provide authenticated user data and session state to components.  Abstracts fetching and caching user info.

- [src/utils/supabase/client.ts](src/utils/supabase/client.ts)
  Supabase client initialization and helpers for DB/auth interactions.  Exports configured client instances for server or client use.
  
- [src/utils/supabase/middleware.ts](src/utils/supabase/middleware.ts)
  Middleware utilities integrating Supabase auth with Next.js routes.  Validates tokens and enriches requests with user context.

- [src/utils/supabase/server.ts](src/utils/supabase/server.ts)
  Server-side Supabase helper functions for queries and RPCs.  Contains helpers for secure DB operations and server auth.

**Total Project Workflow**

1. Install dependencies: `npm install` to fetch packages and set up dev environment.
2. Local development: `npm run dev` to start Next.js in dev mode with hot reload.
3. Environment: set required env vars (auth keys, Supabase URL/KEY, LLM credentials) before running.
4. Build: `npm run build` to compile production assets and TypeScript; `npm start` to run production server.
5. Tests & lint: `npm run lint` and `npm run test` (if present) to validate code quality and behavior.
6. Deploy: push to the chosen hosting (Vercel, Netlify, or custom) that supports Next.js; ensure env vars are set in the deployment.

End of concise file definitions and workflow.
# TechSolstice'26 🚀

