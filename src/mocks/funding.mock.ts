/**
 * Mock Funding Service
 * Provides mock implementation for development without backend
 */

import type { FundingService } from '@/src/services/funding.service'
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
import {
  mockFundingPrograms,
  mockFundingSources,
  mockDashboardStats,
  mockDeadlineItems,
} from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory data store (allows modifications during session)
let programs = [...mockFundingPrograms]
let sources = [...mockFundingSources]

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

export const mockFundingService: FundingService = {
  // Funding Programs
  async getPrograms(params?: FundingProgramListParams): Promise<PaginatedResponse<FundingProgram>> {
    await delay(500)
    
    let filtered = [...programs]
    
    // Apply filters
    if (params?.status) {
      filtered = filtered.filter(p => p.status === params.status)
    }
    if (params?.category) {
      filtered = filtered.filter(p => p.category === params.category)
    }
    if (params?.relevance) {
      filtered = filtered.filter(p => p.relevance === params.relevance)
    }
    if (params?.sourceId) {
      filtered = filtered.filter(p => p.sourceId === params.sourceId)
    }
    if (params?.isFavorite !== undefined) {
      filtered = filtered.filter(p => p.isFavorite === params.isFavorite)
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.organization.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply sorting
    if (params?.sortBy) {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy as keyof FundingProgram]
        const bVal = b[params.sortBy as keyof FundingProgram]
        if (aVal === undefined || bVal === undefined) return 0
        if (aVal < bVal) return -1 * sortOrder
        if (aVal > bVal) return 1 * sortOrder
        return 0
      })
    }
    
    return paginate(filtered, params?.page, params?.limit)
  },

  async getProgramById(id: string): Promise<FundingProgram> {
    await delay(300)
    
    const program = programs.find(p => p.id === id)
    if (!program) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到資助計劃',
        status: 404,
      }
    }
    
    // Include source details
    const source = sources.find(s => s.id === program.sourceId)
    return { ...program, source }
  },

  async createProgram(input: FundingProgramCreateInput): Promise<FundingProgram> {
    await delay(600)
    
    const newProgram: FundingProgram = {
      ...input,
      id: `program-${Date.now()}`,
      priority: input.priority || 5,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    programs.push(newProgram)
    return newProgram
  },

  async updateProgram(id: string, input: FundingProgramUpdateInput): Promise<FundingProgram> {
    await delay(500)
    
    const index = programs.findIndex(p => p.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到資助計劃',
        status: 404,
      }
    }
    
    programs[index] = {
      ...programs[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    
    return programs[index]
  },

  async deleteProgram(id: string): Promise<void> {
    await delay(400)
    
    const index = programs.findIndex(p => p.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到資助計劃',
        status: 404,
      }
    }
    
    programs.splice(index, 1)
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<FundingProgram> {
    await delay(300)
    
    const index = programs.findIndex(p => p.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到資助計劃',
        status: 404,
      }
    }
    
    programs[index] = {
      ...programs[index],
      isFavorite,
      updatedAt: new Date().toISOString(),
    }
    
    return programs[index]
  },

  // Funding Sources
  async getSources(params?: FundingSourceListParams): Promise<PaginatedResponse<FundingSource>> {
    await delay(400)
    
    let filtered = [...sources]
    
    // Apply filters
    if (params?.status) {
      filtered = filtered.filter(s => s.status === params.status)
    }
    if (params?.category) {
      filtered = filtered.filter(s => s.category === params.category)
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.nameEn.toLowerCase().includes(searchLower) ||
          s.organization.toLowerCase().includes(searchLower)
      )
    }
    
    return paginate(filtered, params?.page, params?.limit)
  },

  async getSourceById(id: string): Promise<FundingSource> {
    await delay(300)
    
    const source = sources.find(s => s.id === id)
    if (!source) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到監測來源',
        status: 404,
      }
    }
    
    return source
  },

  async createSource(input: FundingSourceCreateInput): Promise<FundingSource> {
    await delay(600)
    
    const newSource: FundingSource = {
      ...input,
      id: `source-${Date.now()}`,
      status: 'checking',
      lastChecked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    sources.push(newSource)
    return newSource
  },

  async updateSource(id: string, input: FundingSourceUpdateInput): Promise<FundingSource> {
    await delay(500)
    
    const index = sources.findIndex(s => s.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到監測來源',
        status: 404,
      }
    }
    
    sources[index] = {
      ...sources[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    
    return sources[index]
  },

  async deleteSource(id: string): Promise<void> {
    await delay(400)
    
    const index = sources.findIndex(s => s.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到監測來源',
        status: 404,
      }
    }
    
    sources.splice(index, 1)
  },

  async checkSourceStatus(id: string): Promise<FundingSource> {
    await delay(1000) // Simulate checking website
    
    const index = sources.findIndex(s => s.id === id)
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到監測來源',
        status: 404,
      }
    }
    
    // Randomly set status (90% online, 10% offline for demo)
    const status = Math.random() > 0.1 ? 'online' : 'offline'
    
    sources[index] = {
      ...sources[index],
      status,
      lastChecked: new Date().toISOString(),
    }
    
    return sources[index]
  },

  async checkAllSources(): Promise<FundingSource[]> {
    await delay(2000) // Simulate checking all websites
    
    sources = sources.map(s => ({
      ...s,
      status: Math.random() > 0.1 ? 'online' : 'offline',
      lastChecked: new Date().toISOString(),
    }))
    
    return sources
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400)
    
    return {
      openPrograms: programs.filter(p => p.status === 'open').length,
      upcomingPrograms: programs.filter(p => p.status === 'upcoming').length,
      highRelevancePrograms: programs.filter(p => p.relevance === 'high' && p.status !== 'closed').length,
      onlineSources: sources.filter(s => s.status === 'online').length,
      totalSources: sources.length,
      recentChanges: 3,
      pendingApplications: 2,
    }
  },

  async getUpcomingDeadlines(days: number = 30): Promise<DeadlineItem[]> {
    await delay(300)
    
    const today = new Date()
    const cutoffDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    
    return mockDeadlineItems.filter(item => {
      if (item.daysRemaining < 0) return false
      const deadline = new Date(item.deadline)
      return deadline <= cutoffDate
    })
  },

  // Export
  async exportProgramsToCSV(): Promise<Blob> {
    await delay(500)
    
    const headers = [
      '計劃名稱',
      '資助機構',
      '類別',
      '最高資助金額',
      '截止日期',
      '申請狀態',
      '相關程度',
    ]
    
    const rows = programs.map(p => [
      p.name,
      p.organization,
      p.category,
      p.maxAmount,
      p.deadline,
      p.status,
      p.relevance,
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')
    
    const BOM = '\uFEFF'
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  },

  async exportFullReport(): Promise<Blob> {
    await delay(800)
    
    // Return a more comprehensive report
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalPrograms: programs.length,
        openPrograms: programs.filter(p => p.status === 'open').length,
        totalSources: sources.length,
      },
      programs,
      sources,
    }
    
    return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  },
}
