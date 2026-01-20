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
  // Log raw content to see what URLs are in the markdown before parsing
  if (content && typeof content === 'string' && content.includes('dropbox.com')) {
    const urlRegex = /https?:\/\/[^\s\)]+/g;
    const urls = content.match(urlRegex);
    if (urls) {
      urls.forEach(url => {
        if (url.includes('rlkey=')) {
          const rlkeyMatch = /rlkey=([^&]+)/.exec(url);
          if (rlkeyMatch) {
            console.log(`[MessageFormatter] Raw content URL: ${url}`);
            console.log(`[MessageFormatter] rlkey in raw content: ${rlkeyMatch[1]}`);
          }
        }
      });
    }
  }

  return (
    <div className="markdown-content text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text styling
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--cemac-orange-dark)]">
              {children}
            </strong>
          ),

          // List styling with custom bullets
          ul: ({ children }) => (
            <ul className="space-y-2 my-3">
              {children}
            </ul>
          ),

          // List item styling - single bullet only
          li: ({ children }) => (
            <li className="flex gap-2.5 items-start">
              <span className="text-[var(--cemac-orange)] font-bold flex-shrink-0 text-xs mt-1.5">●</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Paragraph styling with proper spacing
          p: ({ children }) => (
            <p className="my-2 leading-relaxed text-[var(--text-primary)]">
              {children}
            </p>
          ),

          // Heading styling
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2 mt-4">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2 mt-3">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 mt-2">
              {children}
            </h3>
          ),

          // Code styling
          code: ({ children }) => (
            <code className="bg-[var(--light-surface-dark)] text-[var(--cemac-orange-dark)] px-2 py-1 rounded text-sm font-mono border border-[var(--light-border)]">
              {children}
            </code>
          ),

          // Block code styling
          pre: ({ children }) => (
            <pre className="bg-[var(--light-surface-dark)] p-3 rounded-lg overflow-x-auto my-3 border border-[var(--light-border)]">
              {children}
            </pre>
          ),

          // Emphasis styling
          em: ({ children }) => (
            <em className="italic text-[var(--text-secondary)]">
              {children}
            </em>
          ),

          // Strikethrough styling
          del: ({ children }) => (
            <del className="line-through text-[var(--text-muted)]">
              {children}
            </del>
          ),

          // Hyperlink styling
          a: ({ href, children }) => {
            // Log Dropbox URLs to debug rlkey changes
            if (href && typeof href === 'string' && href.includes('dropbox.com') && href.includes('rlkey=')) {
              const rlkeyMatch = /rlkey=([^&]+)/.exec(href);
              if (rlkeyMatch) {
                console.log(`[MessageFormatter] Dropbox link href: ${href}`);
                console.log(`[MessageFormatter] rlkey in href: ${rlkeyMatch[1]}`);
              }
            }
            
            return (
              <a
                href={href}
                className="text-[var(--cemac-orange)] underline hover:text-[var(--cemac-orange-dark)] transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
