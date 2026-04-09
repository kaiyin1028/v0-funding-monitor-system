# Pages and Data Documentation

This document describes all pages in the application, their purpose, data requirements, and user interactions.

## Page Overview

| Route | Page Name | User Roles | Description |
|-------|-----------|------------|-------------|
| `/` | Dashboard | All | Main monitoring dashboard |
| `/database` | Database | All | Advanced funding program database |
| `/login` | Login | Public | User authentication (planned) |
| `/profile` | Profile | Authenticated | User profile management (planned) |
| `/admin` | Admin | Admin | System administration (planned) |

---

## 1. Dashboard Page (`/`)

### Purpose
Main monitoring dashboard showing funding opportunities overview, statistics, and quick access to key information.

### User Roles
- **All users**: Can view all information
- **Staff/Admin**: Can trigger manual refresh

### Data Requirements

#### Dashboard Statistics
```typescript
interface DashboardStats {
  openPrograms: number        // Count of programs accepting applications
  upcomingPrograms: number    // Count of programs opening soon
  highRelevancePrograms: number // Count of highly relevant programs
  onlineSources: number       // Count of online monitoring sources
  totalSources: number        // Total monitoring sources
  recentChanges: number       // Changes in last 7 days
  pendingApplications: number // Applications in progress
}
```

#### Funding Programs (Summary)
```typescript
interface FundingProgram {
  id: string
  name: string
  organization: string
  category: 'education' | 'innovation' | 'youth' | 'environment' | 'social' | 'culture'
  maxAmount: string
  deadline: string
  status: 'open' | 'upcoming' | 'closed'
  relevance: 'high' | 'medium' | 'low'
  description: string
  url: string
}
```

#### Funding Sources
```typescript
interface FundingSource {
  id: string
  name: string
  nameEn: string
  organization: string
  url: string
  status: 'online' | 'offline' | 'checking'
  lastChecked: string
  category: 'government' | 'fund' | 'corporate' | 'other'
}
```

#### Upcoming Deadlines
```typescript
interface DeadlineItem {
  programId: string
  programName: string
  deadline: string
  daysRemaining: number
  status: FundingProgramStatus
  relevance: FundingProgramRelevance
}
```

### Interactions

| Action | Description | API Call |
|--------|-------------|----------|
| View stats | Display statistics cards | `GET /funding/dashboard/stats` |
| View programs | Display programs table | `GET /funding/programs` |
| View sources | Display source status | `GET /funding/sources` |
| Refresh data | Manual data refresh | `POST /funding/sources/check-all` |
| Export CSV | Download programs as CSV | `GET /funding/export/csv` |
| Export calendar | Download deadlines as ICS | Generated client-side |
| Filter programs | Filter by status/category | Query params |

### States

- **Loading**: Skeleton UI while fetching data
- **Error**: Error message with retry button
- **Empty**: "No data" message (rare for dashboard)
- **Success**: Full dashboard with data

---

## 2. Database Page (`/database`)

### Purpose
Advanced database view with full filtering, sorting, and management capabilities for funding programs.

### User Roles
- **Viewer**: Read-only access
- **Staff**: Can favorite programs, add notes
- **Admin**: Full CRUD operations

### Data Requirements

#### Funding Programs (Full)
```typescript
interface FundingProgram {
  id: string
  name: string
  organization: string
  sourceId: string
  source?: FundingSource
  category: FundingProgramCategory
  maxAmount: string
  deadline: string
  status: FundingProgramStatus
  relevance: FundingProgramRelevance
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority: number
  notes?: string
  isFavorite?: boolean
  createdAt?: string
  updatedAt?: string
}
```

### Interactions

