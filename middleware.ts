import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve user role from cookie (defaults to CUSTOMER if not set)
  const roleCookie = request.cookies.get('user_role')?.value || 'CUSTOMER';

  // 1. Admin Protection (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (roleCookie !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('required_role', 'ADMIN');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Vendor Protection (/vendor/*)
  if (pathname.startsWith('/vendor')) {
    const isVendor = ['VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN', 'ADMIN'].includes(roleCookie);
    if (!isVendor) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('required_role', 'VENDOR');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Mitra IRT Protection (/mitra/*)
  if (pathname.startsWith('/mitra')) {
    const isMitra = ['MITRA_IRT', 'ADMIN'].includes(roleCookie);
    if (!isMitra) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('required_role', 'MITRA_IRT');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/mitra/:path*'],
};
