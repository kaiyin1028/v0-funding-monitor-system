import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for development (use database in production)
const userFavorites = new Map<string, Set<string>>()

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登入' },
        { status: 401 }
      )
    }

    // Get user ID from token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const userId = decoded.userId

    const favorites = userFavorites.get(userId) || new Set()

    return NextResponse.json({
      success: true,
      data: Array.from(favorites),
    })
  } catch (error) {
    console.error('Fetch favorites error:', error)
    return NextResponse.json(
      { success: false, error: '獲取收藏失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登入' },
        { status: 401 }
      )
    }

    const { programId } = await request.json()
    
    if (!programId) {
      return NextResponse.json(
        { success: false, error: '缺少計劃ID' },
        { status: 400 }
      )
    }

    // Get user ID from token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const userId = decoded.userId

    if (!userFavorites.has(userId)) {
      userFavorites.set(userId, new Set())
    }

    userFavorites.get(userId)!.add(programId)

    return NextResponse.json({
      success: true,
      message: '已加入收藏',
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { success: false, error: '加入收藏失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登入' },
        { status: 401 }
      )
    }

    const { programId } = await request.json()
    
    if (!programId) {
      return NextResponse.json(
        { success: false, error: '缺少計劃ID' },
        { status: 400 }
      )
    }

    // Get user ID from token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const userId = decoded.userId

    if (userFavorites.has(userId)) {
      userFavorites.get(userId)!.delete(programId)
    }

    return NextResponse.json({
      success: true,
      message: '已取消收藏',
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { success: false, error: '取消收藏失敗' },
      { status: 500 }
    )
  }
}
