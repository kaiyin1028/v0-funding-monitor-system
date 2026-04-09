# Architecture Documentation

## Overview

Hong Kong Education Funding Monitor System is a Next.js 15 application built with TypeScript, designed to help the Hong Kong Educational Equipment Industry Association (HKEEIA) track and manage government funding opportunities.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | UI components |
| SWR | 2.x | Data fetching and caching |
| Lucide React | latest | Icons |

### Why This Stack?

- **Next.js 15 App Router**: Server components for better performance, built-in routing, and API routes for future backend integration
- **TypeScript**: Type safety reduces bugs and improves developer experience
- **Tailwind CSS 4**: Utility-first CSS with CSS variables for theming
- **shadcn/ui**: High-quality, accessible components that can be customized
- **SWR**: Lightweight data fetching with built-in caching, revalidation, and mutation support

## Directory Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main dashboard page
│   ├── database/                 # Database page
│   │   └── page.tsx
│   └── globals.css               # Global styles and theme
│
├── components/                   # Legacy components (being migrated)
│   ├── ui/                       # shadcn/ui components
│   └── *.tsx                     # Feature components
│
├── src/                          # New source structure
│   ├── components/               # New components
│   │   └── ui/                   # State components (loading, error, empty)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── index.ts              # Hooks export
│   │   ├── use-auth.ts           # Authentication hooks
│   │   └── use-funding.ts        # Funding data hooks
│   │
│   ├── lib/                      # Utilities and API client
│   │   └── api-client.ts         # Centralized API client
│   │
│   ├── mocks/                    # Mock data and services
│   │   ├── index.ts              # Mocks export
│   │   ├── data.ts               # Centralized mock data
│   │   ├── auth.mock.ts          # Auth mock service
│   │   ├── funding.mock.ts       # Funding mock service
│   │   ├── user.mock.ts          # User mock service
│   │   └── monitoring.mock.ts    # Monitoring mock service
│   │
│   ├── services/                 # API service layer
│   │   ├── index.ts              # Services export
│   │   ├── auth.service.ts       # Authentication API
│   │   ├── funding.service.ts    # Funding programs/sources API
│   │   ├── user.service.ts       # User management API
│   │   └── monitoring.service.ts # Monitoring logs API
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # All types
│
├── lib/                          # Legacy utilities
│   ├── utils.ts                  # Utility functions
│   ├── funding-data.ts           # Static funding data (legacy)
│   └── export-utils.ts           # CSV export utilities
│
├── hooks/                        # Legacy hooks
│
├── scripts/                      # Database scripts
│   ├── database-schema.sql       # PostgreSQL schema
│   └── seed-data.sql             # Initial data
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── PAGES_AND_DATA.md         # Pages documentation
│   ├── API_CONTRACT.md           # API specification
│   └── INTEGRATION_GUIDE.md      # Backend integration guide
│
├── public/                       # Static assets
│   └── images/                   # Generated images
│
└── .env.example                  # Environment variables template
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Components                           │
│  (pages, components with loading/error/empty states)           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Custom Hooks (SWR)                         │
│  useFundingPrograms, useAuth, useDashboardStats, etc.          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                              │
│  authService, fundingService, userService, monitoringService   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│    Mock Services      │       │    Real API Client    │
│  (USE_MOCKS=true)     │       │  (USE_MOCKS=false)    │
└───────────────────────┘       └───────────────────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│   In-Memory Data      │       │   Backend API         │
│   (src/mocks/data.ts) │       │   (to be built)       │
└───────────────────────┘       └───────────────────────┘
```

## State Management

### Client State
- **SWR**: Used for all server state (API data fetching, caching, revalidation)
- **React useState**: Used for local component state (forms, UI toggles)

### Data Fetching Pattern

```typescript
// 1. Define service in src/services/
export const fundingService = {
  async getPrograms(params) {
    return apiClient.get('/funding/programs', params)
  }
}

// 2. Create hook in src/hooks/
export function useFundingPrograms(params) {
  const { data, error, isLoading, mutate } = useSWR(
    ['funding-programs', params],
    () => fundingService.getPrograms(params)
  )
  return { programs: data?.data, isLoading, error, mutate }
}

// 3. Use in component
function ProgramList() {
  const { programs, isLoading, error } = useFundingPrograms()
  
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!programs?.length) return <EmptyState />
  
  return <Table data={programs} />
}
```

## Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_USE_MOCKS` | Enable mock mode | `true` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

## Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Login   │────▶│ authService  │────▶│  Store JWT  │
│  Form    │     │   .login()   │     │ localStorage│
└──────────┘     └──────────────┘     └─────────────┘
                        │
                        ▼
               ┌──────────────┐
               │ Update SWR   │
               │ user cache   │
               └──────────────┘
```

- JWT tokens stored in localStorage
- Token automatically attached to requests via apiClient
- 401 responses trigger automatic logout

## Theming

Theme is defined in `app/globals.css` using CSS custom properties:

```css
:root {
  --background: oklch(0.995 0 0);
  --foreground: oklch(0.15 0.01 240);
  --primary: oklch(0.45 0.18 250);
  /* ... */
}

.dark {
  --background: oklch(0.12 0.01 240);
  /* ... */
}
```

## Performance Considerations

1. **Server Components**: Use RSC where possible for reduced JS bundle
2. **SWR Caching**: Automatic request deduplication and caching
3. **Image Optimization**: Use Next.js Image component
4. **Code Splitting**: Dynamic imports for large components
