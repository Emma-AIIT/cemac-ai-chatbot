import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '~/env';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminKey = request.cookies.get('admin_key')?.value;
    if (!adminKey || adminKey !== env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch chat sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_seen', { ascending: false });

    if (sessionsError) throw sessionsError;

    // Fetch user profiles for sessions that have user_id
    type SessionWithUserId = { user_id: string | null };
    const userIds = (sessions as SessionWithUserId[])
      ?.filter((s): s is SessionWithUserId & { user_id: string } => !!s.user_id)
      .map(s => s.user_id) ?? [];

    type UserProfile = { id: string; email: string };
    const userProfiles: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, email')
        .in('id', userIds);

      if (profiles) {
        for (const profile of profiles as UserProfile[]) {
          userProfiles[profile.id] = profile.email;
        }
      }
    }

    // Combine sessions with user emails
    type Session = { user_id?: string | null };
    const enrichedSessions = sessions?.map((session: Session) => ({
      ...session,
      user_email: session.user_id ? (userProfiles[session.user_id] ?? null) : null,
    })) ?? [];

    return NextResponse.json(enrichedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
