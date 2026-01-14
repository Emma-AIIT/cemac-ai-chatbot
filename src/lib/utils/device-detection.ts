import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  browser_name: string | null;
  browser_version: string | null;
  os_name: string | null;
  device_type: 'mobile' | 'tablet' | 'desktop' | null;
}

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser_name: result.browser.name ?? null,
    browser_version: result.browser.version ?? null,
    os_name: result.os.name ?? null,
    device_type: detectDeviceType(result.device.type),
  };
}

function detectDeviceType(
  type: string | undefined
): 'mobile' | 'tablet' | 'desktop' | null {
  if (!type) return 'desktop';

  switch (type.toLowerCase()) {
    case 'mobile':
      return 'mobile';
    case 'tablet':
      return 'tablet';
    default:
      return 'desktop';
  }
}
