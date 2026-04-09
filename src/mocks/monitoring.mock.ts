/**
 * Mock Monitoring Service
 * Provides mock implementation for development without backend
 */

import type { MonitoringService } from '@/src/services/monitoring.service'
import type {
  MonitoringLog,
  MonitoringLogListParams,
  MonitoringStats,
  PaginatedResponse,
} from '@/src/types'
import { mockMonitoringLogs, mockFundingSources } from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory data store
let logs = [...mockMonitoringLogs]

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

export const mockMonitoringService: MonitoringService = {
  async getLogs(params?: MonitoringLogListParams): Promise<PaginatedResponse<MonitoringLog>> {
    await delay(400)
    
    let filtered = [...logs]
    
    // Apply filters
    if (params?.type) {
      filtered = filtered.filter(log => log.type === params.type)
    }
    if (params?.sourceId) {
      filtered = filtered.filter(log => log.sourceId === params.sourceId)
    }
    if (params?.fromDate) {
      const fromDate = new Date(params.fromDate)
      filtered = filtered.filter(log => new Date(log.createdAt) >= fromDate)
    }
    if (params?.toDate) {
      const toDate = new Date(params.toDate)
      filtered = filtered.filter(log => new Date(log.createdAt) <= toDate)
    }
    
    // Sort by createdAt descending (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Include source details
    const logsWithSource = filtered.map(log => ({
      ...log,
      source: mockFundingSources.find(s => s.id === log.sourceId),
    }))
    
    return paginate(logsWithSource, params?.page, params?.limit)
  },

  async getLogById(id: string): Promise<MonitoringLog> {
    await delay(300)
    
    const log = logs.find(l => l.id === id)
    if (!log) {
      throw {
        code: 'NOT_FOUND',
        message: '找不到監測記錄',
        status: 404,
      }
    }
    
    return {
      ...log,
      source: mockFundingSources.find(s => s.id === log.sourceId),
    }
  },

  async getStats(): Promise<MonitoringStats> {
    await delay(300)
    
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const todayLogs = logs.filter(log => new Date(log.createdAt) >= todayStart)
    
    return {
      totalSources: mockFundingSources.length,
      onlineSources: mockFundingSources.filter(s => s.status === 'online').length,
      offlineSources: mockFundingSources.filter(s => s.status === 'offline').length,
      lastCheckTime: new Date().toISOString(),
      newProgramsToday: todayLogs.filter(log => log.type === 'new_program').length,
      alertsToday: todayLogs.filter(log => log.type === 'alert').length,
    }
  },

  async triggerCheck(sourceId?: string): Promise<{ message: string; logsCreated: number }> {
    await delay(1500) // Simulate checking time
    
    const sourcesToCheck = sourceId
      ? mockFundingSources.filter(s => s.id === sourceId)
      : mockFundingSources
    
    // Create check logs for each source
    const newLogs: MonitoringLog[] = sourcesToCheck.map(source => ({
      id: `log-${Date.now()}-${source.id}`,
      sourceId: source.id,
      type: 'check' as const,
      message: `${source.name} 網站檢查完成，狀態正常`,
      createdAt: new Date().toISOString(),
    }))
    
    logs = [...newLogs, ...logs]
    
    return {
      message: `已完成 ${sourcesToCheck.length} 個來源的檢查`,
      logsCreated: newLogs.length,
    }
  },

  async clearOldLogs(daysToKeep: number = 90): Promise<{ deletedCount: number }> {
    await delay(500)
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const originalCount = logs.length
    logs = logs.filter(log => new Date(log.createdAt) >= cutoffDate)
    
    return {
      deletedCount: originalCount - logs.length,
    }
  },
}
