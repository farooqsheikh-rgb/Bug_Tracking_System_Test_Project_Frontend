import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/projects']
const publicRoutes = ['/signin', '/signup', '/signup/form']

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = req.cookies.get('accessToken')?.value || ''
  console.log("In middleware, token:", token)

  const isProtectedRoute = path.startsWith('/projects')
  const isPublicRoute = publicRoutes.includes(path)

  if (path === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/projects', req.nextUrl))
    } else {
      return NextResponse.redirect(new URL('/signin', req.nextUrl))
    }
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/projects', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/projects/:path*',
    '/signin',
    '/signup',
    '/signup/form',
  ],
}
