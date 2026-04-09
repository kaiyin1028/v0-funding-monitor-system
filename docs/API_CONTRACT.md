# API Contract Documentation

This document defines the REST API contract between the frontend and backend. The backend should implement these endpoints exactly as specified.

## Base URL

```
Production: https://api.hkeeia.org.hk/api
Development: http://localhost:3001/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Common Response Formats

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": { ... }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request data |
| 401 | `AUTH_UNAUTHORIZED` | Not authenticated |
| 401 | `AUTH_INVALID_CREDENTIALS` | Wrong username/password |
| 401 | `AUTH_TOKEN_EXPIRED` | Token has expired |
| 403 | `FORBIDDEN` | No permission |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic error |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Authentication Endpoints

### POST /auth/login

Authenticate user and receive tokens.

**Auth Required:** No

**Request Body:**
```typescript
{
  username: string  // Required, min 3 chars
  password: string  // Required, min 6 chars
}
```

**Response (200):**
```typescript
{
  user: {
    id: string
    username: string
    email: string
    displayName: string
    role: 'admin' | 'staff' | 'viewer'
    avatar?: string
    organization?: string
    phone?: string
    createdAt: string
    updatedAt: string
    lastLoginAt: string
  }
  token: {
    accessToken: string
    refreshToken: string
    expiresIn: number     // seconds
    tokenType: 'Bearer'
  }
}
```

**Errors:**
- 401 `AUTH_INVALID_CREDENTIALS` - Wrong username or password
- 422 `VALIDATION_ERROR` - Invalid input

---

### POST /auth/logout

Logout and invalidate tokens.

**Auth Required:** Yes

**Request Body:** None

**Response (204):** No content

---

### GET /auth/me

Get current authenticated user.

**Auth Required:** Yes

**Response (200):**
```typescript
{
  id: string
  username: string
  email: string
  displayName: string
  role: 'admin' | 'staff' | 'viewer'
  avatar?: string
  organization?: string
  phone?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}
```

**Errors:**
- 401 `AUTH_UNAUTHORIZED` - Not logged in

---

### POST /auth/refresh

Refresh access token using refresh token.

**Auth Required:** No (uses refresh token)

**Request Body:**
```typescript
{
  refreshToken: string
}
```

**Response (200):**
```typescript
{
  token: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: 'Bearer'
  }
}
```

---

### POST /auth/change-password

Change current user's password.

**Auth Required:** Yes

**Request Body:**
```typescript
{
  currentPassword: string
  newPassword: string  // min 6 chars
}
```

**Response (204):** No content

**Errors:**
- 400 `AUTH_INVALID_PASSWORD` - Current password incorrect
- 422 `VALIDATION_ERROR` - New password too weak

---

### POST /auth/request-reset

Request password reset email.

**Auth Required:** No

**Request Body:**
```typescript
{
  email: string
}
```

**Response (204):** No content (always returns 204 for security)

---

### POST /auth/reset-password

Reset password using token from email.

**Auth Required:** No

**Request Body:**
```typescript
{
  token: string
  newPassword: string
}
```

**Response (204):** No content

**Errors:**
- 400 `AUTH_INVALID_TOKEN` - Token invalid or expired

---

## User Endpoints

### GET /users/me

Get current user profile. Same as GET /auth/me.

---

### PATCH /users/me

Update current user profile.

**Auth Required:** Yes

**Request Body:**
```typescript
{
  displayName?: string
  email?: string
  phone?: string
  organization?: string
}
```

**Response (200):** Updated user object

---

### POST /users/me/avatar

Upload user avatar image.

**Auth Required:** Yes

**Request:** `multipart/form-data` with `avatar` file

**Response (200):**
```typescript
{
  url: string  // URL to uploaded avatar
}
```

---

### GET /users

List all users (admin only).

**Auth Required:** Yes (admin role)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |
| search | string | Search by username, email, displayName |
| sortBy | string | Sort field |
| sortOrder | 'asc' \| 'desc' | Sort direction |

**Response (200):**
```typescript
{
  data: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}
