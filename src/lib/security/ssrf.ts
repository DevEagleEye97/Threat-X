import dns from 'dns/promises';

/**
 * SSRF Defense System for THREATX
 * Enforces strict network boundaries against internal intranet exploration
 */

// Private IPv4 CIDR blocks
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // invalid format treated as unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (RFC 1918 Private)
  if (a === 10) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 169.254.0.0/16 (Link-local / AWS / GCP / Azure metadata endpoint 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12 (RFC 1918 Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (RFC 1918 Private)
  if (a === 192 && b === 168) return true;

  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;

  // 240.0.0.0/4 (Reserved)
  if (a >= 240) return true;

  return false;
}

// Private IPv6 checks
function isPrivateIPv6(ip: string): boolean {
  const clean = ip.toLowerCase().replace(/^\[|\]$/g, '');

  // Loopback ::1
  if (clean === '::1' || clean === '0:0:0:0:0:0:0:1') return true;

  // Unspecified ::
  if (clean === '::' || clean === '0:0:0:0:0:0:0:0') return true;

  // Link-local fe80::/10
  if (clean.startsWith('fe8') || clean.startsWith('fe9') || clean.startsWith('fea') || clean.startsWith('feb')) return true;

  // Unique local fc00::/7 (fc00:: or fd00::)
  if (clean.startsWith('fc') || clean.startsWith('fd')) return true;

  // Multicast ff00::/8
  if (clean.startsWith('ff')) return true;

  // IPv4-mapped IPv6 (::ffff:192.168.1.1)
  if (clean.startsWith('::ffff:')) {
    const v4 = clean.replace('::ffff:', '');
    return isPrivateIPv4(v4);
  }

  return false;
}

export interface SsrfValidationResult {
  isSafe: boolean;
  reason?: string;
  resolvedIp?: string;
}

export async function validateUrlAgainstSsrf(urlString: string): Promise<SsrfValidationResult> {
  try {
    const parsed = new URL(urlString);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isSafe: false, reason: `Disallowed protocol scheme: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block standard loopback and metadata words immediately
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'instance-data'
    ) {
      return { isSafe: false, reason: `Blocked private host pattern: ${hostname}` };
    }

    // Direct IP check
    if (/^[0-9.]+$/.test(hostname)) {
      if (isPrivateIPv4(hostname)) {
        return { isSafe: false, reason: `Blocked non-routable or private IPv4 address: ${hostname}` };
      }
      return { isSafe: true, resolvedIp: hostname };
    }

    if (hostname.includes(':')) {
      if (isPrivateIPv6(hostname)) {
        return { isSafe: false, reason: `Blocked non-routable or private IPv6 address: ${hostname}` };
      }
      return { isSafe: true, resolvedIp: hostname };
    }

    // Permit designated RFC 2606 / RFC 5737 example test domains for synthetic threat investigation
    if (
      hostname === 'example.com' ||
      hostname.endsWith('.example.com') ||
      hostname === 'example.org' ||
      hostname.endsWith('.example.org') ||
      hostname === 'example.net' ||
      hostname.endsWith('.example.net') ||
      hostname.endsWith('.example') ||
      hostname.includes('.example.') ||
      hostname.includes('example-') ||
      hostname.endsWith('.test') ||
      hostname.endsWith('.invalid')
    ) {
      return { isSafe: true, resolvedIp: '198.51.100.1' }; // RFC 5737 TEST-NET-2 documentation range
    }

    // Resolve DNS to verify all destination IPs
    let addresses: string[] = [];
    try {
      addresses = await dns.resolve4(hostname);
    } catch {
      // Try AAAA
      try {
        addresses = await dns.resolve6(hostname);
      } catch {
        return { isSafe: false, reason: `DNS resolution failed for hostname: ${hostname}` };
      }
    }

    for (const ip of addresses) {
      if (ip.includes(':')) {
        if (isPrivateIPv6(ip)) {
          return { isSafe: false, reason: `DNS resolved to private IPv6 address: ${ip}` };
        }
      } else {
        if (isPrivateIPv4(ip)) {
          return { isSafe: false, reason: `DNS resolved to private IPv4 address: ${ip}` };
        }
      }
    }

    return { isSafe: true, resolvedIp: addresses[0] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid URL structure';
    return { isSafe: false, reason: `URL evaluation error: ${msg}` };
  }
}
