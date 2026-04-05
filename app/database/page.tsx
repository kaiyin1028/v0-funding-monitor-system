'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Search,
  Download,
  Star,
  Calendar,
  Building2,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  X,
  FileSpreadsheet,
  Bookmark,
  Eye,
} from 'lucide-react'
import {
  fundingPrograms,
  fundingSources,
  categoryLabels,
  statusLabels,
  relevanceLabels,
  FundingProgram,
} from '@/lib/funding-data'
import { cn } from '@/lib/utils'

type SortField = 'name' | 'deadline' | 'maxAmount' | 'relevance' | 'priority'
type SortDirection = 'asc' | 'desc'

export default function DatabasePage() {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedRelevance, setSelectedRelevance] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('priority')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const filteredPrograms = useMemo(() => {
    return fundingPrograms
      .filter((program) => {
        // Search filter
        const matchesSearch =
          search === '' ||
          program.name.toLowerCase().includes(search.toLowerCase()) ||
          program.organization.toLowerCase().includes(search.toLowerCase()) ||
          program.description.toLowerCase().includes(search.toLowerCase())

        // Category filter
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(program.category)

        // Status filter
        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(program.status)

        // Relevance filter
        const matchesRelevance =
          selectedRelevance.length === 0 ||
          selectedRelevance.includes(program.relevance)

        // Source filter
        const matchesSource =
          selectedSources.length === 0 ||
          selectedSources.includes(program.sourceId)

        // Bookmarked filter
        const matchesBookmark =
          !showBookmarkedOnly || bookmarkedIds.has(program.id)

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesRelevance &&
          matchesSource &&
          matchesBookmark
        )
      })
      .sort((a, b) => {
        let comparison = 0

        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name, 'zh-HK')
            break
          case 'deadline':
            const dateA = a.deadline.includes('全年')
              ? new Date('2099-12-31')
              : new Date(a.deadline)
            const dateB = b.deadline.includes('全年')
              ? new Date('2099-12-31')
              : new Date(b.deadline)
            comparison = dateA.getTime() - dateB.getTime()
            break
          case 'relevance':
            const relevanceOrder = { high: 1, medium: 2, low: 3 }
            comparison = relevanceOrder[a.relevance] - relevanceOrder[b.relevance]
            break
          case 'priority':
            comparison = a.priority - b.priority
            break
          default:
            comparison = 0
        }

        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [
    search,
    selectedCategories,
    selectedStatuses,
    selectedRelevance,
    selectedSources,
    showBookmarkedOnly,
    bookmarkedIds,
    sortField,
    sortDirection,
  ])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedStatuses([])
    setSelectedRelevance([])
    setSelectedSources([])
    setShowBookmarkedOnly(false)
  }

  const hasActiveFilters =
    search !== '' ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedRelevance.length > 0 ||
    selectedSources.length > 0 ||
    showBookmarkedOnly

  const handleExport = useCallback(() => {
    const headers = [
      '計劃名稱',
      '資助機構',
      '類別',
      '最高資助金額',
      '截止日期',
      '申請狀態',
      '相關程度',
      '申請期間',
      '計劃簡介',
      '申請要求',
      '網站連結',
    ]

    const rows = filteredPrograms.map((p) => [
      p.name,
      p.organization,
      categoryLabels[p.category],
      p.maxAmount,
      p.deadline,
      statusLabels[p.status],
      relevanceLabels[p.relevance],
      p.applicationPeriod,
      p.description,
      p.requirements.join('; '),
      p.url,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `香港教育資助計劃數據庫_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }, [filteredPrograms])

  const getStatusBadgeClass = (status: FundingProgram['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'upcoming':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'closed':
        return 'bg-gray-100 text-gray-500 border-gray-300'
    }
  }

  const getRelevanceBadgeClass = (relevance: FundingProgram['relevance']) => {
    switch (relevance) {
      case 'high':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'low':
        return 'bg-gray-100 text-gray-500 border-gray-300'
    }
  }

  const formatDeadline = (deadline: string) => {
    if (deadline.includes('全年')) return deadline
    const date = new Date(deadline)
    return date.toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <SortAsc className="h-3.5 w-3.5" />
        ) : (
          <SortDesc className="h-3.5 w-3.5" />
        )
      ) : (
        <SortAsc className="h-3.5 w-3.5 opacity-30" />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 via-orange-500 to-purple-500" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回儀表板
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-sm">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <h1 className="text-lg font-semibold">資助計劃數據庫</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                匯出 ({filteredPrograms.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:px-8">
        {/* Filters Panel */}
        <Card className="border-border/50 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                篩選條件
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-muted-foreground"
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  清除全部
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜尋計劃名稱、機構、描述..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/50"
              />
            </div>

            {/* Filter Options */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  計劃類別
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedCategories.includes(key)
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'hover:bg-muted'
                      )}
                      onClick={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(key)
                            ? prev.filter((c) => c !== key)
                            : [...prev, key]
                        )
                      }
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  申請狀態
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedStatuses.includes(key)
                          ? getStatusBadgeClass(key as FundingProgram['status'])
                          : 'hover:bg-muted'
                      )}
                      onClick={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(key)
                            ? prev.filter((s) => s !== key)
                            : [...prev, key]
                        )
                      }
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Relevance Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  相關程度
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(relevanceLabels).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedRelevance.includes(key)
                          ? getRelevanceBadgeClass(
                              key as FundingProgram['relevance']
                            )
                          : 'hover:bg-muted'
                      )}
                      onClick={() =>
                        setSelectedRelevance((prev) =>
                          prev.includes(key)
                            ? prev.filter((r) => r !== key)
                            : [...prev, key]
                        )
                      }
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Source Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  資助來源
                </label>
                <Select
                  value={selectedSources.length === 1 ? selectedSources[0] : ''}
                  onValueChange={(value) =>
                    setSelectedSources(value ? [value] : [])
                  }
                >
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue placeholder="���有來源" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">所有來源</SelectItem>
                    {fundingSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={showBookmarkedOnly}
                  onCheckedChange={(checked) =>
                    setShowBookmarkedOnly(checked === true)
                  }
                />
                <span className="text-sm">只顯示已收藏</span>
              </label>
              <span className="text-sm text-muted-foreground">
                |
              </span>
              <span className="text-sm text-muted-foreground">
                找到 {filteredPrograms.length} 個計劃
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-10" />
                <TableHead className="min-w-[250px]">
                  <SortButton field="name">計劃名稱</SortButton>
                </TableHead>
                <TableHead>資助機構</TableHead>
                <TableHead>類別</TableHead>
                <TableHead>最高資助</TableHead>
                <TableHead>
                  <SortButton field="deadline">截止日期</SortButton>
                </TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>
                  <SortButton field="relevance">相關性</SortButton>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id} className="group hover:bg-muted/30">
                  <TableCell>
                    <button
                      onClick={() => toggleBookmark(program.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <Bookmark
                        className={cn(
                          'h-4 w-4',
                          bookmarkedIds.has(program.id)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2">
                      {program.relevance === 'high' && (
                        <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      )}
                      <span className="line-clamp-2">{program.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{program.organization}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[program.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {program.maxAmount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDeadline(program.deadline)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getStatusBadgeClass(program.status))}
                    >
                      {statusLabels[program.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        getRelevanceBadgeClass(program.relevance)
                      )}
                    >
                      {relevanceLabels[program.relevance]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {program.relevance === 'high' && (
                                <Star className="h-5 w-5 text-primary" />
                              )}
                              {program.name}
                            </DialogTitle>
                            <DialogDescription>
                              {program.organization}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">計劃簡介</h4>
                              <p className="text-sm text-muted-foreground">
                                {program.description}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  最高資助金額
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {program.maxAmount}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">申請期間</h4>
                                <p className="text-sm text-muted-foreground">
                                  {program.applicationPeriod}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">申請要求</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {program.requirements.map((req, i) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Badge
                                variant="outline"
                                className={getStatusBadgeClass(program.status)}
                              >
                                {statusLabels[program.status]}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getRelevanceBadgeClass(program.relevance)}
                              >
                                {relevanceLabels[program.relevance]}
                              </Badge>
                              <Badge variant="outline">
                                {categoryLabels[program.category]}
                              </Badge>
                            </div>
                            <div className="flex justify-end pt-2">
                              <Button asChild>
                                <a
                                  href={program.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  前往官網申請
                                </a>
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">沒有找到符合條件的計劃</p>
            <p className="text-sm mt-1">請嘗試調整篩選條件</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              清除篩選條件
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
