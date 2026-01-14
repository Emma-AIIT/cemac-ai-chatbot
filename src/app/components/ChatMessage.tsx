'use client';

import React, { useState, useEffect } from 'react';
import { MessageFormatter } from './MessageFormatter';

/**
 * Formats a timestamp into relative time display
 */
const formatRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  
  // For older messages, show the actual date
  return timestamp.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Client-side only timestamp component to avoid hydration mismatches
 */
const Timestamp: React.FC<{ timestamp: Date }> = ({ timestamp }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">--:--</span>;
  }

  return (
    <span>
      {formatRelativeTime(timestamp)}
    </span>
  );
};

/**
 * Props interface for ChatMessage component
 */
interface ChatMessageProps {
  /** The message content to display */
  message: string;
  /** Whether this is a bot message (true) or user message (false) */
  isBot: boolean;
  /** The timestamp when the message was sent */
  timestamp: Date;
}

/**
 * ChatMessage Component
 * 
 * Displays a single chat message with proper styling, avatar, and timestamp.
 * Features clear visual distinction between user and bot messages with
 * professional spacing and typography.
 */
export const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex justify-center w-full group ${isBot ? 'slide-in-left' : 'slide-in-right'}`}>
      <div className={`flex items-start gap-5 max-w-4xl w-full ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        {isBot ? (
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--cemac-orange)] to-[var(--cemac-orange-dark)] rounded-2xl flex items-center justify-center warm-shadow-lg glow-orange-sm group-hover:glow-orange-md relative transition-all duration-300">
            <span className="text-white font-bold text-xl text-display">C</span>
            {/* Online status indicator with glow */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[3px] border-[var(--light-bg)] pulse-animation shadow-lg shadow-emerald-400/50"></div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--light-surface-dark)] to-[var(--light-border)] rounded-2xl flex items-center justify-center warm-shadow-lg border border-[var(--light-border)]">
            <span className="text-[var(--text-secondary)] font-bold text-xl text-display">U</span>
          </div>
        )}

        {/* Message Bubble */}
        <div className={`flex-1 ${isBot ? 'flex flex-col items-start' : 'flex flex-col items-end'}`}>
          <div
            className={`rounded-3xl max-w-[90%] transition-all duration-300 relative ${
              isBot
                ? 'bg-[var(--light-surface)] backdrop-blur-xl border border-[var(--light-border)] warm-shadow group-hover:warm-shadow-lg px-7 py-6'
                : 'bg-gradient-to-br from-[var(--cemac-orange)] to-[var(--cemac-orange-dark)] warm-shadow-lg group-hover:glow-orange-md px-8 py-6'
            }`}
          >
            {/* Subtle accent line for bot messages */}
            {isBot && (
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[var(--cemac-orange)]/20 to-transparent rounded-full"></div>
            )}

            {isBot ? (
              <MessageFormatter content={message} />
            ) : (
              <p className="text-[15.5px] leading-relaxed whitespace-pre-wrap text-white font-medium">
                {message}
              </p>
            )}
          </div>

          {/* Timestamp */}
          {timestamp && (
            <div className={`mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isBot ? 'text-left pl-2' : 'text-right pr-2'}`}>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">
                <Timestamp timestamp={timestamp} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
