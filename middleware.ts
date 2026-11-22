import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve user role from cookie (defaults to CUSTOMER if not set)
  const roleCookie = request.cookies.get('user_role')?.value || 'CUSTOMER';

  // 1. Admin Protection (/admin/*)
  if (pathname.startsWith('/admin')) {
    // Pintu masuk /admin/login dibebaskan dari redirect loop
    if (pathname === '/admin/login') {
      // Jika sudah login sebagai ADMIN, redirect langsung ke dashboard produk
      if (roleCookie === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/produk', request.url));
      }
      return NextResponse.next();
    }

    // Akses dashboard internal mewajibkan peran ADMIN
    if (roleCookie !== 'ADMIN') {
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 2. Vendor Protection (/vendor/*)
  if (pathname.startsWith('/vendor')) {
    const isVendor = ['VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN', 'ADMIN'].includes(roleCookie);
    if (!isVendor) {
      const loginUrl = new URL('/admin/login', request.url);
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