```

---

### POST /users

Create new user (admin only).

**Auth Required:** Yes (admin role)

**Request Body:**
```typescript
{
  username: string
  email: string
  password: string
  displayName: string
  role: 'admin' | 'staff' | 'viewer'
  organization?: string
  phone?: string
}
```

**Response (201):** Created user object

**Errors:**
- 409 `CONFLICT` - Username or email already exists

---

### PATCH /users/:id

Update user (admin only).

**Auth Required:** Yes (admin role)

**Request Body:**
```typescript
{
  displayName?: string
  email?: string
  role?: 'admin' | 'staff' | 'viewer'
  organization?: string
  phone?: string
  isActive?: boolean
}
```

**Response (200):** Updated user object

---

### DELETE /users/:id

Delete user (admin only).

**Auth Required:** Yes (admin role)

**Response (204):** No content

**Errors:**
- 403 `FORBIDDEN` - Cannot delete last admin

---

## Funding Programs Endpoints

### GET /funding/programs

List funding programs with filters.

**Auth Required:** No (public data)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter: 'open', 'upcoming', 'closed' |
| category | string | Filter by category |
| relevance | string | Filter: 'high', 'medium', 'low' |
| sourceId | string | Filter by source ID |
| isFavorite | boolean | Filter favorites only |
| search | string | Full-text search |
| sortBy | string | Sort field |
| sortOrder | 'asc' \| 'desc' | Sort direction |

**Response (200):**
```typescript
{
  data: FundingProgram[]
  meta: PaginationMeta
}
```

---

### GET /funding/programs/:id

Get single program details.

**Auth Required:** No

**Response (200):**
```typescript
{
  id: string
  name: string
  organization: string
  sourceId: string
  source: FundingSource  // Included
  category: string
  maxAmount: string
  deadline: string
  status: string
  relevance: string
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority: number
  notes?: string
  isFavorite?: boolean
  createdAt: string
  updatedAt: string
}
```

---

### POST /funding/programs

Create new program (admin only).

**Auth Required:** Yes (admin role)

**Request Body:**
```typescript
{
  name: string
  organization: string
  sourceId: string
  category: string
  maxAmount: string
  deadline: string
  status: string
  relevance: string
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority?: number
  notes?: string
}
```

**Response (201):** Created program

---

### PATCH /funding/programs/:id

Update program (admin only).

**Auth Required:** Yes (admin role)

**Request Body:** Partial program fields

**Response (200):** Updated program

---

### DELETE /funding/programs/:id

Delete program (admin only).

**Auth Required:** Yes (admin role)

**Response (204):** No content

---

### PATCH /funding/programs/:id/favorite

Toggle favorite status.

**Auth Required:** Yes

**Request Body:**
```typescript
{
  isFavorite: boolean
}
```

**Response (200):** Updated program

---

## Funding Sources Endpoints

### GET /funding/sources

List funding sources.

**Auth Required:** No

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |
| category | string | Filter by category |
| search | string | Search by name |

**Response (200):** Paginated list of sources

---

### GET /funding/sources/:id

Get single source.

**Response (200):** FundingSource object

---

### POST /funding/sources

Create source (admin only).

---

### PATCH /funding/sources/:id

Update source (admin only).

---

### DELETE /funding/sources/:id

Delete source (admin only).

---

### POST /funding/sources/:id/check

Trigger status check for single source.

**Auth Required:** Yes (staff or admin)

**Response (200):** Updated source with new status

---

### POST /funding/sources/check-all

Trigger status check for all sources.

**Auth Required:** Yes (staff or admin)

**Response (200):**
```typescript
{
  sources: FundingSource[]  // All sources with updated status
}
```

---

## Dashboard Endpoints

### GET /funding/dashboard/stats

Get dashboard statistics.

**Auth Required:** No

**Response (200):**
```typescript
{
  openPrograms: number
  upcomingPrograms: number
  highRelevancePrograms: number
  onlineSources: number
  totalSources: number
  recentChanges: number
  pendingApplications: number
}
```

---

### GET /funding/dashboard/deadlines

Get upcoming deadlines.

**Auth Required:** No

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| days | number | Days to look ahead (default: 30) |

**Response (200):**
```typescript
{
  data: DeadlineItem[]
}
```

---

## Monitoring Endpoints

### GET /monitoring/logs

Get monitoring logs.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | Filter by log type |
| sourceId | string | Filter by source |
| fromDate | string | Start date (ISO) |
| toDate | string | End date (ISO) |

**Response (200):** Paginated list of logs

---

### GET /monitoring/stats

Get monitoring statistics.

**Response (200):**
```typescript
{
  totalSources: number
  onlineSources: number
  offlineSources: number
  lastCheckTime: string
  newProgramsToday: number
  alertsToday: number
}
```

---

### POST /monitoring/trigger

Manually trigger monitoring check.

**Auth Required:** Yes (admin)

**Request Body:**
```typescript
{
  sourceId?: string  // Optional, check specific source
}
```

**Response (200):**
```typescript
{
  message: string
  logsCreated: number
}
```

---

### DELETE /monitoring/logs/cleanup

Delete old logs.

**Auth Required:** Yes (admin)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| daysToKeep | number | Keep logs newer than X days (default: 90) |

**Response (200):**
```typescript
{
  deletedCount: number
}
```

---

## Export Endpoints

### GET /funding/export/csv

Export programs as CSV.

**Auth Required:** No

**Query Parameters:** Same as GET /funding/programs (filters apply)

**Response:** CSV file download

---

### GET /funding/export/report

Export full report as JSON.

**Auth Required:** Yes

**Response:** JSON file download
