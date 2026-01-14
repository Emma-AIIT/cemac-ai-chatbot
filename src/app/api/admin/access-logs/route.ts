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

    // Fetch access logs (limit to last 1000 for performance)
    const { data, error } = await supabase
      .from('access_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching access logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access logs' },
      { status: 500 }
    );
  }
}
