/**
 * Core type definitions for Hong Kong Education Funding Monitor System
 */

// ============================================
// User & Authentication Types
// ============================================

export type UserRole = 'admin' | 'staff' | 'viewer'

export interface User {
  id: string
  username: string
  email: string
  displayName: string
  role: UserRole
  avatar?: string
  organization?: string
  phone?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface AuthResponse {
  user: User
  token: AuthToken
}

// ============================================
// Funding Source Types
// ============================================

export type FundingSourceStatus = 'online' | 'offline' | 'checking' | 'error'
export type FundingSourceCategory = 'government' | 'fund' | 'corporate' | 'other'

export interface FundingSource {
  id: string
  name: string
  nameEn: string
  organization: string
  url: string
  status: FundingSourceStatus
  lastChecked: string
  category: FundingSourceCategory
  description?: string
  contactEmail?: string
  contactPhone?: string
  createdAt?: string
  updatedAt?: string
}

export interface FundingSourceCreateInput {
  name: string
  nameEn: string
  organization: string
  url: string
  category: FundingSourceCategory
  description?: string
  contactEmail?: string
  contactPhone?: string
}

export interface FundingSourceUpdateInput extends Partial<FundingSourceCreateInput> {
  status?: FundingSourceStatus
}

// ============================================
// Funding Program Types
// ============================================

export type FundingProgramStatus = 'open' | 'upcoming' | 'closed'
export type FundingProgramRelevance = 'high' | 'medium' | 'low'
export type FundingProgramCategory = 'education' | 'innovation' | 'youth' | 'environment' | 'social' | 'culture'

export interface FundingProgram {
  id: string
  name: string
  organization: string
  sourceId: string
  source?: FundingSource
  category: FundingProgramCategory
  maxAmount: string
  deadline: string
  status: FundingProgramStatus
  relevance: FundingProgramRelevance
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority: number
  notes?: string
  isFavorite?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FundingProgramCreateInput {
  name: string
  organization: string
  sourceId: string
  category: FundingProgramCategory
  maxAmount: string
  deadline: string
  status: FundingProgramStatus
  relevance: FundingProgramRelevance
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority?: number
  notes?: string
}

export interface FundingProgramUpdateInput extends Partial<FundingProgramCreateInput> {
  isFavorite?: boolean
}

// ============================================
// Monitoring Types
// ============================================

export type MonitoringLogType = 'check' | 'new_program' | 'update' | 'error' | 'alert'

export interface MonitoringLog {
  id: string
  sourceId: string
  source?: FundingSource
  type: MonitoringLogType
  message: string
  details?: Record<string, unknown>
  createdAt: string
}

export interface MonitoringStats {
  totalSources: number
  onlineSources: number
  offlineSources: number
  lastCheckTime: string
  newProgramsToday: number
  alertsToday: number
}

// ============================================
// Application Types
// ============================================

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'

export interface Application {
  id: string
  programId: string
  program?: FundingProgram
  userId: string
  user?: User
  status: ApplicationStatus
  submittedAt?: string
  projectTitle: string
  projectDescription: string
  requestedAmount: string
  attachments?: ApplicationAttachment[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationAttachment {
  id: string
  filename: string
  fileSize: number
  mimeType: string
  url: string
  uploadedAt: string
}

export interface ApplicationCreateInput {
  programId: string
  projectTitle: string
  projectDescription: string
  requestedAmount: string
  notes?: string
}

export interface ApplicationUpdateInput extends Partial<ApplicationCreateInput> {
  status?: ApplicationStatus
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = 'new_program' | 'deadline_reminder' | 'status_change' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  relatedId?: string
  relatedType?: 'program' | 'application' | 'source'
  createdAt: string
}

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface FundingProgramListParams extends ListParams {
  status?: FundingProgramStatus
  category?: FundingProgramCategory
  relevance?: FundingProgramRelevance
  sourceId?: string
  isFavorite?: boolean
}

export interface FundingSourceListParams extends ListParams {
  status?: FundingSourceStatus
  category?: FundingSourceCategory
}

export interface MonitoringLogListParams extends ListParams {
  type?: MonitoringLogType
  sourceId?: string
  fromDate?: string
  toDate?: string
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  openPrograms: number
  upcomingPrograms: number
  highRelevancePrograms: number
  onlineSources: number
  totalSources: number
  recentChanges: number
  pendingApplications: number
}

export interface DeadlineItem {
  programId: string
  programName: string
  deadline: string
  daysRemaining: number
  status: FundingProgramStatus
  relevance: FundingProgramRelevance
}

// ============================================
// Label Mappings (for UI display)
// ============================================

export const CategoryLabels: Record<FundingProgramCategory, string> = {
  education: '教育',
  innovation: '創新科技',
  youth: '青年發展',
  environment: '環境保育',
  social: '社會服務',
  culture: '文化藝術',
}

export const StatusLabels: Record<FundingProgramStatus, string> = {
  open: '正在接受申請',
  upcoming: '即將開放',
  closed: '已截止',
}

export const RelevanceLabels: Record<FundingProgramRelevance, string> = {
  high: '高度相關',
  medium: '中度相關',
  low: '低度相關',
}

export const SourceCategoryLabels: Record<FundingSourceCategory, string> = {
  government: '政府部門',
  fund: '專項基金',
  corporate: '企業機構',
  other: '其他來源',
}

export const UserRoleLabels: Record<UserRole, string> = {
  admin: '管理員',
  staff: '職員',
  viewer: '訪客',
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  draft: '草稿',
  submitted: '已提交',
  under_review: '審核中',
  approved: '已批准',
  rejected: '已拒絕',
  withdrawn: '已撤回',
}
