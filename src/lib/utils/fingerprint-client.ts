'use client';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<string> | null = null;

/**
 * Generate browser fingerprint on client-side
 * Returns a consistent hash for the same browser/device
 */
export async function generateFingerprint(): Promise<string> {
  if (!fpPromise) {
    fpPromise = (async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    })();
  }
  return fpPromise;
}

/**
 * Get stored fingerprint from localStorage or generate new one
 */
export async function getOrCreateFingerprint(): Promise<string> {
  const stored = localStorage.getItem('cemac_fingerprint');
  if (stored) return stored;

  const fingerprint = await generateFingerprint();
  localStorage.setItem('cemac_fingerprint', fingerprint);
  return fingerprint;
}
