'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { authService } from '@/src/services/auth.service'
import type { User, LoginCredentials } from '@/src/types'

export function useAuth() {
  const [isInitialized, setIsInitialized] = useState(false)

  // Fetch current user
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User>(
    'current-user',
    () => authService.getCurrentUser(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: () => {
        // Silent error - user not logged in
      },
    }
  )

  // Initialize auth state
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Login mutation
  const { trigger: loginTrigger, isMutating: isLoggingIn } = useSWRMutation(
    'login',
    async (_key, { arg }: { arg: LoginCredentials }) => {
      const response = await authService.login(arg)
      // Update user cache
      await mutate(response.user, false)
      return response
    }
  )

  // Logout mutation
  const { trigger: logoutTrigger, isMutating: isLoggingOut } = useSWRMutation(
    'logout',
    async () => {
      await authService.logout()
      // Clear user cache
      await mutate(undefined, false)
    }
  )

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return loginTrigger(credentials)
    },
    [loginTrigger]
  )

  const logout = useCallback(async () => {
    return logoutTrigger()
  }, [logoutTrigger])

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      mutate(undefined, false)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [mutate])

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoading,
    isLoggingIn,
    isLoggingOut,
    error,
    login,
    logout,
    mutate,
  }
}

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await authService.changePassword(currentPassword, newPassword)
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    changePassword,
    isLoading,
    error,
  }
}

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const requestReset = useCallback(async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.requestPasswordReset(email)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.resetPassword(token, newPassword)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    requestReset,
    resetPassword,
    isLoading,
    error,
  }
}
