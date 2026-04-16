'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GraduationCap, Target, Calendar, Lightbulb } from 'lucide-react'

const features = [
  {
    title: 'STEM 創科教育',
    description: '支援學校及青年人體驗編程、機械人及人工智能等創科教育項目',
    icon: GraduationCap,
    image: '/images/education-stem.jpg',
    color: 'blue',
    stats: '8+ 相關計劃',
  },
  {
    title: '資助申請追蹤',
    description: '自動監測資助計劃狀態變化，確保不錯過任何申請機會',
    icon: Target,
    image: '/images/funding-growth.jpg',
    color: 'teal',
    stats: '18 監測來源',
  },
  {
    title: '截止日期提醒',
    description: '智能日曆功能，提前通知即將截止的資助計劃申請',
    icon: Calendar,
    image: '/images/deadline-calendar.jpg',
    color: 'orange',
    stats: '自動提醒',
  },
]

const colorStyles: Record<string, { bg: string; icon: string; border: string }> = {
  blue: {
    bg: 'from-blue-50 to-blue-100/50',
    icon: 'bg-blue-500 text-white',
    border: 'border-blue-200',
  },
  teal: {
    bg: 'from-teal-50 to-teal-100/50',
    icon: 'bg-teal-500 text-white',
    border: 'border-teal-200',
  },
  orange: {
    bg: 'from-orange-50 to-orange-100/50',
    icon: 'bg-orange-500 text-white',
    border: 'border-orange-200',
  },
  purple: {
    bg: 'from-purple-50 to-purple-100/50',
    icon: 'bg-purple-500 text-white',
    border: 'border-purple-200',
  },
}

export function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {features.map((feature) => {
        const colors = colorStyles[feature.color]
        const Icon = feature.icon
        
        return (
          <Card 
            key={feature.title} 
            className={cn(
              'overflow-hidden card-hover border',
              colors.border
            )}
          >
            {/* Image Header */}
            <div className="relative h-32 overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className={cn('absolute top-3 left-3 rounded-lg p-2', colors.icon)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs font-medium text-white/80 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {feature.stats}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <CardContent className={cn('p-4 bg-gradient-to-br', colors.bg)}>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
