import { NextRequest, NextResponse } from 'next/server'

// Mock user for development
const MOCK_USER = {
  id: '1',
  email: 'admin@hkeeia.org',
  name: '管理員',
  role: 'admin' as const,
  organization: '香港教育裝備行業協會',
}

// In production, this would verify against a database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '請填寫電郵和密碼' },
        { status: 400 }
      )
    }

    // Mock authentication - in production, verify against database
    if (email === 'admin@hkeeia.org' && password === 'admin123') {
      // Generate mock token
      const token = Buffer.from(
        JSON.stringify({ userId: MOCK_USER.id, exp: Date.now() + 24 * 60 * 60 * 1000 })
      ).toString('base64')

      const response = NextResponse.json({
        success: true,
        data: {
          user: MOCK_USER,
          token,
        },
      })

      // Set HTTP-only cookie for security
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: '電郵或密碼錯誤' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: '登入失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
