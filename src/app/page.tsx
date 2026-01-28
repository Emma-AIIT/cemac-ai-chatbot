'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { getOrCreateFingerprint } from '~/lib/utils/fingerprint-client';
// import { SuggestedQuestions } from './components/SuggestedQuestions';
import type { Message, ChatRequest, ChatResponse } from './types';

// Next.js API route endpoint - this keeps the webhook URL secure on the server side
const API_ENDPOINT = '/api/chat';

/**
 * Home Page Component
 * 
 * The main page that orchestrates the CEMAC Doors AI Assistant interface.
 * Manages chat state, API communication, and renders the three main components:
 * ChatHeader, ChatMessage list, and ChatInput.
 */
export default function Home() {
  // State management for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Cemac Doors Ai. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  // State for loading status and component mounting
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [fingerprint, setFingerprint] = useState<string>('');

  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize session ID
  useEffect(() => {
    // Check if session already exists in browser
    let storedSession = localStorage.getItem('cemac_session_id');

    if (!storedSession) {
      // Create new session ID
      storedSession = `cemac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cemac_session_id', storedSession);
    }

    setSessionId(storedSession);
  }, []);

  // Initialize fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await getOrCreateFingerprint();
      setFingerprint(fp);
    };
    void initFingerprint();
  }, []);

  /**
   * Scrolls the chat to the bottom smoothly when new messages are added
   */
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Sends a user message to the API and handles the response
   * @param userMessage - The message text from the user
   */
  const sendMessage = async (userMessage: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Prepare the request payload for the Next.js API route
      const payload: ChatRequest = {
        message: userMessage,
        sessionId: sessionId,
        fingerprint: fingerprint,
      };

      // Call the Next.js API route instead of the webhook directly
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response from our API route
      const data = await response.json() as ChatResponse;

      // Log URLs in the reply received from API
      if (data.reply && typeof data.reply === 'string' && data.reply.includes('dropbox.com')) {
        const urlRegex = /https?:\/\/[^\s\)]+/g;
        const urls = data.reply.match(urlRegex);
        if (urls) {
          urls.forEach(url => {
            if (url.includes('rlkey=')) {
              const rlkeyMatch = /rlkey=([^&]+)/.exec(url);
              if (rlkeyMatch) {
                console.log(`[Frontend] URL in API response: ${url}`);
                console.log(`[Frontend] rlkey in API response: ${rlkeyMatch[1]}`);
              }
            }
          });
        }
      }

      // Create assistant message from the API response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply ?? 'I received your query and am processing it.',
        timestamp: new Date()
      };

      // Add the assistant's response to the messages
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Show user-friendly error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles sending a message from the ChatInput component
   * @param messageText - The message text from the user
   */
  const handleSendMessage = (messageText: string): void => {
    // Prevent empty messages or submission while loading
    if (!messageText.trim() || isLoading) return;

    // Create user message object
    const userMessage: Message = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);

    // Send message to API
    void sendMessage(userMessage.content);
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-[var(--light-bg)]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center float-in">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--cemac-orange)] to-[var(--cemac-orange-dark)] rounded-3xl mx-auto mb-6 glow-orange-md breathe"></div>
            <p className="text-[var(--text-secondary)] font-semibold text-display text-lg">Loading CEMAC Doors AI...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--light-bg)] relative overflow-hidden">
      {/* Animated gradient orbs - lighter for light mode */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[var(--cemac-orange)]/12 via-[var(--cemac-orange)]/6 to-transparent rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 15s ease-in-out infinite' }}></div>
      <div className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--cemac-orange-accent)]/8 via-[var(--cemac-orange)]/4 to-transparent rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 20s ease-in-out infinite reverse' }}></div>

      {/* Grid pattern overlay - subtle for light mode */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--light-border) 1px, transparent 1px), linear-gradient(90deg, var(--light-border) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
          <div className="space-y-6 mt-6" role="log" aria-live="polite">
            {/* Render all chat messages */}
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.content}
                isBot={message.role === 'assistant'}
                timestamp={message.timestamp ?? new Date()}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center w-full float-in">
                <div className="flex items-start gap-5 max-w-4xl w-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--cemac-orange)] to-[var(--cemac-orange-dark)] rounded-2xl flex items-center justify-center warm-shadow-lg glow-orange-sm relative">
                    <span className="text-white font-bold text-xl text-display">C</span>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[3px] border-[var(--light-bg)] breathe shadow-lg shadow-emerald-400/50"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[var(--light-surface)] backdrop-blur-xl rounded-3xl px-7 py-6 warm-shadow border border-[var(--light-border)] max-w-[90%]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-[var(--cemac-orange)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-[var(--cemac-orange)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-[var(--cemac-orange)] rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-[var(--text-secondary)] text-sm font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-[var(--light-surface)]/80 backdrop-blur-xl border-t border-[var(--light-border)] relative z-20">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
}