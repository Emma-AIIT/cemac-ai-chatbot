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

    // Fetch all users with their profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
