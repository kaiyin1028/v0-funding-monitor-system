/**
 * User Service
 * Handles user profile and account management
 */

import { apiClient } from '@/src/lib/api-client'
import { mockUserService } from '@/src/mocks/user.mock'
import type { User, PaginatedResponse, ListParams } from '@/src/types'

// Default to mock mode unless explicitly set to 'false'
const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'

export interface UserProfileUpdateInput {
  displayName?: string
  email?: string
  phone?: string
  organization?: string
  avatar?: string
}

export interface UserService {
  getCurrentUser(): Promise<User>
  updateProfile(input: UserProfileUpdateInput): Promise<User>
  uploadAvatar(file: File): Promise<{ url: string }>
  
  // Admin only
  getUsers(params?: ListParams): Promise<PaginatedResponse<User>>
  getUserById(id: string): Promise<User>
  createUser(input: CreateUserInput): Promise<User>
  updateUser(id: string, input: UpdateUserInput): Promise<User>
  deleteUser(id: string): Promise<void>
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
  displayName: string
  role: 'admin' | 'staff' | 'viewer'
  organization?: string
  phone?: string
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  isActive?: boolean
}

/**
 * Real API implementation
 */
const realUserService: UserService = {
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me')
  },

  async updateProfile(input: UserProfileUpdateInput): Promise<User> {
    return apiClient.patch<User>('/users/me', input)
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }
    
    return response.json()
  },

  // Admin only
  async getUsers(params?: ListParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/users', params as Record<string, string | number | boolean | undefined>)
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`)
  },

  async createUser(input: CreateUserInput): Promise<User> {
    return apiClient.post<User>('/users', input)
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, input)
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },
}

/**
 * Export the appropriate service based on environment
 */
export const userService: UserService = useMocks ? mockUserService : realUserService
