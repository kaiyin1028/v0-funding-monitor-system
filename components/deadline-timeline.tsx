'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FundingProgram } from '@/src/types'

const statusLabels: Record<string, string> = {
  open: '正在接受申請',
  upcoming: '即將開放',
  closed: '已截止',
}

const relevanceLabels: Record<string, string> = {
  high: '高度相關',
  medium: '中度相關',
  low: '低度相關',
}
import { cn } from '@/lib/utils'
import { CalendarClock, Star, ChevronRight } from 'lucide-react'

interface DeadlineTimelineProps {
  programs: FundingProgram[]
}

export function DeadlineTimeline({ programs }: DeadlineTimelineProps) {
  const now = new Date()
  
  // Group programs by month
  const upcomingPrograms = programs
    .filter((p) => {
      if (p.deadline.includes('全年')) return false
      const deadline = new Date(p.deadline)
      return deadline >= now && p.status !== 'closed'
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 8)

  const groupedByMonth = upcomingPrograms.reduce((acc, program) => {
    const date = new Date(program.deadline)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthLabel = date.toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'long',
    })
    
    if (!acc[monthKey]) {
      acc[monthKey] = { label: monthLabel, programs: [] }
    }
    acc[monthKey].programs.push(program)
    return acc
  }, {} as Record<string, { label: string; programs: FundingProgram[] }>)

  const getDaysUntil = (deadline: string) => {
    const date = new Date(deadline)
    const diffTime = date.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getUrgencyClass = (daysLeft: number) => {
    if (daysLeft <= 14) return 'text-destructive border-destructive/50 bg-destructive/10'
    if (daysLeft <= 30) return 'text-warning border-warning/50 bg-warning/10'
    return 'text-muted-foreground border-border bg-muted/30'
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            即將截止申請
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {Object.entries(groupedByMonth).map(([monthKey, { label, programs: monthPrograms }]) => (
            <div key={monthKey} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex flex-col gap-1.5">
                {monthPrograms.map((program) => {
                  const daysLeft = getDaysUntil(program.deadline)
                  const deadline = new Date(program.deadline)
                  
                  return (
                    <div
                      key={program.id}
                      className="group flex items-center gap-3 rounded-lg border border-transparent bg-muted/30 px-3 py-2 transition-colors hover:border-border hover:bg-muted/50"
                    >
                      <div className={cn(
                        'flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-md border text-xs',
                        getUrgencyClass(daysLeft)
                      )}>
                        <span className="font-bold text-sm">
                          {deadline.getDate()}
                        </span>
                        <span className="text-[10px] opacity-80">
                          {deadline.toLocaleDateString('zh-HK', { weekday: 'short' })}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {program.relevance === 'high' && (
                            <Star className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {program.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {program.organization}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] px-1.5 py-0',
                            program.status === 'open' && 'bg-success/20 text-success border-success/30',
                            program.status === 'upcoming' && 'bg-warning/20 text-warning border-warning/30'
                          )}
                        >
                          {daysLeft <= 0 ? '已截止' : `${daysLeft}天`}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          
          {upcomingPrograms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暫無即將截止的申請</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
