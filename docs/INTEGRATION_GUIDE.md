# Backend Integration Guide

This guide explains how to integrate the backend with the frontend application.

## Overview

The frontend is designed to work in two modes:

1. **Mock Mode** (`NEXT_PUBLIC_USE_MOCKS=true`): Uses in-memory mock data
2. **API Mode** (`NEXT_PUBLIC_USE_MOCKS=false`): Calls real backend API

## Step 1: Set Up Backend Server

### Required Endpoints

The backend must implement all endpoints defined in `API_CONTRACT.md`. Start with these essential endpoints:

1. **Authentication**
   - `POST /auth/login`
   - `POST /auth/logout`
   - `GET /auth/me`

2. **Funding Programs**
   - `GET /funding/programs`
   - `GET /funding/programs/:id`

3. **Funding Sources**
   - `GET /funding/sources`

4. **Dashboard**
   - `GET /funding/dashboard/stats`
   - `GET /funding/dashboard/deadlines`

### Database Schema

Use the SQL scripts in `/scripts/`:

```bash
# Create tables
psql -d your_database -f scripts/database-schema.sql

# Seed initial data
psql -d your_database -f scripts/seed-data.sql
```

## Step 2: Configure Environment

### Frontend Configuration

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Update the variables:

```env
# Point to your backend server
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Disable mock mode
NEXT_PUBLIC_USE_MOCKS=false
```

### Backend Configuration

Your backend should set:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/funding_monitor

# JWT
JWT_SECRET=your-secure-random-string
JWT_EXPIRES_IN=1h

# CORS (allow frontend origin)
CORS_ORIGIN=http://localhost:3000
```

## Step 3: Handle CORS

The backend must allow requests from the frontend origin. Example Express.js setup:

```javascript
const cors = require('cors')

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

## Step 4: Implement Authentication

### JWT Token Flow

1. **Login**: Backend validates credentials, returns JWT token
2. **Storage**: Frontend stores token in localStorage
3. **Requests**: Frontend attaches token to all API requests
4. **Expiry**: Frontend handles 401 by logging out user

### Token Format

```typescript
// JWT Payload
{
  sub: string      // user ID
  username: string
  role: string
  iat: number      // issued at
  exp: number      // expires at
}
```

### Password Hashing

Use bcrypt for password hashing:

```javascript
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

// Hash password before storing
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

// Verify password on login
const isValid = await bcrypt.compare(password, hashedPassword)
```

## Step 5: API Response Format

### Success Response

```javascript
// Single item
res.json({
  data: item
})

// List with pagination
res.json({
  data: items,
  meta: {
    total: totalCount,
    page: currentPage,
    limit: pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    hasMore: currentPage < totalPages
  }
})
```

### Error Response

```javascript
// Custom error class
class ApiError extends Error {
  constructor(code, message, status = 400, details = null) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
  }
}

// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500
  const code = err.code || 'INTERNAL_ERROR'
  const message = err.message || 'An error occurred'
  
  res.status(status).json({
    code,
    message,
    details: err.details
  })
})
```

## Step 6: Handle 401 Unauthorized

When a request returns 401:

1. Frontend's API client dispatches `auth:unauthorized` event
2. Auth hook listens and clears user state
3. User is redirected to login page

The API client handles this automatically in `src/lib/api-client.ts`:

```typescript
if (response.status === 401) {
  this.removeAuthToken()
  window.dispatchEvent(new CustomEvent('auth:unauthorized'))
}
```

## Step 7: Testing Integration

### 1. Start Backend

```bash
cd backend
npm run dev  # Start on port 3001
```

### 2. Start Frontend

```bash
cd frontend
npm run dev  # Start on port 3000
```

### 3. Verify Connection

1. Open browser console
2. Check for CORS errors
3. Try logging in
4. Verify data loads correctly

### Common Issues

#### CORS Errors

```
Access to fetch at 'http://localhost:3001/api/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Ensure backend has proper CORS configuration.

#### 401 on All Requests

Check that:
1. Token is being stored correctly
2. Token is being sent in Authorization header
3. Backend is validating token correctly

#### Network Errors

```
TypeError: Failed to fetch
```

Check that:
1. Backend is running
2. `NEXT_PUBLIC_API_BASE_URL` is correct
3. No proxy issues

## Step 8: Token Storage Strategy

Current implementation uses localStorage. For enhanced security, consider:

### Option A: HttpOnly Cookies (Recommended)

```javascript
// Backend sets cookie on login
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
})

// Frontend requests include credentials
fetch(url, { credentials: 'include' })
```

### Option B: Memory + Refresh Token

Store access token in memory (React state), refresh token in httpOnly cookie:

```javascript
// Short-lived access token in memory
const [accessToken, setAccessToken] = useState(null)

// Refresh token in httpOnly cookie
// Automatically refresh when access token expires
```

## Step 9: Switching from Mocks to API

### Gradual Migration

You can switch individual services:

```typescript
// In each service file, you can override
const useMocksForThisService = false

export const fundingService = useMocksForThisService 
  ? mockFundingService 
  : realFundingService
```

### Feature Flags

For staged rollout:

```typescript
const featureFlags = {
  useRealAuth: true,
  useRealFunding: false,
  useRealMonitoring: false,
}
```

## Step 10: Production Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your production API URL
   - `NEXT_PUBLIC_USE_MOCKS`: `false`

### Backend

Deploy to your preferred platform (Railway, Render, AWS, etc.):

1. Set up PostgreSQL database
2. Run migrations
3. Configure environment variables
4. Set up HTTPS

### Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] JWT secret is secure
- [ ] Passwords are hashed
- [ ] Rate limiting enabled
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention (sanitize inputs)
- [ ] Environment variables not exposed

## API Implementation Reference

See the mock services in `src/mocks/` for reference implementations:

- `auth.mock.ts` - Authentication logic
- `funding.mock.ts` - CRUD operations with filtering
- `user.mock.ts` - User management
- `monitoring.mock.ts` - Logging operations

These show the expected behavior for each endpoint.
