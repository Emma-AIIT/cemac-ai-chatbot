import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { extractClientIP, isLocalIP } from './lib/utils/ip-extractor';
import { parseUserAgent } from './lib/utils/device-detection';
import { env } from '~/env';

const PUBLIC_PATHS = ['/access-denied', '/login', '/signup', '/api/auth', '/api/admin', '/_next', '/favicon.ico'];
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return response;
  }

  const clientIP = extractClientIP(request);

  // Allow localhost in development
  if (process.env.NODE_ENV === 'development' && isLocalIP(clientIP)) {
    return response;
  }

  // LAYER 1: Check IP whitelist
  const { data: whitelistedIP } = await supabase
    .from('ip_whitelist')
    .select('ip_address')
    .eq('ip_address', clientIP)
    .eq('is_active', true)
    .single();

  const isWhitelisted = !!whitelistedIP;

  // Log access attempt
  const userAgent = request.headers.get('user-agent') ?? '';
  const deviceInfo = parseUserAgent(userAgent);

  await supabase.from('access_logs').insert({
    ip_address: clientIP,
    access_granted: isWhitelisted,
    user_agent: userAgent,
    browser_name: deviceInfo.browser_name,
    browser_version: deviceInfo.browser_version,
    os_name: deviceInfo.os_name,
    device_type: deviceInfo.device_type,
    path: pathname,
  });

  // Block if IP not whitelisted
  if (!isWhitelisted) {
    const blockResponse = NextResponse.redirect(new URL('/access-denied', request.url));
    blockResponse.cookies.set('blocked_ip', clientIP, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600
    });
    return blockResponse;
  }

  // LAYER 2: Check authentication
  const { data: { session } } = await supabase.auth.getSession();

  // If not authenticated, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin path protection (additional check)
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    const adminKey = request.cookies.get('admin_key')?.value;
    if (!adminKey || adminKey !== env.ADMIN_SECRET_KEY) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
