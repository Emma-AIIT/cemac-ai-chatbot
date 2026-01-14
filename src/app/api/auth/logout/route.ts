import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '~/env';

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(_name: string, _value: string, _options?: { path?: string; domain?: string; maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' }) {
            // Not used
          },
          remove(_name: string, _options?: { path?: string; domain?: string }) {
            // Not used
          },
        },
    }
  );

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/login', request.url));
}
