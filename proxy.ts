import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = ['/', '/moments', '/gallery', '/diary', '/apology', '/chat']
const authRoutes = ['/login']

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = authRoutes.includes(pathname)

  const cookie = req.cookies.get('session')?.value
  let session = null
  
  if (cookie) {
    try {
      session = await decrypt(cookie)
      console.log('Proxy Session:', session)
    } catch (err: any) {
      console.log('Proxy Decrypt Error:', err.message)
      const res = NextResponse.redirect(new URL('/login', req.nextUrl))
      res.cookies.delete('session')
      return res
    }
  }

  console.log('Proxy Navigation:', { pathname, isProtectedRoute, hasSession: !!session })

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
