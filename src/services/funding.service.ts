/**
 * Funding Service
 * Handles funding programs and sources data operations
 */

import { apiClient } from '@/src/lib/api-client'
import { mockFundingService } from '@/src/mocks/funding.mock'
import type {
  FundingProgram,
  FundingProgramCreateInput,
  FundingProgramUpdateInput,
  FundingProgramListParams,
  FundingSource,
  FundingSourceCreateInput,
  FundingSourceUpdateInput,
  FundingSourceListParams,
  PaginatedResponse,
  DashboardStats,
  DeadlineItem,
} from '@/src/types'

// Default to mock mode unless explicitly set to 'false'
const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'

export interface FundingService {
  // Funding Programs
  getPrograms(params?: FundingProgramListParams): Promise<PaginatedResponse<FundingProgram>>
  getProgramById(id: string): Promise<FundingProgram>
  createProgram(input: FundingProgramCreateInput): Promise<FundingProgram>
  updateProgram(id: string, input: FundingProgramUpdateInput): Promise<FundingProgram>
  deleteProgram(id: string): Promise<void>
  toggleFavorite(id: string, isFavorite: boolean): Promise<FundingProgram>
  
  // Funding Sources
  getSources(params?: FundingSourceListParams): Promise<PaginatedResponse<FundingSource>>
  getSourceById(id: string): Promise<FundingSource>
  createSource(input: FundingSourceCreateInput): Promise<FundingSource>
  updateSource(id: string, input: FundingSourceUpdateInput): Promise<FundingSource>
  deleteSource(id: string): Promise<void>
  checkSourceStatus(id: string): Promise<FundingSource>
  checkAllSources(): Promise<FundingSource[]>
  
  // Dashboard
  getDashboardStats(): Promise<DashboardStats>
  getUpcomingDeadlines(days?: number): Promise<DeadlineItem[]>
  
  // Export
  exportProgramsToCSV(): Promise<Blob>
  exportFullReport(): Promise<Blob>
}

/**
 * Real API implementation
 */
const realFundingService: FundingService = {
  // Funding Programs
  async getPrograms(params?: FundingProgramListParams): Promise<PaginatedResponse<FundingProgram>> {
    return apiClient.get<PaginatedResponse<FundingProgram>>('/funding/programs', params as Record<string, string | number | boolean | undefined>)
  },

  async getProgramById(id: string): Promise<FundingProgram> {
    return apiClient.get<FundingProgram>(`/funding/programs/${id}`)
  },

  async createProgram(input: FundingProgramCreateInput): Promise<FundingProgram> {
    return apiClient.post<FundingProgram>('/funding/programs', input)
  },

  async updateProgram(id: string, input: FundingProgramUpdateInput): Promise<FundingProgram> {
    return apiClient.patch<FundingProgram>(`/funding/programs/${id}`, input)
  },

  async deleteProgram(id: string): Promise<void> {
    await apiClient.delete(`/funding/programs/${id}`)
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<FundingProgram> {
    return apiClient.patch<FundingProgram>(`/funding/programs/${id}/favorite`, { isFavorite })
  },

  // Funding Sources
  async getSources(params?: FundingSourceListParams): Promise<PaginatedResponse<FundingSource>> {
    return apiClient.get<PaginatedResponse<FundingSource>>('/funding/sources', params as Record<string, string | number | boolean | undefined>)
  },

  async getSourceById(id: string): Promise<FundingSource> {
    return apiClient.get<FundingSource>(`/funding/sources/${id}`)
  },

  async createSource(input: FundingSourceCreateInput): Promise<FundingSource> {
    return apiClient.post<FundingSource>('/funding/sources', input)
  },

  async updateSource(id: string, input: FundingSourceUpdateInput): Promise<FundingSource> {
    return apiClient.patch<FundingSource>(`/funding/sources/${id}`, input)
  },

  async deleteSource(id: string): Promise<void> {
    await apiClient.delete(`/funding/sources/${id}`)
  },

  async checkSourceStatus(id: string): Promise<FundingSource> {
    return apiClient.post<FundingSource>(`/funding/sources/${id}/check`)
  },

  async checkAllSources(): Promise<FundingSource[]> {
    return apiClient.post<FundingSource[]>('/funding/sources/check-all')
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/funding/dashboard/stats')
  },

  async getUpcomingDeadlines(days: number = 30): Promise<DeadlineItem[]> {
    return apiClient.get<DeadlineItem[]>('/funding/dashboard/deadlines', { days })
  },

  // Export
  async exportProgramsToCSV(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/funding/export/csv`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
    return response.blob()
  },

  async exportFullReport(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/funding/export/report`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
    return response.blob()
  },
}

/**
 * Export the appropriate service based on environment
 */
export const fundingService: FundingService = useMocks ? mockFundingService : realFundingService
