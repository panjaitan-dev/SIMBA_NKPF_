import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isNasabahRoute = pathname.startsWith('/nasabah')
  const isPetugasRoute = pathname.startsWith('/petugas')

  if (!isAdminRoute && !isNasabahRoute && !isPetugasRoute) {
    return NextResponse.next()
  }

  // 1. Cek Token Autentikasi di Cookie
  const token =
    request.cookies.get('simba_token')?.value ||
    request.cookies.get('sb-access-token')?.value

  // Jika belum login, redirect ke /login dengan parameter redirect
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Cek Role Pengguna
  const userRole = request.cookies.get('simba_role')?.value || ''

  // 3. Otorisasi Berdasarkan Role:
  // - /admin/klh: Role 'admin' atau 'admin_klh'
  // - /admin/*: Khusus Role 'admin'
  // - /nasabah/*: Role 'nasabah' atau 'admin'
  // - /petugas/*: Role 'petugas' atau 'admin'
  if (pathname.startsWith('/admin/klh')) {
    if (userRole !== 'admin' && userRole !== 'admin_klh') {
      const url = new URL('/403', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('required', 'admin/admin_klh')
      return NextResponse.rewrite(url, { status: 403 })
    }
  } else if (isAdminRoute) {
    if (userRole !== 'admin' && userRole !== 'admin_klh') {
      const url = new URL('/403', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('required', 'admin')
      return NextResponse.rewrite(url, { status: 403 })
    }
  } else if (isNasabahRoute) {
    if (userRole !== 'nasabah' && userRole !== 'admin') {
      const url = new URL('/403', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('required', 'nasabah')
      return NextResponse.rewrite(url, { status: 403 })
    }
  } else if (isPetugasRoute) {
    if (userRole !== 'petugas' && userRole !== 'admin') {
      const url = new URL('/403', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('required', 'petugas')
      return NextResponse.rewrite(url, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/nasabah/:path*', '/petugas/:path*'],
}
