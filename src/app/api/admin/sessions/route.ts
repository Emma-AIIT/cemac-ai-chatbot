import { NextRequest, NextResponse } from 'next/server';
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
    const userIds = sessions
      ?.filter(s => s.user_id)
      .map(s => s.user_id) || [];

    let userProfiles: any = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, email')
        .in('id', userIds);

      if (profiles) {
        userProfiles = profiles.reduce((acc: any, profile: any) => {
          acc[profile.id] = profile.email;
          return acc;
        }, {});
      }
    }

    // Combine sessions with user emails
    const enrichedSessions = sessions?.map((session: any) => ({
      ...session,
      user_email: session.user_id ? userProfiles[session.user_id] || null : null,
    })) || [];

    return NextResponse.json(enrichedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
