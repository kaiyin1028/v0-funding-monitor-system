'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fundingService } from '@/src/services/funding.service'
import type {
  FundingProgram,
  FundingProgramCreateInput,
  FundingProgramUpdateInput,
  FundingProgramListParams,
  FundingSource,
  FundingSourceListParams,
  DashboardStats,
  DeadlineItem,
} from '@/src/types'

// ============================================
// Funding Programs Hooks
// ============================================

export function useFundingPrograms(params?: FundingProgramListParams) {
  const key = params
    ? ['funding-programs', JSON.stringify(params)]
    : ['funding-programs']

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fundingService.getPrograms(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    programs: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  }
}

export function useFundingProgram(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['funding-program', id] : null,
    () => (id ? fundingService.getProgramById(id) : null),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    program: data,
    isLoading,
    error,
    mutate,
  }
}

export function useCreateProgram() {
  const { trigger, isMutating, error } = useSWRMutation(
    'create-program',
    (_key, { arg }: { arg: FundingProgramCreateInput }) =>
      fundingService.createProgram(arg)
  )

  return {
    createProgram: trigger,
    isCreating: isMutating,
    error,
  }
}

export function useUpdateProgram() {
  const { trigger, isMutating, error } = useSWRMutation(
    'update-program',
    (_key, { arg }: { arg: { id: string; input: FundingProgramUpdateInput } }) =>
      fundingService.updateProgram(arg.id, arg.input)
  )

  return {
    updateProgram: (id: string, input: FundingProgramUpdateInput) =>
      trigger({ id, input }),
    isUpdating: isMutating,
    error,
  }
}

export function useDeleteProgram() {
  const { trigger, isMutating, error } = useSWRMutation(
    'delete-program',
    (_key, { arg }: { arg: string }) => fundingService.deleteProgram(arg)
  )

  return {
    deleteProgram: trigger,
    isDeleting: isMutating,
    error,
  }
}

export function useToggleFavorite() {
  const { trigger, isMutating, error } = useSWRMutation(
    'toggle-favorite',
    (_key, { arg }: { arg: { id: string; isFavorite: boolean } }) =>
      fundingService.toggleFavorite(arg.id, arg.isFavorite)
  )

  return {
    toggleFavorite: (id: string, isFavorite: boolean) =>
      trigger({ id, isFavorite }),
    isToggling: isMutating,
    error,
  }
}

// ============================================
// Funding Sources Hooks
// ============================================

export function useFundingSources(params?: FundingSourceListParams) {
  const key = params
    ? ['funding-sources', JSON.stringify(params)]
    : ['funding-sources']

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fundingService.getSources(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    sources: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  }
}

export function useFundingSource(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['funding-source', id] : null,
    () => (id ? fundingService.getSourceById(id) : null),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    source: data,
    isLoading,
    error,
    mutate,
  }
}

export function useCheckSourceStatus() {
  const { trigger, isMutating, error } = useSWRMutation(
    'check-source',
    (_key, { arg }: { arg: string }) => fundingService.checkSourceStatus(arg)
  )

  return {
    checkSource: trigger,
    isChecking: isMutating,
    error,
  }
}

export function useCheckAllSources() {
  const { trigger, isMutating, error } = useSWRMutation(
    'check-all-sources',
    () => fundingService.checkAllSources()
  )

  return {
    checkAllSources: trigger,
    isChecking: isMutating,
    error,
  }
}

// ============================================
// Dashboard Hooks
// ============================================

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    'dashboard-stats',
    () => fundingService.getDashboardStats(),
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}

export function useUpcomingDeadlines(days: number = 30) {
  const { data, error, isLoading, mutate } = useSWR<DeadlineItem[]>(
    ['upcoming-deadlines', days],
    () => fundingService.getUpcomingDeadlines(days),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    deadlines: data || [],
    isLoading,
    error,
    mutate,
  }
}
