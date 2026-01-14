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
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-600">Loading CEMAC Doors AI...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
          <div className="space-y-8 mt-8" role="log" aria-live="polite">
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
              <div className="flex justify-center w-full message-slide-up">
                <div className="flex items-start gap-4 max-w-4xl w-full">
                  <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg relative">
                    <span className="text-white font-bold text-xl">C</span>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white pulse-animation"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-3xl px-6 py-5 shadow-md border border-gray-100 max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-gray-600 text-sm">CEMAC is typing...</span>
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
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
}