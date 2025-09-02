import { NextRequest, NextResponse } from 'next/server'
 
const protectedRoutes = ['/projects']
const publicRoutes = ['/signin', '/signup', '/signup/form']
 
export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const token = req.cookies.get('accessToken')?.value || '';
  console.log("In middleware: "+token);
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }
 
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/projects', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/projects', '/signin', '/signup/:path*'],
}