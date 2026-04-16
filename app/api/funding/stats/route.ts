import { NextResponse } from 'next/server'
import { fundingPrograms, fundingSources } from '@/lib/funding-data'

export async function GET() {
  try {
    const now = new Date()
    
    // Calculate statistics
    const openPrograms = fundingPrograms.filter((p) => p.status === 'open')
    const upcomingPrograms = fundingPrograms.filter((p) => p.status === 'upcoming')
    const closedPrograms = fundingPrograms.filter((p) => p.status === 'closed')
    const highRelevance = fundingPrograms.filter((p) => p.relevance === 'high')
    
    // Programs closing within 30 days
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const closingSoon = openPrograms.filter((p) => {
      const deadline = new Date(p.deadline)
      return deadline <= thirtyDaysFromNow
    })

    // Source status
    const onlineSources = fundingSources.filter((s) => s.status === 'online')

    return NextResponse.json({
      success: true,
      data: {
        programs: {
          total: fundingPrograms.length,
          open: openPrograms.length,
          upcoming: upcomingPrograms.length,
          closed: closedPrograms.length,
          highRelevance: highRelevance.length,
          closingSoon: closingSoon.length,
        },
        sources: {
          total: fundingSources.length,
          online: onlineSources.length,
          offline: fundingSources.length - onlineSources.length,
        },
        lastUpdated: now.toISOString(),
      },
    })
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json(
      { success: false, error: '獲取統計數據失敗' },
      { status: 500 }
    )
  }
}
