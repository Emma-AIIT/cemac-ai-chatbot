import type { NextRequest } from 'next/server';

/**
 * Extracts the real client IP address from the request
 * Handles various proxy headers in the correct priority order
 */
export function extractClientIP(request: NextRequest): string {
  // Priority order for IP extraction (handles Vercel/serverless)
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'x-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0]?.trim();
      if (ip && isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Fallback if no IP found in headers
  return '0.0.0.0';
}

/**
 * Validates if a string is a valid IPv4 or IPv6 address
 */
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-f:]+:+)+[0-9a-f]+$/i;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Check if IP is localhost/private (for development)
 */
export function isLocalIP(ip: string): boolean {
  return ip === '::1' ||
         ip === '127.0.0.1' ||
         ip.startsWith('192.168.') ||
         ip.startsWith('10.') ||
         ip.startsWith('172.16.') ||
         ip === '0.0.0.0';
}
