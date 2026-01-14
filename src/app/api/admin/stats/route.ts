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

    // Fetch all stats in parallel
    const [
      usersResult,
      whitelistResult,
      accessLogsResult,
      grantedAccessResult,
      deniedAccessResult,
      sessionsResult,
      messagesResult,
    ] = await Promise.all([
      // Total users
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      // Active whitelisted IPs
      supabase.from('ip_whitelist').select('*', { count: 'exact', head: true }).eq('is_active', true),
      // Total access logs
      supabase.from('access_logs').select('*', { count: 'exact', head: true }),
      // Granted access count
      supabase.from('access_logs').select('*', { count: 'exact', head: true }).eq('access_granted', true),
      // Denied access count
      supabase.from('access_logs').select('*', { count: 'exact', head: true }).eq('access_granted', false),
      // Active sessions
      supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('is_active', true),
      // Total messages across all sessions
      supabase.from('chat_sessions').select('message_count'),
    ]);

    // Count active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsersResult = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', thirtyDaysAgo.toISOString());

    // Calculate total messages
    type SessionWithCount = { message_count?: number | null };
    const totalMessages = messagesResult.data?.reduce((sum: number, session: SessionWithCount) => sum + (session.message_count ?? 0), 0) ?? 0;

    const stats = {
      totalUsers: usersResult.count ?? 0,
      activeUsers: activeUsersResult.count ?? 0,
      whitelistedIPs: whitelistResult.count ?? 0,
      totalAccessLogs: accessLogsResult.count ?? 0,
      grantedAccess: grantedAccessResult.count ?? 0,
      deniedAccess: deniedAccessResult.count ?? 0,
      activeSessions: sessionsResult.count ?? 0,
      totalMessages,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
