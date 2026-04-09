/**
 * Monitoring Service
 * Handles monitoring logs and alerts
 */

import { apiClient } from '@/src/lib/api-client'
import { mockMonitoringService } from '@/src/mocks/monitoring.mock'
import type {
  MonitoringLog,
  MonitoringLogListParams,
  MonitoringStats,
  PaginatedResponse,
} from '@/src/types'

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export interface MonitoringService {
  getLogs(params?: MonitoringLogListParams): Promise<PaginatedResponse<MonitoringLog>>
  getLogById(id: string): Promise<MonitoringLog>
  getStats(): Promise<MonitoringStats>
  triggerCheck(sourceId?: string): Promise<{ message: string; logsCreated: number }>
  clearOldLogs(daysToKeep?: number): Promise<{ deletedCount: number }>
}

/**
 * Real API implementation
 */
const realMonitoringService: MonitoringService = {
  async getLogs(params?: MonitoringLogListParams): Promise<PaginatedResponse<MonitoringLog>> {
    return apiClient.get<PaginatedResponse<MonitoringLog>>('/monitoring/logs', params as Record<string, string | number | boolean | undefined>)
  },

  async getLogById(id: string): Promise<MonitoringLog> {
    return apiClient.get<MonitoringLog>(`/monitoring/logs/${id}`)
  },

  async getStats(): Promise<MonitoringStats> {
    return apiClient.get<MonitoringStats>('/monitoring/stats')
  },

  async triggerCheck(sourceId?: string): Promise<{ message: string; logsCreated: number }> {
    return apiClient.post<{ message: string; logsCreated: number }>('/monitoring/trigger', { sourceId })
  },

  async clearOldLogs(daysToKeep: number = 90): Promise<{ deletedCount: number }> {
    return apiClient.delete<{ deletedCount: number }>(`/monitoring/logs/cleanup?daysToKeep=${daysToKeep}`)
  },
}

/**
 * Export the appropriate service based on environment
 */
export const monitoringService: MonitoringService = useMocks ? mockMonitoringService : realMonitoringService