| Action | Description | API Call |
|--------|-------------|----------|
| List programs | Display all programs | `GET /funding/programs` |
| Search | Full-text search | `GET /funding/programs?search=` |
| Filter by status | Filter open/upcoming/closed | `GET /funding/programs?status=` |
| Filter by category | Filter by category | `GET /funding/programs?category=` |
| Filter by relevance | Filter by relevance | `GET /funding/programs?relevance=` |
| Filter by source | Filter by funding source | `GET /funding/programs?sourceId=` |
| Sort | Sort by column | `GET /funding/programs?sortBy=&sortOrder=` |
| Paginate | Navigate pages | `GET /funding/programs?page=&limit=` |
| Toggle favorite | Mark as favorite | `PATCH /funding/programs/:id/favorite` |
| Export filtered | Export current filter | `GET /funding/export/csv` |

### States

- **Loading**: Table skeleton
- **Error**: Error with retry
- **Empty (no data)**: "No programs found" message
- **Empty (filtered)**: "No matching results" with clear filter button

---

## 3. Login Page (`/login`) - Planned

### Purpose
User authentication page.

### User Roles
- **Public**: Can access login form

### Data Requirements

#### Login Request
```typescript
interface LoginCredentials {
  username: string
  password: string
}
```

#### Login Response
```typescript
interface AuthResponse {
  user: User
  token: {
    accessToken: string
    refreshToken?: string
    expiresIn: number
    tokenType: 'Bearer'
  }
}
```

### Interactions

| Action | Description | API Call |
|--------|-------------|----------|
| Login | Submit credentials | `POST /auth/login` |
| Forgot password | Request reset link | `POST /auth/request-reset` |

### States

- **Initial**: Empty form
- **Loading**: Submit button disabled, spinner
- **Error**: Error message displayed
- **Success**: Redirect to dashboard

---

## 4. Profile Page (`/profile`) - Planned

### Purpose
User profile management.

### User Roles
- **Authenticated**: Can view and edit own profile

### Data Requirements

#### User Profile
```typescript
interface User {
  id: string
  username: string
  email: string
  displayName: string
  role: 'admin' | 'staff' | 'viewer'
  avatar?: string
  organization?: string
  phone?: string
  lastLoginAt?: string
}
```

### Interactions

| Action | Description | API Call |
|--------|-------------|----------|
| View profile | Get current user | `GET /users/me` |
| Update profile | Update user info | `PATCH /users/me` |
| Upload avatar | Upload profile image | `POST /users/me/avatar` |
| Change password | Update password | `POST /auth/change-password` |

---

## 5. Admin Page (`/admin`) - Planned

### Purpose
System administration for managing users, sources, and programs.

### User Roles
- **Admin only**: Full access

### Data Requirements

#### User Management
```typescript
interface User {
  // Full user object with all fields
}

interface CreateUserInput {
  username: string
  email: string
  password: string
  displayName: string
  role: UserRole
}
```

### Sub-sections

1. **User Management**
   - List all users
   - Create/edit/delete users
   - Reset user passwords

2. **Source Management**
   - Add new funding sources
   - Edit source details
   - Trigger manual checks

3. **Program Management**
   - Add new programs
   - Edit program details
   - Set relevance levels

4. **Monitoring Logs**
   - View check history
   - View alerts
   - Clear old logs

### Interactions

| Action | Description | API Call |
|--------|-------------|----------|
| List users | Get all users | `GET /users` |
| Create user | Add new user | `POST /users` |
| Update user | Edit user | `PATCH /users/:id` |
| Delete user | Remove user | `DELETE /users/:id` |
| List logs | Get monitoring logs | `GET /monitoring/logs` |
| Clear logs | Remove old logs | `DELETE /monitoring/logs/cleanup` |

---

## Common UI States

All pages implement these states:

### Loading State
```tsx
<LoadingState variant="table" rows={5} />
```

### Error State
```tsx
<ErrorState 
  error={error}
  onRetry={() => mutate()}
/>
```

### Empty State
```tsx
<EmptyState 
  type="search"
  title="找不到結果"
  action={{ label: '清除篩選', onClick: clearFilters }}
/>
```
