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
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          {/* Input container */}
          <div className="flex-1 relative group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about doors, hardware, seals, or project solutions..."
              disabled={disabled}
              aria-label="Type your message"
              className="w-full min-h-[64px] px-7 py-4 bg-[var(--light-surface)] backdrop-blur-xl rounded-2xl border-2 border-[var(--light-border)] focus:border-[var(--cemac-orange)] focus:outline-none outline-none transition-all duration-300 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed pr-12 warm-shadow hover:border-[var(--cemac-orange)]/50 focus:warm-shadow-lg font-medium focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)]"
            />
            {/* MessageCircle icon with color change on focus */}
            <MessageCircle className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none transition-all duration-300 group-focus-within:text-[var(--cemac-orange)]" />
          </div>

          {/* Send button with glow */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            aria-label="Send message"
            className="w-[64px] h-[64px] bg-gradient-to-br from-[var(--cemac-orange)] to-[var(--cemac-orange-dark)] text-white rounded-2xl hover:scale-105 active:scale-95 transform transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center flex-shrink-0 warm-shadow-lg hover:glow-orange-md relative overflow-hidden group/btn"
          >
            {/* Animated shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700 -translate-x-full group-hover/btn:translate-x-full" style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}></div>

            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <Send className="w-5 h-5 relative z-10" />
            )}
          </button>
        </form>

        {/* Helpful hint text */}
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-4 font-medium opacity-50">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--light-surface-dark)] border border-[var(--light-border)] text-[var(--text-secondary)]">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 rounded bg-[var(--light-surface-dark)] border border-[var(--light-border)] text-[var(--text-secondary)]">Esc</kbd> to clear
        </p>
      </div>
    </div>
  );
};
