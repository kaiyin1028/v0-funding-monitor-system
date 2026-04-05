'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  ExternalLink,
  Search,
  Download,
  Star,
  Calendar,
  Building2,
  ArrowUpDown,
} from 'lucide-react'
import {
  FundingProgram,
  categoryLabels,
  statusLabels,
  relevanceLabels,
} from '@/lib/funding-data'
import { cn } from '@/lib/utils'

interface FundingTableProps {
  programs: FundingProgram[]
  onExport?: () => void
}

export function FundingTable({ programs, onExport }: FundingTableProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [relevanceFilter, setRelevanceFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<'deadline' | 'priority'>('priority')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((program) => {
        const matchesSearch =
          search === '' ||
          program.name.toLowerCase().includes(search.toLowerCase()) ||
          program.organization.toLowerCase().includes(search.toLowerCase()) ||
          program.description.toLowerCase().includes(search.toLowerCase())

        const matchesCategory =
          categoryFilter === 'all' || program.category === categoryFilter
        const matchesStatus =
          statusFilter === 'all' || program.status === statusFilter
        const matchesRelevance =
          relevanceFilter === 'all' || program.relevance === relevanceFilter

        return (
          matchesSearch && matchesCategory && matchesStatus && matchesRelevance
        )
      })
      .sort((a, b) => {
        if (sortField === 'deadline') {
          const dateA = new Date(a.deadline).getTime()
          const dateB = new Date(b.deadline).getTime()
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        }
        return sortDirection === 'asc'
          ? a.priority - b.priority
          : b.priority - a.priority
      })
  }, [
    programs,
    search,
    categoryFilter,
    statusFilter,
    relevanceFilter,
    sortField,
    sortDirection,
  ])

  const toggleSort = (field: 'deadline' | 'priority') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getStatusBadgeClass = (status: FundingProgram['status']) => {
    switch (status) {
      case 'open':
        return 'bg-success/20 text-success hover:bg-success/30 border-success/30'
      case 'upcoming':
        return 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/30'
      case 'closed':
        return 'bg-muted text-muted-foreground hover:bg-muted border-muted'
      default:
        return ''
    }
  }

  const getRelevanceBadgeClass = (relevance: FundingProgram['relevance']) => {
    switch (relevance) {
      case 'high':
        return 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/30'
      case 'medium':
        return 'bg-info/20 text-info hover:bg-info/30 border-info/30'
      case 'low':
        return 'bg-muted text-muted-foreground hover:bg-muted border-muted'
      default:
        return ''
    }
  }

  const formatDeadline = (deadline: string) => {
    if (deadline.includes('全年')) return deadline
    const date = new Date(deadline)
    return date.toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    if (deadline.includes('全年')) return null
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋計劃名稱、機構..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-border/50"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-border/50">
            <SelectValue placeholder="類別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有類別</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-border/50">
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有狀態</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={relevanceFilter} onValueChange={setRelevanceFilter}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-border/50">
            <SelectValue placeholder="相關性" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有程度</SelectItem>
            {Object.entries(relevanceLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="ml-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          匯出 Excel
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        找到 {filteredPrograms.length} 個資助計劃
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[280px]">計劃名稱</TableHead>
              <TableHead>資助機構</TableHead>
              <TableHead>類別</TableHead>
              <TableHead>最高資助</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('deadline')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  截止日期
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('priority')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  相關性
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrograms.map((program) => {
              const daysLeft = getDaysUntilDeadline(program.deadline)
              const isUrgent =
                daysLeft !== null && daysLeft > 0 && daysLeft <= 30

              return (
                <TableRow
                  key={program.id}
                  className="group hover:bg-muted/30"
                >
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
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
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
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDeadline(program.deadline)}
                        </span>
                      </div>
                      {isUrgent && (
                        <span className="text-xs text-destructive">
                          剩餘 {daysLeft} 天
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        getStatusBadgeClass(program.status)
                      )}
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
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            詳情
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg">
                              {program.relevance === 'high' && (
                                <Star className="h-5 w-5 text-primary" />
                              )}
                              {program.name}
                            </DialogTitle>
                            <DialogDescription>
                              {program.organization}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                計劃簡介
                              </h4>
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
                                <h4 className="text-sm font-medium mb-1">
                                  申請期間
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {program.applicationPeriod}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                申請要求
                              </h4>
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
                                className={getRelevanceBadgeClass(
                                  program.relevance
                                )}
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
