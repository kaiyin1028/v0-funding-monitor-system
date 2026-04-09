/**
 * Mock Authentication Service
 * Provides mock implementation for development without backend
 */

import type { AuthService } from '@/src/services/auth.service'
import type { User, LoginCredentials, AuthResponse, AuthToken } from '@/src/types'
import { mockUsers } from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Store current user session
let currentUser: User | null = null
let authToken: string | null = null

export const mockAuthService: AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800) // Simulate network delay
    
    // Find user by username
    const user = mockUsers.find(u => u.username === credentials.username)
    
    if (!user) {
      throw {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: '用戶名或密碼錯誤',
        status: 401,
      }
    }
    
    // For mock, accept any password that is at least 6 characters
    if (credentials.password.length < 6) {
      throw {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: '用戶名或密碼錯誤',
        status: 401,
      }
    }
    
    // Generate mock token
    const token: AuthToken = {
      accessToken: `mock_token_${Date.now()}_${user.id}`,
      refreshToken: `mock_refresh_${Date.now()}_${user.id}`,
      expiresIn: 3600,
      tokenType: 'Bearer',
    }
    
    // Update user last login
    const updatedUser = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    }
    
    currentUser = updatedUser
    authToken = token.accessToken
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token.accessToken)
      localStorage.setItem('current_user', JSON.stringify(updatedUser))
    }
    
    return {
      user: updatedUser,
      token,
    }
  },

  async logout(): Promise<void> {
    await delay(300)
    
    currentUser = null
    authToken = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
    }
  },

  async getCurrentUser(): Promise<User> {
    await delay(300)
    
    // Try to restore from localStorage
    if (!currentUser && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('current_user')
      const storedToken = localStorage.getItem('auth_token')
      
      if (storedUser && storedToken) {
        currentUser = JSON.parse(storedUser)
        authToken = storedToken
      }
    }
    
    if (!currentUser) {
      throw {
        code: 'AUTH_UNAUTHORIZED',
        message: '未登入或登入已過期',
        status: 401,
      }
    }
    
    return currentUser
  },

  async refreshToken(): Promise<AuthToken> {
    await delay(500)
    
    if (!currentUser) {
      throw {
        code: 'AUTH_UNAUTHORIZED',
        message: '未登入或登入已過期',
        status: 401,
      }
    }
    
    const newToken: AuthToken = {
      accessToken: `mock_token_${Date.now()}_${currentUser.id}`,
      refreshToken: `mock_refresh_${Date.now()}_${currentUser.id}`,
      expiresIn: 3600,
      tokenType: 'Bearer',
    }
    
    authToken = newToken.accessToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken.accessToken)
    }
    
    return newToken
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await delay(600)
    
    if (!currentUser) {
      throw {
        code: 'AUTH_UNAUTHORIZED',
        message: '未登入',
        status: 401,
      }
    }
    
    if (currentPassword.length < 6) {
      throw {
        code: 'AUTH_INVALID_PASSWORD',
        message: '當前密碼錯誤',
        status: 400,
      }
    }
    
    if (newPassword.length < 6) {
      throw {
        code: 'VALIDATION_ERROR',
        message: '新密碼必須至少6個字元',
        status: 422,
      }
    }
    
    // In mock, just succeed
    console.log('[Mock] Password changed successfully')
  },

  async requestPasswordReset(email: string): Promise<void> {
    await delay(600)
    
    // Validate email format
    if (!email.includes('@')) {
      throw {
        code: 'VALIDATION_ERROR',
        message: '請輸入有效的電郵地址',
        status: 422,
      }
    }
    
    // In mock, always succeed
    console.log(`[Mock] Password reset email sent to: ${email}`)
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await delay(600)
    
    if (!token || token.length < 10) {
      throw {
        code: 'AUTH_INVALID_TOKEN',
        message: '重置連結無效或已過期',
        status: 400,
      }
    }
    
    if (newPassword.length < 6) {
      throw {
        code: 'VALIDATION_ERROR',
        message: '密碼必須至少6個字元',
        status: 422,
      }
    }
    
    // In mock, just succeed
    console.log('[Mock] Password reset successfully')
  },
}
