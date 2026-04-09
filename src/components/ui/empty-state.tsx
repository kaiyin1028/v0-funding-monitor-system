'use client'

import { 
  FileSearch, 
  Database, 
  Search, 
  FolderOpen,
  Bell,
  Star,
  type LucideIcon 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateType = 'search' | 'data' | 'favorite' | 'notification' | 'filter' | 'custom'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  message?: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const emptyStateDefaults: Record<EmptyStateType, { icon: LucideIcon; title: string; message: string }> = {
  search: {
    icon: Search,
    title: '找不到結果',
    message: '嘗試調整搜尋條件或使用其他關鍵字',
  },
  data: {
    icon: Database,
    title: '暫無數據',
    message: '目前沒有可顯示的資料',
  },
  favorite: {
    icon: Star,
    title: '暫無收藏',
    message: '點擊星號圖標將項目加入收藏',
  },
  notification: {
    icon: Bell,
    title: '暫無通知',
    message: '目前沒有新的通知',
  },
  filter: {
    icon: FolderOpen,
    title: '無符合條件的結果',
    message: '嘗試清除篩選條件或調整設定',
  },
  custom: {
    icon: FileSearch,
    title: '暫無內容',
    message: '',
  },
}

export function EmptyState({
  type = 'data',
  title,
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const defaults = emptyStateDefaults[type]
  const Icon = icon || defaults.icon
  
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="rounded-full bg-muted/50 p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {title || defaults.title}
      </h3>
      {(message || defaults.message) && (
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
          {message || defaults.message}
        </p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface DataStateWrapperProps<T> {
  isLoading: boolean
  error: unknown
  data: T[] | undefined
  onRetry?: () => void
  emptyState?: {
    type?: EmptyStateType
    title?: string
    message?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  loadingComponent?: React.ReactNode
  children: (data: T[]) => React.ReactNode
  className?: string
}

export function DataStateWrapper<T>({
  isLoading,
  error,
  data,
  onRetry,
  emptyState,
  loadingComponent,
  children,
  className,
}: DataStateWrapperProps<T>) {
  const { LoadingState } = require('./loading-state')
  const { ErrorState } = require('./error-state')
  
  if (isLoading) {
    return loadingComponent || <LoadingState variant="table" className={className} />
  }
  
  if (error) {
    return (
      <ErrorState
        error={error as { code?: string; message?: string; status?: number }}
        onRetry={onRetry}
        className={className}
      />
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <EmptyState
        type={emptyState?.type || 'data'}
        title={emptyState?.title}
        message={emptyState?.message}
        action={emptyState?.action}
        className={className}
      />
    )
  }
  
  return <>{children(data)}</>
}
