import { NormalizedUrlDetails } from '@/types/investigation';

/**
 * Calculates Shannon entropy of a string
 * Higher entropy indicates randomness (e.g. DGA domains or encoded token payloads)
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;

  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  const len = str.length;

  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return Number(entropy.toFixed(2));
}

/**
 * Common multi-part TLDs (e.g. co.uk, com.br, gov.uk)
 */
const MULTI_PART_TLDS = new Set([
  'co.uk', 'gov.uk', 'ac.uk', 'org.uk',
  'com.au', 'net.au', 'gov.au',
  'co.nz', 'org.nz',
  'co.jp', 'ne.jp',
  'com.br', 'gov.br',
  'co.in', 'gov.in', 'net.in',
  'com.cn', 'net.cn',
]);

/**
 * IPv4 Regex
 */
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * IPv6 Check
 */
function isIPv6(hostname: string): boolean {
  const clean = hostname.replace(/^\[|\]$/g, '');
  return clean.includes(':');
}

/**
 * Parses normalized URL into structured security metadata
 */
export function parseUrl(rawUrl: string, normalizedUrl: string): NormalizedUrlDetails {
  let parsed: URL;
  try {
    const candidate = normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')
      ? normalizedUrl
      : `https://${normalizedUrl}`;
    parsed = new URL(candidate);
  } catch {
    // Fallback URL construct if candidate is completely malformed
    parsed = new URL('https://unverified-vector.internal');
  }

  const hostname = parsed.hostname || 'unverified-target';
  const isIpv4 = IPV4_REGEX.test(hostname);
  const isIpv6 = isIPv6(hostname);
  const isIpAddress = isIpv4 || isIpv6;

  // Domain decomposition
  const hostParts = hostname.split('.');
  let tld = '';
  let registrableDomain = hostname;
  const subdomains: string[] = [];

  if (isIpAddress) {
    tld = 'ip';
    registrableDomain = hostname;
  } else if (hostParts.length >= 2) {
    const lastTwo = hostParts.slice(-2).join('.');
    if (MULTI_PART_TLDS.has(lastTwo) && hostParts.length >= 3) {
      tld = lastTwo;
      registrableDomain = hostParts.slice(-3).join('.');
      subdomains.push(...hostParts.slice(0, -3));
    } else {
      tld = hostParts[hostParts.length - 1];
      registrableDomain = hostParts.slice(-2).join('.');
      subdomains.push(...hostParts.slice(0, -2));
    }
  }

  // Punycode / IDN homograph check
  const isPunycode = hostname.includes('xn--');

  // Suspicious non-standard ports
  const port = parsed.port || null;
  const standardPorts = new Set(['80', '443', '']);
  const hasSuspiciousPort = port !== null && !standardPorts.has(port);

  // Shannon entropy
  const entropy = calculateShannonEntropy(hostname);

  return {
    rawUrl,
    normalizedUrl,
    protocol: parsed.protocol.replace(':', ''),
    hostname,
    port,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    registrableDomain,
    subdomains,
    tld,
    isIpAddress,
    isPunycode,
    hasSuspiciousPort,
    entropy,
  };
}
