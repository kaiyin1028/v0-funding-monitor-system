/**
 * Hooks Index
 * Export all custom hooks for easy importing
 */

// Auth hooks
export { useAuth, useChangePassword, usePasswordReset } from './use-auth'

// Funding hooks
export {
  useFundingPrograms,
  useFundingProgram,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
  useToggleFavorite,
  useFundingSources,
  useFundingSource,
  useCheckSourceStatus,
  useCheckAllSources,
  useDashboardStats,
  useUpcomingDeadlines,
} from './use-funding'
