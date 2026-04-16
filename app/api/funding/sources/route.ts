import { NextResponse } from 'next/server'
import { fundingSources } from '@/lib/funding-data'

export async function GET() {
  try {
    // Simulate checking source status
    const sourcesWithStatus = fundingSources.map((source) => ({
      ...source,
      lastChecked: new Date().toISOString(),
    }))

    const onlineCount = sourcesWithStatus.filter((s) => s.status === 'online').length
    const offlineCount = sourcesWithStatus.filter((s) => s.status === 'offline').length

    return NextResponse.json({
      success: true,
      data: sourcesWithStatus,
      summary: {
        total: sourcesWithStatus.length,
        online: onlineCount,
        offline: offlineCount,
      },
    })
  } catch (error) {
    console.error('Fetch sources error:', error)
    return NextResponse.json(
      { success: false, error: '獲取監測來源失敗' },
      { status: 500 }
    )
  }
}
