import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ChatRequest, WebhookRequest, WebhookResponse } from '../../types';
import { supabase } from '~/lib/supabase/server';
import { extractClientIP } from '~/lib/utils/ip-extractor';

// n8n webhook URL - kept secure on the server side
const WEBHOOK_URL = 'https://aiemma.app.n8n.cloud/webhook/c28d9d44-31c6-47f5-8226-52a669e42fcd';
// const WEBHOOK_URL = 'https://aiemma.app.n8n.cloud/webhook-test/c28d9d44-31c6-47f5-8226-52a669e42fcd'

/**
 * POST /api/chat
 * 
 * Handles chat requests from the frontend and forwards them to the n8n webhook.
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

    // Get current user from session
    const { data: { user } } = await supabase.auth.getUser();

    const clientIP = extractClientIP(request);
    const sessionId = body.sessionId;
    const fingerprint = body.fingerprint;

    // Update/create session with user_id
    if (sessionId) {
      await supabase.from('chat_sessions').upsert({
        session_id: sessionId,
        user_id: user?.id ?? null,
        ip_address: clientIP,
        fingerprint: fingerprint,
        last_seen: new Date().toISOString(),
      }, { onConflict: 'session_id' });

      // Increment message count
      await supabase.rpc('increment_message_count', { p_session_id: sessionId });

      // Store user message
      await supabase.from('chat_history').insert({
        session_id: sessionId,
        role: 'user',
        content: body.message,
      });
    }

    // Transform the chat request into the webhook format
    const payload: WebhookRequest = {
      query: body.message,
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      fingerprint: fingerprint,
    };

    // Forward the request to the n8n webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Check if the webhook request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error response:', errorText);
      
      // Try to parse the error response for better error messages
      let errorMessage = `Webhook error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText) as { message?: string; hint?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
          if (errorData.hint) {
            errorMessage += ` (${errorData.hint})`;
          }
        }
      } catch {
        // If parsing fails, use the raw error text
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Parse the webhook response
    const data = await response.json() as WebhookResponse;
    console.log('Received from n8n:', data); // Debug log to see actual response structure

    // Extract the reply - handles both object and string responses
    const reply = data.answer
      ?? data.response
      ?? data.message
      ?? data.output
      ?? (typeof data === 'string' ? data : null)
      ?? 'No response from assistant';

    // Store assistant message
    if (sessionId) {
      await supabase.from('chat_history').insert({
        session_id: sessionId,
        role: 'assistant',
        content: reply,
      });
    }

    // Return the assistant's response to the frontend
    return NextResponse.json({
      reply: reply,
      metadata: data.metadata ?? null,
      sessionId: sessionId,
    });
  } catch (error) {
    // Log the error for debugging
    console.error('API Route Error:', error);
    
    // Extract error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    
    // Return a more informative error message to the frontend
    return NextResponse.json(
      { error: errorMessage },
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