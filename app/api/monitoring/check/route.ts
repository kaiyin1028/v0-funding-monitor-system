import { NextResponse } from 'next/server'
import { fundingSources } from '@/lib/funding-data'

// Simulate checking a website's availability
async function checkWebsite(url: string): Promise<{ online: boolean; responseTime: number }> {
  const startTime = Date.now()
  
  try {
    // In production, you would actually fetch the URL
    // For now, we simulate with random success/failure
    const isOnline = Math.random() > 0.1 // 90% success rate
    const responseTime = Math.floor(Math.random() * 500) + 100 // 100-600ms
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50))
    
    return { online: isOnline, responseTime }
  } catch {
    return { online: false, responseTime: Date.now() - startTime }
  }
}

export async function POST() {
  try {
    const results = await Promise.all(
      fundingSources.map(async (source) => {
        const check = await checkWebsite(source.url)
        return {
          sourceId: source.id,
          sourceName: source.name,
          url: source.url,
          status: check.online ? 'online' : 'offline',
          responseTime: check.responseTime,
          checkedAt: new Date().toISOString(),
        }
      })
    )

    const onlineCount = results.filter((r) => r.status === 'online').length
    const avgResponseTime = Math.round(
      results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    )

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          online: onlineCount,
          offline: results.length - onlineCount,
          avgResponseTime,
        },
        checkedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Monitoring check error:', error)
    return NextResponse.json(
      { success: false, error: '監測檢查失敗' },
      { status: 500 }
    )
  }
}
