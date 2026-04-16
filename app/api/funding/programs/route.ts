import { NextRequest, NextResponse } from 'next/server'
import { fundingPrograms } from '@/lib/funding-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const relevance = searchParams.get('relevance')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'deadline'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Filter programs
    let filtered = [...fundingPrograms]

    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status)
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (relevance && relevance !== 'all') {
      filtered = filtered.filter((p) => p.relevance === relevance)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.organization.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    // Sort programs
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'deadline':
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          break
        case 'name':
          comparison = a.name.localeCompare(b.name, 'zh-HK')
          break
        case 'relevance':
          const relevanceOrder = { high: 0, medium: 1, low: 2 }
          comparison = relevanceOrder[a.relevance] - relevanceOrder[b.relevance]
          break
        case 'status':
          const statusOrder = { open: 0, upcoming: 1, closed: 2 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
        default:
          comparison = 0
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    // Paginate
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Fetch programs error:', error)
    return NextResponse.json(
      { success: false, error: '獲取資助計劃失敗' },
      { status: 500 }
    )
  }
}
