'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'
import type { FundingSource } from '@/src/types'

const sourceCategories: Record<string, string> = {
  government: '政府部門',
  fund: '專項基金',
  corporate: '企業機構',
  other: '其他來源',
}
import { cn } from '@/lib/utils'

interface SourceMonitorProps {
  sources: FundingSource[]
  onRefresh?: () => void
}

export function SourceMonitor({ sources, onRefresh }: SourceMonitorProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sourceStatuses, setSourceStatuses] = useState(sources)

  useEffect(() => {
    setSourceStatuses(sources)
  }, [sources])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate checking status
    setSourceStatuses((prev) =>
      prev.map((s) => ({ ...s, status: 'checking' as const }))
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSourceStatuses((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'online' as const,
        lastChecked: new Date().toISOString(),
      }))
    )
    setIsRefreshing(false)
    onRefresh?.()
  }

  const onlineCount = sourceStatuses.filter((s) => s.status === 'online').length
  const totalCount = sourceStatuses.length

  const groupedSources = sourceStatuses.reduce(
    (acc, source) => {
      if (!acc[source.category]) {
        acc[source.category] = []
      }
      acc[source.category].push(source)
      return acc
    },
    {} as Record<string, FundingSource[]>
  )

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">
            監測來源狀態
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {onlineCount}/{totalCount} 來源在線
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw
            className={cn('mr-2 h-3.5 w-3.5', isRefreshing && 'animate-spin')}
          />
          刷新狀態
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {Object.entries(groupedSources).map(([category, categorySources]) => (
            <div key={category} className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {sourceCategories[category as FundingSource['category']]}
              </span>
              <div className="flex flex-col gap-1">
                {categorySources.map((source) => (
                  <div
                    key={source.id}
                    className="group flex items-center justify-between rounded-lg border border-transparent bg-muted/30 px-3 py-2 transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {source.status === 'online' && (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                        {source.status === 'offline' && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        {source.status === 'checking' && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {source.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {source.organization}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          source.status === 'online' ? 'default' : 'secondary'
                        }
                        className={cn(
                          'text-[10px]',
                          source.status === 'online' &&
                            'bg-success/20 text-success hover:bg-success/30'
                        )}
                      >
                        {source.status === 'online' && '正常'}
                        {source.status === 'offline' && '離線'}
                        {source.status === 'checking' && '檢查中'}
                      </Badge>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
