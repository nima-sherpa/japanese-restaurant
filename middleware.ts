import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth?: any }) {
    // Check if user is accessing admin routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // withAuth will handle redirecting to login if not authenticated
      return NextResponse.next()
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'],
}
