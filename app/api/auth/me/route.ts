import { NextRequest, NextResponse } from 'next/server'

// Mock user for development
const MOCK_USER = {
  id: '1',
  email: 'admin@hkeeia.org',
  name: '管理員',
  role: 'admin' as const,
  organization: '香港教育裝備行業協會',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登入' },
        { status: 401 }
      )
    }

    // In production, verify the token and fetch user from database
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      if (decoded.exp < Date.now()) {
        return NextResponse.json(
          { success: false, error: '登入已過期' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        data: MOCK_USER,
      })
    } catch {
      return NextResponse.json(
        { success: false, error: '無效的登入令牌' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: '驗證失敗' },
      { status: 500 }
    )
  }
}
