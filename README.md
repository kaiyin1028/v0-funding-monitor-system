# Hong Kong Education Funding Monitor System
# 香港教育資助監測系統

A comprehensive monitoring dashboard for tracking government and foundation funding opportunities for non-profit education organizations in Hong Kong.

專為香港非牟利教育機構設計的資助監測系統，用於追蹤政府及基金會的資助機會。

**Organization**: Hong Kong Educational Equipment Industry Association (HKEEIA)
**Target Users**: K-12 students, teachers, principals, and parents in Hong Kong

## Features 功能

- **Real-time Monitoring Dashboard** - Track 18+ funding sources including government departments and foundations
- **Funding Programs Database** - Complete database with filtering, sorting, and favorites
- **Deadline Timeline** - Visual timeline of upcoming application deadlines
- **Excel Export** - Export funding data to CSV format with Chinese character support
- **Calendar Reminders** - Export deadline reminders to ICS calendar format
- **Mock/API Toggle** - Switch between mock data and real API with environment variable

## Tech Stack 技術架構

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | UI components |
| SWR | 2.x | Data fetching and caching |
| Lucide React | latest | Icons |

## Quick Start 快速開始

### Prerequisites 先決條件

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation 安裝

```bash
# Clone the repository
git clone https://github.com/kaiyin1028/v0-funding-monitor-system.git
cd v0-funding-monitor-system

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Development Commands 開發命令

```bash
pnpm dev          # Start development server
pnpm dev:turbo    # Start with Turbopack (faster)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm type-check   # TypeScript type checking
pnpm lint         # ESLint
```

## Project Structure 項目結構

```
/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── funding/              # Funding endpoints
│   │   │   ├── programs/route.ts
│   │   │   ├── sources/route.ts
│   │   │   └── stats/route.ts
│   │   ├── user/                 # User endpoints
│   │   │   └── favorites/route.ts
│   │   └── monitoring/           # Monitoring endpoints
│   │       └── check/route.ts
│   ├── login/page.tsx            # Login page
│   ├── database/page.tsx         # Database page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard page
│   └── globals.css               # Global styles
│
├── components/                   # UI components
│   ├── ui/                       # shadcn/ui components
│   └── *.tsx                     # Feature components
│
├── src/                          # Source code (new structure)
│   ├── components/ui/            # State components
│   │   ├── loading-state.tsx     # Loading skeletons
│   │   ├── error-state.tsx       # Error displays
│   │   └── empty-state.tsx       # Empty state displays
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts           # Authentication hooks
│   │   └── use-funding.ts        # Funding data hooks
│   │
│   ├── lib/                      # Utilities
│   │   ├── api-client.ts         # Centralized API client
│   │   └── authToken.ts          # Token storage (localStorage)
│   │
│   ├── mocks/                    # Mock data and services
│   │   ├── data.ts               # Centralized mock data
│   │   ├── auth.mock.ts          # Auth mock
│   │   ├── funding.mock.ts       # Funding mock
│   │   ├── user.mock.ts          # User mock
│   │   └── monitoring.mock.ts    # Monitoring mock
│   │
│   ├── services/                 # API service layer
│   │   ├── auth.service.ts       # Authentication API
│   │   ├── funding.service.ts    # Funding API
│   │   ├── user.service.ts       # User API
│   │   └── monitoring.service.ts # Monitoring API
│   │
│   └── types/                    # TypeScript types
│       └── index.ts              # All type definitions
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Architecture overview
│   ├── PAGES_AND_DATA.md         # Pages documentation
│   ├── API_CONTRACT.md           # API specification
│   └── INTEGRATION_GUIDE.md      # Backend integration
│
├── scripts/                      # Database scripts
│   ├── database-schema.sql       # PostgreSQL schema
│   └── seed-data.sql             # Initial data
│
└── .env.example                  # Environment template
```

## Environment Variables 環境變數

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_USE_MOCKS` | Enable mock mode | `true` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

See `.env.example` for all variables.

## Development Guidelines 開發規範

### Data Fetching

**DO NOT** hardcode data in UI components. Always use services and hooks:

```typescript
// GOOD - Use hooks
const { programs, isLoading, error } = useFundingPrograms()

// BAD - Don't do this
const programs = [{ id: '1', name: 'Test' }]
```

### State Handling

All pages must implement loading, error, and empty states:

```tsx
if (isLoading) return <LoadingState />
if (error) return <ErrorState error={error} onRetry={mutate} />
if (!data?.length) return <EmptyState type="data" />
return <DataDisplay data={data} />
```

### Switching to Real API

1. Set `NEXT_PUBLIC_USE_MOCKS=false` in `.env.local`
2. Set `NEXT_PUBLIC_API_BASE_URL` to your backend
3. Implement backend according to `docs/API_CONTRACT.md`

## Documentation 文檔

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and data flow |
| [PAGES_AND_DATA.md](docs/PAGES_AND_DATA.md) | Pages, data requirements, interactions |
| [API_CONTRACT.md](docs/API_CONTRACT.md) | Complete REST API specification |
| [INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md) | Backend integration steps |

## Monitoring Sources 監測來源 (18個)

### Government Departments 政府部門 (11)
| Source | URL |
|--------|-----|
| Quality Education Fund (QEF) 優質教育基金 | https://www.qef.org.hk |
| Innovation and Technology Fund (ITF) 創新科技基金 | https://www.itf.gov.hk |
| SIE Fund 社會創新及創業發展基金 | https://www.sie.gov.hk |
| CPCE 公民教育委員會 | https://www.cpce.gov.hk |
| ECF 環境及自然保育基金 | https://www.ecf.gov.hk |
| YDF 青年發展基金 | https://www.ydc.gov.hk |
| SCOLAR 語常會 | https://scolarhk.edb.hkedcity.net |
| ADC 藝術發展局 | https://www.hkadc.org.hk |
| CoC 兒童事務委員會 | https://www.coc.gov.hk |
| HAD 民政事務總署 | https://www.had.gov.hk |
| Government News 政府新聞網 | https://www.news.gov.hk |

### Foundations & Organizations 基金及機構 (7)
| Source | URL |
|--------|-----|
| HKJC Charities 香港賽馬會慈善信託基金 | https://charities.hkjc.com |
| Partnership Fund 攜手扶弱基金 | https://www.swd.gov.hk |
| Cyberport 數碼港 | https://www.cyberport.hk |
| HKSTP 香港科技園 | https://www.hkstp.org |
| HKIF 香港創新基金 | https://hkif.org.hk |
| Chinese Temples Committee 華人廟宇委員會 | https://www.ctc.org.hk |
| Beat Drugs Fund 禁毒基金 | https://www.nd.gov.hk |

## For Backend Developers

This frontend is designed for handoff to backend development using Claude Code or similar tools.

### Key Files to Review

1. **API Contract**: `docs/API_CONTRACT.md` - Implement all endpoints as specified
2. **Database Schema**: `scripts/database-schema.sql` - PostgreSQL tables
3. **Type Definitions**: `src/types/index.ts` - All TypeScript interfaces
4. **Mock Services**: `src/mocks/*.ts` - Reference implementations

### Integration Steps

1. Read `docs/INTEGRATION_GUIDE.md`
2. Set up PostgreSQL database using `scripts/database-schema.sql`
3. Implement REST API per `docs/API_CONTRACT.md`
4. Set frontend env: `NEXT_PUBLIC_USE_MOCKS=false`
5. Test each endpoint

## License 授權

This project is developed for Hong Kong Educational Equipment Industry Association (HKEEIA).

---

Built with [v0.dev](https://v0.dev)
