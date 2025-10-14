'use client';

import React, { useState } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';

/**
 * Props interface for ChatInput component
 */
interface ChatInputProps {
  /** Callback function called when user sends a message */
  onSend: (message: string) => void;
  /** Whether the input should be disabled (e.g., during loading) */
  disabled?: boolean;
}

/**
 * ChatInput Component
 * 
 * A polished input component for sending chat messages.
 * Features a clean input field with a send button, proper focus states,
 * and smooth interactions following professional UI/UX principles.
 */
export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  /**
   * Handles keyboard events for the input field
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setMessage('');
    }
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 shadow-md">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          {/* Input container */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about doors, hardware, seals, or project solutions..."
              disabled={disabled}
              aria-label="Type your message"
              className="w-full min-h-[56px] px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed pr-12"
            />
            {/* MessageCircle icon */}
            <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            aria-label="Send message"
            className="w-14 h-14 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center flex-shrink-0"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
