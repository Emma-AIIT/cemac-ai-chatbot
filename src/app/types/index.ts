/**
 * Type definitions for the CEMAC Doors Chatbot application
 * 
 * This file contains all the TypeScript interfaces used throughout the application
 * for type safety and better development experience.
 */

/**
 * Represents a single message in the chat conversation
 */
export interface Message {
    /** The role of the message sender - either 'user' or 'assistant' */
    role: 'user' | 'assistant';
    /** The text content of the message */
    content: string;
    /** Optional timestamp when the message was created */
    timestamp?: Date;
    /** Optional session ID for tracking user interactions */
    sessionId?: string;
}

/**
 * Payload structure for requests sent to the Make.com webhook
 * This is the format expected by the external webhook service
 */
export interface WebhookRequest {
    /** The user's query/question */
    query: string;
    /** ISO timestamp string when the request was made */
    timestamp: string;
    /** Optional session ID for tracking user interactions */
    sessionId?: string;
}

/**
 * Response structure from the Make.com webhook
 * The webhook may return 'answer', 'response', or 'message' field
 */
export interface WebhookResponse {
    answer?: string;
    response?: string;
    message?: string;
    output?: string;
    metadata?: any;
    /** Error message if something went wrong */
    error?: string;
}

/**
 * Request structure for the Next.js API route (/api/chat)
 * This is the simplified format used by the frontend
 */
export interface ChatRequest {
    /** The user's message text */
    message: string;
    /** Optional session ID for tracking user interactions */
    sessionId?: string;
}

/**
 * Response structure from the Next.js API route (/api/chat)
 * This is the standardized format returned to the frontend
 */
export interface ChatResponse {
    /** The AI assistant's reply */
    reply: string;
    /** Error message if the request failed */
    error?: string;
    /** Optional session ID for tracking user interactions */
    sessionId?: string;
}

/**
 * Interface for suggested questions displayed to users
 */
export interface SuggestedQuestion {
    /** The question text to display */
    text: string;
    /** Optional category for grouping questions */
    category?: string;
}