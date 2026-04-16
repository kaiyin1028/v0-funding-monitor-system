'use client'

import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroBannerProps {
  onScrollToContent?: () => void
}

export function HeroBanner({ onScrollToContent }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card mb-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-50" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      
      {/* Content */}
      <div className="relative flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8">
        {/* Text Content */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>智能監測系統</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-balance">
            掌握每一個
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
              {' '}資助機會
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg">
            實時監測香港政府及基金會資助計劃，自動分析適合度，
            讓您的非牟利機構不再錯過任何申請機會。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={onScrollToContent} className="gradient-blue text-white border-0">
              瀏覽資助計劃
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              了解更多
            </Button>
          </div>
        </div>
        
        {/* Image */}
        <div className="relative w-full lg:w-80 h-48 lg:h-56 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/funding-hero.jpg"
            alt="香港教育資助"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
    </div>
  )
}
