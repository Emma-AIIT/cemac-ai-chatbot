'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Props interface for MessageFormatter component
 */
interface MessageFormatterProps {
  /** The message content to format as markdown */
  content: string;
}

/**
 * MessageFormatter Component
 * 
 * Renders message content with markdown formatting using react-markdown.
 * Provides custom styling for technical specifications, lists, and emphasis.
 * Uses GitHub Flavored Markdown for enhanced formatting capabilities.
 */
export const MessageFormatter = ({ content }: MessageFormatterProps) => {
  return (
    <div className="markdown-content text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text styling
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          
          // List styling with custom bullets
          ul: ({ children }) => (
            <ul className="space-y-2 my-3">
              {children}
            </ul>
          ),
          
          // List item styling
          li: ({ children }) => (
            <li className="flex gap-2 items-start">
              <span className="text-orange-500 font-bold flex-shrink-0 mt-1">•</span>
              <span>{children}</span>
            </li>
          ),
          
          // Paragraph styling with proper spacing
          p: ({ children }) => (
            <p className="my-2 leading-relaxed">
              {children}
            </p>
          ),
          
          // Heading styling
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-2 mt-4">
              {children}
            </h1>
          ),
          
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-3">
              {children}
            </h2>
          ),
          
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-900 mb-1 mt-2">
              {children}
            </h3>
          ),
          
          // Code styling
          code: ({ children }) => (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
              {children}
            </code>
          ),
          
          // Block code styling
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3">
              {children}
            </pre>
          ),
          
          // Emphasis styling
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          
          // Strikethrough styling
          del: ({ children }) => (
            <del className="line-through text-gray-500">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
