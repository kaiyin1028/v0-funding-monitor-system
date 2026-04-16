/**
 * Auth Token Management
 * Handles storage and retrieval of authentication tokens
 * 
 * Current implementation: localStorage (for simplified integration)
 * Future consideration: HttpOnly cookies for enhanced security
 * 
 * See docs/ARCHITECTURE.md for security notes and migration path
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRY_KEY = 'token_expiry'

/**
 * Check if running in browser environment
 */
const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * Get the current authentication token
 */
export function getToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Set the authentication token
 */
export function setToken(token: string, expiresIn?: number): void {
  if (!isBrowser()) return
  localStorage.setItem(TOKEN_KEY, token)
  
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiryTime))
  }
}

/**
 * Clear the authentication token
 */
export function clearToken(): void {
  if (!isBrowser()) return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

/**
 * Get the refresh token
 */
export function getRefreshToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Set the refresh token
 */
export function setRefreshToken(token: string): void {
  if (!isBrowser()) return
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * Check if the token is expired
 */
export function isTokenExpired(): boolean {
  if (!isBrowser()) return true
  
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiryTime) return false // No expiry set, assume valid
  
  return Date.now() > parseInt(expiryTime, 10)
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired()
}

/**
 * Parse JWT token payload (without verification)
 * Note: This does NOT verify the token signature
 */
export function parseToken(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Get user ID from token
 */
export function getUserIdFromToken(): string | null {
  const token = getToken()
  if (!token) return null
  
  const payload = parseToken(token)
  return payload?.sub as string | null
}

/**
 * Get user role from token
 */
export function getUserRoleFromToken(): string | null {
  const token = getToken()
  if (!token) return null
  
  const payload = parseToken(token)
  return payload?.role as string | null
}

// Export all functions as default object for convenience
const authToken = {
  getToken,
  setToken,
  clearToken,
  getRefreshToken,
  setRefreshToken,
  isTokenExpired,
  isAuthenticated,
  parseToken,
  getUserIdFromToken,
  getUserRoleFromToken,
}

export default authToken
