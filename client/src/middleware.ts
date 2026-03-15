import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'physiofi_token'

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Never run auth logic for Next.js internals or static assets
    if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // Route authentication: protect dashboard routes (allow /admin/login for staff)
    const isPatient = pathname.startsWith('/patient')
    const isDoctor = pathname.startsWith('/doctor')
    const isAdmin = pathname.startsWith('/admin')
    const isAdminLogin = pathname === '/admin/login'
    const isProtected = (isPatient || isDoctor || isAdmin) && !isAdminLogin

    const token = request.cookies.get(AUTH_COOKIE)?.value

    // Logged-in users hitting / or /login go to dashboard (role redirect happens client-side)
    if (pathname === '/' || pathname === '/login') {
      if (token && token.trim()) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }

    if (isProtected) {
      if (!token || !token.trim()) {
        const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/login'
        const loginUrl = new URL(loginPath, request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    const response = NextResponse.next()

    // Caching for static assets
    if (pathname.startsWith('/_next/static')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return response
  } catch (err) {
    console.error('Middleware error:', err)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|Physiofi|images|videos|manifest.json).*)'],
}
