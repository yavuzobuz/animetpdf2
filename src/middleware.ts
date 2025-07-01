
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LANGUAGES = ['tr', 'en'];
const DEFAULT_LANGUAGE = 'tr';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLang = SUPPORTED_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLang) {
    // If the path already has a supported language, do nothing.
    // Potentially, store the current language in a cookie if needed for other parts.
    const currentLang = pathname.split('/')[1];
    if (SUPPORTED_LANGUAGES.includes(currentLang)) {
      const response = NextResponse.next();
      response.cookies.set('NEXT_LOCALE', currentLang, { path: '/' });
      return response;
    }
  }

  // Redirect if there is no language prefix
  const lang = request.cookies.get('NEXT_LOCALE')?.value || DEFAULT_LANGUAGE;
  
  request.nextUrl.pathname = `/${lang}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|images|fonts|favicon.ico).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
