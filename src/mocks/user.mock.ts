/**
 * Mock User Service
 * Provides mock implementation for development without backend
 */

import type { UserService, CreateUserInput, UpdateUserInput, UserProfileUpdateInput } from '@/src/services/user.service'
import type { User, PaginatedResponse, ListParams } from '@/src/types'
import { mockUsers } from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory data store
let users = [...mockUsers]

// Helper function to paginate results
function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = items.slice(startIndex, endIndex)
  
  return {
    data: paginatedItems,
    meta: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
      hasMore: endIndex < items.length,
    },
  }
}

// Get current user from localStorage
function getCurrentUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('current_user')
  return stored ? JSON.parse(stored) : null
}

export const mockUserService: UserService = {
  async getCurrentUser(): Promise<User> {
    await delay(300)
    
    const user = getCurrentUserFromStorage()
    if (!user) {
      throw {
        code: 'AUTH_UNAUTHORIZED',
        message: '未登入',
        status: 401,
      }
    }
    
    return user
  },

  async updateProfile(input: UserProfileUpdateInput): Promise<User> {
    await delay(500)
    
    const currentUser = getCurrentUserFromStorage()
    if (!currentUser) {
      throw {
        code: 'AUTH_UNAUTHORIZED',
        message: '未登入',
        status: 401,
      }
    }
    
    const updatedUser = {
      ...currentUser,
      ...input,
      updatedAt: new Date().toISOString(),
    }
    
    // Update in users array
    const index = users.findIndex(u => u.id === currentUser.id)
    if (index !== -1) {
      users[index] = updatedUser
    }
    
    // Update in localStorage
    localStorage.setItem('current_user', JSON.stringify(updatedUser))
    
    return updatedUser
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    await delay(800)
    
    // In mock, create a fake URL from the file
    const fakeUrl = URL.createObjectURL(file)
    
    return { url: fakeUrl }
  },

  // Admin only
  async getUsers(params?: ListParams): Promise<PaginatedResponse<User>> {
    await delay(400)
    
    let filtered = [...users]
    
    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        u =>
          u.username.toLowerCase().includes(searchLower) ||
          u.displayName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy as keyof User]
        const bVal = b[params.sortBy as keyof User]
        if (aVal === undefined || bVal === undefined) return 0
        if (aVal < bVal) return -1 * sortOrder
        if (aVal > bVal) return 1 * sortOrder
        return 0
      })
    }
    
    return paginate(filtered, params?.page, params?.limit)
  },

  async getUserById(id: string): Promise<User> {
    await delay(300)
    
    const user = users.find(u => u.id === id)
    if (!user) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到用戶',
        status: 404,
      }
    }
    
    return user
  },

  async createUser(input: CreateUserInput): Promise<User> {
    await delay(600)
    
    // Check if username already exists
    if (users.some(u => u.username === input.username)) {
      throw {
        code: 'CONFLICT',
        message: '用戶名已存在',
        status: 409,
      }
    }
    
    // Check if email already exists
    if (users.some(u => u.email === input.email)) {
      throw {
        code: 'CONFLICT',
        message: '電郵已被使用',
        status: 409,
      }
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: input.username,
      email: input.email,
      displayName: input.displayName,
      role: input.role,
      organization: input.organization,
      phone: input.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    users.push(newUser)
    return newUser
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    await delay(500)
    
    const index = users.findIndex(u => u.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到用戶',
        status: 404,
      }
    }
    
    // Check for conflicts if username is being changed
    if (input.username && input.username !== users[index].username) {
      if (users.some(u => u.username === input.username)) {
        throw {
          code: 'CONFLICT',
          message: '用戶名已存在',
          status: 409,
        }
      }
    }
    
    // Check for conflicts if email is being changed
    if (input.email && input.email !== users[index].email) {
      if (users.some(u => u.email === input.email)) {
        throw {
          code: 'CONFLICT',
          message: '電郵已被使用',
          status: 409,
        }
      }
    }
    
    users[index] = {
      ...users[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    
    return users[index]
  },

  async deleteUser(id: string): Promise<void> {
    await delay(400)
    
    const index = users.findIndex(u => u.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到用戶',
        status: 404,
      }
    }
    
    // Prevent deleting the last admin
    const user = users[index]
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length
      if (adminCount <= 1) {
        throw {
          code: 'FORBIDDEN',
          message: '不能刪除最後一位管理員',
          status: 403,
        }
      }
    }
    
    users.splice(index, 1)
  },
}
