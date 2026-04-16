'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusCard } from '@/components/status-card'
import { HeroBanner } from '@/components/hero-banner'
import { FeatureCards } from '@/components/feature-cards'
import { SourceMonitor } from '@/components/source-monitor'
import { FundingTable } from '@/components/funding-table'
import { DeadlineTimeline } from '@/components/deadline-timeline'
import { LoadingState, PageLoadingState } from '@/src/components/ui/loading-state'
import { ErrorState } from '@/src/components/ui/error-state'
import { EmptyState } from '@/src/components/ui/empty-state'
import {
  useFundingPrograms,
  useFundingSources,
  useDashboardStats,
  useCheckAllSources,
} from '@/src/hooks/use-funding'
import { fundingService } from '@/src/services/funding.service'
import {
  Database,
  Bell,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCcw,
  Download,
  CalendarPlus,
  ExternalLink,
} from 'lucide-react'

export default function FundingMonitorPage() {
  // Fetch data using hooks (connected to services layer)
  const {
    programs,
    isLoading: programsLoading,
    error: programsError,
    mutate: mutatePrograms,
  } = useFundingPrograms()

  const {
    sources,
    isLoading: sourcesLoading,
    error: sourcesError,
    mutate: mutateSources,
  } = useFundingSources()

  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    mutate: mutateStats,
  } = useDashboardStats()

  const { checkAllSources, isChecking } = useCheckAllSources()

  // Derived data
  const openPrograms = programs.filter((p) => p.status === 'open')
  const upcomingPrograms = programs.filter((p) => p.status === 'upcoming')
  const highRelevancePrograms = programs.filter(
    (p) => p.relevance === 'high' && p.status !== 'closed'
  )
  const onlineSources = sources.filter((s) => s.status === 'online')

  // Handlers
  const handleRefresh = useCallback(async () => {
    try {
      await checkAllSources()
      await Promise.all([mutatePrograms(), mutateSources(), mutateStats()])
    } catch (error) {
      console.error('Failed to refresh:', error)
    }
  }, [checkAllSources, mutatePrograms, mutateSources, mutateStats])

  const handleExport = useCallback(async () => {
    try {
      const blob = await fundingService.exportProgramsToCSV()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `香港教育資助計劃_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [])

  const handleExportFullReport = useCallback(async () => {
    try {
      const blob = await fundingService.exportFullReport()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `香港教育資助完整報告_${new Date().toISOString().split('T')[0]}.json`
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [])

  // Show page loading state
  const isInitialLoading = programsLoading && sourcesLoading && statsLoading
  if (isInitialLoading) {
    return <PageLoadingState />
  }

  // Show page error state
  const hasError = programsError || sourcesError || statsError
  if (hasError && programs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="載入失敗"
          message="無法載入資助計劃數據，請檢查網絡連接後重試"
          error={programsError || sourcesError || statsError}
          onRetry={handleRefresh}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Colorful top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 via-orange-500 to-purple-500" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-md">
                <Database className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold leading-tight">
                  香港教育資助監測系統
                </h1>
                <p className="text-xs text-muted-foreground">
                  香港教育裝備行業協會
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  title="匯出日曆提醒"
                >
                  <CalendarPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportFullReport}
                  title="匯出完整報告"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Link href="/database">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">進階數據庫</span>
                  <span className="sm:hidden">數據庫</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isChecking}
              >
                <RefreshCcw
                  className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">刷新</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:px-8">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {statsLoading ? (
            <LoadingState variant="card" />
          ) : (
            <>
              <StatusCard
                title="正在接受申請"
                value={stats?.openPrograms ?? openPrograms.length}
                subtitle="個資助計劃"
                icon={<CheckCircle2 className="h-5 w-5" />}
                trend="up"
                trendValue="較上月增加2個"
                colorScheme="green"
              />
              <StatusCard
                title="即將開放申請"
                value={stats?.upcomingPrograms ?? upcomingPrograms.length}
                subtitle="個資助計劃"
                icon={<Clock className="h-5 w-5" />}
                colorScheme="orange"
              />
              <StatusCard
                title="高度相關項目"
                value={stats?.highRelevancePrograms ?? highRelevancePrograms.length}
                subtitle="個優先建議申請"
                icon={<TrendingUp className="h-5 w-5" />}
                colorScheme="purple"
              />
              <StatusCard
                title="監測來源"
                value={`${stats?.onlineSources ?? onlineSources.length}/${stats?.totalSources ?? sources.length}`}
                subtitle="來源正常運作"
                icon={<Bell className="h-5 w-5" />}
                colorScheme="teal"
              />
            </>
          )}
        </div>

        {/* Feature Cards with Images */}
        <FeatureCards />

        {/* Main Content */}
        <Tabs defaultValue="database" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="database" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">資助計劃數據庫</span>
              <span className="sm:hidden">數據庫</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">監測來源狀態</span>
              <span className="sm:hidden">監測</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            {programsLoading ? (
              <LoadingState variant="table" rows={5} />
            ) : programsError ? (
              <ErrorState
                title="載入資助計劃失敗"
                error={programsError}
                onRetry={() => mutatePrograms()}
              />
            ) : programs.length === 0 ? (
              <EmptyState
                type="data"
                title="暫無資助計劃"
                message="目前沒有可顯示的資助計劃資料"
              />
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
                <FundingTable programs={programs} onExport={handleExport} />
                <div className="space-y-4">
                  <DeadlineTimeline programs={programs} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitor" className="space-y-4">
            {sourcesLoading ? (
              <LoadingState variant="table" rows={5} />
            ) : sourcesError ? (
              <ErrorState
                title="載入監測來源失敗"
                error={sourcesError}
                onRetry={() => mutateSources()}
              />
            ) : sources.length === 0 ? (
              <EmptyState
                type="data"
                title="暫無監測來源"
                message="目前沒有設定的監測來源"
              />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <SourceMonitor sources={sources} onRefresh={handleRefresh} />
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/50 bg-card p-6">
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      監測說明
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        本系統自動監測以下類別的資助來源，並在偵測到新的資助機會時發出通知：
                      </p>
                      <ul className="list-disc list-inside space-y-1.5">
                        <li>政府部門官方網站</li>
                        <li>專項基金資助計劃</li>
                        <li>企業及慈善機構</li>
                        <li>其他教育資助來源</li>
                      </ul>
                      <p className="pt-2">
                        建議每日檢查一次系統，並於申請截止前至少30天開始準備申請文件。
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6">
                    <h3 className="text-base font-semibold mb-4">重要網站連結</h3>
                    <div className="space-y-2">
                      {sources.slice(0, 6).map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                        >
                          <span>{source.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {source.nameEn}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-8">
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Hong Kong Educational Equipment Industry Association</p>
            <p>
              資助監測系統 v1.0 | 數據僅供參考，申請前請查閱官方網站
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
