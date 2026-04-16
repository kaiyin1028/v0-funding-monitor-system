/**
 * Authentication Service
 * Handles user authentication, login, logout, and session management
 */

import { apiClient } from '@/src/lib/api-client'
import { mockAuthService } from '@/src/mocks/auth.mock'
import type { User, LoginCredentials, AuthResponse, AuthToken } from '@/src/types'

// Default to mock mode unless explicitly set to 'false'
const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<User>
  refreshToken(): Promise<AuthToken>
  changePassword(currentPassword: string, newPassword: string): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
}

/**
 * Real API implementation
 */
const realAuthService: AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    apiClient.setAuthToken(response.token.accessToken)
    return response
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      apiClient.removeAuthToken()
    }
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me')
  },

  async refreshToken(): Promise<AuthToken> {
    const response = await apiClient.post<{ token: AuthToken }>('/auth/refresh')
    apiClient.setAuthToken(response.token.accessToken)
    return response.token
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/request-reset', { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    })
  },
}

/**
 * Export the appropriate service based on environment
 */
export const authService: AuthService = useMocks ? mockAuthService : realAuthService
