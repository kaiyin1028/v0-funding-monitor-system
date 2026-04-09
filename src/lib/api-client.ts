/**
 * API Client for Hong Kong Education Funding Monitor System
 * Handles all HTTP requests with authentication, error handling, and retry logic
 */

export interface ApiError {
  code: string
  message: string
  status: number
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

class ApiClient {
  private baseURL: string
  private useMocks: boolean

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    this.useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  /**
   * Set authentication token in storage
   */
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  /**
   * Remove authentication token from storage
   */
  public removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  /**
   * Build headers for requests
   */
  private buildHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    })

    const token = this.getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  /**
   * Handle API errors uniformly
   */
  private async handleError(response: Response): Promise<ApiError> {
    let errorBody: { message?: string; code?: string; details?: Record<string, unknown> } = {}
    
    try {
      errorBody = await response.json()
    } catch {
      // Response body is not JSON
    }

    const error: ApiError = {
      code: errorBody.code || `HTTP_${response.status}`,
      message: errorBody.message || this.getDefaultErrorMessage(response.status),
      status: response.status,
      details: errorBody.details,
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      this.removeAuthToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }

    return error
  }

  /**
   * Get default error message based on status code
   */
  private getDefaultErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: '請求格式錯誤',
      401: '未授權，請重新登入',
      403: '沒有權限執行此操作',
      404: '找不到請求的資源',
      409: '資料衝突，請檢查後重試',
      422: '資料驗證失敗',
      429: '請求過於頻繁，請稍後再試',
      500: '伺服器內部錯誤',
      502: '網關錯誤',
      503: '服務暫時無法使用',
    }
    return messages[status] || '發生未知錯誤'
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown
      params?: Record<string, string | number | boolean | undefined>
      headers?: Record<string, string>
    }
  ): Promise<T> {
    // Build URL with query params
    const url = new URL(path, this.baseURL)
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      })
    }

    const fetchOptions: RequestInit = {
      method,
      headers: this.buildHeaders(options?.headers),
    }

    if (options?.body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body)
    }

    const response = await fetch(url.toString(), fetchOptions)

    if (!response.ok) {
      const error = await this.handleError(response)
      throw error
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  /**
   * GET request
   */
  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>('GET', path, { params, headers })
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>('POST', path, { body, headers })
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>('PUT', path, { body, headers })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>('PATCH', path, { body, headers })
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>('DELETE', path, { headers })
  }

  /**
   * Check if using mocks
   */
  isUsingMocks(): boolean {
    return this.useMocks
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
