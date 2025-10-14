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
    <div className="flex justify-center w-full group message-slide-up">
      <div className={`flex items-start gap-4 max-w-4xl w-full ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        {isBot ? (
          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg relative">
            <span className="text-white font-bold text-xl">C</span>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white pulse-animation"></div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">U</span>
          </div>
        )}

        {/* Message Bubble */}
        <div className={`flex-1 ${isBot ? 'flex flex-col items-start' : 'flex flex-col items-end'}`}>
          <div
            className={`rounded-3xl max-w-[85%] transition-shadow duration-200 ${
              isBot
                ? 'bg-white border border-gray-100 shadow-md hover:shadow-lg px-6 py-5'
                : 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-lg px-12 py-8'
            }`}
            style={!isBot ? { padding: '30px 40px' } : {}}
          >
            {isBot ? (
              <MessageFormatter content={message} />
            ) : (
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-white">
                {message}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          {timestamp && (
            <div className={`mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isBot ? 'text-left' : 'text-right'}`}>
              <span className="text-[11px] text-gray-400 font-medium">
                <Timestamp timestamp={timestamp} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
