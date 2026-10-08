/**
 * URL Normalization Engine for THREATX
 * Follows RFC 3986 normalization guidelines
 */

export interface NormalizedUrlResult {
  original: string;
  normalized: string;
  isValid: boolean;
  error?: string;
}

export function normalizeUrl(input: string): NormalizedUrlResult {
  if (!input || typeof input !== 'string') {
    return { original: '', normalized: '', isValid: false, error: 'Empty or invalid URL input' };
  }

  let trimmed = input.trim();

  // Strip enclosing quotes or brackets often copied from messages
  trimmed = trimmed.replace(/^[<"']+|[>"']+$/g, '');

  // Add default protocol if missing
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    trimmed = 'http://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        original: input,
        normalized: '',
        isValid: false,
        error: `Unsupported scheme: ${parsed.protocol}. Only http:// and https:// are permitted.`,
      };
    }

    // Lowercase scheme & host
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();

    // Remove default ports
    if ((parsed.protocol === 'http:' && parsed.port === '80') || (parsed.protocol === 'https:' && parsed.port === '443')) {
      parsed.port = '';
    }

    // Decode unreserved percent-encoded octets (RFC 3986 section 2.3: ALPHA / DIGIT / "-" / "." / "_" / "~")
    let pathname = parsed.pathname;
    try {
      pathname = pathname.replace(/%([0-9A-Fa-f]{2})/g, (match, hex) => {
        const charCode = parseInt(hex, 16);
        // Unreserved characters: A-Z, a-z, 0-9, -, ., _, ~
        if (
          (charCode >= 0x41 && charCode <= 0x5a) ||
          (charCode >= 0x61 && charCode <= 0x7a) ||
          (charCode >= 0x30 && charCode <= 0x39) ||
          charCode === 0x2d ||
          charCode === 0x2e ||
          charCode === 0x5f ||
          charCode === 0x7e
        ) {
          return String.fromCharCode(charCode);
        }
        return match.toUpperCase();
      });
    } catch {
      // keep original on error
    }
    parsed.pathname = pathname;

    // Normalizing duplicate slashes in pathname (e.g. //path///to -> /path/to)
    parsed.pathname = parsed.pathname.replace(/\/{2,}/g, '/');

    // Remove empty fragment or hash if purely #
    if (parsed.hash === '#') {
      parsed.hash = '';
    }

    return {
      original: input,
      normalized: parsed.toString(),
      isValid: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid URL structure';
    return {
      original: input,
      normalized: '',
      isValid: false,
      error: errorMsg,
    };
  }
}
