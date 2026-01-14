import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Verify admin authentication helper
function verifyAdmin(request: NextRequest): boolean {
  const adminKey = request.cookies.get('admin_key')?.value;
  return adminKey === env.ADMIN_SECRET_KEY;
}

// GET - Fetch all whitelisted IPs
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ip_whitelist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching IP whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IP whitelist' },
      { status: 500 }
    );
  }
}

// POST - Add new IP to whitelist
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ip_address, description } = await request.json();

    if (!ip_address) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    // Check if IP already exists
    const { data: existing } = await supabase
      .from('ip_whitelist')
      .select('*')
      .eq('ip_address', ip_address)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'IP address already exists in whitelist' },
        { status: 400 }
      );
    }

    // Insert new IP
    const { data, error } = await supabase
      .from('ip_whitelist')
      .insert({
        ip_address,
        description: description || null,
        added_by: 'admin',
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error adding IP to whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to add IP to whitelist' },
      { status: 500 }
    );
  }
}

// PATCH - Update IP status (activate/deactivate)
export async function PATCH(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, is_active } = await request.json();

    if (!id || is_active === undefined) {
      return NextResponse.json(
        { error: 'ID and is_active are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ip_whitelist')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating IP:', error);
    return NextResponse.json(
      { error: 'Failed to update IP' },
      { status: 500 }
    );
  }
}

// DELETE - Remove IP from whitelist
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('ip_whitelist')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting IP:', error);
    return NextResponse.json(
      { error: 'Failed to delete IP' },
      { status: 500 }
    );
  }
}
