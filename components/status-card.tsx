'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatusCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  colorScheme?: 'blue' | 'teal' | 'orange' | 'purple' | 'green' | 'coral'
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500 text-white',
    accent: 'text-blue-600',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-500 text-white',
    accent: 'text-teal-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500 text-white',
    accent: 'text-orange-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500 text-white',
    accent: 'text-purple-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500 text-white',
    accent: 'text-green-600',
  },
  coral: {
    bg: 'bg-red-50',
    icon: 'bg-red-400 text-white',
    accent: 'text-red-500',
  },
}

export function StatusCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  colorScheme = 'blue',
}: StatusCardProps) {
  const colors = colorSchemes[colorScheme]
  
  return (
    <Card className={cn('border-border/50 card-hover overflow-hidden', className)}>
      <div className={cn('absolute top-0 left-0 right-0 h-1', colors.icon.replace('text-white', ''))} />
      <CardContent className="pt-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className={cn('text-3xl font-bold tracking-tight', colors.accent)}>{value}</span>
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
            {trend && trendValue && (
              <div className="mt-1 flex items-center gap-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend === 'up' && 'text-green-600',
                    trend === 'down' && 'text-destructive',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {trend === 'up' && '+'}
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn('rounded-xl p-3 shadow-sm', colors.icon)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
