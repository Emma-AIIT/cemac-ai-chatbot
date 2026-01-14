import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json();

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Secret key is required' },
        { status: 400 }
      );
    }

    // Verify the secret key
    if (secretKey !== env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 401 }
      );
    }

    // Create response with secure cookie
    const response = NextResponse.json({ success: true });

    // Set admin authentication cookie
    response.cookies.set('admin_key', secretKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
