'use client'

import { AlertCircle, RefreshCcw, WifiOff, ServerCrash, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: {
    code?: string
    message?: string
    status?: number
  }
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  message,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  // Determine error type and appropriate icon/message
  const getErrorDetails = () => {
    const status = error?.status
    const code = error?.code
    
    if (status === 401 || code === 'AUTH_UNAUTHORIZED') {
      return {
        icon: ShieldAlert,
        defaultTitle: '未授權',
        defaultMessage: '請重新登入以繼續使用',
        iconColor: 'text-orange-500',
      }
    }
    
    if (status === 403 || code === 'FORBIDDEN') {
      return {
        icon: ShieldAlert,
        defaultTitle: '沒有權限',
        defaultMessage: '您沒有權限執行此操作',
        iconColor: 'text-orange-500',
      }
    }
    
    if (status === 404 || code === 'NOT_FOUND') {
      return {
        icon: AlertCircle,
        defaultTitle: '找不到資源',
        defaultMessage: '請求的資源不存在',
        iconColor: 'text-yellow-500',
      }
    }
    
    if (status === 500 || status === 502 || status === 503) {
      return {
        icon: ServerCrash,
        defaultTitle: '伺服器錯誤',
        defaultMessage: '伺服器暫時無法回應，請稍後再試',
        iconColor: 'text-red-500',
      }
    }
    
    if (code?.includes('NETWORK') || !navigator.onLine) {
      return {
        icon: WifiOff,
        defaultTitle: '網絡連接問題',
        defaultMessage: '請檢查您的網絡連接',
        iconColor: 'text-gray-500',
      }
    }
    
    return {
      icon: AlertCircle,
      defaultTitle: '發生錯誤',
      defaultMessage: error?.message || '發生未知錯誤，請稍後再試',
      iconColor: 'text-red-500',
    }
  }
  
  const { icon: Icon, defaultTitle, defaultMessage, iconColor } = getErrorDetails()
  
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className={cn('rounded-full bg-muted/50 p-4 mb-4', iconColor)}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        {message || defaultMessage}
      </p>
      {error?.code && (
        <p className="text-xs text-muted-foreground/70 mb-4">
          錯誤代碼: {error.code}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          重試
        </Button>
      )}
    </div>
  )
}

export function PageErrorState({
  title,
  message,
  error,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ErrorState
        title={title}
        message={message}
        error={error}
        onRetry={onRetry}
      />
    </div>
  )
}
