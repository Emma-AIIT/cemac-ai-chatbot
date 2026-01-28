import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ChatRequest, WebhookRequest, WebhookResponse } from '../../types';
import { createSupabaseServerClient } from '~/lib/supabase/server';
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

    // Get current user from session using cookie-aware client
    const supabase = await createSupabaseServerClient();
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

    // Get raw response text first to log exact content before parsing
    const responseText = await response.text();
    console.log('Raw response from n8n:', responseText);
    
    // Check for URLs in raw response
    if (responseText.includes('dropbox.com') && responseText.includes('rlkey=')) {
      const urlRegex = /https?:\/\/[^\s\)"]+dropbox\.com[^\s\)"]+/g;
      const urls = responseText.match(urlRegex);
      if (urls) {
        urls.forEach(url => {
          const rlkeyMatch = /rlkey=([^&]+)/.exec(url);
          if (rlkeyMatch) {
            console.log(`[API Route] Dropbox URL in raw response: ${url}`);
            console.log(`[API Route] rlkey in raw response: ${rlkeyMatch[1]}`);
          }
        });
      }
    }

    // Parse the webhook response
    const data = JSON.parse(responseText) as WebhookResponse;
    console.log('Parsed response from n8n:', data); // Debug log to see actual response structure

    // Extract the reply - handles both object and string responses
    const reply = data.answer
      ?? data.response
      ?? data.message
      ?? data.output
      ?? (typeof data === 'string' ? data : null)
      ?? 'No response from assistant';

    // Log URLs found in the reply to help debug URL mismatches
    if (reply && typeof reply === 'string') {
      const urlRegex = /https?:\/\/[^\s\)]+/g;
      const urls = reply.match(urlRegex);
      if (urls) {
        console.log('URLs found in n8n response:', urls);
        // Specifically log Dropbox URLs to track rlkey changes
        urls.forEach(url => {
          if (url.includes('dropbox.com') && url.includes('rlkey=')) {
            const rlkeyMatch = /rlkey=([^&]+)/.exec(url);
            if (rlkeyMatch) {
              console.log(`Dropbox URL detected with rlkey: ${rlkeyMatch[1]}`);
            }
          }
        });
      }
    }

    // Store assistant message
    if (sessionId) {
      await supabase.from('chat_history').insert({
        session_id: sessionId,
        role: 'assistant',
        content: reply,
      });
    }

    // Log the final reply being sent to frontend
    if (reply && typeof reply === 'string' && reply.includes('dropbox.com')) {
      const urlRegex = /https?:\/\/[^\s\)]+/g;
      const urls = reply.match(urlRegex);
      if (urls) {
        urls.forEach(url => {
          if (url.includes('rlkey=')) {
            const rlkeyMatch = /rlkey=([^&]+)/.exec(url);
            if (rlkeyMatch) {
              console.log(`[API Route] Final reply URL being sent to frontend: ${url}`);
              console.log(`[API Route] rlkey in final reply: ${rlkeyMatch[1]}`);
            }
          }
        });
      }
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