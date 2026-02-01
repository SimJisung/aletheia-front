# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PROS (Personal Reasoning OS) frontend - a decision support system UI that surfaces past patterns rather than making recommendations. Core philosophy: "AI doesn't decide, it recalls your past self."

**Key constraints:**
- Never recommend specific choices ("choose A")
- P(A|Me) represents pattern alignment, not success probability
- Value conflicts are preserved, not resolved
- Records are immutable (soft-delete only)

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest in watch mode
npm run test:run     # Single test run
npm run test:coverage # Coverage report
```

Run a single test file:
```bash
npx vitest run src/lib/api/__tests__/client.test.ts
```

## Environment Setup

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Requires aletheia-core backend running. In development, Next.js rewrites proxy `/api/v1/*` requests to the backend (configured in `next.config.js`).

## Architecture

### Path Alias
`@/*` maps to `./src/*`

### API Layer (`src/lib/api/`)
- `client.ts` - Singleton `apiClient` with JWT token + legacy X-User-Id header injection
- `auth.ts` - Authentication endpoints (login, register, OAuth)
- `fragments.ts`, `decisions.ts`, `values.ts` - Domain-specific API wrappers
- Two request modes: `request()` (authenticated) and `requestWithoutAuth()` (login/register)

### State Management
- Zustand store in `src/stores/userStore.ts` with localStorage persistence
- Persists `user`, `token`, `userId`, and `onboarding` state under key `pros-user`
- `initializeAuth()` restores auth state on app load; syncs with `apiClient`

### Routing (Next.js App Router)
- `(main)/` - Protected pages; `layout.tsx` redirects to `/onboarding` if `onboarding.isComplete` is false
- `login/`, `register/`, `oauth/` - Authentication flows
- `onboarding/` - First-time user setup flow

### Domain Types (`src/types/`)
- `ThoughtFragment` - User's recorded thoughts with mood (valence/arousal)
- `Decision` - Binary choice with probability scores, regret risk, and value alignment
- `ValueGraph` - 8 fixed value axes (GROWTH, STABILITY, FINANCIAL, AUTONOMY, RELATIONSHIP, ACHIEVEMENT, HEALTH, MEANING)
- `User`, `AuthResponse` - Authentication types

### Component Organization
- `ui/` - Reusable primitives (Button, Card, Input, Modal, Badge, SafeText, Tabs)
- `auth/` - Login, register, and OAuth components
- `fragments/`, `decisions/`, `values/` - Domain-specific components
- `layout/` - App shell components (Header, MainLayout)

### Hooks
- `useAsync` - Wraps async operations with loading/error states, handles `ApiError` specifically

### Security
- `SafeText` component and `lib/sanitize.ts` use DOMPurify for XSS prevention
- JWT token stored in localStorage under `pros-auth-token`
- User ID stored in localStorage under `pros-user-id` (legacy, being migrated to JWT)

## API Integration

Backend uses versioned endpoints at `/api/v1/`:
- Auth: Login, register, OAuth (Google, GitHub), `/users/me`
- Fragments: CRUD + semantic similarity search
- Decisions: Create, get explanation (LLM-generated), submit feedback (24-72h window)
- Values: Graph queries, conflict detection, summaries

OAuth flow: `getOAuthUrl()` helper generates backend OAuth URLs; callback handled at `/oauth/callback`.

## Testing

Uses Vitest with React Testing Library. Setup in `src/test/setup.ts` mocks:
- `localStorage`
- `crypto.randomUUID`
- `fetch`
- `next/navigation`
- `window.matchMedia`
