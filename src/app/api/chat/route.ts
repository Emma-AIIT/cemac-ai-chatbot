import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ChatRequest, WebhookRequest, WebhookResponse } from '../../types';

// Make.com webhook URL - kept secure on the server side
const WEBHOOK_URL = 'https://hook.eu2.make.com/mlpiaiem1p5jzgkl89amtg08657yn74g';

/**
 * POST /api/chat
 * 
 * Handles chat requests from the frontend and forwards them to the Make.com webhook.
 * This keeps the webhook URL secure on the server side and provides a clean API interface.
 * 
 * @param request - Next.js request object containing the chat message
 * @returns JSON response with the AI assistant's reply or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await request.json() as ChatRequest;
    
    // Validate that a message was provided
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Transform the chat request into the webhook format
    const payload: WebhookRequest = {
      query: body.message,
      timestamp: new Date().toISOString()
    };

    // Forward the request to the Make.com webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if the webhook request was successful
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    // Parse the webhook response
    const data = await response.json() as WebhookResponse;

    // Return the assistant's response to the frontend
    return NextResponse.json({
      reply: data.answer ?? data.response ?? data.message ?? 'No response from assistant',
    });
  } catch (error) {
    // Log the error for debugging
    console.error('API Route Error:', error);
    
    // Return a generic error message to the frontend
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/chat
 * 
 * Handles CORS preflight requests for cross-origin requests.
 * This is optional but recommended for better browser compatibility.
 * 
 * @returns CORS headers for preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}